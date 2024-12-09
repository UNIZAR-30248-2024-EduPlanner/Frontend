import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ModalEditarHorarios from '../ModalEditarHorarios';
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

describe('ModalEditarHorarios', () => {
    const defaultProps = {
        isOpen: true,
        onOpenChange: vi.fn(),
        listaCompletaEventos: [
            {
                id: 'event1',
                name: 'Asignatura 1',
                group_name: 'Grupo 1',
                start: '08:00',
                end: '10:00',
                date: '2023-11-01',
                place: 'Aula 1',
                description: 'Descripción 1'
            },
            {
                id: 'event2',
                name: 'Asignatura 1',
                group_name: 'Grupo 2',
                start: '10:00',
                end: '12:00',
                date: '2023-11-02',
                place: 'Aula 2',
                description: 'Descripción 2'
            },
            {
                id: 'event3',
                name: 'Asignatura 2',
                group_name: 'Grupo 1',
                start: '12:00',
                end: '14:00',
                date: '2023-11-03',
                place: 'Aula 3',
                description: 'Descripción 3'
            }
        ],
        listaCompletaEventosVisibles: [
            {
                id: 'event4',
                name: 'Asignatura 3',
                group_name: 'Grupo 1',
                start: '14:00',
                end: '16:00',
                date: '2023-11-04',
                place: 'Aula 4',
                description: 'Descripción 4'
            },
            {
                id: 'event5',
                name: 'Asignatura 2',
                group_name: 'Grupo 1',
                start: '12:00',
                end: '14:00',
                date: '2023-11-03',
                place: 'Aula 3',
                description: 'Descripción 3'
            }
        ],
    };

    it('should render the modal with correct content', () => {
        render(
            <AuthProvider>
                <ModalEditarHorarios {...defaultProps} />
            </AuthProvider>
        );

        expect(screen.getByText('Asignatura 1')).toBeTruthy();
    });

    it('should call onOpenChange when the modal is closed', () => {
        render(
            <AuthProvider>
                <ModalEditarHorarios {...defaultProps} />
            </AuthProvider>
        );

        fireEvent.click(screen.getByRole('button', { name: /close/i }));
        expect(defaultProps.onOpenChange).toHaveBeenCalled();
    });
});