import React, { useState, useEffect } from 'react';
import '../../auth/App.css';
import { Link, useNavigate } from 'react-router-dom';
import Axios from 'axios';
import video from '../../auth/LoginAssets/video.mp4';
import logo from '../../auth/LoginAssets/llogo.png';
import { FaUserShield } from "react-icons/fa";
import { BsFillShieldLockFill } from "react-icons/bs";
import { AiOutlineSwapRight } from "react-icons/ai";
import { jwtDecode } from 'jwt-decode';


const Login = () => {
    const [loginUserName, setLoginUserName] = useState('');
    const [loginPassword, setLoginPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [token, setToken] = useState('');
    const [refreshToken, setRefreshToken] = useState('');
    const navigateTo = useNavigate();

    useEffect(() => {
        setToken(sessionStorage.getItem('token'));
    }, [navigateTo]);

    const loginUser = async (e) => {
        e.preventDefault();
    
        if (!loginUserName || !loginPassword) {
            setErrorMessage('All fields are required!');
            return;
        }
    
        try {
            const response = await Axios.post('http://localhost:9004/api/login', {
                username: loginUserName,
                password: loginPassword
            });

            
    
            const { data } = response;
            if (data.token) {
                setToken(data.token);
                sessionStorage.setItem('token', data.token);
                sessionStorage.setItem('refreshToken', data.refreshToken);
                sessionStorage.setItem('username', data.username);
                sessionStorage.setItem('email', data.email);
                const user = jwtDecode(data.token);
                sessionStorage.setItem('role', user.role);
                navigateTo('/dashboard/home');
            } else {
                setErrorMessage('An error occurred while logging in. Please try again later.');
            }
            
        } catch (error) {
            if (error.response) {
                const { data } = error.response;
                if (data.message === 'User does not exist') {
                    setErrorMessage('Username does not exist!');
                } else if (data.message === 'Incorrect password') {
                    setErrorMessage('Password incorrect!');
                } else {
                    setErrorMessage('An error occurred while logging in. Please try again later.');
                }
            } else {
                setErrorMessage('An error occurred while logging in. Please try again later.');
                console.error('Error logging in:', error);
            }
        }
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
                                    onChange={(event) => setLoginUserName(event.target.value)} />
                            </div>
                        </div>
                        <div className="inputDiv">
                            <label htmlFor="password">Password</label>
                            <div className="input flex">
                                <BsFillShieldLockFill className='icon'/>
                                <input type="password" name="" id="password" placeholder='Enter password' 
                                    value={loginPassword}
                                    onChange={(event) => setLoginPassword(event.target.value)} />
                            </div>
                        </div>
                        <button type='submit' className='btn flex'>
                            <span>Login</span>
                            <AiOutlineSwapRight className='icon'/>
                        </button>
                        <span className='forgotPassword'>
                            Forgot your password? <a href="/register">Click here</a>
                        </span>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;
