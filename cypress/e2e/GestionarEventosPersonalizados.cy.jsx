import constants from "../../src/constants/constants";

describe('E2E Flow: Create, Edit and Delete Custom Schedule', () => {
    beforeEach(() => {



        cy.visit(`http://localhost:5173${constants.root}IniciarSesion`);

        cy.get('input[name="nia/nip"]').type('123456');
        cy.get('input[name="password"]').type('password');
        cy.get('select').eq(0).select('Alumno');
        cy.get('select').eq(1).select('Organizacion E-4');
        cy.get('button').contains('Enviar').click();

        cy.url().should('include', '/Calendario');
    });

    it('should navegiate to calendar, create, edit and delete custom schedule', () => {

        cy.get('button').contains('+ Personalizar calendario').click();
        cy.get('button').contains('Crear evento').click();


        cy.get('input[placeholder="Ingrese el nombre de la actividad"]').type('Estudio de Matemáticas');
        cy.get('input[type="date"]').eq(0).type('2024-11-20');
        cy.get('input[type="time"]').eq(0).type('10:00');
        cy.get('input[type="time"]').eq(1).type('12:00');
        cy.get('input[placeholder="Ingrese el espacio reservado"]').type('Biblioteca');
        cy.get('textarea[placeholder="Ingrese una descripción"]').type('Estudiar para el examen de matemáticas');
        cy.get('button').contains('Guardar en el calendario').click();

        cy.get('.calendario').within(() => {
            cy.contains('Estudio de Matemáticas').should('be.visible');
        });

        cy.get('.calendario').contains('Estudio de Matemáticas').click();
        cy.get('button').contains('Modificar evento').click();
        cy.get('input[placeholder="Ingrese el nombre de la actividad"]').clear().type('Estudio de Física');
        cy.get('button').contains('Guardar en el calendario').click();
        cy.get('button').contains('Aceptar').click();

        cy.get('.calendario').within(() => {
            cy.contains('Estudio de Física').should('be.visible');
            cy.contains('Estudio de Matemáticas').should('not.exist');
        });

        cy.get('.calendario').contains('Estudio de Física').click();
        cy.get('button').contains('Eliminar del calendario').click();
        cy.get('button').contains('Aceptar').click();

        cy.get('.calendario').within(() => {
            cy.contains('Estudio de Física').should('not.exist');
        });
    });
});
