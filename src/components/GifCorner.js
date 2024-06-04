// GifCorner.js
import React, { useState, useEffect, useRef } from 'react';
import './GifCorner.css';
import pepeGif from './pepe_transparent.gif';

const phrases = [
    "Hello!",
    "Stay away!",
    "Catch me if you can!",
    "I'm over here!",
    "Peek-a-boo!",
    "Buy $PEPI!",
    "$1B is FUD",
    
];

function GifCorner() {
    const gifRef = useRef(null);
    const [position, setPosition] = useState({ top: '10%', left: '10%' });
    const [lastMoveTime, setLastMoveTime] = useState(Date.now());
    const [phrase, setPhrase] = useState('');
    const [showPhrase, setShowPhrase] = useState(false);

    const handleMouseMove = (event) => {
        const gifRect = gifRef.current.getBoundingClientRect();
        const mouseX = event.clientX;
        const mouseY = event.clientY;
        const distance = Math.hypot(mouseX - (gifRect.left + gifRect.width / 2), mouseY - (gifRect.top + gifRect.height / 2));

        if (distance < 150) {
            const newTop = Math.max(0, Math.min(window.innerHeight - gifRect.height, gifRect.top + (gifRect.top < mouseY ? -100 : 100)));
            const newLeft = Math.max(0, Math.min(window.innerWidth - gifRect.width, gifRect.left + (gifRect.left < mouseX ? -100 : 100)));

            setPosition({ top: `${newTop}px`, left: `${newLeft}px` });
            setLastMoveTime(Date.now());
            setShowPhrase(false);
        }
    };

    useEffect(() => {
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    useEffect(() => {
        const checkPhrase = setInterval(() => {
            if (Date.now() - lastMoveTime > 2000) {
                setPhrase(phrases[Math.floor(Math.random() * phrases.length)]);
                setShowPhrase(true);
            }
        }, 2000);

        return () => clearInterval(checkPhrase);
    }, [lastMoveTime]);

    return (
        <div ref={gifRef} className="gif-corner" style={{ top: position.top, left: position.left }}>
            <img src={pepeGif} alt="Pepe GIF" />
            {showPhrase && <div className="gif-phrase">{phrase}</div>}
        </div>
    );
}

export default GifCorner;
