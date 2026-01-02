/**
 * BRIDGE FILE
 * This file exists to prevent deployment errors on platforms like Render 
 * that may still be looking for 'index.js' in the root directory.
 */
require('./backend/src/server.js');
