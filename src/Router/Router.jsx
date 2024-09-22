import {Route, BrowserRouter, Routes} from "react-router-dom"
import constants from "../constants/constants"
import Home from "../Pages/Home"
import OrganizacionMenu from "../Pages/Organizacion/OrganizacionMenu"

const RouterComponent = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path={constants.root} element={<Home/>}/>
                <Route path={constants.root + "OrganizacionMenu"} element={<OrganizacionMenu/>}/>
            </Routes>
        </BrowserRouter>
    )
}

export default RouterComponent