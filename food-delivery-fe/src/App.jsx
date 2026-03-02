import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import { useState } from 'react';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Menu from './pages/Menu';
import Cart from './pages/Cart';
import Chains from './pages/Chains';
import Profile from './pages/Profile';
import Delivery from './pages/Delivery';
import { Box } from '@mui/material';

// Create a theme instance
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

//App contains prop functions that are passed down to child components
function App() {
  const [userEmail, setUserEmail] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [selectedChain, setSelectedChain] = useState(null);
  const [primaryAddressId, setPrimaryAddressId] = useState(null);
  const [primaryCardNumber, setPrimaryCardNumber] = useState(null);

  const handleLogin = (email) => {
    setUserEmail(email);
  };

  const handleLogout = () => {
    setUserEmail(null);
    setCartItems([]);
    setSelectedChain(null);
    setPrimaryAddressId(null);
    setPrimaryCardNumber(null);
  };

  const handleAddToCart = (item) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(i => i.id === item.id);
      if (existingItem) {
        return prevItems.map(i => 
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prevItems, { ...item, quantity: 1 }];
    });
  };

  const handleRemoveItem = (itemId) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== itemId));
  };

  const handleQuantityChange = (itemId, change) => {
    setCartItems(prevItems => {
      const updatedItems = prevItems.map(item => {
        if (item.id === itemId) {
          const newQuantity = item.quantity + change;
          return { ...item, quantity: Math.max(1, newQuantity) };
        }
        return item;
      });
      return updatedItems;
    });
  };

  const handleChainSelect = (chain) => {
    setSelectedChain(chain);
  };

  const handlePrimaryAddressChange = (addressId) => {
    setPrimaryAddressId(addressId);
  };

  const handlePrimaryCardChange = (cardNumber) => {
    setPrimaryCardNumber(cardNumber);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ 
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex', 
        flexDirection: 'column', 
        height: '100vh',
        width: '100vw',
        margin: 0,
        padding: 0,
        overflow: 'hidden'
      }}>
        <Router>
          <Navbar 
            userEmail={userEmail} 
            onLogin={handleLogin} 
            onLogout={handleLogout}
            cartItems={cartItems}
          />
          <Box component="main" sx={{ 
            flexGrow: 1,
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'auto'
          }}>
            <Routes>
              <Route path="/" element={<Home userEmail={userEmail} />} />
              <Route path="/signin" element={<SignIn onLogin={handleLogin} />} />
              <Route path="/signup" element={<SignUp onLogin={handleLogin} />} />
              <Route 
                path="/menu" 
                element={
                  <Menu 
                    selectedChain={selectedChain} 
                    onAddToCart={handleAddToCart} 
                  />
                } 
              />
              <Route 
                path="/cart" 
                element={
                  <Cart 
                    cartItems={cartItems}
                    onRemoveItem={handleRemoveItem}
                    onQuantityChange={handleQuantityChange}
                    primaryAddressId={primaryAddressId}
                    primaryCardNumber={primaryCardNumber}
                    userEmail={userEmail}
                  />
                } 
              />
              <Route path="/chains" element={<Chains onChainSelect={handleChainSelect} />} />
              <Route 
                path="/profile" 
                element={
                  <Profile 
                    userEmail={userEmail}
                    onPrimaryAddressChange={handlePrimaryAddressChange}
                    onPrimaryCardChange={handlePrimaryCardChange}
                  />
                } 
              />
              <Route path="/delivery" element={<Delivery />} />
            </Routes>
          </Box>
        </Router>
      </Box>
    </ThemeProvider>
  );
}

export default App;
