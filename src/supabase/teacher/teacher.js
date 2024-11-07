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

export const getSubjectsByTeacherId = async (teacher_id) => {
  try {
    const { data, error } = await supabase
      .from('teachings')
      .select('subject_id')
      .eq('teacher_id', teacher_id);

    if (error) {
      console.error('Error al obtener las asignaturas del profesor:', error);
      return { data: null, error };
    }

    console.log('Asignaturas obtenidas correctamente:', data);
    return { data, error: null };
  } catch (err) {
    console.error('Ha ocurrido un error:', err);
    return { data: null, error: err };
  }
}

export const assignSubjectToTeacher = async (teacher_nip, subject_code) => {
  try {
    const teacher = await supabase
      .from('users')
      .select('id')
      .eq('nip', teacher_nip)
      .eq('role', 'teacher');

    if (teacher.error) {
      console.error('Error al obtener el profesor:', teacher.error);
      return { data: null, error: teacher.error };
    }

    const subject = await supabase
      .from('subjects')
      .select('id')
      .eq('subject_code', subject_code);

    if (subject.error) {
      console.error('Error al obtener la asignatura:', subject.error);
      return { data: null, error: subject.error };
    }

    const { data, error } = await supabase
      .from('teachings')
      .insert({
        teacher_id: teacher.data[0].id,
        subject_id: subject.data[0].id
      });

    if (error) {
      console.error('Error al asignar la asignatura al profesor:', error);
      return { data: null, error };
    }

    console.log('Asignatura asignada correctamente:', data);
    return { data, error: null };
  } catch (err) {
    console.error('Ha ocurrido un error:', err);
    return { data: null, error: err };
  }
}

export const unassignSubjectFromTeacher = async (teacher_nip, subject_code) => {
  try {
    // Obtener el ID del profesor
    const teacher = await supabase
      .from('users')
      .select('id')
      .eq('nip', teacher_nip)
      .eq('role', 'teacher');

    if (teacher.error) {
      console.error('Error al obtener el profesor:', teacher.error);
      return { data: null, error: teacher.error };
    }
    
    // Verificar si el profesor existe
    if (teacher.data.length === 0) {
      const errorMsg = 'Profesor no encontrado';
      console.error(errorMsg);
      return { data: null, error: errorMsg };
    }

    // Obtener el ID de la asignatura
    const subject = await supabase
      .from('subjects')
      .select('id')
      .eq('subject_code', subject_code);

    if (subject.error) {
      console.error('Error al obtener la asignatura:', subject.error);
      return { data: null, error: subject.error };
    }
    
    // Verificar si la asignatura existe
    if (subject.data.length === 0) {
      const errorMsg = 'Asignatura no encontrada';
      console.error(errorMsg);
      return { data: null, error: errorMsg };
    }

    // Eliminar la relación en la tabla teachings
    const { data, error } = await supabase
      .from('teachings')
      .delete()
      .match({ teacher_id: teacher.data[0].id, subject_id: subject.data[0].id });

    if (error) {
      console.error('Error al desasignar la asignatura del profesor:', error);
      return { data: null, error };
    }

    console.log('Asignatura desasignada correctamente:', data);
    return { data, error: null };
  } catch (err) {
    console.error('Ha ocurrido un error:', err);
    return { data: null, error: err };
  }
};


export const assingArraySubjectsToTeacher = async (teacher_nip, subjects) => {
  try {
    const teacher = await supabase
      .from('users')
      .select('id')
      .eq('nip', teacher_nip)
      .eq('role', 'teacher');

    if (teacher.error) {
      console.error('Error al obtener el profesor:', teacher.error);
      return { data: null, error: teacher.error };
    }

    const subjectsId = await Promise.all(subjects.map(async subject => {
      const { data, error } = await supabase
        .from('subjects')
        .select('id')
        .eq('subject_code', subject);

      if (error) {
        console.error('Error al obtener la asignatura:', error);
        return { data: null, error };
      }

      return data[0].id;
    }));

    const { data, error } = await supabase
      .from('teachings')
      .insert(subjectsId.map(subject_id => {
        return {
          teacher_id: teacher.data[0].id,
          subject_id
        }
      }));

    if (error) {
      console.error('Error al asignar las asignaturas al profesor:', error);
      return { data: null, error };
    }

    console.log('Asignaturas asignadas correctamente:', data);
    return { data, error: null };
  } catch (err) {
    console.error('Ha ocurrido un error:', err);
    return { data: null, error: err };
  }
}

export const getTeacherIdByNip = async (nip) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('id')
      .eq('nip', nip)
      .eq('role', 'teacher')
      .single();

    if (error) {
      console.error('Error al obtener el ID del profesor:', error);
      return { data: null, error };
    }

    console.log('ID del profesor obtenido correctamente:', data);
    return { data: data ? data.id : null, error: null };
  } catch (err) {
    console.error('Ha ocurrido un error:', err);
    return { data: null, error: err };
  }
}