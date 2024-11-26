// src/api/course.js
import { supabase } from '../supabaseClient.js';

// Función para iniciar sesión (login) de un curso
export const loginCourse = async (nip, pass) => {
    const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('nip', nip)
        .eq('pass', pass)
        .eq('role', 'course') // Asegúrate de que sea un curso
        .single();

    if (error) {
        console.error("Error al iniciar sesión en el curso:", error);
        return { data: null, error }; // Devolver objeto con error
    }

    return { data: !!data, error: null }; // Devuelve true si hay datos (curso encontrado), false de lo contrario
};

// Función para registrar un nuevo curso
export const registerCourse = async (name, nip, pass, organization_id) => {
    const { data, error } = await supabase
        .from('users')
        .insert([{
            name,
            nip,
            pass, // Almacena la contraseña de forma segura en producción
            role: 'course',
            organization_id, // Relación con la organización a la que pertenece
        }]);

    return { data, error }; // Devuelve tanto 'data' como 'error' para una respuesta consistente
};

// Función para registrar un array de cursos
export const registerArrayCourses = async (courses, organization_id) => {
    try {
        const coursesWithOrgId = courses.map(course => ({
            ...course,
            role: 'course',
            organization_id,
        }));

        const { error } = await supabase
            .from('users')
            .insert(coursesWithOrgId);

        if (error) {
            console.error('Error al insertar los cursos:', error);
            return { data: null, error }; // Devolver objeto con error
        }

        console.log('Cursos insertados correctamente:', coursesWithOrgId);
        return { data: true, error: null }; // Devuelve true si se insertaron correctamente
    } catch (err) {
        console.error('Ha ocurrido un error:', err);
        return { data: null, error: err }; // Devolver objeto con error
    }
};

// Función para registrar un array de asignaturas
export const registerArraySubject = async (subjects, course_id) => {
    try {
        const subjectsWithOrgId = subjects.map(subjects => ({
            ...subjects,
            course_id,
        }));

        const { error } = await supabase
            .from('subjects')
            .insert(subjectsWithOrgId);

        if (error) {
            console.error('Error al insertar los cursos:', error);
            return { data: null, error }; // Devolver objeto con error
        }

        console.log('Cursos insertados correctamente:', subjectsWithOrgId);
        return { data: true, error: null }; // Devuelve true si se insertaron correctamente
    } catch (err) {
        console.error('Ha ocurrido un error:', err);
        return { data: null, error: err }; // Devolver objeto con error
    }
};

// Función para obtener todas las asignaturas que posee un curso
export const getAllSubjects = async (courseId) => {
    const { data, error } = await supabase
        .from('subjects')
        .select('*')
        .eq('course_id', courseId);

    return { data, error }; // Devolver tanto 'data' como 'error' para una respuesta consistente
};

// Función para crear una asignatura
export const createSubject = async (subjectName, subjectCode, courseId) => {
    const { data, error } = await supabase
        .from('subjects')
        .insert([{ name: subjectName, subject_code: subjectCode, course_id: courseId }]);

    return { data, error }; // Devolver tanto 'data' como 'error' para una respuesta consistente
};

// Función para eliminar una asignatura
export const eliminateSubject = async (subjectId) => {
    const { data, error } = await supabase
        .from('subjects')
        .delete()
        .eq('id', subjectId);

    return { data, error }; // Devolver tanto 'data' como 'error' para una respuesta consistente
};

// Función para editar una asignatura
export const editSubject = async (subjectId, updates) => {
    const { data, error } = await supabase
        .from('subjects')
        .update(updates)
        .eq('id', subjectId);

    return { data, error }; // Devolver tanto 'data' como 'error' para una respuesta consistente
};

// Función para obtener el ID del curso por NIP
export const getCourseIdByNIP = async (nip) => {
    const { data, error } = await supabase
        .from('users')
        .select('id')
        .eq('nip', nip)
        .eq('role', 'course')
        .single();

    if (error) {
        console.error("Error al obtener el ID del curso:", error);
        return { data: null, error }; // Devolver objeto con error
    }

    return { data: data?.id, error: null }; // Devuelve el ID del curso, null si no se encontró
};

// Función para obtener el ID de la asignatura por código
export const getSubjectIdByCode = async (subject_code) => {
    const { data, error } = await supabase
        .from('subjects')
        .select('id')
        .eq('subject_code', subject_code)
        .single();

    if (error) {
        console.error("Error al obtener el ID de la asignatura:", error);
        return { data: null, error }; // Devolver objeto con error
    }

    return { data: data?.id, error: null }; // Devuelve el ID de la asignatura, null si no se encontró
};

// Función para obtener la información de una asignatura por ID
export const getSubjectById = async (subjectId) => {
    const { data, error } = await supabase
        .from('subjects')
        .select('*')
        .eq('id', subjectId)
        .single().select();

    console.log('Información de la asignatura: ', data);

    return { data, error }; // Devolver tanto 'data' como 'error' para una respuesta consistente
};

// Función para que un usuario curso pueda asociar una asignatura a un alumno
export const assignSubjectToStudent = async (nip, subjectCode, organization_id) => {
    const student = await supabase
        .from('users')
        .select('id')
        .eq('nip', nip)
        .eq('role', 'student')
        .eq('organization_id', organization_id)
        .single().select();

    if (student.error) {
        console.error('Error al obtener el ID del estudiante:', student.error);
        return { data: null, error: student.error };
    }

    const subject = await supabase
        .from('subjects')
        .select('id')
        .eq('subject_code', subjectCode)
        .single().select();

    console.log('Información de la asignatura:', subject.data);

    if (subject.error) {
        console.error('Error al obtener el ID de la asignatura:', subject.error);
        return { data: null, error: subject.error };
    }

    const { data, error } = await supabase
        .from('enrollments')
        .insert([{ student_id: student.data.id, subject_id: subject.data.id }]).single().select();


    if (error) {
        console.error('Error al asignar la asignatura al estudiante:', error);
        return { data: null, error };
    }

    console.log('Asignatura insertada al estudiante correctamente:', data);
    return { data, error: null };
};

// Función para que un usuario curso pueda asociar una asignatura a un profesor
export const assignSubjectToTeacher = async (nip, subjectCode, organization_id) => {
    const teacher = await supabase
        .from('users')
        .select('id')
        .eq('nip', nip)
        .eq('role', 'teacher')
        .eq('organization_id', organization_id)
        .single().select();

    if (teacher.error) {
        console.error('Error al obtener el ID del profesor:', teacher.error);
        return { data: null, error: teacher.error };
    }

    const subject = await supabase
        .from('subjects')
        .select('id')
        .eq('subject_code', subjectCode)
        .single().select();

    console.log('Información de la asignatura:', subject.data);

    if (subject.error) {
        console.error('Error al obtener el ID de la asignatura:', subject.error);
        return { data: null, error: subject.error };
    }

    const { data, error } = await supabase
        .from('teachings')
        .insert([{ teacher_id: teacher.data.id, subject_id: subject.data.id }]).single().select();


    if (error) {
        console.error('Error al asignar la asignatura al profesor:', error);
        return { data: null, error };
    }

    console.log('Asignatura insertada al profesor correctamente:', data);
    return { data, error: null };
};

// Función para asociar a un array de estudiantes a una asignatura
export const assignArrayStudentsToSubject = async (studentsNIP, subjectCode) => {
    try {
        const studentsId = studentsNIP.map(nip => supabase
            .from('users')
            .select('id')
            .eq('nip', nip)
            .eq('role', 'student')
            .single().select()); // TODO - FIX

        const studentsWithSubjectId = studentsId.map(id => ({
            student_id: id.data.id,
            subject_code: subjectCode,
        }));

        const { data, error } = await supabase
            .from('enrollments')
            .insert(studentsWithSubjectId);

        if (error) {
            console.error('Error al insertar los estudiantes en la asignatura:', error);
            return { data: null, error }; // Devolver objeto con error
        }

        console.log('Estudiantes insertados correctamente en la asignatura:', studentsWithSubjectId);
        return { data, error: null }; // Devuelve true si se insertaron correctamente
    } catch (err) {
        console.error('Ha ocurrido un error:', err);
        return { data: null, error: err }; // Devolver objeto con error
    }
};

// Función para asignar a un array de profesores a una asignatura
export const assignArrayTeachersToSubject = async (teachers, subjectCode) => {
    try {
        const teachersWithSubjectId = teachers.map(teacher => ({
            ...teacher,
            role: 'teacher',
            subject_code: subjectCode,
        }));

        const { data, error } = await supabase
            .from('teachings')
            .insert(teachersWithSubjectId);

        if (error) {
            console.error('Error al insertar los profesores en la asignatura:', error);
            return { data: null, error }; // Devolver objeto con error
        }

        console.log('Profesores insertados correctamente en la asignatura:', teachersWithSubjectId);
        return { data, error: null }; // Devuelve true si se insertaron correctamente
    } catch (err) {
        console.error('Ha ocurrido un error:', err);
        return { data: null, error: err }; // Devolver objeto con error
    }
};
