//@flow

import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import { Snackbar, SnackbarContent, IconButton } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { amber, green } from '@material-ui/core/colors';
import CheckCircleIcon from '@material-ui/icons/Error';
import WarningIcon from '@material-ui/icons/Error';
import ErrorIcon from '@material-ui/icons/Error';
import CloseIcon from '@material-ui/icons/Error';
import InfoIcon from '@material-ui/icons/Error';

type Props = {
  error?: string,
  success?: string,
};

type ContentProps = {
  className?: string,
  message?: string,
  onClose?: () => void,
  variant: 'success' | 'warning' | 'error' | 'info',
};

const Notice = ({ error, success }: Props) => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(!!error || !!success);
  }, [error, success]);

  const variantIcon = {
    success: CheckCircleIcon,
    warning: WarningIcon,
    error: ErrorIcon,
    info: InfoIcon,
  };

  const useStyles = makeStyles((theme) => ({
    margin: {
      margin: theme.spacing(1),
    },
    button: {
      margin: theme.spacing(1),
    },
    success: {
      backgroundColor: green[600],
    },
    error: {
      backgroundColor: theme.palette.error.dark,
    },
    info: {
      backgroundColor: theme.palette.primary.main,
    },
    warning: {
      backgroundColor: amber[700],
    },
    icon: {
      fontSize: 20,
    },
    iconVariant: {
      opacity: 0.9,
      marginRight: theme.spacing(1),
    },
    message: {
      display: 'flex',
      alignItems: 'center',
    },
  }));

  const classes = useStyles();

  const MySnackbarContent = (props: ContentProps) => {
    const { className, message, onClose, variant, ...other } = props;
    const Icon = variantIcon[variant];

    return (
      <SnackbarContent
        className={clsx(classes[variant], className)}
        aria-describedby="client-snackbar"
        message={
          <span id="client-snackbar" className={classes.message}>
            <Icon className={clsx(classes.icon, classes.iconVariant)} />
            {message}
          </span>
        }
        action={[
          ...(onClose
            ? [
                <IconButton
                  key="close"
                  aria-label="close"
                  color="inherit"
                  onClick={onClose}
                >
                  <CloseIcon className={classes.icon} />
                </IconButton>,
              ]
            : []),
        ]}
        {...other}
      />
    );
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  return (
    <Snackbar
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'left',
      }}
      open={open}
      autoHideDuration={6000}
      onClose={handleSnackbarClose}
    >
      {(error || success) && (
        <MySnackbarContent
          variant={error ? 'error' : 'success'}
          className={classes.margin}
          message={error || success}
        />
      )}
    </Snackbar>
  );
};

export default Notice;
