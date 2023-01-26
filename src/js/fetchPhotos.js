import axios from "axios";

const BAZE_URL = 'https://pixabay.com/api/';
const KEY = '33040726-8ad8a9d3351d63d14c4afe724';


export async function fetchPhotos(query, page) {
  const response = await axios.get(
    `${BAZE_URL}/?key=${KEY}&q=${query}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${page}`
  );
  return response;
}
