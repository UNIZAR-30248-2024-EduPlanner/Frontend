import "../css/Components/Lista.css"
import {Input} from "@nextui-org/react";
import {Button} from "@nextui-org/react";
import { FaMagnifyingGlass, FaCirclePlus } from "react-icons/fa6";
import { FaRegEdit, FaRegTrashAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import constants from "../constants/constants";

const Lista = ({lista, type, creator}) => {
    const navigate = useNavigate()

    return (
        <>
            <div className="busqueda">
                <Input
                  size="lg"
                  placeholder={"Búsqueda de " + type}
                  startContent={<FaMagnifyingGlass />}
                />
            </div>
            <div className="lista">
                {lista.map((item, index) => (
                    <div className="lista-item" key={index} onClick={() => { if(type === "cursos") navigate(constants.root + type + "Menu")}}>
                        <p className="lista-text">
                            {item.name}
                        </p>
                        <div className="lista-iconos">
                            <Button 
                              className="edit" 
                              size="lg"
                              onClick={() => navigate(constants.root + creator + "Modificar/" + type + "/" + index)}  
                            >
                                <FaRegEdit />
                            </Button>
                            <Button className="trash" size="lg" >
                                <FaRegTrashAlt />
                            </Button>
                        </div>
                    </div>
                ))}
            </div>
            <div 
              className="create-button" 
              onClick={
                () => navigate(constants.root + creator + "Crear/" + type)}>
                <FaCirclePlus/>
            </div>
    </>
    )
}

export default Lista