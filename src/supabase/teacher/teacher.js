import { supabase } from '../supabaseClient.js';

export const registerArrayTeachers = async (teachers, organization_id) => {
  try {

    const teachersWithOrgId = teachers.map(teacher => {
      return {
        ...teacher,
        role: 'teacher',
        organization_id
      }
    }, organization_id);

    const { error } = await supabase
      .from('users')
      .insert(teachersWithOrgId);

    if (error) {
      console.error('Error al insertar los profesores:', error);
      return false;
    }

    console.log('Profesores insertados correctamente:', teachersWithOrgId);
    return true;
  } catch (err) {
    console.error('Ha ocurrido un error:', err);
  }
}