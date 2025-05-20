import React from 'react';

class TestApi extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			message: '',
			response: ''
		};
		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleInputChange = this.handleInputChange.bind(this);
	}

	async handleSubmit(event) {
		event.preventDefault();
		try {
			const res = await fetch('/backend/api/message', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ message: this.state.message })
			});
			const data = await res.json();
			this.setState({ response: data.response, message: '' });
		} catch (error) {
			this.setState({ response: 'Error: ' + error.message });
		}
	}

	handleInputChange(event) {
		this.setState({ message: event.target.value });
	}

	render() {
		return (
			<div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
				<h1 className="text-2xl font-bold mb-4 text-center">React Class + Servlet</h1>
				<form onSubmit={this.handleSubmit} className="space-y-4">
					<div>
						<input
							type="text"
							value={this.state.message}
							onChange={this.handleInputChange}
							placeholder="Enter your message"
							className="w-full p-2 border rounded"
						/>
					</div>
					<button
						type="submit"
						className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
					>
						Send
					</button>
				</form>
				{this.state.response && (
					<p className="mt-4 text-center text-green-600">{this.state.response}</p>
				)}
			</div>
		);
	}
}

export default TestApi;
