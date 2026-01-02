// @desc    Admin login
// @route   POST /api/admin/login
exports.login = (req, res) => {
    const { id, password } = req.body;
    const ADMIN_ID = process.env.ADMIN_ID;
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

    if (!id || !password) {
        return res.status(400).json({ success: false, error: 'ID and password are required' });
    }

    if (id === ADMIN_ID && password === ADMIN_PASSWORD) {
        res.status(200).json({ success: true, message: 'Login successful' });
    } else {
        res.status(401).json({ success: false, error: 'Invalid credentials' });
    }
};
