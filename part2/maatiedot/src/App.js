import { useState, useEffect } from 'react'
import axios from 'axios'
import ShowCountries from './components/ShowCountries'
import countryService from './services/countries'


function App() {

  const [countries, setCountries] = useState([])
  const [search, setSearch] = useState('')
  const [weather, setWeather] = useState()

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

  useEffect(() => {
    if (countriesToShow.length === 1) {
      countryService
      .getWeather(countriesToShow[0])
      .then(response => {
        setWeather(response)
      })
    }
  }, [search])


  return (
    <div>
      find countries: <input value={search} onChange={handleSearchChange} />
      <ShowCountries countries={countriesToShow} weather={weather} setSearch={setSearch} />
    </div>

  );
}

export default App;
