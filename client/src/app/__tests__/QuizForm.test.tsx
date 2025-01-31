import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import QuizForm from '../components/QuizForm';


describe('QuizForm', () => {
  test('renders the quiz form with initial state', () => {
    render(<QuizForm />);
    
   
    expect(screen.getByPlaceholderText('Enter question')).toBeInTheDocument(); 
    expect(screen.getByRole('button', { name: /generate quiz/i })).toBeInTheDocument(); 
  });

  test('updates question input on change', () => {
    render(<QuizForm />);
    
    const input = screen.getByPlaceholderText('Enter question'); 
    fireEvent.change(input, { target: { value: 'What is your favorite color?' } });
    
    expect(input).toHaveValue('What is your favorite color?');
  });

  test('generates quiz and updates status', async () => {
    render(<QuizForm />);
    
    const input = screen.getByPlaceholderText('Enter question'); 
    fireEvent.change(input, { target: { value: 'What is your favorite color?' } });
    
    const generateButton = screen.getByRole('button', { name: /generate quiz/i }); 
    fireEvent.click(generateButton);
    
    
    expect(await screen.findByDisplayValue('Quiz generated')).toBeInTheDocument();
  });
});
