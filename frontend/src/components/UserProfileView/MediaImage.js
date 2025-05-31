import React, { useState } from 'react';
import ImageViewerModal from './ImageViewerModal';

const MediaPlaceholder = () => (
    <div className="w-full h-20 bg-gray-200 rounded flex flex-col items-center justify-center">
        <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <span className="text-xs text-gray-400 mt-1">No image</span>
    </div>
);

const MediaImage = ({ media }) => {
    const [mediaErrors, setMediaErrors] = useState({});
    const [selectedImageIndex, setSelectedImageIndex] = useState(null);

    const handleMediaError = (index) => {
        setMediaErrors(prev => ({
            ...prev,
            [index]: true
        }));
    };

    const handleImageClick = (index) => {
        if (!mediaErrors[index]) {
            setSelectedImageIndex(index);
        }
    };

    const handleCloseModal = () => {
        setSelectedImageIndex(null);
    };

    const handlePreviousImage = () => {
        setSelectedImageIndex(prev => Math.max(0, prev - 1));
    };

    const handleNextImage = () => {
        setSelectedImageIndex(prev => Math.min((media?.length || 0) - 1, prev + 1));
    };

    return (
        <>
            <div className="mt-4 grid grid-cols-3 gap-2">
                {media && media.length > 0 ? (
                    media.slice(0, 3).map((mediaItem, index) => (
                        <div 
                            key={mediaItem.id} 
                            className="aspect-w-1 aspect-h-1 bg-gray-100 rounded overflow-hidden cursor-pointer"
                            onClick={() => handleImageClick(index)}
                        >
                            {mediaErrors[index] ? (
                                <MediaPlaceholder />
                            ) : (
                                <img
                                    src={mediaItem.url}
                                    alt={mediaItem.description || `Portfolio work ${index + 1}`}
                                    className="w-full h-20 object-cover hover:opacity-90 transition-opacity"
                                    onError={() => handleMediaError(index)}
                                />
                            )}
                        </div>
                    ))
                ) : (
                    Array(3).fill(0).map((_, index) => (
                        <MediaPlaceholder key={index} />
                    ))
                )}
            </div>

            {selectedImageIndex !== null && media && media[selectedImageIndex] && (
                <ImageViewerModal
                    imageUrl={media[selectedImageIndex].url}
                    onClose={handleCloseModal}
                    onPrevious={handlePreviousImage}
                    onNext={handleNextImage}
                    hasPrevious={selectedImageIndex > 0}
                    hasNext={selectedImageIndex < (media.length - 1)}
                />
            )}
        </>
    );
};

export default MediaImage; 