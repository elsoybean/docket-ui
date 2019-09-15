//@flow

import React, { useState, useEffect } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import clsx from 'clsx';
import {
  Grid,
  AppBar,
  Toolbar,
  Typography,
  CircularProgress,
  Button,
} from '@material-ui/core';
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
  const [gameId, setGameId] = useLocalStorage('kkt-game-id');
  const [pendingCaseIds, setPendingCaseIds] = useState();
  const [error, setError] = useState();
  const [loading, setLoading] = useState(false);

  const useStyles = makeStyles((theme) => ({
    root: {
      flexGrow: 1,
      margin: theme.spacing(1),
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

  const handleAddAddress = (id: string, address: Address) => {
    console.log('Add Address', id, address);
  };

  useEffect(() => {
    handleLoadCases();
  }, []);

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6">Court Scraper</Typography>
        </Toolbar>
      </AppBar>

      <Notice error={error} />

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
        {(error || (pendingCaseIds && pendingCaseIds.length === 0)) && (
          <Grid item xs={12} className={classes.content}>
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
