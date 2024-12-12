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
export const createSubject = async (subjectName, subjectCode, color, courseId) => {
    const { data, error } = await supabase
        .from('subjects')
        .insert([{ name: subjectName, subject_code: subjectCode, course_id: courseId, color: color }]);

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

    //Actualizar todos los eventos academicos antiguos con el nuevo nombre
    console.log("Modificando el nombre de los eventos academicos")
     await supabase
        .from('academic_event')
        .update({name: updates.name })
        .eq('subject_id', subjectId);

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

// Funcion para asignar a un array de estudiantes a una asignatura
export const assignSubjectToStudents = async (nips, subjectCode, organization_id) => {
    try {
        // Validar que `nips` sea una lista válida
        if (!Array.isArray(nips) || nips.length === 0) {
            console.error('La lista de NIPs no es válida o está vacía.');
            return { data: null, error: 'La lista de NIPs no es válida o está vacía.' };
        }

        // Validar que `organization_id` y `subjectCode` sean válidos
        if (!organization_id || typeof organization_id !== 'number') {
            console.error('El organization_id proporcionado no es válido:', organization_id);
            return { data: null, error: 'El organization_id no es válido.' };
        }

        if (!subjectCode) {
            console.error('El subjectCode proporcionado no es válido:', subjectCode);
            return { data: null, error: 'El subjectCode no es válido.' };
        }

        // Obtener el ID de la asignatura
        const { data: subject, error: subjectError } = await supabase
            .from('subjects')
            .select('id')
            .eq('subject_code', subjectCode)
            .single();

        if (subjectError || !subject) {
            console.error('Error al obtener el ID de la asignatura:', subjectError);
            return { data: null, error: subjectError || 'No se encontró la asignatura.' };
        }

        console.log('Información de la asignatura obtenida:', subject);

        // Obtener los IDs de los estudiantes para cada NIP
        const studentPromises = nips.map(async (nip, index) => {
            if (!Number.isInteger(nip) || nip.toString().length !== 6) {
                console.error(`El NIP en la posición ${index} no es válido:`, nip);
                return { student_id: null, error: `NIP inválido: ${nip}` };
            }

            const { data: student, error: studentError } = await supabase
                .from('users')
                .select('id')
                .eq('nip', nip)
                .eq('role', 'student')
                .eq('organization_id', organization_id)
                .single();

            if (studentError || !student) {
                console.error(`Error al obtener el ID del estudiante con NIP ${nip}:`, studentError);
                return { student_id: null, error: studentError?.message || 'Usuario no encontrado.' };
            }

            return { student_id: student.id, subject_id: subject.id };
        });

        // Resolver todas las promesas
        const resolvedStudents = await Promise.all(studentPromises);

        // Filtrar estudiantes válidos
        const validEnrollments = resolvedStudents.filter(item => item.student_id !== null);
        const invalidEnrollments = resolvedStudents.filter(item => item.student_id === null);

        if (validEnrollments.length === 0) {
            console.error('Ningún estudiante válido para asignar a la asignatura.');
            return { data: null, error: 'No se pudo asignar ningún estudiante válido.' };
        }

        // Insertar los estudiantes válidos en la tabla `enrollments`
        const { error: insertError } = await supabase
            .from('enrollments')
            .insert(validEnrollments);

        if (insertError) {
            console.error('Error al asignar la asignatura a los estudiantes:', insertError);
            return { data: null, error: insertError };
        }

        console.log('Asignatura asignada a los estudiantes correctamente:', validEnrollments);
        return {
            data: {
                validEnrollments,
                invalidEnrollments
            },
            error: null
        };
    } catch (err) {
        console.error('Ha ocurrido un error inesperado:', err);
        return { data: null, error: err };
    }
};

// Funcion para asignar a un array de profesores a una asignatura
export const assignSubjectToTeachers = async (teachers, subjectCode, organization_id) => {
    try {
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
        // Obtener el ID de cada profesor dado su NIP
        const teachersWithSubjectId = await Promise.all(teachers.map(async teacher => {
            const teacherData = await supabase
                .from('users')
                .select('id')
                .eq('nip', teacher)
                .eq('role', 'teacher')
                .eq('organization_id', organization_id)
                .single().select();

            if (teacherData.error) {
                console.error('Error al obtener el ID del profesor:', teacherData.error);
                return { data: null, error: teacherData.error };
            }

            return { teacher_id: teacherData.data.id, subject_id: subject.data.id };
        }));

        const { error } = await supabase
            .from('teachings')
            .insert(teachersWithSubjectId.filter(item => item.data !== null));

        if (error) {
            console.error('Error al insertar los profesores en la asignatura:', error);
            return { data: null, error }; // Devolver objeto con error
        }

        console.log('Profesores insertados correctamente:', teachersWithSubjectId);
        return { data: true, error: null }; // Devuelve true si se insertaron correctamente
    } catch (err) {
        console.error('Ha ocurrido un error:', err);
        return { data: null, error: err }; // Devolver objeto con error
    }
};
