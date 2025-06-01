import React, { useState, useEffect } from 'react';

export const AvatarPlaceholder = ({ size = 'md' }) => {
    const sizeClasses = {
        sm: 'w-24 h-24',
        md: 'w-32 h-32',
        lg: 'w-40 h-40'
    };

    const iconSizes = {
        sm: 'w-12 h-12',
        md: 'w-16 h-16',
        lg: 'w-20 h-20'
    };

    return (
        <div className={`${sizeClasses[size]} rounded-full bg-gray-200 flex items-center justify-center border-4 border-white overflow-hidden ring-[6px] ring-white`}>
            <svg className={`${iconSizes[size]} text-gray-400`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
        </div>
    );
};

const isValidImageUrl = (url) => {
    if (!url) return false;
    
    // Check if URL is valid
    try {
        new URL(url);
    } catch (e) {
        return false;
    }

    // Check if URL ends with common image extensions
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];
    return imageExtensions.some(ext => url.toLowerCase().endsWith(ext)) || url.startsWith('data:image/');
};

const AvatarImage = ({ avatarUrl, displayName, size = 'md' }) => {
    const [imageValid, setImageValid] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const sizeClasses = {
        sm: 'w-24 h-24',
        md: 'w-32 h-32',
        lg: 'w-40 h-40'
    };

    useEffect(() => {
        setIsLoading(true);
        setImageValid(false);

        if (!isValidImageUrl(avatarUrl)) {
            setIsLoading(false);
            return;
        }

        // Preload image
        const img = new Image();
        img.onload = () => {
            setImageValid(true);
            setIsLoading(false);
        };
        img.onerror = () => {
            setImageValid(false);
            setIsLoading(false);
        };
        img.src = avatarUrl;

        return () => {
            // Cleanup
            img.onload = null;
            img.onerror = null;
        };
    }, [avatarUrl]);

    if (isLoading) {
        return (
            <div className={`${sizeClasses[size]} rounded-full border-4 border-white overflow-hidden bg-gray-100 flex items-center justify-center`}>
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-400"></div>
            </div>
        );
    }

    if (!imageValid) {
        return <AvatarPlaceholder size={size} />;
    }

    return (
        <img
            src={avatarUrl}
            alt={displayName}
            className={`${sizeClasses[size]} rounded-full border-4 border-white overflow-hidden object-cover bg-gray-100 ring-[6px] ring-white`}
            onError={() => setImageValid(false)}
        />
    );
};

export default AvatarImage; 