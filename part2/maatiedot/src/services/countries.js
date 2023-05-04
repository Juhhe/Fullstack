import axios from 'axios'

const weather_api_key = process.env.REACT_APP_API_KEY

const getWeather = (country) => {
    const [lat, lon] = country.capitalInfo.latlng
    const request = axios.get(`https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&exclude=&appid=${weather_api_key}`)
    return request.then(response => response.data)
}

const getCountries = () => {
    const request = axios.get(`https://restcountries.com/v3.1/all`)
    return request.then(response => response.data)
}

export default { getWeather, getCountries }