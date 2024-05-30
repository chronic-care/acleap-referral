import React from "react";
import { ACLPatient, ACLServiceRequest, ACLTasks } from "../../types";
import {
    Dialog, DialogTitle, DialogContent, Box, Typography, Grid, Card, Paper, Button, Divider, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow
} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import getServiceRequestTaskSearch from "../../services/searchServiceRequestTasks";
import { transformServiceRequests, transformTasks } from "../../services/fhirUtil";

interface EnrichedServiceRequest extends ACLServiceRequest {
    firstName: string;
    lastName: string;
    taskAuthoredDate: string;
    taskBusinessStatus: string;
    taskOwner: string;
    referralSource: string;
}

type PatientModalProps = {
    open: boolean,
    onClose: () => void,
    patient?: ACLPatient | null,
};

const PatientModal = ({ open, onClose, patient }: PatientModalProps) => {
    const [selectedPatient, setSelectedPatient] = React.useState<ACLPatient | null>(null);
    const [serviceRequests, setServiceRequests] = React.useState<ACLServiceRequest[]>([]);
    const [tasks, setTasks] = React.useState<ACLTasks[]>([]);
    const [services, setServices] = React.useState<EnrichedServiceRequest[]>([]);

    React.useEffect(() => {
        if (patient) {
            getServiceRequestTaskData();
        }
    }, [patient]);

    const getServiceRequestTaskData = async () => {
        if (patient?.patientFhirId) {
            try {
                const resources: any = await getServiceRequestTaskSearch(patient.patientFhirId);
                const transformedServiceRequests: ACLServiceRequest[] = transformServiceRequests(resources.serviceRequests.map((p: any) => p.resource));
                const transformedTasks: ACLTasks[] = transformTasks(resources.tasks.map((p: any) => p.resource));

                const data = transformedServiceRequests.map((item: ACLServiceRequest): EnrichedServiceRequest | null => {
                    const matchingPatient = patient;
                    const matchingTask = transformedTasks.find((x: ACLTasks) => x.taskServiceRequestId === item.serviceRequestFHIRId);

                    if (matchingPatient && matchingTask &&
                        typeof matchingPatient.firstName === 'string' && typeof matchingPatient.lastName === 'string' &&
                        typeof matchingTask.taskAuthoredDate === 'string' && typeof matchingTask.taskBusinessStatus === 'string') {
                        
                        const matchedTaskOwner = matchingTask.taskOwner === "Dr. Owners" ? "UnAssigned" : matchingTask.taskOwner;

                        return {
                            ...item,
                            referralSource: (matchingTask.taskRequester ? matchingTask.taskRequester : 'Unknown'),
                            firstName: matchingPatient.firstName,
                            lastName: matchingPatient.lastName,
                            taskAuthoredDate: matchingTask.taskAuthoredDate,
                            taskBusinessStatus: matchingTask.taskBusinessStatus,
                            taskOwner: (matchedTaskOwner ? matchedTaskOwner : 'UnAssigned'),
                        };
                    }

                    return null;
                }).filter((item: EnrichedServiceRequest | null): item is EnrichedServiceRequest => item !== null);

                setServices(data);
                setServiceRequests(transformedServiceRequests);
                setTasks(transformedTasks);
            } catch (error) {
                console.error("Failed to fetch service request task data:", error);
            }
        }
    };

    return (
        <Dialog
            disableEscapeKeyDown
            open={open}
            onClose={onClose}
            maxWidth="lg"
            fullWidth
            className="dialogue-size"
        >
            <DialogTitle>
                <Typography variant="h4" component="div" style={{ flexGrow: 1 }}>
                    {patient ? `${patient.firstName} ${patient.lastName}` : 'Patient Details'}
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
                <Box>
                    <Typography variant="h6"><b>Patient Information</b></Typography>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Card variant="outlined">
                                <div style={{ padding: '16px' }}>
                                    <Grid container spacing={3}>
                                        <Grid item xs={3}>
                                            <Paper elevation={0}>
                                                <Typography variant="body1" my={1}><b>First Name: </b>{patient?.firstName}</Typography>
                                                <Typography variant="body1" my={1}><b>Last Name: </b>{patient?.lastName}</Typography>
                                                <Typography variant="body1" my={1}><b>Date of Birth: </b>{patient?.birthDate}</Typography>
                                                <Typography variant="body1" my={1}><b>Gender: </b>{patient?.gender}</Typography>
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
                            </Card>
                        </Grid>
                        <Grid item xs={12}>
                            <Divider />
                            <Typography variant="h6" mt={2}><b>Referrals</b></Typography>
                            <Card variant="outlined">
                                <div style={{ padding: '16px' }}>
                                    <TableContainer component={Paper}>
                                        {services.length > 0 ? (
                                            <Table>
                                                <TableHead>
                                                    <TableRow>
                                                        <TableCell>Date Requested</TableCell>
                                                        <TableCell>Last Name</TableCell>
                                                        <TableCell>First Name</TableCell>
                                                        <TableCell>Service Requested</TableCell>
                                                        <TableCell>Referral Source</TableCell>
                                                        <TableCell>Task Status</TableCell>
                                                        <TableCell>Task Owner</TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {services.map((service, index) => (
                                                        <TableRow key={index}>
                                                            <TableCell>{service.taskAuthoredDate}</TableCell>
                                                            <TableCell>{service.lastName}</TableCell>
                                                            <TableCell>{service.firstName}</TableCell>
                                                            <TableCell>{service.serviceRequested}</TableCell>
                                                            <TableCell>{service.referralSource}</TableCell>
                                                            <TableCell>{service.taskBusinessStatus}</TableCell>
                                                            <TableCell>{service.taskOwner}</TableCell>
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        ) : (
                                            <Typography variant="body1" align="center" style={{ padding: '16px' }}>
                                                There are no Referrals Available for this Patient, Consider Creating One
                                            </Typography>
                                        )}
                                    </TableContainer>
                                </div>
                            </Card>
                            <Box mt={2} display="flex" justifyContent="flex-end">
                                <Button variant="contained" sx={{ color: 'white' }}>CREATE REFERRAL</Button>
                            </Box>
                        </Grid>
                    </Grid>
                </Box>
            </DialogContent>
        </Dialog>
    );
};

export default PatientModal;
