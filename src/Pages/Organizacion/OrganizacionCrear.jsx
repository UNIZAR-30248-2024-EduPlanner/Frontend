import { useParams } from "react-router-dom"
import "../../css/Organizacion/OrganizacionCrear.css"
import {Input} from "@nextui-org/input";
import {Button} from "@nextui-org/react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useState } from "react";
import SubidaFichero from "../../Components/SubidaFichero";
import FlechaVolver from "../../Components/FlechaVolver";

const OrganizacionCrear = () => {
    const {type} = useParams()
    const typeSingular = type == "profesores" ? "profesor" : type.slice(0, -1)
  
    const [isVisible, setIsVisible] = useState(false);
    const toggleVisibility = () => setIsVisible(!isVisible);
  
  
    return (
        <>
            <FlechaVolver/>
            <h1 className="org-crear-tit"> Crear {type} </h1>
            <div className="org-crear-container">
                <div className="org-crear-uno">
                    <h2 className="org-crear-tit"> Crea un {typeSingular} </h2>
                    <div className="uno space-y-20">
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
                </div>
                <div className="fich">
                    <h2 className="org-crear-tit"> Sube un fichero de {type} </h2>
                    {type === "alumnos" ? (
                      <p className="formato">
                        El formato del fichero por línea será el siguiente: <br/>
                        <span>
                          Nombre Apellidos;NIP;Contraseña;  <br/>
                          
                        </span>
                      </p>
                    ) : type === "cursos" ? (
                      <></>
                    ) : type === "profesores" ? (
                      <></>

                    ) : (
                      <></>

                    )}
                    <SubidaFichero type={type}/>
                </div>
            </div>
        </>
    )
}

export default OrganizacionCrear