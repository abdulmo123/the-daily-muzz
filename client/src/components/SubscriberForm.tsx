import React, { useState } from "react";
import { TextField, Button, Container, Typography, Alert } from "@mui/material";
import { addSubscriber } from "../api";

const SubscriberForm: React.FC = () => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"success" | "error" | null>(null);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus(null);

    try {
        const response = await addSubscriber(email);
        console.log('Subscriber added successfully!', response);

        if (response.status === 201) {
          setStatus("success");
          setMessage(response.message);
          setEmail("");
        } else if (response.status === 409) {
          setStatus("error");
          setMessage(response.message);
          setEmail("");
        } else {
          setStatus("error");
        } 
    } catch (err) {
      console.error(err);
      setMessage("Failed to subscribe. Try again.")
      setStatus("error");
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 5 }}>
      <Typography variant="h4" gutterBottom>
        Subscribe to The Daily Muzz
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
        <Button variant="contained" color="primary" type="submit" fullWidth>
          Subscribe
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

export default SubscriberForm;
