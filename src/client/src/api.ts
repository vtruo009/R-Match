import axios from 'axios';

axios.defaults.headers = {
    post: {
        'Content-Type': 'application/json',
    },
};

export const serverPath =
    process.env.NODE_ENV === 'production'
        ? '/api'
        : 'http://localhost:5000/api';

export default axios.create({
    baseURL: serverPath,
    withCredentials: true,
});
