import { useParams } from "react-router-dom"
import {Input} from "@nextui-org/input";
import {Button} from "@nextui-org/react";
import "../../css/Curso/CursoCrear.css"
import SubidaFichero from "../../Components/SubidaFichero";
import FlechaVolver from "../../Components/FlechaVolver";

const CursoCrear = () => {
    const {type} = useParams()
    const typeSingular = type.slice(0, -1)

    return (
        <>
            <FlechaVolver/>
            <h1 className="cur-crear-tit"> Crear {type} </h1>
            <div className="cur-crear-container">
                <div className="cur-crear-uno">
                    <h2 className="cur-crear-tit"> Datos de {typeSingular}</h2>
                    <div className="uno space-y-20">
                        <Input
                          size="lg" 
                          type="name"
                          labelPlacement="outside"
                          color="primary"
                          variant="bordered"
                          label="Nombre" 
                          placeholder="Nombre de la asignatura"
                          className="max-w-xs"
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
                        />
                        <Button size="lg" color="primary">
                            Crear
                        </Button>
                    </div>
                </div>
                <div className="fich">
                    <h2 className="cur-crear-tit"> Sube un fichero de {type} </h2>
                    <SubidaFichero type={type}/>
                </div>
            </div>
        </>
    )

}

export default CursoCrear
