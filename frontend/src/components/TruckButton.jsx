import React, { useState } from 'react';
import '../TruckButton.css';

const TruckButton = ({ onClick, isSubmitting, defaultText = "ઓર્ડર કન્ફર્મ કરો", successText = "ઓર્ડર સેવ થયો! ✅", disabled = false }) => {
    const [animation, setAnimation] = useState(false);
    const [done, setDone] = useState(false);

    const handleClick = async (e) => {
        if (animation || done || disabled) return;

        setAnimation(true);

        // Trigger the parent onClick (which handles the actual order submission)
        const success = await onClick(e);

        if (success) {
            // Wait for the truck animation to finish (matching CSS duration ~4s)
            setTimeout(() => {
                setDone(true);
                setAnimation(false);

                // Reset after showing 'Success' for 5 seconds
                setTimeout(() => {
                    setDone(false);
                }, 5000);

            }, 4000);
        } else {
            // If failed, reset immediately
            setAnimation(false);
        }
    };

    return (
        <button
            className={`truck-button ${animation ? 'animation' : ''} ${done ? 'done' : ''}`}
            onClick={handleClick}
            disabled={disabled || animation}
            type="button"
        >
            <span className="default">{defaultText}</span>
            <span className="success">{successText}</span>
            <div className="truck">
                <div className="wheel"></div>
                <div className="cab"></div>
                <div className="box"></div>
            </div>
        </button>
    );
};

export default TruckButton;
