import React, { useState } from 'react';
import './Register.css';
import '../../auth/App.css';
import { Link, useNavigate } from 'react-router-dom'; 
import Axios from 'axios';
import video from '../../auth/LoginAssets/video.mp4';
import logo from '../../auth/LoginAssets/llogo.png';
import { FaUserShield } from "react-icons/fa";
import { BsFillShieldLockFill } from "react-icons/bs";
import { AiOutlineSwapRight } from "react-icons/ai";
import { MdMarkEmailRead } from "react-icons/md";

const Register = () => {
    const [email, setEmail] = useState('');
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const createUser = () => {
        // Regular expressions for email, username, and password format validation
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z-]+\.[a-z]{3}$/;
        const usernameRegex = /^[a-zA-Z]{2,}$/;
        const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z!@#$%^&*()\-_=+`~{}\[\]|\\:;"'<>,.?\/]{6,}$/;
    
        // Check if any of the fields are empty
        if (!email || !userName || !password) {
            setErrorMessage('All fields are required');
            return; // Stop further execution
        }
    
        // Check if email format is valid
        if (!emailRegex.test(email)) {
            setErrorMessage('Invalid email format');
            return; // Stop further execution
        }
    
        // Check if username format is valid
        if (!usernameRegex.test(userName)) {
            setErrorMessage('Username must be at least 2 characters long and contain only letters');
            return; // Stop further execution
        }
    
        // Check if password format is valid
        if (!passwordRegex.test(password)) {
            setErrorMessage('Password must be at least 6 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character');
            return; // Stop further execution
        }
        
        Axios.post('http://localhost:9004/api/register', {
            email,
            username: userName,
            password
        })
        .then((response) => {
            if (response.data.token) {
                setErrorMessage('User has been registered successfully.');
                navigate('/login');
                // Redirect or any other logic upon successful registration
            } else {
                setErrorMessage('Invalid registration details');
            }
        })
        .catch((error) => {
            console.error('Error registering user:', error);
            if (error.response) {
                if (error.response.status === 400 && error.response.data.message === 'User with this email already exists') {
                    setErrorMessage('User with this email already exists');
                } else if (error.response.status === 400 && error.response.data.message === 'Username already exists') {
                    setErrorMessage('Username already exists');
                } else {
                    setErrorMessage('An error occurred while registering. Please try again later.');
                }
            } else {
                setErrorMessage('An error occurred while registering. Please try again later.');
            }
        });
    };
    
    return (
        <div className='registerPage flex'>
            <div className="container flex">
                <div className="videoDiv">
                    <video src={video} autoPlay muted loop></video>
                    <div className="textDiv">
                        <h2 className='title'>Welcome to LifeLine Hospital</h2>
                        <p>Feel free to contact us</p>
                    </div>
                    <div className="footerDiv flex">
                        <span className="text">Have an account?</span>
                        <Link to={'/'}>
                            <button className='btn'>Login</button>
                        </Link>
                    </div>
                </div> 
                <div className="formDiv flex">
                    <div className="headerDiv">
                        <img src={logo} alt="Logo Image" />
                    </div>
                    <form action="" className='form grid'>
                        <span className="errorMessage">{errorMessage}</span>
                        <div className="inputDiv">
                            <label htmlFor="email">Email</label>
                            <div className="input flex">
                                <MdMarkEmailRead className='icon'/>
                                <input type="email" name="" id="email" placeholder='Enter Email' 
                                value={email}
                                onChange={(event)=>{ setEmail(event.target.value) }}/>
                            </div>
                        </div>
                        <div className="inputDiv">
                            <label htmlFor="email">Username</label>
                            <div className="input flex">
                                <FaUserShield className='icon'/>
                                <input type="text" name="" id="username" placeholder='Enter Username' 
                                value={userName}
                                onChange={(event)=>{ setUserName(event.target.value) }}/>
                            </div>
                        </div>
                        <div className="inputDiv">
                            <label htmlFor="password">Password</label>
                            <div className="input flex">
                                <BsFillShieldLockFill  className='icon'/>
                                <input type="password" name="" id="password" placeholder='Enter password'
                                value={password}
                                onChange={(event)=>{ setPassword(event.target.value) }} />
                            </div>
                        </div>
                        <button type='button' className='btn flex' onClick={createUser}>
                            <span>Register</span>
                            <AiOutlineSwapRight className='icon'/>
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Register;
