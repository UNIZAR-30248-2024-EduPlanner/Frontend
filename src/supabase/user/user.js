import { supabase } from '../supabaseClient.js';

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
    console.error("Error al iniciar sesión en el curso:", error);
    return false; // Error en la consulta
  }

  return !!data; // Devuelve true si hay datos (curso encontrado), false de lo contrario
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

  return { data, error }; // Devuelve tanto 'data' como 'error' para una respuesta consistente
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

  return data; // Devuelve el ID o null si no se encuentra
};