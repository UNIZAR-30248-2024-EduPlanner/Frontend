import FlechaVolver from "../../Components/FlechaVolver";
import { useParams } from "react-router-dom"
import {Input} from "@nextui-org/input";
import {Button} from "@nextui-org/react";
import "../../css/Curso/CursoModificar.css"

const CursoModificar = () => {
    const { type } = useParams()
    const typeSingular = type.slice(0, -1)

    return (
        <>
            <FlechaVolver/>
            <h1 className="cur-mod-tit"> Modificar {typeSingular} </h1>
            <div className="cur-mod-form space-y-20">
                <Input
                    size="lg" 
                    type="name"
                    labelPlacement="outside"
                    color="primary"
                    variant="bordered"
                    label="Nombre" 
                    placeholder={"Nombre de " + typeSingular}
                    className="max-w-xs"
                />
                <Input 
                    size="lg" 
                    type="name"
                    color="primary"
                    labelPlacement="outside"
                    variant="bordered"
                    label="Código" 
                    placeholder={"Código de " + typeSingular}
                    className="max-w-xs"
                />
                <Button size="lg" color="primary">
                    Modificar
                </Button>
            </div>
        </>
    )
}

export default CursoModificar