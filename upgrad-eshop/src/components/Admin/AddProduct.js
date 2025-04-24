import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
} from '@mui/material';
import { toast } from 'react-toastify';
import { api } from '../../common/api';
import { PRODUCT_CATEGORIES } from '../../common/utils';

const AddProduct = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    image: '',
  });
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.description) newErrors.description = 'Description is required';
    if (!formData.price) {
      newErrors.price = 'Price is required';
    } else if (isNaN(formData.price) || formData.price <= 0) {
      newErrors.price = 'Price must be a positive number';
    }
    if (!formData.category) newErrors.category = 'Category is required';
    if (!formData.image) newErrors.image = 'Image URL is required';
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
      const productData = {
        ...formData,
        price: parseFloat(formData.price),
      };
      await api.addProduct(productData);
      toast.success(`Product ${formData.name} added successfully`);
      navigate('/products');
    } catch (error) {
      toast.error(error.message || 'Failed to add product');
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom align="center">
          Add New Product
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Product Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                error={!!errors.name}
                helperText={errors.name}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                error={!!errors.description}
                helperText={errors.description}
                multiline
                rows={4}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Price"
                name="price"
                type="number"
                value={formData.price}
                onChange={handleChange}
                error={!!errors.price}
                helperText={errors.price}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth error={!!errors.category}>
                <InputLabel>Category</InputLabel>
                <Select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  label="Category"
                  required
                >
                  {PRODUCT_CATEGORIES.map((category) => (
                    <MenuItem key={category} value={category}>
                      {category}
                    </MenuItem>
                  ))}
                </Select>
                {errors.category && (
                  <Typography color="error" variant="caption">
                    {errors.category}
                  </Typography>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Image URL"
                name="image"
                value={formData.image}
                onChange={handleChange}
                error={!!errors.image}
                helperText={errors.image}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Button
                  variant="outlined"
                  onClick={() => navigate('/products')}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                >
                  Add Product
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
};

export default AddProduct; 