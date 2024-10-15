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
  
    // Variables que contienen el contenido de los input
    const [nombre, setNombre] = useState("")
    const [nip, setNip] = useState("")
    const [password, setPassword] = useState("")
    const [lista, setLista] = useState([])

    // Funciones para crear el item
    const create = () => {
      // TODO: dependiendo el tipo a crear, crear uno u otro
      // llamada a funcion crear
    }

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
                        <Button size="lg" color="primary" onClick={create}>
                            Crear
                        </Button>
                    </div>
                </div>
                <div className="fich">
                    <h2 className="org-crear-tit"> Sube un fichero de {type} </h2>
                    <p className="formato">
                      El formato del fichero por línea será el siguiente: <br/>
                      <span>
                        Nombre Apellidos;NIP;Contraseña; <br/>
                      </span>
                    </p>
                    <SubidaFichero type={type} lista={lista} setLista={setLista}/>
                </div>
            </div>
        </>
    )
}

export default OrganizacionCrear