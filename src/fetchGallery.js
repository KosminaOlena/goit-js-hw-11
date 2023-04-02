import axios from 'axios';

const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '34922298-738fc0c04c0e6fb96d143066f';


export default async function fetchImages(query, page, perPage) {
    const response = await axios.get(`${BASE_URL}?key=${API_KEY}&q=${query}&image_type=photo&orientation=horizontal&safesearch=true&per_page=${perPage}&page=${page}`);
    return response;
}