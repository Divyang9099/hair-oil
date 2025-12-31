import { useEffect, useRef } from 'react';

const CursorFollower = () => {
    const cursorRef = useRef(null);

    useEffect(() => {
        const cursor = cursorRef.current;

        // Function to handle Mouse Movement
        const moveCursor = (e) => {
            if (cursor) {
                cursor.style.left = `${e.clientX}px`;
                cursor.style.top = `${e.clientY}px`;
            }
        };

        // Function to handle Touch Movement (Mobile)
        const moveCursorTouch = (e) => {
            if (cursor && e.touches.length > 0) {
                const touch = e.touches[0];
                cursor.style.left = `${touch.clientX}px`;
                cursor.style.top = `${touch.clientY}px`;
            }
        };

        window.addEventListener('mousemove', moveCursor);
        window.addEventListener('touchmove', moveCursorTouch);

        return () => {
            window.removeEventListener('mousemove', moveCursor);
            window.removeEventListener('touchmove', moveCursorTouch);
        };
    }, []);

    return <div ref={cursorRef} className="cursor-follower" />;
};

export default CursorFollower;
