import axios from 'axios';

const URL = process.env.REACT_APP_BACKEND_API_URL;

const createPatient= async (firstName: string,
    lastName: string,
    dateOfBirth: string,
    administrativeGender: string,
    race: string,
    sex_at_birth: string,
    ethnicity: string,
    genderIdentity: string,
    sexualOrientation: string,
    language: string,
    phoneNumber: string,
    email: string,
    address1: string,
    address2: string,
    city: string,
    state: string,
    zipCode: string) => {
    try {
        // Construct the URL with query parameters
        const queryParams = new URLSearchParams({
            firstName: firstName,
            lastName: lastName,
            dateOfBirth: dateOfBirth,
            administrativeGender: administrativeGender,
            race: race,
            sex_at_birth: sex_at_birth,
            ethnicity: ethnicity,
            genderIdentity: genderIdentity,
            sexualOrientation: sexualOrientation,
            language: language,
            phoneNumber: phoneNumber,
            email: email,
            address1: address1,
            address2: address2,
            city: city,
            state: state,
            zipCode: zipCode
        });
        const apiUrl = `${URL}/createPatient?${queryParams}`;

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

export default createPatient;