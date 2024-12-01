"use client";

import { useEffect, useState } from "react";
import { Box, Typography, Grid, Card, CardContent, CardMedia, Button } from "@mui/material";

const Customer = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("/api/products/fetchProducts");
        if (response.ok) {
          const data = await response.json();
          setProducts(data);
        } else {
          console.error("Failed to fetch products");
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  const addToCart = (productId) => {
    console.log(`Product ${productId} added to cart`);
    // Implement cart logic here
  };
  return (
    <Box sx={{ mx: "auto", mt: 5, maxWidth: 800 }}>
      <Typography variant="h4" gutterBottom>
        Products
      </Typography>
      <Grid container spacing={3}>
        {products.map((product) => (
          <Grid item xs={12} sm={6} md={4} key={product.productId}>
            <Card>
              <CardMedia
                component="img"
                height="140"
                image={product.image}
                alt={product.title}
              />
              <CardContent>
                <Typography variant="h6">{product.title}</Typography>
                <Typography variant="body2" color="textSecondary" gutterBottom>
                  {product.description}
                </Typography>
                <Typography variant="body1" color="primary">
                  €{product.price}
                </Typography>
                <Button
                  variant="contained"
                  sx={{ mt: 2 }}
                  onClick={() => addToCart(product.productId)}
                >
                  Add to Cart
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};
export default Customer;