import { Avatar, Box, Button, Container, Grid, Snackbar, TextField, Typography } from '@mui/material'
import React, { useState } from 'react'
import axios from 'axios'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import moment from 'moment'
import MuiAlert from '@mui/material/Alert';
import BusinessRoundedIcon from '@mui/icons-material/BusinessRounded';
import { TimePicker } from '@mui/x-date-pickers';


const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });

function AddInterview() {
    const url = "https://college-project.onrender.com"

    const [open, setOpen] = React.useState(false);
    const [customVariant, setCustomVariant] = React.useState('success')
    const [success, setSuccess] = React.useState('')
    const [error, setError] = React.useState('')

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
        return;
        }
        setOpen(false);
    }
    
    const [company, setCompany] = useState({
        name: '',
        date: '',
        time: '',
    })

    const [valErr, setValErr] = React.useState({
        name: '',
        date: '',
        time: '',
    })

    const handleOnChange = (evt) => {
        setCompany({
          ...company,
          [evt.target.name]: evt.target.value
        })
    
        setValErr({
          name: '',
          date: '',
          time: '',
        })
    }

    const handleChangeData = (evt) => {
        setCompany({
            ...company,
            date: moment(evt.$d).format('DD/MM/YYYY'),
        })
        
        setValErr({
            ...valErr,
            date: '',
            time: ''
        })
    };

    const handleTimeChange = (evt) => {
        setCompany({
            ...company,
            time: moment(evt.$d).format("hh:mm:ss a")
        })
        setValErr({
            ...valErr,
            date: '',
            time: ''
        })
    }

    const handleSubmit = async(evt) => {
        evt.preventDefault()
        if(!company.name){
            setValErr({
                name: 'Please enter company name?'
            })
        }else if(!company.date){
            setValErr({
                date: 'Please select date?'
            })
        }else if(!company.time){
            setValErr({
                time: 'Please selet time?'
            })
        }else{
            
            return await axios.post(`${url}/interview/createInterivew`, company).then((response) => {
                setSuccess(response.data.msg)
                setCustomVariant('success')
                setOpen(true)
                setCompany({
                    name: '',
                    date: '',
                    time: '',
                })
            }).catch((err) => {
                console.log("error on adding interview: ", err);
                setError(err.response.data.err)
                setCustomVariant('error')
                setOpen(true)
            })
        }

    }
    
    return (
        <Container>
            <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
                <Alert onClose={handleClose} severity={customVariant} sx={{ width: '100%' }}>
                    {success ? success : error}
                </Alert>
            </Snackbar>
            <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3, p: 2, backgroundColor: "lightgray", borderRadius: '10px'}}>
            <center>
                <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}> <BusinessRoundedIcon /> {/* interview icon */} </Avatar>
                <Typography component="h1" variant="h5"> Add Interview </Typography>
            </center>
            <Grid container spacing={2} sx={{mt: 1}} >
              <Grid item  xs={12} md={12} lg={12}>
                <TextField style={{ backgroundColor: 'white', borderRadius: '5px'}} error={valErr.name ? true : false} autoComplete="given-name" name="name" value={company.name} onChange={handleOnChange} required fullWidth id="name" label="Name" autoFocus />
                <Typography variant='body1' color={'error'} component="p" >{valErr.name ? valErr.name : ''}</Typography>
              </Grid>

              <Grid item xs={12}  md={12} lg={12}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                        label="Date"
                        slotProps={{
                            textField: {
                                placeholder: 'MM / DD / YYYY',
                            },
                        }}
                        name="date"
                        sx={{backgroundColor: 'white', borderRadius: '5px', width: '100%'}}
                        onChange={handleChangeData}
                    />
                    <Typography variant='body1' color={'error'} component="p" >{valErr.date ? valErr.date : ''}</Typography>
                </LocalizationProvider>
            </Grid>

            <Grid item xs={12}  md={12} lg={12}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <TimePicker
                    name="time" 
                    onChange={handleTimeChange} 
                    sx={{backgroundColor: 'white', borderRadius: '5px', width: '100%'}}
                />
                </LocalizationProvider>
            </Grid>
                <Grid item xs={12}  md={12} lg={12}>
                    <Button variant='contained' color='success' fullWidth type='submit' >addt</Button>
                </Grid>
            </Grid>
          </Box>
        </Container>
    )
}

export default AddInterview