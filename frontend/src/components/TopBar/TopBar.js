import React from 'react';
import {
	Link,
	withRouter
} from 'react-router-dom';
import { Route, Switch } from 'react-router-dom/cjs/react-router-dom.min';

import './TopBar.css';

class TopBar extends React.Component {
	constructor(props) {
		super(props);
		this.checkSignIn = this.checkSignIn.bind(this);
		this.signOut = this.signOut.bind(this);
	}

	// Check if the user is signed in
	checkSignIn() {
		// Check if we are signed in
		fetch(document.location.origin + '/api/signedin')
			.then((res) => {
				// Not signed in!
				if (res.status !== 200) {
					this.props.history.push('/signin');
				}

				// We are signed in
				else {
					this.props.history.push('/manage');
				}
			});
	}

	// Sign out of the website
	signOut() {
		fetch(document.location.origin + '/api/signout', {
			method: 'POST',
		})
			.then(() => {
				this.props.history.push('/');
			});
	}

	render() {
		return (
			<div className='TopBar'>

				{/* Padding */}
				<div className='space' />

				{/* Title */}
				<Link to='/'>
					<button className='title'>
						Socket Hub
				</button>
				</Link>

				{/* Buttons */}
				<div className='buttonContainer'>
					{/* Show different buttons depending on the current page */}
					<Switch>
						<Route path='/signin'>
							<button className='TopBarButton' onClick={this.checkSignIn}>Sign in</button>
							<Link to='/signup'>
								<button className='TopBarButton'>Sign up</button>
							</Link>
						</Route>
						<Route path='/signup'>
							<button className='TopBarButton' onClick={this.checkSignIn}>Sign in</button>
							<Link to='/signup'>
								<button className='TopBarButton'>Sign up</button>
							</Link>
						</Route>
						<Route path='/control'>
							<Link to='/manage'>
								<button className='TopBarButton'>Manage</button>
							</Link>
							<button className='TopBarButton' onClick={this.signOut}>Sign out</button>
						</Route>
						<Route path='/manage'>
							<button className='TopBarButton' onClick={this.signOut}>Sign out</button>
						</Route>
						<Route path='/'>
							<button className='TopBarButton' onClick={this.checkSignIn}>Sign in</button>
							<Link to='/signup'>
								<button className='TopBarButton'>Sign up</button>
							</Link>
						</Route>
					</Switch>
					{/* <Link to='/control'> */}
					{/* <button className='TopBarButton'>Control</button> */}
					{/* </Link> */}
					{/* <Link to='/signin'> */}
					{/* <button className='TopBarButton' onClick={this.checkSignIn}>Sign In</button> */}
					{/* </Link> */}
				</div>
			</div>
		);
	}
}

export default withRouter(TopBar);