import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { BrowserRouter } from "react-router-dom";
import CursoMenu from "../../Pages/Curso/CursoMenu";
import { useAuth } from "../../context/AuthContext";
import { getAllSubjects } from "../../supabase/course/course";

vi.mock("../../context/AuthContext", () => ({
    useAuth: vi.fn(),
}));

vi.mock("../../supabase/course/course", () => ({
    getAllSubjects: vi.fn(),
}));

describe("CursoMenu Component", () => {
    const mockUser = { id: "123", name: "Test Course" };

    beforeEach(() => {
        vi.resetAllMocks();
        useAuth.mockReturnValue({ user: mockUser });
        getAllSubjects.mockResolvedValue({
            data: [{ id: 1, name: "Asignatura 1" }],
            error: null,
        });
    });

    const renderComponent = () => {
        render(
            <BrowserRouter>
                <CursoMenu />
            </BrowserRouter>
        );
    };

    it("should render the component and display the welcome message", async () => {
        renderComponent();

        expect(await screen.findByText("Bienvenido, Test Course")).toBeInTheDocument();
        expect(screen.getByText("Asignaturas")).toBeInTheDocument();
    });

    it("should fetch and display subjects", async () => {
        renderComponent();

        await waitFor(() => {
            expect(getAllSubjects).toHaveBeenCalledWith("123");
        });

        expect(await screen.findByText("Asignatura 1")).toBeInTheDocument();
    });
});
