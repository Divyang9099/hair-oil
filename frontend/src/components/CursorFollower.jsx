import React, { useEffect, useRef } from 'react';

const CursorFollower = () => {
    const cursorRef = useRef(null);
    const [isTouchDevice, setIsTouchDevice] = React.useState(false);

    useEffect(() => {
        // Check for touch device
        const checkTouch = () => {
            setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0);
        };
        checkTouch();

        if (isTouchDevice) return;

        const cursor = cursorRef.current;
        let mouseX = 0;
        let mouseY = 0;
        let requestRef;

        const animate = () => {
            if (cursor) {
                cursor.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
            }
            requestRef = requestAnimationFrame(animate);
        };

        const moveCursor = (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        };

        requestRef = requestAnimationFrame(animate);
        window.addEventListener('mousemove', moveCursor);

        return () => {
            window.removeEventListener('mousemove', moveCursor);
            cancelAnimationFrame(requestRef);
        };
    }, [isTouchDevice]);

    if (isTouchDevice) return null;

    const initialStyles = {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '20px',
        height: '20px',
        borderRadius: '50%',
        backgroundColor: 'rgba(5, 150, 105, 0.6)', // Theme Green
        pointerEvents: 'none',
        zIndex: 9999,
        mixBlendMode: 'multiply',
        willChange: 'transform',
    };

    return <div ref={cursorRef} className="cursor-follower" style={initialStyles} />;
};

export default CursorFollower;
