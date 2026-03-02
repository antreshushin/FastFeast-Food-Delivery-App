import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Link,
  IconButton,
} from '@mui/material';
import { ShoppingCart, AccountCircle } from '@mui/icons-material';

const Navbar = ({ userEmail, onLogout }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate('/');
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          <Link component={RouterLink} to="/" color="inherit" underline="none">
            Food Delivery App
          </Link>
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          {userEmail && (
            <>
              <Button 
                color="inherit" 
                onClick={() => navigate('/chains')}
              >
                Chains
              </Button>
              <IconButton 
                color="inherit" 
                onClick={() => navigate('/cart')}
              >
                <ShoppingCart />
              </IconButton>
              <Button 
                color="inherit" 
                startIcon={<AccountCircle />}
                onClick={() => navigate('/profile')}
              >
                Profile
              </Button>
            </>
          )}
          {userEmail ? (
            <Button color="inherit" onClick={handleLogout}>
              Log Out
            </Button>
          ) : (
            <Button color="inherit" onClick={() => navigate('/signin')}>
              Sign In
            </Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar; 