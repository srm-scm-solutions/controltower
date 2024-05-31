import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Tooltip } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import mapData from './mapData.json';
import { Typography, Box, Table, TableContainer, TableBody, TableRow, TableCell, MenuItem, Select } from '@mui/material';
import { makeStyles } from '@mui/styles';
import markerIcon from './marker.png';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: theme.spacing(3),
    [theme.breakpoints.up('md')]: {
      flexDirection: 'row',
      alignItems: 'flex-start',
    },
  },
  mapContainer: {
    height: '450px',
    width: '300px',
    margin: theme.spacing(0, 0),
    [theme.breakpoints.up('md')]: {
      width: '900px',
      marginLeft: theme.spacing(6),
      marginTop: theme.spacing(6)
    },
  },
  searchContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    margin: theme.spacing(11, 0),
    [theme.breakpoints.up('md')]: {
      alignItems: 'flex-end',
      marginLeft: 'auto',
    },
  },
  searchInput: {
    width: '250px',
  },
  selectedStateContainer: {
    display: 'flex',
    alignItems: 'center',
  },
  selectedStateText: {
    marginRight: theme.spacing(68),
    fontSize: '1.50rem', // Increase font size
    color: 'darkblue', // Set font color to dark blue
  },
  tableContainer: {
    width: '100%',
    maxWidth: '300px',
    margin: theme.spacing(2, 0),
    [theme.breakpoints.up('md')]: {
      marginRight: theme.spacing(6),
    },
  },
  sectionTitle: {
    margin: theme.spacing(-5, 0),
  },
  mainTitle: {
    margin: theme.spacing(-5, -48),
    fontSize: '1.5rem',
    textAlign: 'left',
  },
}));

const MapPage = () => {
  const classes = useStyles();
  const [selectedStates, setSelectedStates] = useState([]);

  const handleStateSelection = (event) => {
    const selectedStateNames = event.target.value;
    if (selectedStateNames.includes('All')) {
      setSelectedStates([]);
    } else {
      const selectedStatesData = mapData.filter((state) => selectedStateNames.includes(state.state));
      setSelectedStates(selectedStatesData);
    }
  };

  // Custom marker icon
  const customMarkerIcon = L.icon({
    iconUrl: markerIcon,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
  });

  const totalInbound = selectedStates.length > 0
    ? selectedStates.reduce((acc, state) => acc + state.inbound, 0)
    : mapData.reduce((acc, curr) => acc + curr.inbound, 0);
  const totalOutbound = selectedStates.length > 0
    ? selectedStates.reduce((acc, state) => acc + state.outbound, 0)
    : mapData.reduce((acc, curr) => acc + curr.outbound, 0);

  const selectedStateNames = selectedStates.length > 0
    ? selectedStates.map((state) => state.state).join(', ')
    : 'All states';

  return (
    <div className={classes.root}>
      <Box className={classes.tableContainer}>
        <TableContainer>
          <Table>
            <TableBody>
              <TableRow>
                <TableCell>Total Inbound</TableCell>
                <TableCell>{totalInbound}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Total Outbound</TableCell>
                <TableCell>{totalOutbound}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
      <div>
        <Typography variant="h4" className={classes.mainTitle}>Inbound and Outbound</Typography>
        <Box className={classes.searchContainer}>
          <Box className={classes.selectedStateContainer}>
            <Typography variant="body1" className={classes.selectedStateText}>
              {selectedStateNames}
            </Typography>
            <Select
              multiple
              displayEmpty
              value={selectedStates.map((state) => state.state)}
              onChange={handleStateSelection}
              className={classes.searchInput}
              renderValue={(selected) => (selected.length > 0 ? selected.join(', ') : 'All')}
            >
              <MenuItem disabled value="">
                <em>Select states</em>
              </MenuItem>
              <MenuItem value="All">
                All
              </MenuItem>
              {mapData.map((state) => (
                <MenuItem key={state.state} value={state.state}>
                  {state.state}
                </MenuItem>
              ))}
            </Select>
          </Box>
        </Box>
        <MapContainer center={[37.8, -96]} zoom={4} className={classes.mapContainer}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          {(selectedStates.length > 0 ? selectedStates : mapData).map((stateData, index) => (
            <Marker key={index} position={[stateData.lat, stateData.lng]} icon={customMarkerIcon}>
              <Tooltip>
                <div>
                  <div>{stateData.state}</div>
                  <div>Inbound: {stateData.inbound}</div>
                  <div>Outbound: {stateData.outbound}</div>
                </div>
              </Tooltip>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
};

export default MapPage;
