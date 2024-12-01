import { useState } from "react";
import { Box, Typography, Button, TextField, Alert } from "@mui/material";

const Checkout = () => {
  const [confirmation, setConfirmation] = useState(null);
  const [error, setError] = useState(null);

  const handleCheckout = async () => {
    const response = await fetch("/api/orders/placeOrder", { method: "POST" });
    if (response.ok) {
      setConfirmation("Order successfully placed! Check your email for confirmation.");
      setError(null);
    } else {
      setError("There was an error placing the order. Please try again.");
    }
  };

  return (
    <Box sx={{ mx: "auto", mt: 5, maxWidth: 800 }}>
      <Typography variant="h4" gutterBottom>Checkout</Typography>
      <Typography variant="body1" mt={2}>
        Review your order and confirm the checkout process.
      </Typography>
      {confirmation && <Alert severity="success" sx={{ mt: 2 }}>{confirmation}</Alert>}
      {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
      <Button
        variant="contained"
        sx={{ mt: 2 }}
        onClick={handleCheckout}
      >
        Confirm and Place Order
      </Button>
    </Box>
  );
};

export default Checkout;
