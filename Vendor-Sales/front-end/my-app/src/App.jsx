import React, { useState, useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import Login from './Log&Reg/Login';
import Register from './Log&Reg/Register';
import Home from './Home';
import Layout from './Layout';
import Profile from './Profile';
import Customers from './Customers.jsx';
import Sales from './Sales.jsx';
import { UserDataContext } from './UserDataContext.jsx';
import axios from 'axios';

function App() {
    const [data, setData] = useState();

    useEffect(() => {
      const handleGetData = async () => {
        try {
          const response = await axios.get("http://localhost:3000/get-user-data", {
            headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            }
          })
          setData(response.data.userData);
        } catch (error) {
          console.log("Error getting user data:", error); 
        }
      }
      handleGetData();
      }, []);

      //console.log(data);
      
    
  return (
    <>
        <UserDataContext.Provider value={{data}}>
    <Routes>
      <Route path='/login' element={<Login/>} />
      <Route path='/register' element={<Register/>} />
              <Route path='/' element={<Layout/>}>
            <Route path='/home' element={<Home/>}/>
            <Route path='/profile' element={<Profile/>}/>
            <Route path='/profile/:section' element={<Profile/>}/>
            <Route path='/customers' element={<Customers/>}/>
            <Route path='/sales' element={<Sales/>}/>
        </Route>  
    </Routes>
        </UserDataContext.Provider>

    </>
  )
}

export default App
