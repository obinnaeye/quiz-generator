import { QuizAnswerFieldProps } from '../../interfaces/props';
import React from 'react';



const QuizAnswerField: React.FC<QuizAnswerFieldProps> = ({ questionType, index, onAnswerChange, options }) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    let answerValue: string | number = e.target.value;

    // Convert true/false to binary (1 for "true", 0 for "false")
    if (questionType === "true-false") {
      answerValue = answerValue === "true" ? 1 : 0;  // Return 1 for true and 0 for false as integers
    }

    onAnswerChange(index, answerValue);  // Pass the correct value to parent
  };

  if (questionType === 'multichoice') {
    return (
      <div>
        {options?.map((option, optionIndex) => (
          <div key={optionIndex}>
            <input
              type="radio"
              name={`question-${index}`}
              value={option}
              onChange={handleInputChange}
            />
            <label>{option}</label>
          </div>
        ))}
      </div>
    );
  } else if (questionType === 'true-false') {
    return (
      <div>
        {options?.map((option, optionIndex) => (
          <div key={optionIndex}>
            <input
              type="radio"
              name={`question-${index}`}
              value={option}
              onChange={handleInputChange}
            />
            <label>{option}</label>
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
