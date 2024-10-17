// src/api/organization.js
import { supabase } from '../supabaseClient';

// Función para registrar una organización
export const registerOrganization = async (name, nip, pass) => {
    const { data, error } = await supabase
        .from('organization')
        .insert([{ name, nip, pass }]);
    if (error) {
        console.error("Error al registrar la organización:", error);
        return { data: null, error }; // Devuelve el error y data como null de forma consistente
    }
    return { data, error: null }; // Devuelve tanto 'data' como 'error' de forma consistente
};

// Función para iniciar sesión (login)
export const loginOrganization = async (nip, pass) => {
    const { data, error } = await supabase
        .from('organization')
        .select('*')
        .eq('nip', nip)
        .eq('pass', pass)
        .single(); // Devuelve solo un resultado

    if (error) {
        console.error("Error al iniciar sesión:", error);
        return { data: null, error }; // Error en la consulta
    }

    return { data: !!data, error: null }; // Devuelve true si hay datos (organización encontrada), false de lo contrario
};

// Función para iniciar sesión (login) de un usuario
export const loginUser = async (nip, pass, role, organization_id) => {
    const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('nip', nip)
        .eq('pass', pass)
        .eq('role', role)
        .eq('organization_id', organization_id)
        .single();

    if (error) {
        console.error("Error al iniciar sesión del usuario:", error);
        return { data: null, error }; // Devuelve el error y data como null de forma consistente
    }

    return { data: !!data, error: null }; // Devuelve true si hay datos, false si no, y error como null
};

// Función para registrar un nuevo curso
export const registerUser = async (name, nip, pass, role, organization_id) => {
    const { data, error } = await supabase
        .from('users')
        .insert([
            {
                name,
                nip,
                pass, // Almacena la contraseña de forma segura en producción
                role,
                organization_id, // Relación con la organización a la que pertenece
            },
        ]);

    if (error) {
        console.error("Error al registrar el usuario:", error);
        return { data: null, error }; // Devuelve el error y data como null de forma consistente
    }

    return { data, error: null }; // Devuelve tanto 'data' como 'error' de forma consistente
};

// Función para obtener todos los cursos que posee la organización
export const getAllCourses = async (organizationId) => {
    const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('organization_id', organizationId)
        .eq('role', 'course');

    return { data, error };
};

// Función para crear un curso
export const createCourse = async (name, nip, pass, organizationId) => {
    const { data, error } = await supabase
        .from('users')
        .insert([{ name, nip, pass, role: 'course', organization_id: organizationId }]);

    return { data, error };
};

// Función para eliminar un curso
export const eliminateCourse = async (courseId) => {
    const { data, error } = await supabase
        .from('users')
        .delete()
        .eq('id', courseId)
        .eq('role', 'course');

    return { data, error };
};

// Función para editar un curso
export const editCourse = async (courseId, updates) => {
    const { data, error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', courseId)
        .eq('role', 'course');

    return { data, error };
};

// Función para obtener todos los alumnos de la organización
export const getAllStudents = async (organizationId) => {
    const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('organization_id', organizationId)
        .eq('role', 'student');

    return { data, error };
};

// Función para crear un alumno
export const createStudent = async (name, nip, pass, organizationId) => {
    const { data, error } = await supabase
        .from('users')
        .insert([{ name, nip, pass, role: 'student', organization_id: organizationId }]);

    return { data, error };
};

// Función para eliminar un alumno
export const eliminateStudent = async (studentId) => {
    const { data, error } = await supabase
        .from('users')
        .delete()
        .eq('id', studentId)
        .eq('role', 'student');

    return { data, error };
};

// Función para editar un alumno
export const editStudent = async (studentId, updates) => {
    const { data, error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', studentId)
        .eq('role', 'student');

    return { data, error };
};

// Función para obtener todos los profesores de la organización
export const getAllTeachers = async (organizationId) => {
    const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('organization_id', organizationId)
        .eq('role', 'teacher');

    return { data, error };
};

// Función para crear un profesor
export const createTeacher = async (name, nip, pass, organizationId) => {
    const { data, error } = await supabase
        .from('users')
        .insert([{ name, nip, pass, role: 'teacher', organization_id: organizationId }]);

    return { data, error };
};

// Función para eliminar un profesor
export const eliminateTeacher = async (teacherId) => {
    const { data, error } = await supabase
        .from('users')
        .delete()
        .eq('id', teacherId)
        .eq('role', 'teacher');

    return { data, error };
};

// Función para editar un profesor
export const editTeacher = async (teacherId, updates) => {
    const { data, error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', teacherId)
        .eq('role', 'teacher');

    return { data, error };
};

// Función para obtener el ID de la organización por su nombre
export const getOrganizationIdByName = async (name) => {
    const { data, error } = await supabase
        .from('organization')
        .select('id')
        .eq('name', name)
        .single(); // Devuelve solo un resultado

    if (error) {
        console.error("Error al obtener el ID de la organización:", error);
        return null; // Retorna null en caso de error
    }

    return data ? data.id : null; // Retorna el ID si se encontró, null si no
};

export const getUserIdByNIP = async (nip, organizationId) => {
    const { data, error } = await supabase
        .from('users')
        .select('id') // Solo seleccionamos el ID
        .eq('nip', nip)
        .eq('organization_id', organizationId) // Comprobar también por ID de organización
        .single(); // Devuelve solo un resultado

    if (error) {
        console.error("Error al obtener el ID de usuario:", error);
        return null; // En caso de error, devolver null
    }

    return data ? data.id : null; // Devuelve el ID o null si no se encuentra
};

export const getUserInfoByNIP = async (nip, organizationId) => {
    const { data, error } = await supabase
        .from('users')
        .select('*') // Solo seleccionamos el ID
        .eq('nip', nip)
        .eq('organization_id', organizationId) // Comprobar también por ID de organización
        .single(); // Devuelve solo un resultado

    if (error) {
        console.error("Error al obtener el ID de usuario:", error);
        return null; // En caso de error, devolver null
    }

    return { data }; // Devuelve el ID o null si no se encuentra
};

// Funcion para mostrar todas las organizaciones existentes
export const getAllOrganizations = async () => {
    const { data, error } = await supabase
        .from('organization')
        .select('id, name'); // Selecciona solo los campos id y nombre

    if (error) {
        console.error('Error al obtener organizaciones', error);
        return { data: [], error }; // Devuelve un arreglo vacío en caso de error
    }

    const result = data.map(org => ({
        id: org.id,
        name: org.name
    }));

    console.log('Lista de organizaciones', result);
    return { data: result, error: null }; // Devuelve el resultado transformado
}


// Función para obtener una organización por su ID
export const getOrganizationById = async (organizationId) => {
    const { data, error } = await supabase
        .from('organization')
        .select('*')
        .eq('id', organizationId)
        .single(); // Devuelve solo un resultado

    if (error) {
        console.error("Error al obtener la organización:", error);
        return { data: null, error }; // En caso de error, devolver null
    }
    console.log("Organización por el ID dado:", data);
    return { data, error: null }; // Devuelve la organización encontrada
};


// Función para eliminar una organización y sus registros asociados
//TODO
/*
export const eliminateOrganizationAndRelatedData = async (organizationId) => {
    
};
*/

