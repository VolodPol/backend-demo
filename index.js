import express from 'express';
import Person from './models/person.js';
import { configureLogger } from './logger/logger.js';
import { errorHandler, ERRORS } from './errors/handler.js';


const app = express();
const PORT = process.env.PORT || 8090;
app.use(express.json());
app.use(express.static('dist'));
app.use(configureLogger());

app.get('/info', (req, res, next) => {
    Person.countDocuments({})
        .then(count => {
            res.send(`<div><div>Phonebook has info for ${count} people</div> <div>${new Date().toUTCString()}</div></div>`);
        }).catch(error => next(error));
});

app.get('/api/persons', (req, resp, next) => {
    Person.find({}).then(found => {
        resp.json(found);
    }).catch(error => next(error));
});

app.get('/api/persons/:id', (req, res, next) => {
    const id = req.params.id;
    Person.findById(id, null, {})
        .then(found => {
            if (found)
                return res.json(found);

            next({ name: ERRORS.NOT_FOUND });
        }).catch(error => next(error));
});

app.delete('/api/persons/:id', (req, res, next) => {
    const id = req.params.id;
    Person.findByIdAndDelete(id, {})
        .then(found => {
            if (!found) {
                next({ name: ERRORS.NOT_FOUND });
                return;
            }
            res.status(204).end();
        }).catch(error => next(error));
});

app.post('/api/persons', (req, res, next) => {
    const body = req.body;

    if (Object.keys(body).length > 2) {
        next({ name: ERRORS.INCORRECT_BODY });
        return;
    }

    if (!body.name || !body['number']) {
        next({ name: ERRORS.PARTIAL_PAYLOAD });
        return;
    }

    Person.exists({ name: body.name })
        .then(exists => {
            if (exists) {
                next({ name: ERRORS.NOT_UNIQUE });
                return;
            }

            const person = Person({
                ...body
            });

            person.save().then(saved => {
                res.json(saved);
            }).catch(error => next(error));

        }).catch(error => next(error));
});

app.put('/api/persons/:id', (req, res, next) => {
    const id = req.params.id;
    Person.findById(id, null, {})
        .then(found => {
            if (!found) {
                next({ name: ERRORS.NOT_FOUND });
                return;
            }
            const { number } = req.body;
            found.number = number;

            return found.save().then(updated => {
                res.json(updated);
            }).catch(error => next(error));
        }).catch(error => next(error));
})

app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});