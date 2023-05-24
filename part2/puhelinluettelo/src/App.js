import { useState, useEffect } from 'react'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import personService from './services/persons'
import './index.css'

const App = () => {

  const [persons, setPersons] = useState([])

  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [newFilter, setNewFilter] = useState('')
  const [message, setMessage] = useState(null)
  const [greenMessage, setGreenMessage] = useState(true)

  const hook = () => {
    personService
      .getAll()
      .then(returnedPerson => {
        setPersons(returnedPerson)
      })
  }

  useEffect(hook, [])

console
  const addPerson = (event) => {
    event.preventDefault()
    if (persons.some(person => person.name === newName)) {
      updatePerson(persons.find(person => person.name === newName))
      return
    }
    const personObject = {
      name: newName,
      number: newNumber,
    }

    personService
      .create(personObject)
      .then(returnedPerson => {
        setPersons(persons.concat(returnedPerson))
        setNewName('')
        setNewNumber('')
        setGreenMessage(true)
        setMessage(`Added ${returnedPerson.name}`)
        setTimeout(() => {
          setMessage(null)
        }, 3000)
      })
      .catch(error => {
        // Print the error message from the backend
        setGreenMessage(false)
        setMessage(error.response.data.error)
        setTimeout(() => {
          setMessage(null)
        }, 3000)
      })
  }

  // Remove person from phonebook and server, and display message whether it was successful or not
  const removePerson = (id) => {

    const removedPerson = persons.find(person => person._id === id)

    personService.remove(id)
      .then( () => {
        setGreenMessage(true)
        setPersons(persons.filter(person => person._id !== id))
        setMessage(`Removed ${removedPerson.name}`)
        setTimeout(() => {
          setMessage(null)
        }, 3000)
      })
      .catch( () => {
        setGreenMessage(false)
        setMessage(`Information of ${removedPerson.name} has already been removed from server`)
        setPersons(persons.filter(person => person._id !== id))
        setTimeout(() => {
          setMessage(null)
        }, 3000)
      })
  }

  const updatePerson = (oldPerson) => {
    const changedPerson = { ...oldPerson, number: newNumber }

    personService
      .update(oldPerson._id, changedPerson)
      .then(returnedPerson => {
        setPersons(persons.map(person => person._id !== oldPerson._id ? person : returnedPerson))
        setNewName('')
        setNewNumber('')
        setGreenMessage(true)
        setMessage(`Updated ${oldPerson.name}`)
        setTimeout(() => {
          setMessage(null)
        }
        , 3000)
      })
      .catch(error => {
        console.log(error)
        setGreenMessage(false)
        setMessage(`Information of ${oldPerson.name} has already been removed from server`)
        setPersons(persons.filter(person => person._id !== oldPerson._id))
        setTimeout(() => {
          setMessage(null)
        }
        , 3000)
      })


  }

  const Notification = ({ message }) => {
    if (message === null) {
      return null
    }
    const notificationClass = greenMessage ? 'message' : 'error'

    return(
      <div className={notificationClass}>
        {message}
      </div>
    )
  }

  const handlePersonChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleFilterChange = (event) => {
    setNewFilter(event.target.value)
  }

  const personsToShow = persons.filter(person => person.name.toLowerCase().includes(newFilter.toLowerCase()))

  return (
    <div>
      <h2>Phonebook</h2>

      <Notification message={message} />

      <Filter filter={newFilter} handleFilterChange={handleFilterChange} />

      <h3>Add a new</h3>

      <PersonForm
        addPerson={addPerson}
        handlePersonChange={handlePersonChange}
        newName={newName}
        handleNumberChange={handleNumberChange}
        newNumber={newNumber}
      />

      <h3>Numbers</h3>

      <Persons personsToShow={personsToShow} removePerson={removePerson} />

    </div>
  )

}

export default App
