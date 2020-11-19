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
			message: '',
		};

		// Input handlers
		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	// Input fields
	handleChange(event) {
		this.setState({ [event.target.name]: event.target.value });
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
			.then(res => res.json().then(data => ({
				status: res.status,
				message: data,
			})))
			.then(obj => {

				// Redirect to the manage page
				if (obj.status === 200) {
					this.props.history.push('/manage');
				}

				// Highlight the password
				else {
					this.setState({ message: obj.message });

					// Highlight the password field
					document.getElementById('password').select();
				}
			});
	}

	render() {
		return (
			<div className='page'>
				<form className='centerForm' onSubmit={this.handleSubmit}>

					{/* Title */}
					<div className='formTitle'>
						<code>Sign In</code>
					</div>

					{/* Error message */}
					<div className={this.state.message === '' ? 'hidden' : 'errorMessage'}>
						{this.state.message}
					</div>

					{/* Username */}
					<input placeholder='Username'
						required
						autoComplete='username'
						name='username'
						value={this.state.username}
						onChange={this.handleChange}>
					</input>

					{/* Password */}
					<input placeholder='Password'
						required
						autoComplete='current-password'
						name='password'
						type='password'
						id='password'
						value={this.state.password}
						onChange={this.handleChange}>
					</input>

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