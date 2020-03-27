const express = require('express')
const app = express()
const cors = require('cors')

app.use(express.json())
app.use(cors())
app.use(express.static('build'))

const requestLogger = (request, response, next) => {
    console.log('Method:', request.method)
    console.log('Path:  ', request.path)
    console.log('Body:  ', request.body)
    console.log('---')
    next()
}

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

app.use(requestLogger)

let notes = [
    {
        "id": 1,
        "content": "HTML is easy",
        "date": "2019-05-30T17:30:31.098Z",
        "important": true
    },
    {
        "id": 2,
        "content": "Browser can execute only Javascript",
        "date": "2019-05-30T18:39:34.091Z",
        "important": true
    },
    {
        "id": 3,
        "content": "GET and POST are the most important methods of HTTP protocol",
        "date": "2019-05-30T19:20:14.298Z",
        "important": true
    },
    {
        "content": "this is a post",
        "date": "2020-03-26T04:46:34.511Z",
        "important": false,
        "id": 4
    },
    {
        "content": "a",
        "date": "2020-03-26T04:50:39.981Z",
        "important": false,
        "id": 5
    },
    {
        "content": "hi",
        "date": "2020-03-26T23:23:52.022Z",
        "important": false,
        "id": 6
    }
]

const generateId = () => {
    const maxId = notes.length > 0 ? Math.max(...notes.map(n => n.id)) : 0
    return maxId + 1
}

app.get('/', (request, response) => {
    response.send('<h1>Hello World</h1>')
})

app.get('/api/notes', (request, response) => {
    response.json(notes)
})

app.get('/api/notes/:id', (request, response) => {
    const id = Number(request.params.id)
    const note = notes.find(note => note.id === id)

    if (note) {
        response.json(note)
    } else {
        response.status(404).end()
    }
})

app.delete('/api/notes/:id', (request, response) => {
    const id = Number(request.params.id)
    notes = notes.filter(note => note.id !== id)
    response.status(204).end()
})

app.post('/api/notes', (request, response) => {
    const body = request.body

    if (!body.content) {
        return response.status(400).json({
            error: 'content missing'
        })
    }

    const note = {
        content: body.content,
        important: body.important || false,
        date: new Date(),
        id: generateId()
    }

    notes = notes.concat(note)
    response.json(note)
})

app.use(unknownEndpoint)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})