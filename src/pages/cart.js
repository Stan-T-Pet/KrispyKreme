import { useState, useEffect } from "react";
import { Box, Typography, List, ListItem, ListItemText, Button } from "@mui/material";
import { useRouter } from "next/router";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetchCart = async () => {
      const response = await fetch("/api/cart/getCart"); // Example API endpoint
      if (response.ok) {
        const data = await response.json();
        setCartItems(data);
      }
    };
    fetchCart();
  }, []);

  const handleCheckout = () => {
    router.push("/checkout");
  };

  const calculateTotal = () =>
    cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  return (
    <Box sx={{ mx: "auto", mt: 5, maxWidth: 800 }}>
      <Typography variant="h4" gutterBottom>Shopping Cart</Typography>
      <List>
        {cartItems.map((item) => (
          <ListItem key={item.productId}>
            <ListItemText
              primary={`${item.title} x${item.quantity}`}
              secondary={`Price: €${item.price}`}
            />
          </ListItem>
        ))}
      </List>
      <Typography variant="h6" mt={2}>
        Total: €{calculateTotal()}
      </Typography>
      <Button
        variant="contained"
        sx={{ mt: 2 }}
        onClick={handleCheckout}
        disabled={cartItems.length === 0}
      >
        Proceed to Checkout
      </Button>
    </Box>
  );
};

export default Cart;
