"use client";

import { useState, useEffect } from "react";
import {
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  TextField,
} from "@mui/material";
import Navbar from "../components/Navbar"; // Import Navbar

export default function CustomerPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantities, setQuantities] = useState({});

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("/api/products/fetchProducts");
        if (!response.ok) {
          throw new Error(`Failed to fetch products: ${response.status}`);
        }
        const data = await response.json();
        setProducts(data);

        const initialQuantities = {};
        data.forEach((product) => {
          initialQuantities[product._id] = 1;
        });
        setQuantities(initialQuantities);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleQuantityChange = (productId, value) => {
    setQuantities((prevQuantities) => ({
      ...prevQuantities,
      [productId]: value,
    }));
  };

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
      });

      if (response.ok) {
        alert(`${product.title} added to cart successfully!`);
      } else {
        alert("Failed to add to cart");
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      alert("An error occurred while adding to cart.");
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <Typography variant="h5">Loading products...</Typography>
      </>
    );
  }

  if (products.length === 0) {
    return (
      <>
        <Navbar />
        <Typography variant="h5">No products available.</Typography>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <Grid container spacing={3}>
        {products.map((product) => (
          <Grid item xs={12} sm={6} md={4} key={product._id}>
            <Card>
              <CardMedia
                component="img"
                height="140"
                image={product.image || "/placeholder.png"}
                alt={product.title}
              />
              <CardContent>
                <Typography variant="h6">{product.title}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {product.description}
                </Typography>
                <Typography variant="body1" color="text.primary">
                  €{parseFloat(product.price).toFixed(2)}
                </Typography>
                <TextField
                  type="number"
                  label="Quantity"
                  value={quantities[product._id] || 1}
                  onChange={(e) =>
                    handleQuantityChange(product._id, Number(e.target.value))
                  }
                  inputProps={{ min: 1 }}
                  sx={{ mt: 2, mb: 2, width: "100%" }}
                />
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleAddToCart(product)}
                >
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