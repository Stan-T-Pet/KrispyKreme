import { useEffect, useState } from "react";
import { Box, Typography, Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material";

const Manager = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      const response = await fetch("/api/orders/fetchOrders");
      if (response.ok) {
        const data = await response.json();
        setOrders(data);
      }
    };
    fetchOrders();
  }, []);

  return (
    <Box sx={{ mx: "auto", mt: 5, maxWidth: 800 }}>
      <Typography variant="h4" gutterBottom>Manager Dashboard</Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Order ID</TableCell>
            <TableCell>Customer</TableCell>
            <TableCell>Products</TableCell>
            <TableCell>Total Price</TableCell>
            <TableCell>Order Time</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order.orderId}>
              <TableCell>{order.orderId}</TableCell>
              <TableCell>{order.customerId}</TableCell>
              <TableCell>
                {order.products.map((p) => `${p.name} x${p.quantity}`).join(", ")}
              </TableCell>
              <TableCell>{order.totalPrice}</TableCell>
              <TableCell>{order.orderTime}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  );
};

export default Manager;