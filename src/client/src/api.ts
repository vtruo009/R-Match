import axios from 'axios';

export const serverPath = 'http://localhost:5000';

axios.defaults.headers = {
    post: {
        'Content-Type': 'application/json',
    },
};

export default axios.create({
    baseURL: `${serverPath}/api/`,
    withCredentials: true,
});
