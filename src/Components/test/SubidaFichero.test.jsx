import { render, screen, fireEvent, waitFor } from '@testing-library/react';
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

    it("should charge and proccess students file", async () => {
        const setListaMock = vi.fn();
        const file = new File(["Juan Perez;123456;password;"], "test.csv", {
          type: "text/csv",
        });

        render(<SubidaFichero type="alumnos" lista={[]} setLista={setListaMock} />);

        const input = screen.getByTestId("file-input");
        fireEvent.change(input, { target: { files: [file] } });

        await waitFor(() => {
            expect(setListaMock).toHaveBeenCalledWith([{ name: "Juan Perez", nip: 123456, pass: "password" },]);
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
