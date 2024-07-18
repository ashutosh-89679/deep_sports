import axios from 'axios';
import { getLocalStorage } from '../utils/getLocalStorage';

// Fetch the access token from local storage
let lsData = getLocalStorage();
const accessToken = lsData ? lsData.access_token : null;

// Create a new Axios instance with the base URL
const apiInstance = axios.create({
  baseURL: 'https://deepsparkle.net/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Function to make a request with the access token from local storage
const makeRequest = (url, method, data = {}) => {
  const headers = {
    'Content-Type': 'application/json',
    ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
  };

  // Make the request using the Axios instance
  return apiInstance({
    url,
    method,
    data,
    headers,
  });
};

export default makeRequest;
