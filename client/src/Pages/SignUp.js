 import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import { Link } from 'react-router-dom';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { Paper } from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import { Snackbar } from '@mui/material'

// http://localhost:4000/admin/login

const theme = createTheme();

// Alert notification of MUI
const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function SignUp() {
  const url = "https://team-career-camp.onrender.com"
  const localUrl = "http://localhost:4000"
  
  // react-router-dom navigation function
  const navigate = useNavigate()

  // states
  const [emp, setEmp] = React.useState({
    name: '',
    email: '',
    password: '',
    conPass: ''
  })
  const [valErr, setValErr] = React.useState({
    name: '',
    email: '',
    password: '',
    conPass: ''
  })
  const [open, setOpen] = React.useState(false);
  const [customVariant, setCustomVariant] = React.useState('error')
  const [error, setError] = React.useState('')


  // handle close for UI component alert
  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  }

  // input onchange event
  const handleOnChange = (evt) => {
    setEmp({
      ...emp,
      [evt.target.name]: evt.target.value
    })

    setValErr({
      name: '',
      email: '',
      password: '',
      conPass: ''
    })
  }

  // handle submit to signUp
  const handleSubmit = async(evt) => {
    evt.preventDefault();
    if(!emp.name){
      setValErr({
        name: 'Please enter name!'
      })
    }else if(!emp.email){
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
    }else if(emp.conPass !== emp.password){
      setValErr({
        conPass: 'Password and confirm password are not matched!'
      })
    }else{
        return await axios.post(`${localUrl}/empAuth/signUp`, emp).then((response) => {
        
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
  };

  return (
    <ThemeProvider theme={theme}>
      <Grid container component="main" maxWidth="xs" sx={{ height: '100vh'}}>
        <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
            <Alert onClose={handleClose} severity={customVariant} sx={{ width: '100%' }}>
                {error ? error : ''}
            </Alert>
        </Snackbar>
        <CssBaseline />
        <Grid item xs={false} sm={false} md={6} sx={{ backgroundImage: 'url(background1.jpg)', backgroundRepeat: 'no-repeat', backgroundSize: 'cover', backgroundPosition: 'center'}} />


        <Grid  item xs={12} sm={12} md={6} component={Paper} elevation={6} square>
          <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center', p: 2}} >
            <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Sign up
            </Typography>
            <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
              <Grid container spacing={2}>
                <Grid item xs={12}>

                  <TextField error={valErr.name ? true : false} helperText={valErr.name ? valErr.name : ''} autoComplete="given-name" name="name" onChange={handleOnChange} required fullWidth id="name" label="Name" autoFocus />

                </Grid>
                <Grid item xs={12}>

                  <TextField error={valErr.email ? true : false} helperText={valErr.email ? valErr.email : ''} required fullWidth id="email" onChange={handleOnChange} label="Email Address" name="email" autoComplete="email" />

                </Grid>
                <Grid item xs={12}>

                  <TextField error={valErr.password ? true : false} helperText={valErr.password ? valErr.password : ''} required fullWidth name="password" onChange={handleOnChange} label="Password" type="password" id="password" />

                </Grid>
                <Grid item xs={12}>

                  <TextField error={valErr.conPass ? true : false} helperText={valErr.conPass ? valErr.conPass : ''} required fullWidth name="conPass" onChange={handleOnChange} label="Confirm Password" type="password" id="conPass" />

                </Grid>
              </Grid>

              <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }} >
                Sign Up
              </Button>
              <Grid container justifyContent="flex-end">
                <Grid item>
                  <Link to="/signin" variant="body2" style={{ textDecoration: 'none'}}>
                    Already have an account? Sign in
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