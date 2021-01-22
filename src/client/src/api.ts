import axios from 'axios';

axios.defaults.headers = {
    post: {
        'Content-Type': 'application/json',
    },
};

export const serverPath = 'http://localhost:5000/';

export default axios.create({
    baseURL: 'http://localhost:5000/api/',
    withCredentials: true,
});
