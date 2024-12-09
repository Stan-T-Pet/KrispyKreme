"use client";

import { useState, useEffect } from "react";
import { Grid, Card, CardContent, CardMedia, Typography } from "@mui/material";

export default function CustomerPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("/api/products/fetchProducts");
        if (!response.ok) {
          throw new Error(`Failed to fetch products: ${response.status}`);
        }
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return <Typography variant="h5">Loading products...</Typography>;
  }

  if (products.length === 0) {
    return <Typography variant="h5">No products available.</Typography>;
  }

  return (
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
                ${product.price}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}