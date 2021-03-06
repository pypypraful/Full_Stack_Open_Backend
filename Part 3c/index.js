require('dotenv').config()
const Person = require('./models/phonebook')


const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')


app.use(cors())
app.use(express.static('build'))
app.use(bodyParser.json())


app.use(morgan('tiny'))


app.get('/api/persons',(req,res)=>{
  Person.find({}).then(phonebook => {
    res.json(phonebook.map(person =>person.toJSON()))
    //mongoose.connection.close()
  }).catch(error => {
    console.log(error)
    res.status(404).end()
  })
})

app.get('/api/persons/:id',(request, response)=>{
  const id = request.params.id
  Person.findById(id).then(person => {
    if (person){
      response.json(person.toJSON())
  }
  else{
    response.status(404).end()
  }
  }).catch(error =>{
    console.log(error)
    response.status(400).send({error:'malformatted Id'}).end()
  })
})

app.put('/api/persons/:id',(request, response)=>{
  const person = {
    name: request.body.name,
    number: request.body.number
  }
  Person.findByIdAndUpdate(request.params.id,person,{new:true})
  .then(person=>response.json(person.toJSON()).status(200).end())
  .catch(error=>next(error))
})


app.delete('/api/persons/:id', (req,res)=>{
  const id = req.params.id
  Person.deleteOne({_id:id}).then(response => {
    if (response.deletedCount==0){
      res.status(401).end()
    }
    else{
    res.status(200).end()
  }
 }).catch(error=>console.log(error))
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
  else{
    const person = new Person({
      name: body.name,
      number: body.number
    })

    person.save().then(response => {
      res.json(person.toJSON())
      //mongoose.connection.close()
    }).catch(error=>{
      console.log(error)
      res.status(404).end()
    })
  }
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({error:'Unknown Endpoint'})
}
app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.error(err.message)
  if (error.name ==='CastError' && error.kind === 'ObjectId'){
    return response.status(400).send({error: 'malformatted Id'})
  }
  next(error)
}
app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, ()=>{
  console.log(`Server running on port ${PORT}`)
})
