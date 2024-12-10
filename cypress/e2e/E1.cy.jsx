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
        // Login with new Organization
        cy.get("button").contains("Iniciar sesión").click();
        cy.url().should("include", "/IniciarSesion");
        cy.get("select").first().select('Organizacion');
        cy.get("select").eq(1).select(mockOrganization.name);
        cy.get("input[name='nia/nip']").type(mockOrganization.nip);
        cy.get("input[name='password']").type(mockOrganization.password);
        cy.get("button").contains("Enviar").click();
        cy.url().should("include", "/OrganizacionMenu");
        // Create new Student
        cy.get("div.tabs-org").contains("Alumnos").click();
        cy.get(".create-button").should("exist").click();
        cy.url().should("include", "/OrganizacionCrear/alumnos");
        // Fill the form and create a new student
        cy.get("input[name='name']").type(mockStudent.name);
        cy.get("input[name='nip/nia']").type(mockStudent.nip);
        cy.get("input[name='password']").type(mockStudent.password);
        cy.get("button").contains("Crear").click();
        cy.get("button").contains("Aceptar").click();
        cy.url().should("include", "/OrganizacionMenu");
        // Create new Teacher
        cy.get("div.tabs-org").contains("Profesores").click();
        cy.get(".create-button").should("exist").click();
        cy.url().should("include", "/OrganizacionCrear/profesores");
        // Fill the form and create new teacher
        cy.get("input[name='name']").type(mockTeacher.name);
        cy.get("input[name='nip/nia']").type(mockTeacher.nip);
        cy.get("input[name='password']").type(mockTeacher.password);
        cy.get("button").contains("Crear").click();
        cy.get("button").contains("Aceptar").click();
        cy.url().should("include", "/OrganizacionMenu");
        // Create new Course
        cy.get("div.tabs-org").contains("Cursos").click();
        cy.get(".create-button").should("exist").click();
        cy.url().should("include", "/OrganizacionCrear/cursos");
        // Fill the form and create new course
        cy.get("input[name='name']").type(mockCourse.name);
        cy.get("input[name='nip/nia']").type(mockCourse.nip);
        cy.get("input[name='password']").type(mockCourse.password);
        cy.get("button").contains("Crear").click();
        cy.get("button").contains("Aceptar").click();
        cy.url().should("include", "/OrganizacionMenu");
    });

    it('should login with new Student', () => {
        // Login with new Student
        cy.get("button").contains("Iniciar sesión").click();
        cy.url().should("include", "/IniciarSesion");
        cy.get("select").first().select('Alumno');
        cy.get("select").eq(1).select(mockOrganization.name);
        cy.get("input[name='nia/nip']").type(mockStudent.nip);
        cy.get("input[name='password']").type(mockStudent.password);
        cy.get("button").contains("Enviar").click();
        cy.url().should("include", "/Calendario");
    });

    it('should login with new Teacher', () => {
        // Login with new Teacher
        cy.get("button").contains("Iniciar sesión").click();
        cy.url().should("include", "/IniciarSesion");
        cy.get("select").first().select('Profesor');
        cy.get("select").eq(1).select(mockOrganization.name);
        cy.get("input[name='nia/nip']").type(mockTeacher.nip);
        cy.get("input[name='password']").type(mockTeacher.password);
        cy.get("button").contains("Enviar").click();
        cy.url().should("include", "/Calendario");
    });

    it('should login with new Course', () => {
        // Login with new Course
        cy.get("button").contains("Iniciar sesión").click();
        cy.url().should("include", "/IniciarSesion");
        cy.get("select").first().select('Curso');
        cy.get("select").eq(1).select(mockOrganization.name);
        cy.get("input[name='nia/nip']").type(mockCourse.nip);
        cy.get("input[name='password']").type(mockCourse.password);
        cy.get("button").contains("Enviar").click();
        cy.url().should("include", "/CursoMenu");
    });

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