import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';

test('renders the peer-to-peer network header', () => {
    render(<App />);
    const headerElement = screen.getByText(/Peer-to-Peer Trading Card Network/i);
    expect(headerElement).toBeInTheDocument();
});

test('adds a new card when form is submitted', () => {
    render(<App />);
    const inputElement = screen.getByPlaceholderText('Add new card');
    const buttonElement = screen.getByText('Add Card');
    fireEvent.change(inputElement, { target: { value: 'New Card' } });
    fireEvent.click(buttonElement);
    const newCardElement = screen.getByText('New Card');
    expect(newCardElement).toBeInTheDocument();
});
