import { useParams } from "react-router-dom"
import {Input} from "@nextui-org/input";
import {Button} from "@nextui-org/react";
import "../../css/Curso/CursoCrear.css"

const CursoCrear = () => {
    const {id} = useParams()

    return (
        <>
            <h1 className="cur-crear-tit"> Crear Asignatura</h1>
            <div className="cur-crear-container">
                <div className="cur-crear-uno">
                    <h2 className="cur-crear-tit"> Crea una asignatura</h2>
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
                    <h2 className="cur-crear-tit"> Sube un fichero de asignaturas </h2>
                </div>
            </div>
        </>
    )

}

export default CursoCrear
