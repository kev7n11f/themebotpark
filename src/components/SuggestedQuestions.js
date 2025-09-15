import React from 'react';
import './SuggestedQuestions.css';

const SuggestedQuestions = ({ botId, onQuestionClick }) => {
  const suggestedQuestions = {
    RainMaker: [
      "How can I validate my business idea?",
      "What are some low-cost marketing strategies?",
      "How do I price my product or service?",
      "What's the best way to find my target audience?"
    ],
    HeartSync: [
      "How do I improve communication in my relationships?",
      "What are the signs of a healthy relationship?",
      "How can I understand my emotional patterns better?",
      "What does it mean to love myself?"
    ],
    FixItFrank: [
      "My computer is running slowly, what should I check?",
      "How do I backup my important files?",
      "What's the best way to secure my passwords?",
      "Why is my internet connection unstable?"
    ],
    TellItLikeItIs: [
      "What am I avoiding that I need to face?",
      "How can I be more honest with myself?",
      "What's holding me back from success?",
      "What uncomfortable truth do I need to hear?"
    ],
    SafeSpace: [
      "How can I resolve conflict without hurting feelings?",
      "What's the best way to have a difficult conversation?",
      "How do I understand someone's perspective better?",
      "How can I create more peace in my relationships?"
    ],
    CreativeCanvas: [
      "How can I overcome creative block?",
      "What are some new creative techniques to try?",
      "How do I find my unique artistic style?",
      "What inspires creativity and innovation?"
    ],
    WellnessWise: [
      "How can I manage stress better?",
      "What are some simple mindfulness practices?",
      "How do I create a better work-life balance?",
      "What does self-care mean for me?"
    ]
  };

  const questions = suggestedQuestions[botId] || suggestedQuestions.RainMaker;

  return (
    <div className="suggested-questions">
      <div className="suggested-questions-header">
        <span>💬 Try asking about:</span>
      </div>
      <div className="questions-grid">
        {questions.map((question, index) => (
          <button
            key={index}
            className="question-button"
            onClick={() => onQuestionClick(question)}
            title={`Ask: ${question}`}
          >
            {question}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SuggestedQuestions;