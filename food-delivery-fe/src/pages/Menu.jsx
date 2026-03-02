import { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  TextField,
  Box,
  Chip,
  Rating,
  useTheme,
  useMediaQuery,
  Dialog,
  DialogContent,
  Paper,
  Snackbar,
  Alert
} from '@mui/material';
import { AddShoppingCart } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// Sample food items data
// const foodItems = [
//   {
//     id: 1,
//     name: 'Margherita Pizza',
//     description: 'Classic pizza with tomato sauce, mozzarella, and basil',
//     price: 12.99,
//     image: 'https://source.unsplash.com/random/300x200?pizza',
//     category: 'Specialty Pizza',
//     rating: 4.5,
//     allergens: ['Gluten', 'Dairy']
//   },
//   {
//     id: 2,
//     name: 'Ceasar Salad',
//     description: 'A green salad of romaine lettuce and croutons dressed with lemon juice (or lime juice), olive oil, eggs, Worcestershire sauce, anchovies, garlic, Dijon mustard, Parmesan and black pepper.',
//     price: 8.99,
//     image: 'https://source.unsplash.com/random/300x200?burger',
//     category: 'Salads',
//     rating: 4.2,
//     allergens: ['Gluten', 'Dairy']
//   },
//   {
//     id: 3,
//     name: 'Boston Cream Pie',
//     description: 'A cake made with tender vanilla sponge cake filled with silky vanilla pastry cream all topped by a glossy chocolate ganache. ',
//     price: 5.99,
//     image: 'https://source.unsplash.com/random/300x200?sushi',
//     category: 'Desserts',
//     rating: 4.8,
//     allergens: ['Gluten', 'Dairy']
//   },
//   // Add more items as needed
// ];

const Menu = ({ selectedChain, onAddToCart }) => {
  const [foodItems, setFoodItems] = useState([]);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [hoveredItem, setHoveredItem] = useState(null);
  const [dialogPosition, setDialogPosition] = useState({ top: 0, left: 0 });
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const response = await axios.get('http://localhost:3000/menuItems/');
        console.log('Menu Response:', response.data);
        if (response.status === 200) {
          const menuItems = response.data.menuItems.map(item => ({
            id: item.item_id,
            name: item.item_name,
            description: item.description,
            price: item.price,
            image: 'https://source.unsplash.com/random/300x200?sushi'
          }));
          setFoodItems(menuItems);
        }
      } catch (error) {
        console.error('Error fetching menu items:', error);
      }
    };

    fetchMenuItems();
  }, []);

  const filteredItems = foodItems.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const handleAddToCart = (item) => {
    onAddToCart(item);
    const newToast = {
      id: Date.now(),
      message: `${item.name} added to Cart`,
      open: true
    };
    setToasts(prev => [...prev, newToast]);
    setTimeout(() => {
      setToasts(prev => prev.filter(toast => toast.id !== newToast.id));
    }, 3000);
  };

  const handleMouseEnter = (event, item) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setDialogPosition({
      top: rect.top + window.scrollY,
      left: rect.left + window.scrollX
    });
    setHoveredItem(item);
  };

  const handleMouseLeave = () => {
    setHoveredItem(null);
  };

  return (
    <Box sx={{ 
      width: '100%',
      minHeight: '100%',
      p: { xs: 2, sm: 3, md: 4 },
      backgroundColor: '#f5f5f5'
    }}>
      <Container maxWidth="xl" sx={{ p: 0 }}>
        <Box sx={{ 
          mb: 4,
          display: 'flex',
          flexDirection: 'column',
          gap: 2
        }}>
          <TextField
            fullWidth
            label="Search food items"
            variant="outlined"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{ 
              backgroundColor: 'white',
              borderRadius: 1
            }}
          />
        </Box>

        <Grid container spacing={3} sx={{ 
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2, 1fr)',
            md: 'repeat(3, 1fr)',
            lg: 'repeat(4, 1fr)'
          },
          gap: 3
        }}>
          {filteredItems.map((item) => (
            <Grid item key={item.id} sx={{ 
              display: 'flex',
              height: '100%'
            }}>
              <Card 
                sx={{ 
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  cursor: 'pointer',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'scale(1.02)',
                    boxShadow: 6
                  }
                }}
              >
                <Box
                  onMouseEnter={(e) => handleMouseEnter(e, item)}
                  onMouseLeave={handleMouseLeave}
                  sx={{ position: 'relative' }}
                >
                  <CardMedia
                    component="img"
                    sx={{
                      width: '100%',
                      height: 200,
                      objectFit: 'cover'
                    }}
                    image={item.image}
                    alt={item.name}
                  />
                </Box>
                <CardContent sx={{ 
                  flexGrow: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 1
                }}>
                  <Typography 
                    gutterBottom 
                    variant="h6" 
                    component="h2"
                    sx={{ 
                      fontSize: { xs: '1rem', sm: '1.1rem', md: '1.25rem' },
                      fontWeight: 'bold',
                      minHeight: '2.5em',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
                    }}
                  >
                    {item.name}
                  </Typography>
                  <Typography 
                    variant="body2" 
                    color="text.secondary"
                    sx={{ 
                      fontSize: { xs: '0.8rem', sm: '0.9rem' },
                      flexGrow: 1,
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
                    }}
                  >
                    {item.description}
                  </Typography>
                  <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    mt: 'auto'
                  }}>
                    <Typography 
                      variant="h6" 
                      color="primary"
                      sx={{ 
                        fontSize: { xs: '1rem', sm: '1.1rem', md: '1.25rem' },
                        fontWeight: 'bold'
                      }}
                    >
                      ${item.price}
                    </Typography>
                    <Button
                      variant="contained"
                      startIcon={<AddShoppingCart />}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddToCart(item);
                      }}
                      size={isMobile ? 'small' : 'medium'}
                    >
                      Add
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {hoveredItem && (
          <Paper
            elevation={8}
            sx={{
              position: 'absolute',
              top: dialogPosition.top - 200,
              left: dialogPosition.left - 200,
              minWidth: 400,
              maxWidth: 600,
              zIndex: 1000,
              display: 'flex',
              flexDirection: 'column',
              transform: 'translate(50%, 50%)',
              backgroundColor: 'background.paper'
            }}
            onMouseEnter={() => setHoveredItem(hoveredItem)}
            onMouseLeave={handleMouseLeave}
          >
            <Box sx={{ 
              display: 'flex',
              width: '100%'
            }}>
              <CardMedia
                component="img"
                sx={{
                  width: '50%',
                  height: 200,
                  objectFit: 'cover'
                }}
                image={hoveredItem.image}
                alt={hoveredItem.name}
              />
              <CardMedia
                component="img"
                sx={{
                  width: '50%',
                  height: 200,
                  objectFit: 'cover'
                }}
                image={hoveredItem.image}
                alt={`${hoveredItem.name} - additional view`}
              />
            </Box>
            <Box sx={{ 
              width: '100%',
              height: '1px',
              backgroundColor: 'divider',
              my: 1
            }} />
            <Box sx={{ 
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              gap: 2
            }}>
              <Typography variant="h6" gutterBottom>
                {hoveredItem.name}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: 'pre-wrap' }}>
                {hoveredItem.description}
              </Typography>
            </Box>
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              mt: 2
            }}>
              <Button
                variant="contained"
                startIcon={<AddShoppingCart />}
                onClick={(e) => {
                  e.stopPropagation();
                  handleAddToCart(hoveredItem);
                }}
                size="large"
              >
                Add to Cart
              </Button>
            </Box>
          </Paper>
        )}
      </Container>

      {/* Toast Notifications */}
      <Box sx={{ 
        position: 'fixed',
        bottom: 16,
        right: 16,
        zIndex: 2000,
        display: 'flex',
        flexDirection: 'column',
        gap: 1
      }}>
        {toasts.map((toast, index) => (
          <Snackbar
            key={toast.id}
            open={toast.open}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            sx={{ 
              position: 'relative',
              bottom: `${index * 60}px`,
              transition: 'bottom 0.3s ease-in-out'
            }}
          >
            <Alert 
              severity="success" 
              sx={{ 
                width: '100%',
                boxShadow: 3
              }}
            >
              {toast.message}
            </Alert>
          </Snackbar>
        ))}
      </Box>
    </Box>
  );
};

export default Menu; 