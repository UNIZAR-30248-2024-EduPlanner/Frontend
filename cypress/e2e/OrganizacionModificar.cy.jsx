import constants from "../../src/constants/constants";

const testOrganization = {
    name: 'Organization A',
    nip: 123456789,
    pass: 'password'
};

describe('E2E Flow: Update a course', () => {
  
    beforeEach(() => {
      cy.visit(`http://localhost:5173${constants.root}`);  
    });
  
    it('should update a student from OrganizacionMenu', () => {
        cy.get("button").contains("Iniciar sesión").click();
        cy.url().should("include", "/IniciarSesion");
        
        cy.get("select").first().select('Organizacion');
        cy.get("select").eq(1).select(testOrganization.name);
        cy.get("input[name='nia/nip']").type(testOrganization.nip);
        cy.get("input[name='password']").type(testOrganization.pass);
        cy.get("button").contains("Enviar").click();
        cy.url().should("include", "/OrganizacionMenu");

        cy.get('.edit').contains('Curso editado').click();
    
        cy.url().should('include', '/OrganizacionModificar');
        
        cy.get('input[name="nombre"]').clear().type('Curso editado');
        cy.get('input[name="nip/nia"]').clear().type('132465');
        cy.get('input[name="password"]').clear().type('password465');
        cy.get('button').contains('Modificar').click();
    
        cy.url().should('include', '/OrganizacionMenu');
    });
  
    it('should show error message when invalid form', () => {
        cy.get("button").contains("Iniciar sesión").click();
        cy.url().should("include", "/IniciarSesion");
        
        cy.get("select").first().select('Organizacion');
        cy.get("select").eq(1).select(testOrganization.name);
        cy.get("input[name='nia/nip']").type(testOrganization.nip);
        cy.get("input[name='password']").type(testOrganization.pass);
        cy.get("button").contains("Enviar").click();
        cy.url().should("include", "/OrganizacionMenu");

        cy.get('.edit').first().click();
    
        cy.get('input[name="nombre"]').clear(); 
        cy.get('input[name="nip/nia"]').clear().type('inválidoNIP');
        cy.get('input[name="password"]').clear().type('123');
    
        cy.get('button').contains('Modificar').click();
    
        cy.contains('Uno o varios campos están vacíos.');
        cy.get('input[name="nombre"]').clear().type('Curso editado'); 
        cy.get('button').contains('Modificar').click();
        cy.contains('El NIP/NIA debe ser numérico.');
        cy.get('input[name="nip/nia"]').clear().type('123456');
        cy.get('button').contains('Modificar').click();
        cy.contains('La contraseña debe tener al menos 6 caracteres.');    
    });
  });
  