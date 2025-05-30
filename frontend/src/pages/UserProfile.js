import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const UserProfilePage = () => {
	const { userId } = useParams();
	const [userData, setUserData] = useState(null);
	const [portfolioData, setPortfolioData] = useState(null);
	const [socialLinks, setSocialLinks] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchAllData = async () => {
			try {
				// Fetch user data
				const userRes = await fetch(`http://localhost:9999/backend/api/user/${userId}`, {
					method: 'GET',
					credentials: 'include',
					headers: { 'Content-Type': 'application/json' },
				});
				const userData = await userRes.json();
				if (userData.error) {
					throw new Error(userData.error);
				}
				setUserData(userData.response);

				// Fetch portfolio data
				const portfolioRes = await fetch(`http://localhost:9999/backend/api/portfolio/${userId}`, {
					method: 'GET',
					credentials: 'include',
					headers: { 'Content-Type': 'application/json' },
				});
				const portfolioData = await portfolioRes.json();
				if (!portfolioData.error) {
					setPortfolioData(portfolioData.response);
				}

				// Fetch social links
				const linksRes = await fetch(`http://localhost:9999/backend/api/social-links/${userId}`, {
					method: 'GET',
					credentials: 'include',
					headers: { 'Content-Type': 'application/json' },
				});
				const linksData = await linksRes.json();
				if (!linksData.error) {
					setSocialLinks(linksData.response);
				}

				setLoading(false);
			} catch (error) {
				toast.error(error.message);
				setLoading(false);
			}
		};

		if (userId) {
			fetchAllData();
		}
	}, [userId]);

	const getSocialIcon = (platform) => {
		// You can replace these with actual icons from your preferred icon library
		switch (platform.toLowerCase()) {
			case 'instagram':
				return '📸';
			case 'twitter':
				return '🐦';
			case 'facebook':
				return '👤';
			case 'artstation':
				return '🎨';
			case 'deviantart':
				return '🖼️';
			default:
				return '🔗';
		}
	};

	if (loading) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
			</div>
		);
	}

	if (!userData) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="text-center">
					<h2 className="text-2xl font-bold mb-4">User not found</h2>
					<p className="text-gray-600">The requested user profile does not exist.</p>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-white">
			<div className="max-w-4xl mx-auto py-12 px-4">
				<div className="bg-white shadow-lg rounded-lg overflow-hidden">
					<div className="relative h-48 bg-gray-100">
						{portfolioData?.coverUrl ? (
							<img
								src={portfolioData.coverUrl}
								alt="Cover"
								className="w-full h-full object-cover"
							/>
						) : (
							<div className="w-full h-full bg-gray-200"></div>
						)}
					</div>
					
					<div className="relative px-6 pt-16 pb-8">
						<div className="absolute -top-16 left-6">
							<div className="w-32 h-32 rounded-full border-4 border-white overflow-hidden bg-gray-100">
								{userData.avatarUrl ? (
									<img
										src={userData.avatarUrl}
										alt={userData.displayName || userData.username}
										className="w-full h-full object-cover"
									/>
								) : (
									<div className="w-full h-full bg-gray-200 flex items-center justify-center">
										<span className="text-4xl text-gray-400">
											{(userData.displayName || userData.username)?.charAt(0).toUpperCase()}
										</span>
									</div>
								)}
							</div>
						</div>

						<div className="mt-2">
							<h1 className="text-3xl font-bold text-gray-900">
								{userData.displayName || userData.username}
								{userData.username && userData.displayName && (
									<span className="text-lg font-normal text-gray-500 ml-2">@{userData.username}</span>
								)}
							</h1>
							{userData.bio && (
								<p className="mt-4 text-gray-600">{userData.bio}</p>
							)}
						</div>

						{/* Social Links */}
						{socialLinks.length > 0 && (
							<div className="mt-4 flex flex-wrap gap-3">
								{socialLinks.map((link) => (
									<a
										key={link.id}
										href={link.url}
										target="_blank"
										rel="noopener noreferrer"
										className="inline-flex items-center px-3 py-1 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
									>
										<span className="mr-2">{getSocialIcon(link.platform)}</span>
										<span className="text-sm text-gray-700">{link.platform}</span>
									</a>
								))}
							</div>
						)}

						<div className="mt-6 grid grid-cols-2 md:grid-cols-3 gap-6 border-t border-gray-200 pt-6">
							{userData.location && (
								<div>
									<h3 className="text-sm font-medium text-gray-500">Location</h3>
									<p className="mt-1 text-sm text-gray-900">{userData.location}</p>
								</div>
							)}
							{userData.language && (
								<div>
									<h3 className="text-sm font-medium text-gray-500">Language</h3>
									<p className="mt-1 text-sm text-gray-900">{userData.language}</p>
								</div>
							)}
							<div>
								<h3 className="text-sm font-medium text-gray-500">Member since</h3>
								<p className="mt-1 text-sm text-gray-900">
									{userData.createdAt ? new Date(userData.createdAt).toLocaleDateString() : 'Not available'}
								</p>
							</div>
						</div>

						{/* Portfolio Section */}
						{portfolioData && (
							<div className="mt-8 border-t border-gray-200 pt-8">
								<h2 className="text-2xl font-bold text-gray-900 mb-4">Portfolio</h2>
								{portfolioData.title && (
									<h3 className="text-xl font-semibold text-gray-800 mb-2">{portfolioData.title}</h3>
								)}
								{portfolioData.description && (
									<p className="text-gray-600 mb-4">{portfolioData.description}</p>
								)}
								{portfolioData.achievements && (
									<div className="mt-4">
										<h4 className="text-lg font-semibold text-gray-800 mb-2">Achievements</h4>
										<p className="text-gray-600">{portfolioData.achievements}</p>
									</div>
								)}
							</div>
						)}

						{userData.artworks && (
							<div className="mt-8">
								<h2 className="text-xl font-bold text-gray-900 mb-4">Artworks</h2>
								<div className="grid grid-cols-3 gap-4">
									{userData.artworks.map((artwork, index) => (
										<div key={index} className="aspect-w-1 aspect-h-1 bg-gray-100 rounded-lg overflow-hidden">
											<img
												src={artwork.imageUrl}
												alt={artwork.title}
												className="w-full h-full object-cover"
											/>
										</div>
									))}
								</div>
							</div>
						)}
					</div>
				</div>
			</div>
			<ToastContainer />
		</div>
	);
};

export default UserProfilePage;
