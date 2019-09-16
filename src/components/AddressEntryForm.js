//@flow

import React, { useState, useEffect, useRef } from 'react';
import {
  Card,
  CardMedia,
  CircularProgress,
  Grid,
  TextField,
  Hidden,
  Button,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import type { Address } from './App';

type Props = {
  caseId: string,
  onUpdateAddress: (id: string, address: Address) => void,
};

const initialAddress = {
  street: '',
  extra: '',
  city: 'Washington',
  state: 'DC',
  zip: '',
};

const AddressEntryFlow = ({ caseId, onUpdateAddress }: Props) => {
  const [loading, setLoading] = useState(true);
  const [address, setAddress] = useState(initialAddress);
  const streetRef = useRef(null);

  useEffect(() => {
    setAddress(initialAddress);
    streetRef && streetRef.current && streetRef.current.focus();
  }, [caseId]);

  const handleImageLoaded = () => {
    setLoading(false);
  };

  const handleChange = (field) => (event) => {
    const newAddress = { ...address, [field]: event.target.value };
    setAddress(newAddress);
  };

  const useStyles = makeStyles((theme) => ({
    image: {
      marginBottom: theme.spacing(3),
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    button: {
      margin: theme.spacing(1),
    },
  }));

  const classes = useStyles();

  return (
    <>
      <Grid item xs={1} />
      <Grid item xs={10} className={classes.image}>
        {loading && <CircularProgress />}
        <Card>
          <CardMedia
            image={`/api/cases/${caseId}/address-png`}
            title="Address Image"
            component="img"
            onLoad={handleImageLoaded}
          />
        </Card>
      </Grid>
      <Grid item xs={1} />

      <Grid item xs={1} />
      <Grid item xs={10}>
        <TextField
          fullWidth
          required
          autoFocus
          inputRef={streetRef}
          label="Street Address"
          value={address.street}
          onChange={handleChange('street')}
        />
      </Grid>
      <Grid item xs={1} />

      <Grid item xs={1} />
      <Grid item xs={10}>
        <TextField
          fullWidth
          value={address.extra}
          onChange={handleChange('extra')}
        />
      </Grid>
      <Grid item xs={1} />

      <Grid item xs={1} />
      <Grid item xs={10} sm={5}>
        <TextField
          fullWidth
          required
          label="City"
          value={address.city}
          onChange={handleChange('city')}
        />
      </Grid>

      <Hidden smUp>
        <Grid item xs={1} />
        <Grid item xs={1} />
      </Hidden>

      <Grid item xs={4} sm={2}>
        <TextField
          fullWidth
          required
          label="ST"
          value={address.state}
          onChange={handleChange('state')}
        />
      </Grid>
      <Grid item xs={6} sm={3}>
        <TextField
          fullWidth
          required
          label="ZIP Code"
          value={address.zip}
          onChange={handleChange('zip')}
        />
      </Grid>
      <Grid item xs={1} />

      <Grid item xs={1} />
      <Hidden only="xs">
        <Grid item sm={5} />
      </Hidden>
      <Grid item xs={10} sm={5}>
        <Button
          fullWidth
          variant="contained"
          color="primary"
          type="submit"
          disabled={
            !(
              address &&
              address.street &&
              address.city &&
              address.state &&
              address.zip
            )
          }
          onClick={() => {
            onUpdateAddress(caseId, address);
          }}
        >
          Submit
        </Button>
      </Grid>
      <Grid item xs={1} />
    </>
  );
};

export default AddressEntryFlow;
