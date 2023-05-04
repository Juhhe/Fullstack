import { useState, useEffect } from 'react'
import axios from 'axios'
import ShowCountries from './components/ShowCountries'
import countryService from './services/countries'


function App() {

  const [countries, setCountries] = useState([])
  const [search, setSearch] = useState('')

  useEffect(() => {
    countryService
    .getCountries()
    .then(response => {
        setCountries(response)
    })
  }, [])
  
  const handleSearchChange = (event) => {
    setSearch(event.target.value)
  }

  const countriesToShow = countries.filter(country => country.name.common.toLowerCase().includes(search.toLowerCase()))


  return (
    <div>
      find countries: <input value={search} onChange={handleSearchChange} />
      <ShowCountries countries={countriesToShow} setSearch={setSearch} />
    </div>

  );
}

export default App;
