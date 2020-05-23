import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Tooltip from '@material-ui/core/Tooltip';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';
import FormLabel from '@material-ui/core/FormLabel';

import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';

import KeyboardVoiceIcon from '@material-ui/icons/KeyboardVoice';

import StopIcon from '@material-ui/icons/Stop';

import './DsApi.js'
import { Typography } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      margin: theme.spacing(1),
    },

  },
  input: {
    display: 'none',
  },
  paper: {
    margin: theme.spacing(1),
    padding: theme.spacing(0)

  }
}));

export default function ContainedButtons(props) {
  const classes = useStyles();

  return (
    <Grid
      container
      direction="row"
      justify="center"
      alignItems="center"
      //spacing={3}
      className={classes.root}
    >
      <FormLabel component="legend">Bdu asekles</FormLabel>
            

      <Tooltip title={props.disStop ? "Bdu Asekles" : "Ḥbes Asekles"} >
        <Fab
          color={props.disStop ? "primary" : "secondary"}
          aria-label="record"
          variant="extended"
          onClick={ props.disStop ? props.clickStart : props.clickStop}
         // disabled={props.disStart}
        >
          {props.disStop ? <KeyboardVoiceIcon /> : <StopIcon /> }
          {props.disStop ? "Sekles" : "Ḥbes" }
      </Fab >
      </Tooltip>



        <Typography paragraph>
        {props.renderTime}
      </Typography>

    </Grid>

  );
}