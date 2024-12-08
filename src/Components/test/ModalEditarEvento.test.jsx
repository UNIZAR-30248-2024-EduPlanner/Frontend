import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ModalEditarEvento from '../ModalEditarEvento';
import { AuthProvider } from '../../context/AuthContext'; // Import AuthProvider

const mockUseAuth = {
    user: { id: 'user123' }
};

vi.mock("../../context/AuthContext", async (importOriginal) => {
    const actual = await importOriginal();
    return {
        ...actual,
        useAuth: () => mockUseAuth
    };
});

describe('ModalEditarEvento', () => {
    const defaultProps = {
        isOpen: true,
        onOpenChange: vi.fn(),
        title: 'Edit Event',
        event: {
            id: 'event123',
            date_start: '2023-11-01',
            date_finish: '2023-11-02',
            place: 'Test Place',
            group: 'Test Group',
            descripcion: 'Test Description',
            creador: 'user123',
            type: 'Test Type',
            date: '2023-11-01'
        }
    };

    it('should render the modal with correct title', () => {
        render(
            <AuthProvider>
                <ModalEditarEvento {...defaultProps} />
            </AuthProvider>
        );

        expect(screen.getByText('Modificar evento')).toBeTruthy();
    });

    it('should call onOpenChange when the modal is closed', () => {
        render(
            <AuthProvider>
                <ModalEditarEvento {...defaultProps} />
            </AuthProvider>
        );

        fireEvent.click(screen.getByRole('button', { name: /close/i }));
        expect(defaultProps.onOpenChange).toHaveBeenCalled();
    });

    it('should update the input values when changed', () => {
        render(
            <AuthProvider>
                <ModalEditarEvento {...defaultProps} />
            </AuthProvider>
        );

        fireEvent.change(screen.getByPlaceholderText("Ingrese el nombre de la actividad"), { target: { value: 'Updated Event' } });
        expect(screen.getByDisplayValue('Updated Event')).toBeTruthy();

        fireEvent.change(screen.getByPlaceholderText("Ingrese el espacio reservado"), { target: { value: 'Updated Place' } });
        expect(screen.getByDisplayValue('Updated Place')).toBeTruthy();
    });
});
