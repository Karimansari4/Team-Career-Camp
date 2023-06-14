import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
// import Link from '@mui/material/Link';
import { Link, useNavigate } from 'react-router-dom';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import axios from 'axios'
import MuiAlert from '@mui/material/Alert';
import { Paper, Snackbar } from '@mui/material';

const theme = createTheme();

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function SignIn() {
  const url = "https://college-project.onrender.com"

  const navigate = useNavigate()

  const [open, setOpen] = React.useState(false);
  const [customVariant, setCustomVariant] = React.useState('success')
  const [error, setError] = React.useState('')
  const [emp, setEmp] = React.useState({
    email: '',
    password: ''
  })
  const [valErr, setValErr] = React.useState({
    email: '',
    password: ''
  })
  


  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  }

  const handleOnChange = (evt) => {
    setEmp({
      ...emp,
      [evt.target.name]: evt.target.value
    })

    setValErr({
      email: '',
      password: ''
    })
  }

  const handleSubmit = async(evt) => {
    evt.preventDefault();
    if(!emp.email){
      setValErr({
        email: 'Please enter email!'
      })
    }else if(!emp.password){
      setValErr({
        password: 'Please enter password!'
      })
    }else if(emp.password.length < 5){
      setValErr({
        password: 'Password must be more than 5 words!'
      })
    }else{
      return await axios.post(`https://college-project.onrender.com/empAuth/signIn`, emp).then((response) => { 
      // return await axios.post(`http://localhost:4000/empAuth/signIn`, emp).then((response) => {
        // console.log("response: ", response);
        const token = response.data.token
        localStorage.setItem("token", token)
        navigate('/')
      }).catch((err) => {
        setError(err.response.data.msg)
        setCustomVariant('error')
        setOpen(true)
        console.log("err: ", err);
      })
    }
  }

  // const BASE_URL = process.env.REACT_APP_TRY;

  // console.log("url: ", window.env.URL_ONLINE);
  // console.log("TRY: ", BASE_URL);

  return (
    <ThemeProvider theme={theme}>
      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
          <Alert onClose={handleClose} severity={customVariant} sx={{ width: '100%' }}>
              {error ? error : ''}
          </Alert>
      </Snackbar>
      <Grid container component="main" maxWidth="xs" sx={{ height: '100vh'}}>
        <CssBaseline />
        <Grid item xs={false} sm={6} md={7} sx={{ backgroundImage: 'url(background2.jpg)', backgroundRepeat: 'no-repeat', backgroundSize: 'cover', backgroundPosition: 'center'}} />

        <Grid item xs={12} sm={6} md={5} component={Paper} elevation={6} square>
          <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center', p: 2}} >
            <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Sign in
            </Typography>
            <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 , }}>
              <Grid container spacing={2}>
                <Grid item xs={12}>

                  <TextField error={valErr.email ? true : false} helperText={valErr.email ? valErr.email : ''} required fullWidth id="email" onChange={handleOnChange} label="Email Address" name="email" autoComplete="email" />

                </Grid>
                <Grid item xs={12} sx={{ mt: 2}}>

                  <TextField error={valErr.password ? true : false} helperText={valErr.password ? valErr.password : ''} required fullWidth name="password" onChange={handleOnChange} label="Password" type="password" id="password" />

                </Grid>
              </Grid>
              
              <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }} > Sign In </Button>
              <Grid container>
                <Grid item>
                  <Link to="/signup" variant="body2" style={{ textDecoration: 'none'}}>
                    {"Don't have an account? Sign Up"}
                  </Link>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}