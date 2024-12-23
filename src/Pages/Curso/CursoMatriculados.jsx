import React, { useEffect, useState } from 'react';
import { useDisclosure } from '@nextui-org/react';
import FlechaVolver from '../../Components/FlechaVolver.jsx';
import { FaCirclePlus } from "react-icons/fa6";
import Logout from "../../Components/Logout";
import { useAuth } from "../../context/AuthContext";
import { useLocation, useNavigate } from "react-router-dom";
import '../../css/Curso/CursoMatriculados.css';
import ModalComponent from '../../Components/ModalComponent.jsx';
import { getStudentsBySubject, unenrollStudent } from '../../supabase/student/student.js';
import { getTeachersBySubjectCode, unassignSubjectFromTeacher } from '../../supabase/teacher/teacher.js';

const CursoMatriculados = () => {
    const { user } = useAuth();
    const location = useLocation();
    const navigate = useNavigate()
    const { nombre, subject_id, codigo } = location.state || {};
    const [alumnos, setAlumnos] = useState([]);
    const [profesores, setProfesores] = useState([]);
    const [sortConfigAlumnos, setSortConfigAlumnos] = useState({ key: null, direction: 'asc' });
    const [sortConfigProfesores, setSortConfigProfesores] = useState({ key: null, direction: 'asc' });
    const [userToUnenroll, setUserToUnenroll] = useState('');
    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    useEffect(() => {
        if (user && user.id) {
            getMatriculados()
        }
    }, [user.id]);

    const getMatriculados = async () => {
        const alumnosRecu = (await getStudentsBySubject(subject_id)).data || [];
        const profesoresRecu = (await getTeachersBySubjectCode(codigo)).data || []; 
        
        alumnosRecu.forEach(alumno => alumno.role = 'student');
        profesoresRecu.forEach(profesor => profesor.role = 'teacher');

        setAlumnos(alumnosRecu);
        setProfesores(profesoresRecu);
    }

    const deleteMatriculado = async (user) => {
        const nip = user.nip;
        const role = user.role;
        const res = role === 'student' ? await unenrollStudent(nip, codigo) : await unassignSubjectFromTeacher(nip, codigo);
        if (res.error) {
            console.log(error)
        } else {
            role === 'student' ? setAlumnos(alumnos.filter(alumno => alumno.nip !== nip)) : setProfesores(profesores.filter(profesor => profesor.nip !== nip));
        }
    }

    const sortData = (data, key, direction) => {
        return [...data].sort((a, b) => {
            if (a[key] < b[key]) return direction === 'asc' ? -1 : 1;
            if (a[key] > b[key]) return direction === 'asc' ? 1 : -1;
            return 0;
        });
    };

    const handleSort = (key, list) => {
        const sortConfig = list === 'profesores' ? sortConfigProfesores : sortConfigAlumnos;
        const direction = sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc';    // Permuta y empieza con asc si no era el mismo key
        list === 'profesores' ? setSortConfigProfesores({ key, direction }) : setSortConfigAlumnos({ key, direction });
        if (key === 'nombre' || key === 'nip') {
            list === 'profesores' ? setProfesores(sortData(profesores, key, direction)) : setAlumnos(sortData(alumnos, key, direction));
        }
    };

    const navigateToAddMatriculados = () => {
        navigate(
            `${location.pathname}/Add`, 
            { state: { 
                nombre: nombre,
                codigo: codigo,
                organization_id: user.organization_id
            } 
        }); 
    }

    return (
        <>
            <FlechaVolver isSave={true}/>
            <Logout/>
            <div className='title-container font-bold'>
                <h2>Matriculados en {nombre}</h2>
            </div>
            <div className="container">
                <div className="column-one">
                    <h2>Profesores asignados</h2>
                    <div className="table-container">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>
                                        NIP
                                        <button onClick={() => handleSort('nip', 'profesores')} className="sort-button">↕</button>
                                    </th>
                                    <th>
                                        Nombre
                                        <button onClick={() => handleSort('nombre', 'profesores')} className="sort-button">↕</button>
                                    </th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {Array.isArray(profesores) && profesores.map(profesor => (
                                    <React.Fragment key={profesor.nip}>
                                    <tr>
                                        <td>{profesor.nip}</td>
                                        <td>{profesor.name}</td>
                                        <td>
                                            <button 
                                                data-testid="unenroll-teacher"
                                                className='delete' 
                                                onClick={() => {
                                                    deleteMatriculado(profesor);
                                                    //setUserToUnenroll(profesor);
                                                    //onOpen();
                                                }}>X</button>
                                        </td>
                                    </tr>
                                    </React.Fragment>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="column-two">
                    <h2>Alumnos matriculados</h2>
                    <div className="table-container">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>
                                        NIP
                                        <button onClick={() => handleSort('nip', 'alumnos')} className="sort-button">↕</button>
                                    </th>
                                    <th>
                                        Nombre
                                        <button onClick={() => handleSort('nombre', 'alumnos')} className="sort-button">↕</button>
                                    </th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {Array.isArray(alumnos) && alumnos.map(alumno => (
                                    <React.Fragment key={alumno.nip}>
                                    <tr>
                                        <td>{alumno.nip}</td>
                                        <td>{alumno.name}</td>
                                        <td>
                                            <button 
                                                data-testid="unenroll-student"
                                                className='delete' 
                                                onClick={() => {
                                                    setUserToUnenroll(alumno);
                                                    onOpen();
                                                }}>X</button>
                                        </td>
                                    </tr>
                                    <ModalComponent
                                        isOpen={isOpen}
                                        onOpenChange={onOpenChange}
                                        title="Desmatricular usuario"
                                        texto="¿Estás seguro de que quieres desmatricular a este usuario?"
                                        onAccept={() => {
                                            deleteMatriculado(userToUnenroll);
                                        }} />
                                    </React.Fragment>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
                <div data-testid="create" className="create-button" onClick={navigateToAddMatriculados}>
                        <FaCirclePlus />
                    </div>
            </div>
        </>
    )
}

export default CursoMatriculados
