import React, { useState, useEffect } from 'react';
import '../../auth/App.css'; // Adjust the import path to navigate to the auth directory
import { Link, useNavigate } from 'react-router-dom';
import Axios from 'axios';
import video from '../../auth/LoginAssets/video.mp4';
import logo from '../../auth/LoginAssets/llogo.png';
import { FaUserShield } from "react-icons/fa";
import { BsFillShieldLockFill } from "react-icons/bs";
import { AiOutlineSwapRight } from "react-icons/ai";

const Login = () => {
    const [loginUserName, setLoginUserName] = useState('');
    const [loginPassword, setLoginPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [token, setToken] = useState('');
    
    
    const navigateTo = useNavigate();

    useEffect(() => {
        // Check if the user is already logged in
        const storedToken = sessionStorage.getItem('token');
        if (storedToken) {
            navigateTo('/dashboard/home');
        }
    }, [navigateTo]);

    const loginUser = (e) => {
        e.preventDefault();
        Axios.post('http://localhost:9004/api/login', {
            username: loginUserName,
            password: loginPassword
        })
        .then((response) => {
            if (response.data.message || loginUserName === '' || loginPassword === '') {
                setErrorMessage('Credentials Don\'t Exist!');
            } else {
                setToken(response.data.token);
                sessionStorage.setItem('token', response.data.token);
                navigateTo('/dashboard/home');
            }
        })
        .catch((error) => {
            setErrorMessage('An error occurred while logging in. Please try again later.');
            console.error('Error logging in:', error);
        });
    };

    return (
        <div className='loginPage flex'>
            <div className="container flex">
                <div className="videoDiv">
                    <video src={video} autoPlay muted loop></video>
                    <div className="textDiv">
                        <h2 className='title'>Welcome to LifeLine Hospital</h2>
                        <p>Feel free to contact us</p>
                    </div>
                    <div className="footerDiv flex">
                        <span className="text">Don't have an account?</span>
                        <Link to={'/register'}>
                            <button className='btn'>Sign Up</button>
                        </Link>
                    </div>
                </div> 
                <div className="formDiv flex">
                    <div className="headerDiv">
                        <img src={logo} alt="Logo Image" />
                    </div>
                    <form action="" className='form grid' onSubmit={loginUser}>
                        <span className="errorMessage">{errorMessage}</span>
                        <div className="inputDiv">
                            <label htmlFor="username">Username</label>
                            <div className="input flex">
                                <FaUserShield className='icon'/>
                                <input type="text" name="" id="username" placeholder='Enter Username'
                                    value={loginUserName}
                                    onChange={(event)=>{ setLoginUserName(event.target.value) }} />
                            </div>
                        </div>
                        <div className="inputDiv">
                            <label htmlFor="password">Password</label>
                            <div className="input flex">
                                <BsFillShieldLockFill  className='icon'/>
                                <input type="password" name="" id="password" placeholder='Enter password' 
                                    value={loginPassword}
                                    onChange={(event)=>{ setLoginPassword(event.target.value) }} />
                            </div>
                        </div>
                        <button type='submit' className='btn flex'>
                            <span>Login</span>
                            <AiOutlineSwapRight className='icon'/>
                        </button>
                        <span className='forgotPassword'>
                            Forgot your password? <a href="">Click here</a>
                        </span>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;
