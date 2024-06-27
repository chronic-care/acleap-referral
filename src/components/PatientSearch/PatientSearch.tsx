import { Button, CircularProgress, TextField, Typography, Modal } from "@mui/material";
import React, { useState, useEffect } from "react";
import { DataGrid, GridColDef, GridRowParams } from "@mui/x-data-grid";
import PatientCreation from "../PatientCreation";
import PatientModal from "../PatientModal"; // Import PatientModal component
import { ACLPatient } from "../../types";
import getPatientSearch from "../../services/searchPatient";
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
    birthDate: string;  // Date of birth of the patient
    patientFhirId: string;
}

const PatientSearch = () => {
    const [lastName, setLastName] = useState("");
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [searchButtonVisible, setSearchButtonVisible] = useState(false);
    const [patientSearchGridVisible, setPatientSearchGridVisible] = useState(false);
    const [newPatientCreationCardVisible, setNewPatientCreationCardVisible] = useState(false);
    const [services, setServices] = useState<PatientData[]>([]);
    const [showLastNameError, setShowLastNameError] = useState(false);
    const [loading, setLoading] = useState(false);
    const [selectedPatient, setSelectedPatient] = useState<ACLPatient | null>(null);
    const [patientModalVisible, setPatientModalVisible] = useState(false);
    const [patientSearchData, setPatientSearchData] = useState<ACLPatient  | undefined>({}); // Corrected typing

    const getSearchPatientData = async () => {
        try {
            setLoading(true);
            const responseData = await getPatientSearch(lastName, selectedDate?.toISOString().split('T')[0] || '');
            const response = responseData.slice(1);
            const transformedPatientData: PatientData[] = transformPatient(response.map((patient: ACLPatient) => patient.resource)).map((patient: { firstName: string; lastName: string; birthDate: string;  patientFhirId: string;}, index: number) => ({
                id: index + 1,
                firstName: patient.firstName,
                lastName: patient.lastName,
                birthDate: patient.birthDate,
                patientFhirId: patient.patientFhirId // Fixed typo from 'fhirid' to 'patientFhirId'
            }));
            const transformedOriginalPatientData = transformPatient(response.map((patient: ACLPatient) => patient.resource));
            setPatientSearchData(transformedOriginalPatientData);
            setServices(transformedPatientData);
        } catch (error) {
            console.error("Error fetching patient data:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = () => {
        if (!lastName || !selectedDate) {
            setShowLastNameError(true);
            return;
        }
        setServices([]);
        setShowLastNameError(false);
        getSearchPatientData();
        setSearchButtonVisible(true);
        setPatientSearchGridVisible(true);
    };

    const handleDateChange = (date: Date | null) => {
        setSelectedDate(date);
    };

    const handleCreateNewPatient = () => {
        setNewPatientCreationCardVisible(true);
    };

    const handleClose = () => {
        setNewPatientCreationCardVisible(false);
    };

    const handleRowClick = (row: { row: PatientData }) => {
        const selectedRow = row.row;
        const selected = patientSearchData?.find((p: ACLPatient) => p.patientFhirId === selectedRow.patientFhirId);
        setSelectedPatient(selected);
        setPatientModalVisible(true);
    };

    const handleModalClose = () => {
        setPatientModalVisible(false);
    };

    return (
        <>
            {newPatientCreationCardVisible && <PatientCreation open={true} onClose={handleClose} />}
            <Typography variant="h6" mb={2}>Patient Search</Typography>
            <p>Search for a patient to start a new referral</p>
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
                            setShowLastNameError(false);
                        }}
                        error={showLastNameError}
                        helperText={showLastNameError ? "Please enter a last name" : ""}
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
                {searchButtonVisible && (
                    <Button variant="contained" onClick={handleCreateNewPatient}>CREATE NEW PATIENT</Button>
                )}
            </div>
            <div>
                {patientSearchGridVisible && (
                    <div style={{ height: 300, width: '100%' }}>
                        <br />
                        <DataGrid
                            rows={services.length === 0 ? [{ id: 0, message: 'No patients found' }] : services}
                            getRowId={(row) => row.id}
                            columns={services.length === 0 ? [
                                { field: 'message', headerName: 'Message', width: 800, renderCell: (params) => <span>{params.value}</span> }
                            ] : columns}
                            autoHeight
                            initialState={{
                                pagination: {
                                    paginationModel: { page: 0, pageSize: 5 },
                                },
                            }}
                            loading={loading}
                            onRowClick={handleRowClick} // Add row click handler
                        />
                    </div>
                )}
            </div>
            <Modal
                open={patientModalVisible}
                onClose={handleModalClose}
                aria-labelledby="patient-modal-title"
                aria-describedby="patient-modal-description"
            >
                <PatientModal patient={selectedPatient} onClose={handleModalClose} open={patientModalVisible} />
            </Modal>
        </>
    );
};

export default PatientSearch;
