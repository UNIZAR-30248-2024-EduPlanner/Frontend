import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Cargando from '../Cargando';

describe("Cargando Component Tests", () => {
    it("should render the component", () => {
        render(<Cargando />);
        const loadingElement = screen.getByText("Cargando...");
    
        expect(loadingElement).toBeInTheDocument();
    });    
});
