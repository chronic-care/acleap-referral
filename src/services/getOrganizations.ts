import axios from 'axios';

const URL = process.env.REACT_APP_BACKEND_API_URL;

const getOrganizations = async () => {
    try {
        const apiUrl = `${URL}/Organization`;

        // Send GET request using axios.get
        const response = await axios.get(apiUrl);

        if (response.status === 200) {
            const data = response.data;
            return data;
        } else {
            console.error("Failed to fetch patient data");
        }
    } catch (error) {
        console.error("Error fetching patient data:", error);
    }
};

export default getOrganizations;