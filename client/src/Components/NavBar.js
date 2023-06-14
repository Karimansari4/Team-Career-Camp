import React, { useEffect } from 'react'
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import Diversity3Icon from '@mui/icons-material/Diversity3';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { CSVLink } from 'react-csv';

function NavBar({emp}) {
    const url = "https://team-career-camp.onrender.com"

    const [students, setStudents] = React.useState([])
    
    const [anchorElNav, setAnchorElNav] = React.useState(null);
    const [anchorElUser, setAnchorElUser] = React.useState(null);
    const navigate = useNavigate()

    const handleOpenNavMenu = (event) => {
        setAnchorElNav(event.currentTarget);
    };
    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    // logout function
    const logout = () => {
        localStorage.removeItem('token')
        navigate('/signin')
        console.log("logout");
    }

    // get all data to csv file
    const getAllStudents = async() =>{
        return await axios.get(`${url}/student/getStudent`).then((response) => {
            setStudents(response.data.result)
            // setComLoading(true)
        }).catch((err) => {
            console.log("error: on getAllStudents", err);
            console.log(true);
        })
    }

    // data grid for downloading CSV file

    const headers = [
        { label: 'student Id', key: '_id' },
        { label: 'Student name', key: 'name',},
        { label: 'Student email', key: 'email',},
        { label: 'Student College', key: 'college',  },
        { label: 'Student Status', key: 'status',  },
        { label: 'DSA Final Score', key: 'dsaScore',  },
        { label: 'Web Develeopemnt Final Score', key: 'webDScore',  },
        { label: 'React Final Score', key: 'reactScore',  },
        { label: 'Interview company', key: 'company',  },
        { label: 'Interview date', key: 'date',  },
        { label: 'Interview result', key: 'result',},
    ]

    let csvResult = []
    students.forEach(item => {
        csvResult.push({
            _id: item._id,
            name: item.name,
            email: item.email,
            college: item.college,
            status: item.status,
            dsaScore: item.dsaScore,
            webDScore: item.webDScore,
            reactScore: item.reactScore,
            company: item?.interviews[0]?.company,
            date: item?.interviews[0]?.company,
            result: item?.interviews[0]?.result
        })

        for(let i = 1; i < item.interviews.length; i++){
            const comapnyName = item.interviews[i]
            csvResult.push({
                _id: item._id,
                name: item.name,
                email: item.email,
                college: item.college,
                status: item.status,
                dsaScore: item.dsaScore,
                webDScore: item.webDScore,
                reactScore: item.reactScore,
                company: comapnyName.company,
                date: comapnyName.date,
                result: comapnyName.result
            })
        }
    })

    useEffect(() => {
        getAllStudents()
    }, [])
    
    return (
        <AppBar position="static">
        <Container maxWidth="xl">
            <Toolbar disableGutters>
            <Diversity3Icon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
            <Typography variant="h6" noWrap component="a" href="/" sx={{ mr: 2, display: { xs: 'none', md: 'flex' }, fontFamily: 'monospace', fontWeight: 700, letterSpacing: '.3rem', color: 'inherit', textDecoration: 'none', }} >
                TCC
            </Typography>

            <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
                <IconButton size="large" aria-label="account of current user" aria-controls="menu-appbar" aria-haspopup="true" onClick={handleOpenNavMenu} color="inherit" >
                <MenuIcon />
                    </IconButton>
                <Menu id="menu-appbar" anchorEl={anchorElNav} anchorOrigin={{ vertical: 'bottom', horizontal: 'left', }} keepMounted
                    transformOrigin={{ vertical: 'top', horizontal: 'left', }}
                    open={Boolean(anchorElNav)} onClose={handleCloseNavMenu} sx={{ display: { xs: 'block', md: 'none' }, }} >
                
                    <MenuItem onClick={handleCloseNavMenu}>
                        <Typography textAlign="center"><Link to={'/'} style={{ textDecoration: 'none'}} >Home</Link></Typography>
                    </MenuItem>
                    <MenuItem onClick={handleCloseNavMenu}>
                        <Typography textAlign="center"><Link to={'/addStudent'} style={{ textDecoration: 'none'}} >Add Student</Link></Typography>
                    </MenuItem>
                    <MenuItem onClick={handleCloseNavMenu}>
                        <Typography textAlign="center"><Link to={'/addInterview'} style={{ textDecoration: 'none'}} >Add Interview</Link></Typography>
                    </MenuItem>

                    <MenuItem onClick={handleCloseNavMenu}>
                        <Typography textAlign="center"><CSVLink style={{ textDecoration: 'none'}} data={csvResult} headers={headers} filename={`Student Report ${Date()}`} /* data={JSON.stringify(csvReport)}  */>Download Report</CSVLink></Typography>
                    </MenuItem>
                
                </Menu>
            </Box>
            <Diversity3Icon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} />
            <Typography variant="h5" noWrap component="a" href="/" sx={{ mr: 2, display: { xs: 'flex', md: 'none' }, flexGrow: 1, fontFamily: 'monospace', fontWeight: 700, letterSpacing: '.3rem', color: 'inherit', textDecoration: 'none', }} >
                Team Career Camp
            </Typography>
            <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                {/* <Button onClick={handleCloseNavMenu} sx={{ my: 2, color: 'white', display: 'block' }} > <Link to="/" style={{textDecoration: 'none'}}>  Home </LInk></Button> 
                <Button onClick={handleCloseNavMenu} sx={{ my: 2, color: 'white', display: 'block' }} > <Link to="/addStudent" style={{textDecoration: 'none'}}> Add Student </LInk></Button>  */}
                <Button onClick={handleCloseNavMenu} sx={{ my: 2, color: 'white', display: 'block' }} > <Link to="/" style={{textDecoration: 'none', color: 'white'}}>  Home </Link></Button> 
                <Button onClick={handleCloseNavMenu} sx={{ my: 2, color: 'white', display: 'block' }} > <Link to="/addStudent" style={{textDecoration: 'none', color: 'white'}}> Add Student </Link></Button> 
                <Button onClick={handleCloseNavMenu} sx={{ my: 2, color: 'white', display: 'block' }} > <Link to="/addInterview" style={{textDecoration: 'none', color: 'white'}}> Add Interview </Link></Button> 
                <Button onClick={handleCloseNavMenu} sx={{ my: 2, color: 'white', display: 'block' }} > <CSVLink style={{ textDecoration: 'none'}} data={csvResult} headers={headers} filename={`Student Report ${Date()}`}> <Typography sx={{ color: 'white'}} >Download Report</Typography> </CSVLink></Button> 
            </Box>

            <Box sx={{ flexGrow: 0 }}>
                <Tooltip title="Profile">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                    <Avatar alt={emp?.name} src="/static/images/avatar/2.jpg" />
                </IconButton>
                </Tooltip>
                <Menu sx={{ mt: '45px' }} id="menu-appbar" anchorEl={anchorElUser} anchorOrigin={{ vertical: 'top', horizontal: 'right', }}
                    keepMounted transformOrigin={{ vertical: 'top', horizontal: 'right', }} open={Boolean(anchorElUser)} onClose={handleCloseUserMenu} >
                
                    <MenuItem onClick={handleCloseUserMenu}>
                        <Typography textAlign="center">Name: {emp?.name}</Typography>
                    </MenuItem>
                    <MenuItem onClick={handleCloseUserMenu}>
                        <Typography textAlign="center">Name: {emp?.email}</Typography>
                    </MenuItem>
                    <MenuItem onClick={handleCloseUserMenu}>
                        <Button onClick={logout} >Logout</Button>
                    </MenuItem>
                
                </Menu>
            </Box>
            </Toolbar>
        </Container>
    </AppBar>
    )
}

export default NavBar