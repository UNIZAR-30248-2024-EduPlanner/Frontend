import constants from "../../src/constants/constants";

const testOrganization = {
    name: 'Organization A',
    nip: 123456789,
    pass: 'password'
};

const newStudent = {
    name: 'Tester Student',
    nip: 987564321,
    password: 'testerpass'
};

describe("E2E Flow: Login as Organization and Create New Student", () => {
    beforeEach(() => {
        cy.visit(`http://localhost:5173${constants.root}`);
    });

    it("should login, navigate to create student page, fill the form and create a new student", () => {
        cy.get("button").contains("Iniciar sesión").click();
        cy.url().should("include", "/IniciarSesion");

        cy.get("select").first().select('Organizacion');

        cy.get("select").eq(1).select(testOrganization.name);

        cy.get("input[name='nia/nip']").type(testOrganization.nip);
        cy.get("input[name='password']").type(testOrganization.pass);

        cy.get("button").contains("Enviar").click();

        cy.url().should("include", "/OrganizacionMenu");

        cy.get("div.tabs-org").contains("Alumnos").click();
        cy.get(".create-button").should("exist").click();
        cy.url().should("include", "/OrganizacionCrear/alumnos");

        cy.get("input[name='name']").type(newStudent.name);
        cy.get("input[name='nip/nia']").type(newStudent.nip);
        cy.get("input[name='password']").type(newStudent.password);

        cy.get("button").contains("Crear").click();

        cy.get("button").contains("Aceptar").click();
        cy.url().should("include", "/OrganizacionMenu");
    });
});