import axios from '../axios'; // Import instance axios đã cấu hình

const handleLoginApi = (userEmail, userPassword) => {
    return axios.post('/api/login', { email: userEmail, password: userPassword });
};

export { handleLoginApi };
