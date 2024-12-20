import constants from "../../src/constants/constants";
import * as mocks from '../../src/constants/mockUsers';

describe('E2E Flow: E-7 Entry', () => {
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

    it('should login as a course and enroll/assing a student/teacher in a subject ', () => {
        cy.loginAsUser('cursos', mockOrganization, mockCourse);
        cy.get("button.edit").click();
        cy.url().should("include", `/CursoModificar/asignaturas`);
        cy.get("button").contains("Gestionar matrículas").click();
        cy.url().should("include", `/Matriculas`);
        cy.enrollUserIntoSubject(mockStudent.nip);
        cy.enrollUserIntoSubject(mockTeacher.nip);
        cy.wait(3000);
    });

    it('should login as a student and unenroll itself from a subject', () => {
        cy.loginAsUser('alumnos', mockOrganization, mockStudent);
        cy.get("button").contains("Gestionar asignaturas").click();
        cy.get(`[data-testid="checkbox-${mockSubject.code}"]`).click();
        cy.get("button").contains("Desasociarse").click();
        cy.get("button").contains("Confirmar").click();
    });

    it('should login as Organization and delete all users', () => {
        cy.loginAsOrganization(mockOrganization);
        cy.deleteUserAsOrganization('alumnos', mockStudent);
        cy.deleteUserAsOrganization('profesores', mockTeacher);
        cy.deleteUserAsOrganization('cursos', mockCourse);
    });
    
});