import constants from "../../src/constants/constants";

describe('E2E Flow: Personalize Schedule for Student', () => {
    beforeEach(() => {
        cy.visit(`http://localhost:5173${constants.root}IniciarSesion`);

        cy.get('input[name="nia/nip"]').type('123456');
        cy.get('input[name="password"]').type('password');
        cy.get('select').eq(0).select('Alumno');
        cy.get('select').eq(1).select('Organizacion E-4');
        cy.get('button').contains('Enviar').click();

        cy.url().should('include', '/Calendario');
    });

    it('should use modal to customize schedule', () => {

        cy.get('button').contains('+ Personalizar calendario').click();

        /*

        cy.get('input[placeholder="Buscar horarios"]').type('Matematicas');
        cy.get('button').contains('Buscar').click();

        cy.get('.resultados-busqueda').within(() => {
            cy.contains('Matematicas I').click();
        });

        cy.get('input[placeholder="Ingrese el nombre de la actividad"]').clear().type('Matematicas Avanzadas');
        cy.get('input[type="date"]').eq(0).clear().type('2023-11-10');
        cy.get('input[type="time"]').eq(0).clear().type('09:00');
        cy.get('input[type="time"]').eq(1).clear().type('11:00');
        cy.get('input[placeholder="Ingrese el espacio reservado"]').clear().type('Aula 202');
        cy.get('textarea[placeholder="Ingrese una descripción"]').clear().type('Clase avanzada de matemáticas');
        cy.get('button').contains('Guardar en el calendario').click();

        cy.get('.calendario').within(() => {
            cy.contains('Matematicas Avanzadas').should('be.visible');
        });
        */
    });
});
