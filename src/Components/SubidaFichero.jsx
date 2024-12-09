import { ScrollShadow, useDisclosure } from "@nextui-org/react";
import { Button } from "@nextui-org/react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../constants/constants";
import "../css/Components/SubidaFichero.css";
import { registerArrayStudents } from "../supabase/student/student";
import { letTeacherAssociateArrayStudentsToSubject, registerArrayTeachers } from "../supabase/teacher/teacher";
import { registerArrayCourses, registerArraySubject } from "../supabase/course/course";
import { useAuth } from "../context/AuthContext";
import ModalComponent from "./ModalComponent";


// Referencia: https://github.com/NelsonCode/drag-and-drop-files-react/blob/master/src/components/DragArea/index.js

const SubidaFichero = ({ type, lista, setLista, teacherNip, subjectCode }) => {
    const [errores, setErrores] = useState([]);
    const navigate = useNavigate();
    const [error, setError] = useState("");
    const { user } = useAuth()

    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    const readFile = (e) => {
        setErrores([])
        setLista([])

        const file = e.target.files[0]
        if (!file) return

        const fileReader = new FileReader()

        fileReader.readAsText(file)

        fileReader.onload = () => {
            const text = fileReader.result;
            const lines = text.split(/\r?\n|\r/);

            const parsedData = [];
            const erroresEncontrados = [];

            lines.forEach((line, index) => {
                // Eliminamos comillas y dividimos por ';'
                if (line !== "") {
                    const fields = line.split(";");

                    // Validar que haya exactamente 3 campos
                    if (fields.length === 4) {
                        const [name, subject_code, pass, vacio] = fields;

                        if (vacio !== "") {
                            erroresEncontrados.push(`Línea ${index + 1}: Número incorrecto de campos.`);
                            return;
                        }

                        // Validar que 'Nombre Apellidos' sea una cadena de texto
                        if (!name || typeof name !== "string") {
                            erroresEncontrados.push(`Línea ${index + 1}: Nombre Apellidos no es válido.`);
                            return;
                        }

                        // Validar que 'NIP/NIA' sea un número entero
                        const nipParsed = parseInt(subject_code, 10);
                        if (isNaN(nipParsed)) {
                            erroresEncontrados.push(`Línea ${index + 1}: NIP/NIA debe ser un número entero.`);
                            return;
                        }

                        // Validar que 'Contraseña' sea una cadena no vacía y tenga al menos 6 caracteres
                        if (!pass || typeof pass !== "string" || pass.length < 6) {
                            erroresEncontrados.push(`Línea ${index + 1}: Contraseña no válida. Debe tener al menos 6 caracteres.`);
                            return;
                        }

                        // Si todas las validaciones pasan, agregamos el objeto a los datos procesados
                        parsedData.push({ name, nip: nipParsed, pass });
                    } else {
                        erroresEncontrados.push(`Línea ${index + 1}: Número incorrecto de campos.`);
                    }
                }
            });

            // Guardamos los datos válidos y los errores
            setLista(parsedData);
            setErrores(erroresEncontrados);
        }
    }

    const readFileSubjects = (e) => {
        setErrores([])
        setLista([])

        const file = e.target.files[0]
        if (!file) return

        const fileReader = new FileReader()

        fileReader.readAsText(file)

        fileReader.onload = () => {
            const text = fileReader.result;
            const lines = text.split(/\r?\n|\r/);

            const parsedData = [];
            const erroresEncontrados = [];

            lines.forEach((line, index) => {
                // Eliminamos comillas y dividimos por ';'
                if (line !== "") {
                    const fields = line.split(";");

                    // Validar que haya exactamente 2 campos
                    if (fields.length === 3) {
                        const [name, subject_code, vacio] = fields;

                        if (vacio !== "") {
                            erroresEncontrados.push(`Línea ${index + 1}: Número incorrecto de campos.`);
                            return;
                        }

                        // Validar que 'Nombre Apellidos' sea una cadena de texto
                        if (!name || typeof name !== "string") {
                            erroresEncontrados.push(`Línea ${index + 1}: El nombre de la asignatura no es válido.`);
                            return;
                        }

                        // Validar que 'NIP/NIA' sea un número entero
                        const subject_codeParsed = parseInt(subject_code, 10);
                        if (isNaN(subject_codeParsed)) {
                            erroresEncontrados.push(`Línea ${index + 1}: El codigo de la asignatura debe ser un número entero.`);
                            return;
                        }

                        // Si todas las validaciones pasan, agregamos el objeto a los datos procesados
                        parsedData.push({ name, subject_code: subject_codeParsed });
                    } else {
                        erroresEncontrados.push(`Línea ${index + 1}: Número incorrecto de campos.`);
                    }
                }
            });

            // Guardamos los datos válidos y los errores
            setLista(parsedData);
            setErrores(erroresEncontrados);
        }
    }

    const readFileNips = (e) => {
        setErrores([])
        setLista([])

        const file = e.target.files[0]
        if (!file) return

        const fileReader = new FileReader()

        fileReader.readAsText(file)

        fileReader.onload = () => {
            const text = fileReader.result;
            const lines = text.split(/\r?\n|\r/);

            const parsedData = [];
            const erroresEncontrados = [];

            lines.forEach((line, index) => {
                // Eliminamos comillas y dividimos por ';'
                if (line !== "") {
                    const fields = line.split(";");

                    // Validar que haya exactamente 1 campos
                    if (fields.length === 2) {
                        const [nip, vacio] = fields;

                        if (vacio !== "") {
                            erroresEncontrados.push(`Línea ${index + 1}: Número incorrecto de campos.`);
                            return;
                        }

                        // Validar que 'NIP/NIA' sea un número entero
                        const nipParsed = parseInt(nip, 10);
                        if (isNaN(nipParsed)) {
                            erroresEncontrados.push(`Línea ${index + 1}: NIP/NIA debe ser un número entero.`);
                            return;
                        }

                        // Si todas las validaciones pasan, agregamos el objeto a los datos procesados
                        parsedData.push(nipParsed);
                    } else {
                        erroresEncontrados.push(`Línea ${index + 1}: Número incorrecto de campos.`);
                    }
                }
            });

            // Guardamos los datos válidos y los errores
            setLista(parsedData);
            setErrores(erroresEncontrados);
        }
    }

    const create = async (lista) => {
        setError(""); // Limpiar cualquier mensaje de error anterior
        console.log(lista);

        // Si llega aquí, se ejecuta la petición para crear
        if (type == "profesores") {
            // Llamada a la API para crear un profesor
            const res = await registerArrayTeachers(lista, user.id)
            if (res.error) {
                setError("Hubo un error en el registro: " + res.error.message);
                window.scrollTo({ top: 0, behavior: "smooth" });
                return;
            }
        } else if (type == "alumnos") {
            // Llamada a la API para crear un alumno
            const res = await registerArrayStudents(lista, user.id)
            if (res.error) {
                setError("Hubo un error en el registro: " + res.error.message);
                window.scrollTo({ top: 0, behavior: "smooth" });
                return;
            }
        } else if (type == "cursos") {
            // Llamada a la API para crear un curso
            const res = await registerArrayCourses(lista, user.id)
            if (res.error) {
                setError("Hubo un error en el registro: " + res.error.message);
                window.scrollTo({ top: 0, behavior: "smooth" });
                return;
            }
        } else if (type == "asignaturas") {
            // Llamada a la API para crear un curso
            const res = await registerArraySubject(lista, user.id)
            if (res.error) {
                setError("Hubo un error en el registro: " + res.error.message);
                window.scrollTo({ top: 0, behavior: "smooth" });
                return;
            }
        } else if (type == "nips") {
            // Llamada a la API para matricular un array de alumnos
            const res = await letTeacherAssociateArrayStudentsToSubject(teacherNip, lista, subjectCode);
            if (res.error) {
                setError("Hubo un error en el registro: " + res.error);
                window.scrollTo({ top: 0, behavior: "smooth" });
                return;
            }
        }
        navigate(-1)
    }

    return (
        <>
            <div className="image-upload-wrap">
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
                <input
                    className="file-upload-input"
                    data-testid="file-input"
                    type="file"
                    onChange={(e) => type === "asignaturas" ? readFileSubjects(e) 
                                   : type === "nips" ? readFileNips(e) 
                                   : readFile(e)}
                />
                <div className="text-information">
                    {lista.length > 0 ? (
                        <h3>
                            Clique o arrastre aquí <br />
                            para cambiar el fichero
                        </h3>
                    ) : (
                        <h3>
                            Arrastre un fichero <br />
                            o <br />
                            Clique aquí para subir uno
                        </h3>
                    )}
                </div>
                {lista.length > 0 && errores.length == 0 && (
                    <ScrollShadow className="self-center h-[300px]">
                        <div className="data-display">
                            {type === "asignaturas" ? (
                                // Tabla para asignaturas
                                <table>
                                    <thead>
                                        <tr>
                                            <th className="campo">Nombre de la Asignatura</th>
                                            <th className="campo">Código de Asignatura</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {lista.map((item, index) => (
                                            <tr key={index}>
                                                <td>{item.name}</td>
                                                <td>{item.subject_code}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : type === "nips" ? (
                                // Tabla para asignaturas
                                <table>
                                    <thead>
                                        <tr>
                                            <th className="campo">NIP/NIA</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {lista.map((item, index) => (
                                            <tr key={index}>
                                                <td>{item}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : (
                                // Otra tabla para un tipo diferente
                                <table>
                                    <thead>
                                        <tr>
                                            <th className="campo">Nombre y Apellidos</th>
                                            <th className="campo">NIP/NIA</th>
                                            <th className="campo">Contraseña</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {lista.map((item, index) => (
                                            <tr key={index}>
                                                <td>{item.name}</td>
                                                <td>{item.nip}</td>
                                                <td>{item.pass}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}

                        </div>
                    </ScrollShadow>
                )}
                {/* Mostrar errores encontrados */}
                {errores.length > 0 && (
                    <ScrollShadow className="self-center h-[300px]">
                        <div className="error-display">
                            <h4>Errores encontrados:</h4>
                            <ul>
                                {errores.map((error, index) => (
                                    <li key={index}>{error}</li>
                                ))}
                            </ul>
                        </div>
                    </ScrollShadow>
                )}
            </div>
            {lista.length > 0 && errores.length == 0 && (
                <div className="crear-button">
                    {type === "nips" ? (
                        <Button name="create-list" size="lg" color="primary" onClick={() => onOpen()}>
                            Matricular
                        </Button>
                    ) : (
                        <Button name="create-list" size="lg" color="primary" onClick={() => onOpen()}>
                            Crear la lista
                        </Button>
                    )}
                </div>
            )}
            <ModalComponent
                isOpen={isOpen}
                onOpenChange={onOpenChange}
                title="Confirmar creación"
                texto="¿Estás seguro de que quieres crear esta lista de elementos?"
                onAccept={() => {
                    create(lista); // Ejecutar crear
                }}
            />

        </>
    )
}

export default SubidaFichero