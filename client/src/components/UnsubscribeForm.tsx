import React, { useState } from "react";
import { TextField, Button, Container, Typography, Alert } from "@mui/material";
import { removeSubscriber } from "../api"; // make sure this API exists

const UnsubscribeForm: React.FC = () => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"success" | "error" | null>(null);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus(null);

    try {
      const response = await removeSubscriber(email);
      console.log("Unsubscribe request sent!", response);

      if (response.status === 200) {
        console.log('Response was ok ....')
        setStatus("success");
        setMessage(response.message);
        setEmail("");
      } else if (response.status === 404) {
        setStatus("error");
        setMessage(response.message);
        setEmail("");
      } else {
        setStatus("error");
      }
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 5 }}>
      <Typography variant="h4" gutterBottom>
        Unsubscribe from The Daily Muzz
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Email"
          type="email"
          fullWidth
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          margin="normal"
        />
        <Button variant="contained" color="secondary" type="submit" fullWidth>
          Unsubscribe
        </Button>
      </form>

      {status === "success" && (
        <Alert severity="success" sx={{ mt: 2 }}>
          {message}
        </Alert>
      )}
      {status === "error" && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {message}
        </Alert>
      )}
    </Container>
  );
};

export default UnsubscribeForm;
