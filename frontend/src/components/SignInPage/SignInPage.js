import React from 'react';
import '../../style.css';
// import './SignInPage.css';

function SignInPage() {
	return (
		<div className='page'>
			<div className='centerForm'>
				<div className='formTitle signInTitle'>
					<code>Sign In</code>
				</div>
				<input placeholder='Username'></input><br />
				<input placeholder='Password' type='password'></input><br />
				<button className='formButton'>Sign in</button>
			</div>
		</div>
	);
}

export default SignInPage;