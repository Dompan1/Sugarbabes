const express = require('express');
const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');
const { User, Profile } = require('../models');
const router = express.Router();

// Rate limiting för login försök
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minuter
  max: 5, // 5 försök per IP
  message: 'För många inloggningsförsök från denna IP, vänta 15 minuter din jävla kåtbock'
});

// Registrera ny användare
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, gender } = req.body;

    // Kolla om användaren redan finns
    const userExists = await User.findOne({ where: { email } });
    if (userExists) {
      return res.status(400).json({ 
        success: false, 
        message: 'Fan, e-postadressen används redan' 
      });
    }

    // Skapa användaren
    const newUser = await User.create({
      name,
      email,
      password // Lösenordet hashas av hook i User-modellen
    });

    // Skapa användarens profil samtidigt
    await Profile.create({
      user_id: newUser.id,
      display_name: name,
      gender
    });

    // Generera JWT token
    const token = jwt.sign(
      { userId: newUser.id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Sätt token i cookie
    res.cookie('accessToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 dagar
    });

    return res.status(201).json({
      success: true,
      message: 'Användaren skapad!',
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role
      },
      token
    });
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Helvete, något gick fel vid registrering' 
    });
  }
});

// Login
router.post('/login', loginLimiter, async (req, res) => {
  try {
    const { email, password } = req.body;

    // Hitta användaren
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Fan, e-post eller lösenord är felaktigt' 
      });
    }

    // Verifiera lösenord
    const validPassword = await user.validatePassword(password);
    if (!validPassword) {
      return res.status(401).json({ 
        success: false, 
        message: 'Fan, e-post eller lösenord är felaktigt' 
      });
    }

    // Generera token
    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Sätt token i cookie
    res.cookie('accessToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 dagar
    });

    return res.status(200).json({
      success: true,
      message: 'Login lyckades!',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        isPremium: user.is_premium
      },
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Helvete, något gick fel vid inloggning' 
    });
  }
});

// Logout
router.post('/logout', (req, res) => {
  res.clearCookie('accessToken');
  
  return res.status(200).json({
    success: true,
    message: 'Utloggad!'
  });
});

// Kolla aktuell användare
router.get('/me', async (req, res) => {
  try {
    // Hämta token från cookie eller auth header
    const token = req.cookies.accessToken || 
                  (req.headers.authorization && req.headers.authorization.split(' ')[1]);
    
    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: 'Ingen token, ingen användare' 
      });
    }

    // Verifiera token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Hämta användaren (utan lösenord)
    const user = await User.findByIdSafe(decoded.userId);
    
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'Användaren hittades inte' 
      });
    }

    // Hämta användarens profil
    const profile = await Profile.findOne({ 
      where: { user_id: user.id } 
    });

    return res.status(200).json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        isPremium: user.is_premium,
        profile
      }
    });
  } catch (error) {
    console.error('Auth check error:', error);
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        success: false, 
        message: 'Token har gått ut, logga in igen' 
      });
    }
    
    return res.status(500).json({ 
      success: false, 
      message: 'Något gick fel vid kontroll av användare' 
    });
  }
});

module.exports = router; 