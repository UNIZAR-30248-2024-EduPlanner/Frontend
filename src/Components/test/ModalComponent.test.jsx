import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ModalComponent from '../ModalComponent';

const mockOnAccept = vi.fn();
const mockOnOpenChange = vi.fn();

describe("ModalComponent Tests", () => {
    it("should render the component", () => {
        render(<ModalComponent isOpen={true} onOpenChange={() => {}} title="Test Title" texto="Test Text" onAccept={() => {}}/>);
        const titleElement = screen.getByText("Test Title");
        const textElement = screen.getByText("Test Text");

        expect(titleElement).toBeInTheDocument();
        expect(textElement).toBeInTheDocument();
    });

    it("should call onAccept and close modal when accept button clicked", () => {
        render(<ModalComponent isOpen={true} onOpenChange={mockOnOpenChange} title="Test Title" texto="Test Text" onAccept={mockOnAccept}/>);
        const acceptButton = screen.getByRole('button', { name: /aceptar/i });
        fireEvent.click(acceptButton);

        expect(mockOnAccept).toHaveBeenCalled();
        expect(mockOnOpenChange).toHaveBeenCalledWith(false);
    });

    it("should close modal when cancel button clicked", () => {
        render(<ModalComponent isOpen={true} onOpenChange={mockOnOpenChange} title="Test Title" texto="Test Text" onAccept={() => {}}/>);
        const cancelButton = screen.getByRole('button', { name: /cancelar/i });
        fireEvent.click(cancelButton);

        expect(mockOnOpenChange).toHaveBeenCalledWith(false);
    });

    it("should not render the modal when isOpen is false", () => {
        render(<ModalComponent isOpen={false} onOpenChange={() => {}} title="Test Title" texto="Test Text" onAccept={() => {}}/>);
        const titleElement = screen.queryByText("Test Title");
        const textElement = screen.queryByText("Test Text");

        expect(titleElement).not.toBeInTheDocument();
        expect(textElement).not.toBeInTheDocument();
    });
});