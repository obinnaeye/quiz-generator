import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import SignInModal from '../components/SignInModal';




describe('SignInModal', () => {
  const mockOnClose = jest.fn();

  beforeEach(() => {
    mockOnClose.mockClear(); 
  });

  test('renders the modal when isOpen is true', () => {
    render(<SignInModal isOpen={true} onClose={mockOnClose} />);
    
    
    expect(screen.getByRole('heading', { name: /sign in/i })).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter username or email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /close/i })).toBeInTheDocument();
  });

  test('does not render the modal when isOpen is false', () => {
    render(<SignInModal isOpen={false} onClose={mockOnClose} />);
    
    expect(screen.queryByRole('heading', { name: /sign in/i })).not.toBeInTheDocument();
  });

  test('updates input fields on change', () => {
    render(<SignInModal isOpen={true} onClose={mockOnClose} />);
    
    const usernameInput = screen.getByPlaceholderText('Enter username or email');
    const passwordInput = screen.getByPlaceholderText('Enter password');

    fireEvent.change(usernameInput, { target: { value: 'testuser@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    expect(usernameInput).toHaveValue('testuser@example.com');
    expect(passwordInput).toHaveValue('password123');
  });

  test('calls onClose when form is submitted', () => {
    render(<SignInModal isOpen={true} onClose={mockOnClose} />);
    
    const usernameInput = screen.getByPlaceholderText('Enter username or email');
    const passwordInput = screen.getByPlaceholderText('Enter password');
    const signInButton = screen.getByRole('button', { name: /sign in/i });

    
    fireEvent.change(usernameInput, { target: { value: 'testuser@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    
    fireEvent.click(signInButton);

    
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  test('calls onClose when close button is clicked', () => {
    render(<SignInModal isOpen={true} onClose={mockOnClose} />);

    const closeButton = screen.getByRole('button', { name: /close/i });
    
    
    fireEvent.click(closeButton);

    
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });
});
