import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, FormControl, Select, MenuItem, Tooltip, Grid, Checkbox, ListItemText } from '@mui/material';
import { makeStyles } from '@mui/styles';


const useStyles = makeStyles((theme) => ({
  tableContainer: {
    marginTop: theme.spacing(10),
  },
  tableHeader: {
    color: '#0D47A1',
    fontWeight: 'bold',
  },
  formControl: {
    marginBottom: '20px !important' ,
    maxWidth: '300px',
    marginTop: '70px !important',
  },
  tooltip: {
    marginRight: theme.spacing(1),
  },
  select: {
    width: '100%',
  },
  title: {
    marginLeft: '-100px !important',
  },
  tableHeaderTitle: {
    textAlign: 'center !important',
    fontWeight: 'bold !important',
    fontSize: '1.2rem !important',
    color: '#0D47A1 !important',
    padding: theme.spacing(2),
  },
}));

const OutboundBacklog = () => {
  const classes = useStyles();
  const [data, setData] = useState([]);
  const [selectedState, setSelectedState] = useState(''); // Default to empty string for "All states"
  const [selectedTimes, setSelectedTimes] = useState([]);
  const [aggregatedData, setAggregatedData] = useState([]);
  const [availableTimes, setAvailableTimes] = useState([]);

  useEffect(() => {
    axios.get(`${process.env.PUBLIC_URL}/mockData.json`) // Replace with your actual data endpoint
      .then(response => {
        setData(response.data);
        computeAggregatedData(response.data);
        extractAvailableTimes(response.data);
      })
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  useEffect(() => {
    if (selectedState && data.length > 0) {
      const stateData = data.find(state => state.state === selectedState);
      if (stateData) {
        setAggregatedData(stateData.data);
        extractAvailableTimes([stateData]);
      }
    } else {
      computeAggregatedData(data);
      extractAvailableTimes(data);
    }
  }, [selectedState, data]);

  useEffect(() => {
    if (selectedTimes.length > 0) {
      const filteredData = data.map(state => ({
        ...state,
        data: state.data.filter(item => selectedTimes.includes(item.Time))
      }));
      computeAggregatedData(filteredData);
    } else {
      computeAggregatedData(data);
    }
  }, [selectedTimes, data]);

  const computeAggregatedData = (statesData) => {
    const aggregated = {};
    statesData.forEach(state => {
      state.data.forEach(timeData => {
        const key = `${timeData.Time}`;
        if (!aggregated[key]) {
          aggregated[key] = { ...timeData };
        } else {
          for (const field in timeData) {
            if (timeData.hasOwnProperty(field) && field !== 'Time') {
              aggregated[key][field] += timeData[field];
            }
          }
        }
      });
    });
    setAggregatedData(Object.values(aggregated));
  };

  const extractAvailableTimes = (statesData) => {
    const times = new Set();
    statesData.forEach(state => {
      state.data.forEach(item => {
        times.add(item.Time);
      });
    });
    setAvailableTimes(Array.from(times));
  };

  const handleStateChange = (event) => {
    const value = event.target.value;
    setSelectedState(value);
    if (value === '') {
      computeAggregatedData(data);
    }
  };

  const handleTimeChange = (event) => {
    const value = event.target.value;
    setSelectedTimes(value);
  };

  return (
    <Container>
      <Typography variant="h5" gutterBottom className={classes.title}>
        Outbound Backlog by SLA
      </Typography>
      <Grid container spacing={2} alignItems="center">
        <Grid item>
          <FormControl className={classes.formControl}>
            <Tooltip title="Select a state" arrow className={classes.tooltip}>
              <Select
                value={selectedState}
                onChange={handleStateChange}
                displayEmpty
                className={classes.select}
              >
                <MenuItem value="">
                  <em>Show all states</em>
                </MenuItem>
                {data.map((stateData, index) => (
                  <MenuItem key={index} value={stateData.state}>{stateData.state}</MenuItem>
                ))}
              </Select>
            </Tooltip>
          </FormControl>
        </Grid>
        <Grid item>
          <FormControl className={classes.formControl}>
            <Tooltip title="Select a time" arrow className={classes.tooltip}>
              <Select
                multiple
                value={selectedTimes}
                onChange={handleTimeChange}
                displayEmpty
                className={classes.select}
                renderValue={(selected) => selected.length === 0 ? <em>Show all times</em> : selected.join(', ')}
              >
                {availableTimes.map((time, index) => (
                  <MenuItem key={index} value={time}>
                    <Checkbox checked={selectedTimes.indexOf(time) > -1} />
                    <ListItemText primary={time} />
                  </MenuItem>
                ))}
              </Select>
            </Tooltip>
          </FormControl>
        </Grid>
      </Grid>
      <TableContainer component={Paper} className={classes.tableContainer}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell colSpan={Object.keys(aggregatedData[0] || {}).length} className={classes.tableHeaderTitle}>
                Ship Order Process Timeline
              </TableCell>
            </TableRow>
            <TableRow>
              {aggregatedData.length > 0 && Object.keys(aggregatedData[0]).map((key, index) => (
                <TableCell key={index} className={classes.tableHeader}>{key}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {aggregatedData.map((row, index) => (
              <TableRow key={index}>
                {Object.values(row).map((value, idx) => (
                  <TableCell key={idx}>{value}</TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default OutboundBacklog;
