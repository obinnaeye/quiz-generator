import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import SignUpButton from '../components/SignUpButton';
const { expect, describe, it } = require('@jest/globals');

describe('SignUpButton', () => {
  it('renders the sign-up button', () => {
    render(<SignUpButton />);
    expect(screen.getByRole('button', { name: /sign up/i })).toBeInTheDocument();
  });

  

  it('closes the modal when the modal close button is clicked', () => {
    render(<SignUpButton />);
    const button = screen.getByRole('button', { name: /sign up/i });
    fireEvent.click(button);
    const closeButton = screen.getByRole('button', { name: /×/i });
    fireEvent.click(closeButton);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});
