import Lista from "../../Components/Lista";
import "../../css/Curso/CursoMenu.css"
import {Tabs, Tab} from "@nextui-org/react";

const CursoMenu = () => {

    // const [asignaturas, setAsignaturas] = useState([])

    const nombre = "Grado en Ingeniería Informática"

    const asignaturas = [
        { name: "Gestión de proyecto software" },
        { name: "Sistemas y tecnologías Web" },
        { name: "Bases de datos 2" },
        { name: "Videojuegos" },
        { name: "Comercio electrónico" },
    ]

    return (
        <div>
            <h1 className="cur-menu-tit"> Bienvenido, {nombre}</h1>
            <div class="cur-container">
                <Tabs 
                 color="primary"
                 variant="underlined">
                    <Tab className="text-center text-xl" key="asignaturas" title="Asignaturas">
                        <Lista lista={asignaturas} nombre={"asignatura"} url={"CursoCrear"}></Lista>
                    </Tab>
                </Tabs>
                
            </div>
        </div>
    )
}

export default CursoMenu
