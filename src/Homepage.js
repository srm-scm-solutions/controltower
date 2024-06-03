import React, { useState, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  CssBaseline,
  Box,
  IconButton,
  Badge,
  Tooltip,
  TextField,
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Divider,
  Popover,
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import PowerBIReport from './PowerBIreport';
import { models } from 'powerbi-client';
import NotificationsIcon from '@mui/icons-material/Notifications';
import HomeIcon from '@mui/icons-material/Home';
import AnalyticsIcon from '@mui/icons-material/Assessment';
import TableChartIcon from '@mui/icons-material/TableChart';
import MapIcon from '@mui/icons-material/Map';
import OutboundBacklogIcon from '@mui/icons-material/WorkOutline';
import InfoIcon from '@mui/icons-material/Info';
import MapPage from './mapPage';
import ApplicationFeatures from './Startpage';
import OutboundBacklog from './OutBacklog';
import * as XLSX from 'xlsx';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    height: '100vh',
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 2, // Ensure the AppBar is on top of the Drawer
    display: 'flex',
    justifyContent: 'space-between',
    backgroundColor: '#fff !important',
  },
  drawer: {
    width: 50,
    flexShrink: 0,
  },
  drawerPaper: {
    width: 50,
    backgroundColor: '#3f51b5 !important',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    overflowX: 'hidden',
  },
  drawerContainer: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    paddingTop: theme.spacing(8), // Add padding to push down the icons
  },
  content: {
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
    padding: theme.spacing(3),
    backgroundColor: '#fff',
  },
  toolbar: theme.mixins.toolbar,
  logo: {
    marginLeft: 'auto',
  },
  title: {
    color: '#0D47A1 !important', // Dark blue color
    marginLeft: '29px !important',
  },
  reportContainer: {
    flexGrow: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
  notificationIcon: {
    color: '#3f51b5 !important',
  },
  tableContainer: {
    marginTop: theme.spacing(5),
  },
  tableHeader: {
    color: '#0D47A1!important',
    fontWeight: 'bold',
  },
  searchContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center', // Align items vertically in the center
    marginBottom: theme.spacing(2),
  },
  searchField: {
    marginRight: theme.spacing(2), // Add some right margin to the search field
  },
  exportButton: {
    marginLeft: theme.spacing(1), // Add margin to the left of the export button
  },

  aboutIcon: {
    marginBottom: theme.spacing(2),
  },
  aboutContainer: {
    marginTop: 'auto',
  },
}));

const HomePage = () => {
  const classes = useStyles();
  const [currentPage, setCurrentPage] = useState('home');
  const [tableData, setTableData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [anchorEl, setAnchorEl] = useState(null); // State for the Popover

  const embedConfig = {
    type: 'report',
    id: '459da35c-53d4-495e-b516-1712f7b3fc0c',
    embedUrl: 'https://app.powerbi.com/reportEmbed?reportId=459da35c-53d4-495e-b516-1712f7b3fc0c&config=eyJjbHVzdGVyVXJsIjoiaHR0cHM6Ly9XQUJJLUlORElBLUNFTlRSQUwtQS1QUklNQVJZLXJlZGlyZWN0LmFuYWx5c2lzLndpbmRvd3MubmV0IiwiZW1iZWRGZWF0dXJlcyI6eyJ1c2FnZU1ldHJpY3NWTmV4dCI6dHJ1ZX19',
    accessToken: '', // Fetch this securely
    tokenType: models.TokenType.Aad,
    settings: {
      panes: {
        filters: { visible: false },
        pageNavigation: { visible: true },
      },
    },
  };

  const menuItems = [
    { text: 'Home', icon: <HomeIcon />, page: 'home' },
    { text: 'Cycle Count Summary', icon: <TableChartIcon />, page: 'cycleCount' },
    { text: 'Map', icon: <MapIcon />, page: 'map' },
    { text: 'Outbound Backlog', icon: <OutboundBacklogIcon />, page: 'outboundBacklog' },
    { text: 'Analytics', icon: <AnalyticsIcon />, page: 'analytics' },
  ];

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch('/data.xlsx');
      const arrayBuffer = await response.arrayBuffer();
      const data = new Uint8Array(arrayBuffer);
      const workbook = XLSX.read(data, { type: 'array' });
      const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
      const sheetData = XLSX.utils.sheet_to_json(firstSheet, { header: 1 });
      setTableData(sheetData);
    };

    if (currentPage === 'cycleCount') {
      fetchData();
    }
  }, [currentPage]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredData = tableData.slice(1).filter((row) => {
    const batchIdColumnIndex = tableData[0].indexOf('Batch Count ID');
    if (batchIdColumnIndex === -1) return true;
    return row[batchIdColumnIndex].toString().toLowerCase().includes(searchTerm.toLowerCase());
  });

  const handleAboutClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleAboutClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  const exportData = () => {
    const csvData = [tableData[0], ...filteredData].map((row) => row.join(',')).join('\n');
    const csvBlob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    const csvUrl = URL.createObjectURL(csvBlob);
    const tempLink = document.createElement('a');
    tempLink.href = csvUrl;
    tempLink.setAttribute('download', 'cycle_count_data.csv');
    tempLink.click();
  };

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar>
          <Typography variant="h6" noWrap className={classes.title}>
            Control Tower
          </Typography>
          <div className={classes.logo}>
            <IconButton color="inherit">
              <Badge badgeContent={3} color="error">
                <NotificationsIcon className={classes.notificationIcon} />
              </Badge>
            </IconButton>
          </div>
        </Toolbar>
      </AppBar>
      <Drawer
        className={classes.drawer}
        variant="permanent"
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <div className={classes.drawerContainer}>
          <List>
            {menuItems.map((item, index) => (
              <Tooltip title={item.text} key={index} placement="right">
                <ListItem
                  button
                  onClick={() => setCurrentPage(item.page)}
                >
                  <ListItemIcon>{item.icon}</ListItemIcon>
                </ListItem>
              </Tooltip>
            ))}
          </List>
          <Divider />
          <div className={classes.aboutContainer}>
            <Tooltip title="About" placement="right">
              <IconButton
                className={classes.aboutIcon}
                aria-describedby={id}
                onClick={handleAboutClick}
              >
                <InfoIcon />
              </IconButton>
            </Tooltip>
          </div>
        </div>
      </Drawer>
      <main className={classes.content}>
        <Toolbar />
        {currentPage === 'analytics' && (
          <Box className={classes.reportContainer}>
            <PowerBIReport embedConfig={embedConfig} />
          </Box>
        )}
        {currentPage === 'cycleCount' && (
          <Box>
            <Typography variant="h4" gutterBottom>
              Cycle Count Summary
            </Typography>
            <div className={classes.searchContainer}>
              <TextField
                className={classes.searchField}
                label="Search by Batch ID"
                variant="outlined"
                value={searchTerm}
                onChange={handleSearchChange}
              />
              <Tooltip title="Export Data" placement="right">
                <IconButton onClick={exportData} className={classes.exportButton}>
                  <CloudDownloadIcon />
                </IconButton>
              </Tooltip>
            </div>
            <TableContainer component={Paper} className={classes.tableContainer}>
              <Table>
                <TableHead>
                  <TableRow>
                    {tableData[0] && tableData[0].map((header, index) => (
                      <TableCell key={index} className={classes.tableHeader}>
                        {header}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredData.map((row, rowIndex) => (
                    <TableRow key={rowIndex}>
                      {row.map((cell, cellIndex) => (
                        <TableCell key={cellIndex}>{cell}</TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        )}
        {currentPage === 'map' && <MapPage />}
        {currentPage === 'outboundBacklog' && <OutboundBacklog />}
        {currentPage === 'home' && <ApplicationFeatures />}
      </main>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleAboutClose}
        anchorOrigin={{
          vertical: 'center',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'center',
          horizontal: 'left',
        }}
      >
        <Box p={2}>
          <Typography variant="h6">About This App</Typography>
          <Typography variant="body1">Version: 1.0.0</Typography>
          <Typography variant="body1">Environment: Test</Typography>
        </Box>
      </Popover>
    </div>
  );
};

export default HomePage;
