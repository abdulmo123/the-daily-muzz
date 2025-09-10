import React, { useState } from "react";
import { Container, Typography, TextField, Button, Grid, Card, CardContent } from "@mui/material";
import EmailIcon from '@mui/icons-material/Email';
import { useNavigate } from "react-router-dom";

const LandingPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleSubscribe = () => {
    navigate('/subscribe');
  };

  return (
    <div style={{ fontFamily: "Inter, sans-serif" }}>
      {/* Hero Section */}
      <Container maxWidth="md" style={{ textAlign: "center", padding: "5rem 0" }}>
        <Typography variant="h2" gutterBottom fontWeight="bold">
          The Daily Muzz
        </Typography>
        <Typography variant="h6" color="textSecondary" gutterBottom>
          Your daily dose of news, stories & insights that matter to the Muslim community.
        </Typography>

        <div style={{ marginTop: "2rem", display: "flex", justifyContent: "center", gap: "1rem" }}>
          <Button 
            variant="contained" 
            color="primary" 
            startIcon={<EmailIcon />}
            onClick={handleSubscribe}
          >
          Click here to subscribe
          </Button>
        </div>
      </Container>

      {/* Why Subscribe Section */}
      <Container maxWidth="lg" style={{ padding: "4rem 0" }}>
        <Grid container spacing={4}>
          {[
            {
              title: "Curated News",
              desc: "Get the latest stories from around the world, tailored for you.",
            },
            {
              title: "Smart Insights",
              desc: "Understand the context behind the headlines with deep dives.",
            },
            {
              title: "Community Focused",
              desc: "Stay connected with stories that matter to Muslims everywhere.",
            },
          ].map((item, i) => (
            <Grid item xs={12} md={4} key={i}>
              <Card elevation={3} sx={{ borderRadius: "16px", height: "100%" }}>
                <CardContent>
                  <Typography variant="h5" gutterBottom>
                    {item.title}
                  </Typography>
                  <Typography color="textSecondary">{item.desc}</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Footer */}
      <footer style={{ textAlign: "center", padding: "2rem 0", background: "#f8f9fa" }}>
        <Typography variant="body2" color="textSecondary">
          © {new Date().getFullYear()} The Daily Muzz. All rights reserved.
        </Typography>
      </footer>
    </div>
  );
};

export default LandingPage;