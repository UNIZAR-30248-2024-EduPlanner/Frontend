import { describe, it, vi, beforeEach, afterEach, expect } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import GestionarMatriculas from "../Profesor/GestionarMatriculas.jsx";
import { getSubjectById } from "../../supabase/course/course";
import { getStudentsBySubject } from "../../supabase/student/student";
import { useNavigate } from "react-router-dom";
import constants from "../../constants/constants";
import { AuthProvider } from "../../context/AuthContext"; // Import AuthProvider

// Mock dependencies
vi.mock("../../supabase/course/course", () => ({
  getSubjectById: vi.fn(),
}));

vi.mock("../../supabase/student/student", () => ({
  getStudentsBySubject: vi.fn(),
}));

vi.mock("react-router-dom", async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    BrowserRouter: ({ children }) => <div>{children}</div>, // Mock BrowserRouter
    useNavigate: vi.fn(), // Mock useNavigate
    useParams: () => ({ id: "1" })
  };
});

describe("GestionarMatriculas Component", () => {
  const mockSubject = { id: "1", name: "Matemáticas" };
  const mockStudents = [
    { id: 1, nip: "12345", name: "Juan Pérez" },
    { id: 2, nip: "67890", name: "Ana Gómez" },
  ];

  const mockNavigate = vi.fn();
  const mockUser = { id: 1, name: "Profesor Ejemplo" }; // Mock user

  beforeEach(() => {
    useNavigate.mockReturnValue(mockNavigate);
    getSubjectById.mockResolvedValue({ data: mockSubject, error: null });
    getStudentsBySubject.mockResolvedValue({ data: mockStudents, error: null });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  const renderWithAuthProvider = (ui) => {
    return render(
      <AuthProvider value={{ user: mockUser }}>
        {ui}
      </AuthProvider>
    );
  };

  it("renders the component correctly", async () => {
    renderWithAuthProvider(
      <Router>
        <GestionarMatriculas />
      </Router>
    );

    await waitFor(() => screen.findByText("Alumnos de Matemáticas"));
    
    expect(screen.getByText("Alumnos de Matemáticas")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Búsqueda de asignaturas")).toBeInTheDocument();
  });

  it("fetches and displays the subject and students", async () => {
    renderWithAuthProvider(
      <Router>
        <GestionarMatriculas />
      </Router>
    );

    await waitFor(() => screen.findByText("Alumnos de Matemáticas"));

    expect(await screen.findByText("Alumnos de Matemáticas")).toBeInTheDocument();
    expect(await screen.findByText("12345 - Juan Pérez")).toBeInTheDocument();
    expect(await screen.findByText("67890 - Ana Gómez")).toBeInTheDocument();
  });

  it("filters students based on search input", async () => {
    renderWithAuthProvider(
      <Router>
        <GestionarMatriculas />
      </Router>
    );

    // Wait for students to load
    await screen.findByText("12345 - Juan Pérez");

    // Simulate typing in the search input
    fireEvent.change(screen.getByPlaceholderText("Búsqueda de asignaturas"), {
      target: { value: "Ana" },
    });

    // Check if the filtered student is displayed and the other is not
    expect(screen.getByText("67890 - Ana Gómez")).toBeInTheDocument();
    expect(screen.queryByText("12345 - Juan Pérez")).not.toBeInTheDocument();
  });

  it("opens modal and deletes student when confirmed", async () => {
    renderWithAuthProvider(
      <Router>
        <GestionarMatriculas />
      </Router>
    );

    // Wait for the delete button
    await waitFor(() => screen.getByLabelText(/trash 0/i));

    const deleteButton = screen.getByLabelText("trash 0");
    fireEvent.click(deleteButton);

    // Check if the modal is open
    expect(screen.getByText("Confirmar eliminación")).toBeInTheDocument();

    // Simulate accepting the deletion
    const modalAcceptButton = screen.getByText("Aceptar");
    fireEvent.click(modalAcceptButton);

    // Verify that the student has been deleted
    expect(getStudentsBySubject).toHaveBeenCalledTimes(1);
    expect(screen.queryByText("12345 - Juan Pérez")).not.toBeInTheDocument();
  });

  it("navigates to MatricularAlumnos page when the button is clicked", async () => {
    renderWithAuthProvider(
      <Router>
        <GestionarMatriculas />
      </Router>
    );

    // Wait for the "Create" button
    await waitFor(() => screen.findByTestId("create-button"));

    const createButton = screen.getByTestId("create-button");
    fireEvent.click(createButton);

    // Verify that the navigate function was called with the correct URL
    expect(mockNavigate).toHaveBeenCalledWith(
      `${constants.root}MatricularAlumnos/${mockSubject.id}`
    );
  });
});
