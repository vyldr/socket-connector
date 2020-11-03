import React from 'react';
import '../../style.css';
import { withRouter } from 'react-router-dom';

// import './SignUpPage.css';

class SignUpPage extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			username: '',
			password: '',
			passwordAgain: '',
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

		// Check if the passwords match
		if (this.state.password !== this.state.passwordAgain) {
			this.setState({ message: 'Passwords do not match' });
			document.getElementById('confirm').select();
			return;
		}

		// Build the request
		const data = JSON.stringify({
			username: this.state.username,
			password: this.state.password,
		});
		fetch(document.location.origin + '/api/signup', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: data,
		})
			.then((res) => {

				// Redirect to the sign in page
				if (res.status === 201) {
					this.props.history.push('/signin');
				}

				// Error probably means username is unavailable
				else {
					this.setState({ message: 'Username unavailable' });
					document.getElementById('username').select();
				}

			});
	}

	render() {
		return (
			<div className='page'>
				<form className='centerForm' onSubmit={this.handleSubmit}>

					{/* Title */}
					<div className='formTitle'>
						<code>Create account</code>
					</div>

					{/* Error message */}
					<div className={this.state.message === '' ? 'hidden' : 'errorMessage'}>
						{this.state.message}
					</div>

					{/* Username */}
					<input placeholder='New username'
						required
						autoComplete='username'
						name='username'
						id='username'
						value={this.state.username}
						onChange={this.handleChange}>
					</input><br />

					{/* Password */}
					<input placeholder='New password'
						required
						autoComplete='new-password'
						name='password'
						type='password'
						id='password'
						value={this.state.password}
						onChange={this.handleChange}>
					</input><br />

					{/* Password again */}
					<input placeholder='New password again'
						required
						autoComplete='new-password'
						name='passwordAgain'
						type='password'
						id='confirm'
						value={this.state.passwordAgain}
						onChange={this.handleChange}>
					</input><br />

					{/* Submit button */}
					<button className='formButton'
						type='submit'>
						Create
					</button>

				</form>
			</div>
		);
	}
}

export default withRouter(SignUpPage);