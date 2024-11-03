import { Route, BrowserRouter, Routes, useNavigate } from "react-router-dom"
import constants from "../constants/constants"
import Home from "../Pages/Home"
import OrganizacionMenu from "../Pages/Organizacion/OrganizacionMenu"
import CursoMenu from "../Pages/Curso/CursoMenu"
import CursoCrear from "../Pages/Curso/CursoCrear"
import CursoModificar from "../Pages/Curso/CursoModificar"
import OrganizacionCrear from "../Pages/Organizacion/OrganizacionCrear"
import OrganizacionModificar from "../Pages/Organizacion/OrganizacionModificar"
import CrearOrganizacion from "../Pages/login/CrearOrganizacion"
import AlumnoMenu from "../Pages/Alumno/AlumnoMenu"
import IniciarSesion from "../Pages/login/IniciarSesion"
import { ProtectedRouter, ProtectedUser } from "./ProtectedRouter"
import { AuthProvider, useAuth } from "../context/AuthContext"
import { useEffect } from "react"

const RouterComponent = () => {
    return (
        <AuthProvider>
            <BrowserRouter>
                <AppRoutes />
            </BrowserRouter>
        </AuthProvider>
    )
}

const AppRoutes = () => {
    const { user, type, isAuthenticated } = useAuth();
    const navigate = useNavigate();  // Inicializamos useNavigate

    useEffect(() => {
        if (user && isAuthenticated) {
            if (type === constants.organizacion) navigate(constants.root + "OrganizacionMenu");
            else if (type === constants.curso) navigate(constants.root + "CursoMenu");
            else if (type === constants.alumno) navigate(constants.root + "AlumnoMenu");
            else if (type === constants.profesor) navigate(constants.root + "ProfesorMenu");
        }
    }, [user, type, isAuthenticated]);

    return (
        <Routes>
            <Route path={constants.root} element={<Home />} />
            <Route path={constants.root + "IniciarSesion"} element={<IniciarSesion />} />
            <Route path={constants.root + "CrearOrganizacion"} element={<CrearOrganizacion />} />

            <Route element={<ProtectedRouter />}>
                {/* USUARIO ORGANIZACIÓN */}
                <Route element={<ProtectedUser userType={constants.organizacion} />}>
                    <Route path={constants.root + "OrganizacionMenu"} element={<OrganizacionMenu />} />
                    <Route path={constants.root + "OrganizacionCrear/:type"} element={<OrganizacionCrear />} />
                    <Route path={constants.root + "OrganizacionModificar/:type/:id/:nombreViejo/:nipViejo"} element={<OrganizacionModificar />} />
                </Route>

                {/* USUARIO CURSO */}
                <Route element={<ProtectedUser userType={constants.curso} />}>
                    <Route path={constants.root + "CursoMenu"} element={<CursoMenu />} />
                    <Route path={constants.root + "CursoCrear/:type/"} element={<CursoCrear />} />
                    <Route path={constants.root + "CursoModificar/:type/:id/:nombreViejo/:nipViejo"} element={<CursoModificar />} />
                </Route>

                {/* USUARIO ALUMNO */}
                <Route element={<ProtectedUser userType={constants.alumno} />}>
                    <Route path={constants.root + "AlumnoMenu"} element={<AlumnoMenu />} />
                </Route>

                {/* USUARIO PROFESOR */}
                <Route element={<ProtectedUser userType={constants.profesor} />}>
                </Route>
            </Route>
        </Routes>
    )
}

export default RouterComponent;
