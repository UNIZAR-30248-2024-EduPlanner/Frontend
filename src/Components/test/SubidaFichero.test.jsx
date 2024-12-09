import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import SubidaFichero from '../SubidaFichero';

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
        const mockList = vi.fn();
        render(<SubidaFichero type="alumnos" lista={mockList} setLista={(l) => {lista = l}} />);
        const inputElement = document.querySelector(".text-information");

        expect(inputElement).toBeInTheDocument();
    });

    it("should charge and proccess subjects file", async () => {
        const mockList = vi.fn();
        const setListaMock = vi.fn();
        const file = new File(["Matematicas;123;"], 'test.csv', { type: 'text/csv' });

        render(<SubidaFichero type="asignaturas" lista={mockList} setLista={setListaMock} />);

        const input = screen.getByTestId("file-input");
        fireEvent.change(input, { target: { files: [file] } });

        await waitFor(() => {
            expect(setListaMock).toHaveBeenCalledWith([{ subject_code: 123, name: "Matematicas" }]);
        });
    });

    it("should charge and proccess students file", async () => {
        const mockList = vi.fn();
        const setListaMock = vi.fn();
        const file = new File(["Alumno;888888;password;"], 'test.csv', { type: 'text/csv' });

        render(<SubidaFichero type="alumnos" lista={mockList} setLista={setListaMock} />);

        const input = screen.getByTestId("file-input");
        fireEvent.change(input, { target: { files: [file] } });

        await waitFor(() => {
            expect(setListaMock).toHaveBeenCalled();
        });
    });

    it("should charge and proccess enrollements file", async () => {
        const mockList = vi.fn();
        const setListaMock = vi.fn();
        const file = new File(["123456;"], "test.csv", {type: "text/csv",});

        render(<SubidaFichero type="matriculas" lista={mockList} setLista={setListaMock} />);

        const input = screen.getByTestId("file-input");
        fireEvent.change(input, { target: { files: [file] } });

        await waitFor(() => {
            expect(setListaMock).toHaveBeenCalledWith([{ nip: 123456 }]);
        });
    });

    it("should show error message when students file has incorrect number of fields", async () => {
        const setListaMock = vi.fn();
        const file = new File(["Juan Perez;abc123;short"], "test.csv", {
          type: "text/csv",
        });
    
        render(<SubidaFichero type="alumnos" lista={[]} setLista={setListaMock} />);
    
        const input = screen.getByTestId("file-input");
        fireEvent.change(input, { target: { files: [file] } });
    
        await waitFor(() => {
            const errorList = screen.getByRole("list");
            expect(errorList).toHaveTextContent("Número incorrecto de campos");
        });
      });
});
