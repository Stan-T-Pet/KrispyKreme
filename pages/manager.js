"use client";

import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Button,
  Grid,
  Snackbar,
} from "@mui/material";

const Manager = () => {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);
  const [product, setProduct] = useState({
    title: "",
    description: "",
    price: "",
    image: "",
  });
  const [message, setMessage] = useState(null);

  // Fetch orders when the page loads
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch("/api/orders/fetchOrders");
        if (response.ok) {
          const data = await response.json();
          setOrders(data);
        } else {
          setError("Failed to fetch orders.");
        }
      } catch (err) {
        setError("An error occurred while fetching orders.");
      }
    };

    fetchOrders();
  }, []);

  // Handle product form changes
  const handleProductChange = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  // Handle product submission
  const handleProductSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/products/addProduct", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(product),
      });

      if (response.ok) {
        setMessage("Product added successfully!");
        setProduct({ title: "", description: "", price: "", image: "" });
      } else {
        const data = await response.json();
        setMessage(`Error: ${data.message}`);
      }
    } catch (error) {
      console.error("Error adding product:", error);
      setMessage("Failed to add product.");
    }
  };

  return (
    <Box sx={{ mx: "auto", mt: 5, maxWidth: 1000 }}>
      {/* Orders Section */}
      <Typography variant="h4" gutterBottom>
        Manager Dashboard
      </Typography>
      <Typography variant="body1" mt={2}>
        View all customer orders and add new products to the catalog.
      </Typography>
      {error && (
        <Typography color="error" sx={{ mt: 2 }}>
          {error}
        </Typography>
      )}
      <Table sx={{ mt: 3 }}>
        <TableHead>
          <TableRow>
            <TableCell>Order ID</TableCell>
            <TableCell>Customer</TableCell>
            <TableCell>Products</TableCell>
            <TableCell>Total Cost</TableCell>
            <TableCell>Order Date</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order.id}>
              <TableCell>{order.id}</TableCell>
              <TableCell>{order.customerName}</TableCell>
              <TableCell>
                {order.products.map((product, index) => (
                  <div key={index}>
                    {product.name} (x{product.quantity})
                  </div>
                ))}
              </TableCell>
              <TableCell>€{order.totalCost.toFixed(2)}</TableCell>
              <TableCell>{new Date(order.date).toLocaleString()}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Add Product Section */}
      <Typography variant="h5" sx={{ mt: 5 }}>
        Add New Product
      </Typography>
      <Box
        component="form"
        onSubmit={handleProductSubmit}
        sx={{ mt: 2 }}
        noValidate
      >
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              name="title"
              label="Product Title"
              value={product.title}
              onChange={handleProductChange}
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              name="price"
              label="Price"
              type="number"
              value={product.price}
              onChange={handleProductChange}
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              name="description"
              label="Description"
              value={product.description}
              onChange={handleProductChange}
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              name="image"
              label="Image URL"
              value={product.image}
              onChange={handleProductChange}
              fullWidth
              required
            />
          </Grid>
        </Grid>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          sx={{ mt: 3 }}
        >
          Add Product
        </Button>
      </Box>

      {/* Snackbar for messages */}
      {message && (
        <Snackbar
          open={!!message}
          autoHideDuration={4000}
          onClose={() => setMessage(null)}
          message={message}
        />
      )}
    </Box>
  );
};

export default Manager;