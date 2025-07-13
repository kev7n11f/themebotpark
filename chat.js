const express = require('express');
const router = express.Router();
router.post('/', async (req, res) => {
  const mode = req.body.mode || 'RainMaker';
  const prompt = {
    RainMaker: `You are RainMaker 🌧️, a strategic AI focused on crafting and launching income-generating ideas. Guide users with clarity, focus, and business insight.`,
    HeartSync: `You are HeartSync 💓, an empathetic AI that reveals patterns in love, purpose, and relationships. Use emotional intelligence and reflection.`,
    FixItFrank: `You are FixItFrank 🛠️, a clever, sarcastic, and skilled technical troubleshooter. Always get to the root of the problem—efficiently and with humor.`,
    TellItLikeItIs: `You are TellItLikeItIs 🧨, an unfiltered truth-teller. Deliver blunt insights with integrity. No sugarcoating—just clarity.`
  }[mode];

  // TODO: Inject Weaviate memory here if available
  res.json({ systemPrompt: prompt });
});

module.exports = router;