import React, { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  InputBase,
  Menu,
  MenuItem,
} from '@mui/material';
import { ShoppingCart, Search as SearchIcon } from '@mui/icons-material';
import { styled, alpha } from '@mui/material/styles';
import { isAuthenticated, getIsAdmin, logout } from '../../common/auth';

const SearchContainer = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },
}));

const Navigation = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSearch = (e) => {
    if (e.key === 'Enter') {
      navigate(`/products?search=${searchQuery}`);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <IconButton
          component={RouterLink}
          to="/products"
          edge="start"
          color="inherit"
          aria-label="home"
        >
          <ShoppingCart />
        </IconButton>
        <Typography
          variant="h6"
          component={RouterLink}
          to="/products"
          sx={{
            flexGrow: 1,
            textDecoration: 'none',
            color: 'inherit',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          upGrad Eshop
        </Typography>

        {isAuthenticated() ? (
          <>
            <SearchContainer>
              <SearchIconWrapper>
                <SearchIcon />
              </SearchIconWrapper>
              <StyledInputBase
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleSearch}
              />
            </SearchContainer>

            {getIsAdmin() && (
              <Button
                color="inherit"
                component={RouterLink}
                to="/admin/add"
              >
                Add Product
              </Button>
            )}

            <Button
              color="inherit"
              onClick={handleMenu}
            >
              Account
            </Button>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem 
                component={RouterLink} 
                to="/profile"
                onClick={handleClose}
              >
                Profile
              </MenuItem>
              <MenuItem onClick={() => {
                handleClose();
                handleLogout();
              }}>
                Logout
              </MenuItem>
            </Menu>
          </>
        ) : (
          <>
            <Button color="inherit" component={RouterLink} to="/login">
              Login
            </Button>
            <Button color="inherit" component={RouterLink} to="/signup">
              Signup
            </Button>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navigation; 