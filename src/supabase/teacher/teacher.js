import { supabase } from '../supabaseClient.js';

export const registerArrayTeachers = async (teachers, organization_id) => {
  try {

    const teachersWithOrgId = teachers.map(teacher => {
      return {
        ...teacher,
        role: 'teacher',
        organization_id
      }
    });

    const { data, error } = await supabase
      .from('users')
      .insert(teachersWithOrgId);

    if (error) {
      console.error('Error al insertar los profesores:', error);
      return { data: null, error };
    }

    console.log('Profesores insertados correctamente:', teachersWithOrgId);
    return { data, error: null };
  } catch (err) {
    console.error('Ha ocurrido un error:', err);
    return { data: null, error: err };
  }
}