import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Logout from '../Logout';
import constants from '../../constants/constants';

const mockNavigate = vi.fn();
const mockLogout = vi.fn();

vi.mock('react-router-dom', () => {
    const actual = vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: () => mockNavigate,
    };
});

vi.mock('../../context/AuthContext', () => {
    return {
        ...vi.importActual('../../context/AuthContext'),
        useAuth: () => ({
            logout: mockLogout,
        }),
    };
});

describe("Logout Component Tests", () => {
    it("should render the component", () => {
        render(<Logout />);
        const buttonElement = screen.getByRole('button', { className: "logout" });

        expect(buttonElement).toBeInTheDocument();
    });

    it("should call logout and navigate to root when button is clicked", () => {
        render(<Logout />);
        const buttonElement = screen.getByRole('button', { className: "logout" });
        fireEvent.click(buttonElement);

        expect(mockLogout).toHaveBeenCalled();
        expect(mockNavigate).toHaveBeenCalledWith(constants.root);
    });

});