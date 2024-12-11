import { useParams, useLocation } from "react-router-dom"
import { Input } from "@nextui-org/input";
import { Button } from "@nextui-org/react";
import "../../css/Curso/CursoCrear.css"
import SubidaFichero from "../../Components/SubidaFichero";
import FlechaVolver from "../../Components/FlechaVolver";
import { createSubject, getSubjectIdByCode } from "../../supabase/course/course";
import { createAcademicEvent } from "../../supabase/academicEvent/academicEvent";
import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import constants from "../../constants/constants";
import { useNavigate } from "react-router-dom";
import Logout from "../../Components/Logout";
import { randomColor } from "../../Components/CalendarioFunctions";

const CursoCrear = () => {
    const { type } = useParams()
    const [lista, setLista] = useState([])
    const [nombre, setNombre] = useState("")
    const [nip, setNip] = useState("")
    const [error, setError] = useState("");
    const [color, setColor] = useState(null);
    const typeSingular = type.slice(0, -1)
    const { user } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const calendario = location.state?.calendario || [];

    const create = async () => {
        setError(""); // Limpiar cualquier mensaje de error anterior

        if (
            !nombre ||
            !nip
        ) {
            setError("Uno o varios campos están vacíos.");
            window.scrollTo({ top: 0, behavior: "smooth" });
            return;
        }

        if (isNaN(nip)) {
            setError("El codigo debe ser numérico.");
            window.scrollTo({ top: 0, behavior: "smooth" });
            return;
        }

        // Llamada a la API para crear una asignatura
        const res = await createSubject(nombre, nip, color, user.id);
        if (res.error) {
            setError("Hubo un error en el registro: " + res.error);
            window.scrollTo({ top: 0, behavior: "smooth" });
            return;
        }

        const subject = await getSubjectIdByCode(nip);
        if (subject.error) {
            setError("Hubo un error en el registro: " + subject.error);
            window.scrollTo({ top: 0, behavior: "smooth" });
            return;
        }

        // Se obtiene el ID de la asignatura creada
        const subject_id = subject.data;

        // Crear los horarios de la asignatura
        calendario.forEach(async (horario) => {
            const horarioResponse = await createAcademicEvent(
                nombre, 
                horario.starting_date, 
                horario.end_date, 
                horario.group_name, 
                parseInt(horario.periodicity), 
                horario.description, 
                horario.type, 
                horario.place, 
                horario.start, 
                horario.end, 
                subject_id
            );
            if (horarioResponse.error) {
                setError("Hubo un error en el registro: " + res.error);
                window.scrollTo({ top: 0, behavior: "smooth" });
                return;
            }
            console.log("Respuesta del servidor: ", horarioResponse);
        });
        localStorage.removeItem("color");

        navigate(constants.root + 'CursoMenu');
    }

    const calendar = () => {
        navigate(`${location.pathname}/Calendario/`, { state: { calendario: calendario } });
    }

    useEffect(() => {
        if (!localStorage.getItem("color")) {
            const randColor = randomColor();
            localStorage.setItem("color", randColor);
            setColor(randColor);
        } else {
            setColor(localStorage.getItem("color"));
        }
    }, [])

    return (
        <>
            <FlechaVolver />
            <Logout />
            <h1 className="cur-crear-tit font-bold"> Crear {type} </h1>
            <div className="cur-crear-container">
                <div className="cur-crear-uno">
                    <h2 className="cur-crear-tit"> Crea una {typeSingular}</h2>
                    <div className="uno space-y-20">
                        {/* Mensaje de error */}
                        {error && (
                            <p
                                style={{
                                    color: "var(--color-second)",
                                    textAlign: "center", // Centra el texto
                                }}
                            >
                                {error}
                            </p>
                        )}
                        <Input
                            name="name"
                            size="lg"
                            type="name"
                            labelPlacement="outside"
                            color="primary"
                            variant="bordered"
                            label="Nombre"
                            placeholder="Nombre de la asignatura"
                            className="max-w-xs"
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                        />
                        <Input
                            name="nip"
                            size="lg"
                            type="name"
                            color="primary"
                            labelPlacement="outside"
                            variant="bordered"
                            label="Codigo"
                            placeholder="Codigo de la asignatura"
                            className="max-w-xs"
                            value={nip}
                            onChange={(e) => setNip(e.target.value)}
                        />
                        <div className="botones">
                            <Button size="lg" color="primary" onClick={calendar}>
                                Establecer calendario
                            </Button>
                            <Button size="lg" color="primary" onClick={create}>
                                Crear
                            </Button>
                        </div>
                    </div>
                </div>
                <div className="fich">
                    <h2 className="cur-crear-tit"> Sube un fichero de {type} </h2>
                    <p className="formato">
                        El formato del fichero por línea será el siguiente: <br />
                        <span>
                            Nombre de la asignatura;Codigo; <br />
                        </span>
                    </p>
                    <SubidaFichero type={type} lista={lista} setLista={setLista} />
                </div>
            </div>
        </>
    )

}

export default CursoCrear
