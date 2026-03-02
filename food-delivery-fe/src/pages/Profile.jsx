import { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box,
  Typography,
  Avatar,
  Paper,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  Divider,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon, CreditCard as CreditCardIcon } from '@mui/icons-material';

//Profile page that displays user data
//Gets user email from props from parent component. 
const Profile = ({ userEmail, onPrimaryAddressChange, onPrimaryCardChange }) => {
   //State variables for user data
   const [userData, setUserData] = useState({
    fullName: 'John Doe',
    email: userEmail,
    profileImage: null, // null means use default image
    primaryAddress: 1, // Initially set to the first address's ID
    primaryCard: '**** **** **** 1234', // Initially set to the first card's number
    addresses: [],
    cards: []
  });
 
  //Run as soon as the component mounts to get user data from API
  useEffect(() => {
    const fetchUserData = async () => {
      // Fetch user details
      try {
        const userResponse = await axios.get('http://localhost:3000/auth/getUserDetails?email=' + userEmail);
        if (userResponse.status === 200) {
          setUserData(prevData => ({
            ...prevData,
            fullName: userResponse.data.message.name
          }));
        }
      } catch (error) {
        console.error('Error fetching user details:', error);
      }

      // Fetch addresses
      try {
        const addressResponse = await axios.get('http://localhost:3000/address/getAddress?email_address=' + userEmail); 
        if (addressResponse.status === 200) {
          const addresses = addressResponse.data.addresses.map(address => ({
            addressLine1: address.street_address1,
            addressLine2: address.street_address2,
            city: address.city_name,
            state: address.state_name,
            zip: address.zip_code,
            isPrimary: address.is_primary,
            id: address.address_id
          }));

          // Find and set primary address
          const primaryAddress = addresses.find(addr => addr.isPrimary);
          if (primaryAddress) {
            userData.primaryAddress = primaryAddress.id;
            onPrimaryAddressChange(primaryAddress.id);
          }

          setUserData(prev => ({
            ...prev,
            addresses: addresses,
            primaryAddress: primaryAddress ? primaryAddress.id : null
          }));
        }
      } catch (error) {
        console.error('Error fetching addresses:', error);
      }

      // Fetch payment methods
      try {
        const paymentResponse = await axios.get('http://localhost:3000/payment/getPaymentMethod?email_address=' + userEmail);
        if (paymentResponse.status === 200 && paymentResponse.data) {
          const paymentMethods = paymentResponse.data.paymentMethod;          
          const cards = paymentMethods.map(card => ({
            cardholderName: card.cardholder_name,
            cardNumber: card.card_number,
            expiryDate: card.expiry_date,
            cvv: card.cvv,
            billingZip: card.zip_code,
            cardType: card.card_type,
            method: card.method,
            isPrimary: card.is_primary
          }));

          // Find and set primary card
          const primaryCard = cards.find(card => card.isPrimary);
          if (primaryCard) {
            userData.primaryCard = primaryCard.cardNumber;
            onPrimaryCardChange(primaryCard.cardNumber);
          }

          setUserData(prev => ({
            ...prev,
            cards: cards,
            primaryCard: primaryCard ? primaryCard.cardNumber : null
          }));
        } else {
          console.error('Invalid payment response structure:', paymentResponse.data);
        }
      } catch (error) {
        console.error('Error fetching payment methods:', error);
      }
    };

    fetchUserData();
  }, [userEmail, onPrimaryAddressChange, onPrimaryCardChange]); 


  //State variables for address and card forms
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [newAddress, setNewAddress] = useState({
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    zip: ''
  });
  const [addressErrors, setAddressErrors] = useState({});

  const [showCardForm, setShowCardForm] = useState(false);
  const [newCard, setNewCard] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    billingZip: '',
    cardType: ''
  });
  const [cardErrors, setCardErrors] = useState({});

  //Handles input changes for address form
  const handleAddressInputChange = (e) => {
    const { name, value } = e.target;
    setNewAddress(prev => ({
      ...prev,
      [name]: value
    }));
    if (addressErrors[name]) {
      setAddressErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  //handles user creation of new address card
  const handleCardInputChange = (e) => {
    const { name, value } = e.target;
    setNewCard(prev => ({
      ...prev,
      [name]: value
    }));
    if (cardErrors[name]) {
      setCardErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  //checks that all fields in new address form are filled out
  const validateAddressForm = () => {
    const newErrors = {};
    if (!newAddress.addressLine1) newErrors.addressLine1 = 'Address Line 1 is required';
    if (!newAddress.city) newErrors.city = 'City is required';
    if (!newAddress.state) newErrors.state = 'State is required';
    if (!newAddress.zip) newErrors.zip = 'ZIP code is required';
    
    setAddressErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  //checks that the user provided values for new address are valid
  const validateCardForm = () => {
    const newErrors = {};
    if (!newCard.cardNumber) newErrors.cardNumber = 'Card number is required';
    else if (!/^\d{16}$/.test(newCard.cardNumber)) newErrors.cardNumber = 'Card number must be 16 digits';
    if (!newCard.expiryDate) newErrors.expiryDate = 'Expiry date is required';
    else if (!/^\d{4}-\d{2}-\d{2}$/.test(newCard.expiryDate)) newErrors.expiryDate = 'Expiry date must be in YYYY-MM-DD format';
    if (!newCard.cvv) newErrors.cvv = 'CVV is required';
    else if (!/^\d{3}$/.test(newCard.cvv)) newErrors.cvv = 'CVV must be 3 digits';
    if (!newCard.billingZip) newErrors.billingZip = 'Billing ZIP is required';
    else if (!/^\d{5}$/.test(newCard.billingZip)) newErrors.billingZip = 'ZIP must be 5 digits';
    if (!newCard.cardType) newErrors.cardType = 'Card type is required';
    else if (!['credit', 'debit'].includes(newCard.cardType)) newErrors.cardType = 'Card type must be either credit or debit';
    
    setCardErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  //handles changing the primary address
  const handleSetPrimaryAddress = async (addressId) => {
    // onPrimaryAddressChange(addressId);
    try {
      const response = await axios.post('http://localhost:3000/address/setPrimaryAddress?oldPrimaryId=' + userData.primaryAddress + '&newPrimaryId=' + addressId);
      if (response.status === 200) {
        setUserData(prev => ({
          ...prev,
          primaryAddress: addressId,
          addresses: prev.addresses.map(addr => ({
            ...addr,
            isPrimary: addr.id === addressId
          }))
        }));
        userData.primaryAddress = addressId;
        onPrimaryAddressChange(addressId);
      }
    } catch (error) {
      console.error('Error setting primary address:', error);
    }
  };

  //handles the submit button for the new address form
  const handleAddressSubmit = async () => {
    let isPrim = false;
    if (userData.addresses.length === 0) {
      isPrim = true;
    }
    try {
      //get the row count of the addresses table
      const response = await axios.get('http://localhost:3000/address/rowCount');
      if (response.status === 200) {
        const rowCount = response.data.rowCount[0][0]["COUNT(*)"];
        console.log(response.data);
        console.log(rowCount);
        if (validateAddressForm()) {
          const newAddressWithId = {
            ...newAddress,
            id: rowCount + 1,
            isPrimary: isPrim // Set as primary if it's the first address
          };
    
          try {
            console.log('New Address With Id:', newAddressWithId.id);
            const response = await axios.post('http://localhost:3000/address/createAddress?email_address=' + userEmail, {
              email_address: userEmail,
              street_address1: newAddress.addressLine1,
              street_address2: newAddress.addressLine2,
              city_name: newAddress.city,
              state_name: newAddress.state,
              zip_code: newAddress.zip,
              is_primary: newAddressWithId.isPrim
            });
            if (response.status === 200) {
              console.log(response.data);
            }
          } catch (error) {
            console.error('Error sending user data:', error);
          }
          
          setUserData(prev => ({
            ...prev,
            addresses: [...prev.addresses, newAddressWithId],
            primaryAddress: prev.addresses.length === 0 ? newAddressWithId.id : prev.primaryAddress
          }));
    
          setNewAddress({
            addressLine1: '',
            addressLine2: '',
            city: '',
            state: '',
            zip: ''
          });
          setShowAddressForm(false);
          setAddressErrors({});
        }

      }
    } catch (error) {
      console.error('Error fetching row count:', error);
    }

  };

  //handles the delete button for the new address form
  const handleDeleteAddress = async (addressId) => {
    try {
      console.log(addressId);
      const response = await axios.delete(`http://localhost:3000/address/deleteAddress?address_id=${addressId}`);
      if (response.status === 200) {
        setUserData(prev => {
          const newAddresses = prev.addresses.filter(addr => addr.id !== addressId);
          return {
            ...prev,
            addresses: newAddresses,
            primaryAddress: addressId === prev.primaryAddress 
              ? (newAddresses.length > 0 ? newAddresses[0].id : null)
              : prev.primaryAddress
          };
        });
      }
    } catch (error) {
      console.error('Error deleting address:', error);
    }
  };

  //handles changing the primary card
  const handleSetPrimaryCard = async (cardNumber) => {
    try {
      console.log(userData.primaryCard);
      console.log(cardNumber);
      const response = await axios.post('http://localhost:3000/payment/setPrimaryCard?oldCardNumber=' + userData.primaryCard + '&newCardNumber=' + cardNumber);
      if (response.status === 200) {
        setUserData(prev => ({
          ...prev,
          primaryCard: cardNumber,
          cards: prev.cards.map(card => ({
            ...card,
            isPrimary: card.cardNumber === cardNumber
          }))
        }));
        userData.primaryCard = cardNumber;
        onPrimaryCardChange(cardNumber);
      }
    } catch (error) {
      console.error('Error setting primary card:', error);
    }
  };

  //handles the submit button for the new card form
  const handleCardSubmit = async () => {
    if (validateCardForm()) {
      try {
        let isPrim = false;
        if (userData.cards.length === 0) {
          isPrim = true;
        }
        const response = await axios.post('http://localhost:3000/payment/createPaymentMethod', {
          email_address: userEmail,
          card_number: newCard.cardNumber,
          expiry_date: newCard.expiryDate,
          cvv: newCard.cvv,
          method: newCard.cardType,
          zip_code: newCard.billingZip,
          card_type: newCard.cardType,
          is_primary: isPrim
        });
        if (response.status === 200) {
          console.log(response.data);
        }
      } catch (error) {
        console.error('Error sending user data:', error);
      }

      const newCardWithId = {
        ...newCard,
        isPrimary: userData.cards.length === 0
      };
      
      setUserData(prev => ({
        ...prev,
        cards: [...prev.cards, newCardWithId],
        primaryCard: prev.cards.length === 0 ? newCardWithId.cardNumber : prev.primaryCard
      }));

      setNewCard({
        cardNumber: '',
        expiryDate: '',
        cvv: '',
        billingZip: '',
        cardType: ''
      });
      setShowCardForm(false);
      setCardErrors({});
    }
  };

  //handles the delete button for each card in the card list
  const handleDeleteCard = async (cardNumber) => {
    try {
      const response = await axios.delete(`http://localhost:3000/payment/deletePaymentMethod?card_number=${cardNumber}`);
      if (response.status === 200) {
        setUserData(prev => {
          const newCards = prev.cards.filter(card => card.cardNumber !== cardNumber);
          return {
            ...prev,
            cards: newCards,
            primaryCard: cardNumber === prev.primaryCard 
              ? (newCards.length > 0 ? newCards[0].cardNumber : null)
              : prev.primaryCard
          };
        });
      }
    } catch (error) {
      console.error('Error deleting card:', error);
    }
  };

  return (
    <Box sx={{ 
      width: '100%',
      maxWidth: '100%',
      mx: 'auto', 
      p: 3,
      display: 'flex',
      flexDirection: 'column',
      gap: 3
    }}>
      {/* Profile Image */}
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center',
        gap: 2
      }}>
        <Avatar
          src={userData.profileImage}
          sx={{ 
            width: 240,
            height: 240,
            bgcolor: 'grey.300'
          }}
        />
        <Typography variant="h5" component="h1">
          {userData.fullName}
        </Typography>
      </Box>

      {/* Account Details */}
      <Paper elevation={2} sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Account Details
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Typography>
            <strong>Full Name:</strong> {userData.fullName}
          </Typography>
          <Typography>
            <strong>Email:</strong> {userData.email}
          </Typography>
        </Box>
      </Paper>

      {/* Addresses Section */}
      <Paper elevation={2} sx={{ p: 3 }}>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          mb: 2
        }}>
          <Typography variant="h6">
            Addresses
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setShowAddressForm(true)}
          >
            Add Address
          </Button>
        </Box>

        {/* Address Form */}
        {showAddressForm && (
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            gap: 2,
            mb: 3,
            p: 2,
            bgcolor: 'grey.50',
            borderRadius: 1
          }}>
            <TextField
              label="Address Line 1"
              name="addressLine1"
              value={newAddress.addressLine1}
              onChange={handleAddressInputChange}
              error={!!addressErrors.addressLine1}
              helperText={addressErrors.addressLine1}
              required
              fullWidth
            />
            <TextField
              label="Address Line 2"
              name="addressLine2"
              value={newAddress.addressLine2}
              onChange={handleAddressInputChange}
              fullWidth
            />
            <TextField
              label="City"
              name="city"
              value={newAddress.city}
              onChange={handleAddressInputChange}
              error={!!addressErrors.city}
              helperText={addressErrors.city}
              required
              fullWidth
            />
            <TextField
              label="State"
              name="state"
              value={newAddress.state}
              onChange={handleAddressInputChange}
              error={!!addressErrors.state}
              helperText={addressErrors.state}
              required
              fullWidth
            />
            <TextField
              label="ZIP"
              name="zip"
              value={newAddress.zip}
              onChange={handleAddressInputChange}
              error={!!addressErrors.zip}
              helperText={addressErrors.zip}
              required
              fullWidth
            />
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between',
              width: '100%'
            }}>
              <Button
                variant="outlined"
                onClick={() => {
                  setShowAddressForm(false);
                  setNewAddress({
                    addressLine1: '',
                    addressLine2: '',
                    city: '',
                    state: '',
                    zip: ''
                  });
                  setAddressErrors({});
                }}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                onClick={handleAddressSubmit}
              >
                Submit
              </Button>
            </Box>
          </Box>
        )}

        {/* Address List */}
        <List>
          {userData.addresses.map((address) => (
            <ListItem
              key={address.id}
              secondaryAction={
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button
                    variant="outlined"
                    color={address.isPrimary ? "success" : "primary"}
                    size="small"
                    onClick={() => handleSetPrimaryAddress(address.id)}
                    disabled={address.isPrimary}
                  >
                    {address.isPrimary ? "Primary" : "Set as Primary"}
                  </Button>
                  <IconButton
                    edge="end"
                    aria-label="delete"
                    onClick={() => handleDeleteAddress(address.id)}
                    disabled={address.isPrimary && userData.addresses.length > 1}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              }
            >
              <ListItemText
                primary={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {address.isPrimary && (
                      <Typography
                        variant="caption"
                        sx={{
                          bgcolor: 'success.main',
                          color: 'white',
                          px: 1,
                          py: 0.5,
                          borderRadius: 1
                        }}
                      >
                        Primary
                      </Typography>
                    )}
                    {`${address.addressLine1}${address.addressLine2 ? `, ${address.addressLine2}` : ''}, ${address.city}, ${address.state} ${address.zip}`}
                  </Box>
                }
              />
            </ListItem>
          ))}
        </List>
      </Paper>

      {/* Payment Methods Section */}
      <Paper elevation={2} sx={{ p: 3 }}>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          mb: 2
        }}>
          <Typography variant="h6">
            Payment Methods
          </Typography>
          <Button
            variant="contained"
            startIcon={<CreditCardIcon />}
            onClick={() => setShowCardForm(true)}
          >
            Add Card
          </Button>
        </Box>

        {/* Card Form */}
        {showCardForm && (
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            gap: 2,
            mb: 3,
            p: 2,
            bgcolor: 'grey.50',
            borderRadius: 1
          }}>
            <FormControl fullWidth error={!!cardErrors.cardType} required>
              <InputLabel>Card Type</InputLabel>
              <Select
                name="cardType"
                value={newCard.cardType}
                onChange={handleCardInputChange}
                label="Card Type"
                required
              >
                <MenuItem value="credit">Credit</MenuItem>
                <MenuItem value="debit">Debit</MenuItem>
              </Select>
              {cardErrors.cardType && (
                <Typography color="error" variant="caption">
                  {cardErrors.cardType}
                </Typography>
              )}
            </FormControl>
            <TextField
              label="Card Number"
              name="cardNumber"
              value={newCard.cardNumber}
              onChange={handleCardInputChange}
              error={!!cardErrors.cardNumber}
              helperText={cardErrors.cardNumber}
              required
              fullWidth
              inputProps={{ maxLength: 16 }}
            />
            <TextField
              label="Expiry Date (YYYY-MM-DD)"
              name="expiryDate"
              value={newCard.expiryDate}
              onChange={handleCardInputChange}
              error={!!cardErrors.expiryDate}
              helperText={cardErrors.expiryDate}
              required
              fullWidth
              type="date"
              InputLabelProps={{
                shrink: true,
              }}
            />
            <TextField
              label="CVV"
              name="cvv"
              value={newCard.cvv}
              onChange={handleCardInputChange}
              error={!!cardErrors.cvv}
              helperText={cardErrors.cvv}
              required
              fullWidth
              inputProps={{ maxLength: 3 }}
            />
            <TextField
              label="Billing ZIP"
              name="billingZip"
              value={newCard.billingZip}
              onChange={handleCardInputChange}
              error={!!cardErrors.billingZip}
              helperText={cardErrors.billingZip}
              required
              fullWidth
              inputProps={{ maxLength: 5 }}
            />
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between',
              width: '100%'
            }}>
              <Button
                variant="outlined"
                onClick={() => {
                  setShowCardForm(false);
                  setNewCard({
                    cardNumber: '',
                    expiryDate: '',
                    cvv: '',
                    billingZip: '',
                    cardType: ''
                  });
                  setCardErrors({});
                }}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                onClick={handleCardSubmit}
              >
                Submit
              </Button>
            </Box>
          </Box>
        )}

        {/* Card List */}
        <List>
          {userData.cards.map((card, index) => (
            <Box key={card.cardNumber}>
              {index > 0 && <Divider />}
              <ListItem
                secondaryAction={
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                      variant="outlined"
                      color={card.isPrimary ? "success" : "primary"}
                      size="small"
                      onClick={() => handleSetPrimaryCard(card.cardNumber)}
                      disabled={card.isPrimary}
                    >
                      {card.isPrimary ? "Primary" : "Set as Primary"}
                    </Button>
                    <IconButton 
                      edge="end" 
                      aria-label="delete"
                      onClick={() => handleDeleteCard(card.cardNumber)}
                      disabled={card.isPrimary && userData.cards.length > 1}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                }
              >
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {card.isPrimary && (
                        <Typography
                          variant="caption"
                          sx={{
                            bgcolor: 'success.main',
                            color: 'white',
                            px: 1,
                            py: 0.5,
                            borderRadius: 1
                          }}
                        >
                          Primary
                        </Typography>
                      )}
                      <Typography variant="body1">
                        {card.cardholderName}
                      </Typography>
                    </Box>
                  }
                  secondary={
                    <Typography variant="body2" color="text.secondary">
                      {`${card.cardNumber} • Expires ${card.expiryDate}`}
                    </Typography>
                  }
                />
              </ListItem>
            </Box>
          ))}
        </List>
      </Paper>
    </Box>
  );
};

export default Profile;
