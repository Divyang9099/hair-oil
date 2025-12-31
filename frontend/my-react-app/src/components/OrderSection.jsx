import { useState } from 'react';
import { motion } from 'framer-motion';
import { cardVariants } from '../utils/animations';
import '../ProductSelection.css';

const OrderSection = ({ serverStatus }) => {
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        address: '',
        bottleSize: '250ml',
        quantity: 1
    });

    const BOTTLE_PRICES = {
        '250ml': 250,
        '500ml': 500,
        '750ml': 750,
        '1L': 1000
    };

    const validateMobileNumber = (phone) => {
        const cleanedPhone = phone.replace(/\D/g, '');
        const mobileRegex = /^[6-9]\d{9}$/;
        return mobileRegex.test(cleanedPhone);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name === 'quantity') {
            const numValue = value === '' ? '' : parseInt(value);
            setFormData(prev => ({
                ...prev,
                [name]: numValue === '' || isNaN(numValue) ? '' : Math.max(1, numValue)
            }));
        } else if (name === 'phone') {
            const numericValue = value.replace(/\D/g, '');
            setFormData(prev => ({
                ...prev,
                [name]: numericValue
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const getPricePerUnit = () => {
        return BOTTLE_PRICES[formData.bottleSize] || 299;
    };

    const calculateTotal = () => {
        const qty = formData.quantity && formData.quantity >= 1 ? formData.quantity : 1;
        return qty * getPricePerUnit();
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        if (!validateMobileNumber(formData.phone)) {
            alert('કૃપા કરીને માન્ય મોબાઇલ નંબર દાખલ કરો.\nમોબાઇલ નંબર 10 અંકનો હોવો જોઈએ અને 6, 7, 8 અથવા 9 થી શરૂ થવો જોઈએ.\nઉદાહરણ: 9876543210');
            setIsSubmitting(false);
            return;
        }

        setIsSubmitting(true);
        const validQuantity = formData.quantity && formData.quantity >= 1 ? formData.quantity : 1;

        const orderData = {
            name: formData.name,
            phone: formData.phone,
            address: formData.address,
            bottleSize: formData.bottleSize,
            quantity: validQuantity,
            price: getPricePerUnit(),
            total: calculateTotal()
        };

        try {
            const response = await fetch('https://hair-oil.onrender.com/api/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(orderData)
            });

            if (response.ok) {
                const result = await response.json();
                console.log('Order created successfully:', result);
                setShowSuccessMessage(true);
                setFormData({ name: '', phone: '', address: '', bottleSize: '250ml', quantity: 1 });
                setTimeout(() => {
                    setShowSuccessMessage(false);
                }, 5000);
            } else {
                const error = await response.json();
                alert(`ભૂલ: ${error.error || 'ઓર્ડર બનાવવામાં સમસ્યા આવી'}`);
            }
        } catch (error) {
            console.error('Error submitting order:', error);
            alert('ભૂલ: સર્વર સાથે કનેક્શન નથી. કૃપા કરીને પછી પ્રયાસ કરો.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <section id="order" className="section order-section">
            <div className="container">
                <motion.h2 className="section-title" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.1 }}>ઓર્ડર કરો</motion.h2>
                <div className="order-container">
                    {/* Product Selection Grid (Left Side) */}
                    <div className="product-selection-container">
                        <h3 style={{ textAlign: 'center', marginBottom: '1rem', color: 'var(--text-dark)' }}>પૅક પસંદ કરો</h3>
                        <div className="product-grid-vertical">
                            {/* 1L Card */}
                            <motion.div
                                className={`product-card-small ${formData.bottleSize === '1L' ? 'selected' : ''}`}
                                onClick={() => setFormData(prev => ({ ...prev, bottleSize: '1L' }))}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <img src="/bottle_single.png" alt="1L Bottle" className="product-thumb" style={{ height: '70px' }} />
                                <div className="product-info-small">
                                    <h4>1L Family Pack</h4>
                                    <span className="price">₹{BOTTLE_PRICES['1L']}</span>
                                </div>
                            </motion.div>

                            {/* 750ml Card */}
                            <motion.div
                                className={`product-card-small ${formData.bottleSize === '750ml' ? 'selected' : ''}`}
                                onClick={() => setFormData(prev => ({ ...prev, bottleSize: '750ml' }))}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <img src="/bottle_single.png" alt="750ml Bottle" className="product-thumb" style={{ height: '65px' }} />
                                <div className="product-info-small">
                                    <h4>750ml Combo (500ml + 250ml)</h4>
                                    <span className="price">₹{BOTTLE_PRICES['750ml']}</span>
                                </div>
                            </motion.div>

                            {/* 500ml Card */}
                            <motion.div
                                className={`product-card-small ${formData.bottleSize === '500ml' ? 'selected' : ''}`}
                                onClick={() => setFormData(prev => ({ ...prev, bottleSize: '500ml' }))}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <img src="/bottle_single.png" alt="500ml Bottle" className="product-thumb" style={{ height: '60px' }} />
                                <div className="product-info-small">
                                    <h4>500ml Value Pack</h4>
                                    <span className="price">₹{BOTTLE_PRICES['500ml']}</span>
                                </div>
                            </motion.div>

                            {/* 250ml Card */}
                            <motion.div
                                className={`product-card-small ${formData.bottleSize === '250ml' ? 'selected' : ''}`}
                                onClick={() => setFormData(prev => ({ ...prev, bottleSize: '250ml' }))}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <img src="/bottle_single.png" alt="250ml Bottle" className="product-thumb" style={{ height: '50px' }} />
                                <div className="product-info-small">
                                    <h4>250ml Starter Pack</h4>
                                    <span className="price">₹{BOTTLE_PRICES['250ml']}</span>
                                </div>
                            </motion.div>
                        </div>
                    </div>

                    <motion.div className="order-form" variants={cardVariants} initial="initial" whileInView="animate" viewport={{ once: true }}>
                        <h3 style={{ color: 'var(--deep-green)', marginBottom: '1.5rem', textAlign: 'center', fontSize: '1.5rem' }}>ઓર્ડર ફોર્મ</h3>
                        <form id="orderForm" onSubmit={handleFormSubmit}>
                            <div className="form-group">
                                <label htmlFor="name">નામ *</label>
                                <input type="text" id="name" name="name" required placeholder="તમારું પૂર્ણ નામ લખો" value={formData.name} onChange={handleInputChange} />
                            </div>
                            <div className="form-group">
                                <label htmlFor="phone">ફોન નંબર *</label>
                                <input type="tel" id="phone" name="phone" required placeholder="તમારો ફોન નંબર લખો" value={formData.phone} onChange={handleInputChange} maxLength="10" />
                            </div>
                            <div className="form-group">
                                <label htmlFor="address">સરનામું *</label>
                                <textarea id="address" name="address" required placeholder="તમારું સંપૂર્ણ સરનામું લખો" value={formData.address} onChange={handleInputChange} />
                            </div>
                            <div className="form-group">
                                <label htmlFor="bottleSize">બાટલીનું કદ *</label>
                                <select id="bottleSize" name="bottleSize" required value={formData.bottleSize} onChange={handleInputChange} style={{ width: '100%', padding: '0.8rem', border: '2px solid var(--deep-green)', borderRadius: '5px' }}>
                                    <option value="250ml">250ml - ₹299</option>
                                    <option value="500ml">500ml - ₹549</option>
                                    <option value="750ml">750ml - ₹799</option>
                                    <option value="1L">1L - ₹999</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label htmlFor="quantity">પ્રમાણ *</label>
                                <input type="number" id="quantity" name="quantity" required min="1" placeholder="પ્રમાણ દાખલ કરો" value={formData.quantity} onChange={handleInputChange} />
                            </div>
                            <div className="form-group" style={{ marginBottom: '1rem', padding: '1rem', background: 'var(--cream-beige)', borderRadius: '5px', border: '2px solid var(--deep-green)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span style={{ fontWeight: 600, color: 'var(--deep-green)' }}>કુલ રકમ:</span>
                                    <span style={{ fontWeight: 700, color: 'var(--deep-green)', fontSize: '1.2rem' }}>₹{calculateTotal()}</span>
                                </div>
                            </div>
                            <motion.button type="submit" className="btn-secondary" disabled={isSubmitting} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                {isSubmitting
                                    ? (serverStatus !== 'ready' ? 'Connecting to server...' : 'પ્રક્રિયા ચાલી રહી છે...')
                                    : 'ઓર્ડર કન્ફર્મ કરો'}
                            </motion.button>
                            {showSuccessMessage && <motion.div className="success-message" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>✅ ધન્યવાદ! તમારો ઓર્ડર પ્રાપ્ત થયો છે.</motion.div>}
                        </form>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default OrderSection;
