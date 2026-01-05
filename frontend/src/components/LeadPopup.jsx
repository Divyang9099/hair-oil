import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import API_BASE_URL from '../config';

const LeadPopup = ({ isOpen, onClose, onSuccess }) => {
    const { t } = useTranslation();
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    const validatePhone = (phone) => {
        const cleanedPhone = phone.replace(/\D/g, '');
        return /^[6-9]\d{9}$/.test(cleanedPhone);
    };

    const validateEmail = (email) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!validateEmail(email)) {
            setError(t('lead.email_error'));
            return;
        }

        if (!validatePhone(phone)) {
            setError(t('lead.phone_error'));
            return;
        }

        setIsSubmitting(true);

        try {
            console.log(`[LeadPopup] Posting lead to: ${API_BASE_URL}/api/leads`, { email, phone });
            const response = await fetch(`${API_BASE_URL}/api/leads`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, phone }),
            });

            if (response.ok) {
                const data = await response.json();
                console.log('[LeadPopup] Lead captured successfully:', data);
                onSuccess(data.order); // Pass the created order (with _id)
                onClose();
            } else {
                const errorData = await response.json().catch(() => ({ error: 'Unknown Error' }));
                console.error(`[LeadPopup] Failed to capture lead. Status: ${response.status}`, errorData);
                setError(errorData.error || t('lead.save_error'));
            }
        } catch (err) {
            console.error('[LeadPopup] CRITICAL ERROR: handleSubmit failed.', err);
            setError(t('lead.server_error', { message: err.message }));
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                className="modal-overlay"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex',
                    justifyContent: 'center', alignItems: 'center', zIndex: 2000
                }}
            >
                <motion.div
                    className="modal-content"
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 50, opacity: 0 }}
                    style={{
                        background: 'white', padding: '2rem', borderRadius: '15px',
                        width: '90%', maxWidth: '400px', border: '3px solid var(--deep-green)',
                        textAlign: 'center'
                    }}
                >
                    <h3 style={{ color: 'var(--deep-green)', marginBottom: '1rem' }}>{t('lead.title')}</h3>
                    <p style={{ marginBottom: '1.5rem', fontSize: '0.9rem', color: 'var(--text-dark)', opacity: 0.8 }}>
                        {t('lead.subtitle')}
                    </p>

                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <input
                            type="email"
                            placeholder={t('lead.email_placeholder')}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            style={{ padding: '0.8rem', border: '1px solid #ddd', borderRadius: '5px' }}
                        />
                        <input
                            type="tel"
                            placeholder={t('lead.phone_placeholder')}
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            maxLength="10"
                            required
                            style={{ padding: '0.8rem', border: '1px solid #ddd', borderRadius: '5px' }}
                        />

                        {error && <p style={{ color: 'red', fontSize: '0.8rem' }}>{error}</p>}

                        <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                            <button
                                type="button"
                                onClick={onClose}
                                className="btn-logout"
                                style={{ flex: 1, margin: 0, padding: '0.8rem' }}
                            >
                                {t('lead.cancel')}
                            </button>
                            <button
                                type="submit"
                                className="btn-primary"
                                style={{ flex: 1, padding: '0.8rem' }}
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? t('lead.processing') : t('lead.submit')}
                            </button>
                        </div>
                    </form>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default LeadPopup;
