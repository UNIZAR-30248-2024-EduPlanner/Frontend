import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import ModalHorarioCrearEditar from '../ModalHorarioCrearEditar';

describe('ModalHorarioCrearEditar', () => {
  const defaultProps = {
    isOpen: true,
    onOpenChange: vi.fn(),
    title: 'Crear horario',
    initialData: null,
    gruposExistentes: ['Grupo 1', 'Grupo 2'],
    tiposExistentes: ['Tipo 1', 'Tipo 2'],
    onSubmit: vi.fn(),
    onDelete: vi.fn(),
  };

  const renderComponent = (props = {}) => {
    return render(<ModalHorarioCrearEditar {...defaultProps} {...props} />);
  };

  beforeEach(() => {
    vi.spyOn(window, 'alert').mockImplementation(() => {});
  });

  it('should show modal with correct title', () => {
    renderComponent();
    expect(screen.getByText('Crear horario')).toBeInTheDocument();
  });

  it('should allow select date and time', async () => {
    renderComponent();
    const user = userEvent.setup();

    const dateInput = screen.getByLabelText('Fecha');
    const startTimeInput = screen.getByLabelText('Hora de inicio');
    const endTimeInput = screen.getByLabelText('Hora de finalización');

    await user.type(dateInput, '2024-11-20');
    await user.type(startTimeInput, '09:00');
    await user.type(endTimeInput, '10:00');

    expect(dateInput).toHaveValue('2024-11-20');
    expect(startTimeInput).toHaveValue('09:00');
    expect(endTimeInput).toHaveValue('10:00');
  });

  it('should show an alert if start is after end', async () => {
    renderComponent();
    const user = userEvent.setup();

    const startTimeInput = screen.getByLabelText('Hora de inicio');
    const endTimeInput = screen.getByLabelText('Hora de finalización');
    const saveButton = screen.getByTestId('save-button');

    await user.type(startTimeInput, '11:00');
    await user.type(endTimeInput, '09:00');
    await user.click(saveButton);

    expect(window.alert).toHaveBeenCalledWith('La hora de inicio debe ser igual o anterior a la hora de finalización');
  });
});
