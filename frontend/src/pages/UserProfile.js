import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ImageViewerModal from '../components/UserProfileView/ImageViewerModal';

const UserProfilePage = () => {
	const { userId } = useParams();
	const [userData, setUserData] = useState(null);
	const [portfolioData, setPortfolioData] = useState(null);
	const [socialLinks, setSocialLinks] = useState([]);
	const [loading, setLoading] = useState(true);
	const [currentImageIndex, setCurrentImageIndex] = useState(0);
	const [allImages, setAllImages] = useState([]);
	const [showModal, setShowModal] = useState(false);

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
					// Create unified list of images starting with cover
					const images = [
						{
							url: portfolioData.response.coverUrl,
							isCover: true,
							title: portfolioData.response.title,
							description: portfolioData.response.description
						},
						...(portfolioData.response.media || []).map(media => ({
							...media,
							isCover: false
						}))
					];
					setAllImages(images);
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

	const handleCloseViewer = () => {
		setShowModal(false);
	};

	const handleImageClick = () => {
		if (!allImages[currentImageIndex].isCover) {
			setShowModal(true);
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
				<div className="grid grid-cols-1 md:grid-cols-2 gap-8 h-[50vh]">
					{/* Left Column - User Info */}
					<div className="bg-white rounded-3xl shadow-lg p-8">
						<div className="flex items-start space-x-4">
							<div className="w-32 h-32 rounded-full border-4 border-white overflow-hidden bg-gray-100 shadow-lg">
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
							<div className="flex-1">
								<h1 className="text-3xl font-bold text-gray-900">
									{userData.displayName || userData.username}
								</h1>
								{userData.username && userData.displayName && (
									<p className="text-lg text-gray-500">@{userData.username}</p>
								)}
							</div>
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
										className="inline-flex items-center px-4 py-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
									>
										<span className="mr-2">{getSocialIcon(link.platform)}</span>
										<span className="text-sm text-gray-700">{link.platform}</span>
									</a>
								))}
							</div>
						)}

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
									{userData.createdAt ? new Date(userData.createdAt).toLocaleDateString() : 'Not available'}
								</p>
							</div>
						</div>
					</div>

					{/* Right Column - Portfolio Cover */}
					<div className="relative h-full">
						{portfolioData && (
							<div className="relative h-full rounded-3xl overflow-hidden shadow-xl">
								<img
									src={portfolioData.coverUrl}
									alt="Portfolio Cover"
									className="w-full h-full object-cover"
								/>
								<div className="absolute bottom-0 left-0 p-8 text-white bg-gradient-to-t from-black/70 to-transparent w-full">
									<h2 className="text-3xl font-bold mb-2">{portfolioData.title}</h2>
									<p className="text-lg">{portfolioData.description}</p>
								</div>
							</div>
						)}
					</div>
				</div>
			</div>
			<ToastContainer />

			{/* Image Viewer Modal */}
			{showModal && currentImage && !currentImage.isCover && (
				<ImageViewerModal
					imageUrl={currentImage.url}
					onClose={handleCloseViewer}
					onPrevious={currentImageIndex > 0 ? handlePreviousImage : undefined}
					onNext={currentImageIndex < allImages.length - 1 ? handleNextImage : undefined}
					hasPrevious={currentImageIndex > 0}
					hasNext={currentImageIndex < allImages.length - 1}
				/>
			)}
		</div>
	);
};

export default UserProfilePage;
