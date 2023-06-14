import React, { useEffect, useState } from 'react'
import { Container, Grid, Paper, Skeleton, Table, TableHead, } from '@mui/material'
import axios from 'axios'
import Row from '../Components/Row'
import InterviewRow from '../Components/InterviewRow'



  
export default function Home() {
    const url = "https://team-career-camp.onrender.com"

    // states
    const [students, setStudents] = useState([])
    const [interviews, setInterviews] = useState([])
    const [refresh, setRefresh] = useState(false)
    const [comLoading, setComLoading] = useState(false)
    
    // getting all the students
    const getAllStudents = async() =>{
        return await axios.get(`${url}/student/getStudent`).then((response) => {
            setStudents(response.data.result)
            setComLoading(true)
        }).catch((err) => {
            console.log("error: on getAllStudents", err);
            console.log(true);
        })
    }

    // getting all the company
    const getAllCompanys = async() => {
        return await axios.get(`${url}/interview/getAllInterviews`).then((response) => {
            setInterviews(response.data.result)
            setComLoading(true)
        }).catch((err) => {
            console.log("error on getAllCompanys: ", err);
            setComLoading(true)
        })
    }

    // useEffect to redern on every reloading of page or refresh trigered
    useEffect(() => {
        getAllStudents()
        getAllCompanys()
    }, [refresh])
    
    return (
        <Container>
            <Grid container spacing={2}>
                
                {/* rendering all the student details */}
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

                {/* rednering all the details of company */}
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
        </Container>
    )
}