import React, { useState, useEffect } from 'react'
import data from './data.json'

function App() {
  const [statement, setStatement] = useState({ text: '', isFact: false, explanation: '' });
  const [loading, setLoading] = useState(false);
  const [userAnswer, setUserAnswer] = useState<boolean | null>(null);
  const [feedback, setFeedback] = useState<{ isCorrect: boolean; message: string } | null>(null);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [showAnswer, setShowAnswer] = useState(false);
  const [category, setCategory] = useState('all');
  const [categories] = useState(['all', 'science', 'history', 'nature', 'geography', 'food', 'sports', 'entertainment', 'technology']);

  // Massive database of facts and false statements with explanations
  const statements = data.statements;

  // Get a random statement based on selected category
  const getRandomStatement = () => {
    const filteredStatements = category === 'all' 
      ? statements 
      : statements.filter(statement => statement.category === category);

    const randomStatement = filteredStatements[Math.floor(Math.random() * filteredStatements.length)];
    // Ensure explanation is always a string
    return {
      ...randomStatement,
      explanation: randomStatement.explanation ?? ''
    };
  };

  // Get a new statement
  const getNewStatement = () => {
    setLoading(true);
    setUserAnswer(null);
    setFeedback(null);
    setShowAnswer(false);
    
    // Simulate loading
    setTimeout(() => {
      setStatement(getRandomStatement());
      setLoading(false);
    }, 300);
  };

  // Handle user answer
  const handleAnswer = (answer: boolean) => {
    setUserAnswer(answer);
    const isCorrect = answer === statement.isFact;
    
    setFeedback({
      isCorrect,
      message: isCorrect ? 
        "Correct! ✅" : 
        "Incorrect! ❌"
    });
    
    setScore(prev => ({
      correct: prev.correct + (isCorrect ? 1 : 0),
      total: prev.total + 1
    }));
    
    setShowAnswer(true);
  };

  // Reset the game
  const resetGame = () => {
    setScore({ correct: 0, total: 0 });
    getNewStatement();
  };

  // Handle category change
  const handleCategoryChange = (newCategory: string) => {
    setCategory(newCategory);
    getNewStatement();
  };

  // Initialize with a random statement
  useEffect(() => {
    getNewStatement();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-2">Fact or Crap</h1>
        <p className="text-center text-gray-600 mb-4">Test your knowledge! Is this statement true or false?</p>
        
        {/* Category selector */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Category:</label>
          <select 
            className="w-full p-2 border border-gray-300 rounded-md bg-white"
            value={category}
            onChange={(e) => handleCategoryChange(e.target.value)}
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </option>
            ))}
          </select>
        </div>
        
        {/* Score display */}
        <div className="flex justify-between mb-6">
          <div className="text-sm font-medium">
            Score: {score.correct}/{score.total}
          </div>
          <div className="text-sm font-medium">
            {score.total > 0 ? `${Math.round((score.correct / score.total) * 100)}%` : '0%'} correct
          </div>
        </div>
        
        {/* Statement display */}
        <div className="bg-gray-50 p-6 rounded-lg mb-6 min-h-40 flex items-center justify-center">
          {loading ? (
            <div className="animate-pulse flex space-x-4">
              <div className="flex-1 space-y-4 py-1">
                <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                <div className="h-4 bg-gray-300 rounded"></div>
                <div className="h-4 bg-gray-300 rounded w-5/6"></div>
              </div>
            </div>
          ) : (
            <p className="text-lg text-center">{statement.text}</p>
          )}
        </div>
        
        {/* Answer buttons */}
        {!showAnswer ? (
          <div className="flex justify-center space-x-4 mb-6">
            <button 
              onClick={() => handleAnswer(true)}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold cursor-pointer py-3 px-6 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105"
              disabled={loading || userAnswer !== null}
            >
              Fact ✓
            </button>
            <button 
              onClick={() => handleAnswer(false)}
              className="bg-red-500 hover:bg-red-600 text-white font-bold cursor-pointer py-3 px-6 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105"
              disabled={loading || userAnswer !== null}
            >
              Crap ✗
            </button>
          </div>
        ) : (
          <div className="mb-6">
            {/* Feedback section */}
            {feedback && (
              <div className={`p-4 mb-4 rounded-lg ${feedback.isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                <p className="font-bold text-center">{feedback.message}</p>
                <p className="text-center mt-2">
                  This statement is <span className="font-bold">{statement.isFact ? 'TRUE (Fact)' : 'FALSE (Crap)'}</span>
                </p>
                
                {/* Show explanation for false statements */}
                {!statement.isFact && statement.explanation && (
                  <div className="mt-3 p-3 bg-white rounded-lg">
                    <p className="text-sm font-semibold">The truth:</p>
                    <p className="text-sm mt-1">{statement.explanation}</p>
                  </div>
                )}
              </div>
            )}
            
            {/* Next question button */}
            <div className="flex justify-center">
              <button 
                onClick={getNewStatement}
                className="bg-green-500 hover:bg-green-600 text-white font-bold cursor-pointer py-3 px-6 rounded-lg shadow-md transition duration-300 ease-in-out"
              >
                Next Question
              </button>
            </div>
          </div>
        )}
        
        {/* Reset game button */}
        {score.total > 0 && (
          <div className="flex justify-center mt-4">
            <button 
              onClick={resetGame}
              className="text-sm text-gray-600 hover:text-gray-900 underline"
            >
              Reset Game
            </button>
          </div>
        )}
      </div>
      
      <div className="mt-4 text-sm text-gray-600 text-center">
        <p>Database contains over 100 facts and misconceptions across various categories.</p>
      </div>
    </div>
  );
}

export default App
