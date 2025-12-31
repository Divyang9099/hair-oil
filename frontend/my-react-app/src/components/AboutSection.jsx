import { useState } from 'react';
import { motion } from 'framer-motion';

const AboutSection = () => {
    const [videoEmbedUrl, setVideoEmbedUrl] = useState('');

    const handleVideoClick = () => {
        const videoUrl = 'https://youtu.be/u2vFSy8S4Ew?si=5MY6lSd-Mw4cd7oR'; // Can be prop or fixed
        if (videoUrl) {
            let embedUrl = '';
            if (videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be')) {
                const videoId = videoUrl.includes('youtu.be')
                    ? videoUrl.split('youtu.be/')[1].split('?')[0]
                    : videoUrl.split('v=')[1].split('&')[0];
                embedUrl = `https://www.youtube.com/embed/${videoId}`;
            } else if (videoUrl.includes('vimeo.com')) {
                const videoId = videoUrl.split('vimeo.com/')[1].split('?')[0];
                embedUrl = `https://player.vimeo.com/video/${videoId}`;
            } else {
                alert('કૃપા કરીને માન્ય YouTube અથવા Vimeo URL દાખલ કરો.');
                return;
            }
            setVideoEmbedUrl(embedUrl);
        }
    };

    return (
        <motion.section
            id="about"
            className="section about-section"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.8 }}
        >
            <div className="container">
                <h2 className="section-title">૨૦ વર્ષની શુદ્ધતા અને વિશ્વાસ</h2>
                <div className="about-content">
                    <motion.p className="about-text" initial={{ x: -50, opacity: 0 }} whileInView={{ x: 0, opacity: 1 }} viewport={{ once: true, amount: 0.4 }} transition={{ duration: 0.6 }}>
                        Kesh Rasayana માત્ર એક પ્રોડક્ટ નથી, તે અમારા પરિવારની ૨૦ વર્ષની મહેનત અને પરંપરાનો વારસો છે. અંબાલાના અનુભવી વૈદ્ય દ્વારા તૈયાર કરવામાં આવેલું આ તેલ શુદ્ધ આયુર્વેદિક ઘટકો સાથે બનાવવામાં આવે છે.
                    </motion.p>
                    <motion.div className="video-placeholder" initial={{ x: 50, opacity: 0 }} whileInView={{ x: 0, opacity: 1 }} viewport={{ once: true, amount: 0.4 }} transition={{ duration: 0.6, delay: 0.2 }}>
                        <div className="video-container" onClick={handleVideoClick}>
                            {videoEmbedUrl ? (
                                <iframe src={videoEmbedUrl} frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen style={{ width: '100%', height: '100%', borderRadius: '8px' }} title="Video Player" />
                            ) : (
                                <motion.div className="video-placeholder-content" whileHover={{ scale: 1.03 }}>
                                    <div className="play-button">▶</div>
                                    <div className="video-title">જુઓ! શુદ્ધ તેલ બનાવવાની પ્રક્રિયા</div>
                                </motion.div>
                            )}
                        </div>

                    </motion.div>
                </div>
            </div>
        </motion.section>
    );
};

export default AboutSection;
