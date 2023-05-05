import weatherService from '../services/countries.js'

const ShowCountries= ({ countries, weather, setSearch }) => {

    const len = countries.length

    if (len > 10) {
        return (
            <div>
                Too many matches, specify another filter
            </div>
        )

    } else if (len === 1) {
        const country = countries[0]

        const temp = (weather.main.temp - 273.15).toFixed(2)
        const wind = (weather.wind.speed * 0.44704).toFixed(2)

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

                <h2>Weather in {country.capital}</h2>
                <div>temperature {temp} Celsius</div>
                <img src={`http://openweathermap.org/img/w/${weather.weather[0].icon}.png`} />
                <div>wind {wind} m/s</div>
                
                
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