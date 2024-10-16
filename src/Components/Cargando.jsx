import {CircularProgress} from "@nextui-org/react";
import "../css/Components/Cargando.css"

const Cargando = () => {
    return (
        <div className="cargando">
            <CircularProgress label="Cargando..."/>
        </div>
    )
}

export default Cargando