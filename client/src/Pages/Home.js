import React, { useEffect, useState } from 'react'
import { Button, Container, Grid, Paper, Skeleton, Table, TableHead, } from '@mui/material'
import axios from 'axios'
import Row from '../Components/Row'
import InterviewRow from '../Components/InterviewRow'
import { CSVLink } from 'react-csv'



  
export default function Home() {
    const url = "https://college-project.onrender.com"

    const [students, setStudents] = useState([])
    const [interviews, setInterviews] = useState([])
    const [refresh, setRefresh] = useState(false)
    const [comLoading, setComLoading] = useState(false)
    const [report, setReport] = useState()

    // console.log("result: ", csvResult);

    const getAllStudents = async() =>{
        return await axios.get(`${url}/student/getStudent`).then((response) => {
            setStudents(response.data.result)
            setComLoading(true)
        }).catch((err) => {
            console.log("error: on getAllStudents", err);
            console.log(true);
        })
    }

    const getAllCompanys = async() => {
        return await axios.get(`${url}/interview/getAllInterviews`).then((response) => {
            setInterviews(response.data.result)
            setComLoading(true)
        }).catch((err) => {
            console.log("error on getAllCompanys: ", err);
            setComLoading(true)
        })
    }

    useEffect(() => {
        getAllStudents()
        getAllCompanys()
    }, [refresh])
    
    return (
        <Container>
            <Grid container spacing={2}>
                
                <Grid item xs={12} sm={12} md={6} lg={6} >
                    {comLoading ? (
                        <Table component={Paper} sx={{ mt: 2, width: '100%', padding: '10px'}}>
                            <TableHead >
                                {students.map((item, ind) => {
                                    return <Row key={ind} student={item} studentId={item._id} refresh={refresh} setRefresh={setRefresh} />
                                })}
                            </TableHead>
                        </Table>
                    ) : <>
                        <Skeleton width={"100%"} height={"90px"} animation="wave" />
                    </>}
                </Grid>
                <Grid item xs={12} sm={12} md={6} lg={6} >
                    {comLoading ? (
                        <Table component={Paper} sx={{ mt: 2, width: '100%', padding: '10px'}}>
                            <TableHead >
                                {interviews.map((item, ind) => {
                                    return <InterviewRow key={ind} company={item} companyId={item._id} refresh={refresh} setRefresh={setRefresh} />
                                })}
                            </TableHead>
                        </Table>
                    ) : <>
                        <Skeleton width={"100%"} height={"90px"} animation="wave" />
                    </>}
                </Grid>
            </Grid>
            {/* <CSVLink data={csvResult} headers={headers} filename={`Student Report ${Date()}`}>Download Me</CSVLink> */}
            
        </Container>
    )
}