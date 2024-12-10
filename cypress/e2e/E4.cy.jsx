import constants from "../../src/constants/constants";
import * as mocks from '../../src/constants/mockUsers';

describe('E2E Flow: E-4 Entry', () => {

    const mockOrganization = mocks.mockOrganization;
    const mockCourse = mocks.mockCourse;
    const mockSubject = mocks.mockSubject;

    const today = new Date();
    const dayOfWeek = today.getDay();
    const diffToTuesday = (dayOfWeek <= 2 ? 2 - dayOfWeek : 7 - dayOfWeek + 2);
    const diffToThursday = (dayOfWeek <= 4 ? 4 - dayOfWeek : 7 - dayOfWeek + 4);
  
    const tuesday = new Date(today);
    tuesday.setDate(today.getDate() + diffToTuesday);
    const thursday = new Date(today);
    thursday.setDate(today.getDate() + diffToThursday);

    const formatDate = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const mockSchedules = [
        {
            name: 'Clase Teórica',
            starting_date: formatDate(tuesday),
            date: formatDate(tuesday),
            end_date: formatDate(tuesday),
            start: '10:00',
            end: '12:00',
            place: 'Aula 101',
            group_name: 'Grupo A',
            description: 'Clase teórica de introducción',
            periodicity: ''
        },
        {
            name: 'Clase Práctica',
            starting_date: formatDate(thursday),
            end_date: formatDate(thursday),
            date: formatDate(thursday),
            start: '14:00',
            end: '16:00',
            place: 'Laboratorio 1',
            group_name: 'Grupo B',
            description: 'Clase práctica de laboratorio',
            periodicity: ''
        }
    ];

    beforeEach(() => {
        cy.visit(`http://localhost:5173${constants.root}`);
    });

    it('should login as Organization and create new Course', () => {
        cy.loginAsOrganization(mockOrganization);
        cy.createUserAsOrganization('cursos', mockCourse);
    });

    it('should login as Course and create, edit and delete schedule entries when creating a new Subject', () => {
        cy.loginAsUser('cursos', mockOrganization, mockCourse);
        cy.get(".create-button").should("exist").click();
        cy.url().should("include", `/CursoCrear/asignaturas`);
        cy.get("button").contains("Establecer calendario").click();

        // Create schedules
        mockSchedules.forEach(schedule => {
            cy.get('button').contains('+ Añadir horario').click();
            cy.get('input[name="date"]').type(schedule.date);
            cy.get('input[name="start"]').type(schedule.start);
            cy.get('input[name="end"]').type(schedule.end);
            cy.get('input[name="place"]').type(schedule.place);
            cy.get('select[name="group_name"]').select('Nuevo grupo');
            cy.get('input[name="new_group"]').type(schedule.group_name);
            cy.get('textarea[name="description"]').type(schedule.description);
            cy.get('button').contains('Guardar en el calendario').click();
        });

        // Edit schedules
        cy.get('[data-testid="0"]').click();
        cy.get('textarea[name="description"]').clear().type('Clase teórica editada');
        cy.get('button').contains('Guardar en el calendario').click();

        cy.get('.calendario').within(() => {
            cy.contains('Clase teórica editada').should('be.visible');
            cy.contains('Clase Teórica').should('not.exist');
        });

        // Delete schedules
        cy.get('.calendario').contains(mockSchedules[1].description).click();
        cy.get('button').contains('Eliminar').click();

        cy.get('.calendario').within(() => {
            cy.contains(mockSchedules[1].description).should('not.exist');
        });

        cy.get('[data-testid="save"]').should('exist').click();
        cy.url().should("include", `/CursoCrear/asignaturas`);
        cy.get("input[name='name']").type(mockSubject.name);
        cy.get("input[name='nip']").type(mockSubject.code);
        cy.get("button").contains("Crear").click();
        cy.get("button").contains("Aceptar").click();
        cy.url().should("include", "/CursoMenu");
    });

    after(() => {
        cy.logout();
        cy.loginAsOrganization(mockOrganization);
        cy.deleteUserAsOrganization('cursos');
    });
    
});