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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
} from '@mui/material';
import { makeStyles, createStyles } from '@mui/styles';
import PowerBIReport from './PowerBIreport';
import { models } from 'powerbi-client';
import NotificationsIcon from '@mui/icons-material/Notifications';
import HomeIcon from '@mui/icons-material/Home';
import AnalyticsIcon from '@mui/icons-material/Assessment';
import TableChartIcon from '@mui/icons-material/TableChart';
import * as XLSX from 'xlsx';

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      display: 'flex',
      height: '100vh',
    },
    appBar: {
      zIndex: theme.zIndex.drawer + 1,
      display: 'flex',
      justifyContent: 'space-between',
      backgroundColor: '#fff !important', // Add !important to ensure the color takes precedence
    },
    drawer: {
      width: 50,
      flexShrink: 0,
    },
    drawerPaper: {
      width: 50,
      backgroundColor: '#3f51b5 !important', // Blue background color for the sidebar
    },
    content: {
      flexGrow: 1,
      display: 'flex',
      flexDirection: 'column',
      padding: theme.spacing(3),
      backgroundColor: '#fff', // White background color for the main content area
    },
    toolbar: theme.mixins.toolbar,
    logo: {
      marginLeft: 'auto',
    },
    reportContainer: {
      flexGrow: 1,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100%',
    },
    notificationIcon: {
      color: '#3f51b5 !important', // Set the color of the icon to blue
    },
    tableContainer: {
      marginTop: theme.spacing(5),
    },
    tableHeader: {
      color: '#0D47A1!important', // Dark blue text color
      fontWeight: 'bold',
    },
    searchContainer: {
      display: 'flex',
      justifyContent: 'flex-end',
      marginBottom: theme.spacing(2),
    },
   
  })
);

const HomePage = () => {
  const classes = useStyles();
  const [currentPage, setCurrentPage] = useState('home');
  const [tableData, setTableData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  const embedConfig = {
    type: 'report',
    id: '459da35c-53d4-495e-b516-1712f7b3fc0c',
    embedUrl: 'https://app.powerbi.com/reportEmbed?reportId=459da35c-53d4-495e-b516-1712f7b3fc0c&config=eyJjbHVzdGVyVXJsIjoiaHR0cHM6Ly9XQUJJLUlORElBLUNFTlRSQUwtQS1QUklNQVJZLXJlZGlyZWN0LmFuYWx5c2lzLndpbmRvd3MubmV0IiwiZW1iZWRGZWF0dXJlcyI6eyJ1c2FnZU1ldHJpY3NWTmV4dCI6dHJ1ZX19',
    accessToken: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6IkwxS2ZLRklfam5YYndXYzIyeFp4dzFzVUhIMCIsImtpZCI6IkwxS2ZLRklfam5YYndXYzIyeFp4dzFzVUhIMCJ9.eyJhdWQiOiJodHRwczovL2FuYWx5c2lzLndpbmRvd3MubmV0L3Bvd2VyYmkvYXBpIiwiaXNzIjoiaHR0cHM6Ly9zdHMud2luZG93cy5uZXQvOTdmN2ZjYmQtZTY0Mi00YmU4LWI4NGYtZmMyY2Q3ZjhkNmZmLyIsImlhdCI6MTcxNjE4NDg1MCwibmJmIjoxNzE2MTg0ODUwLCJleHAiOjE3MTYxOTAyNDcsImFjY3QiOjAsImFjciI6IjEiLCJhaW8iOiJBVlFBcS84V0FBQUEvSVBwenB5VUVvSEZhL2hWYi9UOXpVekpqSDZwUnRIWng2S3FkamJ1WTlvVnFneDdtS1VkMFNWNkFleTRwUi8vV1RwY1RiK0ljb3ZWRVFiMWNOMzZKWXoycm1BelhMMEplTnJSTXU1ZzMvMD0iLCJhbXIiOlsicHdkIiwicnNhIiwibWZhIl0sImFwcGlkIjoiODcxYzAxMGYtNWU2MS00ZmIxLTgzYWMtOTg2MTBhN2U5MTEwIiwiYXBwaWRhY3IiOiIwIiwiZGV2aWNlaWQiOiJlZTg2MDhjNC04Y2RkLTQxOTYtYTA1OS01MTgwZmJiZDlmMWEiLCJmYW1pbHlfbmFtZSI6IlByZW1uYXRoIiwiZ2l2ZW5fbmFtZSI6IlByYWRlZXAiLCJpcGFkZHIiOiI0My4yNDYuMTM4LjExNSIsIm5hbWUiOiJQcmFkZWVwIFByZW1uYXRoIiwib2lkIjoiODM3ZmJlYTAtYmU4ZC00Y2ZhLWIwODQtOTc0MTBlZGVhMjA0Iiwib25wcmVtX3NpZCI6IlMtMS01LTIxLTEzNDEzNDQwNzAtMTIxMjA3NDM3MC0yMzAwMTMyODM2LTMyNzE2IiwicHVpZCI6IjEwMDMyMDAyRjE5NUQzRUEiLCJyaCI6IjAuQVhJQXZmejNsMExtNkV1NFRfd3MxX2pXX3drQUFBQUFBQUFBd0FBQUFBQUFBQUREQVBzLiIsInNjcCI6InVzZXJfaW1wZXJzb25hdGlvbiIsInNpZ25pbl9zdGF0ZSI6WyJkdmNfbW5nZCIsImR2Y19jbXAiLCJkdmNfZG1qZCIsImttc2kiXSwic3ViIjoiVXJ3WVpCU3NjT0JIZzlSZ19rS3diSGlscFNsVWlmbVl5U3FEc3JQZG9IRSIsInRpZCI6Ijk3ZjdmY2JkLWU2NDItNGJlOC1iODRmLWZjMmNkN2Y4ZDZmZiIsInVuaXF1ZV9uYW1lIjoicHJhZGVlcC5wcmVtbmF0aEBzcm10ZWNoLmNvbSIsInVwbiI6InByYWRlZXAucHJlbW5hdGhAc3JtdGVjaC5jb20iLCJ1dGkiOiJ0bXU2cGFnUm5rS3ptSG1IdEZvWEFBIiwidmVyIjoiMS4wIiwid2lkcyI6WyJiNzlmYmY0ZC0zZWY5LTQ2ODktODE0My03NmIxOTRlODU1MDkiXX0.f-st0u7nmsKSbKm-NnCghZG4PoedFKsOyDWH5LiT5fonSarUmBd3P_B0iGst5MldXHWCwgrl8rKYtYceC0cgNSdy-jv3TH92pFw8uDxx3Jb_b8qSma7Ax3nSBvBDrswI1PnHi5bykmaK6d-jB6E7GyXrHuzCATI-FLnvmG9ZboOXoScTt9bODX5863gUWZCDR5b5dZSLDkZFzudHNgBj3jJWbsqms4eUvKyyqU-aK3rUKt0KmB9wh6P1MNrTiaCCyM2zep1fVxcCa__yxkvMQq5T9ZLyBfg3zwmU318hZNG0NnT7bXstcqaWNaWsAe9-XO499ZBTeH330P-NhNncoA', // Fetch this securely
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
    { text: 'Analytics', icon: <AnalyticsIcon />, page: 'analytics' },
    { text: 'Cycle Count Summary', icon: <TableChartIcon />, page: 'cycleCount' },
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
    const batchIdColumnIndex = tableData[0].indexOf('Batch Count ID'); // Assuming the header is 'Batch ID'
    if (batchIdColumnIndex === -1) return true; // If no 'Batch ID' column is found, show all rows
    return row[batchIdColumnIndex].toString().toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar>
        <Typography variant="h6" noWrap style={{ color: currentPage === 'cycleCount' ? '#3f51b5 !important' : '#000' }}>
          {currentPage === 'cycleCount' ? 'Operations' : 'My Application'}
        </Typography>
          <div className={classes.logo}>
            <IconButton color="inherit">
              <Badge badgeContent={3} color="error">
                <NotificationsIcon className={classes.notificationIcon} />
              </Badge>
            </IconButton>
            {/* Add other content here */}
          </div>
        </Toolbar>
      </AppBar>
      <Drawer
        className={classes.drawer}
        variant="permanent"
        classes={{ paper: classes.drawerPaper }}
      >
        <div className={classes.toolbar} />
        <List>
          {menuItems.map((item, index) => (
            <ListItem button key={index} onClick={() => setCurrentPage(item.page)}>
              <ListItemIcon>{item.icon}</ListItemIcon>
            </ListItem>
          ))}
        </List>
      </Drawer>
      <main className={classes.content}>
        <div className={classes.toolbar} />
        {currentPage === 'home' && (
          <>
            <Typography variant="h4" gutterBottom>
              Control Tower
            </Typography>
            <Typography variant="body1">
              This is the main content area. Click on the navigation items to switch pages.
            </Typography>
          </>
        )}
        {currentPage === 'analytics' && (
          <Box className={classes.reportContainer}>
            <PowerBIReport embedConfig={embedConfig} />
          </Box>
        )}
        {currentPage === 'cycleCount' && (
          <>
            <Typography variant="h4" gutterBottom>
              Cycle Count Summary
            </Typography>
            <div className={classes.searchContainer}>
              <TextField
                label="Search by Batch ID"
                variant="outlined"
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </div>
            {tableData.length > 0 && (
              <TableContainer component={Paper} className={classes.tableContainer}>
                <Table>
                  <TableHead>
                    <TableRow>
                      {tableData[0].map((header, index) => (
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
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default HomePage;
