import React from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

class UserProfilePage extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			userId: '',
			userData: ''
		};
		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleInputChange = this.handleInputChange.bind(this);
	}

	async handleSubmit(event) {
		event.preventDefault();
		try {
			const res = await fetch(`/backend/api/user/${this.state.userId}`, {
				method: 'GET',
				headers: { 'Content-Type': 'application/json' },
				//body: JSON.stringify({ message: this.state.message })
			});
			const data = await res.json();
			this.setState({ userData: data.response });
			toast.success(`Congrats, you found ${data.response.username}`);
		} catch (error) {
			toast.error(error.message);
		}
	}

	handleInputChange(event) {
		this.setState({ userId: event.target.value });
	}

	render() {
		return (
			<>
				<h1>Search for Artist Profile</h1>
				<hr/>
				<form onSubmit={this.handleSubmit}>
					<input type="text" value={this.userId} onChange={this.handleInputChange}
							placeholder="Enter User ID"/>
					<button type="submit">Submit</button>
				</form>
				<ToastContainer/>
			</>
		);
	}
}

export default UserProfilePage;
