"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Box, TextField, Button, Typography, Container, Alert } from "@mui/material";

export default function Register() {
  const router = useRouter();
  const [error, setError] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    const email = data.get("email");
    const pass = data.get("pass");
    const confirmEmail = data.get("confirmEmail");
    const confirmPass = data.get("confirmPass");

    // Basic validation
    if (email !== confirmEmail) {
      setError("Emails do not match.");
      return;
    }

    if (pass !== confirmPass) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const response = await fetch(`/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, pass }),
      });

      if (response.ok) {
        console.log("User registered successfully. Redirecting to login...");
        router.push("/login");
      } else if (response.status === 409) {
        setError("User already exists. Please log in.");
      } else {
        setError(`Registration failed. Status: ${response.status}`);
      }
    } catch (err) {
      console.error("Error during registration:", err);
      setError("An error occurred during registration. Please try again.");
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 5 }}>
        <Typography variant="h4" gutterBottom>
          Register
        </Typography>
        {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
        <Box component="form" onSubmit={handleSubmit} noValidate>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="confirmEmail"
            label="Confirm Email Address"
            name="confirmEmail"
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="pass"
            label="Password"
            name="pass"
            type="password"
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="confirmPass"
            label="Confirm Password"
            name="confirmPass"
            type="password"
          />
          <Button type="submit" fullWidth variant="contained" sx={{ mt: 2 }}>
            Register
          </Button>
        </Box>
      </Box>
    </Container>
  );
}