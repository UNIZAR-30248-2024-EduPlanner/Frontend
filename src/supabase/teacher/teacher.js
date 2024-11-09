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

    console.log('Asignaturas del profesor obtenidas correctamente:', data);
    return { data, error: null };
  } catch (err) {
    console.error('Ha ocurrido un error:', err);
    return { data: null, error: err };
  }
}

export const assignSubjectToTeacher = async (nip, subjectCode) => {
  const teacher = await supabase
    .from('users')
    .select('id')
    .eq('nip', nip)
    .eq('role', 'teacher')
    .single();

  if (teacher.error) {
    console.error('Error al obtener el ID del profesor:', teacher.error);
    return { data: null, error: teacher.error };
  }

  const subject = await supabase
    .from('subjects')
    .select('id')
    .eq('subject_code', subjectCode)
    .single();

  if (subject.error) {
    console.error('Error al obtener el ID de la asignatura:', subject.error);
    return { data: null, error: subject.error };
  }

  const { data, error } = await supabase
    .from('teachings')
    .insert([{ teacher_id: teacher.data.id, subject_id: subject.data.id }]).select();

  if (error) {
    console.error('Error al insertar la asignatura al profesor:', error);
    return { data: null, error };
  }

  console.log('Asignatura insertada al profesor correctamente:', data);
  return { data, error: null };
};

export const unassignSubjectFromTeacher = async (nip, subjectCode) => {
  const teacher = await supabase
    .from('users')
    .select('id')
    .eq('nip', nip)
    .eq('role', 'teacher')
    .single();

  if (teacher.error) {
    console.error('Error al obtener el ID del profesor:', teacher.error);
    return { data: null, error: teacher.error };
  }

  const subject = await supabase
    .from('subjects')
    .select('id')
    .eq('subject_code', subjectCode)
    .single();

  if (subject.error) {
    console.error('Error al obtener el ID de la asignatura:', subject.error);
    return { data: null, error: subject.error };
  }

  const { data, error } = await supabase
    .from('teachings')
    .delete()
    .eq('teacher_id', teacher.data.id)
    .eq('subject_id', subject.data.id)
    .select();

  if (error) {
    console.error('Error al eliminar la asignatura del profesor:', error);
    return { data: null, error };
  }

  console.log('Asignatura eliminada del profesor correctamente:', data);
  return { data, error: null };
};

export const assingArraySubjectsToTeacher = async (nip, subjectCodes) => {
  const teacher = await supabase
    .from('users')
    .select('id')
    .eq('nip', nip)
    .eq('role', 'teacher')
    .single();

  if (teacher.error) {
    console.error('Error al obtener el ID del profesor:', teacher.error);
    return { data: null, error: teacher.error };
  }

  const subjects = await supabase
    .from('subjects')
    .select('id')
    .in('subject_code', subjectCodes);

  if (subjects.error) {
    console.error('Error al obtener los IDs de las asignaturas:', subjects.error);
    return { data: null, error: subjects.error };
  }

  const teacherId = teacher.data.id;
  const subjectIds = subjects.data.map(subject => subject.id);

  const { data, error } = await supabase
    .from('teachings')
    .insert(subjectIds.map(subjectId => ({ teacher_id: teacherId, subject_id: subjectId }))).select();

  if (error) {
    console.error('Error al insertar las asignaturas al profesor:', error);
    return { data: null, error };
  }

  console.log('Asignaturas insertadas al profesor correctamente:', data);
  return { data, error: null };
};

export const unassignArraySubjectsFromTeacher = async (nip, subjectCodes) => {
  const teacher = await supabase
    .from('users')
    .select('id')
    .eq('nip', nip)
    .eq('role', 'teacher')
    .single();

  if (teacher.error) {
    console.error('Error al obtener el ID del profesor:', teacher.error);
    return { data: null, error: teacher.error };
  }

  const subjects = await supabase
    .from('subjects')
    .select('id')
    .in('subject_code', subjectCodes);

  if (subjects.error) {
    console.error('Error al obtener los IDs de las asignaturas:', subjects.error);
    return { data: null, error: subjects.error };
  }

  const teacherId = teacher.data.id;
  const subjectIds = subjects.data.map(subject => subject.id);

  const { data, error } = await supabase
    .from('teachings')
    .delete()
    .eq('teacher_id', teacherId)
    .in('subject_id', subjectIds).select();

  if (error) {
    console.error('Error al eliminar las asignaturas del profesor:', error);
    return { data: null, error };
  }

  console.log('Asignaturas eliminadas del profesor correctamente:', data);
  return { data, error: null };
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