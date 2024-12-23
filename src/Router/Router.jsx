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
import CalendarioAsignatura from "../Pages/Curso/CalendarioAsignatura"
import CalendarioAsignaturaCrear from "../Pages/Curso/CalendarioAsignaturaCrear"
import CursoMatriculados from "../Pages/Curso/CursoMatriculados"
import IniciarSesion from "../Pages/login/IniciarSesion"
import { ProtectedRouter, ProtectedUser } from "./ProtectedRouter"
import { AuthProvider, useAuth } from "../context/AuthContext"
import { useEffect } from "react"
import Calendario from "../Pages/Calendario"
import ProfesorMatriculas from "../Pages/Profesor/ProfesorMatriculas"
import CursoMatriculadosAñadir from "../Pages/Curso/CursoMatriculadosAñadir"
import GestionarMatriculas from "../Pages/Profesor/GestionarMatriculas"
import MatricularAlumnos from "../Pages/Profesor/MatricularAlumnos"

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
            else if (type === constants.alumno) navigate(constants.root + "Calendario");
            else if (type === constants.profesor) navigate(constants.root + "Calendario");
        }
    }, [user, type, isAuthenticated]);

    return (
        <Routes>
            <Route path={constants.root} element={<Home />} />
            <Route path={constants.root + "IniciarSesion"} element={<IniciarSesion />} />
            <Route path={constants.root + "CrearOrganizacion"} element={<CrearOrganizacion />} />
            <Route path={constants.root + "Calendario"} element={<Calendario />} />


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
                    <Route path={constants.root + "CursoCrear/:type"} element={<CursoCrear />} />
                    <Route path={constants.root + "CursoCrear/:type/Calendario"} element={<CalendarioAsignaturaCrear />} />
                    <Route path={constants.root + "CursoModificar/:type/:id/:nombreViejo/:nipViejo/Matriculas"} element={<CursoMatriculados />} />
                    <Route path={constants.root + "CursoModificar/:type/:id/:nombreViejo/:nipViejo/Matriculas/Add"} element={<CursoMatriculadosAñadir />} />
                    <Route path={constants.root + "CursoModificar/:type/:id/:nombreViejo/:nipViejo"} element={<CursoModificar />} />
                    <Route path={constants.root + "CursoModificar/:type/:id/:nombreViejo/:nipViejo/Calendario"} element={<CalendarioAsignatura />} />
                </Route>

                {/* USUARIO ALUMNO */}
                <Route element={<ProtectedUser userType={constants.alumno} />}>
                    <Route path={constants.root + "Calendario"} element={<Calendario />} />
                </Route>

                {/* USUARIO PROFESOR */}
                <Route element={<ProtectedUser userType={constants.profesor} />}>
                    <Route path={constants.root + "ProfesorMatriculas"} element={<ProfesorMatriculas />} />
                    <Route path={constants.root + "GestionarMatriculas/:id"} element={<GestionarMatriculas />} />
                    <Route path={constants.root + "MatricularAlumnos/:id"} element={<MatricularAlumnos />} />
                </Route>
            </Route>
            
            {/* RUTA DESCONOCIDA */}
            <Route path="*" element={<IniciarSesion />} />
        </Routes>
    )
}

export default RouterComponent;
