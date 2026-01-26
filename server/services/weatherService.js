import axios from 'axios';

/**
 * WeatherService - Real-world Data-First interface for Environmental Metrics.
 * Uses Open-Meteo (No API key required for non-commercial/dev).
 */
class WeatherService {
    constructor() {
        this.baseUrl = "https://api.open-meteo.com/v1/forecast";
        this.historicalUrl = "https://archive-api.open-meteo.com/v1/archive";
    }

    /**
     * Get real-time, 7-day forecast AND 7-day history for a location.
     */
    async getClimateFull(lat, lon) {
        try {
            const now = new Date();
            const pastDate = new Date();
            pastDate.setDate(now.getDate() - 7);

            const formatDate = (d) => d.toISOString().split('T')[0];

            const [forecast, history] = await Promise.all([
                axios.get(this.baseUrl, {
                    params: {
                        latitude: lat,
                        longitude: lon,
                        daily: "temperature_2m_max,temperature_2m_min,precipitation_sum",
                        timezone: "auto"
                    }
                }),
                axios.get(this.historicalUrl, {
                    params: {
                        latitude: lat,
                        longitude: lon,
                        start_date: formatDate(pastDate),
                        end_date: formatDate(now),
                        daily: "temperature_2m_max,temperature_2m_min,precipitation_sum",
                        timezone: "auto"
                    }
                })
            ]);

            return {
                forecast: forecast.data.daily,
                history: history.data.daily
            };
        } catch (error) {
            console.error('[WeatherService] Climate Fetch Failed:', error.message);
            return null;
        }
    }

    async getForecast(lat, lon) {
        try {
            const response = await axios.get(this.baseUrl, {
                params: {
                    latitude: lat,
                    longitude: lon,
                    current: "temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,rain,showers,snowfall,weather_code,cloud_cover,pressure_msl,surface_pressure,wind_speed_10m",
                    daily: "weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max,precipitation_sum,rain_sum,showers_sum,snowfall_sum,precipitation_hours,precipitation_probability_max,wind_speed_10m_max",
                    timezone: "auto"
                }
            });
            return response.data;
        } catch (error) {
            console.error('[WeatherService] Forecast Fetch Failed:', error.message);
            return null;
        }
    }

    async getHistorical(lat, lon, start, end) {
        try {
            const response = await axios.get(this.historicalUrl, {
                params: {
                    latitude: lat,
                    longitude: lon,
                    start_date: start,
                    end_date: end,
                    daily: "temperature_2m_max,temperature_2m_min,precipitation_sum",
                    timezone: "auto"
                }
            });
            return response.data;
        } catch (error) {
            console.error('[WeatherService] Historical Fetch Failed:', error.message);
            return null;
        }
    }
}

export default new WeatherService();
