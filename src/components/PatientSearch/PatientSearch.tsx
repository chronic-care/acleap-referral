import { Button, CircularProgress, TextField, Typography } from "@mui/material";
import React, { useState, useEffect, useRef } from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import PatientCreation from "../PatientCreation";
import { ACLPatient } from "../../types";
import getPatientSearch from "../../services/searchPatient"
import { transformPatient } from "../../services/fhirUtil";

const columns: GridColDef[] = [
    { field: 'lastName', headerName: 'Last Name', width: 400 },
    { field: 'firstName', headerName: 'First Name', width: 400 },
    { field: 'birthDate', headerName: 'Date of Birth', width: 200 },
];

interface PatientData {
    id: number;         // Unique identifier for the DataGrid
    firstName: string;  // First name of the patient
    lastName: string;   // Last name of the patient
    birthDate: string;        // Date of birth of the patient
}

const PatientSearch = () => {
    const [lastName, setLastName] = useState("");
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [SearchButton, setSearchButton] = useState(false);
    const [PatientSearchGrid, setPatientSearchGrid] = useState(false);
    const [NewPatientCreationCard, setNewPatientCreationCard] = useState(false);
    const [services, setServices] = React.useState([])
    const [showLastNameError, setShowLastNameError] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
    }, []);

    const getSearchPatientData = async () => {
        try {
            const response = await getPatientSearch(lastName, selectedDate?.toISOString().split('T')[0] || '');
            const PatientSearchData = response.map((patient: ACLPatient) => patient.resource);
            const transformedPatientData: PatientData[] = transformPatient(PatientSearchData).map((patient: { firstName: any; lastName: any; birthDate: any; }, index: number) => ({
                id: index + 1,
                firstName: patient.firstName,
                lastName: patient.lastName,
                birthDate: patient.birthDate
            }));
            setServices(transformedPatientData as any);
            console.log("Transformed Patient Search response", transformedPatientData);
        } catch (error) {
            // Handle error, e.g., display error message to user
            console.error("Error fetching patient data:", error);
        } finally {
            setLoading(false);
        }
    };
    

    const handleSearch = () => {
        if (!lastName || !selectedDate) {
            // Last name is empty, disable search button
            return;
        }
        setServices([]);
        // Last name is entered, clear any previous error message
        setShowLastNameError(false);
        setLoading(true);
        // Call getPatientSearch with last name and date of birth
        getSearchPatientData();
        setSearchButton(true);
        setPatientSearchGrid(true);
    };

    const handleDateChange = (date: Date | null) => {
        setSelectedDate(date);
    };

    const handleCreateNewPatient = () => {
        setNewPatientCreationCard(true);
    }

    const handleClose = () => {
        setNewPatientCreationCard(false);
    }

    return (
        <>
            {NewPatientCreationCard? <PatientCreation open={true} onClose={handleClose}/>
            : null}
            <Typography variant="h6" mb={2}>Patient Search</Typography>
            <p>Search for Patient to start a referral</p>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                <TextField
                    label="Last Name"
                    variant="outlined"
                    size="small"
                    name="lastName"
                    value={lastName}
                    onChange={(e) => {
                        setLastName(e.target.value);
                        // Clear the last name error message when user starts typing
                        setShowLastNameError(false);
                    }}
                    error={showLastNameError} // Show error state for last name input field
                    helperText={showLastNameError ? "Please enter a last name" : ""} // Error message
                    required
                    style={{ marginRight: '8px' }}
                />
                <TextField
                    label=""
                    type="date"
                    variant="outlined"
                    size="small"
                    name="dateOfBirth"
                    onChange={(e) => handleDateChange(new Date(e.target.value))}
                    style={{ marginRight: '8px' }}
                />
                <Button variant="contained" onClick={handleSearch} style={{ marginRight: '8px' }}>SEARCH</Button>
                </div>
                {SearchButton && (
                    <Button variant="contained" onClick={handleCreateNewPatient}>CREATE NEW PATIENT</Button>
                )}
            </div>
            <div>
                { PatientSearchGrid ?
                <div style={{ height: 300, width: '100%' }}>
                    <br></br>
                <DataGrid
                rows={services.length === 0 ? [{ id: 0, message: 'No patients found. Consider creating a new patient.' }] : services}

                getRowId={(row) => row.id}
                columns={services.length === 0 ? [
                    { field: 'message', headerName: 'Message', width: 800, renderCell: (params) => <span>{params.value}</span> }
                ] : columns}
                autoHeight={true}
                initialState={{
                    pagination: {
                        paginationModel: { page: 0, pageSize: 5 },
                    },
                }}
                loading={loading}
                />
                </div>
                : null}
            </div>
        </>
    );
};

export default PatientSearch;
