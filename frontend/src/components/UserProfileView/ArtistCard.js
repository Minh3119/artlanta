import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const ArtistCard = ({ artist, portfolio }) => {
    const [coverImageError, setCoverImageError] = useState(false);
    const [avatarError, setAvatarError] = useState(false);
    const [mediaErrors, setMediaErrors] = useState({});

    const handleMediaError = (index) => {
        setMediaErrors(prev => ({
            ...prev,
            [index]: true
        }));
    };

    const CoverPlaceholder = () => (
        <div className="w-full h-48 bg-gray-200 flex flex-col items-center justify-center">
            <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="mt-2 text-sm text-gray-500">No Cover Image</p>
        </div>
    );

    const AvatarPlaceholder = () => (
        <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center border-4 border-white">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
        </div>
    );

    const MediaPlaceholder = () => (
        <div className="w-full h-20 bg-gray-200 rounded flex flex-col items-center justify-center">
            <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="text-xs text-gray-400 mt-1">No image</span>
        </div>
    );

    return (
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="relative">
                {/* Cover Image */}
                {coverImageError || !portfolio?.coverUrl ? (
                    <CoverPlaceholder />
                ) : (
                    <img
                        src={portfolio.coverUrl}
                        alt={`${artist.displayName}'s cover`}
                        className="w-full h-48 object-cover"
                        onError={() => setCoverImageError(true)}
                    />
                )}
                
                {/* Artist Avatar */}
                <div className="absolute -bottom-6 left-4">
                    {avatarError || !artist.avatarUrl ? (
                        <AvatarPlaceholder />
                    ) : (
                        <img
                            src={artist.avatarUrl}
                            alt={artist.displayName}
                            className="w-16 h-16 rounded-full border-4 border-white object-cover bg-gray-100"
                            onError={() => setAvatarError(true)}
                        />
                    )}
                </div>
            </div>

            <div className="p-4 pt-8">
                <h3 className="text-xl font-semibold text-gray-900">
                    {artist.displayName || 'Unnamed Artist'}
                </h3>
                <p className="text-gray-600 mt-1">
                    {portfolio?.title || 'No portfolio title'}
                </p>
                <p className="text-sm text-gray-500 mt-2 line-clamp-2">
                    {portfolio?.description || 'No portfolio description'}
                </p>

                {/* Portfolio Media Gallery */}
                <div className="mt-4 grid grid-cols-3 gap-2">
                    {portfolio?.mediaUrls && portfolio.mediaUrls.length > 0 ? (
                        portfolio.mediaUrls.slice(0, 3).map((url, index) => (
                            <div key={index} className="aspect-w-1 aspect-h-1 bg-gray-100 rounded overflow-hidden">
                                {mediaErrors[index] ? (
                                    <MediaPlaceholder />
                                ) : (
                                    <img
                                        src={url}
                                        alt={`Portfolio work ${index + 1}`}
                                        className="w-full h-20 object-cover"
                                        onError={() => handleMediaError(index)}
                                    />
                                )}
                            </div>
                        ))
                    ) : (
                        // Placeholder boxes when no media is available
                        Array(3).fill(0).map((_, index) => (
                            <MediaPlaceholder key={index} />
                        ))
                    )}
                </div>

                <div className="mt-4 flex justify-between items-center">
                    <Link
                        to={`/artist/${artist.id}`}
                        className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                        View Profile
                    </Link>
                    <span className="text-sm text-gray-500">
                        Joined {new Date(artist.createdAt).toLocaleDateString()}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default ArtistCard; 