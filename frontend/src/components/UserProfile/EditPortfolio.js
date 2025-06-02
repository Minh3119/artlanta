import React, { useState } from 'react';
import { toast } from 'react-toastify';

const EditPortfolio = ({ 
    portfolioData, 
    setPortfolioData, 
    setIsEditingPortfolio,
    userId 
}) => {
    const [isUploading, setIsUploading] = useState(false);

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setIsUploading(true);
        const formData = new FormData();
        formData.append('file[]', file);

        try {
            const response = await fetch('http://localhost:9999/backend/api/upload', {
                method: 'POST',
                credentials: 'include',
                body: formData
            });

            const data = await response.json();
            console.log('Upload response:', data);
            
            if (!data.error && data.response && data.response.length > 0) {
                setPortfolioData(prev => ({ ...prev, coverUrl: data.response[0].url }));
                toast.success('Cover image uploaded successfully!');
            } else {
                console.error('Error uploading image:', data);
                toast.error(data.error || 'Failed to upload image');
            }
        } catch (error) {
            console.error('Error uploading image:', error);
            toast.error('Failed to upload image');
        } finally {
            setIsUploading(false);
        }
    };

    const handleSave = async () => {
        try {
            const response = await fetch(`http://localhost:9999/backend/api/portfolio/${userId}`, {
                method: 'PUT',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(portfolioData)
            });

            const data = await response.json();
            if (!data.error) {
                toast.success('Portfolio updated successfully!');
                setIsEditingPortfolio(false);
            } else {
                toast.error(data.error);
            }
        } catch (error) {
            toast.error('Failed to update portfolio');
        }
    };

    return (
        <div className="mt-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Edit Portfolio</h2>
            <div className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Title</label>
                    <input
                        type="text"
                        value={portfolioData?.title || ''}
                        onChange={(e) => setPortfolioData(prev => ({ ...prev, title: e.target.value }))}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        placeholder="Portfolio title"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Description</label>
                    <textarea
                        value={portfolioData?.description || ''}
                        onChange={(e) => setPortfolioData(prev => ({ ...prev, description: e.target.value }))}
                        rows={4}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        placeholder="Portfolio description"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Cover Image</label>
                    <div className="mt-1 flex items-center gap-4">
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="block w-full text-sm text-gray-500
                                file:mr-4 file:py-2 file:px-4 file:rounded-md
                                file:border-0 file:text-sm file:font-medium
                                file:bg-blue-50 file:text-blue-700
                                hover:file:bg-blue-100"
                            disabled={isUploading}
                        />
                        {isUploading && (
                            <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-blue-500"></div>
                        )}
                    </div>
                    {portfolioData?.coverUrl && (
                        <img
                            src={portfolioData.coverUrl}
                            alt="Cover Preview"
                            className="mt-4 w-full max-w-md rounded-lg shadow-md"
                        />
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Achievements</label>
                    <textarea
                        value={portfolioData?.achievements || ''}
                        onChange={(e) => setPortfolioData(prev => ({ ...prev, achievements: e.target.value }))}
                        rows={4}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        placeholder="List your achievements"
                    />
                </div>

                <div className="flex gap-4">
                    <button
                        onClick={handleSave}
                        disabled={isUploading}
                        className={`flex-1 py-2 px-4 rounded-lg font-medium ${isUploading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'} text-white transition-colors`}
                    >
                        Save Changes
                    </button>
                    <button
                        onClick={() => setIsEditingPortfolio(false)}
                        className="flex-1 py-2 px-4 rounded-lg font-medium bg-gray-200 text-gray-800 hover:bg-gray-300 transition-colors"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EditPortfolio;