import { Route, BrowserRouter, Routes } from "react-router-dom"
import constants from "../constants/constants"
import Home from "../Pages/Home"
import OrganizacionMenu from "../Pages/Organizacion/OrganizacionMenu"
import CursoMenu from "../Pages/Curso/CursoMenu"
import CursoCrear from "../Pages/Curso/CursoCrear"
import CursoModificar from "../Pages/Curso/CursoModificar"
import OrganizacionCrear from "../Pages/Organizacion/OrganizacionCrear"
import OrganizacionModificar from "../Pages/Organizacion/OrganizacionModificar"
import CrearOrganizacion from "../Pages/login/CrearOrganizacion"
import IniciarSesion from "../Pages/login/IniciarSesion"
import {ProtectedRouter, ProtectedUser} from "./ProtectedRouter"
import { AuthProvider } from "../context/AuthContext"

const RouterComponent = () => {
    return (
        <AuthProvider>
        <BrowserRouter>
            <Routes>
                <Route path={constants.root} element={<Home />} />
                <Route path={constants.root + "IniciarSesion"} element={<IniciarSesion />} />
                <Route path={constants.root + "CrearOrganizacion"} element={<CrearOrganizacion />} />

                <Route element={<ProtectedRouter/>}>
                    {/* USUARIO ORGANIZACIÓN */}
                    <Route element={<ProtectedUser userType={constants.organizacion}/>}>
                    </Route>
                    
                    {/* USUARIO CURSO */}
                    <Route element={<ProtectedUser userType={constants.curso}/>}>
                    </Route>

                    {/* USUARIO ALUMNO */}
                    <Route element={<ProtectedUser userType={constants.alumno}/>}>
                    </Route>

                    {/* USUARIO PROFESOR */}
                    <Route element={<ProtectedUser userType={constants.profesor}/>}>
                    </Route>

                    <Route path={constants.root + "OrganizacionMenu"} element={<OrganizacionMenu />} />
                    <Route path={constants.root + "OrganizacionCrear/:type"} element={<OrganizacionCrear />} />
                    <Route path={constants.root + "OrganizacionModificar/:type/:id"} element={<OrganizacionModificar />} />

                    <Route path={constants.root + "CursoMenu"} element={<CursoMenu />} />
                    <Route path={constants.root + "CursoCrear/:type/"} element={<CursoCrear />} />
                    <Route path={constants.root + "CursoModificar/:type/:id"} element={<CursoModificar />} />
                </Route>
            </Routes>
        </BrowserRouter>
        </AuthProvider>

    )
}

export default RouterComponent