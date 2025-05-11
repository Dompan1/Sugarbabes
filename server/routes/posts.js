const express = require('express');
const { User, Post, Profile } = require('../models');
const { Op } = require('sequelize');
const router = express.Router();

// Hämta inläggsflöde
router.get('/feed', async (req, res) => {
  try {
    const userId = req.user.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    
    // Bygg where-villkor baserat på premium-status
    const whereClause = {
      // Visa alla offentliga inlägg
      [Op.or]: [
        { is_premium: false },
        // Visa premium-inlägg om användaren har premium
        req.user.isPremium ? { is_premium: true } : null
      ].filter(Boolean) // Filtrera bort null-värden
    };
    
    // Hämta inlägg och skribenter med paginering
    const posts = await Post.findAndCountAll({
      where: whereClause,
      limit,
      offset,
      order: [['created_at', 'DESC']],
      include: [{
        model: User,
        attributes: ['id', 'name', 'is_premium'],
        include: [{
          model: Profile,
          attributes: ['avatar_url', 'display_name']
        }]
      }]
    });
    
    // Formatera svaret
    const formattedPosts = posts.rows.map(post => ({
      id: post.id,
      content: post.content,
      image_url: post.image_url,
      created_at: post.created_at,
      is_premium: post.is_premium,
      likes_count: post.likes_count,
      comments_count: post.comments_count,
      author: {
        id: post.User.id,
        name: post.User.name,
        isPremium: post.User.is_premium,
        avatar: post.User.Profile ? post.User.Profile.avatar_url : null,
        displayName: post.User.Profile ? post.User.Profile.display_name : post.User.name
      }
    }));
    
    return res.status(200).json({
      success: true,
      totalPosts: posts.count,
      totalPages: Math.ceil(posts.count / limit),
      currentPage: page,
      posts: formattedPosts
    });
  } catch (error) {
    console.error('Get feed error:', error);
    return res.status(500).json({
      success: false,
      message: 'Helvete, något gick fel vid hämtning av inläggsflöde'
    });
  }
});

// Skapa nytt inlägg
router.post('/', async (req, res) => {
  try {
    const userId = req.user.id;
    const { content, image_url, is_premium } = req.body;
    
    if (!content && !image_url) {
      return res.status(400).json({
        success: false,
        message: 'Fan, ett inlägg måste innehålla text eller bild'
      });
    }
    
    // Kolla om användaren försöker skapa ett premium-inlägg utan premium
    if (is_premium && !req.user.isPremium) {
      return res.status(403).json({
        success: false,
        message: 'Fan, du måste ha premium för att skapa premium-inlägg'
      });
    }
    
    // Skapa inlägget
    const post = await Post.create({
      user_id: userId,
      content: content || '',
      image_url: image_url || null,
      is_premium: is_premium || false,
      is_ai_generated: false
    });
    
    // Hämta användare för att returnera författarinfo
    const user = await User.findByIdSafe(userId);
    const profile = await Profile.findOne({ where: { user_id: userId } });
    
    return res.status(201).json({
      success: true,
      message: 'Inlägget skapat!',
      post: {
        id: post.id,
        content: post.content,
        image_url: post.image_url,
        created_at: post.created_at,
        is_premium: post.is_premium,
        author: {
          id: user.id,
          name: user.name,
          isPremium: user.is_premium,
          avatar: profile ? profile.avatar_url : null,
          displayName: profile ? profile.display_name : user.name
        }
      }
    });
  } catch (error) {
    console.error('Create post error:', error);
    return res.status(500).json({
      success: false,
      message: 'Helvete, något gick fel vid skapande av inlägg'
    });
  }
});

// Hämta specifikt inlägg med kommentarer
router.get('/:id', async (req, res) => {
  try {
    const postId = req.params.id;
    
    // Hämta inlägget
    const post = await Post.findByPk(postId, {
      include: [{
        model: User,
        attributes: ['id', 'name', 'is_premium'],
        include: [{
          model: Profile,
          attributes: ['avatar_url', 'display_name']
        }]
      }]
    });
    
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Inlägget hittades inte'
      });
    }
    
    // Kontrollera om användaren får se premium-inlägg
    if (post.is_premium && !req.user.isPremium) {
      return res.status(403).json({
        success: false,
        message: 'Detta inlägg är endast tillgängligt för premium-användare'
      });
    }
    
    // Här skulle man hämta kommentarer om vi hade en Comment-modell
    
    return res.status(200).json({
      success: true,
      post: {
        id: post.id,
        content: post.content,
        image_url: post.image_url,
        created_at: post.created_at,
        is_premium: post.is_premium,
        likes_count: post.likes_count,
        comments_count: post.comments_count,
        author: {
          id: post.User.id,
          name: post.User.name,
          isPremium: post.User.is_premium,
          avatar: post.User.Profile ? post.User.Profile.avatar_url : null,
          displayName: post.User.Profile ? post.User.Profile.display_name : post.User.name
        },
        comments: [] // Tom array tills vi har en Comment-modell
      }
    });
  } catch (error) {
    console.error('Get post error:', error);
    return res.status(500).json({
      success: false,
      message: 'Helvete, något gick fel vid hämtning av inlägg'
    });
  }
});

// Ta bort inlägg
router.delete('/:id', async (req, res) => {
  try {
    const userId = req.user.id;
    const postId = req.params.id;
    
    // Hitta inlägget
    const post = await Post.findByPk(postId);
    
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Inlägget hittades inte'
      });
    }
    
    // Kontrollera att användaren äger inlägget eller är admin
    if (post.user_id !== userId && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Fan, du kan bara ta bort dina egna inlägg'
      });
    }
    
    // Ta bort inlägget
    await post.destroy();
    
    return res.status(200).json({
      success: true,
      message: 'Inlägget har tagits bort'
    });
  } catch (error) {
    console.error('Delete post error:', error);
    return res.status(500).json({
      success: false,
      message: 'Helvete, något gick fel vid borttagning av inlägg'
    });
  }
});

// Gilla ett inlägg
router.post('/:id/like', async (req, res) => {
  try {
    const postId = req.params.id;
    
    // Hitta inlägget
    const post = await Post.findByPk(postId);
    
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Inlägget hittades inte'
      });
    }
    
    // Kontrollera om användaren får se premium-inlägg
    if (post.is_premium && !req.user.isPremium) {
      return res.status(403).json({
        success: false,
        message: 'Fan, detta inlägg är endast tillgängligt för premium-användare'
      });
    }
    
    // Öka likes_count (här skulle man egentligen spara en koppling user <-> post)
    post.likes_count += 1;
    await post.save();
    
    return res.status(200).json({
      success: true,
      message: 'Inlägget gillat!',
      likesCount: post.likes_count
    });
  } catch (error) {
    console.error('Like post error:', error);
    return res.status(500).json({
      success: false,
      message: 'Helvete, något gick fel vid gillande av inlägg'
    });
  }
});

module.exports = router; 