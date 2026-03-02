import { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Button,
  Box,
  Grid,
  IconButton,
  Divider,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { Add, Remove, Delete } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Cart = ({ cartItems, onQuantityChange, onRemoveItem, primaryAddressId, primaryCardNumber, userEmail }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  const [total, setTotal] = useState(0);
  // const [highestOrder, setHighestOrder] = useState(0);

  useEffect(() => {
    const newTotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    setTotal(newTotal);
  }, [cartItems]);

  const handleQuantityChange = (itemId, change) => {
    onQuantityChange(itemId, change);
  };

  const handleRemoveItem = (itemId) => {
    onRemoveItem(itemId);
  };

  const handleOrderNow = async () => {
    if (!primaryAddressId) {
      alert('Please set a primary address in your profile before placing an order.');
      return;
    }
    if (!primaryCardNumber) {
      alert('Please set a primary payment card in your profile before placing an order.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:3000/orderDetails/', {
        email_address: userEmail,
        total_amount: total,
        address_id: primaryAddressId,
        card_number: primaryCardNumber,
        total_price: total
      });
      if (response.status === 201) {
        console.log('Order placed successfully:', response.data);
        navigate('/delivery');
      }
      else {
        console.log('Order placed unsuccessfully:', response.data);
      }
    } catch (error) {
      console.error('Error placing order:', error);
      alert('There was an error placing your order. Please try again.');
    }

    try {
      const response = await axios.get('http://localhost:3000/orderDetails/'); 
      let highestOrder = 0;
      for (let i = 0; i < response.data.orders.length; i++) {
        if (response.data.orders[i].order_id > highestOrder) {
          highestOrder = response.data.orders[i].order_id;
        }
      }

      for (let i = 0; i < cartItems.length; i++) {
        try {
          const response = await axios.post('http://localhost:3000/orderItems/', {
            order_id: highestOrder,
            item_id: cartItems[i].id,
            qty: cartItems[i].quantity,
            customer_preference: 'none'
          });
          if (response.status === 201) {
            console.log('Order placed successfully:', response.data);
          }
          else {
            console.log('Order placed unsuccessfully:', response.data);
          }
        } catch (error) {
          console.error('Error placing order:', error);
          alert('There was an error placing your order. Please try again.');
        }
      }
    } catch (error) {
      console.error('Error fetching order details:', error);
      alert('There was an error placing your order. Please try again.');
    }
  };

  return (
    <Box sx={{ 
      width: '100%',
      minHeight: '100%',
      p: { xs: 2, sm: 3, md: 4 },
      backgroundColor: '#f5f5f5'
    }}>
      <Container maxWidth="md" sx={{ p: 0 }}>
        <Typography 
          variant="h4" 
          gutterBottom
          sx={{ 
            fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' },
            fontWeight: 'bold',
            mb: 3
          }}
        >
          Shopping Cart
        </Typography>
        <Paper elevation={3} sx={{ 
          p: { xs: 2, sm: 3 },
          backgroundColor: 'white',
          borderRadius: 2
        }}>
          {cartItems.length === 0 ? (
            <Typography 
              variant="h6" 
              align="center" 
              sx={{ 
                py: 4,
                fontSize: { xs: '1rem', sm: '1.1rem' }
              }}
            >
              Your cart is empty
            </Typography>
          ) : (
            <>
              {cartItems.map((item) => (
                <Box key={item.id}>
                  <Grid 
                    container 
                    spacing={2} 
                    alignItems="center" 
                    sx={{ 
                      py: 2,
                      flexDirection: isMobile ? 'column' : 'row'
                    }}
                  >
                    <Grid item xs={12} sm={4}>
                      <Typography 
                        variant="h6"
                        sx={{ 
                          fontSize: { xs: '1rem', sm: '1.1rem' },
                          fontWeight: 'bold'
                        }}
                      >
                        {item.name}
                      </Typography>
                      <Typography 
                        variant="body2" 
                        color="text.secondary"
                        sx={{ 
                          fontSize: { xs: '0.8rem', sm: '0.9rem' }
                        }}
                      >
                        ${item.price}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <Box sx={{ 
                        display: 'flex', 
                        alignItems: 'center',
                        justifyContent: isMobile ? 'center' : 'flex-start'
                      }}>
                        <IconButton
                          size={isMobile ? 'small' : 'medium'}
                          onClick={() => handleQuantityChange(item.id, -1)}
                        >
                          <Remove />
                        </IconButton>
                        <Typography 
                          sx={{ 
                            mx: 2,
                            fontSize: { xs: '0.9rem', sm: '1rem' }
                          }}
                        >
                          {item.quantity}
                        </Typography>
                        <IconButton
                          size={isMobile ? 'small' : 'medium'}
                          onClick={() => handleQuantityChange(item.id, 1)}
                        >
                          <Add />
                        </IconButton>
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={3}>
                      <Typography 
                        variant="h6"
                        sx={{ 
                          fontSize: { xs: '1rem', sm: '1.1rem' },
                          fontWeight: 'bold',
                          textAlign: isMobile ? 'center' : 'left'
                        }}
                      >
                        ${(item.price * item.quantity).toFixed(2)}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={1}>
                      <Box sx={{ 
                        display: 'flex',
                        justifyContent: isMobile ? 'center' : 'flex-end'
                      }}>
                        <IconButton
                          color="error"
                          onClick={() => handleRemoveItem(item.id)}
                          size={isMobile ? 'small' : 'medium'}
                        >
                          <Delete />
                        </IconButton>
                      </Box>
                    </Grid>
                  </Grid>
                  <Divider />
                </Box>
              ))}
              <Box sx={{ 
                mt: 3, 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                flexDirection: isMobile ? 'column' : 'row',
                gap: 2
              }}>
                <Typography 
                  variant="h5"
                  sx={{ 
                    fontSize: { xs: '1.2rem', sm: '1.4rem' },
                    fontWeight: 'bold'
                  }}
                >
                  Total: ${total.toFixed(2)}
                </Typography>
                <Button 
                  variant="contained" 
                  color="primary" 
                  size="large"
                  fullWidth={isMobile}
                  onClick={handleOrderNow}
                  // disabled={!primaryAddressId || !primaryCardNumber}
                  sx={{ 
                    px: 4,
                    py: 1.5,
                    fontSize: { xs: '1rem', sm: '1.1rem' }
                  }}
                >
                  Order Now
                </Button>
              </Box>
            </>
          )}
        </Paper>
      </Container>
    </Box>
  );
};

export default Cart; 