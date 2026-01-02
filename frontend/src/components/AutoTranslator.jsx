import React, { useEffect } from 'react';

const AutoTranslator = () => {
    useEffect(() => {
        // Only add script if it doesn't exist
        if (!document.querySelector('script[src*="translate.google.com"]')) {
            const addScript = document.createElement('script');
            addScript.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
            addScript.async = true;
            document.body.appendChild(addScript);

            window.googleTranslateElementInit = () => {
                new window.google.translate.TranslateElement({
                    pageLanguage: 'gu', // Source language of your content
                    includedLanguages: 'en,gu,hi,mr', // Languages you want to support
                    layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
                    autoDisplay: false
                }, 'google_translate_element');
            };
        }
    }, []);

    return (
        <div
            id="google_translate_element"
            style={{
                margin: '10px',
                padding: '5px',
                borderRadius: '8px',
                backgroundColor: 'rgba(255,255,255,0.1)',
                backdropFilter: 'blur(5px)'
            }}
        ></div>
    );
};

export default AutoTranslator;
