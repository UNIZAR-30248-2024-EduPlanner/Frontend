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
    console.error("Error al iniciar sesión del usuario:", error);
    return { data: null, error }; // Devuelve el error y data como null de forma consistente
  }

  return { data: !!data, error: null }; // Devuelve true si hay datos, false si no, y error como null
};


// Función para registrar un nuevo usuario
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


export const getUserIdByNIP = async (nip, organizationId) => {
  const { data, error } = await supabase
    .from('users')
    .select('id') // Solo seleccionamos el ID
    .eq('nip', nip)
    .eq('organization_id', organizationId) // Comprobar también por ID de organización
    .single(); // Devuelve solo un resultado

  if (error) {
    console.error("Error al obtener el ID de usuario:", error);
    return { data: null, error }; // Devuelve el error y data como null de forma consistente
  }

  return { data: data ? data.id : null, error: null }; // Devuelve tanto 'data' como 'error' de forma consistente
};


export const getUserInfoByNIP = async (nip, organizationId) => {
  const { data, error } = await supabase
    .from('users')
    .select('*') // Seleccionamos toda la información del usuario
    .eq('nip', nip)
    .eq('organization_id', organizationId) // Comprobamos también por ID de organización
    .single(); // Devuelve solo un resultado

  if (error) {
    console.error("Error al obtener el ID de usuario:", error);
    return { data: null, error }; // Devuelve el error y data como null de forma consistente
  }

  return { data, error: null }; // Devuelve tanto 'data' como 'error' de forma consistente
};


// Función para devolver la información de un usuario dado su ID
export const getUserInfoById = async (id) => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error("Error al obtener la información del usuario:", error);
    return { data: null, error }; // Devuelve el error de forma consistente
  }

  return { data, error: null }; // Devuelve tanto 'data' como 'error' de forma consistente
}
