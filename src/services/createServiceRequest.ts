// createPatient.ts
import axios from 'axios';

const URL = process.env.REACT_APP_BACKEND_API_URL;

type CreateServiceRequestData = {
  patientId: string,
  practitionerId: string,
  selectedPractitionerName :string,
  organizationId: string,
  performerOrganization: string,
  referralNote: string,
  serviceRequested: string
};

const createServiceRequest = async (ServiceRequestData: CreateServiceRequestData) => {
  try {
    const apiUrl = `${URL}/createServiceRequest`;
    const response = await axios.post(apiUrl, ServiceRequestData);

    if (response.status === 201) {
      return response.data;
    } else {
      console.error("Failed to create patient");
    }
  } catch (error) {
    console.error("Error creating patient:", error);
  }
};

export default createServiceRequest;