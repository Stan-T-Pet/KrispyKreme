import { useEffect, useState } from "react";
import { Box, Typography, Grid, Card, CardContent, CardMedia, Button } from "@mui/material";

const Customer = () => {
  const [products, setProducts] = useState([]);
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      const response = await fetch("/api/products/fetchProducts");
      if (response.ok) {
        setProducts(await response.json());
      }
    };

    const fetchWeather = async () => {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=your_city&appid=your_api_key`
      );
      if (response.ok) {
        const data = await response.json();
        setWeather(data.weather[0].description);
      }
    };

    fetchProducts();
    fetchWeather();
  }, []);

  const addToCart = (productId) => {
    // Add to cart logic
  };

  return (
    <Box sx={{ mx: "auto", mt: 5, maxWidth: 800 }}>
      <Typography variant="h5">Weather: {weather || "Loading..."}</Typography>
      <Grid container spacing={2} mt={2}>
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
                <Typography variant="body2">{product.description}</Typography>
                <Typography variant="body1">€{product.price}</Typography>
                <Button
                  variant="contained"
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