import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Typography, Button, Stack } from '@mui/material';

const Dashboard: React.FC = () => {
  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h3" align="center" gutterBottom>
        PharmaOps Platform
      </Typography>
      <Typography variant="h6" align="center" color="textSecondary" gutterBottom>
        Select a role to view the dashboard
      </Typography>
      <Stack direction="row" spacing={3} justifyContent="center" sx={{ mt: 4 }}>
        <Button variant="contained" color="primary" component={Link} to="/admin">
          Admin Dashboard
        </Button>
        <Button variant="contained" color="secondary" component={Link} to="/vendor">
          Vendor Dashboard
        </Button>
        <Button variant="contained" color="success" component={Link} to="/qa">
          QA Dashboard
        </Button>
        <Button variant="contained" color="warning" component={Link} to="/auditor">
          Auditor Dashboard
        </Button>
      </Stack>
    </Container>
  );
};

export default Dashboard;
