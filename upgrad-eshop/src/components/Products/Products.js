import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  IconButton,
  CardActions,
} from '@mui/material';
import { Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';
import { toast } from 'react-toastify';
import { api } from '../../common/api';
import { getIsAdmin } from '../../common/auth';
import { formatPrice, PRODUCT_CATEGORIES } from '../../common/utils';

const Products = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortBy, setSortBy] = useState('');
  const searchParams = new URLSearchParams(location.search);
  const searchQuery = searchParams.get('search');
  const [searchText, setSearchText] = useState(searchQuery || '');
  const isAdmin = getIsAdmin();

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    filterAndSortProducts();
  }, [products, selectedCategory, sortBy, searchText]);

  const fetchProducts = async () => {
    try {
      const data = await api.getProducts();
      setProducts(data);
    } catch (error) {
      toast.error('Failed to fetch products');
    }
  };

  const filterAndSortProducts = () => {
    let filtered = [...products];

    // Apply category filter
    if (selectedCategory) {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    // Apply search filter
    if (searchText) {
      const searchLower = searchText.toLowerCase();
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchLower) ||
        product.description.toLowerCase().includes(searchLower)
      );
    }

    // Apply sorting
    if (sortBy === 'priceLowToHigh') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'priceHighToLow') {
      filtered.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'newest') {
      filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    setFilteredProducts(filtered);
  };

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
  };

  const handleSortChange = (event) => {
    setSortBy(event.target.value);
  };

  const handleSearchChange = (event) => {
    setSearchText(event.target.value);
    if (!event.target.value) {
      navigate('/products');
    }
  };

  const handleProductClick = (productId) => {
    navigate(`/products/${productId}`);
  };

  const handleEditProduct = (event, productId) => {
    event.stopPropagation();
    navigate(`/admin/edit/${productId}`);
  };

  const handleDeleteProduct = async (event, productId) => {
    event.stopPropagation();
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await api.deleteProduct(productId);
        toast.success('Product deleted successfully');
        fetchProducts();
      } catch (error) {
        toast.error('Failed to delete product');
      }
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Search Products"
              value={searchText}
              onChange={handleSearchChange}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select
                value={selectedCategory}
                label="Category"
                onChange={handleCategoryChange}
              >
                <MenuItem value="">All Categories</MenuItem>
                {PRODUCT_CATEGORIES.map((category) => (
                  <MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              <InputLabel>Sort By</InputLabel>
              <Select
                value={sortBy}
                label="Sort By"
                onChange={handleSortChange}
              >
                <MenuItem value="">None</MenuItem>
                <MenuItem value="priceLowToHigh">Price: Low to High</MenuItem>
                <MenuItem value="priceHighToLow">Price: High to Low</MenuItem>
                <MenuItem value="newest">Newest First</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Box>

      <Grid container spacing={3}>
        {filteredProducts.map((product) => (
          <Grid item key={product.id} xs={12} sm={6} md={4}>
            <Card 
              sx={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                cursor: 'pointer',
                '&:hover': {
                  boxShadow: 6,
                },
              }}
              onClick={() => handleProductClick(product.id)}
            >
              <CardMedia
                component="img"
                height="200"
                image={product.image}
                alt={product.name}
                sx={{ objectFit: 'contain', p: 2 }}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://via.placeholder.com/200x200?text=Image+not+available';
                }}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h6" component="h2">
                  {product.name}
                </Typography>
                <Typography variant="h6" color="primary" gutterBottom>
                  {formatPrice(product.price)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {product.description}
                </Typography>
              </CardContent>
              {isAdmin && (
                <CardActions sx={{ justifyContent: 'flex-end' }}>
                  <IconButton
                    size="small"
                    onClick={(e) => handleEditProduct(e, product.id)}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={(e) => handleDeleteProduct(e, product.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </CardActions>
              )}
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Products; 