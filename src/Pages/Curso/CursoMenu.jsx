import Lista from "../../Components/Lista";
import "../../css/Curso/CursoMenu.css"
import {Tabs, Tab} from "@nextui-org/react";
import FlechaVolver from "../../Components/FlechaVolver";

const CursoMenu = () => {

    // const [asignaturas, setAsignaturas] = useState([])

    const nombre = "Grado en Ingeniería Informática"

    var asignaturas = [
        { name: "Gestión de proyecto software" },
        { name: "Sistemas y tecnologías Web" },
        { name: "Bases de datos 2" },
        { name: "Videojuegos" },
        { name: "Comercio electrónico" },
    ]

    return (
        <div>
            <FlechaVolver/>
            <h1 className="cur-menu-tit"> Bienvenido, {nombre}</h1>
            <div className="cur-container">
                <Tabs 
                 color="primary"
                 variant="underlined">
                    <Tab className="text-center text-xl" key="asignaturas" title="Asignaturas">
                        <Lista lista={asignaturas} type={"asignaturas"} creator={"Curso"}></Lista>
                    </Tab>
                </Tabs>
                
            </div>
        </div>
    )
}

export default CursoMenu
