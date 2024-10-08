import "../../css/login/CrearOrganizacion.css";
import { Input } from "@nextui-org/input";
import { Button } from "@nextui-org/react";
import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import FlechaVolver from "../../Components/FlechaVolver";

const CrearOrganizacion = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [nombreOrganizacion, setNombreOrganizacion] = useState("");
    const [dominioCorreo, setDominioCorreo] = useState("");
    const [nipNia, setNipNia] = useState("");
    const [dominioOrganizacion, setDominioOrganizacion] = useState("");
    const [password, setPassword] = useState("");
    const [repeatPassword, setRepeatPassword] = useState("");

    const toggleVisibility = () => setIsVisible(!isVisible);

    const handleSubmit = () => {
        if (
            !nombreOrganizacion ||
            !dominioCorreo ||
            !nipNia ||
            !dominioOrganizacion ||
            !password ||
            !repeatPassword
        ) {
            alert("Uno o varios campos están vacíos.");
            return;
        }

        if (password !== repeatPassword) {
            alert("Las contraseñas no coinciden.");
            return;
        }

        // Si llega aqui peticion create a la base de datos
    };

    return (
        <>
            <FlechaVolver />
            <h1 className="org-mod-tit">Crear Organización</h1>
            <div className="mod-org-form space-y-20">
                <Input
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
                    size="lg"
                    type="text"
                    color="primary"
                    labelPlacement="outside"
                    variant="bordered"
                    label="Dominio de correo electrónico"
                    placeholder=""
                    className="max-w-xs"
                    value={dominioCorreo}
                    onChange={(e) => setDominioCorreo(e.target.value)}
                />
                <Input
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
                    size="lg"
                    type="text"
                    color="primary"
                    labelPlacement="outside"
                    variant="bordered"
                    label="Dominio de la organización"
                    placeholder=""
                    className="max-w-xs"
                    value={dominioOrganizacion}
                    onChange={(e) => setDominioOrganizacion(e.target.value)}
                />
                <Input
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
