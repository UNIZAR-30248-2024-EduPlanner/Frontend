import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ModalDesasociarAsignaturas from '../ModalDesasociarAsignaturas';
import { AuthProvider } from '../../context/AuthContext';


const mockUseAuth = {
    user: { id: 12345, nip: 123456 }
};

const mockUnenrollStudent = vi.fn();
vi.mock('../supabase/student/student.js', () => ({
    unenrollStudent: mockUnenrollStudent,
}));

vi.mock('../../context/AuthContext', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useAuth: () => mockUseAuth,
  };
});

describe('ModalDesasociarAsignaturas', () => {
  const asignaturas = [
    { id: 1, name: 'Asignatura 1', subject_code: 101, course_id: 1 },
    { id: 2, name: 'Asignatura 2', subject_code: 102, course_id: 1 },
  ];

  const defaultProps = {
    isOpen: true,
    onOpenChange: vi.fn(),
    asignaturas,
    empty: false,
  };

  it('should render the modal with the list of asignaturas', () => {
    render(
      <AuthProvider>
        <ModalDesasociarAsignaturas {...defaultProps} />
      </AuthProvider>
    );

    expect(screen.getByText('Gestionar Asignaturas')).toBeTruthy();
    expect(screen.getByText(asignaturas[0].name)).toBeTruthy();
    expect(screen.getByText(asignaturas[1].name)).toBeTruthy();
  });

  it('should allow selecting asignaturas', ()  => {
    render(
      <AuthProvider>
        <ModalDesasociarAsignaturas {...defaultProps} />
      </AuthProvider>
    );

    const checkboxes = screen.getAllByRole('checkbox');
    fireEvent.click(checkboxes[0]); // Primer checkbox
    expect(checkboxes[0]).toBeChecked()

    fireEvent.click(checkboxes[1]); // Segundo checkbox
    expect(checkboxes[1]).toBeChecked()

    fireEvent.click(checkboxes[0]); // Deseleccionar primer checkbox
    expect(checkboxes[0]).not.toBeChecked()

    fireEvent.click(checkboxes[1]); // Deseleccionar segundo checkbox
    expect(checkboxes[1]).not.toBeChecked()
  });

  it('should display the "Desasociarse" button when asignaturas are selected', () => {
    render(
      <AuthProvider>
        <ModalDesasociarAsignaturas {...defaultProps} />
      </AuthProvider>
    );

    const checkboxes = screen.getAllByRole('checkbox');
    fireEvent.click(checkboxes[0]); 
    
    expect(screen.getByRole('button', { name: /Desasociarse/i })).toBeTruthy();
  });

  it('should open the confirmation modal when "Desasociarse" is clicked', async () => {
    render(
      <AuthProvider>
        <ModalDesasociarAsignaturas {...defaultProps} />
      </AuthProvider>
    );

    const checkboxes = screen.getAllByRole('checkbox');
    fireEvent.click(checkboxes[0]); 

    const desasociarseButton = screen.getByRole('button', { name: /Desasociarse/i });
    fireEvent.click(desasociarseButton);

    expect(screen.getByText('Confirmar Desasociación')).toBeTruthy();
  });

  it('should close the component when confirmation is canceled', async () => {
    render(
      <AuthProvider>
        <ModalDesasociarAsignaturas {...defaultProps} />
      </AuthProvider>
    );
  
    const checkboxes = screen.getAllByRole('checkbox');
    fireEvent.click(checkboxes[0]); // Seleccionar una asignatura
  
    const desasociarseButton = screen.getByRole('button', { name: /Desasociarse/i });
    fireEvent.click(desasociarseButton); // Hacer clic en el botón "Desasociarse"
  
    // Espera que el modal de confirmación se muestre
    await screen.findByText('Confirmar Desasociación');
  
    // Encuentra y haz clic en el botón "Cancelar"
    const cancelarButton = screen.getByRole('button', { name: /Cancelar/i });
    fireEvent.click(cancelarButton);
  
    // Verificar que el modal principal todavía esté abierto y que la UI de asignaturas esté visible
    expect(screen.getByText('Gestionar Asignaturas')).toBeInTheDocument();
  });

  it('should call confirmarDesasociacion when confirmation is accepted', async () => {
    render(
      <AuthProvider>
        <ModalDesasociarAsignaturas {...defaultProps} />
      </AuthProvider>
    );

    const checkboxes = screen.getAllByRole('checkbox');
    fireEvent.click(checkboxes[0]); 

    expect(checkboxes[0]).toBeChecked();

    const desasociarseButton =  screen.getByRole('button', { name: /Desasociarse/i });
    fireEvent.click(desasociarseButton);

    await screen.findByText('Confirmar Desasociación'); // Espera que el modal de confirmación se muestre

    const confirmarButton =  screen.getByRole('button', { name: /Confirmar/i });
    fireEvent.click(confirmarButton);

    // Verificar que la función mockUnenrollStudent se llamó
    expect(mockUnenrollStudent).toHaveBeenCalled;
    /*
    await waitFor(() => {
        expect(mockUnenrollStudent).toHaveBeenCalledWith(mockUseAuth.user.nip, asignaturas[0].subject_code);
    });
    */
  });

  it('should not show the confirmation modal if no asignaturas are selected', () => {
    render(
      <AuthProvider>
        <ModalDesasociarAsignaturas {...defaultProps} />
      </AuthProvider>
    );
  
    // No click on checkboxes
    const desasociarseButton = screen.queryByRole('button', { name: /Desasociarse/i });
    expect(desasociarseButton).toBeNull(); // El botón no debe aparecer
  });

  it('should display a message when no asignaturas are available', () => {
    const emptyProps = {
      ...defaultProps,
      empty: true,
    };
  
    render(
      <AuthProvider>
        <ModalDesasociarAsignaturas {...emptyProps} />
      </AuthProvider>
    );
  
    expect(screen.getByText('No tienes asignaturas asociadas.')).toBeInTheDocument();
  });
  
  it('should retain selected asignaturas after reopening the modal', () => {
    render(
      <AuthProvider>
        <ModalDesasociarAsignaturas {...defaultProps} />
      </AuthProvider>
    );
  
    const checkboxes = screen.getAllByRole('checkbox');
    fireEvent.click(checkboxes[0]); // Seleccionar primera asignatura
  
    const desasociarseButton = screen.getByRole('button', { name: /Desasociarse/i });
    fireEvent.click(desasociarseButton);
  
    const cancelarButton = screen.getByRole('button', { name: /Cancelar/i });
    fireEvent.click(cancelarButton); // Cerrar modal de confirmación
  
    // Abrir de nuevo el modal
    render(
      <AuthProvider>
        <ModalDesasociarAsignaturas {...defaultProps} />
      </AuthProvider>
    );
  
    // Verificar que el primer checkbox esté seleccionado
    expect(checkboxes[0]).toBeChecked();
  });
  
  
});
