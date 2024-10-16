// import { useState } from "react";
import { useEffect, useState } from "react";
import Lista from "../../Components/Lista";
import "../../css/Organizacion/OrganizacionMenu.css"

import { Tabs, Tab } from "@nextui-org/react";
import { getAllCourses, getAllStudents, getAllTeachers } from "../../supabase/organization/organization";

const OrganizacionMenu = () => {
    const [alumnos, setAlumnos] = useState([])
    const [cursos, setCursos] = useState([])
    const [profesores, setProfesores] = useState([])

    // const alumnos = [
    //     { name: "José Miguel", nip: "839899" },
    //     { name: "Leyre", nip: "839995" },
    //     { name: "Gonzalo", nip: "839900" },
    //     { name: "Flavio", nip: "839898" },
    //     { name: "Nacho", nip: "839897" },
    //     { name: "Pablo", nip: "840020" },
    // ]

    // const cursos = [
    //     { name: "Grado en Ingeniería Informática", nip: "1" },
    //     { name: "Grado en Ingeniería Electrónica y Automaticci", nip: "2" },
    //     { name: "Grado en Ingeniería Eléctrica", nip: "3" },
    //     { name: "Grado en Ingeniería Industrial", nip: "4" },
    //     { name: "Grado en Ingeniería Mecánica", nip: "5" },
    //     { name: "Grado en Ingeniería de Telecomunicaciones", nip: "6" },
    // ]

    // const profesores = [
    //     { name: "Rubén Béjar", nip: "10" },
    //     { name: "Rubén Béjar", nip: "11" },
    //     { name: "Rubén Béjar", nip: "12" },
    //     { name: "Rubén Béjar", nip: "13" },
    //     { name: "Rubén Béjar", nip: "14" },
    //     { name: "Rubén Béjar", nip: "15" },
    //     { name: "Rubén Béjar", nip: "16" },
    //     { name: "Rubén Béjar", nip: "17" },
    // ]

    const getAllItems = async () => {
        const courses = await getAllCourses(1)
        if (courses.error) setCursos([])
        else setCursos(courses.data)

        const students = await getAllStudents(1)
        if (students.error) setAlumnos(students.data)
        else setAlumnos(students.data)

        const teachers = await getAllTeachers(1)
        if (teachers.error) setProfesores(teachers.data)
        else setProfesores(teachers.data)
    }

    useEffect(() => {
        getAllItems()
    }, [])

    return (
        <div>
            <h1 className="org-menu-tit"> Bienvenido, Unizar </h1>
            <div className="tabs-org">
                <Tabs
                    color="primary"
                    variant="underlined"
                    defaultSelectedKey="cursos">
                    <Tab className="text-center text-xl" key="alumnos" title="Alumnos">
                        <Lista lista={alumnos} type={"alumnos"} creator={"Organizacion"} />
                    </Tab>
                    <Tab className="text-center text-xl" key="cursos" title="Cursos">
                        <Lista lista={cursos} type={"cursos"} creator={"Organizacion"} />
                    </Tab>
                    <Tab className="text-center text-xl" key="profesores" title="Profesores">
                        <Lista lista={profesores} type={"profesores"} creator={"Organizacion"} />
                    </Tab>
                </Tabs>
            </div>
        </div>
    )
}

export default OrganizacionMenu