import constants from "../../src/constants/constants";
import * as mocks from '../../src/constants/mockUsers';
import { getOrganizationIdByName, eliminateOrganization } from "../../src/supabase/organization/organization";

describe('E2E Flow: E-1 Entry', () => {

    const mockOrganization = mocks.mockOrganizacionToCreate;

    it('should create new Organization', () => {
        cy.visit(`http://localhost:5173${constants.root}`);
        cy.contains('Crear organización').click();
        cy.url().should('include', '/CrearOrganizacion');

        cy.get('input[name="nombreOrganizacion"]').type(mockOrganization.name);
        cy.get('input[name="nipNia"]').type(mockOrganization.nip);
        cy.get('input[name="password"]').type(mockOrganization.password);
        cy.get('input[name="repeatPassword"]').type(mockOrganization.password);
        
        cy.get('button').contains('Crear').should('not.be.disabled');
        cy.get('button').contains('Crear').click();
        cy.url().should('include', '/OrganizacionMenu');
        // Logout
    });

    it('should login with new Organization', () => {});

    it('should create new Student', () => {});

    it('should create new Teacher', () => {});

    it('should create new Course', () => {});

    it('should login with new Student and logout', () => {});

    it('should login with new Teacher and logout', () => {});

    it('should login with new Course and logout', () => {});

    after(() => {
        //login como organización y elimina los usuarios previamente creados
        cy.getSupabaseConfig().then(async ({ url, anonKey }) => {
            expect(url).to.exist;
            expect(anonKey).to.exist;
            // Lógica con Supabase
            const organization_id = await getOrganizationIdByName(mockOrganization.name);
            if (organization_id !== null && organization_id !== undefined) await eliminateOrganization(organization_id);
          });
    })
});