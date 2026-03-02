import { Box, Button, Typography, Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';

// const chains = [
//   {
//     name: "McDonald's",
//     address: "123 Main St, Boston, MA",
//     hours: "6:00 AM - 11:00 PM"
//   },
//   {
//     name: "Burger King",
//     address: "456 Oak Ave, Boston, MA",
//     hours: "7:00 AM - 10:00 PM"
//   },
//   {
//     name: "Wendy's",
//     address: "789 Pine St, Boston, MA",
//     hours: "6:30 AM - 10:30 PM"
//   },
//   {
//     name: "Subway",
//     address: "321 Elm St, Boston, MA",
//     hours: "7:00 AM - 9:00 PM"
//   }
// ];

const Chains = ({ onChainSelect }) => {
  const navigate = useNavigate();
  const [chains, setChains] = useState([]);

  useEffect(() => {
    const fetchChains = async () => {
      try {
        const response = await axios.get('http://localhost:3000/chain/getChain');
        console.log('Chain Response:', response.data);
        
        if (response.status === 200 && response.data) {
          const chainList = response.data.chain || [];
          console.log('Chain List:', chainList);
          
          const chainData = chainList.map(chain => ({
            id: chain.chain_id,
            name: chain.name,
            address: chain.address,
            phone_number: chain.phone_number,
            hours: chain.operating_hours
          }));
          setChains(chainData);
        } else {
          console.error('Invalid chain response structure:', response.data);
        }
      } catch (error) {
        console.error('Error fetching chains:', error);
      }
    };

    fetchChains();
  }, []);

  const handleChainClick = (chain) => {
    onChainSelect(chain.name);
    navigate('/menu');
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom align="center">
        Select a Restaurant Chain
      </Typography>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          mt: 4
        }}
      >
        {chains.map((chain) => (
          <Button
            key={chain.name}
            variant="outlined"
            onClick={() => handleChainClick(chain)}
            sx={{
              p: 3,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              textTransform: 'none',
              borderWidth: 2,
              '&:hover': {
                borderWidth: 2
              }
            }}
          >
            <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
              {chain.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {chain.address}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Hours: {chain.hours}
            </Typography>
          </Button>
        ))}
      </Box>
    </Container>
  );
};

export default Chains;

