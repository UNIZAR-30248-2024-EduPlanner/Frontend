// src/api/organization.js
import { supabase } from './supabaseClient'; // Asegúrate de tener el cliente Supabase configurado

/**
 * Registra una nueva organización
 * @param {string} name - Nombre de la organización
 * @param {number} nip - Código único de la organización
 * @param {string} password - Contraseña de la organización
 * @returns {Promise<{ data: any, error: any }>}
 */
export const register = async (name, nip, password) => {
    const { data, error } = await supabase
        .from('users')
        .insert([{ name, nip, pass: password, role: 'organization' }]);

    // Verificar si hubo un error en la inserción
    if (error) {
        console.error('Error al registrar usuario:', error); // Imprimir el error para depuración
        return { data: null, error: { message: error.message || 'Error desconocido', code: error.code || 'sin código' } };
    }


    return { data, error: null }; // Retornar la data si todo salió bien
};

//



/**
 * Inicia sesión como organización
 * @param {number} nip - Código único de la organización
 * @param {string} password - Contraseña de la organización
 * @returns {Promise<{ data: any, error: any }>}
 */
export const login = async (nip, password) => {
    const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('nip', nip)
        .eq('pass', password)
        .single();
    return { data, error };
};

/**
 * Obtiene todos los cursos de la organización
 * @param {number} organizationId - ID de la organización
 * @returns {Promise<{ data: any, error: any }>}
 */
export const getAllCourses = async (organizationId) => {
    const { data, error } = await supabase
        .from('courses')
        .select('*')
        .eq('organization_id', organizationId);
    return { data, error };
};

/**
 * Crea un nuevo curso
 * @param {string} courseName - Nombre del curso
 * @param {number} organizationId - ID de la organización
 * @param {number} courseUserId - ID del usuario del curso
 * @returns {Promise<{ data: any, error: any }>}
 */
export const createCourse = async (courseName, organizationId, courseUserId) => {
    const { data, error } = await supabase
        .from('courses')
        .insert([{ course_name: courseName, organization_id: organizationId, course_user_id: courseUserId }]);
    return { data, error };
};

/**
 * Elimina un curso
 * @param {number} courseId - ID de la relacion que se ha creado al asignar un curso a una organización
 * @returns {Promise<{ data: any, error: any }>}
 */
export const eliminateCourse = async (courseId) => {
    const { data, error } = await supabase
        .from('courses')
        .delete()
        .eq('id', courseId);
    return { data, error };
};

/**
 * Edita un curso
 * @param {number} courseId - ID del curso
 * @param {object} updates - Objetos con actualizaciones
 * @returns {Promise<{ data: any, error: any }>}
 */
export const editCourse = async (courseId, updates) => {
    const { data, error } = await supabase
        .from('courses')
        .update(updates)
        .eq('id', courseId);
    return { data, error };
};

/**
 * Obtiene todos los estudiantes de la organización
 * @param {number} organizationId - ID de la organización
 * @returns {Promise<{ data: any, error: any }>}
 */
export const getAllStudents = async (organizationId) => {
    // Paso 1: Obtener todos los cursos de la organización
    const { data: courses, error: courseError } = await supabase
        .from('courses')
        .select('id')
        .eq('organization_id', organizationId);

    if (courseError) {
        return { data: null, error: courseError };
    }

    // Paso 2: Obtener todos los subject_ids de los cursos
    const courseIds = courses.map(course => course.id);
    const { data: subjects, error: subjectError } = await supabase
        .from('subjects')
        .select('id')
        .in('course_id', courseIds);

    if (subjectError) {
        return { data: null, error: subjectError };
    }

    // Paso 3: Obtener todos los student_ids de las asignaturas
    const subjectIds = subjects.map(subject => subject.id);
    const { data: enrollments, error: enrollmentError } = await supabase
        .from('enrollments')
        .select('student_id')
        .in('subject_id', subjectIds);

    if (enrollmentError) {
        return { data: null, error: enrollmentError };
    }

    // Paso 4: Obtener la información de los estudiantes
    const studentIds = enrollments.map(enrollment => enrollment.student_id);
    const { data: students, error: studentError } = await supabase
        .from('users')
        .select('*')
        .in('id', studentIds);

    return { data: students, error: studentError };
};


/**
 * Crea un nuevo estudiante
 * @param {string} name - Nombre del estudiante
 * @param {number} nip - Código único del estudiante
 * @param {string} password - Contraseña del estudiante
 * @returns {Promise<{ data: any, error: any }>}
 */
export const createStudent = async (name, nip, password) => {
    const { data, error } = await supabase
        .from('users')
        .insert([{ name, nip, pass: password, role: 'student' }]);
    return { data, error };
};

/**
 * Elimina un estudiante
 * @param {number} studentId - ID del estudiante
 * @returns {Promise<{ data: any, error: any }>}
 */
export const eliminateStudent = async (studentId) => {
    const { data, error } = await supabase
        .from('Uuers')
        .delete()
        .eq('id', studentId);
    return { data, error };
};

/**
 * Edita un estudiante
 * @param {number} studentId - ID del estudiante
 * @param {object} updates - Objetos con actualizaciones
 * @returns {Promise<{ data: any, error: any }>}
 */
export const editStudent = async (studentId, updates) => {
    const { data, error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', studentId);
    return { data, error };
};

/**
 * Obtiene todos los profesores de la organización
 * @param {number} organizationId - ID de la organización
 * @returns {Promise<{ data: any, error: any }> }
 */
export const getAllTeachers = async (organizationId) => {
    // Paso 1: Obtener todos los cursos de la organización
    const { data: courses, error: courseError } = await supabase
        .from('courses')
        .select('id')
        .eq('organization_id', organizationId);

    if (courseError) {
        return { data: null, error: courseError };
    }

    // Paso 2: Obtener todos los subject_ids de los cursos
    const courseIds = courses.map(course => course.id);
    const { data: subjects, error: subjectError } = await supabase
        .from('subjects')
        .select('id')
        .in('course_id', courseIds);

    if (subjectError) {
        return { data: null, error: subjectError };
    }

    // Paso 3: Obtener todos los teacher_ids de las asignaturas
    const subjectIds = subjects.map(subject => subject.id);
    const { data: teachings, error: teachingError } = await supabase
        .from('teachings')
        .select('teacher_id')
        .in('subject_id', subjectIds);

    if (teachingError) {
        return { data: null, error: teachingError };
    }

    // Paso 4: Obtener la información de los profesores
    const teacherIds = teachings.map(teaching => teaching.teacher_id);
    const { data: teachers, error: teacherError } = await supabase
        .from('users')
        .select('*')
        .in('id', teacherIds);

    return { data: teachers, error: teacherError };
};

/**
 * Crea un nuevo profesor
 * @param {string} name - Nombre del profesor
 * @param {number} nip - Código único del profesor
 * @param {string} password - Contraseña del profesor
 * @returns {Promise<{ data: any, error: any }>}
 */
export const createTeacher = async (name, nip, password,) => {
    const { data, error } = await supabase
        .from('users')
        .insert([{ name, nip, pass: password, role: 'teacher' }]);
    return { data, error };
};

/**
 * Elimina un profesor
 * @param {number} teacherId - ID del profesor
 * @returns {Promise<{ data: any, error: any }>}
 */
export const eliminateTeacher = async (teacherId) => {
    const { data, error } = await supabase
        .from('users')
        .delete()
        .eq('id', teacherId);
    return { data, error };
};

/**
 * Edita un profesor
 * @param {number} teacherId - ID del profesor
 * @param {object} updates - Objetos con actualizaciones
 * @returns {Promise<{ data: any, error: any }>}
 */
export const editTeacher = async (teacherId, updates) => {
    const { data, error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', teacherId);
    return { data, error };
};
