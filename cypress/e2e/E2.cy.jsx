import constants from "../../src/constants/constants";
import * as mocks from '../../src/constants/mockUsers';
import { eliminateCourse, eliminateStudent, eliminateTeacher, getOrganizationIdByName, getUserIdByNIP } from "../../src/supabase/organization/organization";

describe('E2E Flow: E-2 Entry', () => {

    const mockOrganization = mocks.mockOrganization;
    const mockStudent = mocks.mockStudent;
    const mockTeacher = mocks.mockTeacher;
    const mockCourse = mocks.mockCourse;

    beforeEach(() => {
        cy.visit(`http://localhost:5173${constants.root}`);
    });

    it('should login with Tester Organization and create new Student, Teacher and Course', () => {
        cy.loginAsOrganization(mockOrganization);
        cy.createUserAsOrganization('alumnos', mockStudent);
        cy.createUserAsOrganization('profesores', mockTeacher);
        cy.createUserAsOrganization('cursos', mockCourse);
    });

    it('should login with Tester Organization and edit new Student, Teacher and Course', () => {
        cy.loginAsOrganization(mockOrganization);
        cy.editUserAsOrganization('alumnos', mockStudent);
        cy.editUserAsOrganization('profesores', mockTeacher);
        cy.editUserAsOrganization('cursos', mockCourse);
    });

    after(() => {
        cy.getSupabaseConfig().then(async ({ url, anonKey }) => {
            expect(url).to.exist;
            expect(anonKey).to.exist;
            // Lógica con Supabase
            const organization_id = await getOrganizationIdByName(mockOrganization.name);
            const teacher_id = await getUserIdByNIP(mockTeacher.nip, organization_id);
            await eliminateTeacher(teacher_id);
            const student_id = await getUserIdByNIP(mockStudent.nip, organization_id);
            await eliminateStudent(student_id);
            const course_id = await getUserIdByNIP(mockCourse.nip, organization_id);
            await eliminateCourse(course_id);
          });
    })
});