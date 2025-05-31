import React from 'react';

const ImageViewerModal = ({ imageUrl, onClose, onPrevious, onNext, hasNext, hasPrevious }) => {
    // Prevent clicks inside modal from closing it
    const handleModalClick = (e) => {
        e.stopPropagation();
    };

    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
            onClick={onClose}
        >
            <div 
                className="relative max-w-4xl w-full h-[80vh] mx-4 flex items-center justify-center"
                onClick={handleModalClick}
            >
                {/* Previous button */}
                {hasPrevious && (
                    <button
                        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-12 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition-colors"
                        onClick={onPrevious}
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                )}

                {/* Next button */}
                {hasNext && (
                    <button
                        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-12 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition-colors"
                        onClick={onNext}
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                )}

                {/* Close button */}
                <button
                    className="absolute top-0 right-0 -translate-y-12 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition-colors"
                    onClick={onClose}
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                {/* Image */}
                <img
                    src={imageUrl}
                    alt="Enlarged view"
                    className="max-h-full max-w-full object-contain"
                    onClick={e => e.stopPropagation()}
                />
            </div>
        </div>
    );
};

export default ImageViewerModal; 