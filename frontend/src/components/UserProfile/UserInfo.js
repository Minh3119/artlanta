import React from 'react';
import { useNavigate } from 'react-router-dom';
import AvatarImage from '../UserProfileView/AvatarImage';
import FollowerList from '../FollowControl/FollowerList';
import FollowingList from '../FollowControl/FollowingList';
import { toast } from 'react-toastify';

const UserInfo = ({ 
    userData, 
    currentUser, 
    followCounts, 
    isFollowing, 
    setIsFollowing, 
    socialLinks,
    portfolioData,
    setIsEditingPortfolio,
    isEditingPortfolio,
    userId
}) => {
    const navigate = useNavigate();

    const getSocialIcon = (platform) => {
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

    const handleFollow = async () => {
        try {
            if (!currentUser) {
                navigate('/login');
                return;
            }

            const response = await fetch('http://localhost:9999/backend/api/follow', {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: `action=${isFollowing ? 'unfollow' : 'follow'}&targetId=${userId}`
            });

            const data = await response.json();
            if (data.error) {
                throw new Error(data.error);
            }

            setIsFollowing(!isFollowing);
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

    return (
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
                            isPrivate={userData.isPrivate}
                        />
                        <div className="w-px h-6 bg-gray-200"></div>
                        <FollowingList
                            userId={userId}
                            count={followCounts.following}
                            isOwnProfile={currentUser?.id === parseInt(userId)}
                            isPrivate={userData.isPrivate}
                        />
                    </div>
                </div>
            </div>

            <div className="mt-4">
                {currentUser ? (
                    currentUser.id !== parseInt(userId) ? (
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
                    ) : (
                        <div className="flex gap-4">
                            <button
                                onClick={() => navigate('/settings/profile')}
                                className="flex-1 py-2 px-4 rounded-lg font-medium bg-gray-200 text-gray-800 hover:bg-gray-300 transition-colors"
                            >
                                Edit Profile
                            </button>
                            <button
                                onClick={() => setIsEditingPortfolio(!isEditingPortfolio)}
                                className="flex-1 py-2 px-4 rounded-lg font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                            >
                                {isEditingPortfolio ? 'Cancel Edit' : 'Edit Portfolio'}
                            </button>
                        </div>
                    )
                ) : null}
            </div>

            {userData.bio && (
                <p className="mt-6 text-gray-600 text-lg">{userData.bio}</p>
            )}

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

            <div className="mt-8 grid grid-cols-2 gap-6">
                <div>
                    <h3 className="text-sm font-medium text-gray-500">Member since</h3>
                    <p className="mt-1 text-sm text-gray-900">{formatDate(userData.createdAt)}</p>
                </div>
            </div>
            
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
    );
};

export default UserInfo; 