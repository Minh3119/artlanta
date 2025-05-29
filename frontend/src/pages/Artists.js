import React, { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import ArtistCard from '../components/UserProfileView/ArtistCard';
import 'react-toastify/dist/ReactToastify.css';

const Artists = () => {
    const [artists, setArtists] = useState([]);
    const [portfolios, setPortfolios] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchArtists = async () => {
            try {
                // Fetch all artists
                const response = await fetch('http://localhost:9999/backend/api/user?role=CLIENT', {
                    method: 'GET',
                    credentials: 'include',
                    headers: { 'Content-Type': 'application/json' },
                });
                const data = await response.json();
                
                if (data.error) {
                    throw new Error(data.error);
                }

                const artistsList = data.response;
                setArtists(artistsList);

                // Fetch portfolios for each artist
                const portfolioPromises = artistsList.map(artist =>
                    fetch(`http://localhost:9999/backend/api/portfolio/${artist.id}`, {
                        method: 'GET',
                        credentials: 'include',
                        headers: { 'Content-Type': 'application/json' },
                    }).then(res => res.json())
                );
                const portfolioResults = await Promise.all(portfolioPromises);

                const portfolioMap = {};
                portfolioResults.forEach((result, index) => {
                    if (!result.error) {
                        portfolioMap[artistsList[index].id] = result.response;
                    }
                });
                setPortfolios(portfolioMap);

                setLoading(false);
            } catch (error) {
                toast.error('Failed to load artists');
                setLoading(false);
            }
        };

        fetchArtists();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">
                        Hire the best artists
                    </h1>
                    <p className="text-xl text-gray-600">
                        Work with top-quality freelance drawing artists who will get your project done just right.
                    </p>
                </div>

                {artists.length === 0 ? (
                    <div className="text-center text-gray-500">
                        No artists found.
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {artists.map(artist => (
                            <ArtistCard
                                key={artist.id}
                                artist={artist}
                                portfolio={portfolios[artist.id]}
                            />
                        ))}
                    </div>
                )}
            </div>
            <ToastContainer />
        </div>
    );
};

export default Artists; 