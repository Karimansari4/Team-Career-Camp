import './App.css';
import { Fragment, useEffect, useState } from 'react';
import SignUp from './Pages/SignUp'
import SignIn from './Pages/SignIn'
import { Route, Routes, useNavigate } from 'react-router-dom';
import jwtDecoder from 'jwt-decode'
import Home from './Pages/Home';
import AddStudent from './Pages/AddStudent'
import NavBar from './Components/NavBar'
import AddInterview from './Pages/AddInterview';
import UpdateStudent from './Pages/UpdateStudent';

function App() {

  const navigate = useNavigate()
  const token = localStorage.getItem("token")
  const date = new Date()
  const [emp, setEmp] = useState('')

  useEffect(() => {
    
    if(token){
      const decodedToken = jwtDecoder(token)
      if(decodedToken.exp * 1000 < date.getTime()){
        localStorage.removeItem("token")        
        navigate('/signin')
      }else{
        setEmp(decodedToken)
        navigate('/')
        // console.log("token: ", token);
      }
      
    }else{
      navigate('/signin')
    }
  }, [token])


  return (
    <Fragment>
      {token ? <>
        <NavBar emp={emp.result} />
        <Routes>
          <Route path="/" element={<Home emp={emp.result} />} />
          <Route path="/addStudent" element={<AddStudent />} />
          <Route path='/addInterview' element={<AddInterview /> } />
          <Route path='/update/:id' element={<UpdateStudent /> } />
        </Routes>
      </> : <>
        <Routes>
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
        </Routes>
      </>}
    </Fragment>
  );
}

export default App;
