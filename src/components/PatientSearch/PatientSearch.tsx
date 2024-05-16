import { Button, TextField, Typography, Table, TableHead, TableBody, TableRow, TableCell } from "@mui/material";
import React, { useState, useEffect, useRef } from "react";
import axios from 'axios';
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import PatientCreation from "../PatientCreation";
import { ACLPatient } from "../../types";
import getPatientSearch from "../../services/searchPatient"

const columns: GridColDef[] = [
    { field: 'lastName', headerName: 'Last Name', width: 400 },
    { field: 'firstName', headerName: 'First Name', width: 400 },
    { field: 'dob', headerName: 'Date of Birth', width: 200 },
];

const PatientSearch = () => {
    const URL = process.env.REACT_APP_BACKEND_API_URL;
    const [lastName, setLastName] = useState("");
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [SearchButton, setSearchButton] = useState(false);
    const [PatientSearchGrid, setPatientSearchGrid] = useState(false);
    const [NewPatientCreationCard, setNewPatientCreationCard] = useState(false);
    const [patients, setPatients] = useState<ACLPatient  | undefined>({})// State to store fetched patients

    useEffect(() => {

    }, []);

    const getSearchPatientData = async() => {
        const response = await getPatientSearch(lastName, selectedDate?.toISOString().split('T')[0] || '');
        console.log("Patient Search response", response);
    }

    const handleSearch = () => {
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

    const newPatient = () => {
    };

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
                    onChange={(e) => setLastName(e.target.value)}
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
                <div style={{ height: 250, width: '100%' }}>
                    <br></br>
                <DataGrid rows={[]} columns={columns} autoHeight={true}></DataGrid>
                </div>
                : null}
            </div>
        </>
    );
};

export default PatientSearch;
