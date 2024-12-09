import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext"
import { getSubjectsByTeacherId } from "../../supabase/teacher/teacher";
import { Input } from "@nextui-org/react";
import { FaMagnifyingGlass } from "react-icons/fa6";
import "../../css/Profesor/ProfesorMatriculas.css";
import FlechaVolver from "../../Components/FlechaVolver";
import { useNavigate } from "react-router-dom";
import constants from "../../constants/constants";

const ProfesorMatriculas = () => {
    
    const { user } = useAuth();
    const navigate = useNavigate();
    const [asignaturas, setAsignaturas] = useState([]);
    const [search, setSearch] = useState("");
    const [filteredList, setFilteredList] = useState([]);
    
    const recuperarAsignaturas = async () => {
        const lista = await getSubjectsByTeacherId(user.id);
        if (lista.error) {
            return console.error("Error al recuperar las asignaturas del profesor");
        } else {
            setAsignaturas(lista.data);
        }
    }

    useEffect(() => {
        recuperarAsignaturas();
    }, [user]);

    useEffect(() => {
        const newList = asignaturas.filter(item => {
            const searchTerm = search.toLowerCase();
            return (
                item.name.toLowerCase().includes(searchTerm) // Busca por nombre
            );
        });

        setFilteredList(newList);
    }, [search]);

    console.log("asignaturas", asignaturas)

    return (
        <div className="flex flex-col items-center">
            <FlechaVolver/>
            <h1 className="tit"> Tus asignaturas, {user.name} </h1>
            <div className="busqueda-asig flex justify-center">
                <Input
                    className=""
                    size="lg"
                    placeholder={"Búsqueda de asignaturas"}
                    startContent={<FaMagnifyingGlass />}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>
            <div className="lista">
                {filteredList.length > 0 ? (
                    <>
                        {filteredList.map((item, index) => (
                            <div 
                              className="lista-item" 
                              key={index}
                              onClick={() => navigate(constants.root + "GestionarMatriculas/" + item.id)}
                            >
                                <p className="lista-text">{item.name}</p>
                            </div>
                        ))}
                    </>
                ) : (
                    <>
                        {asignaturas.map((item, index) => (
                            <div 
                              className="lista-item" 
                              key={index}
                              onClick={() => navigate(constants.root + "GestionarMatriculas/" + item.id)}
                            >
                                <p className="lista-text">{item.name}</p>
                            </div>
                        ))}
                    </>
                )}
            </div>
        </div>
    )
}

export default ProfesorMatriculas