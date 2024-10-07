import "../../css/Organizacion/OrganizacionModificar.css"
import { Input } from "@nextui-org/input";
import { Button } from "@nextui-org/react";
import { useState } from "react";
import constants from "../../constants/constants"
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import FlechaVolver from "../../Components/FlechaVolver";


const IniciarSesion = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [nia, setNia] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const toggleVisibility = () => setIsVisible(!isVisible);

    const usuario1 = "curso";
    const usuario2 = "organizacion";
    const password1 = "curso";
    const password2 = "organizacion";

    const handleSubmit = () => {
        if ((nia === usuario1 && password === password1)) {
            navigate(constants.root + "CursoMenu");
        } else if ((nia === usuario2 && password === password2)) {
            navigate(constants.root + "OrganizacionMenu")
        } else {
            alert("NIA o contraseña incorrectos"); // O cualquier otra acción de error
        }
    };

    return (
        <>
            <FlechaVolver />
            <h1 className="org-mod-tit"> Inicio de Sesión </h1>
            <div className="mod-org-form space-y-20">
                <Input
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
                <Input
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
                <Button size="lg" color="primary" onClick={handleSubmit}>
                    Enviar
                </Button>
            </div>

        </>
    )
}

export default IniciarSesion