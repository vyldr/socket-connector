import React from 'react';
import '../../style.css';
import { withRouter } from 'react-router-dom';

// import './SignInPage.css';

class SignInPage extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			username: '',
			password: '',
		};

		this.handleChangeUsername = this.handleChangeUsername.bind(this);
		this.handleChangePassword = this.handleChangePassword.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	// Username and password fields
	handleChangeUsername(event) {
		this.setState({ username: event.target.value });
	}
	handleChangePassword(event) {
		this.setState({ password: event.target.value });
	}

	// Submit the username and password to sign in
	handleSubmit(event) {

		// Prevent the standard form submit
		event.preventDefault();

		// Build the request
		const data = JSON.stringify({
			username: this.state.username,
			password: this.state.password,
		});
		fetch(document.location.origin + '/api/signin', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: data,
		})
			.then((res) => {

				// Redirect to the manage page
				if (res.status === 200) {
					this.props.history.push('/manage');
				}

				// Highlight the password
				else {
					this.thatsIncorrect();
				}
			});
	}

	thatsIncorrect() {
		// Highlight the password field
		document.getElementById('password').select();
	}

	render() {
		return (
			<div className='page'>
				<form className='centerForm' onSubmit={this.handleSubmit}>

					{/* Title */}
					<div className='formTitle'>
						<code>Sign In</code>
					</div>

					{/* Username */}
					<input placeholder='Username'
						name='username'
						value={this.state.username}
						onChange={this.handleChangeUsername}>
					</input><br />

					{/* Password */}
					<input placeholder='Password'
						name='password'
						type='password'
						id='password'
						value={this.state.password}
						onChange={this.handleChangePassword}>
					</input><br />

					{/* Submit button */}
					<button className='formButton'
						type='submit'>
						Sign in
					</button>

				</form>
			</div>
		);
	}
}

export default withRouter(SignInPage);