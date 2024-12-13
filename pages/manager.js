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
} from "@mui/material";
import { useState, useEffect } from "react";

function ManagerPage() {
  const [orders, setOrders] = useState([]);
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
    </>
  );
}

export default withAuth(ManagerPage, ["manager"]);