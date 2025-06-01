import React from 'react';
import "../styles/login.css";
import RegisterCard from '../components/Register/RegisterCard';

export default function Register() {
    return (
        <div className='login-container'>
            <RegisterCard></RegisterCard>
        </div>
    )
}