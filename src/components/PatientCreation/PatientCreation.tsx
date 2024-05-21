// PatientCreation.tsx
import React, { useState } from 'react';
import {
  TextField, Button, Select, MenuItem, InputLabel, FormControl, Grid, Box,
  Dialog, DialogTitle, DialogContent, DialogActions, Typography,
  Divider,
  Tooltip,
  Snackbar,
  Alert
} from '@mui/material';
import createPatient from '../../services/createPatient'; // import the createPatient function

type PatientCreationDialogProps = {
  open: boolean,
  onClose: () => void
}

type FormData = {
  firstName: string,
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
  zipCode: string
};

type FormErrors = {
  [K in keyof FormData]?: string
};

const PatientCreation = (props: PatientCreationDialogProps) => {
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    administrativeGender: '',
    race: '',
    sex_at_birth: '',
    ethnicity: '',
    genderIdentity: '',
    sexualOrientation: '',
    language: '',
    phoneNumber: '',
    email: '',
    address1: '',
    address2: '',
    city: '',
    state: '',
    zipCode: ''
  });

  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const validateField = (name: keyof FormData, value: string): string => {
    switch (name) {
      case 'firstName':
      case 'lastName':
      case 'address1':
      case 'city':
      case 'state':
      case 'zipCode':
        if (!value) {
          return 'enter the valid details into the field';
        }
        break;
      case 'dateOfBirth':
        if (!value || new Date(value) > new Date()) {
          return 'enter the valid details into the field';
        }
        break;
      case 'email':
        if (!value.includes('@')) {
          return 'enter the valid details into the field';
        }
        break;
      case 'phoneNumber':
        if (!value || !/^\+?[1-9]\d{1,14}$/.test(value)) {
          return 'enter the valid details into the field';
        }
        break;
      default:
        if (!value) {
          return 'enter the valid details into the field';
        }
    }
    return '';
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | { target: { name: string, value: unknown } }) => {
    const name = event.target.name as keyof FormData;
    const value = event.target.value as string;

    setFormData(prev => ({ ...prev, [name]: value }));
    setFormErrors(prev => ({ ...prev, [name]: validateField(name, value) }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const errors: FormErrors = {};
    Object.keys(formData).forEach(key => {
      const error = validateField(key as keyof FormData, formData[key as keyof FormData]);
      if (error) {
        errors[key as keyof FormData] = error;
      }
    });
    setFormErrors(errors);
    if (Object.keys(errors).length === 0) {
      const response = await createPatient(
        formData.firstName,
        formData.lastName,
        formData.dateOfBirth,
        formData.administrativeGender,
        formData.race,
        formData.sex_at_birth,
        formData.ethnicity,
        formData.genderIdentity,
        formData.sexualOrientation,
        formData.language,
        formData.phoneNumber,
        formData.email,
        formData.address1,
        formData.address2,
        formData.city,
        formData.state,
        formData.zipCode
      );
      if (response) {
        setSuccessMessage('Patient created successfully');
        setFormData({
          firstName: '',
          lastName: '',
          dateOfBirth: '',
          administrativeGender: '',
          race: '',
          sex_at_birth: '',
          ethnicity: '',
          genderIdentity: '',
          sexualOrientation: '',
          language: '',
          phoneNumber: '',
          email: '',
          address1: '',
          address2: '',
          city: '',
          state: '',
          zipCode: ''
        });
      }
    }
  };

  const handleCloseSnackbar = () => {
    setSuccessMessage(null);
    props.onClose();
  };

  return (
    <Dialog open={props.open} onClose={props.onClose} aria-labelledby="form-dialog-title">
      <DialogTitle id="form-dialog-title">New Patient</DialogTitle>
      <DialogContent dividers>
        <Box component="form" noValidate autoComplete="off" onSubmit={handleSubmit} sx={{ mt: 1 }}>
          <Typography variant="h6" gutterBottom>Name</Typography>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField
                required
                fullWidth
                label="First Name"
                variant="outlined"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                error={!!formErrors.firstName}
                helperText={formErrors.firstName}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                required
                fullWidth
                label="Last Name"
                variant="outlined"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                error={!!formErrors.lastName}
                helperText={formErrors.lastName}
              />
            </Grid>
          </Grid>
          <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>Demographic Information</Typography>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField
                required
                fullWidth
                label="Date of Birth"
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                InputLabelProps={{ shrink: true }}
                onChange={handleChange}
                error={!!formErrors.dateOfBirth}
                helperText={formErrors.dateOfBirth}
              />
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel id="language-label">Language</InputLabel>
                <Select
                  labelId="language-label"
                  label="Language"
                  name="language"
                  value={formData.language}
                  onChange={handleChange}
                >
                  <MenuItem value="Arabic">Arabic</MenuItem>
                  <MenuItem value="Chinese">Chinese</MenuItem>
                  <MenuItem value="English">English</MenuItem>
                  <MenuItem value="Gujarati">Gujarati</MenuItem>
                  <MenuItem value="Hindi">Hindi</MenuItem>
                  <MenuItem value="Korean">Korean</MenuItem>
                  <MenuItem value="Polish">Polish</MenuItem>
                  <MenuItem value="Russian">Russian</MenuItem>
                  <MenuItem value="Spanish">Spanish</MenuItem>
                  <MenuItem value="Tagalog">Tagalog</MenuItem>
                  <MenuItem value="Urdu">Urdu</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel id="race-label">Race</InputLabel>
                <Select
                  labelId="race-label"
                  label="Race"
                  name="race"
                  value={formData.race}
                  onChange={handleChange}
                >
                  <MenuItem value="American Indian or Alaska Native">American Indian or Alaska Native</MenuItem>
                  <MenuItem value="Asian">Asian</MenuItem>
                  <MenuItem value="Asked but unknown">Asked but unknown</MenuItem>
                  <MenuItem value="Black or African American">Black or African American</MenuItem>
                  <MenuItem value="Native Hawaiian or Other Pacific Islander">Native Hawaiian or Other Pacific Islander</MenuItem>
                  <MenuItem value="Other Race">Other Race</MenuItem>
                  <MenuItem value="Unknown">Unknown</MenuItem>
                  <MenuItem value="White">White</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel id="ethnicity-label">Ethnicity</InputLabel>
                <Select
                  labelId="ethnicity-label"
                  label="Ethnicity"
                  name="ethnicity"
                  value={formData.ethnicity}
                  onChange={handleChange}
                >
                  <MenuItem value="Asked but unknown">Asked but unknown</MenuItem>
                  <MenuItem value="Hispanic or Latino">Hispanic or Latino</MenuItem>
                  <MenuItem value="Not Hispanic or Latino">Not Hispanic or Latino</MenuItem>
                  <MenuItem value="Unknown">Unknown</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6}>
            <Tooltip title="Also called legal gender or gender marker" placement="top">
              <FormControl fullWidth>
                <InputLabel id="gender-label">Administrative Gender</InputLabel>
                <Select
                  labelId="administrative_gender-label"
                  label="Administrative_gender"
                  name="administrativeGender"
                  value={formData.administrativeGender}
                  onChange={handleChange}
                >
                  <MenuItem value="Female">Female</MenuItem>
                  <MenuItem value="Male">Male</MenuItem>
                  <MenuItem value="Other">Other</MenuItem>
                  <MenuItem value="Unknown">Unknown</MenuItem>
                </Select>
              </FormControl>
            </Tooltip>
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel id="sex_at_birth">Sex at Birth</InputLabel>
                <Select
                  labelId="sex_at_birth-label"
                  label="Sex_at_Birth"
                  name="sex_at_birth"
                  value={formData.sex_at_birth}
                  onChange={handleChange}
                >
                  <MenuItem value="Asked but unknown">Asked but unknown</MenuItem>
                  <MenuItem value="Female">Female</MenuItem>
                  <MenuItem value="Male">Male</MenuItem>
                  <MenuItem value="Other">Other</MenuItem>
                  <MenuItem value="Unknown">Unknown</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel id="gender_identity">Gender Identity</InputLabel>
                <Select
                  labelId="gender_identity-label"
                  label="Gender_identity"
                  name="genderIdentity"
                  value={formData.genderIdentity}
                  onChange={handleChange}
                >
                  <MenuItem value="Asked but unknown">Asked but unknown</MenuItem>
                  <MenuItem value="Female-to-male transsexual">Female-to-male transsexual</MenuItem>
                  <MenuItem value="Identifies as female gender">Identifies as female gender</MenuItem>
                  <MenuItem value="Identifies as male gender">Identifies as male gender</MenuItem>
                  <MenuItem value="Identifies as non-conforming gender">Identifies as non-conforming gender</MenuItem>
                  <MenuItem value="Identifies as nonbinary gender">Identifies as nonbinary gender</MenuItem>
                  <MenuItem value="Male-to-female transsexual">Male-to-female transsexual</MenuItem>
                  <MenuItem value="Other">Other</MenuItem>
                  <MenuItem value="Unknown">Unknown</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel id="sexual_orientation">Sexual Orientation</InputLabel>
                <Select
                  labelId="sexual_orientation-label"
                  label="sexual_orientation"
                  name="sexualOrientation"
                  value={formData.sexualOrientation}
                  onChange={handleChange}
                >
                  <MenuItem value="Asexual">Asexual</MenuItem>
                  <MenuItem value="Bisexual">Bisexual</MenuItem>
                  <MenuItem value="Decline to Answer">Decline to Answer</MenuItem>
                  <MenuItem value="Gay">Gay</MenuItem>
                  <MenuItem value="Lesbian">Lesbian</MenuItem>
                  <MenuItem value="Multiple Sexual Orientations">Multiple Sexual Orientations</MenuItem>
                  <MenuItem value="No Information">No Information</MenuItem>
                  <MenuItem value="Queer">Queer</MenuItem>
                  <MenuItem value="Questioning">Questioning</MenuItem>
                  <MenuItem value="Straight">Straight</MenuItem>
                  <MenuItem value="Something Else">Something Else</MenuItem>
                  <MenuItem value="unknown">Unknown</MenuItem>
                  <MenuItem value="other">Other</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
          <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>Contact Information</Typography>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField
                required
                fullWidth
                label="Phone Number"
                variant="outlined"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                error={!!formErrors.phoneNumber}
                helperText={formErrors.phoneNumber}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                required
                fullWidth
                label="Email"
                variant="outlined"
                name="email"
                value={formData.email}
                onChange={handleChange}
                error={!!formErrors.email}
                helperText={formErrors.email}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="Address 1"
                variant="outlined"
                name="address1"
                value={formData.address1}
                onChange={handleChange}
                error={!!formErrors.address1}
                helperText={formErrors.address1}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Address 2"
                variant="outlined"
                name="address2"
                value={formData.address2}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                required
                fullWidth
                label="City"
                variant="outlined"
                name="city"
                value={formData.city}
                onChange={handleChange}
                error={!!formErrors.city}
                helperText={formErrors.city}
              />
            </Grid>
            <Grid item xs={3}>
              <TextField
                required
                fullWidth
                label="State"
                variant="outlined"
                name="state"
                value={formData.state}
                onChange={handleChange}
                error={!!formErrors.state}
                helperText={formErrors.state}
              />
            </Grid>
            <Grid item xs={3}>
              <TextField
                required
                fullWidth
                label="Zip Code"
                variant="outlined"
                name="zipCode"
                value={formData.zipCode}
                onChange={handleChange}
                error={!!formErrors.zipCode}
                helperText={formErrors.zipCode}
              />
            </Grid>
          </Grid>
          <br></br>
          <Divider></Divider>
          <DialogActions>
            <Button onClick={props.onClose} color="error">
              <b>Cancel</b>
            </Button>
            <Button type="submit" color="primary">
              <b>Save</b>
            </Button>
          </DialogActions>
        </Box>
      </DialogContent>
      <Snackbar open={!!successMessage} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
          {successMessage}
        </Alert>
      </Snackbar>
    </Dialog>
  );
};

export default PatientCreation;
