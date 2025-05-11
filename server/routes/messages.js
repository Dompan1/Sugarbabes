const express = require('express');
const { User, Message, Profile } = require('../models');
const { Op } = require('sequelize');
const router = express.Router();

// Hämta meddelande-konversationer
router.get('/conversations', async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Hitta alla unika användare som användaren har chattat med
    const conversations = await Message.findAll({
      attributes: [
        [sequelize.fn('DISTINCT', sequelize.col('receiver_id')), 'userId'],
        [sequelize.fn('MAX', sequelize.col('sent_at')), 'lastMessageTime']
      ],
      where: {
        [Op.or]: [
          { sender_id: userId },
          { receiver_id: userId }
        ]
      },
      group: [
        sequelize.literal(`
          CASE
            WHEN sender_id = '${userId}' THEN receiver_id
            ELSE sender_id
          END
        `)
      ],
      order: [[sequelize.literal('lastMessageTime'), 'DESC']]
    });
    
    // Extrahera unika användar-IDn
    const userIds = conversations.map(conv => {
      // Bestäm om user_id är sender_id eller receiver_id
      return conv.sender_id === userId ? conv.receiver_id : conv.sender_id;
    });
    
    // Hämta användare och deras profiler
    const users = await User.findAll({
      attributes: ['id', 'name', 'is_premium'],
      where: { id: userIds },
      include: [{ model: Profile }]
    });
    
    // Hämta senaste meddelandet och olästa meddelanden för varje konversation
    const detailedConversations = await Promise.all(
      userIds.map(async (otherUserId) => {
        // Hämta senaste meddelandet
        const lastMessage = await Message.findOne({
          where: {
            [Op.or]: [
              { sender_id: userId, receiver_id: otherUserId },
              { sender_id: otherUserId, receiver_id: userId }
            ]
          },
          order: [['sent_at', 'DESC']]
        });
        
        // Räkna olästa meddelanden
        const unreadCount = await Message.count({
          where: {
            sender_id: otherUserId,
            receiver_id: userId,
            is_read: false
          }
        });
        
        // Hitta användare i users array
        const user = users.find(u => u.id === otherUserId);
        
        return {
          id: otherUserId,
          name: user ? user.name : 'Okänd användare',
          avatar: user && user.Profile ? user.Profile.avatar_url : null,
          lastMessage: lastMessage ? {
            content: lastMessage.content,
            sent_at: lastMessage.sent_at,
            is_read: lastMessage.is_read,
            is_mine: lastMessage.sender_id === userId
          } : null,
          unreadCount
        };
      })
    );
    
    return res.status(200).json({
      success: true,
      conversations: detailedConversations
    });
  } catch (error) {
    console.error('Get conversations error:', error);
    return res.status(500).json({
      success: false,
      message: 'Helvete, något gick fel vid hämtning av konversationer'
    });
  }
});

// Hämta meddelanden för en specifik konversation
router.get('/:userId', async (req, res) => {
  try {
    const currentUserId = req.user.id;
    const otherUserId = req.params.userId;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;
    
    // Verifiera att användaren finns
    const otherUser = await User.findByPk(otherUserId, {
      attributes: ['id', 'name', 'is_premium'],
      include: [{ model: Profile }]
    });
    
    if (!otherUser) {
      return res.status(404).json({
        success: false,
        message: 'Användaren hittades inte'
      });
    }
    
    // Hämta meddelanden mellan användarna
    const messages = await Message.findAndCountAll({
      where: {
        [Op.or]: [
          { sender_id: currentUserId, receiver_id: otherUserId },
          { sender_id: otherUserId, receiver_id: currentUserId }
        ]
      },
      limit,
      offset,
      order: [['sent_at', 'DESC']] // Nyaste först
    });
    
    // Markera olästa meddelanden som lästa
    await Message.update(
      { 
        is_read: true,
        read_at: new Date()
      },
      {
        where: {
          sender_id: otherUserId,
          receiver_id: currentUserId,
          is_read: false
        }
      }
    );
    
    // Formatera svar
    const formattedMessages = messages.rows.map(msg => ({
      id: msg.id,
      content: msg.content,
      sent_at: msg.sent_at,
      is_read: msg.is_read,
      read_at: msg.read_at,
      is_mine: msg.sender_id === currentUserId,
      is_ai_generated: msg.is_ai_generated,
      attachment_url: msg.attachment_url
    }));
    
    return res.status(200).json({
      success: true,
      conversation: {
        user: {
          id: otherUser.id,
          name: otherUser.name,
          isPremium: otherUser.is_premium,
          avatar: otherUser.Profile ? otherUser.Profile.avatar_url : null,
          displayName: otherUser.Profile ? otherUser.Profile.display_name : otherUser.name
        },
        totalMessages: messages.count,
        totalPages: Math.ceil(messages.count / limit),
        currentPage: page,
        messages: formattedMessages
      }
    });
  } catch (error) {
    console.error('Get messages error:', error);
    return res.status(500).json({
      success: false,
      message: 'Helvete, något gick fel vid hämtning av meddelanden'
    });
  }
});

// Skicka ett nytt meddelande
router.post('/:userId', async (req, res) => {
  try {
    const senderId = req.user.id;
    const receiverId = req.params.userId;
    const { content, attachment_url } = req.body;
    
    if (!content && !attachment_url) {
      return res.status(400).json({
        success: false,
        message: 'Meddelande eller bifogad fil krävs'
      });
    }
    
    // Verifiera att mottagaren finns
    const receiver = await User.findByPk(receiverId);
    if (!receiver) {
      return res.status(404).json({
        success: false,
        message: 'Mottagaren hittades inte'
      });
    }
    
    // Skapa meddelandet
    const message = await Message.create({
      sender_id: senderId,
      receiver_id: receiverId,
      content: content || '',
      attachment_url,
      is_ai_generated: false
    });
    
    return res.status(201).json({
      success: true,
      message: {
        id: message.id,
        content: message.content,
        sent_at: message.sent_at,
        is_read: message.is_read,
        is_mine: true,
        attachment_url: message.attachment_url
      }
    });
  } catch (error) {
    console.error('Send message error:', error);
    return res.status(500).json({
      success: false,
      message: 'Helvete, något gick fel vid skickande av meddelande'
    });
  }
});

// Ta bort ett meddelande (endast egna meddelanden)
router.delete('/:messageId', async (req, res) => {
  try {
    const userId = req.user.id;
    const messageId = req.params.messageId;
    
    // Hitta meddelandet
    const message = await Message.findByPk(messageId);
    
    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Meddelandet hittades inte'
      });
    }
    
    // Kontrollera att användaren äger meddelandet
    if (message.sender_id !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Helvete, du kan bara ta bort dina egna meddelanden'
      });
    }
    
    // Ta bort meddelandet
    await message.destroy();
    
    return res.status(200).json({
      success: true,
      message: 'Meddelandet har tagits bort'
    });
  } catch (error) {
    console.error('Delete message error:', error);
    return res.status(500).json({
      success: false,
      message: 'Helvete, något gick fel vid borttagning av meddelande'
    });
  }
});

module.exports = router; 