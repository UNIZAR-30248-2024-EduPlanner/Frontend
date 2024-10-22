import constants from "../../src/constants/constants";

const testOrganization = {
    name: 'Organization A',
    nip: 123456789,
    pass: 'password'
};

describe("Home Component e2e Tests", () => {
    beforeEach(() => {
        cy.visit(`http://localhost:5173${constants.root}`);
    });

    it("should navigate to Login page, insert credentials, login as Organization and logout", () => {
        cy.get("button").contains("Iniciar sesión").click();
        cy.url().should("include", "/IniciarSesion");
        
        // Seleccionar el tipo de usuario (Organización)
        cy.get("select").first().select('Organizacion');

        // Seleccionar la organización
        cy.get("select").eq(1).select(testOrganization.name);

        // Ingresar NIA/NIP y contraseña
        cy.get("input[name='nia/nip']").type(testOrganization.nip);
        cy.get("input[name='password']").type(testOrganization.pass);

        cy.get("button").contains("Enviar").click();

        // Verificar que la URL cambie a la página de inicio después del login
        cy.url().should("include", "/OrganizacionMenu");

        // Cerrar sesión
        cy.get(".logout-container").click();

        // Verificar que la URL cambie a la página de inicio después del logout
        cy.url().should("include", "/EduPlanner");
    });
});