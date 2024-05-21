// createPatient.ts
import axios from 'axios';

const URL = process.env.REACT_APP_BACKEND_API_URL;

const createPatient = async (patientData: any) => {
  try {
    const apiUrl = `${URL}/createPatient`;
    const response = await axios.post(apiUrl, patientData);

    if (response.status === 201) {
      return response.data;
    } else {
      console.error("Failed to create patient");
    }
  } catch (error) {
    console.error("Error creating patient:", error);
  }
};

export default createPatient;
