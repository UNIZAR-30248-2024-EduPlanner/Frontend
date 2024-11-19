import { wait } from "@testing-library/user-event/dist/cjs/utils/index.js";
import constants from "../../src/constants/constants";

describe('E2E Flow: Show Schedule', () => {

    it('should login as student, navigate to calendar and watch schedule content', () => {
        cy.visit(`http://localhost:5173${constants.root}IniciarSesion`);

        cy.get('input[name="nia/nip"]').type('123456');
        cy.get('input[name="password"]').type('password');
        cy.get('select').eq(0).select('Alumno');
        cy.get('select').eq(1).select('Organizacion E-4');
        cy.get('button').contains('Enviar').click();

        cy.url().should('include', '/Calendario');
        
    });

    it('should login as teacher, navigate to calendar and watch schedule content', () => {
        cy.visit(`http://localhost:5173${constants.root}IniciarSesion`);

        cy.get('input[name="nia/nip"]').type('456789');
        cy.get('input[name="password"]').type('password');
        cy.get('select').eq(0).select('Profesor');
        cy.get('select').eq(1).select('Organizacion E-4');
        cy.get('button').contains('Enviar').click();

        cy.url().should('include', '/Calendario');
    });
});
