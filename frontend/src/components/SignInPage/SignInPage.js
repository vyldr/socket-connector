import React from 'react';
import './SignInPage.css';

function SignInPage() {
    return (
        <div className='SignInPage'>
            <div className='SignInForm'>
                <div className='formTitle'>
                    <code>Sign In</code>
                </div>
                <input placeholder='Username'></input><br />
                <input placeholder='Password' type='password'></input><br />
                <button className='SignInButton'>Sign in</button>
            </div>
        </div>
    );
}

export default SignInPage;