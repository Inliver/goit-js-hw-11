
import axios from 'axios';
export default {  fetchImages };



const BASE_URL  = "https://pixabay.com/api/"
const KEY = "33537107-58b18c97c8891cccb2fb42324"

async function fetchImages({qeury, page}) {
    const res = await axios.get(`${BASE_URL}?key=${KEY}&q=${qeury}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${page} `);
    return res.data.hits;
}