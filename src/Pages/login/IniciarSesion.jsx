import "../../css/Organizacion/OrganizacionModificar.css";
import { Input } from "@nextui-org/input";
import { Button } from "@nextui-org/react";
import { useEffect, useState } from "react";
import constants from "../../constants/constants";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import FlechaVolver from "../../Components/FlechaVolver";
import { getAllOrganizations } from "../../supabase/organization/organization";
import { useAuth } from "../../context/AuthContext"; // Importar el hook useAuth

const IniciarSesion = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [nia, setNia] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState(""); // Nuevo estado para la opción seleccionada
    const [organization, setOrganization] = useState(""); // Estado para la organización seleccionada
    const [organizaciones, setOrganizaciones] = useState([])
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const toggleVisibility = () => setIsVisible(!isVisible);

    const { login, type, isAuthenticated } = useAuth(); // Acceder a la función register desde el contexto

    const getAllItems = async () => {
        const organizaciones = await getAllOrganizations(1)
        if (organizaciones.error) setOrganizaciones(organizaciones.data)
        else setOrganizaciones(organizaciones.data)
    }

    useEffect(() => {
        getAllItems()
    }, [])

    useEffect(() => {
        if (isAuthenticated) {
            if (type == constants.organizacion) navigate(constants.root + "OrganizacionMenu")
            else if (type == constants.alumno) navigate(constants.root + "Calendario")
            else if (type == constants.profesor) navigate(constants.root + "Calendario")
            else if (type == constants.curso) navigate(constants.root + "CursoMenu")
        }
    }, [type, isAuthenticated])

    const handleSubmit = async () => {
        setError(""); // Reinicia el estado del error al intentar enviar el formulario

        if (role === "") {
            setError("Por favor, selecciona un tipo de usuario."); // Si no se selecciona nada
            window.scrollTo({ top: 0, behavior: "smooth" });
            return;
        }

        if (organization === "") {
            setError("Por favor, selecciona una organización."); // Si no se selecciona nada
            window.scrollTo({ top: 0, behavior: "smooth" });
            return;
        }

        // Si llega aquí, se ejecuta la petición para loguear
        const res = await login(nia, password, role, organization);
        console.log(res);
        if (res == false) {
            setError("Usuario y/o contraseñas incorrectos.");
            window.scrollTo({ top: 0, behavior: "smooth" });
            return;
        }
    }

    return (
        <>
            <FlechaVolver />
            <h1 className="org-mod-tit"> Inicio de Sesión </h1>

            {/* Mensaje de error en color secundario */}
            {error && (
                <p style={{ color: "var(--color-second)", textAlign: "center" }}>
                    {error}
                </p>
            )}

            <div className="mod-org-form space-y-20">

                {/* Select para elegir la opción */}
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: "20px" }}>
                    <label>Seleccione qué tipo de usuario es:</label>
                    <select
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        style={{
                            width: "100%",
                            maxWidth: "300px",
                            padding: "10px",
                            fontSize: "16px",
                            marginTop: "10px",
                            border: "2px solid #ccc",
                            borderRadius: "5px",
                            boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
                        }}>
                        <option value="">Seleccionar...</option>
                        <option value={constants.alumno}>Alumno</option>
                        <option value={constants.profesor}>Profesor</option>
                        <option value={constants.curso}>Curso</option>
                        <option value={constants.organizacion}>Organizacion</option>
                    </select>
                </div>

                {/* Select para elegir la organización */}
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: "20px" }}>
                    <label>Seleccione su organización:</label>
                    <select
                        value={organization}
                        onChange={(e) => setOrganization(e.target.value)}
                        style={{
                            width: "100%",
                            maxWidth: "300px",
                            padding: "10px",
                            fontSize: "16px",
                            marginTop: "10px",
                            border: "2px solid #ccc",
                            borderRadius: "5px",
                            boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
                        }}
                    >
                        <option value="">Seleccionar...</option>
                        {organizaciones.map((org, index) => (
                            <option key={index} value={org.id}>
                                {org.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Campo NIA / NIP */}
                <Input
                    name="nia/nip"
                    size="lg"
                    type="name"
                    labelPlacement="outside"
                    color="primary"
                    variant="bordered"
                    label="NIA / NIP"
                    placeholder={""}
                    className="max-w-xs"
                    value={nia}
                    onChange={(e) => setNia(e.target.value)}
                />

                {/* Campo Contraseña */}
                <Input
                    name="password"
                    label="Contraseña"
                    size="lg"
                    labelPlacement="outside"
                    color="primary"
                    variant="bordered"
                    placeholder=""
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

                {/* Botón Enviar */}
                <Button size="lg" color="primary" onClick={handleSubmit}>
                    Enviar
                </Button>
            </div>
        </>
    );
};

export default IniciarSesion;
