import {Route, BrowserRouter, Routes} from "react-router-dom"
import constants from "../constants/constants"
import Home from "../Pages/Home"

const RouterComponent = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path={constants.root} element={<Home/>}/>
            </Routes>
        </BrowserRouter>
    )
}

export default RouterComponent