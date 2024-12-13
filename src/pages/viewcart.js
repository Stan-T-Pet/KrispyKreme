import withAuth from "../hoc/withAuth";
import Navbar from "../components/navbar";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Button,
  Alert,
} from "@mui/material";
import { useState, useEffect } from "react";

function ViewCartPage() {
  const [cartItems, setCartItems] = useState([]);
  const [error, setError] = useState(null);
  const [total, setTotal] = useState(0);

  const fetchCartItems = async () => {
    try {
      const response = await fetch("/api/cart/fetchCart");
      if (!response.ok) {
        throw new Error("Failed to fetch cart items.");
      }
      const data = await response.json();
      setCartItems(data);

      // Calculate total price
      const totalPrice = data.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );
      setTotal(totalPrice);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchCartItems();
  }, []);

  const handleClearCart = async () => {
    try {
      const response = await fetch("/api/cart/clearCart", {
        method: "DELETE",
      });
      if (response.ok) {
        setCartItems([]);
        setTotal(0);
        alert("Cart cleared successfully!");
      } else {
        alert("Failed to clear cart.");
      }
    } catch (error) {
      console.error("Error clearing cart:", error);
    }
  };

  return (
    <>
      <Navbar />
      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}
      <Box sx={{ mx: "auto", mt: 5, maxWidth: 800 }}>
        <Typography variant="h4" gutterBottom>
          Your Cart
        </Typography>
        <Table sx={{ mt: 3 }}>
          <TableHead>
            <TableRow>
              <TableCell>Product</TableCell>
              <TableCell>Quantity</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Subtotal</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {cartItems.map((item) => (
              <TableRow key={item.productId}>
                <TableCell>{item.productName}</TableCell>
                <TableCell>{item.quantity}</TableCell>
                <TableCell>€{item.price.toFixed(2)}</TableCell>
                <TableCell>€{(item.price * item.quantity).toFixed(2)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Typography variant="h6" sx={{ mt: 2 }}>
          Total: €{total.toFixed(2)}
        </Typography>
        <Button
          variant="contained"
          color="secondary"
          sx={{ mt: 3 }}
          onClick={handleClearCart}
        >
          Clear Cart
        </Button>
      </Box>
    </>
  );
}

export default withAuth(ViewCartPage, ["customer"]);