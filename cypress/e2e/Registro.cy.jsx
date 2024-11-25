import constants from "../../src/constants/constants";

const mockOrganization = {
    name: 'Mi Organización Test',
    nip: '112233',
    domain: 'mi-dom-122233',
    emailDomain: 'miorgtest.com',
    password: 'passwordSegura123',
};

describe('E2E Flow: Create new Organization and Create New Student', () => {
    beforeEach(() => {
      // Navegar a la página de login
      cy.visit(`http://localhost:5173${constants.root}`);
    });
  
    it('should create new Organization', () => {
        cy.contains('Crear organización').click();
        cy.url().should('include', '/CrearOrganizacion');
  
        cy.get('input[name="nombreOrganizacion"]').type(mockOrganization.name);
        cy.get('input[name="dominioCorreo"]').type(mockOrganization.emailDomain);
        cy.get('input[name="nipNia"]').type(mockOrganization.nip);
        cy.get('input[name="dominioOrganizacion"]').type(mockOrganization.domain);
        cy.get('input[name="password"]').type(mockOrganization.password);
        cy.get('input[name="repeatPassword"]').type(mockOrganization.password);
        
        cy.get('button').contains('Crear').should('not.be.disabled');
        cy.get('button').contains('Crear').click();
        cy.url().should('include', '/OrganizacionMenu');
    });
  
    it('should show error message when invalid form', () => {
        cy.contains('Crear organización').click();
    
        cy.get('input[name="nombreOrganizacion"]').type('Mi Organización');
        cy.get('input[name="password"]').type('passwordSegura123');
        cy.get('button').contains('Crear').click();
        
        cy.get('p').should('contain', 'Uno o varios campos están vacíos.');
        cy.url().should('include', '/CrearOrganizacion');
    });
  
    it('should show error message when password different from repeatPassword', () => {
        cy.contains('Crear organización').click();
  
        cy.get('input[name="nombreOrganizacion"]').type(mockOrganization.name);
        cy.get('input[name="dominioCorreo"]').type(mockOrganization.emailDomain);
        cy.get('input[name="nipNia"]').type(mockOrganization.nip);
        cy.get('input[name="dominioOrganizacion"]').type(mockOrganization.domain);
        cy.get('input[name="password"]').type(mockOrganization.password);
        cy.get('input[name="repeatPassword"]').type('incorrectRepeatPassword');
        cy.get('button').contains('Crear').click();
  
        cy.get('p').should('contain', 'Las contraseñas no coinciden.');
        cy.url().should('include', '/CrearOrganizacion');
    });
  });
  