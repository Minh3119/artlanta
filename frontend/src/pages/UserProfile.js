import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AvatarImage from '../components/UserProfileView/AvatarImage';
import FollowerList from '../components/FollowControl/FollowerList';

const UserProfilePage = () => {
	const { userId } = useParams();
	const navigate = useNavigate();
	const [userData, setUserData] = useState(null);
	const [portfolioData, setPortfolioData] = useState(null);
	const [socialLinks, setSocialLinks] = useState([]);
	const [loading, setLoading] = useState(true);
	const [currentImageIndex, setCurrentImageIndex] = useState(0);
	const [allImages, setAllImages] = useState([]);
	const [followCounts, setFollowCounts] = useState({ followers: 0, following: 0 });
	const [currentUser, setCurrentUser] = useState(null);
	const [isFollowing, setIsFollowing] = useState(false);

	useEffect(() => {
		const fetchAllData = async () => {
			try {
				// Fetch current logged-in user first
				const currentUserRes = await fetch('http://localhost:9999/backend/api/current-user', {
					method: 'GET',
					credentials: 'include',
					headers: { 'Content-Type': 'application/json' },
				});

				console.log('Current user response status:', currentUserRes.status);

				if (!currentUserRes.ok) {
					console.error('Failed to fetch current user:', currentUserRes.statusText);
					// Don't throw error, just log it
				} else {
					try {
						const currentUserData = await currentUserRes.json();
						console.log('Current user data:', currentUserData);
						
						if (!currentUserData.error) {
							setCurrentUser(currentUserData.response);
						} else {
							console.error('Error in current user data:', currentUserData.error);
						}
					} catch (e) {
						console.error('Error parsing current user response:', e);
					}
				}

				// Fetch user data
				const userRes = await fetch(`http://localhost:9999/backend/api/user/${userId}`, {
					method: 'GET',
					credentials: 'include',
					headers: { 'Content-Type': 'application/json' },
				});

				if (!userRes.ok) {
					throw new Error(`Failed to fetch user data: ${userRes.statusText}`);
				}

				let userData;
				try {
					userData = await userRes.json();
				} catch (e) {
					throw new Error('Invalid response format for user data');
				}

				if (userData.error) {
					throw new Error(userData.error);
				}
				setUserData(userData.response);

				// Fetch portfolio data with timeout
				const portfolioRes = await Promise.race([
					fetch(`http://localhost:9999/backend/api/portfolio/${userId}`, {
						method: 'GET',
						credentials: 'include',
						headers: { 'Content-Type': 'application/json' },
					}),
					new Promise((_, reject) => 
						setTimeout(() => reject(new Error('Portfolio request timeout')), 5000)
					)
				]);

				if (!portfolioRes.ok) {
					throw new Error(`Failed to fetch portfolio: ${portfolioRes.statusText}`);
				}

				let portfolioData;
				try {
					portfolioData = await portfolioRes.json();
				} catch (e) {
					throw new Error('Invalid response format for portfolio data');
				}

				if (!portfolioData.error && portfolioData.response) {
					setPortfolioData(portfolioData.response);
					// Safely create unified list of images
					try {
						const images = [];
						if (portfolioData.response.coverUrl) {
							images.push({
								url: portfolioData.response.coverUrl,
								isCover: true,
								title: portfolioData.response.title || '',
								description: portfolioData.response.description || ''
							});
						}
						
						if (Array.isArray(portfolioData.response.media)) {
							const mediaImages = portfolioData.response.media
								.filter(media => media && typeof media === 'object')
								.map(media => ({
									...media,
									isCover: false,
									url: media.url || '',
									title: media.title || '',
									description: media.description || ''
								}));
							images.push(...mediaImages);
						}
						
						setAllImages(images);
					} catch (error) {
						console.error('Error processing portfolio images:', error);
						setAllImages([]);
					}
				}

				// Fetch social links
				const linksRes = await fetch(`http://localhost:9999/backend/api/social-links/${userId}`, {
					method: 'GET',
					credentials: 'include',
					headers: { 'Content-Type': 'application/json' },
				});

				if (!linksRes.ok) {
					throw new Error(`Failed to fetch social links: ${linksRes.statusText}`);
				}

				let linksData;
				try {
					linksData = await linksRes.json();
				} catch (e) {
					throw new Error('Invalid response format for social links');
				}

				if (!linksData.error) {
					setSocialLinks(linksData.response || []);
				}

				// Fetch follow counts
				const followRes = await fetch(`http://localhost:9999/backend/api/follow-count/${userId}`, {
					method: 'GET',
					credentials: 'include',
					headers: { 'Content-Type': 'application/json' },
				});

				if (!followRes.ok) {
					throw new Error(`Failed to fetch follow counts: ${followRes.statusText}`);
				}

				let followData;
				try {
					followData = await followRes.json();
				} catch (e) {
					throw new Error('Invalid response format for follow counts');
				}

				if (!followData.error) {
					setFollowCounts(followData.response || { followers: 0, following: 0 });
				}

				setLoading(false);
			} catch (error) {
				console.error('Error in fetchAllData:', error);
				toast.error(error.message || 'An unexpected error occurred');
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

	const handleNextImage = () => {
		if (currentImageIndex < allImages.length - 1) {
			setCurrentImageIndex(prev => prev + 1);
		}
	};

	const handlePreviousImage = () => {
		if (currentImageIndex > 0) {
			setCurrentImageIndex(prev => prev - 1);
		}
	};

	const handleFollow = async () => {
		try {
			if (!currentUser) {
				// Redirect to login if not logged in
				navigate('/login');
				return;
			}

			const response = await fetch(`http://localhost:9999/backend/api/follow/${userId}`, {
				method: isFollowing ? 'DELETE' : 'POST',
				credentials: 'include',
				headers: { 'Content-Type': 'application/json' },
			});

			const data = await response.json();
			if (data.error) {
				throw new Error(data.error);
			}

			// Toggle following state and update follow counts
			setIsFollowing(!isFollowing);
			setFollowCounts(prev => ({
				...prev,
				followers: isFollowing ? prev.followers - 1 : prev.followers + 1
			}));

			toast.success(isFollowing ? 'Unfollowed successfully' : 'Followed successfully');
		} catch (error) {
			toast.error(error.message);
		}
	};

	const formatDate = (dateString) => {
		if (!dateString) return 'Not available';
		try {
			const date = new Date(dateString);
			if (isNaN(date.getTime())) {
				return 'Invalid date';
			}
			return date.toLocaleDateString(undefined, {
				year: 'numeric',
				month: 'long',
				day: 'numeric'
			});
		} catch (error) {
			console.error('Error formatting date:', error);
			return 'Date format error';
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

	const currentImage = allImages[currentImageIndex];

	return (
		<div className="min-h-screen bg-gray-50">
			<div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
				{/* This checks if there's portfolio, if no, then center left column */}
				<div className={`grid grid-cols-1 ${allImages.length > 0 ? 'md:grid-cols-2' : 'max-w-2xl mx-auto'} gap-8 h-[50vh]`}>
					{/* Left Column - User Info */}
					<div className="bg-white rounded-3xl shadow-lg p-8">
						<div className="flex items-start space-x-4">
							<div className="w-32 h-32 rounded-full border-4 border-white overflow-hidden bg-gray-100 shadow-lg">
								{userData.avatarUrl ? (
									<AvatarImage 
										avatarUrl={userData.avatarUrl}
										displayName={userData.displayName || userData.username}
										size="md"
									/>
								) : (
									<AvatarImage 
										displayName={userData.displayName || userData.username}
										size="md"
									/>
								)}
							</div>
							<div className="flex-1">
								{/* User Name */}
								<h1 className="text-3xl font-bold text-gray-900">
									{userData.displayName || userData.username}
								</h1>
								{userData.username && userData.displayName && (
									<p className="text-lg text-gray-500">@{userData.username}</p>
								)}
								<div className="flex items-center space-x-4">
									<FollowerList 
										userId={userId} 
										count={followCounts.followers}
										isOwnProfile={currentUser?.id === parseInt(userId)}
									/>
									<div className="w-px h-6 bg-gray-200"></div>
									<div className="follower-list">
										<button className="flex flex-col items-center">
											<span className="font-semibold text-gray-900 text-base">{followCounts.following}</span>
											<span className="text-gray-500 text-xs">following</span>
										</button>
									</div>
								</div>
							</div>
						</div>

						{/* Follow/Edit Profile Button */}
						<div className="mt-4">
							{currentUser && Number.isInteger(currentUser.id) && Number.isInteger(parseInt(userId)) && currentUser.id !== parseInt(userId) ? (
								<button
									onClick={handleFollow}
									className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
										isFollowing
											? 'bg-gray-200 text-gray-800 hover:bg-gray-300'
											: 'bg-blue-600 text-white hover:bg-blue-700'
									}`}
								>
									{isFollowing ? 'Following' : 'Follow'}
								</button>
							) : currentUser && Number.isInteger(currentUser.id) && Number.isInteger(parseInt(userId)) && currentUser.id === parseInt(userId) ? (
								<button
									onClick={() => navigate('/settings/profile')}
									className="w-full py-2 px-4 rounded-lg font-medium bg-gray-200 text-gray-800 hover:bg-gray-300 transition-colors"
								>
									Edit Profile
								</button>
							) : null}
						</div>

						{userData.bio && (
							<p className="mt-6 text-gray-600 text-lg">{userData.bio}</p>
						)}

						{/* Social Links */}
						{socialLinks.length > 0 && (
							<div className="mt-6 flex flex-wrap gap-3">
								{socialLinks.map((link) => (
									<a
										key={link.id}
										href={link.url}
										target="_blank"
										rel="noopener noreferrer"
										className="group inline-flex items-center px-4 py-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors no-underline"
									>
										<span className="mr-2">{getSocialIcon(link.platform)}</span>
										<span className="text-sm text-gray-700 group-hover:underline">{link.platform}</span>
									</a>
								))}
							</div>
						)}

						{/* Additional info */}
						<div className="mt-8 grid grid-cols-2 gap-6">
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
									{formatDate(userData.createdAt)}
								</p>
							</div>
						</div>
						
						{/* Achievements Section */}
						{portfolioData?.achievements && (
							<div className="mt-8">
								<h3 className="text-lg font-semibold text-gray-900">🏆 Achievements </h3>
								<div className="bg-gray-50 rounded-lg p-4">
									<div className="flex items-start gap-3">
										<p className="text-gray-700 whitespace-pre-wrap">{portfolioData.achievements}</p>
									</div>
								</div>
							</div>
						)}
						
					</div>

					{/* Right Column - Portfolio Images */}
					<div className="relative h-[50vh]">
						{allImages.length > 0 && (
							<div className="relative h-full rounded-3xl overflow-hidden shadow-xl">
								<img
									className="w-full h-full object-cover"
									src={currentImage.url}
									alt={currentImage.title || "Portfolio Image"}
								/>

								{/* Overlay text */}
								<div className="absolute bottom-0 left-0 p-8 text-white bg-gradient-to-t from-black/70 to-transparent w-full">
									<h2 className="text-3xl font-bold mb-2">{currentImage.title || (currentImage.isCover ? portfolioData?.title : '')}</h2>
									<p className="text-lg">{currentImage.description || (currentImage.isCover ? portfolioData?.description : '')}</p>
								</div>
								
								{/* Navigation Controls */}
								<div className="absolute top-8 left-8 right-8 flex justify-between items-center">
									{/* Previous button */}
									<button
										onClick={handlePreviousImage}
										disabled={currentImageIndex === 0}
										className={`flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-50/90 text-gray-800 hover:bg-white transition-colors ${currentImageIndex === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105 transform transition-transform'}`}
									>
										<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
										</svg>
										Previous
									</button>
									{/* Image number */}
									<div className="bg-gray-100/90 text-gray-800 px-4 py-2 rounded-lg">
										{currentImageIndex + 1} / {allImages.length}
									</div>
									{/* Next button */}
									<button
										onClick={handleNextImage}
										disabled={currentImageIndex === allImages.length - 1}
										className={`flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-50/90 text-gray-800 hover:bg-white transition-colors ${currentImageIndex === allImages.length - 1 ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105 transform transition-transform'}`}
									>
										Next
										<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
										</svg>
									</button>
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
