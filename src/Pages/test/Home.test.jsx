import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { BrowserRouter } from "react-router-dom";
import Home from "../../Pages/Home";
import constants from "../../constants/constants";

const mockNavigate = vi.fn();

vi.mock("react-router-dom", async (importOriginal) => {
    const actual = await importOriginal();
    return {
        ...actual,
        useNavigate: () => mockNavigate,
    };
});

describe("Home Component", () => {
    const renderComponent = () => {
        render(
            <BrowserRouter>
                <Home />
            </BrowserRouter>
        );
    };

    it("should render the component", () => {
        renderComponent();

        expect(screen.getByText("Bienvenido a EduPlanner")).toBeInTheDocument();
        expect(
            screen.getByText(
                "La plataforma que mejora la planificación educativa de tu organización."
            )
        ).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Iniciar sesión" })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Crear organización" })).toBeInTheDocument();
        expect(screen.getByText("© 2024 EduPlanner. Todos los derechos reservados.")).toBeInTheDocument();
    });

    it("should navigate to IniciarSesion when login button is clicked", () => {
        renderComponent();

        const loginButton = screen.getByRole("button", { name: "Iniciar sesión" });
        fireEvent.click(loginButton);

        expect(mockNavigate).toHaveBeenCalledWith(constants.root + "IniciarSesion");
    });

    it("should navigate to CrearOrganizacion when create button is clicked", () => {
        renderComponent();

        const createOrgButton = screen.getByRole("button", { name: "Crear organización" });
        fireEvent.click(createOrgButton);

        expect(mockNavigate).toHaveBeenCalledWith(constants.root + "CrearOrganizacion");
    });
});
