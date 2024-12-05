import { useParams } from "react-router-dom"
import FlechaVolver from "../../Components/FlechaVolver";
import Logout from "../../Components/Logout";
import { useEffect, useState } from "react";
import { Button, Input, useDisclosure } from "@nextui-org/react";
import ModalComponent from "../../Components/ModalComponent";
import SubidaFichero from "../../Components/SubidaFichero";
import { getSubjectById } from "../../supabase/course/course";

const MatricularAlumnos = () => {
    const { id } = useParams(); // id de la asignatura

    const [subject, setSubject] = useState(null);
    const [nip, setNip] = useState("");
    const [lista, setLista] = useState([]);
    const [error, setError] = useState("");

    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    
    const recuperarAsignatura = async () => {
        const sub = await getSubjectById(id);
        if (sub.error) return console.error(sub.error);

        setSubject(sub.data);
    }

    // Funciones para crear el item
    const create = async () => {
        setError(""); // Limpiar cualquier mensaje de error anterior

        if (!nip) {
            setError("Uno o varios campos están vacíos.");
            window.scrollTo({ top: 0, behavior: "smooth" });
            return;
        }

        if (isNaN(nip)) {
            setError("El NIP/NIA debe ser numérico.");
            window.scrollTo({ top: 0, behavior: "smooth" });
            return;
        }

        // Si llega aquí, se matricula al alumno

        // TODO
        
    }

    useEffect(() => {
        recuperarAsignatura();
    }, []);

    return (
        <>
            <FlechaVolver />
            <Logout/>
            <h1 className="org-crear-tit">
                Matricular alumno en {subject && subject.name && subject.name}
            </h1>
            <div className="org-crear-container">
            <div className="org-crear-uno">
                <h2 className="org-crear-tit"> Matricula un alumno </h2>
                <div className="uno space-y-20">
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
                    name="nip/nia"
                    size="lg"
                    type="name"
                    color="primary"
                    labelPlacement="outside"
                    variant="bordered"
                    label="NIP / NIA"
                    className="max-w-xs"
                    value={nip}
                    onChange={(e) => setNip(e.target.value)}
                />
                <Button size="lg" color="primary" onClick={onOpen}>
                    Crear
                </Button>
                <ModalComponent
                    isOpen={isOpen}
                    onOpenChange={onOpenChange}
                    title="Confirmar creación"
                    texto="¿Estás seguro de que quieres matricular este alumno?"
                    onAccept={() => {
                        create(); // Ejecutar crear
                    }}
                />
                </div>
            </div>
            <div className="fich">
                <h2 className="org-crear-tit"> Sube un fichero de NIPs </h2>
                <p className="formato">
                    El formato del fichero por línea será el siguiente: <br />
                    <span>
                        NIP; <br />
                    </span>
                </p>
                <SubidaFichero type={"nips"} lista={lista} setLista={setLista} />
            </div>
            </div>
        </>
    )
}

export default MatricularAlumnos
