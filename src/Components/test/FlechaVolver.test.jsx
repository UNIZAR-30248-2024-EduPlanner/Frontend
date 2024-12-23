import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import FlechaVolver from '../FlechaVolver';
import { AuthProvider } from '../../context/AuthContext';

const navigateMock = vi.fn();
vi.mock('react-router-dom', () => ({
    useNavigate: () => navigateMock,
}));

describe("FlechaVolver Component Tests", () => {
    it("should render the component", () => {
        render(            
            <AuthProvider>
                <FlechaVolver />
            </AuthProvider>
        );
        const buttonElement = screen.getByRole("button");
        
        expect(buttonElement).toBeInTheDocument();
    });

    it("should navigate back when button is clicked", () => {
        render(            
            <AuthProvider>
                <FlechaVolver />
            </AuthProvider>
        );
        const buttonElement = screen.getByRole("button");
        fireEvent.click(buttonElement);

        expect(navigateMock).toHaveBeenCalledWith(-1);
    });
});
