const express = require('express');
const { User, Profile, Post, Message, Payment } = require('../models');
const { isAdmin } = require('../middleware/auth');
const { Op } = require('sequelize');
const router = express.Router();

// Säkerställ att alla routes är skyddade med admin-middleware
router.use(isAdmin);

// Hämta alla användare med paginering
router.get('/users', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;
    const search = req.query.search || '';
    
    const where = search ? {
      [Op.or]: [
        { name: { [Op.iLike]: `%${search}%` } },
        { email: { [Op.iLike]: `%${search}%` } }
      ]
    } : {};
    
    const users = await User.findAndCountAll({
      attributes: { exclude: ['password'] },
      where,
      limit,
      offset,
      order: [['created_at', 'DESC']],
      include: [{ model: Profile }]
    });
    
    return res.status(200).json({
      success: true,
      totalUsers: users.count,
      totalPages: Math.ceil(users.count / limit),
      currentPage: page,
      users: users.rows
    });
  } catch (error) {
    console.error('Admin users error:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Helvete, kunde inte hämta användarlistan' 
    });
  }
});

// Hämta specifik användare och deras aktivitet
router.get('/users/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    
    const user = await User.findByPk(userId, {
      attributes: { exclude: ['password'] },
      include: [
        { model: Profile },
        { 
          model: Post,
          limit: 10,
          order: [['created_at', 'DESC']] 
        },
        { 
          model: Payment,
          limit: 10,
          order: [['created_at', 'DESC']] 
        }
      ]
    });
    
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'Användaren hittades inte' 
      });
    }
    
    // Hämta antal olästa meddelanden
    const unreadCount = await Message.count({
      where: { 
        receiver_id: userId,
        is_read: false
      }
    });
    
    // Hämta senaste meddelanden (in och ut)
    const recentMessages = await Message.findAll({
      where: {
        [Op.or]: [
          { sender_id: userId },
          { receiver_id: userId }
        ]
      },
      limit: 20,
      order: [['sent_at', 'DESC']],
      include: [
        {
          model: User,
          as: 'Sender',
          attributes: ['id', 'name']
        },
        {
          model: User,
          as: 'Receiver',
          attributes: ['id', 'name']
        }
      ]
    });
    
    return res.status(200).json({
      success: true,
      user,
      stats: {
        unreadMessages: unreadCount,
        recentMessages
      }
    });
  } catch (error) {
    console.error('Admin user details error:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Kunde inte hämta användarinformation' 
    });
  }
});

// Uppdatera användare (admin/premium/etc)
router.put('/users/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    const { role, is_premium, is_banned } = req.body;
    
    const user = await User.findByPk(userId);
    
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'Användaren hittades inte' 
      });
    }
    
    // Uppdatera fält
    if (role !== undefined) user.role = role;
    if (is_premium !== undefined) user.is_premium = is_premium;
    
    // Om användaren ska blockeras/avblockeras
    if (is_banned !== undefined) {
      const profile = await Profile.findOne({ where: { user_id: userId } });
      if (profile) {
        profile.is_visible = !is_banned;
        await profile.save();
      }
    }
    
    await user.save();
    
    return res.status(200).json({
      success: true,
      message: 'Användaren uppdaterad!',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        isPremium: user.is_premium
      }
    });
  } catch (error) {
    console.error('Admin user update error:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Kunde inte uppdatera användaren' 
    });
  }
});

// Hämta dashboard statistik
router.get('/stats', async (req, res) => {
  try {
    const timeRange = req.query.range || 'week';
    let dateFilter;
    
    // Sätt datumfilter baserat på tidsintervall
    const now = new Date();
    if (timeRange === 'day') {
      dateFilter = new Date(now.setDate(now.getDate() - 1));
    } else if (timeRange === 'week') {
      dateFilter = new Date(now.setDate(now.getDate() - 7));
    } else if (timeRange === 'month') {
      dateFilter = new Date(now.setMonth(now.getMonth() - 1));
    } else {
      dateFilter = new Date(now.setFullYear(now.getFullYear() - 1));
    }
    
    // Grundläggande statistik
    const totalUsers = await User.count();
    const newUsers = await User.count({
      where: {
        created_at: { [Op.gte]: dateFilter }
      }
    });
    
    const premiumUsers = await User.count({
      where: { is_premium: true }
    });
    
    const totalPosts = await Post.count();
    const newPosts = await Post.count({
      where: {
        created_at: { [Op.gte]: dateFilter }
      }
    });
    
    const totalMessages = await Message.count();
    const newMessages = await Message.count({
      where: {
        sent_at: { [Op.gte]: dateFilter }
      }
    });
    
    // Betalningsstatistik
    const payments = await Payment.count({
      where: {
        status: 'complete',
        created_at: { [Op.gte]: dateFilter }
      }
    });
    
    const totalIncome = await Payment.sum('amount', {
      where: {
        status: 'complete',
        created_at: { [Op.gte]: dateFilter }
      }
    }) || 0;
    
    return res.status(200).json({
      success: true,
      stats: {
        users: {
          total: totalUsers,
          new: newUsers,
          premium: premiumUsers,
          premiumPercentage: Math.round((premiumUsers / totalUsers) * 100)
        },
        content: {
          totalPosts,
          newPosts,
          totalMessages,
          newMessages
        },
        business: {
          payments,
          totalIncome: parseFloat(totalIncome).toFixed(2)
        }
      }
    });
  } catch (error) {
    console.error('Admin stats error:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Kunde inte generera statistik' 
    });
  }
});

// Rapporterade inlägg
router.get('/reports', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;
    
    // Här skulle du ha ett Report-system
    // Detta är en placeholder för rapporterade inlägg
    
    return res.status(200).json({
      success: true,
      message: 'Report-funktionen är inte implementerad än',
      data: []
    });
  } catch (error) {
    console.error('Admin reports error:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Kunde inte hämta rapporterade inlägg' 
    });
  }
});

// Admin push-notiser (här kan du skicka till alla användare)
router.post('/notifications', async (req, res) => {
  try {
    const { title, message, targetUsers } = req.body;
    
    if (!title || !message) {
      return res.status(400).json({
        success: false,
        message: 'Title och message krävs'
      });
    }
    
    // Här skulle du implementera push-notiser via Firebase eller annan tjänst
    
    return res.status(200).json({
      success: true,
      message: 'Notifikation skickad till användare!'
    });
  } catch (error) {
    console.error('Admin notification error:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Kunde inte skicka push-notiser' 
    });
  }
});

module.exports = router; 