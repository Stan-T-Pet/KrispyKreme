import {
  AppBar,
  Toolbar,
  Button,
  Typography,
  Box,
  Drawer,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { signOut } from "next-auth/react"; // Import signOut from next-auth

export default function Navbar() {
  const router = useRouter();
  const [cartOpen, setCartOpen] = useState(false); // State to control the cart drawer
  const [cartItems, setCartItems] = useState([]); // State to store cart items
  const [error, setError] = useState(null);

  // Fetch cart items when the drawer is opened
  useEffect(() => {
    if (cartOpen) {
      const fetchCartItems = async () => {
        try {
          const response = await fetch("/api/cart/fetchCart");
          if (!response.ok) {
            throw new Error("Failed to fetch cart items.");
          }
          const data = await response.json();
          console.log("Fetched Cart Items:", data); // Log cart items
          setCartItems(data);
        } catch (err) {
          console.error("Error fetching cart items:", err.message);
          setError(err.message);
        }
      };
  
      fetchCartItems();
    }
  }, [cartOpen]);  

  const handleLogout = async () => {
    try {
      // Clear session and redirect to login
      await signOut({ callbackUrl: "/login" });
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return (
    <>
      <AppBar position="static" color="primary">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Dashboard
          </Typography>
          <Box>
            <Button color="inherit" onClick={() => router.push("/")}>
              Home
            </Button>
            <Button color="inherit" onClick={() => setCartOpen(true)}>
              Cart
            </Button>
            <Button color="inherit" onClick={handleLogout}>
              Logout
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Cart Drawer */}
      <Drawer anchor="right" open={cartOpen} onClose={() => setCartOpen(false)}>
        <Box sx={{ width: 400, p: 2 }}>
          <Typography variant="h5" gutterBottom>
            Your Cart
          </Typography>
          {error && (
            <Typography color="error" sx={{ mt: 2 }}>
              {error}
            </Typography>
          )}
          {cartItems.length === 0 ? (
            <Typography>Your cart is empty.</Typography>
          ) : (
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Product</TableCell>
                  <TableCell>Quantity</TableCell>
                  <TableCell>Price</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {cartItems.map((item) => (
                  <TableRow key={item.productId}>
                    <TableCell>{item.productName}</TableCell>
                    <TableCell>{item.quantity}</TableCell>
                    <TableCell>
                      €{(item.price * item.quantity).toFixed(2)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </Box>
      </Drawer>
    </>
  );
}