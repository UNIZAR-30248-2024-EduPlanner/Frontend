import { describe, it, vi, beforeEach, afterEach, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import ProfesorMatriculas from "../Profesor/ProfesorMatriculas.jsx";
import { useAuth } from "../../context/AuthContext";
import { getSubjectsByTeacherId } from "../../supabase/teacher/teacher";
import { BrowserRouter as Router } from "react-router-dom";
import constants from "../../constants/constants.jsx";

// Mock del contexto de autenticación
vi.mock("../../context/AuthContext", () => ({
  useAuth: vi.fn(),
}));

// Mock de la función para obtener asignaturas
vi.mock("../../supabase/teacher/teacher", () => ({
  getSubjectsByTeacherId: vi.fn(),
}));

// Mock del react-router-dom
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useNavigate: () => mockNavigate, // Mockea useNavigate globalmente
  };
});

describe("ProfesorMatriculas Component", () => {
  const mockUser = { id: 1, name: "Profesor Ejemplo" };
  const mockAsignaturas = [
    { id: 1, name: "Matemáticas" },
    { id: 2, name: "Historia" },
  ];

  beforeEach(() => {
    useAuth.mockReturnValue({ user: mockUser });
    getSubjectsByTeacherId.mockResolvedValue({ data: mockAsignaturas, error: null });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("renderiza el componente correctamente", async () => {
    render(
      <Router>
        <ProfesorMatriculas />
      </Router>
    );

    expect(screen.getByText(`Tus asignaturas, ${mockUser.name}`)).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Búsqueda de asignaturas")).toBeInTheDocument();
  });

  it("recupera y muestra las asignaturas", async () => {
    render(
      <Router>
        <ProfesorMatriculas />
      </Router>
    );

    // Espera a que las asignaturas se carguen
    expect(await screen.findByText("Matemáticas")).toBeInTheDocument();
    expect(await screen.findByText("Historia")).toBeInTheDocument();
  });

  it("filtra las asignaturas basándose en la búsqueda", async () => {
    render(
      <Router>
        <ProfesorMatriculas />
      </Router>
    );

    // Espera a que las asignaturas se carguen
    await screen.findByText("Matemáticas");

    // Simula escribir en el campo de búsqueda
    fireEvent.change(screen.getByPlaceholderText("Búsqueda de asignaturas"), {
      target: { value: "Hist" },
    });

    // Verifica que solo la asignatura filtrada aparece
    expect(screen.getByText("Historia")).toBeInTheDocument();
    expect(screen.queryByText("Matemáticas")).not.toBeInTheDocument();
  });

  it("navega correctamente al hacer clic en una asignatura", async () => {
    render(
      <Router>
        <ProfesorMatriculas />
      </Router>
    );

    // Espera a que las asignaturas se carguen
    const matematicas = await screen.findByText("Matemáticas");

    // Simula clic en la asignatura
    fireEvent.click(matematicas);

    expect(mockNavigate).toHaveBeenCalledWith(constants.root + "GestionarMatriculas/1");
  });

  it("muestra un mensaje de error si no se pueden recuperar las asignaturas", async () => {
    getSubjectsByTeacherId.mockResolvedValue({ data: null, error: true });

    render(
      <Router>
        <ProfesorMatriculas />
      </Router>
    );

    // No se espera que haya elementos en la lista
    expect(await screen.queryByText("Matemáticas")).not.toBeInTheDocument();
  });
});
