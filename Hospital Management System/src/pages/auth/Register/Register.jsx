import React, { useState } from 'react';
import './Register.css';
import '../../auth/App.css';
import { Link } from 'react-router-dom';
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

    const createUser = () => {
        Axios.post('http://localhost:3002/register', {
            email,
            username: userName, // Aligning with backend
            password
        }).then((response) => {
            if (response.data.message || email === '' || userName === '' || password === '') {
                setErrorMessage('Invalid registration details');
            } else {
                // Redirect logic can be handled elsewhere if needed
                console.log('User has been registered successfully.');
            }
        }).catch((error) => {
            console.error('Error registering user:', error);
            setErrorMessage('An error occurred while registering. Please try again later.');
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
                        <span className='forgotPassword'>
                            Forgot your password? <a href="">Click here</a>
                        </span>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Register;
