import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import UserInfo from '../components/UserProfile/UserInfo';
import EditPortfolio from '../components/UserProfile/EditPortfolio';
import PortfolioDisplay from '../components/UserProfile/PortfolioDisplay';
import Header from "../components/HomePage/Header";

const UserProfilePage = () => {
	const { id } = useParams();
	const [userData, setUserData] = useState(null);
	const [portfolioData, setPortfolioData] = useState(null);
	const [socialLinks, setSocialLinks] = useState([]);
	const [loading, setLoading] = useState(true);
	const [currentImageIndex, setCurrentImageIndex] = useState(0);
	const [allImages, setAllImages] = useState([]);
	const [followCounts, setFollowCounts] = useState({ followers: 0, following: 0 });
	const [currentUser, setCurrentUser] = useState(null);
	const [isFollowing, setIsFollowing] = useState(false);
	const [isEditingPortfolio, setIsEditingPortfolio] = useState(false);

	useEffect(() => {
		const fetchAllData = async () => {
			try {
				// Fetch current logged-in user first
				const currentUserRes = await fetch('http://localhost:9999/backend/api/current-user', {
					method: 'GET',
					credentials: 'include',
					headers: { 'Content-Type': 'application/json' },
				});

				let currentUserData = null;
				if (currentUserRes.ok) {
					try {
						currentUserData = await currentUserRes.json();
						if (!currentUserData.error) {
							setCurrentUser(currentUserData.response);
							
							// Check follow status only if we have a logged-in user
							if (currentUserData.response) {
								const followStatusRes = await fetch(`http://localhost:9999/backend/api/follow?type=status&userId=${id}`, {
									credentials: 'include',
									headers: { 'Content-Type': 'application/json' },
								});
								
								if (followStatusRes.ok) {
									const followStatusData = await followStatusRes.json();
									setIsFollowing(followStatusData.isFollowing);
								}
							}
						}
					} catch (e) {
						console.error('Error parsing current user response:', e);
					}
				}

				// Fetch user data
				const userRes = await fetch(`http://localhost:9999/backend/api/user/${id}`, {
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
					fetch(`http://localhost:9999/backend/api/portfolio/${id}`, {
						method: 'GET',
						credentials: 'include',
						headers: { 'Content-Type': 'application/json' },
					}),
					new Promise((_, reject) => 
						setTimeout(() => reject(new Error('Portfolio request timeout')), 5000)
					)
				]);

				if (!portfolioRes.ok && userData.response.role === "ARTIST") {
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
					setAllImagesFromPortfolioData(portfolioData.response);
				}

				// Fetch social links
				const linksRes = await fetch(`http://localhost:9999/backend/api/social-links/${id}`, {
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
				const followRes = await fetch(`http://localhost:9999/backend/api/follow-count/${id}`, {
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

		if (id) {
			fetchAllData();
		}
	}, [id]);

	useEffect(() => {
		if (portfolioData) {
			setAllImagesFromPortfolioData(portfolioData);
		}
	}, [portfolioData]); // This will run whenever portfolioData changes

	const setAllImagesFromPortfolioData = (portfolioData) => {
		// Safely create unified list of images
		try {
			const images = [];
			if (portfolioData.coverUrl) {
				images.push({
					url: portfolioData.coverUrl,
					isCover: true,
					title: portfolioData.title || '',
					description: portfolioData.description || ''
				});
			}
			
			if (Array.isArray(portfolioData.media)) {
				const mediaImages = portfolioData.media
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
		<div className="min-h-screen bg-gray-50">
			<div className="mb-14">
				<Header openCreatePopup={null} />
			</div>
			<div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
				<div className={`grid grid-cols-1 ${allImages.length > 0 ? 'md:grid-cols-2' : 'max-w-2xl mx-auto'} gap-8`}>
					{/* Left Column - User Info */}
					<div>
						{!isEditingPortfolio ? (
							<UserInfo
								userData={userData}
								currentUser={currentUser}
								followCounts={followCounts}
								isFollowing={isFollowing}
								setIsFollowing={setIsFollowing}
								socialLinks={socialLinks}
								portfolioData={portfolioData}
								setIsEditingPortfolio={setIsEditingPortfolio}
								isEditingPortfolio={isEditingPortfolio}
								userId={id}
							/>
						) : (
							<EditPortfolio
								portfolioData={portfolioData}
								setPortfolioData={setPortfolioData}
								setIsEditingPortfolio={setIsEditingPortfolio}
								userId={id}
							/>
						)}
					</div>

					{/* Right Column - Portfolio Display */}
					<PortfolioDisplay
						allImages={allImages}
						currentImageIndex={currentImageIndex}
						handlePreviousImage={handlePreviousImage}
						handleNextImage={handleNextImage}
						portfolioData={portfolioData}
					/>
				</div>
			</div>
			<ToastContainer />
		</div>
	);
};

export default UserProfilePage;
