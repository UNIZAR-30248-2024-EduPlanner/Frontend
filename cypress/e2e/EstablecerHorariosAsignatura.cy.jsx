import constants from "../../src/constants/constants";

describe('E2E Flow: Create, Edit and Delete Schedule for a Subject', () => {
    const testCourse = {
        nip: '400000',
        pass: 'password'
    };

    const testSubject = {
        name: 'Asignatura de Prueba',
        code: 'ASG123'
    };

    const testHorarios = [
        {
            name: 'Clase Teórica',
            starting_date: '2024-11-18',
            date: '2024-11-18',
            end_date: '2024-11-18',
            start: '10:00',
            end: '12:00',
            place: 'Aula 101',
            group_name: 'Grupo A',
            description: 'Clase teórica de introducción',
            periodicity: ''
        },
        {
            name: 'Clase Práctica',
            starting_date: '2024-11-20',
            end_date: '2024-11-20',
            date: '2024-11-20',
            start: '14:00',
            end: '16:00',
            place: 'Laboratorio 1',
            group_name: 'Grupo B',
            description: 'Clase práctica de laboratorio',
            periodicity: ''
        }
    ];

    beforeEach(() => {
        cy.visit(`http://localhost:5173${constants.root}IniciarSesion`);

        cy.get('input[name="nia/nip"]').type(testCourse.nip);
        cy.get('input[name="password"]').type(testCourse.pass);
        cy.get('select').eq(0).select('Curso');
        cy.get('select').eq(1).select('Organizacion E-4');
        cy.get('button').contains('Enviar').click();

        cy.url().should('include', '/CursoMenu');
    });

    it('should create, edit and delete schedule entries when creating a subject', () => {
        cy.get(".create-button").should("exist").click();
        cy.get('input[name="name"]').type(testSubject.name);
        cy.get('input[name="nip"]').type(testSubject.code);
        cy.get('button').contains('Establecer calendario').click();

        testHorarios.forEach(horario => {
            cy.get('button').contains('+ Añadir horario').click();
            cy.get('input[name="date"]').type(horario.date);
            cy.get('input[name="start"]').type(horario.start);
            cy.get('input[name="end"]').type(horario.end);
            cy.get('input[name="place"]').type(horario.place);
            cy.get('select[name="group_name"]').select('Nuevo grupo');
            cy.get('input[name="new_group"]').type(horario.group_name);
            cy.get('textarea[name="description"]').type(horario.description);
            cy.get('button').contains('Guardar en el calendario').click();
        });

        cy.get('[data-testid="0"]').click();
        cy.get('textarea[name="description"]').clear().type('Clase teórica editada');
        cy.get('button').contains('Guardar en el calendario').click();

        cy.get('.calendario').within(() => {
            cy.contains('Clase teórica editada').should('be.visible');
            cy.contains('Clase Teórica').should('not.exist');
        });

        cy.get('.calendario').contains(testHorarios[1].description).click();
        cy.get('button').contains('Eliminar').click();

        cy.get('.calendario').within(() => {
            cy.contains(testHorarios[1].description).should('not.exist');
        });
    });
});
