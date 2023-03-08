
const Persons = ({ personsToShow, removePerson }) => {
    return (
        <ul>
            {personsToShow.map(person =>
                <li key={person.name}>
                    {person.name} {person.number}
                    <button onClick={() => removePerson(person.id)}>delete</button>
                </li>
                
            )}
        </ul>
    )
}

export default Persons