const jwt = require('jsonwebtoken');
const { User } = require('../models');

// Middleware för att autentisera JWT token
const authenticateToken = async (req, res, next) => {
  try {
    // Hämta token från cookies eller authorization header
    const token = req.cookies.accessToken || 
                  (req.headers.authorization && req.headers.authorization.split(' ')[1]);
    
    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: 'Fan, du måste logga in för att få tillgång' 
      });
    }

    // Verifiera token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Kolla om användaren finns
    const user = await User.findByPk(decoded.userId);
    
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'Användare hittades inte' 
      });
    }
    
    // Lägg till användaren till request objektet
    req.user = {
      id: user.id,
      email: user.email,
      role: user.role,
      isPremium: user.is_premium
    };
    
    next();
  } catch (error) {
    console.error('Auth error:', error);
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        success: false, 
        message: 'Din session har gått ut, logga in igen för fan' 
      });
    }
    
    return res.status(403).json({ 
      success: false, 
      message: 'Ogiltig token, dra åt helvete härifrån' 
    });
  }
};

// Middleware för admin-rättigheter
const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    return res.status(403).json({ 
      success: false, 
      message: 'Fan, du har inte admin-rättigheter' 
    });
  }
};

// Middleware för rate limiting baserat på användarstatus
const premiumRateLimit = (standardLimit, premiumLimit) => {
  return (req, res, next) => {
    // Sätt dynamiskt rate-limit baserat på användarpremium status
    req.rateLimit = req.user && req.user.isPremium ? premiumLimit : standardLimit;
    next();
  };
};

module.exports = {
  authenticateToken,
  isAdmin,
  premiumRateLimit
}; 