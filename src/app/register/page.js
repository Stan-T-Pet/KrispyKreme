"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Box, TextField, Button, Typography, Container } from "@mui/material";

export default function Register() {
  const router = useRouter();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
  
    const email = data.get("email");
    const pass = data.get("pass");
    const confirmEmail = data.get("confirmEmail");
    const confirmPass = data.get("confirmPass");
  
    const response = await fetch(`/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, pass, confirmEmail, confirmPass }),
    });
  
    if (response.ok) {
      console.log("User registered successfully. Redirecting to login...");
      router.push("/login");
    } else if (response.status === 409) {
      console.log("User already exists. Redirecting to login...");
      router.push("/login");
    } else {
      console.error("Registration failed with status:", response.status);
    }
  };  

    if (response.ok) {
      console.log("User registered successfully. Redirecting to login...");
      router.push("/login");
    } else if (response.status === 409) {
      console.log("User already exists. Redirecting to login...");
      router.push("/login");
    } else {
      console.error("Registration failed with status:", response.status);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 5 }}>
        <Typography variant="h4" gutterBottom>
          Register
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate>
          <TextField margin="normal" required fullWidth id="email" label="Email Address" name="email" />
          <TextField margin="normal" required fullWidth id="confirmEmail" label="Confirm Email Address" name="confirmEmail" />
          <TextField margin="normal" required fullWidth id="pass" label="Password" name="pass" type="password" />
          <TextField margin="normal" required fullWidth id="confirmPass" label="Confirm Password" name="confirmPass" type="password" />
          <Button type="submit" fullWidth variant="contained" sx={{ mt: 2 }}>
            Register
          </Button>
        </Box>
      </Box>
    </Container>
  );