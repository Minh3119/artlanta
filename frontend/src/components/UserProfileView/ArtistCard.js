import React from 'react';
import { Link } from 'react-router-dom';
import CoverImage from './CoverImage';
import AvatarImage from './AvatarImage';
import MediaImage from './MediaImage';

const ArtistCard = ({ artist, portfolio }) => {
    return (
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="relative">
                {/* Cover Image */}
                <CoverImage coverUrl={portfolio?.coverUrl} artistName={artist.displayName} />
                
                {/* Artist Avatar */}
                <div className="absolute -bottom-6 left-4">
                    <AvatarImage avatarUrl={artist.avatarUrl} displayName={artist.displayName} />
                </div>
            </div>

            <div className="p-4 pt-20">
                <h3 className="text-xl font-semibold text-gray-900 flex justify-between items-center">
                    {artist.displayName || 'Unnamed Artist'}
                    <Link
                        to={`/user/${artist.id}`}
                        className="no-underline px-4 py-1.5 text-sm bg-[#00A0FF] hover:bg-[#0090e8] active:bg-[#0080d1] text-white rounded-md shadow-md hover:shadow-lg transform hover:-translate-y-0.5 active:translate-y-0 transition-all duration-150 font-medium border-b-4 border-[#0080d1] active:border-b-0 active:mt-1"
                    >
                        View Profile
                    </Link>
                </h3>
                <p className="text-gray-600 mt-1">
                    {portfolio?.title || 'No portfolio title'}
                </p>
                <p className="text-sm text-gray-500 mt-2 line-clamp-2">
                    {portfolio?.description || 'No portfolio description'}
                </p>

                {/* Portfolio Media Gallery */}
                <MediaImage media={portfolio?.media} />

                <div className="mt-4 flex justify-end items-center">
                    <span className="text-sm text-gray-500">
                        Joined {new Date(artist.createdAt).toLocaleDateString()}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default ArtistCard; 