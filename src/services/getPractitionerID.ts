import axios from 'axios';

const URL = process.env.REACT_APP_BACKEND_API_URL;

const getPractitionerWithID = async (practitionerId: string) => {
    try {
        const apiUrl = `${URL}/PractitionerID/${practitionerId}`;

        // Send GET request using axios.get
        const response = await axios.get(apiUrl);

        if (response.status === 200) {
            const data = response.data;
            return data;
        } else if(response.status === 404) {
            return "Unknown";
        }else{
            console.error("Failed to fetch Practitioner data");
        }
    } catch (error) {
        console.error("Error fetching Practitioner data:", error);
    }
};

export default getPractitionerWithID;