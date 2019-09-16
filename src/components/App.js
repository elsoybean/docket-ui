//@flow

import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import {
  Grid,
  AppBar,
  Toolbar,
  Typography,
  CircularProgress,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Link,
} from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import { makeStyles } from '@material-ui/core/styles';
import Notice from './Notice';
import AddressEntryForm from './AddressEntryForm';

export type Address = {
  street: string,
  extra?: string,
  city: string,
  state: string,
  zip: string,
};

const App = () => {
  const [pendingCaseIds, setPendingCaseIds] = useState([]);
  const [error, setError] = useState();
  const [success, setSuccess] = useState();
  const [loading, setLoading] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const useStyles = makeStyles((theme) => ({
    root: {
      flexGrow: 1,
      margin: theme.spacing(1),
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    content: {
      display: 'flex',
      alignItems: 'space-around',
      justifyContent: 'center',
    },
    subHead: {
      marginTop: theme.spacing(1),
      marginBottom: theme.spacing(3),
      justifyContent: 'flex-start',
    },
    reload: {
      flexDirection: 'column',
      marginBottom: theme.spacing(3),
      justifyContent: 'space-around',
      alignItems: 'center',
    },
    button: {
      margin: theme.spacing(1),
    },
  }));

  const classes = useStyles();

  const handleLoadCases = async () => {
    setError(null);
    setLoading(true);
    try {
      const response = await fetch('/api/cases');
      if (!response.ok) {
        throw new Error(response.statusText);
      }
      const cases = (await response.json()) || [];
      const pendingIds = cases.filter((c) => !c.address).map((c) => c._id);
      setPendingCaseIds(pendingIds);
    } catch (err) {
      setError('Could not load pending cases.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddAddress = async (id: string, address: Address) => {
    setError(null);
    setLoading(true);
    try {
      const response = await fetch(`/api/cases/${id}/address`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(address),
      });
      if (!response.ok) {
        throw new Error(response.statusText);
      }
      setPendingCaseIds(pendingCaseIds.filter((i) => i !== id));
      setSuccess('Successfully added address');
    } catch (err) {
      setError('Could not update case address.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    handleLoadCases();
  }, []);

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            edge="start"
            className={classes.menuButton}
            color="inherit"
            aria-label="menu"
            onClick={handleOpenMenu}
          >
            <MenuIcon />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={handleCloseMenu}
          >
            <MenuItem onClick={handleCloseMenu}>Address Entry</MenuItem>
            <MenuItem onClick={handleCloseMenu}>
              <Link color="inherit" underline="none" href="/upcoming.csv">
                Download CSV
              </Link>
            </MenuItem>
          </Menu>
          <Typography variant="h6">Court Scraper</Typography>
        </Toolbar>
      </AppBar>

      <Notice error={error} success={success} />

      <Grid container spacing={3}>
        <Grid item xs={12} className={clsx(classes.content, classes.subHead)}>
          <Typography variant="subtitle1">
            Address Entry / Correction
          </Typography>
        </Grid>

        {loading && (
          <Grid item xs={12} className={classes.content}>
            <CircularProgress />
          </Grid>
        )}
        {!loading && pendingCaseIds && pendingCaseIds.length === 0 && (
          <Grid item xs={12} className={clsx(classes.content, classes.reload)}>
            <Typography variant="subtitle2">No Addresses to Enter</Typography>
            <Button
              variant="contained"
              color="primary"
              className={classes.button}
              onClick={handleLoadCases}
            >
              Reload Cases
            </Button>
          </Grid>
        )}
        {pendingCaseIds && pendingCaseIds.length > 0 && (
          <AddressEntryForm
            caseId={pendingCaseIds[0]}
            onUpdateAddress={handleAddAddress}
          />
        )}
      </Grid>
    </div>
  );
};

export default App;
