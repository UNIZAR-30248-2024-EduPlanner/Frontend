import React, { useEffect, useState } from 'react';
import FlechaVolver from '../../Components/FlechaVolver.jsx';
import { FaMagnifyingGlass, FaCirclePlus } from "react-icons/fa6";
import Logout from "../../Components/Logout";
import { Input } from "@nextui-org/input";
import { Button } from "@nextui-org/button";
import { useAuth } from "../../context/AuthContext";
import { useLocation } from "react-router-dom";
import '../../css/Curso/CursoMatriculados.css';

const CursoMatriculados = () => {
    const { user } = useAuth();
    const location = useLocation();
    const { nombre, subject_id, codigo } = location.state || {};
    const [alumnos, setAlumnos] = useState([]);
    const [profesores, setProfesores] = useState([]);
    const [sortConfigAlumnos, setSortConfigAlumnos] = useState({ key: null, direction: 'asc' });
    const [sortConfigProfesores, setSortConfigProfesores] = useState({ key: null, direction: 'asc' });
    const [search, setSearch] = useState('');

    useEffect(() => {
        if (user && user.id) {
            getMatriculados()
        }
    }, [user.id]);

    const getMatriculados = async () => {
        // Mockeamos matriculados
        const mockAlumnos = [
            { nip: 123, nombre: 'Juan Pérez' },
            { nip: 456, nombre: 'María López' },
            { nip: 789, nombre: 'Carlos García' },
            { nip: 101, nombre: 'Ana Martínez' },
            { nip: 112, nombre: 'Luis Rodríguez' },
            { nip: 131, nombre: 'Sofía Fernández' },
            { nip: 415, nombre: 'Miguel Sánchez' },
            { nip: 161, nombre: 'Lucía Ramírez' },
            { nip: 718, nombre: 'Javier Torres' },
            { nip: 192, nombre: 'Elena Díaz' },
            { nip: 202, nombre: 'Diego Morales' },
            { nip: 212, nombre: 'Paula Cruz' },
            { nip: 232, nombre: 'Andrés Ortiz' },
            { nip: 242, nombre: 'Laura Gómez' },
            { nip: 252, nombre: 'Fernando Ruiz' },
            { nip: 262, nombre: 'Clara Jiménez' },
            { nip: 272, nombre: 'Adrián Herrera' },
            { nip: 282, nombre: 'Isabel Mendoza' },
        ];
        const mockProfesores = [
            { nip: 301, nombre: 'Roberto Álvarez' },
            { nip: 302, nombre: 'Marta Castillo' },
            { nip: 303, nombre: 'Alejandro Vega' },
            { nip: 304, nombre: 'Patricia Navarro' },
            { nip: 305, nombre: 'Francisco Rivas' },
            { nip: 306, nombre: 'Carmen Soto' },
            { nip: 307, nombre: 'José Peña' },
            { nip: 308, nombre: 'Teresa Campos' },
            { nip: 309, nombre: 'Manuel Gil' },
            { nip: 310, nombre: 'Silvia Romero' },
            { nip: 311, nombre: 'Antonio Vargas' },
            { nip: 312, nombre: 'Laura Ibáñez' },
            { nip: 313, nombre: 'Enrique León' },
            { nip: 314, nombre: 'Pilar Serrano' },
            { nip: 315, nombre: 'Alberto Fuentes' },
            { nip: 316, nombre: 'Rosa Aguilar' },
            { nip: 317, nombre: 'David Paredes' },
            { nip: 318, nombre: 'Julia Montes' },
        ];
        setAlumnos(mockAlumnos);
        setProfesores(mockProfesores);
    }

    const deleteMatriculado = async (nip) => {
        setAlumnos(alumnos.filter(alumno => alumno.nip !== nip));
        setProfesores(profesores.filter(profesor => profesor.nip !== nip));
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

    // Funcion para solo aceptar digitos en la busqueda
    const handleSearchChange = (e) => {
        const value = e.target.value;
        if (/^\d*$/.test(value)) {
            setSearch(value);
        }
    };

    const searchByNIP = (nip) => {
        //Deberá buscar en la base de datos si existe el nip y si es profesor o alumno
    }

    const navigateToAddMatriculados = () => {
        //Deberá navegar a la pagina de añadir profesor/alumno
    }

    return (
        <>
            <FlechaVolver isSave={true}/>
            <Logout/>
            <div className='title-container'>
                <h2>Añadir nuevo profesor o alumno</h2>
                <div className='search-container'>
                    <Input
                            name="nip/nia"
                            size="lg"
                            type="text"
                            startContent={<FaMagnifyingGlass />}
                            labelPlacement="outside"
                            color="primary"
                            variant="bordered"
                            placeholder="Añadir profesor/alumno"
                            className="max-w-xs"
                            value={search}
                            onChange={handleSearchChange}
                    />
                    <Button 
                        size="lg" 
                        color="primary" 
                        className='search-button'
                        onClick={() => searchByNIP(search)}
                        >
                        Buscar
                    </Button>
                    <div className="create-button" onClick={navigateToAddMatriculados}>
                        <FaCirclePlus />
                    </div>
                </div>
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
                                {profesores.map(profesor => (
                                    <tr key={profesor.nip}>
                                        <td>{profesor.nip}</td>
                                        <td>{profesor.nombre}</td>
                                        <td>
                                            <button className='delete' onClick={() => deleteMatriculado(profesor.nip)}>X</button>
                                        </td>
                                    </tr>
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
                                {alumnos.map(alumno => (
                                    <tr key={alumno.nip}>
                                        <td>{alumno.nip}</td>
                                        <td>{alumno.nombre}</td>
                                        <td>
                                            <button className='delete' onClick={() => deleteMatriculado(alumno.nip)}>X</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    )
}

export default CursoMatriculados
