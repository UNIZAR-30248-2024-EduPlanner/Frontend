// import { useState } from "react";
import Lista from "../../Components/Lista";
import "../../css/Organizacion/OrganizacionMenu.css"

import {Tabs, Tab} from "@nextui-org/react";

const OrganizacionMenu = () => {
    // const [alumnos, setAlumnos] = useState([])
    // const [cursos, setCursos] = useState([])
    // const [profesores, setProfesores] = useState([])
    
    const alumnos = [
        { name: "José Miguel" },
        { name: "José Miguel" },
        { name: "José Miguel" },
        { name: "José Miguel" },
    ]

    const cursos = [
        { name: "Grado en Ingeniería Informática" },
        { name: "Grado en Ingeniería Informática" },
        { name: "Grado en Ingeniería Informática" },
        { name: "Grado en Ingeniería Informática" },
        { name: "Grado en Ingeniería Informática" },
        { name: "Grado en Ingeniería Informática" },
        { name: "Grado en Ingeniería Informática" },
        { name: "Grado en Ingeniería Informática" },
    ]

    const profesores = [
        { name: "Rubén Béjar" },
        { name: "Rubén Béjar" },
        { name: "Rubén Béjar" },
        { name: "Rubén Béjar" },
        { name: "Rubén Béjar" },
        { name: "Rubén Béjar" },
        { name: "Rubén Béjar" },
        { name: "Rubén Béjar" },
    ]

    return (
        <div>
            <h1 className="org-menu-tit"> Bienvenido, Unizar </h1>
            <div className="tabs-org">
                <Tabs 
                  color="primary"
                  variant="underlined" 
                  defaultSelectedKey="cursos">  
                    <Tab className="text-center text-xl" key="alumnos" title="Alumnos">
                        <Lista lista={alumnos} nombre={"alumnos"} url={"OrganizacionCrear"}/>
                    </Tab>
                    <Tab className="text-center text-xl" key="cursos" title="Cursos">
                        <Lista lista={cursos} nombre={"cursos"} url={"OrganizacionCrear"}/>
                    </Tab>
                    <Tab className="text-center text-xl" key="profesores" title="Profesores">
                        <Lista lista={profesores} nombre={"profesores"} url={"OrganizacionCrear"}/>
                    </Tab>
                </Tabs>
              </div>
        </div>
    )
}

export default OrganizacionMenu