const Sentiment = require('sentiment');
const sentiment = new Sentiment();
const language = require('@google-cloud/language');
const client = new language.LanguageServiceClient();

const analyzeSentimentLocal = (text) => {
    const result = sentiment.analyze(text);
    return result.score > 0 ? "positive" : result.score < 0 ? "negative" : "neutral";
};

const analyzeSentimentGoogle = async (text) => {
    const document = { content: text, type: 'PLAIN_TEXT' };
    const [result] = await client.analyzeSentiment({ document });
    const score = result.documentSentiment.score;
    return score > 0 ? "positive" : score < 0 ? "negative" : "neutral";
};

module.exports = { analyzeSentimentLocal, analyzeSentimentGoogle };
