// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
import constants from "../../src/constants/constants";

// Use of supabase functions
Cypress.Commands.add('getSupabaseConfig', () => {
    return {
      url: Cypress.env('SUPABASE_URL'),
      anonKey: Cypress.env('SUPABASE_ANON_KEY'),
    };
});

// Login as Organization
Cypress.Commands.add("loginAsOrganization", (mockOrganization) => {
  cy.get("button").contains("Iniciar sesión").click();
  cy.url().should("include", "/IniciarSesion");
  cy.get("select").first().select("Organizacion");
  cy.get("select").eq(1).select(mockOrganization.name);
  cy.get("input[name='nia/nip']").type(mockOrganization.nip);
  cy.get("input[name='password']").type(mockOrganization.password);
  cy.get("button").contains("Enviar").click();
  cy.url().should("include", "/OrganizacionMenu");
});

// Login as user
Cypress.Commands.add("loginAsUser", (type, mockOrganization, mockUser) => {
  const select = type === 'alumnos' ? 'Alumno' : type === 'profesores' ? 'Profesor' : 'Curso';
  cy.get("button").contains("Iniciar sesión").click();
  cy.url().should("include", "/IniciarSesion");
  cy.get("select").first().select(select);
  cy.get("select").eq(1).select(mockOrganization.name);
  cy.get("input[name='nia/nip']").type(mockUser.nip);
  cy.get("input[name='password']").type(mockUser.password);
  cy.get("button").contains("Enviar").click();
  type === 'cursos' ? cy.url().should("include", "/CursoMenu") : cy.url().should("include", "/Calendario");
});

// Logout
Cypress.Commands.add("logout", () => {
  cy.get('[data-testid="logout"]').click();
  cy.url().should("include", `http://localhost:5173${constants.root}`);
});

// Create User as Organization (only works for single user in list)
Cypress.Commands.add("createUserAsOrganization", (type, mockData) => {
  const tab = type.charAt(0).toUpperCase() + type.slice(1);

  cy.get("div.tabs-org").contains(tab).click();
  cy.get(".create-button").should("exist").click();
  cy.url().should("include", `/OrganizacionCrear/${type}`);
  
  // Fill the form and create a new user
  cy.get("input[name='name']").type(mockData.name);
  cy.get("input[name='nip/nia']").type(mockData.nip);
  cy.get("input[name='password']").type(mockData.password);
  cy.get("button").contains("Crear").click();
  cy.get("button").contains("Aceptar").click();
  cy.url().should("include", "/OrganizacionMenu");
});

// Edit User as Organization (only works for single user in list)
Cypress.Commands.add("editUserAsOrganization", (type, mockData) => {
  const tab = type.charAt(0).toUpperCase() + type.slice(1);
  const editName = mockData.name + " editado";

  cy.get("div.tabs-org").contains(tab).click();
  cy.get("button.edit").click();
  cy.url().should("include", `/OrganizacionModificar/${type}`);
  
  // Fill the form and create a new user
  cy.get("input[name='nombre']").clear();
  cy.get("input[name='nombre']").type(editName);
  cy.get("input[name='password']").type(mockData.password);
  cy.get("button").contains("Modificar").click();
  cy.url().should("include", "/OrganizacionMenu");
});

// Delete User as Organization (only works for single user in list)
Cypress.Commands.add("deleteUserAsOrganization", (type) => {
  const tab = type.charAt(0).toUpperCase() + type.slice(1);

  cy.get("div.tabs-org").contains(tab).click();
  cy.get("button.trash").click();
  cy.get("button").contains("Aceptar").click();
  cy.url().should("include", `/OrganizacionMenu`);
});

// Create Subject as Course (only works for single user in list)
Cypress.Commands.add("createSubjectAsCourse", (mockData) => {
  cy.get(".create-button").should("exist").click();
  cy.url().should("include", `/CursoCrear/asignaturas`);
  
  // Fill the form and create a new user
  cy.get("input[name='name']").type(mockData.name);
  cy.get("input[name='nip']").type(mockData.code);
  cy.get("button").contains("Crear").click();
  cy.get("button").contains("Aceptar").click();
  cy.url().should("include", "/CursoMenu");
});

// Edit Subject as Course (only works for single user in list)
Cypress.Commands.add("editSubjectAsCourse", (mockData) => {
  const editName = mockData.name + " editado";

  cy.get("button.edit").click();
  cy.url().should("include", `/CursoModificar/asignaturas`);
  
  // Fill the form and create a new user
  cy.get("input[name='name']").clear();
  cy.get("input[name='name']").type(editName);
  cy.get("button").contains("Modificar").click();
  cy.url().should("include", "/CursoMenu");
});

// Delete Subject as Course (only works for single user in list)
Cypress.Commands.add("deleteSubjectAsCourse", () => {
  cy.get("button.trash").click();
  cy.get("button").contains("Aceptar").click();
  cy.url().should("include", `/CursoMenu`);
});

// Enrolls a Student or a Teacher into a Subject 
Cypress.Commands.add("enrollUserIntoSubject", (nip) => {
  cy.get('[data-testid="create"]').click();
  cy.url().should("include", `/Matriculas/Add`);
  cy.get("input[name='nip']").type(nip);
  cy.get("button").contains("Buscar").click();
  cy.get('.found').should('be.visible');
  cy.get("button").contains("Añadir").click();
  cy.url().should("include", `/Matriculas`);
});