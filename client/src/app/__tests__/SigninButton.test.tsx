import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import SignInButton from '../components/SignInButton';


describe('SignInButton', () => {
  it('renders the sign-in button', () => {
    render(<SignInButton />);
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });

  

  it('closes the modal when the modal close button is clicked', () => {
    render(<SignInButton />);
    const button = screen.getByRole('button', { name: /sign in/i });
    fireEvent.click(button);
    const closeButton = screen.getByRole('button', { name: /close/i });
    fireEvent.click(closeButton);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});
