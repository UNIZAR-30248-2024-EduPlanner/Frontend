import { useParams } from "react-router-dom"
import "../../css/Organizacion/OrganizacionCrear.css"
import {Input} from "@nextui-org/input";
import {Button} from "@nextui-org/react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useState } from "react";

const OrganizacionCrear = () => {
    const {type} = useParams()
    const {id} = useParams()

    const [isVisible, setIsVisible] = useState(false);
    const toggleVisibility = () => setIsVisible(!isVisible);
  
  
    return (
        <>
            <h1 className="org-crear-tit"> Crear {type} </h1>
            <div className="org-crear-container">
                <div className="org-crear-uno">
                    <h2 className="org-crear-tit"> Crea un {type.slice(0,type.length-1)} </h2>
                    <div className="uno space-y-20">
                        <Input
                          size="lg" 
                          type="name"
                          labelPlacement="outside"
                          color="primary"
                          variant="bordered"
                          label="Nombre" 
                          placeholder={"Introduzca el nombre del " + type.slice(0,type.length-1)}
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
                </div>
                <div className="fich">
                    <h2 className="org-crear-tit"> Sube un fichero de {type} </h2>
                    
                </div>
            </div>
        </>
    )
}

export default OrganizacionCrear