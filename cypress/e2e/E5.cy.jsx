import constants from "../../src/constants/constants";
import { unenrollStudent  } from "../../src/supabase/student/student"; 
import {unassignSubjectFromTeacher} from "../../src/supabase/teacher/teacher";

describe('E2E Flow: E-5 Entry', () => {
    beforeEach(() => {
        unenrollStudent(819304, 323);
        unassignSubjectFromTeacher(6292, 323);
        cy.visit(`http://localhost:5173${constants.root}`);
    });

    it('should login as a course and enroll/assing a student/teacher in a course ', () => {
        const mockOrganization = { name: 'Organization A' };
        const mockUser = { name: 'Course Test' , nip: '333333', password: 'coursepass' };
    
        cy.loginAsUser('Curso', mockOrganization, mockUser);
        cy.enrollAssingStudentTeacherSubject(819304);
        cy.enrollAssingStudentTeacherSubject(6292);
    });

});