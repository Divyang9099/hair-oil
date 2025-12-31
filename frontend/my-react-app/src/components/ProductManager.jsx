import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Base API URL
const API_URL = 'https://hair-oil.onrender.com/api/products';

const ProductManager = () => {
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [currentProduct, setCurrentProduct] = useState({ _id: null, name: '', size: '', price: '', image: '' });
    const [isFormVisible, setIsFormVisible] = useState(false);

    // Fetch Products
    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(API_URL);
            if (response.ok) {
                const data = await response.json();
                setProducts(data);
            } else {
                console.error('Failed to fetch products');
            }
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setIsLoading(false);
        }
    };

    // CRUD Operations
    const handleAdd = () => {
        setCurrentProduct({ _id: null, name: '', size: '', price: '', image: '' });
        setIsEditing(false);
        setIsFormVisible(true);
    };

    const handleEdit = (product) => {
        setCurrentProduct(product);
        setIsEditing(true);
        setIsFormVisible(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('શું તમે ખરેખર આ પ્રોડક્ટ ડિલીટ કરવા માંગો છો?')) {
            try {
                const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
                if (response.ok) {
                    setProducts(products.filter(p => p._id !== id));
                } else {
                    alert('Error deleting product');
                }
            } catch (error) {
                console.error('Error deleting product:', error);
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const productData = {
            name: currentProduct.name,
            size: currentProduct.size,
            price: currentProduct.price,
            image: currentProduct.image
        };

        try {
            let response;
            if (isEditing) {
                response = await fetch(`${API_URL}/${currentProduct._id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(productData)
                });
            } else {
                response = await fetch(API_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(productData)
                });
            }

            if (response.ok) {
                fetchProducts(); // Refresh list
                setIsFormVisible(false);
            } else {
                alert('Error saving product');
            }
        } catch (error) {
            console.error('Error saving product:', error);
        }
    };

    return (
        <div className="product-manager-container">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h2 className="section-title" style={{ marginBottom: 0 }}>પ્રોડક્ટ્સ (Product Catalog)</h2>
                {/* Create Button */}
                <motion.button
                    className="btn-primary"
                    onClick={handleAdd}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    + Add Product
                </motion.button>
            </div>

            {/* Read: Product List */}
            {isLoading ? (
                <div style={{ textAlign: 'center', padding: '2rem' }}>Loading products...</div>
            ) : (
                <div className="orders-table-container">
                    <table className="orders-table">
                        <thead>
                            <tr>
                                <th>Image</th>
                                <th>Name</th>
                                <th>Size</th>
                                <th>Price (₹)</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map((product) => (
                                <motion.tr
                                    key={product._id}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    whileHover={{ backgroundColor: "var(--cream-beige)" }}
                                >
                                    <td>
                                        {product.image && (
                                            <img src={product.image} alt={product.name} style={{ width: '50px', height: '50px', objectFit: 'contain' }} />
                                        )}
                                    </td>
                                    <td>{product.name}</td>
                                    <td>{product.size}</td>
                                    <td>₹{product.price}</td>
                                    <td style={{ display: 'flex', gap: '10px' }}>
                                        {/* Update Button */}
                                        <button
                                            className="btn-secondary"
                                            style={{ padding: '5px 10px', fontSize: '0.9rem' }}
                                            onClick={() => handleEdit(product)}
                                        >
                                            Edit
                                        </button>
                                        {/* Delete Button */}
                                        <button
                                            className="btn-logout"
                                            style={{ padding: '5px 10px', fontSize: '0.9rem', margin: 0 }}
                                            onClick={() => handleDelete(product._id)}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Create/Update Form Modal */}
            <AnimatePresence>
                {isFormVisible && (
                    <motion.div
                        className="modal-overlay"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        style={{
                            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                            backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex',
                            justifyContent: 'center', alignItems: 'center', zIndex: 1000
                        }}
                    >
                        <motion.div
                            className="modal-content"
                            initial={{ y: 50, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: 50, opacity: 0 }}
                            style={{
                                background: 'white', padding: '2rem', borderRadius: '12px',
                                width: '90%', maxWidth: '500px', border: '2px solid var(--deep-green)'
                            }}
                        >
                            <h3>{isEditing ? 'Edit Product' : 'Add New Product'}</h3>
                            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <input
                                    type="text"
                                    placeholder="Product Name"
                                    value={currentProduct.name}
                                    onChange={(e) => setCurrentProduct({ ...currentProduct, name: e.target.value })}
                                    required
                                    style={{ padding: '0.8rem', border: '1px solid #ddd', borderRadius: '4px' }}
                                />
                                <input
                                    type="text"
                                    placeholder="Size (e.g. 250ml)"
                                    value={currentProduct.size}
                                    onChange={(e) => setCurrentProduct({ ...currentProduct, size: e.target.value })}
                                    required
                                    style={{ padding: '0.8rem', border: '1px solid #ddd', borderRadius: '4px' }}
                                />
                                <input
                                    type="number"
                                    placeholder="Price"
                                    value={currentProduct.price}
                                    onChange={(e) => setCurrentProduct({ ...currentProduct, price: parseInt(e.target.value) })}
                                    required
                                    style={{ padding: '0.8rem', border: '1px solid #ddd', borderRadius: '4px' }}
                                />
                                <input
                                    type="text"
                                    placeholder="Image URL"
                                    value={currentProduct.image}
                                    onChange={(e) => setCurrentProduct({ ...currentProduct, image: e.target.value })}
                                    style={{ padding: '0.8rem', border: '1px solid #ddd', borderRadius: '4px' }}
                                />
                                <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                                    <button type="submit" className="btn-primary" style={{ flex: 1 }}>
                                        {isEditing ? 'Update' : 'Create'}
                                    </button>
                                    <button
                                        type="button"
                                        className="btn-logout"
                                        style={{ flex: 1, margin: 0, textAlign: 'center' }}
                                        onClick={() => setIsFormVisible(false)}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ProductManager;
