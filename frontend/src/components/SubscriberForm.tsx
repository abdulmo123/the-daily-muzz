import React, { useState } from "react";
import { TextField, Button, Container, Typography, Alert } from "@mui/material";
import { addSubscriber } from "../api";

const SubscriberForm: React.FC = () => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"success" | "error" | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus(null);

    try {
        const response = await addSubscriber(email);
        console.log('Subscriber added successfully!', response.data);

        if (response.ok) {
            setStatus("success");
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
          Subscribed successfully!
        </Alert>
      )}
      {status === "error" && (
        <Alert severity="error" sx={{ mt: 2 }}>
          Failed to subscribe. Try again.
        </Alert>
      )}
    </Container>
  );
};

export default SubscriberForm;
