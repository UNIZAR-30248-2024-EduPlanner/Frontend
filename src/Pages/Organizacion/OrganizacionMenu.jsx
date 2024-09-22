// import { useState } from "react";
import Lista from "../../Components/Lista";
import "../../css/Organizacion/OrganizacionMenu.css"

import {Tabs, Tab} from "@nextui-org/react";

const OrganizacionMenu = () => {
    // const [alumnos, setAlumnos] = useState([])
    // const [cursos, setCursos] = useState([])
    // const [profesores, setProfesores] = useState([])

    const alumnos = [
        { NIP: 839899, name: "José Miguel" },
        { NIP: 839899, name: "José Miguel" },
        { NIP: 839899, name: "José Miguel" },
        { NIP: 839899, name: "José Miguel" },
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
                        <Lista lista={alumnos} nombre={"alumnos"}/>
                    </Tab>
                    <Tab className="text-center text-xl" key="cursos" title="Cursos"/>
                    <Tab className="text-center text-xl" key="profesores" title="Profesores"/>
                </Tabs>
              </div>
        </div>
    )
}

export default OrganizacionMenu