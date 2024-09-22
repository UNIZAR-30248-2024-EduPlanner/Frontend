import "../css/Components/Lista.css"
import {Input} from "@nextui-org/react";
import { FaMagnifyingGlass } from "react-icons/fa6";
import { FaRegEdit, FaRegTrashAlt } from "react-icons/fa";

const Lista = ({lista, nombre}) => {
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
                            {item.NIP} - {item.name}
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
    </>
    )
}

export default Lista