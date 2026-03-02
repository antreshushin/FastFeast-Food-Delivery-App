import { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  useTheme,
  useMediaQuery,
  Stepper,
  Step,
  StepLabel,
  LinearProgress,
} from '@mui/material';
import axios from 'axios';

const deliveryStages = ["Preparing Order", "Cooking", "Waiting for Pickup", "On The Way!", "Delivered"];

const Delivery = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [currentStage, setCurrentStage] = useState(0);
  const [deliveryAgents, setDeliveryAgents] = useState([]);

  useEffect(() => {
    const fetchDeliveryAgents = async () => {
      try {
        const response = await axios.get('http://localhost:3000/deliveryAgent/available');
        console.log("hiiii",response.data);
        if (response.status === 200 && response.data) {
          const agents = response.data.agents.map(agent => ({
            id: agent.agent_id,
            phone: agent.phone_number,
          }));
          setDeliveryAgents(prevAgents => [...prevAgents, ...agents]);
          
          // Call addDelivery after setting delivery agents
          const addDelivery = async () => {
            let highestOrder = 0;
            try {
              const response = await axios.get('http://localhost:3000/orderDetails/'); 
              for (let i = 0; i < response.data.orders.length; i++) {
                if (response.data.orders[i].order_id > highestOrder) {
                  highestOrder = response.data.orders[i].order_id;
                }
              }
            } catch (error) {
              console.error('Error fetching order details:', error);
              alert('There was an error placing your order. Please try again.');
            }

            try {
              const response = await axios.post('http://localhost:3000/delivery/', 
                {
                  order_id: highestOrder,
                  agent_id: agents[0].id,
                  ETA: "2025-04-18T06:30",
                  status: "preparing"
                }
              );
              console.log("hiiii",response.data);
            }
            catch (error) {
              console.error('Error adding delivery:', error);
            }
          };
          
          addDelivery();
        }
      } catch (error) {
        console.error('Error fetching delivery agents:', error);
      }
    };

    fetchDeliveryAgents();
  }, []);

  useEffect(() => {
    if (currentStage < deliveryStages.length - 1) {
      const timer = setTimeout(() => {
        setCurrentStage(prev => prev + 1);
      }, 5000); // 20 seconds

      return () => clearTimeout(timer);
    }
  }, [currentStage]);

  const progress = (currentStage / (deliveryStages.length - 1)) * 100;

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
          Delivery Information
        </Typography>
        <Paper elevation={3} sx={{ 
          p: { xs: 2, sm: 3 },
          backgroundColor: 'white',
          borderRadius: 2
        }}>
          <Box sx={{ width: '100%', mb: 4 }}>
            <LinearProgress 
              variant="determinate" 
              value={progress} 
              sx={{ 
                height: 10,
                borderRadius: 5,
                backgroundColor: 'rgba(0, 0, 0, 0.1)',
                '& .MuiLinearProgress-bar': {
                  borderRadius: 5,
                  backgroundColor: theme.palette.primary.main,
                }
              }}
            />
          </Box>
          <Typography variant="h6" sx={{ mt: 2, textAlign: 'center' }}>
            Order has been assigned to Delivery Agent {deliveryAgents[0]?.id}
          </Typography>
          <Stepper activeStep={currentStage} alternativeLabel sx={{ mt: 4 }}>
            {deliveryStages.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          <Box sx={{ mt: 4, textAlign: 'center' }}>
            <Typography variant="h6" color="primary">
              Current Status: {deliveryStages[currentStage]}
            </Typography>
            {currentStage === deliveryStages.length - 1 && (
              <Typography variant="body1" sx={{ mt: 2, color: 'success.main' }}>
                Your order has been delivered! Thank you for choosing Food Delivery App.
              </Typography>
            )}
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default Delivery;
