import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Stepper,
  Step,
  StepLabel,
  Button,
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
} from '@mui/material';
import { toast } from 'react-toastify';
import { api } from '../../common/api';

const steps = ['Summary', 'Address', 'Confirm Order'];

const CreateOrder = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState('');
  const [newAddress, setNewAddress] = useState({
    street: '',
    city: '',
    state: '',
    zipCode: '',
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (location.state) {
      setProduct(location.state.product);
      setQuantity(location.state.quantity);
    } else {
      navigate('/products');
    }
    fetchAddresses();
  }, [location.state, navigate]);

  const fetchAddresses = async () => {
    try {
      const data = await api.getAddresses();
      setAddresses(data);
    } catch (error) {
      toast.error('Failed to fetch addresses');
    }
  };

  const handleNext = () => {
    if (activeStep === 1 && !selectedAddress && !validateNewAddress()) {
      return;
    }
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const validateNewAddress = () => {
    const newErrors = {};
    if (!newAddress.street) newErrors.street = 'Street is required';
    if (!newAddress.city) newErrors.city = 'City is required';
    if (!newAddress.state) newErrors.state = 'State is required';
    if (!newAddress.zipCode) newErrors.zipCode = 'Zip code is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddressChange = (e) => {
    setSelectedAddress(e.target.value);
  };

  const handleNewAddressChange = (e) => {
    const { name, value } = e.target;
    setNewAddress((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handleAddNewAddress = async () => {
    if (!validateNewAddress()) return;

    try {
      const address = await api.addAddress(newAddress);
      setAddresses([...addresses, address]);
      setSelectedAddress(address.id);
      toast.success('New address added successfully');
    } catch (error) {
      toast.error('Failed to add new address');
    }
  };

  const handlePlaceOrder = async () => {
    try {
      const orderData = {
        productId: product.id,
        quantity: quantity,
        addressId: selectedAddress,
      };
      await api.createOrder(orderData);
      toast.success('Order placed successfully!');
      navigate('/products');
    } catch (error) {
      toast.error('Failed to place order');
    }
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Box sx={{ mt: 2 }}>
            <Typography variant="h6" gutterBottom>
              Order Summary
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography>
                  Product: {product?.name}
                </Typography>
                <Typography>
                  Quantity: {quantity}
                </Typography>
                <Typography>
                  Total: ${(product?.price * quantity).toFixed(2)}
                </Typography>
              </Grid>
            </Grid>
          </Box>
        );

      case 1:
        return (
          <Box sx={{ mt: 2 }}>
            <Typography variant="h6" gutterBottom>
              Shipping Address
            </Typography>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Select Address</InputLabel>
              <Select
                value={selectedAddress}
                onChange={handleAddressChange}
                label="Select Address"
              >
                {addresses.map((address) => (
                  <MenuItem key={address.id} value={address.id}>
                    {`${address.street}, ${address.city}, ${address.state} ${address.zipCode}`}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
              Add New Address
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Street"
                  name="street"
                  value={newAddress.street}
                  onChange={handleNewAddressChange}
                  error={!!errors.street}
                  helperText={errors.street}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="City"
                  name="city"
                  value={newAddress.city}
                  onChange={handleNewAddressChange}
                  error={!!errors.city}
                  helperText={errors.city}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="State"
                  name="state"
                  value={newAddress.state}
                  onChange={handleNewAddressChange}
                  error={!!errors.state}
                  helperText={errors.state}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Zip Code"
                  name="zipCode"
                  value={newAddress.zipCode}
                  onChange={handleNewAddressChange}
                  error={!!errors.zipCode}
                  helperText={errors.zipCode}
                />
              </Grid>
              <Grid item xs={12}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleAddNewAddress}
                >
                  Add New Address
                </Button>
              </Grid>
            </Grid>
          </Box>
        );

      case 2:
        return (
          <Box sx={{ mt: 2 }}>
            <Typography variant="h6" gutterBottom>
              Confirm Order
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography>
                  Product: {product?.name}
                </Typography>
                <Typography>
                  Quantity: {quantity}
                </Typography>
                <Typography>
                  Total: ${(product?.price * quantity).toFixed(2)}
                </Typography>
                <Typography>
                  Shipping Address:{' '}
                  {addresses.find((a) => a.id === selectedAddress)?.street}
                </Typography>
              </Grid>
            </Grid>
          </Box>
        );

      default:
        return null;
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom align="center">
          Create Order
        </Typography>
        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        {getStepContent(activeStep)}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
          <Button
            disabled={activeStep === 0}
            onClick={handleBack}
          >
            Back
          </Button>
          {activeStep === steps.length - 1 ? (
            <Button
              variant="contained"
              color="primary"
              onClick={handlePlaceOrder}
            >
              Place Order
            </Button>
          ) : (
            <Button
              variant="contained"
              color="primary"
              onClick={handleNext}
            >
              Next
            </Button>
          )}
        </Box>
      </Paper>
    </Container>
  );
};

export default CreateOrder; 