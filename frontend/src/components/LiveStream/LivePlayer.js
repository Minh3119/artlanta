import React, { useRef, useEffect } from 'react';
import Hls from 'hls.js';

const LivePlayer = ({ streamKey }) => {
    const videoRef = useRef(null);

    useEffect(() => {
        const video = videoRef.current;
        const hls = new Hls();
        const url = `http://<YOUR_SERVER>:8080/hls/${streamKey}.m3u8`;

        hls.loadSource(url);
        hls.attachMedia(video);
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
            video.play();
        });

        return () => {
            hls.destroy();
        };
    }, [streamKey]);

    return (
        <video ref={videoRef} controls width="640" height="360" />
    );
};

export default LivePlayer;
