// import { useState } from "react";
import { useEffect, useState } from "react";
import Lista from "../../Components/Lista";
import "../../css/Organizacion/OrganizacionMenu.css"

import { Tabs, Tab } from "@nextui-org/react";
import { getAllCourses, getAllStudents, getAllTeachers } from "../../supabase/organization/organization";
import { useAuth } from "../../context/AuthContext";

const OrganizacionMenu = () => {
    const { user } = useAuth();

    const [alumnos, setAlumnos] = useState([])
    const [cursos, setCursos] = useState([])
    const [profesores, setProfesores] = useState([])

    const [orgName, setOrgName] = useState(null)

    const getAllItems = async (organization_id) => {
        const courses = await getAllCourses(organization_id)
        if (courses.error) setCursos([])
        else setCursos(courses.data)

        const students = await getAllStudents(organization_id)
        if (students.error) setAlumnos([])
        else setAlumnos(students.data)

        const teachers = await getAllTeachers(organization_id)
        if (teachers.error) setProfesores([])
        else setProfesores(teachers.data)
    }

    useEffect(() => {
        if (user) {
            console.log(user)
            setOrgName(user.name)
            getAllItems(user.id)
        }
    }, [user])

    return (
        <div>
            <h1 className="org-menu-tit"> Bienvenido, {orgName} </h1>
            <div className="tabs-org">
                <Tabs color="primary"
                    variant="underlined"
                    defaultSelectedKey="cursos">
                    <Tab className="text-center text-xl" key="alumnos" title="Alumnos">
                        <Lista lista={alumnos} setLista={setAlumnos} type={"alumnos"} creator={"Organizacion"} />
                    </Tab>
                    <Tab className="text-center text-xl" key="cursos" title="Cursos">
                        <Lista lista={cursos} setLista={setCursos} type={"cursos"} creator={"Organizacion"} />
                    </Tab>
                    <Tab className="text-center text-xl" key="profesores" title="Profesores">
                        <Lista lista={profesores} setLista={setProfesores} type={"profesores"} creator={"Organizacion"} />
                    </Tab>
                </Tabs>
            </div>
        </div>
    )
}

export default OrganizacionMenu