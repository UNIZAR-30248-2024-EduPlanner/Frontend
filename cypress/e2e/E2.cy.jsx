import constants from "../../src/constants/constants";
import * as mocks from '../../src/constants/mockUsers';

describe('E2E Flow: E-2 Entry', () => {

    const mockOrganization = mocks.mockOrganization;
    const mockStudent = mocks.mockStudent;
    const mockTeacher = mocks.mockTeacher;
    const mockCourse = mocks.mockCourse;

    beforeEach(() => {
        cy.visit(`http://localhost:5173${constants.root}`);
    });

    it('should login with Tester Organization and create new Student, Teacher and Course', () => {
        cy.loginAsOrganization(mockOrganization);
        cy.createUserAsOrganization('alumnos', mockStudent);
        cy.createUserAsOrganization('profesores', mockTeacher);
        cy.createUserAsOrganization('cursos', mockCourse);
    });

    it('should login with Tester Organization and edit new Student, Teacher and Course', () => {
        cy.loginAsOrganization(mockOrganization);
        cy.editUserAsOrganization('alumnos', mockStudent);
        cy.editUserAsOrganization('profesores', mockTeacher);
        cy.editUserAsOrganization('cursos', mockCourse);
    });

    it('should login with Tester Organization and delete new Student, Teacher and Course', () => {
        cy.loginAsOrganization(mockOrganization);
        cy.deleteUserAsOrganization('alumnos');
        cy.deleteUserAsOrganization('profesores');
        cy.deleteUserAsOrganization('cursos');
    });
});