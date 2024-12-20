import constants from "../../src/constants/constants";
import * as mocks from '../../src/constants/mockUsers';
import { getOrganizationIdByName, eliminateOrganization } from "../../src/supabase/organization/organization";

describe('E2E Flow: E-1 Entry', () => {

    const mockOrganization = mocks.mockOrganizationToCreate;
    const mockStudent = mocks.mockStudent;
    const mockTeacher = mocks.mockTeacher;
    const mockCourse = mocks.mockCourse;

    beforeEach(() => {
        cy.visit(`http://localhost:5173${constants.root}`);
    });

    it('should create new Organization', () => {
        cy.contains('Crear organización').click();
        cy.url().should('include', '/CrearOrganizacion');

        cy.get('input[name="nombreOrganizacion"]').type(mockOrganization.name);
        cy.get('input[name="nipNia"]').type(mockOrganization.nip);
        cy.get('input[name="password"]').type(mockOrganization.password);
        cy.get('input[name="repeatPassword"]').type(mockOrganization.password);
        
        cy.get('button').contains('Crear').should('not.be.disabled');
        cy.get('button').contains('Crear').click();
        cy.url().should('include', '/OrganizacionMenu');
    });

    it('should login with new Organization and create new Student, Teacher and Course', () => {
        cy.loginAsOrganization(mockOrganization);
        cy.createUserAsOrganization('alumnos', mockStudent);
        cy.createUserAsOrganization('profesores', mockTeacher);
        cy.createUserAsOrganization('cursos', mockCourse);
    });

    it('should login with new Student', () => {
        cy.loginAsUser('alumnos', mockOrganization, mockStudent);
    });

    it('should login with new Teacher', () => {
        cy.loginAsUser('profesores', mockOrganization, mockTeacher);
    });

    it('should login with new Course', () => {
        cy.loginAsUser('cursos', mockOrganization, mockCourse);
    });

    after(() => {
        cy.getSupabaseConfig().then(async ({ url, anonKey }) => {
            expect(url).to.exist;
            expect(anonKey).to.exist;
            // Lógica con Supabase
            const organization_id = await getOrganizationIdByName(mockOrganization.name);
            if (organization_id !== null && organization_id !== undefined) await eliminateOrganization(organization_id);
          });
    })
});
