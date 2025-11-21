import { Route, Routes } from 'react-router-dom';
import Login from './Log&Reg/Login';
import Register from './Log&Reg/Register';
import Home from './Home';
import Layout from './Layout';

function App() {

  return (
    <>
    <Routes>
      <Route path='/login' element={<Login/>} />
      <Route path='/register' element={<Register/>} />
              <Route path='/' element={<Layout/>}>
            <Route path='/home' element={<Home/>}/>
        </Route>  
    </Routes>
    </>
  )
}

export default App
