import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Link,
  Alert,
  Divider,
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { toast } from 'react-toastify';
import { api } from '../../common/api';
import { setAuthToken, setIsAdmin, setUserName } from '../../common/auth';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const response = await api.login(formData);
      setAuthToken(response.token);
      setIsAdmin(response.isAdmin);
      setUserName(response.name);
      toast.success('Login successful!');
      navigate('/products');
    } catch (error) {
      toast.error(error.message || 'Login failed');
    }
  };

  const setTestCredentials = (isAdmin) => {
    setFormData({
      email: isAdmin ? 'admin@test.com' : 'user@test.com',
      password: isAdmin ? 'admin123' : 'user123',
    });
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom align="center">
            Login
          </Typography>
          
          <Alert severity="info" sx={{ mb: 3 }}>
            <Typography variant="body2">
              Test Credentials:
              <Box component="ul" sx={{ mt: 1, mb: 0 }}>
                <li>Admin - Email: admin@test.com / Password: admin123</li>
                <li>User - Email: user@test.com / Password: user123</li>
              </Box>
            </Typography>
          </Alert>

          <Box sx={{ mb: 2 }}>
            <Button
              fullWidth
              variant="outlined"
              onClick={() => setTestCredentials(true)}
              sx={{ mb: 1 }}
            >
              Use Admin Credentials
            </Button>
            <Button
              fullWidth
              variant="outlined"
              onClick={() => setTestCredentials(false)}
            >
              Use User Credentials
            </Button>
          </Box>

          <Divider sx={{ my: 3 }}>OR</Divider>

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              error={!!errors.email}
              helperText={errors.email}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              error={!!errors.password}
              helperText={errors.password}
              margin="normal"
              required
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              sx={{ mt: 3, mb: 2 }}
            >
              Login
            </Button>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body2">
                Don't have an account?{' '}
                <Link component={RouterLink} to="/signup">
                  Sign up
                </Link>
              </Typography>
            </Box>
          </form>
        </Paper>
      </Box>
    </Container>
  );
};

export default Login; 