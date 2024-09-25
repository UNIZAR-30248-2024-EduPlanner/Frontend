import "../../css/Organizacion/OrganizacionModificar.css"
import { useParams } from "react-router-dom"
import {Input} from "@nextui-org/input";
import {Button} from "@nextui-org/react";
import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import FlechaVolver from "../../Components/FlechaVolver";


const OrganizacionModificar = () => {
    const { type } = useParams()
    const typeSingular = type == "profesores" ? "profesor" : type.split(0, type.length - 1)
    const { id } = useParams()

    const [isVisible, setIsVisible] = useState(false);
    const toggleVisibility = () => setIsVisible(!isVisible);

    return (
        <>
            <FlechaVolver/>
            <h1 className="org-mod-tit"> Modificar {typeSingular} </h1>
            <div className="mod-org-form space-y-20">
                <Input
                    size="lg" 
                    type="name"
                    labelPlacement="outside"
                    color="primary"
                    variant="bordered"
                    label="Nombre" 
                    placeholder={"Introduzca el nombre del " + typeSingular}
                    className="max-w-xs"
                />
                <Input 
                    size="lg" 
                    type="name"
                    color="primary"
                    labelPlacement="outside"
                    variant="bordered"
                    label="NIP / NIA" 
                    placeholder="Introduzca su número identificativo"
                    className="max-w-xs"
                />
                <Input
                    label="Password"
                    size="lg"
                    labelPlacement="outside"
                    color="primary"
                    variant="bordered"
                    placeholder="Introduzca su contraseña"
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
                />
                <Button size="lg" color="primary">
                    Crear
                </Button>
            </div>

        </>
    )
}

export default OrganizacionModificar