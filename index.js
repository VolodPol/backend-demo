let persons = [
    {
        "id": "1",
        "name": "Arto Hellas",
        "number": "040-123456"
    },
    {
        "id": "2",
        "name": "Ada Lovelace",
        "number": "39-44-5323523"
    },
    {
        "id": "3",
        "name": "Dan Abramov",
        "number": "12-43-234345"
    },
    {
        "id": "4",
        "name": "Mary Poppendieck",
        "number": "39-23-6423122"
    }
];

const express = require('express');
const app = express();

const PORT = 8090;



app.get('/info', (req, res) => {
    let html = `<div><div>Phonebook has info for ${persons.length} people</div> <div>${new Date().toUTCString()}</div></div>`;
    res.send(html);
});

app.get('/api/persons', (req, resp) => {
    resp.json(persons);
});

app.get('/api/persons/:id', (req, res) => {
    let id = req.params.id;
    const queried = persons.find(p => p.id === id);
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

    persons = persons.toSpliced(index, 1);
    res.status(204).end();
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});