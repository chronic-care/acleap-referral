import React, { useState } from 'react';
import {
  TextField, Button, Select, MenuItem, InputLabel, FormControl, Grid, Box,
  Dialog, DialogTitle, DialogContent, DialogActions, Typography,
  Divider
} from '@mui/material';

type PatientCreationDialogProps = {
  open: boolean,
  onClose: () => void
}

const PatientCreation = (props: PatientCreationDialogProps) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    gender: '',
    race: '',
    ethnicity: '',
    sexOrientation: '',
    language: '',
    phoneNumber: '',
    email: '',
    address1: '',
    address2: '',
    city: '',
    state: '',
    zipCode: ''
  });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | { target: { name: string, value: unknown } }) => {
    const name = event.target.name as keyof typeof formData;
    const value = event.target.value;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log("Form Data:", formData);
    // Here you would typically send the data to your backend or another handler
    props.onClose(); // Close the dialog upon submission
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
              />
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel id="gender-label">Gender</InputLabel>
                <Select
                  labelId="gender-label"
                  label="Gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                >
                  <MenuItem value="male">Male</MenuItem>
                  <MenuItem value="female">Female</MenuItem>
                  <MenuItem value="other">Other</MenuItem>
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
                  <MenuItem value="white">White</MenuItem>
                  <MenuItem value="black">Black</MenuItem>
                  <MenuItem value="hispanic">Hispanic</MenuItem>
                  <MenuItem value="asian">Asian</MenuItem>
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
                  <MenuItem value="hispanic">Hispanic</MenuItem>
                  <MenuItem value="non-hispanic">Non-Hispanic</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <TextField
                required
                fullWidth
                label="Sex Orientation"
                variant="outlined"
                name="sexOrientation"
                value={formData.sexOrientation}
                onChange={handleChange}
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
                  <MenuItem value="spanish">Spanish</MenuItem>
                  <MenuItem value="polish">Polish</MenuItem>
                  <MenuItem value="chinese">Chinese</MenuItem>
                  <MenuItem value="tagalog">Tagalog</MenuItem>
                  <MenuItem value="arabic">Arabic</MenuItem>
                  <MenuItem value="urdu">Urdu</MenuItem>
                  <MenuItem value="gujarati">Gujarati</MenuItem>
                  <MenuItem value="russian">Russian</MenuItem>
                  <MenuItem value="hindi">Hindi</MenuItem>
                  <MenuItem value="korean">Korean</MenuItem>
                  <MenuItem value="english">English</MenuItem>
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
    </Dialog>
  );
};

export default PatientCreation;
