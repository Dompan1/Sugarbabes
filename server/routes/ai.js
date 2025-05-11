const express = require('express');
const claudeService = require('../services/ai');
const { User, Message, Post } = require('../models');
const { premiumRateLimit } = require('../middleware/auth');
const router = express.Router();

// Rate limiting för AI-funktioner
// Standardanvändare: 5 requests per 30 min, Premium: 20 requests per 30 min
const aiRateLimit = premiumRateLimit(5, 20);
router.use(aiRateLimit);

// Generera chattsvar
router.post('/generate-reply', async (req, res) => {
  try {
    const { chatId, messageHistory } = req.body;
    const userId = req.user.id;

    if (!chatId || !messageHistory) {
      return res.status(400).json({
        success: false,
        message: 'Saknar chatId eller messageHistory i begäran'
      });
    }

    // Hämta användare för att anpassa AI-svaret
    const user = await User.findByIdSafe(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Användaren hittades inte'
      });
    }

    // Generera svar från Claude
    const aiReply = await claudeService.generateChatReply(user, messageHistory);

    // Spara meddelandet i databasen
    const savedMessage = await Message.create({
      sender_id: chatId, // Bot-ID/profil-ID
      receiver_id: userId,
      content: aiReply,
      is_ai_generated: true,
      is_premium: req.user.isPremium
    });

    return res.status(200).json({
      success: true,
      message: 'AI-svar genererat',
      reply: {
        id: savedMessage.id,
        content: aiReply,
        sent_at: savedMessage.sent_at
      }
    });
  } catch (error) {
    console.error('AI reply generation error:', error);
    return res.status(500).json({
      success: false,
      message: 'Fan, kunde inte generera AI-svar just nu'
    });
  }
});

// Generera inläggsinnehåll
router.post('/generate-post', async (req, res) => {
  try {
    const { topic } = req.body;
    const userId = req.user.id;

    if (!topic) {
      return res.status(400).json({
        success: false,
        message: 'Ämne för inlägget saknas'
      });
    }

    // Kolla om användaren är premium
    if (!req.user.isPremium) {
      return res.status(403).json({
        success: false,
        message: 'Fan, du behöver premium för denna funktion'
      });
    }

    // Generera innehåll för inlägget
    const postContent = await claudeService.generatePostContent(topic);

    // Spara inlägget i databasen
    const post = await Post.create({
      user_id: userId,
      content: postContent.content,
      is_ai_generated: true,
      is_premium: true
    });

    return res.status(200).json({
      success: true,
      message: 'AI-inlägg genererat',
      post: {
        id: post.id,
        content: postContent.content,
        imagePrompt: postContent.imagePrompt,
        created_at: post.created_at
      }
    });
  } catch (error) {
    console.error('AI post generation error:', error);
    return res.status(500).json({
      success: false,
      message: 'Fan, kunde inte generera AI-inlägg just nu'
    });
  }
});

// AI-förbättring av användarprofil
router.post('/enhance-profile', async (req, res) => {
  try {
    const { bio } = req.body;
    const userId = req.user.id;

    if (!bio) {
      return res.status(400).json({
        success: false,
        message: 'Bio-text saknas för förbättring'
      });
    }

    // Begränsa denna funktion till premium-användare
    if (!req.user.isPremium) {
      return res.status(403).json({
        success: false,
        message: 'Endast tillgängligt för premium-användare'
      });
    }

    // Anpassa systemprompten för profilförbättring
    const systemPrompt = `
      Du är en expert på att hjälpa till att förbättra datingprofiler.
      Ta användarens bio-text och förbättra den så att den:
      - Är mer engagerande och personlig
      - Framhäver personens unika kvaliteter
      - Inte är för lång (max 300 tecken)
      - Behåller den ursprungliga tonen och personligheten
      - Är skriven på samma språk som originaltexten
      
      Du ska BARA returnera den förbättrade profiltexten, inga förklaringar eller annat.
    `;

    // Skicka bio-texten för förbättring
    const enhancedBio = await claudeService.generateResponse(bio, systemPrompt, 0.6);

    return res.status(200).json({
      success: true,
      message: 'Profiltext förbättrad',
      enhancedBio: enhancedBio.trim()
    });
  } catch (error) {
    console.error('Profile enhancement error:', error);
    return res.status(500).json({
      success: false,
      message: 'Kunde inte förbättra profiltexten just nu'
    });
  }
});

// Få förslag på icebreakers/chattöppnare
router.post('/icebreakers', async (req, res) => {
  try {
    const { targetUserId, targetProfile } = req.body;
    
    if (!targetUserId && !targetProfile) {
      return res.status(400).json({
        success: false,
        message: 'Målprofil måste anges'
      });
    }

    // Hämta profilinformation om det bara skickades med användar-ID
    let profileInfo = targetProfile;
    if (targetUserId && !targetProfile) {
      const user = await User.findByPk(targetUserId, {
        include: [{ model: Profile }]
      });
      if (user && user.Profile) {
        profileInfo = user.Profile;
      }
    }

    // Anpassa systemprompten för icebreakers
    const systemPrompt = `
      Generera 3 icebreakers (chattöppnare) som kan användas för att starta en 
      konversation med en person på en datingapp. Icebreakers ska vara:
      
      - Personliga och baserade på profilinformationen
      - Engagerande och intresseväckande
      - Roliga utan att vara för flörtiga eller påträngande
      - Formulerade som frågor som uppmuntrar till svar
      
      Svara i JSON-format med följande struktur:
      {
        "icebreakers": [
          "Första förslaget",
          "Andra förslaget",
          "Tredje förslaget"
        ]
      }
      
      Profilinformation:
      ${profileInfo ? JSON.stringify(profileInfo) : "Ingen profilinformation tillgänglig"}
    `;

    // Generera icebreakers
    const result = await claudeService.generateResponse("Ge mig icebreakers baserat på profilen", systemPrompt, 0.8);
    
    try {
      const parsedResult = JSON.parse(result);
      return res.status(200).json({
        success: true,
        icebreakers: parsedResult.icebreakers
      });
    } catch (e) {
      // Om parsing misslyckas, skicka tillbaka råtexten
      return res.status(200).json({
        success: true,
        icebreakers: [result]
      });
    }
  } catch (error) {
    console.error('Icebreakers generation error:', error);
    return res.status(500).json({
      success: false,
      message: 'Kunde inte generera chattöppnare just nu'
    });
  }
});

module.exports = router; 