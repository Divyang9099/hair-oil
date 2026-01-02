import React, { useEffect, useRef } from 'react';

const CursorFollower = () => {
    const cursorRef = useRef(null);

    useEffect(() => {
        const cursor = cursorRef.current;
        let mouseX = 0;
        let mouseY = 0;
        let requestRef;

        const animate = () => {
            if (cursor) {
                // Optimized: Use translate3d for GPU acceleration (smoother)
                cursor.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
            }
            requestRef = requestAnimationFrame(animate);
        };

        const moveCursor = (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        };

        const moveCursorTouch = (e) => {
            if (e.touches.length > 0) {
                const touch = e.touches[0];
                mouseX = touch.clientX;
                mouseY = touch.clientY;
            }
        };

        // Start animation loop
        requestRef = requestAnimationFrame(animate);
        window.addEventListener('mousemove', moveCursor);
        window.addEventListener('touchmove', moveCursorTouch);

        return () => {
            window.removeEventListener('mousemove', moveCursor);
            window.removeEventListener('touchmove', moveCursorTouch);
            cancelAnimationFrame(requestRef);
        };
    }, []);

    // Ensure style is merged if user adds class, but basic style is inline to guarantee visibility if CSS fails
    const initialStyles = {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '20px',
        height: '20px',
        borderRadius: '50%',
        backgroundColor: 'rgba(59, 130, 246, 0.6)', // Blue tint
        pointerEvents: 'none',
        zIndex: 9999,
        mixBlendMode: 'difference',
        willChange: 'transform',
        // Hide mainly until moved to avoid 0,0 glitch, though default 0,0 is top-left
    };

    return <div ref={cursorRef} className="cursor-follower" style={initialStyles} />;
};

export default CursorFollower;
