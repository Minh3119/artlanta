import React, { useState } from 'react';

const AvatarPlaceholder = () => (
    <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center border-[6px] border-white ring-[6px] ring-white">
        <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
    </div>
);

const AvatarImage = ({ avatarUrl, displayName }) => {
    const [avatarError, setAvatarError] = useState(false);

    if (avatarError || !avatarUrl) {
        return <AvatarPlaceholder />;
    }

    return (
        <img
            src={avatarUrl}
            alt={displayName}
            className="w-24 h-24 rounded-full border-[6px] border-white ring-[6px] ring-white object-cover bg-gray-100"
            onError={() => setAvatarError(true)}
        />
    );
};

export default AvatarImage; 