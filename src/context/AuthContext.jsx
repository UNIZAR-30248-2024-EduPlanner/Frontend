import { createContext, useContext, useState } from "react";
import constants from "../constants/constants";
import { getOrganizationById, getUserInfoByNIP, loginOrganization, registerOrganization } from "../supabase/organization/organization";
import { loginCourse } from "../supabase/course/course";
import { loginUser } from "../supabase/user/user";

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

        if (userType == constants.organizacion) role = 'organization'
        else if (userType == constants.alumno) role = 'student'
        else if (userType == constants.profesor) role = 'teacher'
        else if (userType == constants.curso) role = 'course'

        console.log(nip, pass, role, organizationId)
        // Llamada a la API para loguear

        if (userType == constants.organizacion) {
            res = await loginOrganization(nip, pass) // login
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
        }

        setUser(res.data) // guardamos los datos del usuario
        setIsAuthenticated(true) // el usuario queda autenticado
        setType(userType) // se guarda el tipo de usuario

        return res
    }

    const logout = () => {
        setUser(null)
        setIsAuthenticated(false)
        setType(null)
    }

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