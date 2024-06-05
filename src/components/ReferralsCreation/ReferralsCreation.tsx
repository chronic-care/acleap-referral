import React, { useEffect, useState } from "react";
import {
    Box, Typography, Grid, Paper, TextField, MenuItem, Button, Divider, Dialog, DialogTitle, DialogContent, IconButton
} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import { ACLPatient, ACLPractitionerRole, ACLOrganization } from "../../types";
import getPractitioner from "../../services/getPractitioner";
import { transformPractitionerRole, transformOrganizations } from "../../services/fhirUtil";
import getOrganizations from "../../services/getOrganizations";

type ReferralsCreationProps = {
    open: boolean;
    onClose: () => void;
    onReferralCreated: () => void;
    patient: ACLPatient;
};

type CreateServiceRequestData = {
    patientId: string,
    practitionerId: string,
    selectedPractitionerName :string,
    organizationId: string,
    performerOrganization: string,
    referralNote: string,
    serviceRequested: string
  };

const ReferralsCreation: React.FC<ReferralsCreationProps> = ({ open, onClose, onReferralCreated, patient }) => {
    const [serviceRequested, setServiceRequested] = useState("");
    const [referralNote, setReferralNote] = useState("");
    const [performerOrganization, setPerformerOrganization] = useState("");
    const [selectedOrganizationId, setSelectedOrganizationId] = useState("");
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [practitionerNames, setPractitionerNames] = useState<ACLPractitionerRole[]>([]);
    const [organizationNames, setOrganizationNames] = useState<ACLOrganization[]>([]);
    const [selectedPractitionerName, setSelectedPractitionerName] = useState("");
    const [selectedPractitionerId, setSelectedPractitionerId] = useState("");

    useEffect(() => {
        getResourcesData();
    }, []);

    const getResourcesData = async () => {
        const practitionerResponse = await getPractitioner();
        const practitionerData = practitionerResponse.map((practitionerRole: { resource: any; }) => practitionerRole.resource);
        const practitionerRole = practitionerData.slice(1);
        const transformedPractitionerRole: ACLPractitionerRole[] = transformPractitionerRole(practitionerRole);
        setPractitionerNames(transformedPractitionerRole);

        const organizationResponse = await getOrganizations();
        const organizationResponseData = organizationResponse.map((o: { resource: any; }) => o.resource);
        const organizations = organizationResponseData.slice(1);
        const transformedOrganizations: ACLOrganization[] = transformOrganizations(organizations);
        setOrganizationNames(transformedOrganizations);
    };

    const validate = () => {
        const newErrors: { [key: string]: string } = {};
        if (!serviceRequested) newErrors.serviceRequested = "Service Requested is required";
        if (!performerOrganization) newErrors.performerOrganization = "Performer Organization is required";
        if (!selectedPractitionerName) newErrors.practitionerName = "Referral Requester is required";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSave = () => {
        if (!validate()) return;

        const formData : CreateServiceRequestData = {
            patientId: patient.patientFhirId ? patient.patientFhirId : "",
            practitionerId: selectedPractitionerId,
            selectedPractitionerName,
            organizationId: selectedOrganizationId,
            performerOrganization,
            referralNote,
            serviceRequested
        };

        console.log("Form Data:", formData);
        onReferralCreated();
        onClose();
    };

    const handlePractitionerChange = (event: React.ChangeEvent<{ value: unknown }>) => {
        const selectedName = event.target.value as string;
        const selectedPractitioner = practitionerNames.find(practitioner => practitioner.practitionerName === selectedName);
        if (selectedPractitioner) {
            setSelectedPractitionerName(selectedName);
            setSelectedPractitionerId(selectedPractitioner.practitionerRoleId ? selectedPractitioner.practitionerRoleId : "No Id");
        }
    };

    const handleOrganizationChange = (event: React.ChangeEvent<{ value: unknown }>) => {
        const selectedName = event.target.value as string;
        const selectedOrganization = organizationNames.find(organization => organization.organizationName === selectedName);
        if (selectedOrganization) {
            setPerformerOrganization(selectedName);
            setSelectedOrganizationId(selectedOrganization.organizationId ? selectedOrganization.organizationId : "No Id");
        }
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="lg">
            <DialogTitle>
                <Typography variant="h5" component="div" style={{ flexGrow: 1 }}>
                    {patient ? `New referral for: ${patient.firstName} ${patient.lastName}` : 'New referral'}
                </Typography>
                <IconButton
                    aria-label="close"
                    onClick={onClose}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: (theme) => theme.palette.grey[500],
                    }}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent dividers>
                <Box p={3}>
                    <Box mb={3} border={1} borderColor="grey.300" borderRadius={2} p={2}>
                        <Grid item xs={12}>
                            <div style={{ padding: '16px' }}>
                                <Grid container spacing={3}>
                                    <Grid item xs={3}>
                                        <Paper elevation={0}>
                                            <Typography variant="body1" my={1}><b>First Name: </b>{patient?.firstName}</Typography>
                                            <Typography variant="body1" my={1}><b>Last Name: </b>{patient?.lastName}</Typography>
                                            <Typography variant="body1" my={1}><b>Date of Birth: </b>{patient?.birthDate}</Typography>
                                            <Typography variant="body1" my={1}><b>Administrative Gender: </b>{patient?.gender}</Typography>
                                            <Typography variant="body1" my={1}><b>Ethnicity: </b>{patient?.ethnicity}</Typography>
                                        </Paper>
                                    </Grid>
                                    <Grid item xs={3}>
                                        <Paper elevation={0}>
                                            <Typography variant="body1" my={1}><b>Race: </b>{patient?.race}</Typography>
                                            <Typography variant="body1" my={1}><b>Sex at Birth: </b>{patient?.sexAtBirth}</Typography>
                                            <Typography variant="body1" my={1}><b>Gender Identity: </b>{patient?.genderIdentity}</Typography>
                                            <Typography variant="body1" my={1}><b>Sexual Orientation: </b>{patient?.sexualOrientation}</Typography>
                                        </Paper>
                                    </Grid>
                                    <Grid item xs={3}>
                                        <Paper elevation={0}>
                                            <Typography variant="body1" my={1}><b>Email: </b>{patient?.email}</Typography>
                                            <Typography variant="body1" my={1}><b>Phone: </b>{patient?.phone}</Typography>
                                            <Typography variant="body1" my={1}><b>Language: </b>{patient?.language}</Typography>
                                        </Paper>
                                    </Grid>
                                    <Grid item xs={3}>
                                        <Paper elevation={0}>
                                            <Typography variant="body1" my={1}><b>Primary Address: </b>{patient?.address}</Typography>
                                        </Paper>
                                    </Grid>
                                </Grid>
                            </div>
                        </Grid>
                    </Box>
                    <Divider />
                    <Grid container spacing={2} mt={2}>
                        <Grid item xs={8}>
                            <Typography><b>Service Requested:</b></Typography>
                            <br />
                            <TextField
                                label="Service"
                                fullWidth
                                variant="outlined"
                                value={serviceRequested}
                                onChange={(e) => setServiceRequested(e.target.value)}
                                error={!!errors.serviceRequested}
                                helperText={errors.serviceRequested}
                            />
                        </Grid>
                        <Grid item xs={4}>
                            <Typography><b>Performer Organization</b></Typography>
                            <br />
                            <TextField
                                select
                                label="Organization"
                                fullWidth
                                variant="outlined"
                                value={performerOrganization}
                                onChange={handleOrganizationChange}
                                error={!!errors.performerOrganization}
                                helperText={errors.performerOrganization}
                            >
                                {organizationNames.map((organization, index) => (
                                    <MenuItem key={index} value={organization.organizationName}>{organization.organizationName}</MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                        <Grid item xs={8}>
                            <Typography><b>Referral Note:</b></Typography>
                            <br />
                            <TextField
                                label="Note"
                                fullWidth
                                variant="outlined"
                                multiline
                                rows={4}
                                inputProps={{ maxLength: 100 }}
                                value={referralNote}
                                onChange={(e) => setReferralNote(e.target.value)}
                                error={referralNote.length > 100}
                                helperText={`${referralNote.length}/100`}
                            />
                        </Grid>
                        <Grid item xs={4}>
                            <Typography><b>Referral Requester</b></Typography>
                            <br />
                            <TextField
                                select
                                label="Requester"
                                fullWidth
                                variant="outlined"
                                value={selectedPractitionerName}
                                onChange={handlePractitionerChange}
                                error={!!errors.practitionerName}
                                helperText={errors.practitionerName}
                            >
                                {practitionerNames.map((practitioner, index) => (
                                    <MenuItem key={index} value={practitioner.practitionerName}>{practitioner.practitionerName}</MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                    </Grid>
                    <Box mt={3} display="flex" justifyContent="flex-end">
                        <Button variant="contained" style={{ marginRight: 8 }} onClick={onClose}>
                            Cancel
                        </Button>
                        <Button variant="contained" onClick={handleSave}>
                            Save
                        </Button>
                    </Box>
                </Box>
            </DialogContent>
        </Dialog>
    );
};

export default ReferralsCreation;
