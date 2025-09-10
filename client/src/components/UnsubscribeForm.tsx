import React, { useState } from "react";
import {
  TextField,
  Button,
  Container,
  Typography,
  Alert,
  Collapse,
} from "@mui/material";
import { removeSubscriber } from "../api";

const themeColors = {
  primary: "#0B3D91",
  secondary: "#FF6B35",
  background: "#F4F6F8",
  text: "#222222",
};

const UnsubscribeForm: React.FC = () => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"success" | "error" | null>(null);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus(null);

    try {
      const response = await removeSubscriber(email);

      if (response.status === 200) {
        setStatus("success");
        setMessage(response.message);
        setEmail("");
      } else if (response.status === 404) {
        setStatus("error");
        setMessage(response.message);
        setEmail("");
      } else {
        setStatus("error");
        setMessage("Something went wrong. Try again.");
      }
    } catch (err) {
      console.error(err);
      setMessage("Failed to unsubscribe. Try again.");
      setStatus("error");
    }
  };

  return (
    <Container
      maxWidth="sm"
      sx={{
        mt: 5,
        p: 4,
        borderRadius: 3,
        boxShadow: 3,
        background: themeColors.background,
        color: themeColors.text,
        textAlign: "center",
      }}
    >
      <Typography variant="h4" gutterBottom fontWeight="bold">
        Unsubscribe from The Daily Muzz
      </Typography>
      <Typography variant="h6" gutterBottom>
        ❌ Remove your email from our newsletter
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
          sx={{ background: "#fff", borderRadius: 2, input: { px: 1.5 } }}
        />
        <Button
          variant="contained"
          type="submit"
          fullWidth
          sx={{
            mt: 2,
            borderRadius: 3,
            fontWeight: "bold",
            backgroundColor: themeColors.secondary,
            color: "#fff",
            "&:hover": { backgroundColor: "#e55b2b", transform: "scale(1.03)" },
            transition: "all 0.2s",
          }}
        >
          Unsubscribe
        </Button>
      </form>

      <Collapse in={status !== null}>
        {status && (
          <Alert
            severity={status === "success" ? "success" : "error"}
            sx={{ mt: 2 }}
          >
            {message}
          </Alert>
        )}
      </Collapse>
    </Container>
  );
};

export default UnsubscribeForm;
