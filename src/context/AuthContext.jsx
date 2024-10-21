import { createContext, useContext, useEffect, useState } from "react";
import constants from "../constants/constants";
import { getOrganizationById, getUserInfoByNIP, loginOrganization, registerOrganization } from "../supabase/organization/organization";
import { loginCourse } from "../supabase/course/course";
import { getUserInfoById, loginUser } from "../supabase/user/user";

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);

    if (!context) throw new Error("useAuth must be used within AuthProvider")
    else return context
}

export const AuthProvider = ({ children }) => {
    // Contiene la información del usuario una vez está registrado o logueado
    const [user, setUser] = useState(null)

    // Contiene el tipo de usuario que está logueado
    const [type, setType] = useState(null)

    // Booleano que indica si hay un usuario logueado
    const [isAuthenticated, setIsAuthenticated] = useState(false)


    const register = async (name, nip, pass) => {
        const res = await registerOrganization(name, nip, pass)
        if (res.error) return res

        setUser(res.data)
        setType(constants.organizacion)
        setIsAuthenticated(true)
        return res
    }

    // Pre: nip: nip introducido del usuario
    //      pass: contraseña introducida por el usuario
    //      userType: constants.organizacion OR constants.curso OR constants.alumno OR constants.profesor
    //      organizationId: id de la organización en la que se quiere loguear    
    const login = async (nip, pass, userType, organizationId) => {
        var res, role;

        role = userType == constants.alumno ? 'student' 
             : userType == constants.profesor ? 'teacher'
             : userType == constants.curso ? 'course' 
             : '';

        console.log(nip, pass, role, organizationId)
        // Llamada a la API para loguear

        if (userType == constants.organizacion) {
            res = await loginOrganization(organizationId, nip, pass) // login
            console.log(res)
            if (res == false) return res

            // Llamada a la API para conseguir la info del usuario logueado
            res = await getOrganizationById(organizationId)
            console.log(res)
            if (res.error) return res
        } else {
            res = await loginUser(nip, pass, role, organizationId) // login
            console.log(res)
            if (res == false) return res
    
            // Llamada a la API para conseguir la info del usuario logueado
            res = await getUserInfoByNIP(nip, organizationId)
            console.log(res)
            if (res.error) return res  
            console.log("heyy ", res.data)  
        }

        console.log("Guardo el id en lS: ", res.data.id)
        localStorage.setItem("user", res.data.id);  // Si user es un objeto
        localStorage.setItem("type", userType)
        setUser(res.data) // guardamos los datos del usuario
        setIsAuthenticated(true) // el usuario queda autenticado
        setType(userType) // se guarda el tipo de usuario

        return res
    }

    const logout = () => {
        localStorage.removeItem("user")
        localStorage.removeItem("type")
        setUser(null)
        setIsAuthenticated(false)
        setType(null)
    }

    // Esto es para que al refrescar la página la sesión se mantenga
    const recoverUser = async () => {
        const userIdStored = localStorage.getItem("user");
        console.log(userIdStored)
        console.log(userIdStored === "undefined")
        if (userIdStored == null || userIdStored == "undefined") {
            setIsAuthenticated(false);
            setUser(null);
            setType(null);
        } else {
            console.log("UserStored: ", userIdStored)
            const userType = localStorage.getItem("type")

            if (userType == constants.organizacion) {
                const res = await getOrganizationById(userIdStored)
                if (!res.error) setUser(res.data)
            } else {
                const res = await getUserInfoById(userIdStored)
                if (!res.error) setUser(res.data)
            }

            setType(userType)
            setIsAuthenticated(true)
        }
    }

    useEffect(() => {
        recoverUser();
    }, [])

    return (
        <AuthContext.Provider
            value={{
                user,
                isAuthenticated,
                type,
                register,
                login,
                logout
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}