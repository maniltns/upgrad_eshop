import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Button,
  Box,
  Stepper,
  Step,
  StepLabel,
  Grid,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Divider,
} from '@mui/material';
import { toast } from 'react-toastify';
import { api } from '../../common/api';
import { formatPrice } from '../../common/utils';

const steps = ['Summary', 'Address', 'Confirm Order'];

const CreateOrder = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [orderDetails, setOrderDetails] = useState(null);

  useEffect(() => {
    // Load addresses from localStorage
    const savedAddresses = JSON.parse(localStorage.getItem('userAddresses') || '[]');
    setAddresses(savedAddresses);

    // Get order details from location state
    if (location.state?.productId && location.state?.quantity) {
      const fetchProductDetails = async () => {
        try {
          const product = await api.getProductById(location.state.productId);
          setOrderDetails({
            product,
            quantity: location.state.quantity,
            total: product.price * location.state.quantity
          });
        } catch (error) {
          toast.error('Failed to fetch product details');
          navigate('/products');
        }
      };
      fetchProductDetails();
    } else {
      navigate('/products');
    }
  }, [location.state, navigate]);

  const handleNext = () => {
    if (activeStep === 1 && !selectedAddress) {
      toast.error('Please select an address');
      return;
    }
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddress || !orderDetails) {
      toast.error('Missing order information');
      return;
    }

    try {
      await api.createOrder({
        productId: orderDetails.product.id,
        quantity: orderDetails.quantity,
        addressId: selectedAddress.id
      });
      toast.success('Order placed successfully!');
      navigate('/products');
    } catch (error) {
      toast.error(error.message || 'Failed to place order');
    }
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Order Summary
            </Typography>
            {orderDetails && (
              <>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Typography variant="subtitle1">
                      Product: {orderDetails.product.name}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="body1">
                      Price: {formatPrice(orderDetails.product.price)}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="body1">
                      Quantity: {orderDetails.quantity}
                    </Typography>
                  </Grid>
                  <Divider sx={{ width: '100%', my: 2 }} />
                  <Grid item xs={12}>
                    <Typography variant="h6">
                      Total: {formatPrice(orderDetails.total)}
                    </Typography>
                  </Grid>
                </Grid>
              </>
            )}
          </Box>
        );

      case 1:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Select Delivery Address
            </Typography>
            {addresses.length === 0 ? (
              <Typography color="error">
                No addresses found. Please add an address in your profile.
              </Typography>
            ) : (
              <FormControl component="fieldset">
                <FormLabel component="legend">Saved Addresses</FormLabel>
                <RadioGroup
                  value={selectedAddress ? JSON.stringify(selectedAddress) : ''}
                  onChange={(e) => setSelectedAddress(JSON.parse(e.target.value))}
                >
                  {addresses.map((address, index) => (
                    <FormControlLabel
                      key={index}
                      value={JSON.stringify(address)}
                      control={<Radio />}
                      label={
                        <Box>
                          <Typography variant="subtitle1">{address.name}</Typography>
                          <Typography variant="body2" color="text.secondary">
                            {`${address.street}, ${address.city}, ${address.state} - ${address.zipCode}`}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Phone: {address.phone}
                          </Typography>
                        </Box>
                      }
                    />
                  ))}
                </RadioGroup>
              </FormControl>
            )}
          </Box>
        );

      case 2:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Order Confirmation
            </Typography>
            {orderDetails && selectedAddress && (
              <>
                <Typography variant="subtitle1" gutterBottom>
                  Product Details
                </Typography>
                <Typography variant="body1">
                  {orderDetails.product.name} x {orderDetails.quantity}
                </Typography>
                <Typography variant="body1" gutterBottom>
                  Total: {formatPrice(orderDetails.total)}
                </Typography>

                <Divider sx={{ my: 2 }} />

                <Typography variant="subtitle1" gutterBottom>
                  Delivery Address
                </Typography>
                <Typography variant="body1">
                  {selectedAddress.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {`${selectedAddress.street}, ${selectedAddress.city}, ${selectedAddress.state} - ${selectedAddress.zipCode}`}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Phone: {selectedAddress.phone}
                </Typography>
              </>
            )}
          </Box>
        );

      default:
        return null;
    }
  };

  if (!orderDetails) {
    return null;
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
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

        {renderStepContent(activeStep)}

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
          <Button
            variant="outlined"
            onClick={activeStep === 0 ? () => navigate('/products') : handleBack}
          >
            {activeStep === 0 ? 'Cancel' : 'Back'}
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={activeStep === steps.length - 1 ? handlePlaceOrder : handleNext}
            disabled={activeStep === 1 && addresses.length === 0}
          >
            {activeStep === steps.length - 1 ? 'Place Order' : 'Next'}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default CreateOrder; 