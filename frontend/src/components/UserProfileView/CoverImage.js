import React, { useState } from 'react';

const CoverPlaceholder = () => (
    <div className="w-full h-48 bg-gray-200 flex flex-col items-center justify-center">
        <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <p className="mt-2 text-sm text-gray-500">No Cover Image</p>
    </div>
);

const CoverImage = ({ coverUrl, artistName }) => {
    const [coverImageError, setCoverImageError] = useState(false);

    if (coverImageError || !coverUrl) {
        return <CoverPlaceholder />;
    }

    return (
        <img
            src={coverUrl}
            alt={`${artistName}'s cover`}
            className="w-full h-48 object-cover"
            onError={() => setCoverImageError(true)}
        />
    );
};

export default CoverImage; 