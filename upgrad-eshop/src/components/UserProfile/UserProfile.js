import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Grid,
  Divider,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';
import { toast } from 'react-toastify';
import { getUserName } from '../../common/auth';

const UserProfile = () => {
  const [addresses, setAddresses] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [addressForm, setAddressForm] = useState({
    name: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    phone: '',
  });

  useEffect(() => {
    // Load addresses from localStorage
    const savedAddresses = JSON.parse(localStorage.getItem('userAddresses') || '[]');
    setAddresses(savedAddresses);
  }, []);

  const handleSaveAddresses = (newAddresses) => {
    setAddresses(newAddresses);
    localStorage.setItem('userAddresses', JSON.stringify(newAddresses));
  };

  const handleAddAddress = () => {
    setEditingAddress(null);
    setAddressForm({
      name: '',
      street: '',
      city: '',
      state: '',
      zipCode: '',
      phone: '',
    });
    setOpenDialog(true);
  };

  const handleEditAddress = (address) => {
    setEditingAddress(address);
    setAddressForm(address);
    setOpenDialog(true);
  };

  const handleDeleteAddress = (addressToDelete) => {
    const newAddresses = addresses.filter(addr => addr !== addressToDelete);
    handleSaveAddresses(newAddresses);
    toast.success('Address deleted successfully');
  };

  const handleSubmitAddress = (e) => {
    e.preventDefault();
    
    // Validate form
    if (!addressForm.name || !addressForm.street || !addressForm.city || 
        !addressForm.state || !addressForm.zipCode || !addressForm.phone) {
      toast.error('Please fill all fields');
      return;
    }

    let newAddresses;
    if (editingAddress) {
      // Update existing address
      newAddresses = addresses.map(addr => 
        addr === editingAddress ? addressForm : addr
      );
      toast.success('Address updated successfully');
    } else {
      // Add new address
      newAddresses = [...addresses, addressForm];
      toast.success('Address added successfully');
    }

    handleSaveAddresses(newAddresses);
    setOpenDialog(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAddressForm(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          Profile
        </Typography>
        
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            Personal Information
          </Typography>
          <Typography variant="body1">
            Name: {getUserName()}
          </Typography>
        </Box>

        <Divider sx={{ my: 3 }} />

        <Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">
              Saved Addresses
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={handleAddAddress}
            >
              Add New Address
            </Button>
          </Box>

          <List>
            {addresses.map((address, index) => (
              <ListItem
                key={index}
                secondaryAction={
                  <Box>
                    <IconButton 
                      edge="end" 
                      aria-label="edit"
                      onClick={() => handleEditAddress(address)}
                      sx={{ mr: 1 }}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton 
                      edge="end" 
                      aria-label="delete"
                      onClick={() => handleDeleteAddress(address)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                }
              >
                <ListItemText
                  primary={address.name}
                  secondary={`${address.street}, ${address.city}, ${address.state} - ${address.zipCode}`}
                />
              </ListItem>
            ))}
          </List>
        </Box>

        <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
          <DialogTitle>
            {editingAddress ? 'Edit Address' : 'Add New Address'}
          </DialogTitle>
          <DialogContent>
            <Box component="form" onSubmit={handleSubmitAddress} sx={{ mt: 2 }}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Full Name"
                    name="name"
                    value={addressForm.name}
                    onChange={handleChange}
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Street Address"
                    name="street"
                    value={addressForm.street}
                    onChange={handleChange}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="City"
                    name="city"
                    value={addressForm.city}
                    onChange={handleChange}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="State"
                    name="state"
                    value={addressForm.state}
                    onChange={handleChange}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="ZIP Code"
                    name="zipCode"
                    value={addressForm.zipCode}
                    onChange={handleChange}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Phone Number"
                    name="phone"
                    value={addressForm.phone}
                    onChange={handleChange}
                    required
                  />
                </Grid>
              </Grid>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
            <Button onClick={handleSubmitAddress} variant="contained" color="primary">
              {editingAddress ? 'Update' : 'Add'} Address
            </Button>
          </DialogActions>
        </Dialog>
      </Paper>
    </Container>
  );
};

export default UserProfile; 