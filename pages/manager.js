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
  Alert,
  Divider,
  Chip,
} from "@mui/material";
import { useState, useEffect } from "react";

function ManagerPage() {
  const [orders, setOrders] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch("/api/orders/fetchOrders");
        if (!response.ok) {
          throw new Error("Failed to fetch orders.");
        }
        const data = await response.json();
        setOrders(data);

        // Calculate total revenue and total orders
        const revenue = data.reduce((sum, order) => sum + order.totalCost, 0);
        const ordersCount = data.length;
        setTotalRevenue(revenue);
        setTotalOrders(ordersCount);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchOrders();
  }, []);

  return (
    <>
      <Navbar />
      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}
      <Box sx={{ mx: "auto", mt: 5, maxWidth: 1000 }}>
        <Typography variant="h4" gutterBottom>
          Manager Dashboard
        </Typography>

        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
          <Typography variant="h6">
            Total Orders: <strong>{totalOrders}</strong>
          </Typography>
          <Typography variant="h6">
            Total Revenue: <strong>€{totalRevenue.toFixed(2)}</strong>
          </Typography>
        </Box>

        <Divider>
          <Chip label="Order Details" />
        </Divider>

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
              <TableRow key={order._id}>
                <TableCell>{order._id}</TableCell> {/* Use _id for MongoDB */}
                <TableCell>{order.customerName}</TableCell>
                <TableCell>
                  {order.products.map((product, index) => (
                    <div key={index}>
                      {product.productName} (x{product.quantity})
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
    </>
  );
}

export default withAuth(ManagerPage, ["manager"]);