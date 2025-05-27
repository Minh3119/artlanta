import React from 'react';
import { Link } from 'react-router-dom';

const ArtistCard = ({ artist, portfolio }) => {
    return (
        <Link 
            to={`/user/${artist.id}`}
            className="block p-4 bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-200"
        >
            <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                    {artist.avatarUrl ? (
                        <img
                            src={artist.avatarUrl}
                            alt={artist.displayName || artist.username}
                            className="w-12 h-12 rounded-full object-cover"
                        />
                    ) : (
                        <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                            <span className="text-xl text-gray-400">
                                {(artist.displayName || artist.username)?.charAt(0).toUpperCase()}
                            </span>
                        </div>
                    )}
                </div>
                
                <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-blue-600 truncate">
                        {artist.displayName || artist.username}
                    </h3>
                    <p className="text-sm text-gray-600 truncate">
                        {portfolio?.title || "Freelance Artist"}
                    </p>
                    
                    {/* Tags */}
                    <div className="mt-2 flex flex-wrap gap-2">
                        {artist.tags?.slice(0, 3).map((tag, index) => (
                            <span
                                key={index}
                                className="inline-block px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full"
                            >
                                {tag}
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            {/* Portfolio Preview */}
            <div className="mt-4 grid grid-cols-3 gap-2">
                {portfolio?.artworks?.slice(0, 3).map((artwork, index) => (
                    <div key={index} className="aspect-w-1 aspect-h-1 rounded-lg overflow-hidden bg-gray-100">
                        <img
                            src={artwork.imageUrl}
                            alt={artwork.title || `Artwork ${index + 1}`}
                            className="w-full h-full object-cover"
                        />
                    </div>
                ))}
                {!portfolio?.artworks && (
                    Array(3).fill(0).map((_, index) => (
                        <div key={index} className="aspect-w-1 aspect-h-1 rounded-lg bg-gray-100" />
                    ))
                )}
            </div>
        </Link>
    );
};

export default ArtistCard; 