import React, { Fragment, useState } from 'react'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { Button, Collapse, Divider, FormControl, Grid, IconButton, InputLabel, MenuItem, Select, Snackbar, Table, TableBody, TableCell, TableHead, TableRow, TextField, Typography, setRef } from '@mui/material';
import { Box } from '@mui/system';
import moment from 'moment'
import axios from 'axios';
import MuiAlert from '@mui/material/Alert';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });

function InterviewRow({company, companyId, refresh, setRefresh}) {
    const url = "https://college-project.onrender.com"

    const [open, setOpen] = React.useState(false);
    const [student, setStudent] = useState({
        email: '',
        result: ''
    })
    const [valErr, setValErr] = React.useState({
        email: '',
        result: '',
    })
    
    
    const [alertOpen, setAlertOpen] = useState(false)
    const [customVariant, setCustomVariant] = React.useState('success')
    const [success, setSuccess] = React.useState('')
    const [error, setError] = React.useState('')

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
        return;
        }
        setAlertOpen(false);
    }

    const handleOnChange = (evt) => {
        setStudent({
          ...student,
          [evt.target.name]: evt.target.value
        })
    
        setValErr({
          email: '',
          result: '',
        })
    }

    const handleSubmit = async(evt) => {
        evt.preventDefault()

        if(!student.email){
            setValErr({
                email: 'Please enter student email?'
            })
        }else if(!student.result){
            setValErr({
                result: 'Please enter student result?'
            })
        }else{
            return await axios.post(`${url}/interview/enrolledInterview/${companyId}`, student).then((response) => {
            // return await axios.post(`http://localhost:4000/interview/enrolledInterview/${companyId}`, student).then((response) => {
                
                    setSuccess(response.data.msg)
                    setCustomVariant('success')
                    setAlertOpen(true)
                    setStudent({
                        email: '',
                        result: ''
                    })
                    if(refresh){
                        setRefresh(false)
                    }else{
                        setRefresh(true)
                    }
                // console.log("response: ", response);
            }).catch((err) => {
                console.log("error on enrolling student to interview: " , err);
                /* if(err.response.data.success){
                    setError(response.data.msg)
                    setCustomVariant('error')
                    setAlertOpen(true)
                }else{ */
                    setError(err.response.data.msg)
                    setCustomVariant('error')
                    setAlertOpen(true)

                // }
                // console.log("response: ", err.response.data.success);
            })
        }
    }
    // console.log("company.students: ", company.students);

    const deallocateInterview = async(id) => {
        
        await axios.post(`${url}/interview/deallocateInterview/${id}/${companyId}`).then((response) => {
            setSuccess(response.data.msg)
            setCustomVariant('success')
            setAlertOpen(true)
            if(refresh){
                setRefresh(false)
            }else{
                setRefresh(true)
            }
        }).catch((err) => {
            setError(err.response.data.msg)
            setCustomVariant('error')
            setAlertOpen(true)
        })
    }

    // deleting company
    const deleteCompany = async(id) => {
        
        await axios.delete(`${url}/interview/deleteCompany/${id}`).then((response) => {
            setSuccess(response.data.msg)
            setCustomVariant('success')
            setAlertOpen(true)
            if(refresh){
                setRefresh(false)
            }else{
                setRefresh(true)
            }
        }).catch((err) => {
            setError(err.response.data.msg)
            setCustomVariant('error')
            setAlertOpen(true)
        })
    }

    return (
        <Fragment >
            <Snackbar open={alertOpen} autoHideDuration={6000} onClose={handleClose}>
              <Alert onClose={handleClose} severity={customVariant} sx={{ width: '100%' }}>
                  {success ? success : error}
              </Alert>
            </Snackbar>
            <TableRow sx={{ '& > *': { borderBottom: 'unset' }, border: '1px solide red', width: '100%', }} >
                <TableCell>
                    <IconButton aria-label='expand row' size='small' onClick={() => setOpen(!open)}>
                        { open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                    </IconButton>
                </TableCell>
                
                <TableCell  style={{ width: '100%',}} colSpan={3} component={'th'} scope="row" align='center' >{company.companyName}</TableCell> 
                
            </TableRow>
            <TableRow style={{ width: '100%',}}>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box sx={{ margin: 1 }}>
                            <Table size="small" aria-label="purchases">
                                <TableBody>
                                    <TableRow key={companyId}>
                                        <TableCell align='left'>Name </TableCell>
                                        <TableCell align='left'>{company.companyName}</TableCell>                                        
                                    </TableRow>
                                    <TableRow>
                                        <TableCell align='left'>Date </TableCell>
                                        <TableCell align='left'>{company.date}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell align='left'>Start Time </TableCell>
                                        <TableCell align='left'>{company.time}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell colSpan={2} align='center'><IconButton color='error' onClick={()=> deleteCompany(companyId)} > <DeleteForeverIcon /> </IconButton> </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </Box>
                        <Divider sx={{width: '100%', mt: 1, mb: 2}} />

                        <Box sx={{ width: '100%', mb: 3}}>

                            <center><Typography component={'h2'} variant="h5" >Enrolled Students</Typography></center>

                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Name</TableCell>
                                        <TableCell>Date</TableCell>
                                        <TableCell>Result</TableCell>
                                        <TableCell>Delete</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {company.students.length > 0 ? company.students.map((item, ind) => {
                                        return (
                                                <TableRow key={ind}>
                                                    <TableCell>{item.student.name}</TableCell>
                                                    <TableCell>{moment(item.date).format("DD/MM/YYYY")}</TableCell>
                                                    <TableCell>{item.result}</TableCell>
                                                    <TableCell> <IconButton color='error' onClick={() => deallocateInterview(item.student._id)}> <DeleteForeverIcon /> </IconButton> </TableCell>
                                                </TableRow>
                                        )
                                    }) : ''}
                                </TableBody>
                            </Table>

                            {/* form part */}
                            <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3, p: 2, backgroundColor: "lightgray", borderRadius: '10px'}}>
                                <center>
                                    <Typography component="h1" variant="h5"> Add Student </Typography>
                                </center>
                                <Grid container spacing={2} sx={{mt: 1}} >
                                    <Grid item  xs={12} md={12} lg={12}>
                                        <TextField style={{ backgroundColor: 'white', borderRadius: '5px'}} error={valErr.email ? true : false} autoComplete="given-email" name="email" value={student.email} onChange={handleOnChange} required fullWidth id="name" label="Email" autoFocus />
                                        <Typography variant='body1' color={'error'} component="p" >{valErr.email ? valErr.email : ''}</Typography>
                                    </Grid>

                                    <Grid item xs={12}  md={12} lg={12}>
                                        <FormControl style={{ width: '100%'}}>
                                            <InputLabel id="demo-simple-select-label"> Placement Status </InputLabel>
                                            <Select error={valErr.result ? true : false} labelId="demo-simple-select-label" value={student.placementStatus} style={{ width: '100%' , backgroundColor: 'white', borderRadius: '5px' }}
                                                onChange={(e) => {setStudent({...student, result: e.target.value}); setValErr({...setValErr, result: ''})}} >
                                                <MenuItem value={"Pass"}>Pass</MenuItem>
                                                <MenuItem value={"Failed"}>Failed</MenuItem>
                                                <MenuItem value={"On Hold"}>On Hold</MenuItem>
                                                <MenuItem value={"Didn't Attempt"}>Didn't Attempt</MenuItem>
                                            </Select>
                                            <Typography variant='body1' color={'error'} component="p" >{valErr.result ? valErr.result : ''}</Typography>
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={12}  md={12} lg={12}>
                                        <Button variant='contained' color='success' fullWidth type='submit' >addt</Button>
                                    </Grid>
                                </Grid>
                            </Box>
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
        </Fragment>
    )
}

export default InterviewRow