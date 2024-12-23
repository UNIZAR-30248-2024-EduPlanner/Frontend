import constants from "../../src/constants/constants";
import * as mocks from '../../src/constants/mockUsers';

describe('E2E Flow: E-9 Entry', () => {
    const mockOrganization = mocks.mockOrganization;
    const mockStudent = mocks.mockStudent;
    const mockTeacher = mocks.mockTeacher;

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

    const mockEvents = [
        {
            name: 'Estudio de Matemáticas',
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
            name: 'Corrección de exámenes',
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

    it('should login as Organization and create new users', () => {
        cy.loginAsOrganization(mockOrganization);
        cy.createUserAsOrganization('alumnos', mockStudent);
        cy.createUserAsOrganization('profesores', mockTeacher);
    });

    it('should login as Student and manage their events', () => {
        const event = mockEvents[0];
        cy.loginAsUser('alumnos', mockOrganization, mockStudent);
        cy.get('button').contains('Personalizar calendario').click();
        cy.get('button').contains('Crear evento').click();
        cy.get('input[placeholder="Ingrese el nombre de la actividad"]').type(event.name);
        cy.get('input[type="date"]').eq(0).type(event.date);
        cy.get('input[type="time"]').eq(0).type(event.start);
        cy.get('input[type="time"]').eq(1).type(event.end);
        cy.get('input[placeholder="Ingrese el espacio reservado"]').type(event.place);
        cy.get('textarea[placeholder="Ingrese una descripción"]').type(event.description);
        cy.get('button').contains('Guardar evento').click();
    });

    it('should login as Teacher and manage their events', () => {
        const event = mockEvents[1];
        cy.loginAsUser('profesores', mockOrganization, mockTeacher);
        cy.get('button').contains('Personalizar calendario').click();
        cy.get('button').contains('Crear evento').click();
        cy.get('input[placeholder="Ingrese el nombre de la actividad"]').type(event.name);
        cy.get('input[type="date"]').eq(0).type(event.date);
        cy.get('input[type="time"]').eq(0).type(event.start);
        cy.get('input[type="time"]').eq(1).type(event.end);
        cy.get('input[placeholder="Ingrese el espacio reservado"]').type(event.place);
        cy.get('textarea[placeholder="Ingrese una descripción"]').type(event.description);
        cy.get('button').contains('Guardar evento').click();
    });

    it('should login as Organization and delete all users', () => {
        cy.loginAsOrganization(mockOrganization);
        cy.deleteUserAsOrganization('alumnos', mockStudent);
        cy.deleteUserAsOrganization('profesores', mockTeacher);
    });

});