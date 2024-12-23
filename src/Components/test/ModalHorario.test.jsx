import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { AuthProvider } from '../../context/AuthContext';
import ModalHorario from '../ModalHorario';
import { type } from '@testing-library/user-event/dist/cjs/utility/type.js';

const mockUseAuth = {
    user: { id: 'user123', role: 'teacher' }
};

vi.mock("../../context/AuthContext", async (importOriginal) => {
    const actual = await importOriginal();
    return {
        ...actual,
        useAuth: () => mockUseAuth
    };
});

describe('ModalHorario', () => {
    const defaultProps = {
        isOpen: true,
        onOpenChange: vi.fn(),
        title: 'Test Event',
        date_start: '2023-11-01',
        date_finish: '2023-11-02',
        place: 'Test Place',
        group: 'Test Group',
        descripcion: 'Test Description',
        creador: 'user123',
        id: 'event123',
        date: '2023-11-01',
    };

    const defaultPropsAcademic = {
        isOpen: true,
        onOpenChange: vi.fn(),
        title: 'Test Event',
        date_start: '2023-11-01',
        date_finish: '2023-11-02',
        place: 'Test Place',
        group: 'Test Group',
        descripcion: 'Test Description',
        creador: 'subject123',
        id: 'event123',
        date: '2023-11-01',
        type: 'Examen',
    };

    it('should render the modal with correct title and content', () => {
        render(
            <AuthProvider>
                <ModalHorario {...defaultProps} />
            </AuthProvider>
        );

        expect(screen.getByText('Test Event')).toBeTruthy();
        expect(screen.getByText('Ficha del evento')).toBeTruthy();
        expect(screen.getByText('Test Place')).toBeTruthy();
        expect(screen.getByText('Test Group')).toBeTruthy();
        expect(screen.getByText('Test Description')).toBeTruthy();
    });

    it('should call onOpenChange when the modal is closed', () => {
        render(
            <AuthProvider>
                <ModalHorario {...defaultProps} />
            </AuthProvider>
        );

        fireEvent.click(screen.getByRole('button', { name: /close/i }));
        expect(defaultProps.onOpenChange).toHaveBeenCalled();
    });

    it('should open the edit modal when the edit button is clicked', () => {
        render(
            <AuthProvider>
                <ModalHorario {...defaultProps} />
            </AuthProvider>
        );

        fireEvent.click(screen.getByRole('button', { name: "Modificar" }));
        expect(screen.getByRole('button', { name: "Guardar en el calendario" })).toBeTruthy();
    });

    it('should call eliminarEvento when the confirm delete button is clicked', async () => {
        render(
            <AuthProvider>
                <ModalHorario {...defaultProps} />
            </AuthProvider>
        );

        fireEvent.click(screen.getByRole('button', { name: "Ocultar evento" }));
        fireEvent.click(screen.getByRole('button', { name: "Aceptar" }));
    });

    it('should call eliminarEventoAcademico when the confirm delete button is clicked', async () => {
        render(
            <AuthProvider>
                <ModalHorario {...defaultPropsAcademic} />
            </AuthProvider>
        );

        fireEvent.click(screen.getByRole('button', { name: "Eliminar evento" }));
        fireEvent.click(screen.getByRole('button', { name: "Aceptar" }));
    });

    it('should open the edit modal when the edit button is clicked without being the creator', async () => {
        render(
            <AuthProvider>
                <ModalHorario {...defaultPropsAcademic} />
            </AuthProvider>
        );

        fireEvent.click(screen.getByRole('button', { name: "Modificar" }));
        expect(screen.getByRole('button', { name: "Guardar cambios" })).toBeTruthy();
    });
});