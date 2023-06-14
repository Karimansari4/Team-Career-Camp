import React, { Fragment, useState } from 'react'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { Button, Collapse, Divider, Grid, IconButton, Snackbar, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material';
import { Box } from '@mui/system';
import moment from 'moment'
import MuiAlert from '@mui/material/Alert';
import axios from 'axios';
import { Link } from 'react-router-dom'

// Alert notification of MUI
const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });

function Row({student, studentId, refresh, setRefresh}) {
    const url = "https://team-career-camp.onrender.com"
    const localUrl = "http://localhost:4000"

    // states
    const [open, setOpen] = useState(false)
    const [alertOpen, setAlertOpen] = useState(false)
    const [customVariant, setCustomVariant] = React.useState('success')
    const [success, setSuccess] = React.useState('')
    const [error, setError] = React.useState('')

    // handle close of alert MUI
    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
        return;
        }
        setAlertOpen(false);
    }
    
    // deleting student
    const deleteStudent = async(id) => {
        
        if(student.interviews.length > 0){
            setError('Opps! Cannot delete because interview scheduled with companys')
            setCustomVariant('error')
            setAlertOpen(true)
            console.log("delete leng");
        }else{
            await axios.delete(`${localUrl}/student/deleteStudent/${id}`).then((response) => {
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
                
                <TableCell  style={{ width: '100%',}} colSpan={3} component={'th'} scope="row" align='center' >{student.name}</TableCell> 
                
            </TableRow>
            <TableRow style={{ width: '100%',}}>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box sx={{ margin: 1 }}>
                            <Table size="small" aria-label="purchases">
                                <TableBody>
                                    <TableRow key={studentId}>
                                        <TableCell align='left'>Name </TableCell>
                                        <TableCell align='left'>{student.name}</TableCell>                                        
                                    </TableRow>
                                    <TableRow>
                                        <TableCell align='left'>Email </TableCell>
                                        <TableCell align='left'>{student.email}</TableCell>
                                    </TableRow>

                                    <TableRow>
                                        <TableCell align='left'>College </TableCell>
                                        <TableCell align='left'>{student.college}</TableCell>
                                    </TableRow>

                                    <TableRow>
                                        <TableCell align='left'>Batch </TableCell>
                                        <TableCell align='left'>{student.batch}</TableCell>
                                    </TableRow>

                                    <TableRow>
                                        <TableCell align='left'>Status </TableCell>
                                        <TableCell align='left'>{student.status}</TableCell>
                                    </TableRow>

                                    <TableRow>
                                        <TableCell align='left'>DSA Score </TableCell>
                                        <TableCell align='left'>{student.dsaScore} %</TableCell>
                                    </TableRow>

                                    <TableRow>
                                        <TableCell align='left'>WebDev Score </TableCell>
                                        <TableCell align='left'>{student.webDScore} %</TableCell>
                                    </TableRow>

                                    <TableRow>
                                        <TableCell align='left'>React Score </TableCell>
                                        <TableCell align='left'>{student.reactScore} %</TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                            <Grid container spacing={2} sx={{ mt: 2, mb: 3}}>
                                <Grid item sm={12} md={6} lg={6} >
                                    <center> <Link style={{ textDecoration: 'none'}} to={`update/${student._id}`}><Button variant='contained' sx={{ width: '100%'}}>Edit </Button></Link></center>
                                </Grid>
                                <Grid item sm={12} md={6} lg={6}>
                                    <center><Button variant='contained' color="error" sx={{ width: '100%'}} onClick={() => deleteStudent(studentId)} >Delete</Button></center>
                                </Grid>
                            </Grid>
                        </Box>
                        <Divider sx={{width: '100%', mt: 1, mb: 2}} />
                        <Box sx={{ width: '100%', mb: 3}}>
                            <center><Typography component={'h2'} variant="h5" >Interview</Typography></center>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Company</TableCell>
                                        <TableCell>Date</TableCell>
                                        <TableCell>Start Time</TableCell>
                                        <TableCell>Result</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {student.interviews.length > 0 ? student.interviews.map((item, ind) => {
                                        return (
                                            <TableRow key={ind}>
                                                <TableCell>{item.company}</TableCell>
                                                <TableCell>{moment(item.date).format("DD/MM/YYYY")}</TableCell>
                                                <TableCell>{item.time}</TableCell>
                                                <TableCell>{item.result}</TableCell>
                                            </TableRow>
                                        )
                                    }) : ''}
                                </TableBody>
                            </Table>
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
        </Fragment>
    )
}

export default Row