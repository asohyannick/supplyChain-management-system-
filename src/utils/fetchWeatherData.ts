import axios from 'axios';
const fetchWeatherData = async (latitude: number, longitude: number) => {
    const apiKey = process.env.AIRMAILGOBACKEND_WEATHER_API_KEY as string;
    const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}`);
    return response.data;
};
export default fetchWeatherData;
