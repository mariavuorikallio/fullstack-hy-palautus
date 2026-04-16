import { useState, useEffect } from 'react'
import personService from './services/persons'
import Notification from './components/Notification'

const Persons = ({ personsToShow, removePerson }) => (
  <div>
    {personsToShow.map(person => (
      <p key={person.id}>
        {person.name} {person.number} {' '}
        <button onClick={() => removePerson(person.id)}>delete</button>
      </p>
    ))}
  </div>
)

const Filter = ({ filter, handleFilterChange }) => {
  return (
    <div>
      filter shown with <input value={filter} onChange={handleFilterChange} />
    </div>
  )
}

const PersonForm = ({ AddName, newName, handleNameChange, newNumber, handleNumberChange }) => {
  return (
    <form onSubmit={AddName}>
      <div>
        name: <input value={newName} onChange={handleNameChange} />
        </div>
      <div>
        number: <input value={newNumber} onChange={handleNumberChange} />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  )
}

const App = () => {
  const [persons, setPersons] = useState([]) 

  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [infoMessage, setInfoMessage] = useState(null)

    useEffect(() => {
    personService.getAll().then((initialPersons) => {
      console.log('promise fulfilled')
      setPersons(initialPersons)
    })
  }, [])

  const namesToShow = persons.filter(person => person.name.toLowerCase().includes(filter.toLowerCase()))

  const handleFilterChange = (event) => {
    setFilter(event.target.value)
  }

  const AddName = (event) => {
    event.preventDefault()
    const nameObject = {
      name: newName,
      number: newNumber,
    }

    if (persons.some(person => person.name === newName)) {
      alert(`${newName} is already added to phonebook`)
      return
    }

    personService.create(nameObject).then((returnedPerson) => {
      setPersons(persons.concat(returnedPerson))
      setInfoMessage(`Added ${returnedPerson.name}`)
      setTimeout(() => {
        setInfoMessage(null)
      }, 5000)
      setNewName('')
      setNewNumber('')  
    })
  }

  const removePerson = (id) => {
  const person = persons.find(p => p.id === id) 
  if (window.confirm(`Delete ${person.name}?`)) {
    personService
      .remove(id) 
      .then(() => {
        setPersons(persons.filter(p => p.id !== id))
      })
      .catch(error => {
        alert(`The person '${person.name}' was already deleted from server`)
        setPersons(persons.filter(p => p.id !== id))
      })
  }
}
  const handleNameChange = (event) => {
    console.log(event.target.value)
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    console.log(event.target.value)
    setNewNumber(event.target.value)
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={infoMessage} />
      <Filter filter={filter} handleFilterChange={handleFilterChange} />
      <h3>Add a new</h3>
      <PersonForm AddName={AddName} newName={newName} handleNameChange={handleNameChange} newNumber={newNumber} handleNumberChange={handleNumberChange} />
      <h3>Numbers</h3>
      <Persons personsToShow={namesToShow }  removePerson={removePerson}/>
    </div>
  )

}

export default App