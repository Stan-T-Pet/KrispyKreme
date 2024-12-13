import withAuth from "../hoc/withAuth";
import Navbar from "../components/navbar";
import {
  Alert,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  TextField,
  Box,
} from "@mui/material";
import { useState, useEffect } from "react";

function CustomerPage() {
  const [products, setProducts] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [error, setError] = useState(null);
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    // Fetch products
    const fetchProducts = async () => {
      try {
        const response = await fetch("/api/products/fetchProducts");
        if (!response.ok) {
          throw new Error("Failed to fetch products.");
        }
        const data = await response.json();
        setProducts(data);

        // Initialize quantities for each product
        const initialQuantities = {};
        data.forEach((product) => {
          initialQuantities[product._id] = 1;
        });
        setQuantities(initialQuantities);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchProducts();

    // Fetch weather data
    const fetchWeather = async () => {
      try {
        const response = await fetch("/api/getWeather");
        if (!response.ok) {
          throw new Error("Failed to fetch weather data.");
        }
        const data = await response.json();
        setWeather(data.temp);
      } catch (err) {
        console.error("Error fetching weather:", err.message);
        setWeather("N/A");
      }
    };

    fetchWeather();
  }, []);

  const handleAddToCart = async (product) => {
    const quantity = quantities[product._id];
    if (quantity <= 0) {
      alert("Quantity must be at least 1");
      return;
    }

    try {
      const response = await fetch("/api/cart/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: product._id, quantity }),
        credentials: "include",
      });

      const result = await response.json();

      if (response.ok) {
        alert(`${product.title} added to cart successfully!`);
      } else {
        alert(`Failed to add to cart: ${result.message}`);
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      alert("An error occurred while adding to cart.");
    }
  };

  return (
    <>
      <Navbar />
      {weather !== null && (
        <Box sx={{ p: 2, backgroundColor: "#e3f2fd", textAlign: "center" }}>
          <Typography variant="h6">
            Current Temperature in Dublin: {weather}°C
          </Typography>
        </Box>
      )}
      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}
      <Grid container spacing={3}>
        {products.map((product) => (
          <Grid item xs={12} sm={6} md={4} key={product._id}>
            <Card>
              <CardMedia
                component="img"
                height="140"
                image={product.image}
                alt={product.title}
              />
              <CardContent>
                <Typography variant="h6">{product.title}</Typography>
                <Typography>{product.description}</Typography>
                <TextField
                  label="Quantity"
                  type="number"
                  value={quantities[product._id] || 1}
                  onChange={(e) =>
                    setQuantities({
                      ...quantities,
                      [product._id]: Number(e.target.value),
                    })
                  }
                />
                <Button onClick={() => handleAddToCart(product)}>
                  Add to Cart
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </>
  );
}

export default withAuth(CustomerPage, ["customer"]);