"use client";

import { useState } from "react";
import { Box, Typography, Button, Alert, CircularProgress } from "@mui/material";

const Checkout = () => {
  const [confirmation, setConfirmation] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    setLoading(true);
    setConfirmation(null);
    setError(null);

    try {
      const response = await fetch("/api/orders/placeOrder", { method: "POST" });
      if (response.ok) {
        setConfirmation("Order successfully placed! Check your email for confirmation.");
      } else {
        const errorData = await response.json();
        setError(errorData.message || "There was an error placing the order. Please try again.");
      }
    } catch (networkError) {
      setError("Network error: Unable to place the order. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ mx: "auto", mt: 5, maxWidth: 800 }}>
      <Typography variant="h4" gutterBottom>
        Checkout
      </Typography>
      <Typography variant="body1" mt={2}>
        Review your order and confirm the checkout process.
      </Typography>
      {confirmation && (
        <Alert severity="success" sx={{ mt: 2 }} aria-live="polite">
          {confirmation}
        </Alert>
      )}
      {error && (
        <Alert severity="error" sx={{ mt: 2 }} aria-live="assertive">
          {error}
        </Alert>
      )}
      <Button
        variant="contained"
        sx={{ mt: 2 }}
        onClick={handleCheckout}
        disabled={loading}
      >
        {loading ? <CircularProgress size={24} /> : "Confirm and Place Order"}
      </Button>
    </Box>
  );
};

export default Checkout;
