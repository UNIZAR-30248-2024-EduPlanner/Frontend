import "../css/Components/Lista.css"
import {Input} from "@nextui-org/react";
import { FaMagnifyingGlass, FaCirclePlus } from "react-icons/fa6";
import { FaRegEdit, FaRegTrashAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import constants from "../constants/constants";

const Lista = ({lista, nombre}) => {
    const navigate = useNavigate()

    return (
        <>
            <div className="busqueda">
                <Input
                  size="lg"
                  placeholder={"Búsqueda de " + nombre}
                  startContent={<FaMagnifyingGlass />}
                />
            </div>
            <div className="lista">
                {lista.map((item, index) => (
                    <div className="lista-item" key={index}>
                        <p className="lista-text">
                            {item.name}
                        </p>
                        <div className="lista-iconos">
                            <div className="edit">
                                <FaRegEdit />
                            </div>
                            <div className="trash">
                                <FaRegTrashAlt />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <div 
              className="create-button" 
              onClick={
                () => navigate(constants.root + "OrganizacionCrear/" + nombre + "/1")}>
                <FaCirclePlus/>
            </div>
    </>
    )
}

export default Lista