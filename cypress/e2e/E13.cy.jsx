import constants from "../../src/constants/constants";
import * as mocks from '../../src/constants/mockUsers';

describe('E2E Flow: E-13 Entry', () => {

    const mockOrganization = mocks.mockOrganization;
    const mockCourse = mocks.mockCourse;
    const mockSubject = mocks.mockSubject;
    const mockStudent = mocks.mockStudent;
    const mockTeacher = mocks.mockTeacher;

    beforeEach(() => {
        cy.visit(`http://localhost:5173${constants.root}`);
    });

    it('should login as Organization and create new users', () => {
        cy.loginAsOrganization(mockOrganization);
        cy.createUserAsOrganization('alumnos', mockStudent);
        cy.createUserAsOrganization('profesores', mockTeacher);
        cy.createUserAsOrganization('cursos', mockCourse);
    });

    it('should login as Course and create new Subject', () => {
        cy.loginAsUser('cursos', mockOrganization, mockCourse);
        cy.createSubjectAsCourse(mockSubject);
    });

    it('should login as a course and assing a teacher in a subject ', () => {
        cy.loginAsUser('cursos', mockOrganization, mockCourse);
        cy.get("button.edit").click();
        cy.url().should("include", `/CursoModificar/asignaturas`);
        cy.get("button").contains("Gestionar matrículas").click();
        cy.url().should("include", `/Matriculas`);
        cy.enrollUserIntoSubject(mockTeacher.nip);
        cy.wait(3000);
    });

    it('should login as a teacher and enroll a new student in a subject', () => {
        cy.loginAsUser('profesores', mockOrganization, mockTeacher);
        cy.get("button").contains("Gestionar matrículas").click();
        cy.url().should("include", `/ProfesorMatriculas`);
        cy.get("div.lista-item").first().click();
        cy.url().should("include", `/GestionarMatriculas`);
        cy.get('[data-testid="create-button"]').click();
        cy.url().should("include", `/MatricularAlumnos`);
        cy.get("input[name='nip/nia']").type(mockStudent.nip);
        cy.get("button").contains("Matricular").click();
        cy.get("button").contains("Aceptar").click();
        cy.wait(3000);
        cy.url().should("include", `/GestionarMatriculas`);
    });

    it('should login as Organization and delete all users', () => {
        cy.loginAsOrganization(mockOrganization);
        cy.deleteUserAsOrganization('alumnos', mockStudent);
        cy.deleteUserAsOrganization('profesores', mockTeacher);
        cy.deleteUserAsOrganization('cursos', mockCourse);
    });
    
});