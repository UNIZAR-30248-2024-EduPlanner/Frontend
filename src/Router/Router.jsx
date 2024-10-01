import {Route, BrowserRouter, Routes} from "react-router-dom"
import constants from "../constants/constants"
import Home from "../Pages/Home"
import OrganizacionMenu from "../Pages/Organizacion/OrganizacionMenu"
import CursoMenu from "../Pages/Curso/CursoMenu"
import CursoCrear from "../Pages/Curso/CursoCrear"
import CursoModificar from "../Pages/Curso/CursoModificar"
import OrganizacionCrear from "../Pages/Organizacion/OrganizacionCrear"
import OrganizacionModificar from "../Pages/Organizacion/OrganizacionModificar"

const RouterComponent = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path={constants.root} element={<Home/>}/>
                <Route path={constants.root + "OrganizacionMenu"} element={<OrganizacionMenu/>}/>
                <Route path={constants.root + "OrganizacionCrear/:type"} element={<OrganizacionCrear/>}/>
                <Route path={constants.root + "OrganizacionModificar/:type/:id"} element={<OrganizacionModificar/>}/>
                <Route path={constants.root + "CursoMenu"} element={<CursoMenu/>}/>
                <Route path={constants.root + "CursoCrear/:type/"} element={<CursoCrear/>}/>
                <Route path={constants.root + "CursoModificar/:type/:id"} element={<CursoModificar/>}/>
            </Routes>
        </BrowserRouter>
    )
}

export default RouterComponent