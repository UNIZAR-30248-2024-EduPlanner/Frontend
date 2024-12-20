import "../../css/login/CrearOrganizacion.css";
import { Input } from "@nextui-org/input";
import { Button } from "@nextui-org/react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import FlechaVolver from "../../Components/FlechaVolver";
import { useAuth } from "../../context/AuthContext"; // Importar el hook useAuth
import constants from "../../constants/constants";

const CrearOrganizacion = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [nombreOrganizacion, setNombreOrganizacion] = useState("");
    const [nipNia, setNipNia] = useState("");
    const [password, setPassword] = useState("");
    const [repeatPassword, setRepeatPassword] = useState("");
    const [error, setError] = useState(""); // Estado para el mensaje de error
    const navigate = useNavigate();

    const { register } = useAuth(); // Acceder a la función register desde el contexto

    const toggleVisibility = () => setIsVisible(!isVisible);

    const handleSubmit = async () => {
        setError(""); // Limpiar cualquier mensaje de error anterior

        if (
            !nombreOrganizacion ||
            !nipNia ||
            !password ||
            !repeatPassword
        ) {
            setError("Uno o varios campos están vacíos.");
            window.scrollTo({ top: 0, behavior: "smooth" });
            return;
        }

        if (password.length < 6) {
            setError("La contraseña debe tener al menos 6 caracteres.");
            window.scrollTo({ top: 0, behavior: "smooth" });
            return;
        }

        if (password !== repeatPassword) {
            setError("Las contraseñas no coinciden.");
            window.scrollTo({ top: 0, behavior: "smooth" });
            return;
        }

        // Si llega aquí, se ejecuta la petición para crear la organización
        const res = await register(nombreOrganizacion, nipNia, password);
        if (res.error) {
            setError("Hubo un error en el registro: " + res.error.message);
            window.scrollTo({ top: 0, behavior: "smooth" });
            return;
        }

        // Redirigir o realizar otra acción tras el registro
        navigate(constants.root + "OrganizacionMenu");
    };

    return (
        <>
            <FlechaVolver />
            <h1 className="org-mod-tit">Crear Organización</h1>

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

            <div className="mod-org-form space-y-12">
                <Input
                    name="nombreOrganizacion"
                    size="lg"
                    type="text"
                    labelPlacement="outside"
                    color="primary"
                    variant="bordered"
                    label="Nombre de la organización"
                    placeholder=""
                    className="max-w-xs"
                    value={nombreOrganizacion}
                    onChange={(e) => setNombreOrganizacion(e.target.value)}
                />
                <Input
                    name="nipNia"
                    size="lg"
                    type="text"
                    color="primary"
                    labelPlacement="outside"
                    variant="bordered"
                    label="NIP / NIA (de este usuario)"
                    placeholder=""
                    className="max-w-xs"
                    value={nipNia}
                    onChange={(e) => setNipNia(e.target.value)}
                />
                <Input
                    name= "password"
                    label="Contraseña"
                    size="lg"
                    labelPlacement="outside"
                    color="primary"
                    variant="bordered"
                    placeholder=""
                    endContent={
                        <button
                            className="focus:outline-none"
                            type="button"
                            onClick={toggleVisibility}
                            aria-label="toggle password visibility"
                        >
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
                <Input
                    name="repeatPassword"
                    label="Repite tu contraseña"
                    size="lg"
                    labelPlacement="outside"
                    color="primary"
                    variant="bordered"
                    placeholder=""
                    endContent={
                        <button
                            className="focus:outline-none"
                            type="button"
                            onClick={toggleVisibility}
                            aria-label="toggle password visibility"
                        >
                            {isVisible ? (
                                <FaEyeSlash className="text-2xl text-default-400 pointer-events-none" />
                            ) : (
                                <FaEye className="text-2xl text-default-400 pointer-events-none" />
                            )}
                        </button>
                    }
                    type={isVisible ? "text" : "password"}
                    className="max-w-xs"
                    value={repeatPassword}
                    onChange={(e) => setRepeatPassword(e.target.value)}
                />
                <Button size="lg" color="primary" onClick={handleSubmit}>
                    Crear
                </Button>
            </div>
        </>
    );
};

export default CrearOrganizacion;
