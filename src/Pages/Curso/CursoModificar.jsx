import FlechaVolver from "../../Components/FlechaVolver";
import { useParams } from "react-router-dom"
import { Input } from "@nextui-org/input";
import { Button } from "@nextui-org/react";
import "../../css/Curso/CursoModificar.css"
import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { editSubject } from "../../supabase/course/course";
import Logout from "../../Components/Logout";

const CursoModificar = () => {
    const { type } = useParams()
    const typeSingular = type.slice(0, -1)
    const { id } = useParams()
    const [error, setError] = useState("");
    const location = useLocation();
    const navigate = useNavigate()
    const calendario = useState(location.state?.horarios || []);

    const { nombreViejo } = useParams()
    const { nipViejo } = useParams()

    // Variables que contienen el contenido de los input
    const [nombre, setNombre] = useState(nombreViejo)
    const [nip, setNip] = useState(nipViejo)

    const update = async () => {
        setError(""); // Limpiar cualquier mensaje de error anterior

        if (
            !nombre ||
            !nip
        ) {
            setError("Uno o varios campos están vacíos.");
            window.scrollTo({ top: 0, behavior: "smooth" });
            return;
        }

        if (isNaN(nip)) {
            setError("El codigo debe ser numérico.");
            window.scrollTo({ top: 0, behavior: "smooth" });
            return;
        }

        const updates = { name: nombre, subject_code: nip };

        // Añadir la modificacion de horarios en el update de la asignatura
        const res = await editSubject(id, updates)
        if (res.error) {
            setError("Hubo un error en el registro: " + res.error.message);
            window.scrollTo({ top: 0, behavior: "smooth" });
            return;
        }
        navigate(-1)
    }

    const calendar = () => {
        navigate(`${location.pathname}/Calendario`)
    }
    
    return (
        <>
            <FlechaVolver />
            <Logout/>
            <h1 className="cur-mod-tit"> Modificar {typeSingular} </h1>
            <div className="cur-mod-form space-y-20">
                {/* Mensaje de error */}
                {error && (
                    <p
                        style={{
                            color: "var(--color-second)",
                            textAlign: "center", // Centra el texto
                        }}
                    >
                        {error}
                    </p>
                )}
                <Input
                    size="lg"
                    type="name"
                    labelPlacement="outside"
                    color="primary"
                    variant="bordered"
                    label="Nombre"
                    placeholder={"Nombre de " + typeSingular}
                    className="max-w-xs"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                />
                <Input
                    size="lg"
                    type="name"
                    color="primary"
                    labelPlacement="outside"
                    variant="bordered"
                    label="Código"
                    placeholder={"Código de " + typeSingular}
                    className="max-w-xs"
                    value={nip}
                    onChange={(e) => setNip(e.target.value)}
                />
                <div className="botones">
                    <Button size="lg" color="primary" onClick={calendar}>
                        Modificar calendario
                    </Button>
                    <Button size="lg" color="primary" onClick={update}>
                        Modificar
                    </Button>
                </div>
            </div>
        </>
    )
}

export default CursoModificar