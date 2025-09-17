import persons from "./persons.js";
import { supplyId } from "./util.js";
import express from "express";


const app = express();
app.use(express.json());
const PORT = 8090;


let data = persons;

app.get('/info', (req, res) => {
    let html = `<div><div>Phonebook has info for ${persons.length} people</div> <div>${new Date().toUTCString()}</div></div>`;
    res.send(html);
});

app.get('/api/persons', (req, resp) => {
    resp.json(data);
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
    let index = persons.findIndex(p => p.id === id);

    if (index === -1) {
        res.statusMessage = `There is no persons with id = ${id}`;
        return res.status(404).end();
    }

    data = data.toSpliced(index, 1);
    res.status(204).end();
});

app.post('/api/persons', (req, res) => {
    const body = req.body;

    if (!body.name || !body['number']) {
        return res.status(400).json({
            error: 'Full data is not provided'
        });
    }

    const person = {
        id: supplyId().toString(),
        ...body
    };

    data = data.concat(person);
    res.json(person);
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});