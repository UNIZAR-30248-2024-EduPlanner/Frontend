import "../css/Components/Lista.css"
import {Input} from "@nextui-org/react";
import {Button} from "@nextui-org/react";
import { FaMagnifyingGlass, FaCirclePlus } from "react-icons/fa6";
import { FaRegEdit, FaRegTrashAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import constants from "../constants/constants";
import { useEffect, useState } from "react";

const Lista = ({lista, type, creator}) => {
    const navigate = useNavigate()
    const [search, setSearch] = useState("")
    const [filteredList, setFilteredList] = useState([])

        // // Filtrar la lista en base al término de búsqueda (nombre o NIP)
        // const filteredList = lista.filter(item => {
        //     const searchTerm = search.toLowerCase();
        //     return (
        //         item.name.toLowerCase().includes(searchTerm) || // Busca por nombre
        //         (item.nip && item.nip.toString().includes(searchTerm)) // Busca por NIP si está disponible
        //     );
        // });

    useEffect(() => {
        const newList = lista.filter(item => {
            const searchTerm = search.toLowerCase();
            return (
                item.name.toLowerCase().includes(searchTerm) || // Busca por nombre
                (item.nip.toString().includes(searchTerm)) // Busca por NIP si está disponible
            )
        })

        setFilteredList(newList)
    }, [search])

    return (
        <>
            <div className="busqueda">
                <Input
                  size="lg"
                  placeholder={"Búsqueda de " + type}
                  startContent={<FaMagnifyingGlass />}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
            </div>
            <div className="lista">
                {filteredList.length > 0 ? (
                    <>
                    {filteredList.map((item, index) => (
                        <div className="lista-item" key={index}>
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
                    </>
                ) : (
                    <>
                    {lista.map((item, index) => (
                        <div className="lista-item" key={index}>
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
                    </>
                )}
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