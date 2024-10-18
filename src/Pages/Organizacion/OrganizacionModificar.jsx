import "../../css/Organizacion/OrganizacionModificar.css"
import { useParams } from "react-router-dom"
import { Input } from "@nextui-org/input";
import { Button } from "@nextui-org/react";
import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import FlechaVolver from "../../Components/FlechaVolver";
import { editCourse, editStudent, editTeacher } from "../../supabase/organization/organization";
import constants from "../../constants/constants";
import { useNavigate } from "react-router-dom";
import Logout from "../../Components/Logout";

const OrganizacionModificar = () => {
    const { type } = useParams()
    const typeSingular = type == "profesores" ? "profesor" : type.slice(0, -1)
    const { id } = useParams()
    const { nombreViejo } = useParams()
    const { nipViejo } = useParams()
    const [error, setError] = useState("");
    const navigate = useNavigate()
    console.log(id)

    const [isVisible, setIsVisible] = useState(false);
    const toggleVisibility = () => setIsVisible(!isVisible);

    // Variables que contienen el contenido de los input
    const [nombre, setNombre] = useState(nombreViejo)
    const [nip, setNip] = useState(nipViejo)
    const [password, setPassword] = useState("")

    const update = async () => {
        // TODO: dependiendo el tipo a crear, crear uno u otro
        // llamada a funcion crear
        setError(""); // Limpiar cualquier mensaje de error anterior

        if (
            !nombre ||
            !nip ||
            !password
        ) {
            setError("Uno o varios campos están vacíos.");
            window.scrollTo({ top: 0, behavior: "smooth" });
            return;
        }

        if (isNaN(nip)) {
            setError("El NIP/NIA debe ser numérico.");
            window.scrollTo({ top: 0, behavior: "smooth" });
            return;
        }

        if (password.length < 6) {
            setError("La contraseña debe tener al menos 6 caracteres.");
            window.scrollTo({ top: 0, behavior: "smooth" });
            return;
        }

        // Si llega aquí, se ejecuta la petición para crear
        const updates = { name: nombre, nip: nip, pass: password };

        if (typeSingular == constants.profesor) {
            // Llamada a la API para crear un profesor
            const res = await editTeacher(id, updates)
            if (res.error) {
                setError("Hubo un error en el registro: " + res.error.message);
                window.scrollTo({ top: 0, behavior: "smooth" });
                return;
            }
        } else if (typeSingular == constants.alumno) {
            // Llamada a la API para crear un alumno
            const res = await editStudent(id, updates)
            if (res.error) {
                setError("Hubo un error en el registro: " + res.error.message);
                window.scrollTo({ top: 0, behavior: "smooth" });
                return;
            }
            console.log(res)
            console.log("alumno editado ")
        } else if (typeSingular == constants.curso) {
            // Llamada a la API para crear un curso
            const res = await editCourse(id, updates)
            if (res.error) {
                setError("Hubo un error en el registro: " + res.error.message);
                window.scrollTo({ top: 0, behavior: "smooth" });
                return;
            }
        }
        navigate(-1)
    }
    return (
        <>
            <FlechaVolver />
            <Logout/>
            <h1 className="org-mod-tit"> Modificar {typeSingular} </h1>
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
            <div className="mod-org-form space-y-20">
                <Input
                    size="lg"
                    type="name"
                    labelPlacement="outside"
                    color="primary"
                    variant="bordered"
                    label="Nombre"
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
                    label="NIP / NIA"
                    className="max-w-xs"
                    value={nip}
                    onChange={(e) => setNip(e.target.value)}
                />
                <Input
                    label="Contraseña"
                    size="lg"
                    labelPlacement="outside"
                    color="primary"
                    variant="bordered"
                    endContent={
                        <button className="focus:outline-none" type="button" onClick={toggleVisibility} aria-label="toggle password visibility">
                            {isVisible ? (
                                <FaEyeSlash className="text-2xl text-default-400 pointer-events-none" />
                            ) : (
                                <FaEye className="text-2xl text-default-400 pointer-events-none" />
                            )}
                        </button>
                    }
                    type={isVisible ? "text" : "password"}
                    className="max-w-xs"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <Button size="lg" color="primary" onClick={update}>
                    Modificar
                </Button>
            </div>

        </>
    )
}

export default OrganizacionModificar