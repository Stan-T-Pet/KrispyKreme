"use client";

import { useState } from "react";
import { useRouter } from "next/router";
import { Box, TextField, Button, Typography, Container, Alert, MenuItem, Stack } from "@mui/material";

export default function Register() {
  const router = useRouter();
  
  // Set email from user input
  const [email, setEmail] = useState("");
  // Comfirmation field to check if email is the same - for direct comparison
  const [confirmEmail, setConfirmEmail] = useState(""); 

  // Store password for same reason above
  const [password, setPassword] = useState("");
  // store pass for comparison
  const [confirmPassword, setConfirmPassword] = useState(""); 

  // Auto set customer role
  const [role, setRole] = useState("customer");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);


  const handleRegister = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    // Checking input not null/empty
    if (!email || !confirmEmail || !password || !confirmPassword) {
      setError("All fields are required.");
      setLoading(false);
      return;
    } else if (email.length > 50) { //ensure email length is less than 50 char long
      setError("Email must not exceed 50 characters.");
      setLoading(false);
      return;
    }//ensure pass length is nort less than 6 chars or more than 50 char long
    else if(password.length < 6 || password.length > 50) { 
      setError("Password must be between 6 and 50 characters.");
      setLoading(false);
      return;
    } //check emails match before registration
    if (email !== confirmEmail) {
      setError("Emails do not match.");
      setLoading(false);
      return;
    }//check pass match before registration
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, role }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({ message: "Unexpected error occurred." }));
        throw new Error(data.message || "Failed to register.");
      }

      router.push("/login");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 5 }}>
        <Typography variant="h4" gutterBottom>
          Register
        </Typography>
        <Box component="form" onSubmit={handleRegister} noValidate>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            inputProps={{ maxLength: 50 }} // Updated with correct usage
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="confirmEmail"
            label="Confirm Email Address"
            name="confirmEmail"
            value={confirmEmail}
            onChange={(e) => setConfirmEmail(e.target.value)}
            inputProps={{ maxLength: 50 }} // Updated with correct usage
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="password"
            label="Password"
            name="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            inputProps={{ maxLength: 50 }} // Updated with correct usage
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="confirmPassword"
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            inputProps={{ maxLength: 50 }} // Updated with correct usage
          />
          <TextField
            select
            margin="normal"
            fullWidth
            label="Role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <MenuItem value="customer">Customer</MenuItem>
            <MenuItem value="manager">Manager</MenuItem>
          </TextField>
          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}
          <Stack spacing={2} direction="row" sx={{ mt: 2 }}>
            <Button type="submit" fullWidth variant="contained" disabled={loading}>
              {loading ? "Registering..." : "Register"}
            </Button>
            <Button
              fullWidth
              variant="outlined"
              onClick={() => router.push("/login")}
            >
              Login
            </Button>
          </Stack>
        </Box>
      </Box>
    </Container>
  );
}