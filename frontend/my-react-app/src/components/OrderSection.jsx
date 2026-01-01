import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { cardVariants } from '../utils/animations';
import '../ProductSelection.css';

import API_BASE_URL from '../config';

const OrderSection = ({ serverStatus, partialOrder }) => {
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        address: '',
        bottleSize: '250ml',
        quantity: 1
    });

    const [products, setProducts] = useState([]);
    const [orderId, setOrderId] = useState(null);

    // Update form when partialOrder changes
    useEffect(() => {
        if (partialOrder) {
            setFormData(prev => ({
                ...prev,
                email: partialOrder.email || prev.email,
                phone: partialOrder.phone || prev.phone
            }));
            setOrderId(partialOrder._id);
        }
    }, [partialOrder]);

    // Fetch Products on Mount
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/api/orders`); // Using orders endpoint for compatibility or products endpoint? 
                // Wait, use the PRODUCT endpoint for products!
                const prodResponse = await fetch(`${API_BASE_URL}/api/products`);
                if (prodResponse.ok) {
                    const data = await prodResponse.json();
                    setProducts(data);
                }
            } catch (error) {
                console.error("Error fetching products:", error);
            }
        };
        fetchProducts();
    }, []);

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
        const selectedProduct = products.find(p => p.size === formData.bottleSize);
        return selectedProduct ? selectedProduct.price : 0;
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
            email: formData.email,
            phone: formData.phone,
            address: formData.address,
            bottleSize: formData.bottleSize,
            quantity: validQuantity,
            price: getPricePerUnit(),
            total: calculateTotal()
        };

        try {
            let url = `${API_BASE_URL}/api/orders`;
            let method = 'POST';

            if (orderId) {
                url = `${API_BASE_URL}/api/orders/${orderId}`;
                method = 'PUT';
            }

            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(orderData)
            });

            if (response.ok) {
                const result = await response.json();
                console.log('Order created successfully:', result);
                setShowSuccessMessage(true);
                setFormData({ name: '', email: '', phone: '', address: '', bottleSize: products[0]?.size || '', quantity: 1 });
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
                            {products.length === 0 ? (
                                <p style={{ textAlign: 'center' }}>Loading products...</p>
                            ) : (
                                products.map((product) => (
                                    <motion.div
                                        key={product._id}
                                        className={`product-card-small ${formData.bottleSize === product.size ? 'selected' : ''}`}
                                        onClick={() => setFormData(prev => ({ ...prev, bottleSize: product.size }))}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        <img
                                            src={product.image || "/bottle_single.png"}
                                            alt={`${product.size} Bottle`}
                                            className="product-thumb"
                                            style={{ height: '60px', objectFit: 'contain' }}
                                        />
                                        <div className="product-info-small">
                                            <h4>{product.name}</h4>
                                            <span className="price">₹{product.price}</span>
                                        </div>
                                    </motion.div>
                                ))
                            )}
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
                                <label htmlFor="email">ઇમેઇલ *</label>
                                <input type="email" id="email" name="email" required placeholder="તમારો ઇમેઇલ લખો" value={formData.email} onChange={handleInputChange} />
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
                                    {products.map((product) => (
                                        <option key={product._id} value={product.size}>
                                            {product.size} - ₹{product.price}
                                        </option>
                                    ))}
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
