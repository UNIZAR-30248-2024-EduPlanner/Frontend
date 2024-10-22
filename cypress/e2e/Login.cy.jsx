import constants from "../../src/constants/constants";

const testOrganization = {
    name: 'Organization A',
    nip: 123456789,
    pass: 'password'
};

describe("E2E Flow: Login as Organization", () => {
    beforeEach(() => {
        cy.visit(`http://localhost:5173${constants.root}`);
    });

    it("should navigate to Login page, insert credentials, login as Organization and logout", () => {
        cy.get("button").contains("Iniciar sesión").click();
        cy.url().should("include", "/IniciarSesion");
        
        cy.get("select").first().select('Organizacion');

        cy.get("select").eq(1).select(testOrganization.name);

        cy.get("input[name='nia/nip']").type(testOrganization.nip);
        cy.get("input[name='password']").type(testOrganization.pass);

        cy.get("button").contains("Enviar").click();

        cy.url().should("include", "/OrganizacionMenu");

        cy.get(".logout-container").click();

        cy.url().should("include", "/EduPlanner");
    });
});