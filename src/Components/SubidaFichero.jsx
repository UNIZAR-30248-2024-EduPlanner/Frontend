import {ScrollShadow} from "@nextui-org/react";
import {Button} from "@nextui-org/react";
import { useState } from "react"
import "../css/Components/SubidaFichero.css"

// Referencia: https://github.com/NelsonCode/drag-and-drop-files-react/blob/master/src/components/DragArea/index.js

const SubidaFichero = ({ type, lista, setLista }) => {
    const [errores, setErrores] = useState([]);

    const readFile = ( e ) => {
        console.log("Hola")
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
                        const [nombreApellidos, nip, contraseña, vacio] = fields;
    
                        if (vacio !== "") {
                            erroresEncontrados.push(`Línea ${index + 1}: Número incorrecto de campos.`);
                            return;
                        }

                        // Validar que 'Nombre Apellidos' sea una cadena de texto
                        if (!nombreApellidos || typeof nombreApellidos !== "string") {
                            erroresEncontrados.push(`Línea ${index + 1}: Nombre Apellidos no es válido.`);
                            return;
                        }
    
                        // Validar que 'NIP/NIA' sea un número entero
                        const nipParsed = parseInt(nip, 10);
                        if (isNaN(nipParsed)) {
                            erroresEncontrados.push(`Línea ${index + 1}: NIP/NIA debe ser un número entero.`);
                            return;
                        }
    
                        // Validar que 'Contraseña' sea una cadena no vacía
                        if (!contraseña || typeof contraseña !== "string") {
                            erroresEncontrados.push(`Línea ${index + 1}: Contraseña no válida.`);
                            return;
                        }
    
                        // Si todas las validaciones pasan, agregamos el objeto a los datos procesados
                        parsedData.push({ nombreApellidos, nip: nipParsed, contraseña });
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

    return (
        <>
        <div className="image-upload-wrap">
            <input
              className="file-upload-input"
              type="file"
              onChange={(e) => readFile(e)}
            />
            <div className="text-information">
                {lista.length > 0 ? (
                    <h3> 
                        Clique o arrastre aquí <br/>
                        para cambiar el fichero
                    </h3>                
                ) : (
                    <h3> 
                        Arrastre un fichero <br/>
                        o <br/>
                        Clique aquí para subir uno
                    </h3>
                )}
            </div>
            {lista.length > 0 && errores.length == 0 && (
                <ScrollShadow className="self-center h-[300px]">
                    <div className="data-display">
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
                                        <td>{item.nombreApellidos}</td>
                                        <td>{item.nip}</td>
                                        <td>{item.contraseña}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
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
                <Button size="lg" color="primary">
                    Crear
                </Button>
            </div>
        )}
        </>
    )
}

export default SubidaFichero