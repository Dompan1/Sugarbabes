const express = require('express');
const { User, Profile, Post } = require('../models');
const { authenticateToken } = require('../middleware/auth');
const { Op } = require('sequelize');
const router = express.Router();

// Alla routes är redan skyddade i server.js med authenticateToken middleware

// Hämta användarprofil (egen)
router.get('/profile', async (req, res) => {
  try {
    const userId = req.user.id;
    
    const user = await User.findByIdSafe(userId);
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'Fan, användardata kunde inte hittas' 
      });
    }
    
    const profile = await Profile.findOne({ 
      where: { user_id: userId } 
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
    console.error('Get profile error:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Helvete, något gick fel vid hämtning av profil' 
    });
  }
});

// Uppdatera användarprofil
router.put('/profile', async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, display_name, bio, avatar_url, gender, location, interests } = req.body;
    
    // Uppdatera användarnamn om det skickades med
    if (name) {
      await User.update({ name }, { 
        where: { id: userId } 
      });
    }
    
    // Hitta och uppdatera profilen
    const profile = await Profile.findOne({ 
      where: { user_id: userId } 
    });
    
    if (!profile) {
      // Skapa profil om den inte finns
      await Profile.create({
        user_id: userId,
        display_name: display_name || name,
        bio,
        avatar_url,
        gender,
        location,
        interests
      });
    } else {
      // Uppdatera befintlig profil
      if (display_name !== undefined) profile.display_name = display_name;
      if (bio !== undefined) profile.bio = bio;
      if (avatar_url !== undefined) profile.avatar_url = avatar_url;
      if (gender !== undefined) profile.gender = gender;
      if (location !== undefined) profile.location = location;
      if (interests !== undefined) profile.interests = interests;
      
      await profile.save();
    }
    
    return res.status(200).json({
      success: true,
      message: 'Profilen uppdaterad!',
      profile: await Profile.findOne({ where: { user_id: userId } })
    });
  } catch (error) {
    console.error('Update profile error:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Helvete, kunde inte uppdatera profilen' 
    });
  }
});

// Ändra lösenord
router.put('/password', async (req, res) => {
  try {
    const userId = req.user.id;
    const { currentPassword, newPassword } = req.body;
    
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ 
        success: false, 
        message: 'Nuvarande och nytt lösenord krävs' 
      });
    }
    
    // Hitta användaren med lösenord
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'Användare hittades inte' 
      });
    }
    
    // Verifiera nuvarande lösenord
    const validPassword = await user.validatePassword(currentPassword);
    if (!validPassword) {
      return res.status(401).json({ 
        success: false, 
        message: 'Fan, nuvarande lösenord är felaktigt' 
      });
    }
    
    // Uppdatera lösenordet (bcrypt hash sker i User modellens hooks)
    user.password = newPassword;
    await user.save();
    
    return res.status(200).json({
      success: true,
      message: 'Lösenordet har uppdaterats!'
    });
  } catch (error) {
    console.error('Password change error:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Helvete, kunde inte uppdatera lösenordet' 
    });
  }
});

// Sök användare/profiler
router.get('/search', async (req, res) => {
  try {
    const { query, gender, page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;
    
    // Bygg sökvillkor
    const whereClause = { is_visible: true };
    
    if (gender) {
      whereClause.gender = gender;
    }
    
    // Sök efter användare baserat på query
    const profiles = await Profile.findAndCountAll({
      where: whereClause,
      limit: parseInt(limit),
      offset: parseInt(offset),
      include: [{
        model: User,
        attributes: ['id', 'name', 'is_premium'],
        where: query ? {
          name: { [Op.iLike]: `%${query}%` }
        } : undefined
      }],
      order: [['last_active', 'DESC']]
    });
    
    return res.status(200).json({
      success: true,
      totalProfiles: profiles.count,
      totalPages: Math.ceil(profiles.count / limit),
      currentPage: parseInt(page),
      profiles: profiles.rows
    });
  } catch (error) {
    console.error('User search error:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Helvete, något gick fel vid sökning av användare' 
    });
  }
});

// Hämta profil för annan användare
router.get('/:id', async (req, res) => {
  try {
    const profileId = req.params.id;
    const userId = req.user.id;
    
    // Säkerställ att vi inte hämtar vår egen profil med denna endpoint
    if (profileId === userId) {
      return res.status(400).json({ 
        success: false, 
        message: 'Använd /profile för din egen profil' 
      });
    }
    
    // Hämta användaren och profil
    const user = await User.findByPk(profileId, {
      attributes: ['id', 'name', 'is_premium'],
      include: [{
        model: Profile,
        where: { is_visible: true } // Bara visa synliga profiler
      }]
    });
    
    if (!user || !user.Profile) {
      return res.status(404).json({ 
        success: false, 
        message: 'Profilen hittades inte eller är inte synlig' 
      });
    }
    
    // Hämta även de senaste inläggen från denna användare
    const recentPosts = await Post.findAll({
      where: { 
        user_id: profileId,
        is_premium: false // Visa bara icke-premium-inlägg för alla
      },
      limit: 5,
      order: [['created_at', 'DESC']]
    });
    
    // Lägg till extra info om denna användare är premium
    let extraData = {};
    if (req.user.isPremium) {
      // Hämta premium-inlägg om betraktaren är premium
      const premiumPosts = await Post.findAll({
        where: { 
          user_id: profileId,
          is_premium: true 
        },
        limit: 3,
        order: [['created_at', 'DESC']]
      });
      
      extraData = {
        premiumPosts,
        lastActive: user.Profile.last_active
      };
    }
    
    return res.status(200).json({
      success: true,
      profile: {
        id: user.id,
        name: user.name,
        isPremium: user.is_premium,
        displayName: user.Profile.display_name,
        avatar: user.Profile.avatar_url,
        bio: user.Profile.bio,
        gender: user.Profile.gender,
        location: user.Profile.location,
        interests: user.Profile.interests,
        recentPosts,
        ...extraData
      }
    });
  } catch (error) {
    console.error('Get user profile error:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Helvete, något gick fel vid hämtning av profil' 
    });
  }
});

module.exports = router; 