import {Route, BrowserRouter, Routes} from "react-router-dom"
import constants from "../constants/constants"
import Home from "../Pages/Home"
import OrganizacionMenu from "../Pages/Organizacion/OrganizacionMenu"
import CursoMenu from "../Pages/Curso/CursoMenu"
import CursoCrear from "../Pages/Curso/CursoCrear"
import OrganizacionCrear from "../Pages/Organizacion/OrganizacionCrear"

const RouterComponent = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path={constants.root} element={<Home/>}/>
                <Route path={constants.root + "OrganizacionMenu"} element={<OrganizacionMenu/>}/>
                <Route path={constants.root + "CursoMenu"} element={<CursoMenu/>}/>
                <Route path={constants.root + "CursoCrear/asignatura/:id"} element={<CursoCrear/>}/>
                <Route path={constants.root + "OrganizacionCrear/:type/:id"} element={<OrganizacionCrear/>}/>
            </Routes>
        </BrowserRouter>
    )
}

export default RouterComponent