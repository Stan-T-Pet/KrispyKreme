import { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Button,
} from "@mui/material";
import Navbar from "../components/navbar"; // Import Navbar

export default function CheckoutPage() {
  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [error, setError] = useState(null);

  // Fetch cart items on page load
  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const response = await fetch("/api/cart/fetchCart");
        if (!response.ok) {
          throw new Error("Failed to fetch cart items.");
        }
        const data = await response.json();
        setCartItems(data);

        // Calculate total price
        const calculatedTotal = data.reduce(
          (sum, item) => sum + item.quantity * item.price,
          0
        );
        setTotal(calculatedTotal);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchCartItems();
  }, []);

  return (
    <>
      <Navbar />
      <Container sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Checkout
        </Typography>
        {error && (
          <Typography color="error" sx={{ mt: 2 }}>
            {error}
          </Typography>
        )}
        {cartItems.length === 0 ? (
          <Typography>Your cart is empty.</Typography>
        ) : (
          <Box>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Product</TableCell>
                  <TableCell>Quantity</TableCell>
                  <TableCell>Price</TableCell>
                  <TableCell>Total</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {cartItems.map((item) => (
                  <TableRow key={item.productId}>
                    <TableCell>{item.productName}</TableCell>
                    <TableCell>{item.quantity}</TableCell>
                    <TableCell>€{item.price.toFixed(2)}</TableCell>
                    <TableCell>
                      €{(item.quantity * item.price).toFixed(2)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <Typography
              variant="h5"
              sx={{ mt: 3, textAlign: "right", fontWeight: "bold" }}
            >
              Total: €{total.toFixed(2)}
            </Typography>
            <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}>
              <Button
                variant="contained"
                color="primary"
                onClick={() => alert("Checkout completed!")}
              >
                Confirm Checkout
              </Button>
            </Box>
          </Box>
        )}
      </Container>
    </>
  );
}