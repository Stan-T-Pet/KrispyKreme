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
} from "@mui/material";

const Manager = () => {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch("/api/orders/fetchOrders"); // Updated path for orders API
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

  return (
    <Box sx={{ mx: "auto", mt: 5, maxWidth: 1000 }}>
      <Typography variant="h4" gutterBottom>
        Manager Dashboard
      </Typography>
      <Typography variant="body1" mt={2}>
        Here you can view all orders placed by customers.
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
                {order.products.map((product) => (
                  <div key={product.id}>
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
    </Box>
  );
};
export default Manager;