import { Box, Typography, Button, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Home = ({ userEmail }) => {
  const navigate = useNavigate();

  //If user is logged in, navigate to chains page, otherwise navigate to signin page
  const handleExploreClick = () => {
    if (userEmail) {
      navigate('/chains');
    } else {
      navigate('/signin');
    }
  };

  return (
    <Box sx={{ 
      width: '100%',
      minHeight: '100%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      p: { xs: 2, sm: 3, md: 4 },
      background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
      color: 'white'
    }}>
      <Paper elevation={3} sx={{ 
        p: { xs: 2, sm: 3, md: 4 },
        maxWidth: 800,
        width: '100%',
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        color: 'text.primary'
      }}>
        <Typography 
          variant="h2" 
          gutterBottom 
          sx={{ 
            fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
            fontWeight: 'bold'
          }}
        >
          Welcome to Food Delivery
        </Typography>
        <Typography 
          variant="h5" 
          color="text.secondary" 
          paragraph
          sx={{ 
            fontSize: { xs: '1rem', sm: '1.25rem', md: '1.5rem' },
            mb: 4
          }}
        >
          Order delicious meals from your favorite restaurants and get them delivered to your door in minutes!
        </Typography>
        <Button
          variant="contained"
          size="large"
          onClick={handleExploreClick}
          sx={{ 
            mt: 2,
            px: 4,
            py: 1.5,
            fontSize: { xs: '1rem', sm: '1.1rem', md: '1.2rem' }
          }}
        >
          Explore Our Offers!
        </Button>
      </Paper>
    </Box>
  );
};

export default Home;