import React from "react";
import styles from './Register.module.css'
import { useState,useEffect } from "react";
import {Link, useNavigate } from 'react-router-dom';
import axios from 'axios'

function Register() {
    const [user, setUser] = useState({
        username: "",
        email: "",
        password: "",
    });
    const navigate = useNavigate();

    const hanndleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:3000/register', {user})
            console.log(response.data);
            navigate("/login");
        } catch (error) {
            console.log("Error logging in:", error);
        }
    }

    console.log(user);
    
  return (
    <>
    <div className={styles.glass}>

    <div className={styles.regFormContainer}>
    <form onSubmit={hanndleSubmit} className={styles.regForm} action="">
        <h2>Sign up</h2>

        <div className={styles.regInputContainer}>
        <label htmlFor="">Username</label>
        <input className={styles.regInput} onChange={(e) => setUser((p) => ({...p, username: e.target.value}))} type="text" required />
        </div>

        <div className={styles.regInputContainer}>
        <label htmlFor="">Email</label>
        <input className={styles.regInput} onChange={(e) => setUser((p) => ({...p, email: e.target.value}))} type="email" required />
        </div>

        <div className={styles.regInputContainer}>
        <label htmlFor="">Password</label>
        <input className={styles.regInput} onChange={(e) => setUser((p) => ({...p, password: e.target.value}))} type="password" required />
        </div>

        <button className={styles.regSubmitBtn} onClick={() => hanndleSubmit}>Submit</button>
        <h5 ><Link to="/login">Already Have an Account?</Link></h5>
    </form>
    </div>
    </div>

    </>
  )
}

export default Register;
