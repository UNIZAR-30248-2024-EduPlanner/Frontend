import bcrypt from 'bcryptjs';
import { supabase } from '../supabaseClient.js';
import {registerUser} from '../user/user.js';

// Función para registrar una organización
export const registerOrganization = async (name, nip, pass) => {
    try {
        // Generar el hash de la contraseña
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(pass, saltRounds);

        // Insertar la organización con la contraseña cifrada
        const { data, error } = await supabase
            .from('organization')
            .insert([{ name, nip, pass: hashedPassword }]);

        if (error) {
            console.error("Error al registrar la organización:", error);
            return { data: null, error };
        }

        return { data: true, error: null };
    } catch (error) {
        console.error("Error al cifrar la contraseña:", error);
        return { data: null, error };
    }
};

export const eliminateOrganization = async (organizationId) => {
    const { data, error } = await supabase
        .from('organization')
        .delete()
        .eq('id', organizationId);

    return { data, error };
}

// Función para iniciar sesión (login) de la organización
export const loginOrganization = async (id, nip, pass) => {
    try {
        const { data, error } = await supabase
            .from('organization')
            .select('*') // Seleccionamos el hash de la contraseña
            .eq('nip', nip)
            .eq('id', id)
            .single();

        if (error || !data) {
            console.error("Error al buscar la organización:", error);
            return { data: null, error: "Organización no encontrada" };
        }

        if(data.pass == pass){
            return { data: true, error: null }; // Inicio de sesión exitoso
        }

        // Verificar la contraseña proporcionada contra el hash almacenado
        const passwordMatch = await bcrypt.compare(pass, data.pass);
        if (!passwordMatch) {
            return { data: null, error: "Contraseña incorrecta" };
        }

        return { data: true, error: null }; // Inicio de sesión exitoso
    } catch (error) {
        console.error("Error al iniciar sesión:", error);
        return { data: null, error };
    }
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
    return await registerUser(name, nip, pass, 'course', organizationId);
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
    if (updates.pass) {  // Si updates.pass tiene algún valor
        const saltRounds = 10;
        updates.pass = await bcrypt.hash(updates.pass, saltRounds);
    }
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
    return await registerUser(name, nip, pass, 'student', organizationId);
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
    //Si queremos modificar la contraseña hay que generar un nuevo hash
    if (updates.pass) {  // Si updates.pass tiene algún valor
        const saltRounds = 10;
        updates.pass = await bcrypt.hash(updates.pass, saltRounds);
    }

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
    return await registerUser(name, nip, pass, 'teacher', organizationId);
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
    if (updates.pass) {  // Si updates.pass tiene algún valor
        const saltRounds = 10;
        updates.pass = await bcrypt.hash(updates.pass, saltRounds);
    }
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

// Función para obtener el ID de un usuario por su NIP
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

// Función para obtener la información de un usuario por su NIP
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