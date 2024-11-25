import { supabase } from '../supabaseClient.js';
import bcrypt from 'bcryptjs';

// Función para registrar un nuevo usuario
export const registerUser = async (name, nip, pass, role, organization_id) => {
  try {
      // Cifrar la contraseña del usuario
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(pass, saltRounds);

      // Insertar el usuario con la contraseña cifrada
      const { data, error } = await supabase
          .from('users')
          .insert([
              {
                  name,
                  nip,
                  pass: hashedPassword, // Almacena la contraseña cifrada
                  role,
                  organization_id,
              },
          ]);

      if (error) {
          console.error("Error al registrar el usuario:", error);
          return { data: null, error };
      }

      return { data, error: null };
  } catch (error) {
      console.error("Error al cifrar la contraseña del usuario:", error);
      return { data: null, error };
  }
};

// Función para iniciar sesión (login) de un usuario
export const loginUser = async (nip, pass, role, organization_id) => {
  try {
      const { data, error } = await supabase
          .from('users')
          .select('*') // Selecciona solo la contraseña cifrada
          .eq('nip', nip)
          .eq('role', role)
          .eq('organization_id', organization_id)
          .single();

      if (error || !data) {
          console.error("Error al iniciar sesión del usuario:", error);
          return { data: null, error: "Usuario no encontrado" };
      }

      if(pass == data.pass){
        return {data:true, error:null};
      }

      // Verificar la contraseña proporcionada contra el hash almacenado
      const passwordMatch = await bcrypt.compare(pass, data.pass);
      if (!passwordMatch) {
          return { data: null, error: "Contraseña incorrecta" };
      }

      return { data: true, error: null }; // Inicio de sesión exitoso
  } catch (error) {
      console.error("Error al iniciar sesión del usuario:", error);
      return { data: null, error };
  }
};

// Función para obtener el ID de un usuario dado su NIP
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

// Función para obtener la información de un usuario dado su NIP
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
