import React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
   root: {
      display: 'flex',
      width: '100%',
      marginTop: '40px',
      marginBottom: "40px",
      justifyContent: 'center',
      alignItems: 'center',
      background: 'transparent',
      opacity: 1
   }
}))

export default function Spinner() {
   const classes = useStyles();

	return (
      <div className={classes.root}>
         <CircularProgress />
      </div>
   );
}