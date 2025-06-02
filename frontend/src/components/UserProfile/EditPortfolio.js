import React from 'react';
import { toast } from 'react-toastify';

const EditPortfolio = ({ 
    portfolioData, 
    setPortfolioData, 
    setIsEditingPortfolio,
    userId 
}) => {
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
                    <label className="block text-sm font-medium text-gray-700">Cover Image URL</label>
                    <input
                        type="text"
                        value={portfolioData?.coverUrl || ''}
                        onChange={(e) => setPortfolioData(prev => ({ ...prev, coverUrl: e.target.value }))}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        placeholder="Cover image URL"
                    />
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
                        className="flex-1 py-2 px-4 rounded-lg font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors"
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