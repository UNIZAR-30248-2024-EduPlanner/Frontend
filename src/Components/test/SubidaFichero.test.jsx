import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import SubidaFichero from '../SubidaFichero';

const mockList = vi.fn();
const mockContext = vi.fn();
const mockNavigate = vi.fn();
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
            logout: mockContext,
        }),
    };
});

describe("SubidaFichero Component Tests", () => {
    it("should render the component", () => {
        render(<SubidaFichero type="alumnos" lista={mockList} setLista={(l) => {lista = l}} />);
        const inputElement = document.querySelector(".text-information");

        expect(inputElement).toBeInTheDocument();
    });
});
