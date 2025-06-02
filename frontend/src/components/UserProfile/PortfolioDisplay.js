import React from 'react';

const PortfolioDisplay = ({ 
    allImages,
    currentImageIndex,
    handlePreviousImage,
    handleNextImage,
    portfolioData
}) => {
    if (allImages.length === 0) {
        return null;
    }

    const currentImage = allImages[currentImageIndex];

    return (
        <div className="relative">
            <div className="relative rounded-3xl overflow-hidden shadow-xl aspect-square">
                <img
                    className="w-full h-full object-cover"
                    src={currentImage.url}
                    alt={currentImage.title || "Portfolio Image"}
                />

                {/* Overlay text */}
                <div className="absolute bottom-0 left-0 p-8 text-white bg-gradient-to-t from-black/70 to-transparent w-full">
                    <h2 className="text-3xl font-bold mb-2">
                        {currentImage.title || (currentImage.isCover ? portfolioData?.title : '')}
                    </h2>
                    <p className="text-lg">
                        {currentImage.description || (currentImage.isCover ? portfolioData?.description : '')}
                    </p>
                </div>
                
                
            </div>

            {/* Navigation Controls */}
            <div className="top-8 left-8 right-8 flex justify-between items-center px-8 py-4">
                {/* Previous button */}
                <button
                    onClick={handlePreviousImage}
                    disabled={currentImageIndex === 0}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-50/90 text-gray-800 hover:bg-white transition-colors ${
                        currentImageIndex === 0 
                            ? 'opacity-50 cursor-not-allowed' 
                            : 'hover:scale-105 transform transition-transform'
                    }`}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Previous
                </button>
                {/* Image number */}
                <div className="bg-gray-100/90 text-gray-800 px-4 py-2 rounded-lg">
                    {currentImageIndex + 1} / {allImages.length}
                </div>
                {/* Next button */}
                <button
                    onClick={handleNextImage}
                    disabled={currentImageIndex === allImages.length - 1}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-50/90 text-gray-800 hover:bg-white transition-colors ${
                        currentImageIndex === allImages.length - 1 
                            ? 'opacity-50 cursor-not-allowed' 
                            : 'hover:scale-105 transform transition-transform'
                    }`}
                >
                    Next
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </button>
            </div>
        </div>
    );
};

export default PortfolioDisplay; 