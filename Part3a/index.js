const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')

app.use(bodyParser.json())

let phonebook = [
  {
   id: 1,
   name: "Arto Feldar",
   number: "987654321"
 }
]

app.use(morgan('tiny'))

app.get('/api/persons',(req,res)=>{
  res.json(phonebook)
})

app.get('/api/persons/:id',(request, response)=>{
  const id = Number(request.params.id)
  const person = phonebook.find(person => person.id === id)

  if (person) {
    response.json(person)
  } else{
    response.status(404).end()
  }
})


app.delete('/api/persons/:id', (req,res)=>{
  const id = Number(req.params.id)
  let person = phonebook.filter(person => person.id !== id)
  res.status(204).end()
})

app.post('/api/persons',(req,res) =>{
  const body = req.body

  if(!body.name) {
    return res.status(400).json({
      error: 'name missing'
    })
  }
  else if(!body.number) {
    return res.status(400).json({
      error: 'number missing'
    })
  }
  else if(phonebook.filter(person=> person.name===body.name).length>0) {
    return res.status(400).json({
      error: 'duplicate name'
    })
  }
  else{
    const person = {
      id: Math.floor(Math.random()*1000000000),
      name: body.name,
      number: body.number
    }

    phonebook = phonebook.concat(person)

    res.json(person)
  }
})


app.get('/info', (req,res)=>{
  var date = new Date()
  let string = `<p>Phonebook has info for ${phonebook.length} people</p><p>${date}</p>`
  res.send(string)
})

const PORT = 3001
app.listen(PORT, ()=>{
  console.log(`Server running on port ${PORT}`)
})
