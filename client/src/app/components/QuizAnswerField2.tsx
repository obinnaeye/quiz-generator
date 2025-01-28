import React from 'react';
interface QuizAnswerFieldProps {
  questionType: string;
  index: number;
  onAnswerChange: (index: number, answer: string) => void;
  options: string[]; 
}

const QuizAnswerField: React.FC<QuizAnswerFieldProps> = ({ questionType, index, onAnswerChange, options }) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    onAnswerChange(index, e.target.value);
  };

  if (questionType === 'multichoice') {
    return (
      <div>
        {options.map((option, optionIndex) => (
          <div key={optionIndex}>
            <input
              type="radio"
              name={`question-${index}`} 
              value={option}
              onChange={handleInputChange}
            />
            <label>
              {option}
            </label>
          </div>
        ))}
      </div>
    );
  } else if (questionType === 'true-false') {
    return (
      <div>
        {options.map((option, optionIndex) => (
          <div key={optionIndex}>
            <input
              type="radio"
              name={`question-${index}`} 
              value={option}
              onChange={handleInputChange}
            />
            <label>
              {option}
            </label>
          </div>
        ))}
      </div>
    );
  } else if (questionType === 'open-ended') {
    return (
      <textarea
        rows={4}
        onChange={handleInputChange}
        placeholder="Write your answer here"
      />
    );
  }

  return null;
};

export default QuizAnswerField;
