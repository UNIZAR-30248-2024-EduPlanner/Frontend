import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { BrowserRouter } from "react-router-dom";
import OrganizacionMenu from "../../Pages/Organizacion/OrganizacionMenu";
import { useAuth } from "../../context/AuthContext";
import { getAllCourses, getAllStudents, getAllTeachers } from "../../supabase/organization/organization";

vi.mock("../../context/AuthContext", () => ({
    useAuth: vi.fn(),
}));

vi.mock("../../supabase/organization/organization", () => ({
    getAllCourses: vi.fn(),
    getAllStudents: vi.fn(),
    getAllTeachers: vi.fn(),
}));

describe("OrganizacionMenu Component", () => {
    const mockUser = { id: "123", name: "Test Organization" };

    beforeEach(() => {
        vi.resetAllMocks();
        useAuth.mockReturnValue({ user: mockUser });
        getAllCourses.mockResolvedValue({ data: [{ id: 1, name: "Curso 1" }], error: null });
        getAllStudents.mockResolvedValue({ data: [{ id: 1, name: "Alumno 1" }], error: null });
        getAllTeachers.mockResolvedValue({ data: [{ id: 1, name: "Profesor 1" }], error: null });
    });

    const renderComponent = () => {
        render(
            <BrowserRouter>
                <OrganizacionMenu />
            </BrowserRouter>
        );
    };

    it("should render the component and display the welcome message", async () => {
        renderComponent();

        expect(await screen.findByText("Bienvenido, Test Organization")).toBeInTheDocument();
        expect(screen.getByText("Alumnos")).toBeInTheDocument();
        expect(screen.getByText("Cursos")).toBeInTheDocument();
        expect(screen.getByText("Profesores")).toBeInTheDocument();
    });

    it("should fetch and display courses, students, and teachers data", async () => {
        renderComponent();

        await waitFor(() => {
            expect(getAllCourses).toHaveBeenCalledWith("123");
            expect(getAllStudents).toHaveBeenCalledWith("123");
            expect(getAllTeachers).toHaveBeenCalledWith("123");
        });

        fireEvent.click(screen.getByText("Alumnos"));
        expect(await screen.findByText("Alumno 1")).toBeInTheDocument();
        fireEvent.click(screen.getByText("Cursos"));
        expect(await screen.findByText("Curso 1")).toBeInTheDocument();
        fireEvent.click(screen.getByText("Profesores"));
        expect(await screen.findByText("Profesor 1")).toBeInTheDocument();
    });
});
