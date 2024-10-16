// src/api/course.js
import { supabase } from '../supabaseClient';

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
        return false; // Error en la consulta
    }

    return !!data; // Devuelve true si hay datos (curso encontrado), false de lo contrario
};

// Función para registrar un nuevo curso
export const registerCourse = async (name, nip, pass, organization_id) => {
    const { data, error } = await supabase
        .from('users')
        .insert([
            {
                name,
                nip,
                pass, // Almacena la contraseña de forma segura en producción
                role: 'course',
                organization_id, // Relación con la organización a la que pertenece
            },
        ]);

    return { data, error }; // Devuelve tanto 'data' como 'error' para una respuesta consistente
};


// Función para obtener todas las asignaturas que posee un curso
export const getAllSubjects = async (courseId) => {
    const { data, error } = await supabase
        .from('subjects')
        .select('*')
        .eq('course_id', courseId);

    return { data, error };
};

// Función para crear una asignatura
export const createSubject = async (subjectName, subjectCode, courseId) => {
    const { data, error } = await supabase
        .from('subjects')
        .insert([{ subject_name: subjectName, subject_code: subjectCode, course_id: courseId }]);

    return { data, error };
};

// Función para eliminar una asignatura
export const eliminateSubject = async (subjectId) => {
    const { data, error } = await supabase
        .from('subjects')
        .delete()
        .eq('id', subjectId);

    return { data, error };
};

// Función para editar una asignatura
export const editSubject = async (subjectId, updates) => {
    const { data, error } = await supabase
        .from('subjects')
        .update(updates)
        .eq('id', subjectId);

    return { data, error };
};

export const getCourseIdByNIP = async (nip) => {
    const { data, error } = await supabase
        .from('users')
        .select('id')
        .eq('nip', nip)
        .eq('role', 'course')
        .single();

    if (error) {
        console.error("Error al obtener el ID del curso:", error);
        return null; // Error en la consulta
    }

    return data?.id; // Devuelve el ID del curso, null si no se encontró
}

export const getSubjectIdByCode = async (subject_code) => {
    const { data, error } = await supabase
        .from('subjects')
        .select('id')
        .eq('subject_code', subject_code)
        .single();

    if (error) {
        console.error("Error al obtener el ID de la asignatura:", error);
        return null; // Error en la consulta
    }

    return data?.id; // Devuelve el ID de la asignatura, null si no se encontró
}