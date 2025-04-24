import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Import components (to be created)
import Login from './components/Login/Login';
import Signup from './components/Signup/Signup';
import Products from './components/Products/Products';
import ProductDetails from './components/ProductDetails/ProductDetails';
import CreateOrder from './components/CreateOrder/CreateOrder';
import AddProduct from './components/Admin/AddProduct';
import EditProduct from './components/Admin/EditProduct';
import Navigation from './components/Navigation/Navigation';
import UserProfile from './components/UserProfile/UserProfile';

// Import auth utilities
import { isAuthenticated, getIsAdmin } from './common/auth';

// Create theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#3f51b5',
    },
  },
});

// Protected Route component
const ProtectedRoute = ({ children, requireAdmin = false }) => {
  if (!isAuthenticated()) {
    return <Navigate to="/login" />;
  }

  if (requireAdmin && !getIsAdmin()) {
    return <Navigate to="/products" />;
  }

  return children;
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Navigation />
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Protected routes */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <UserProfile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/products"
            element={
              <ProtectedRoute>
                <Products />
              </ProtectedRoute>
            }
          />
          <Route
            path="/products/:id"
            element={
              <ProtectedRoute>
                <ProductDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="/orders/new"
            element={
              <ProtectedRoute>
                <CreateOrder />
              </ProtectedRoute>
            }
          />

          {/* Admin routes */}
          <Route
            path="/admin/add"
            element={
              <ProtectedRoute requireAdmin>
                <AddProduct />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/edit/:id"
            element={
              <ProtectedRoute requireAdmin>
                <EditProduct />
              </ProtectedRoute>
            }
          />

          {/* Default route */}
          <Route path="/" element={<Navigate to="/products" />} />
        </Routes>
        <ToastContainer position="bottom-right" />
      </Router>
    </ThemeProvider>
  );
}

export default App;
