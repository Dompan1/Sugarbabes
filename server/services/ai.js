const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config();

/**
 * Claude AI Integration service
 * Hanterar all kommunikation med Claude AI API
 */
class ClaudeService {
  constructor() {
    this.apiKey = process.env.CLAUDE_API_KEY;
    this.apiUrl = process.env.CLAUDE_API_URL || 'https://api.anthropic.com/v1/messages';
    this.model = process.env.CLAUDE_MODEL || 'claude-3-5-sonnet-20240620';
    this.maxTokens = parseInt(process.env.CLAUDE_MAX_TOKENS) || 1024;
  }

  /**
   * Genererar ett svar från Claude baserat på prompt
   * @param {string} prompt - Användarens prompt/meddelande
   * @param {string} systemPrompt - System prompt för att styra Claude
   * @param {number} temperature - Kreativitet (0-1), högre = mer kreativ
   * @returns {Promise<string>} Claude's svar
   */
  async generateResponse(prompt, systemPrompt = null, temperature = 0.7) {
    try {
      // Grundläggande systemprompt som beskriver Claudes roll
      const defaultSystemPrompt = `
        Du är en AI-assistent på en dejting/flirtplattform som heter Sugarbabes. 
        Du spelar rollen av en suggestiv, lekfull men respektfull profil.
        Du ska svara på ett sätt som är engagerande och kul, men aldrig kränkande.
        Svara som en verklig person skulle göra i en flörtig konversation.
        
        Svara alltid på svenska oavsett vilket språk användaren använder.
        Var kreativ, lättsam och lekfull men alltid respektfull.
      `;

      const response = await axios.post(
        this.apiUrl,
        {
          model: this.model,
          max_tokens: this.maxTokens,
          temperature: temperature,
          system: systemPrompt || defaultSystemPrompt,
          messages: [
            { role: 'user', content: prompt }
          ]
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': this.apiKey,
            'anthropic-version': '2023-06-01'
          }
        }
      );

      return response.data.content[0].text;
    } catch (error) {
      console.error('Claude API Error:', error.response?.data || error.message);
      throw new Error('Kunde inte generera AI-svar: ' + (error.response?.data?.error?.message || error.message));
    }
  }

  /**
   * Genererar ett profilsvar för en chatt
   * @param {object} user - Användare som får meddelandet
   * @param {array} chatHistory - Tidigare chatthistorik
   * @returns {Promise<string>} AI-genererat chattsvar
   */
  async generateChatReply(user, chatHistory) {
    try {
      // Anpassa system prompt baserat på användarens profil
      const systemPrompt = `
        Du är en virtuell profil på dejtingappen Sugarbabes.
        Du svarar som om du vore en verklig person som kommunicerar med ${user.name}.
        
        Personinformation om profilen du spelar:
        - Kön: Kvinna
        - Ålder: 25-30
        - Personlighet: Lekfull, intelligent, flörtig
        
        Stilen på dina svar ska vara:
        - Svara alltid på svenska
        - Var personlig och relaterbar
        - Lägg till lite mysterium och lekfullhet
        - Håll svaren korta och intressanta (1-3 meningar)
        - Ställ ibland motfrågor för att uppmuntra dialog
        - Använd aldrig emoji-symboler
        
        Tidigare chatthistorik:
        ${chatHistory.map(msg => `${msg.sender === 'user' ? user.name : 'Profil'}: ${msg.content}`).join('\n')}
      `;

      // Extrahera användarens senaste meddelande från chatthistorik
      const lastUserMessage = chatHistory.filter(msg => msg.sender === 'user').pop()?.content || '';
      
      return await this.generateResponse(lastUserMessage, systemPrompt, 0.8);
    } catch (error) {
      console.error('Generate chat reply error:', error);
      return "Fan, mitt svar försvann. Kan du skriva igen?";
    }
  }
  
  /**
   * Genererar innehåll för ett flödesinlägg
   * @param {string} topic - Ämne att generera innehåll om
   * @returns {Promise<object>} Inläggsinnehåll och bild-prompt
   */
  async generatePostContent(topic) {
    try {
      const systemPrompt = `
        Du är en kreativ innehållsskapare på en datingsajt som heter Sugarbabes.
        Generera ett inlägg som skulle vara intressant i en social feed.
        
        Formatet på ditt svar ska vara JSON med följande struktur:
        {
          "content": "Texten till inlägget",
          "imagePrompt": "En beskrivning som kan användas för att generera en bild"
        }
        
        Texten ska:
        - Vara på svenska
        - Vara 1-3 meningar
        - Vara lättsam och personlig
        - Passa ämnet: ${topic}
        - Inte innehålla hashtags eller emojis
      `;
      
      const response = await this.generateResponse(`Skapa ett inlägg om "${topic}"`, systemPrompt, 0.7);
      
      // Försök tolka JSON-svaret
      try {
        return JSON.parse(response);
      } catch (e) {
        console.error('Failed to parse JSON from AI response:', e);
        // Fallback om parsing misslyckas
        return {
          content: response.substring(0, 280),
          imagePrompt: `Image related to ${topic}`
        };
      }
    } catch (error) {
      console.error('Generate post content error:', error);
      return {
        content: `Tänkte dela något om ${topic} men fick slut på idéer. Vad tycker ni?`,
        imagePrompt: `Simple image about ${topic}`
      };
    }
  }
}

module.exports = new ClaudeService(); 