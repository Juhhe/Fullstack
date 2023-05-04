import weatherService from '../services/countries.js'

const ShowCountries= ({ countries, setSearch }) => {

    const len = countries.length

    if (len > 10) {
        return (
            <div>
                Too many matches, specify another filter
            </div>
        )

    } else if (len === 1) {
        const country = countries[0]

        const weather = weatherService.getWeather(country)

        console.log(weather)

        return (
            <div>
                <h1>{country.name.common}</h1>

                <div>capital {country.capital}</div>
                <div>area {country.area}</div>

                <h2>languages</h2>
                {Object.values(country.languages).map(language =>
                    <li key={language}>{language}</li>
                )}

                <img src={country.flags.png} />
                
                <div>Temperature {273.15-weather.current.temp}</div>
            </div>
        )

    } else {
        return (
            <div>
                {countries.map(country =>
                    <div key={country.name.common}>{country.name.common}
                    <button onClick={() => setSearch(country.name.common)}>show</button>
                    </div>
                )}
            </div>
        )
    }
}

export default ShowCountries