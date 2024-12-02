import { useLocation } from "react-router-dom";
import { useState } from "react";
import { Input } from "@nextui-org/input";
import { Button } from "@nextui-org/react";
import { FaMagnifyingGlass } from "react-icons/fa6";
import SubidaFichero from "../../Components/SubidaFichero";
import FlechaVolver from "../../Components/FlechaVolver";
import Logout from "../../Components/Logout";
import '../../css/Curso/CursoMatriculadosAñadir.css';

const CursoMatriculadosAñadir = () => {
    const location = useLocation();
    const { nombre, codigo, subject_id, organization_id } = location.state || {};
    const [type, setType] = useState("matriculas");
    const [lista, setLista] = useState([]);
    const [nip, setNip] = useState("");
    const [foundItem, setFoundItem] = useState({});
    const [show, setShow] = useState(false);
    const [found, setFound] = useState(false);


    const searchAlumnoOrProfesor = () => {
        // Busca por profesor y si no encuentra a nadie, busca por alumno
        // Si encuentra uno, lo añade
        // Si no encuentra a nadie, muestra un mensaje de error
        if (nip === "1") {
            setFound(true);
            setFoundItem({
                nombre: "Jorge Pérez",
                nip: 145829,
                tipo: "alumno",
            });
        } else if (nip === "2") {
            setFound(true);
            setFoundItem({
                nombre: "María García",
                nip: 145830,
                tipo: "profesor",
            });
        } else {
            setFound(false);
        }
        setShow(true);
    }

    const addAlumnoOrProfesor = () => {
        // Añade al alumno o profesor encontrado a la lista de matriculados
        // Si ya está en la lista, muestra un mensaje de error
        console.log("Añadido");
    }

    return (
        <>
            <FlechaVolver />
            <Logout />
            <h1 className="cur-crear-tit"> Añadir profesores o alumnos </h1>
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
                        <p>Se ha encontrado al {foundItem.tipo} {foundItem.nombre} con el NIP {foundItem.nip}</p>
                        <Button size="md" color="primary" className="add" onClick={addAlumnoOrProfesor}>
                            Añadir
                        </Button>
                    </div>
                    ) : (
                        <div className="not-found">
                            {nip === "" ? (
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
                        <SubidaFichero type={type} lista={lista} setLista={setLista} />
                    </div>
            </div>
        </>
    )
}

export default CursoMatriculadosAñadir;
