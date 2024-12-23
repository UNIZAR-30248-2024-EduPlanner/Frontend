import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Input } from "@nextui-org/input";
import { Button } from "@nextui-org/react";
import { FaMagnifyingGlass } from "react-icons/fa6";
import SubidaFichero from "../../Components/SubidaFichero";
import {getStudentIdByNipAndOrganization, matriculateStudent } from "../../supabase/student/student";
import {getTeacherIdByNipAndOrganization, assignSubjectToTeacher } from "../../supabase/teacher/teacher";
import FlechaVolver from "../../Components/FlechaVolver";
import Logout from "../../Components/Logout";
import '../../css/Curso/CursoMatriculadosAñadir.css';

const CursoMatriculadosAñadir = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { nombre, codigo, organization_id } = location.state || {};
    const [lista, setLista] = useState([]);
    const [nip, setNip] = useState("");
    const [foundItem, setFoundItem] = useState({});
    const [show, setShow] = useState(false);
    const [found, setFound] = useState(false);
    const [foundError, setFoundError] = useState(false);

    const type = "matriculas";


    const searchAlumnoOrProfesor = async () => {
        
        // Verificar que nip es un valor numérico positivo
        setFoundError(false);
        if (isNaN(nip) || nip === "" || parseInt(nip) < 0) {
            setFound(false);
            setFoundError(true);
            setShow(true);
            return;
        }

        // Verificar si el nip pertenece a un alumno o profesor
        let res = (await getStudentIdByNipAndOrganization(nip, organization_id)).data;
        if (res !== null && res !== undefined) {
            setFound(true);
            setFoundItem({
                id: res.id,
                name: res.name,
                nip: nip,
                role: res.role,
            });
        } else {
            res = (await getTeacherIdByNipAndOrganization(nip, organization_id)).data;
            if (res !== null && res !== undefined) {
                setFound(true);
                setFoundItem({
                    id: res.id,
                    name: res.name,
                    nip: nip,
                    role: res.role,
                });
            } else {
                setFound(false);
            }
        }
        setShow(true);
    }

    const addAlumnoOrProfesor = async () => {
        const res = foundItem.role === "student" ? 
            await matriculateStudent(foundItem.nip, codigo) : 
            await assignSubjectToTeacher(foundItem.nip, codigo);
        if (res.error) {
            console.log(res.error);
        } else {
            navigate(-1)
        }
    }

    return (
        <>
            <FlechaVolver />
            <Logout />
            <h1 className="cur-crear-tit font-bold"> Añadir matrículas a {nombre}</h1>
            <div className="cur-crear-container">
                <div className="cur-crear-uno">
                    <h2>Buscar por NIP/NIA</h2>
                    <div className="botones">
                        <Input
                            name="nip"
                            size="lg"
                            type="name"
                            color="primary"
                            labelPlacement="outside"
                            startContent={<FaMagnifyingGlass />}
                            variant="bordered"
                            placeholder="NIP/NIA"
                            className="max-w-xs"
                            value={nip}
                            onChange={(e) => {setNip(e.target.value); setShow(false)}}
                        />
                        <Button size="lg" color="primary" onClick={searchAlumnoOrProfesor}>
                            Buscar
                        </Button>
                    </div>
                {show && (
                    found ? (
                    <div className="found">
                        <p>
                            Se ha encontrado al {foundItem.role === "student" ? " alumno " : " profesor "} {foundItem.name} con NIP {nip}.
                        </p>
                        <Button size="md" color="primary" className="add" onClick={addAlumnoOrProfesor}>
                            Añadir
                        </Button>
                    </div>
                    ) : (
                        <div className="not-found">
                            {isNaN(nip) || parseInt(nip) < 0 ? (
                                <p>Especifique un NIP válido de un alumno o profesor</p>
                            ) : (
                                <p>No se ha encontrado ningún alumno o profesor con el NIP {nip}.</p>
                            )}
                        </div>
                    )
                )}
                </div>
                    <div className="fich">
                        <h2 className="cur-crear-tit"> Sube un fichero</h2>
                        <p className="formato">
                            El formato del fichero por línea será el siguiente: <br />
                            <span>
                                NIP/NIA; <br />
                            </span>
                        </p>
                        <SubidaFichero 
                            type={type} 
                            lista={lista} 
                            setLista={setLista} 
                            subjectCode={codigo}
                            organization_id={organization_id} 
                        />
                    </div>
            </div>
        </>
    )
}

export default CursoMatriculadosAñadir;
