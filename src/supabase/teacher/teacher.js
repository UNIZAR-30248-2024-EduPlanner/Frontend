import { supabase } from '../supabaseClient.js';
import { getAcademicEventsBySubject } from '../academicEvent/academicEvent';
import { createCustomAcademicEvent, deleteCustomAcademicEvent } from '../customAcademicEvent/customAcademicEvent';
import { getStudentIdByNip } from '../student/student';

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
    // Primero obtenemos la lista de subject_id del profesor
    const { data: teachingData, error: teachingError } = await supabase
      .from('teachings')
      .select('subject_id')
      .eq('teacher_id', teacher_id);

    if (teachingError) {
      console.error('Error al obtener las asignaturas del profesor:', teachingError);
      return { data: null, error: teachingError };
    }

    console.log('Asignaturas del profesor obtenidas correctamente:', teachingData);

    // Extraer los IDs de las asignaturas
    const subjectIds = teachingData.map(item => item.subject_id);

    if (subjectIds.length === 0) {
      console.log('El profesor no tiene asignaturas asociadas.');
      return { data: [], error: null };
    }

    // Consultar las asignaturas completas en la tabla subjects
    const { data: subjects, error: subjectsError } = await supabase
      .from('subjects')
      .select('*')
      .in('id', subjectIds);

    if (subjectsError) {
      console.error('Error al obtener los detalles de las asignaturas:', subjectsError);
      return { data: null, error: subjectsError };
    }

    console.log('Detalles de las asignaturas obtenidos correctamente:', subjects);
    return { data: subjects, error: null };
  } catch (err) {
    console.error('Ha ocurrido un error:', err);
    return { data: null, error: err };
  }
};

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

  //Ahora añadir todos los eventos academicos de la asignatura al estudiante
  const academicEvents = await getAcademicEventsBySubject(subject.data.id);
  if (academicEvents.error) {
    console.error('Error al obtener los eventos academicos de la asignatura:', academicEvents.error);
    return { data: null, error: academicEvents.error }; // Retorna el error
  }

  //Crear un evento personalizado en el alumno para cada evento academico de la asignatura
  for (let event of academicEvents.data) {
    const customEvent = await createCustomAcademicEvent(teacher.data.id, event.id);
    if (customEvent.error) {
      console.error('Error al crear el evento personalizado:', customEvent.error);
      return { data: null, error: customEvent.error }; // Retorna el error
    }
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

  //Ahora hay que eliminar los eventos personalizados de la asignatura al profesor
  const academicEvents = await getAcademicEventsBySubject(subject.data.id);
  if (academicEvents.error) {
    console.error('Error al obtener los eventos academicos de la asignatura:', academicEvents.error);
    return { data: null, error: academicEvents.error }; // Retorna el error
  }

  //Eliminar un evento personalizado en el profesor para cada evento academico de la asignatura
  for (let event of academicEvents.data) {
    const customEvent = await deleteCustomAcademicEvent(teacher.data.id, event.id);
    if (customEvent.error) {
      console.error('Error al eliminar el evento personalizado:', customEvent.error);
      return { data: null, error: customEvent.error }; // Retorna el error
    }
  }

  console.log('Asignatura eliminada del profesor correctamente:', data);
  return { data, error: null };
};

export const assingArraySubjectsToTeacher = async (nip, subjectCodes) => {
  try {
    // Matricular al estudiante en cada asignatura utilizando la función matriculateStudent
    for (const subject of subjectCodes) {
      const result = await assignSubjectToTeacher(nip, subject);

      if (result.error) {
        console.error(`Error al asignar al profesor en la asignatura ${subject}:`, result.error);
        return { data: null, error: result.error };
      }
    }

    console.log('Profesor asignado correctamente en múltiples asignaturas');
    return { data: `Profesor asignado en ${subjectCodes.length} asignaturas`, error: null };
  } catch (err) {
    console.error('Ha ocurrido un error al asignar al profesor en múltiples asignaturas:', err);
    return { data: null, error: err };
  }
};

export const unassignArraySubjectsFromTeacher = async (nip, subjectCodes) => {
  try {
    // Matricular al estudiante en cada asignatura utilizando la función matriculateStudent
    for (const subject of subjectCodes) {
      const result = await unassignSubjectFromTeacher(nip, subject);

      if (result.error) {
        console.error(`Error al desasignar al profesor de la asignatura ${subject}:`, result.error);
        return { data: null, error: result.error };
      }
    }

    console.log('Profesor desasignado correctamente en múltiples asignaturas');
    return { data: `Profesor desasignador en ${subjectCodes.length} asignaturas`, error: null };
  } catch (err) {
    console.error('Ha ocurrido un error al desasignar al profesor en múltiples asignaturas:', err);
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

export const getTeacherIdByNipAndOrganization = async (nip, organization_id) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('id, name')
      .eq('nip', nip)
      .eq('organization_id', organization_id)
      .eq('role', 'teacher')
      .single();

    if (error) {
      console.error('Error al obtener el ID del profesor:', error);
      return { data: null, error };
    }

    console.log('ID del profesor obtenido correctamente:', data);
    return { data: data, error: null };
  } catch (err) {
    console.error('Ha ocurrido un error:', err);
    return { data: null, error: err };
  }
}

export const getTeacherById = async (teacher_id) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', teacher_id)
      .eq('role', 'teacher')
      .single();

    if (error) {
      console.error('Error al obtener el profesor:', error);
      return { data: null, error };
    }

    console.log('Profesor obtenido correctamente:', data);
    return { data, error: null };
  } catch (err) {
    console.error('Ha ocurrido un error:', err);
    return { data: null, error: err };
  }
}


export const getTeachersBySubjectCode = async (subject_code) => {
  try {
    // Obtener el ID de la asignatura
    const subject = await supabase
      .from('subjects')
      .select('id')
      .eq('subject_code', subject_code)
      .single().select();

    // Primero obtenemos la lista de teacher_id del profesor
    const { data: teachingData, error: teachingError } = await supabase
      .from('teachings')
      .select('teacher_id')
      .eq('subject_id', subject.data.id);

    if (teachingError) {
      console.error('Error al obtener los profesores de la asignatura:', teachingError);
      return { data: null, error: teachingError };
    }

    // Extraer la informacion de los profesores por su ID de teachingData
    const teachers = await Promise.all(teachingData.map(async (teacher) => {
      const result = await getTeacherById(teacher.teacher_id);
      return result.data;
    }));

    if (teachers.length === 0) {
      console.log('La asignatura no tiene profesores asociados.');
      return { data: [], error: null };
    }

    console.log('Profesores de la asignatura obtenidos correctamente:', teachers);

    return { data: teachers, error: null };
  } catch (err) {
    console.error('Ha ocurrido un error:', err);
    return { data: null, error: err };
  }
}


export const letTeacherAssociateStudentToSubject = async (teacherNip, studentNip, subjectCode) => {
  // Obtener el ID del profesor
  const teacherId = await getTeacherIdByNip(teacherNip);
  console.log(teacherId);
  if (!teacherId.data) {
    return { data: null, error: 'El profesor no existe' };
  }

  // Obtener el ID del estudiante
  const studentId = await getStudentIdByNip(studentNip);
  console.log(studentId);
  if (!studentId.data) {
    return { data: null, error: 'El estudiante no existe' };
  }

  // Obtener el ID de la asignatura
  const subject = await supabase
    .from('subjects')
    .select('id')
    .eq('subject_code', subjectCode)
    .single().select();

  console.log(subject);

  if (subject.error) {
    console.error('Error al obtener el ID de la asignatura:', subject.error);
    return { data: null, error: subject.error };
  }

  // Comprobar si el profesor tiene asignada la asignatura
  const teaching = await supabase
    .from('teachings')
    .select('subject_id')
    .eq('teacher_id', teacherId.data)
    .eq('subject_id', subject.data.id)
    .single();

  if (teaching.error) {
    console.error('Error al obtener la asignatura del profesor:', teaching.error);
    return { data: null, error: teaching.error };
  } else {
    // Asignar la asignatura al estudiante
    const { data, error } = await supabase
      .from('enrollments')
      .insert([{ student_id: studentId.data, subject_id: subject.data.id }]).select();

    if (error) {
      console.error('Error al insertar la asignatura al estudiante:', error);
      return { data: null, error };
    }

    console.log('Asignatura insertada al estudiante correctamente:', data);
    return { data, error: null };
  }
}

export const letTeacherAssociateArrayStudentsToSubject = async (teacherNip, studentNips, subjectCode) => {
  try {
    // Matricular al estudiante en cada asignatura utilizando la función matriculateStudent
    for (const student of studentNips) {
      const result = await letTeacherAssociateStudentToSubject(teacherNip, student, subjectCode);

      if (result.error) {
        console.error(`Error al asignar al alumno en la asignatura:`, result.error);
        return { data: null, error: result.error };
      }
    }

    console.log('Alumnos asignados correctamente en la asignatura');
    return { data: `Alumnos asignados en la asignatura`, error: null };
  } catch (err) {
    console.error('Ha ocurrido un error al asignar al alumno en la asignatura:', err);
    return { data: null, error: err };
  }
}



export const letTeacherUnAssociateStudentFromSubject = async (teacherNip, studentNip, subjectCode) => {
  // Obtener el ID del profesor
  const teacherId = await getTeacherIdByNip(teacherNip);
  console.log(teacherId);
  if (!teacherId.data) {
    return { data: null, error: 'El profesor no existe' };
  }

  // Obtener el ID del estudiante
  const studentId = await getStudentIdByNip(studentNip);
  console.log(studentId);
  if (!studentId.data) {
    return { data: null, error: 'El estudiante no existe' };
  }

  // Obtener el ID de la asignatura
  const subject = await supabase
    .from('subjects')
    .select('id')
    .eq('subject_code', subjectCode)
    .single().select();

  console.log(subject);

  if (subject.error) {
    console.error('Error al obtener el ID de la asignatura:', subject.error);
    return { data: null, error: subject.error };
  }

  // Comprobar si el profesor tiene asignada la asignatura
  const teaching = await supabase
    .from('teachings')
    .select('subject_id')
    .eq('teacher_id', teacherId.data)
    .eq('subject_id', subject.data.id)
    .single();

  if (teaching.error) {
    console.error('Error al obtener la asignatura del profesor:', teaching.error);
    return { data: null, error: teaching.error };
  } else {
    // Asignar la asignatura al estudiante
    const { data, error } = await supabase
      .from('enrollments')
      .delete()
      .eq('student_id', studentId.data)
      .eq('subject_id', subject.data.id)
      .select();

    if (error) {
      console.error('Error al eliminar la asignatura al estudiante:', error);
      return { data: null, error };
    }

    console.log('Asignatura eliminada al estudiante correctamente:', data);
    return { data, error: null };
  }
}

export const getStudentsAssignedToSubject = async (teacherNip, subjectCode) => {
  // Obtener el ID del profesor
  const teacherId = await getTeacherIdByNip(teacherNip);
  console.log(teacherId);
  if (!teacherId.data) {
    return { data: null, error: 'El profesor no existe' };
  }

  // Obtener el ID de la asignatura
  const subject = await supabase
    .from('subjects')
    .select('id')
    .eq('subject_code', subjectCode)
    .single().select();

  console.log(subject);

  if (subject.error) {
    console.error('Error al obtener el ID de la asignatura:', subject.error);
    return { data: null, error: subject.error };
  }

  // Comprobar si el profesor tiene asignada la asignatura
  const teaching = await supabase
    .from('teachings')
    .select('subject_id')
    .eq('teacher_id', teacherId.data)
    .eq('subject_id', subject.data.id)
    .single();

  if (teaching.error) {
    console.error('Error al obtener la asignatura del profesor:', teaching.error);
    return { data: null, error: teaching.error };
  } else {
    // Obtener los estudiantes matriculados en la asignatura
    const { data, error } = await supabase
      .from('enrollments')
      .select('student_id')
      .eq('subject_id', subject.data.id);

    if (error) {
      console.error('Error al obtener los estudiantes matriculados en la asignatura:', error);
      return { data: null, error };
    }

    console.log('Estudiantes matriculados en la asignatura obtenidos correctamente:', data);
    return { data, error: null };
  }
}
