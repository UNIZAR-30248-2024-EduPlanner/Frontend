import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import constants from "../../constants/constants";
import Lista from '../Lista';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', () => {
    const actual = vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: () => mockNavigate,
    };
});

const mockStudents = [
    { id: 1, name: 'Student 1', nip: 123456789 },
    { id: 2, name: 'Student 2', nip: 123456789 },
];

describe("Lista Component Tests", () => {
    it("should render the component", () => {
        render(<Lista lista={mockStudents} type="alumnos" creator="Organizacion" />);
        const searchElement = screen.getByPlaceholderText('Búsqueda de alumnos');

        expect(searchElement).toBeInTheDocument();
    });

    it('should filter the list based on search input', () => {
        render(<Lista lista={mockStudents} type="alumnos" creator="Organizacion" />);
        const searchInput = screen.getByPlaceholderText('Búsqueda de alumnos');
        fireEvent.change(searchInput, { target: { value: 'Student 1' } });

        expect(screen.getByText('Student 1')).toBeInTheDocument();
        expect(screen.queryByText('Student 2')).not.toBeInTheDocument();
    });

    it('should navigate correctly when create button is clicked', () => {
        render(<Lista lista={mockStudents} type="alumnos" creator="Organizacion" />);
        const createButton = document.querySelector('.create-button');
        fireEvent.click(createButton);
        
        expect(mockNavigate).toHaveBeenCalledWith(`${constants.root}OrganizacionCrear/alumnos`);
    });

    it('should navigate correctly when edit button is clicked', () => {
        render(<Lista lista={mockStudents} type="alumnos" creator="Organizacion" />);
        const editButtons = document.querySelectorAll('.edit');
        
        // Simulates a click on filtered list edit button 
        fireEvent.click(editButtons[0]);
        expect(mockNavigate).toHaveBeenCalledWith(`${constants.root}OrganizacionModificar/alumnos/1/Student 1/123456789`);

        // Simulates a click on full list edit button 
        fireEvent.click(editButtons[1]);
        expect(mockNavigate).toHaveBeenCalledWith(`${constants.root}OrganizacionModificar/alumnos/2/Student 2/123456789`);
    });
});
