import axios from 'axios';

axios.defaults.headers = {
    post: {
        'Content-Type': 'application/json',
    },
};

export const serverPath =
    process.env.NODE_ENV === 'production'
        ? 'https://obscure-ocean-12960.herokuapp.com'
        : 'http://localhost:5000';

export default axios.create({
    baseURL: serverPath,
    withCredentials: true,
});
