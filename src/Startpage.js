import React from 'react';
import { Typography, Box, Grid, Paper } from '@mui/material';
import { makeStyles } from '@mui/styles';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import InventoryIcon from '@mui/icons-material/Inventory';
import MapIcon from '@mui/icons-material/Map';

// Define custom styles
const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    padding: theme.spacing(4),
    backgroundColor: '#f0f0f0', // Light background color for the entire page
  },
  hero: {
    position: 'relative',
    color: '#3f51b5', // Blue font color
    padding: theme.spacing(6, 4),
    textAlign: 'left',
    borderRadius: theme.shape.borderRadius,
    marginBottom: theme.spacing(4),
    backgroundImage: 'url(/images/CT.jpeg)', // Reference to the local image in the public directory
    backgroundSize: 'contain',
    backgroundPosition: 'right',
    backgroundRepeat: 'no-repeat',
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      backgroundColor: 'rgba(255, 255, 255, 0.5)', // Semi-transparent overlay
      borderRadius: theme.shape.borderRadius,
    },
  },
  heroContent: {
    position: 'relative',
    zIndex: 1,
  },
  heroTitle: {
    fontSize: '2rem !important', // Adjust the font size as needed
    marginBottom: theme.spacing(2),
  },
  heroSubtitle: {
    fontSize: '1.5rem !important', // Adjust the font size as needed
  },
  section: {
    padding: theme.spacing(4),
    marginBottom: theme.spacing(4),
    borderRadius: theme.shape.borderRadius,
    backgroundColor: '#fff',
    boxShadow: theme.shadows[3],
  },
  sectionTitle: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: theme.spacing(2),
  },
  sectionIcon: {
    marginRight: theme.spacing(2),
  },
}));

const ApplicationFeatures = () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Box className={classes.hero}>
        <div className={classes.heroContent}>
          <Typography variant="h2" className={classes.heroTitle} gutterBottom>
            Welcome to Our Control Tower Application
          </Typography>
          <Typography variant="h5" className={classes.heroSubtitle}>
            Streamline your operations and gain valuable insights with our powerful functionalities.
          </Typography>
        </div>
      </Box>

      <Grid container spacing={4}>
        <Grid item xs={12} md={4}>
          <Paper className={classes.section}>
            <div className={classes.sectionTitle}>
              <AnalyticsIcon className={classes.sectionIcon} color="primary" />
              <Typography variant="h5">Analytics</Typography>
            </div>
            <Typography variant="body1">
              Gain deep insights into your business operations with advanced analytics. Our application provides customizable dashboards, data visualization tools, and real-time reporting to help you make informed decisions.
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper className={classes.section}>
            <div className={classes.sectionTitle}>
              <InventoryIcon className={classes.sectionIcon} color="primary" />
              <Typography variant="h5">Cycle Count Summary</Typography>
            </div>
            <Typography variant="body1">
              Track and manage inventory efficiently with our cycle count summary feature. Get accurate inventory counts, identify discrepancies, and optimize stock levels to improve warehouse operations.
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper className={classes.section}>
            <div className={classes.sectionTitle}>
              <MapIcon className={classes.sectionIcon} color="primary" />
              <Typography variant="h5">Inbound and Outbound</Typography>
            </div>
            <Typography variant="body1">
              Monitor inbound and outbound shipments by state with our interactive map view. Visualize shipment data, analyze trends, and optimize logistics routes for improved efficiency and cost savings.
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      <Box sx={{ my: 4, textAlign: 'center' }}>
        <Typography variant="body1">
          Explore these features and more to transform your supply chain management and logistics operations with our control tower application.
        </Typography>
      </Box>
    </div>
  );
};

export default ApplicationFeatures;
