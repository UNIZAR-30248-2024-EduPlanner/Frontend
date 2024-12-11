import Lista from "../../Components/Lista";
import "../../css/Curso/CursoMenu.css"
import { Tabs, Tab } from "@nextui-org/react";
import FlechaVolver from "../../Components/FlechaVolver";
import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { getAllSubjects } from "../../supabase/course/course";
import Logout from "../../Components/Logout";

const CursoMenu = () => {

    const { user } = useAuth()

    // Asignaturas que posee el curso
    const [asignaturas, setAsignaturas] = useState([])

    const [cursoName, setCursoName] = useState(null)

    const getAllItems = async (id) => {
        const subjects = await getAllSubjects(id)
        if (subjects.error) setAsignaturas([])
        else setAsignaturas(subjects.data)
    }

    useEffect(() => {
        if (user) {
            setCursoName(user.name)
            getAllItems(user.id)
        }
    }, [])

    useEffect(() => {
        if (user) {
            setCursoName(user.name)
            getAllItems(user.id)
        }
    }, [user])

    return (
        <div>
            <Logout/>
            <h1 className="cur-menu-tit font-bold"> Bienvenido, {cursoName}</h1>
            <div className="cur-container">
                <Tabs
                    color="primary"
                    variant="underlined">
                    <Tab className="text-center text-xl" key="asignaturas" title="Asignaturas">
                        <Lista lista={asignaturas} setLista={setAsignaturas} type={"asignaturas"} creator={"Curso"}></Lista>
                    </Tab>
                </Tabs>

            </div>
        </div>
    )
}

export default CursoMenu
