import constants from "../../src/constants/constants";
import * as mocks from '../../src/constants/mockUsers';

describe('E2E Flow: E-3 Entry', () => {

    const mockOrganization = mocks.mockOrganization;
    const mockCourse = mocks.mockCourse;
    const mockSubject = mocks.mockSubject;

    beforeEach(() => {
        cy.visit(`http://localhost:5173${constants.root}`);
    });

    it('should login as Organization and create new Course', () => {
        cy.loginAsOrganization(mockOrganization);
        cy.createUserAsOrganization('cursos', mockCourse);
    });

    it('should login as Course and create new Subject', () => {
        cy.loginAsUser('cursos', mockOrganization, mockCourse);
        cy.createSubjectAsCourse(mockSubject);
    });

    it('should login as Course and edit the Subject', () => {
        cy.loginAsUser('cursos', mockOrganization, mockCourse);
        cy.editSubjectAsCourse(mockSubject);
    });

    it('should login as Course and delete the Subject', () => {
        cy.loginAsUser('cursos', mockOrganization, mockCourse);
        cy.deleteSubjectAsCourse(mockSubject);
    });

    after(() => {
        cy.logout();
        cy.loginAsOrganization(mockOrganization);
        cy.deleteUserAsOrganization('cursos');
    });
});