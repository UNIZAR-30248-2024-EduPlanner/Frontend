import constants from "../../src/constants/constants";

describe('Caso de Uso: Registrarse como Organización', () => {
    beforeEach(() => {
      // Navegar a la página de login
      cy.visit(`http://localhost:5173${constants.root}`);
    });
  
    it('E2E Flow: Create new Organization and Create New Student', () => {
        cy.contains('Crear organización').click();
        cy.url().should('include', '/CrearOrganizacion');
  
        cy.get('input[name="nombreOrganizacion"]').type('Mi Organización Test');
        cy.get('input[name="dominioCorreo"]').type('miorgtest.com');
        cy.get('input[name="nipNia"]').type('112233');
        cy.get('input[name="dominioOrganizacion"]').type('mi-dom-122233');
        cy.get('input[name="password"]').type('passwordSegura123');
        cy.get('input[name="repeatPassword"]').type('passwordSegura123');
        
        cy.get('button').contains('Crear').should('not.be.disabled');
        cy.get('button').contains('Crear').click();
        cy.url().should('include', '/OrganizacionMenu');
    });
  
    it('Debería mostrar un mensaje de error si el formulario está incompleto', () => {
        cy.contains('Crear organización').click();
    
        cy.get('input[name="nombreOrganizacion"]').type('Mi Organización');
        cy.get('input[name="password"]').type('passwordSegura123');
        cy.get('button').contains('Crear').click();
        
        cy.get('p').should('contain', 'Uno o varios campos están vacíos.');
        cy.url().should('include', '/CrearOrganizacion');
    });
  
    it('Debería mostrar un mensaje de error si las contraseñas no coinciden', () => {
        cy.contains('Crear organización').click();
  
        cy.get('input[name="nombreOrganizacion"]').type('Mi Organización');
        cy.get('input[name="dominioCorreo"]').type('miorganizacion.com');
        cy.get('input[name="nipNia"]').type('123456');
        cy.get('input[name="dominioOrganizacion"]').type('mi-dom-123');
        cy.get('input[name="password"]').type('passwordSegura123');
        cy.get('input[name="repeatPassword"]').type('otraPassword123');
        cy.get('button').contains('Crear').click();
  
        cy.get('p').should('contain', 'Las contraseñas no coinciden.');
        cy.url().should('include', '/CrearOrganizacion');
    });
  });
  