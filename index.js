import express from "express";
import morgan from "morgan";
import Person from "./models/person.js";
import persons from "./persons.js";


const configureLogging = (app) => {
    morgan.token('resp', (req,  _) => JSON.stringify(req.body));
    app.use(morgan((tokens, req, res) => {
        return [
            tokens.method(req, res),
            tokens.url(req, res),
            tokens.status(req, res),
            tokens.res(req, res, 'content-length'), '-',
            tokens['response-time'](req, res), 'ms',
            tokens['resp'](req)
        ].join(' ');
    }));
};


const app = express();
const PORT = process.env.PORT || 8090;
app.use(express.json());
app.use(express.static('dist'));
configureLogging(app);


let data = persons;

app.get('/info', (req, res) => {
    let html = `<div><div>Phonebook has info for ${data.length} people</div> <div>${new Date().toUTCString()}</div></div>`;
    res.send(html);
});

app.get('/api/persons', (req, resp) => {
    Person.find({}).then(found => {
        resp.json(found);
    });
});

app.get('/api/persons/:id', (req, res) => {
    let id = req.params.id;
    const queried = data.find(p => p.id === id);
    if (!queried) {
        res.statusMessage = `There is no persons with id = ${id}`;
        res.status(404).end();
    }
    res.json(queried);
});

app.delete('/api/persons/:id', (req, res) => {
    let id = req.params.id;
    let index = data.findIndex(p => p.id === id);

    if (index === -1) {
        res.statusMessage = `There is no persons with id = ${id}`;
        return res.status(404).end();
    }

    data = data.toSpliced(index, 1);
    res.status(204).end();
});

app.post('/api/persons', (req, res) => {
    const body = req.body;

    if (Object.keys(body).length > 2)
        return res.status(400).json({
            error: 'Not correct body format'
        });

    if (!body.name || !body['number'])
        return res.status(400).json({
            error: 'Full data is not provided'
        });

    Person.exists({ name: body.name })
        .then(exists => {
            if (exists)
                return res.status(400).json({
                    error: 'name must be unique'
                });

            const person = Person({
                ...body
            });

            person.save().then(saved => {
                res.json(saved);
            });
        });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});