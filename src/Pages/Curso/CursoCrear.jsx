import { useParams } from "react-router-dom"
import { Input } from "@nextui-org/input";
import { Button } from "@nextui-org/react";
import "../../css/Curso/CursoCrear.css"
import SubidaFichero from "../../Components/SubidaFichero";
import FlechaVolver from "../../Components/FlechaVolver";
import { createSubject } from "../../supabase/course/course";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Logout from "../../Components/Logout";

const CursoCrear = () => {
    const { type } = useParams()
    const [lista, setLista] = useState([])
    const [nombre, setNombre] = useState("")
    const [nip, setNip] = useState("")
    const [error, setError] = useState("");
    const typeSingular = type.slice(0, -1)
    const { user } = useAuth();
    const navigate = useNavigate()


    const create = async () => {
        // TODO:  llamada a funcion crear
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

        // Si llega aquí, se ejecuta la petición para crear

        console.log(user)
        // Llamada a la API para crear un profesor
        const res = await createSubject(nombre, nip, user.id)
        if (res.error) {
            setError("Hubo un error en el registro: " + res.error.message);
            window.scrollTo({ top: 0, behavior: "smooth" });
            return;
        }

        navigate(-1)
    }

    const calendar = () => {
        navigate(`${location.pathname}/calendario/`)
    }

    return (
        <>
            <FlechaVolver />
            <Logout />
            <h1 className="cur-crear-tit"> Crear {type} </h1>
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
