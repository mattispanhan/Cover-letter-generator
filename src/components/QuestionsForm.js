const QuestionsForm = ({ answers, updateAnswers }) => {
  const questions = [
    {
      id: 'motivation',
      question: 'What specifically attracts you to this role and company?',
      required: true
    },
    {
      id: 'relevant_experience',
      question: 'Which of your experiences is most relevant to this position?',
      required: true
    },
    {
      id: 'unique_value',
      question: 'What unique value would you bring to this role?',
      required: true
    },
    {
      id: 'challenges',
      question: 'What challenges in this role are you most excited to tackle?',
      required: false
    },
    {
      id: 'growth',
      question: 'How does this position align with your career goals?',
      required: false
    }
  ];

  const handleAnswerChange = (questionId, answer) => {
    updateAnswers({
      ...answers,
      [questionId]: answer
    });
  };

  return (
    <div>
      <h2>Personalization Questions</h2>
      <p style={{ marginBottom: '20px', color: '#666' }}>
        Help us craft a personalized cover letter by answering these questions:
      </p>
      
      {questions.map((question) => (
        <div key={question.id} style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>
            {question.question}
            {question.required && <span style={{ color: 'red' }}> *</span>}
          </label>
          <textarea
            value={answers[question.id] || ''}
            onChange={(e) => handleAnswerChange(question.id, e.target.value)}
            style={{ 
              width: '100%', 
              height: '80px', 
              padding: '8px',
              resize: 'vertical'
            }}
            placeholder="Your answer..."
          />
        </div>
      ))}
    </div>
  );
};

export default QuestionsForm;