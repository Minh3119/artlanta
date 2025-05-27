import React from 'react';

const TailwindTest = () => {
  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          Tailwind CSS is Working! 🎉
        </h1>
        <p className="text-gray-600 mb-6">
          This component demonstrates various Tailwind CSS utilities:
        </p>
        <div className="space-y-4">
          <button className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md transition-colors duration-200">
            Hover Me
          </button>
          <div className="flex space-x-2">
            <div className="w-8 h-8 bg-red-500 rounded-full animate-pulse"></div>
            <div className="w-8 h-8 bg-yellow-500 rounded-full animate-pulse delay-75"></div>
            <div className="w-8 h-8 bg-green-500 rounded-full animate-pulse delay-150"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TailwindTest; 