import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Weather APIs
export const getWeather = () => api.get('/api/weather');
export const getCurrentWeather = () => api.get('/api/weather/current');
export const getHourlyForecast = () => api.get('/api/weather/hourly');
export const getDailyForecast = () => api.get('/api/weather/daily');

// AQI APIs
export const getAQI = () => api.get('/api/aqi');
export const getCurrentAQI = () => api.get('/api/aqi/current');
export const getAQIStations = () => api.get('/api/aqi/stations');
export const getAQIHistorical = () => api.get('/api/aqi/historical');
export const getAQIForecast = () => api.get('/api/aqi/forecast');

// Alerts APIs
export const getAlerts = (severity) => api.get('/api/alerts', { params: { severity } });
export const getAlertById = (id) => api.get(`/api/alerts/${id}`);

// Disasters APIs
export const getDisasters = (type, limit = 50) => api.get('/api/disasters', { params: { disaster_type: type, limit } });
export const getDisasterById = (id) => api.get(`/api/disasters/${id}`);
export const getDisasterStats = () => api.get('/api/disasters/stats/summary');

// Cyclone APIs
export const getCycloneData = () => api.get('/api/cyclone');
export const getActiveCyclone = () => api.get('/api/cyclone/active');
export const getCycloneTrack = () => api.get('/api/cyclone/track');
export const getHistoricalCyclones = () => api.get('/api/cyclone/historical');

// Flood APIs
export const getFloodZones = (riskLevel) => api.get('/api/flood-zones', { params: { risk_level: riskLevel } });

// Earthquake APIs
export const getEarthquakes = (minMagnitude, limit = 50) => api.get('/api/earthquakes', { params: { min_magnitude: minMagnitude, limit } });

// Agriculture APIs
export const getAgricultureData = () => api.get('/api/agriculture');
export const getCropAdvisory = () => api.get('/api/agriculture/advisory');
export const getMarketPrices = () => api.get('/api/agriculture/prices');

// Knowledge Cards APIs
export const getKnowledgeCards = (category) => api.get('/api/knowledge-cards', { params: { category } });
export const getKnowledgeCardById = (id) => api.get(`/api/knowledge-cards/${id}`);

// Evacuation Centers APIs
export const getEvacuationCenters = (shelterType, status) => api.get('/api/evacuation-centers', { params: { shelter_type: shelterType, status } });
export const getEvacuationCenterById = (id) => api.get(`/api/evacuation-centers/${id}`);

// AI Assistant APIs
export const askAIAssistant = (query, context) => api.post('/api/ai-assistant', { query, context });
export const getAIRecommendations = () => api.get('/api/ai-assistant/recommendations');

// Community Reports APIs
export const createCommunityReport = (data) => api.post('/api/community-reports', data);
export const getCommunityReports = (status, reportType, limit = 50) => api.get('/api/community-reports', { params: { status, report_type: reportType, limit } });
export const getCommunityReportById = (id) => api.get(`/api/community-reports/${id}`);

// Dashboard Summary
export const getDashboardSummary = () => api.get('/api/dashboard/summary');

export default api;
