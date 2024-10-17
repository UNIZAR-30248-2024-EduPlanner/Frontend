import { useParams } from "react-router-dom"
import "../../css/Organizacion/OrganizacionCrear.css"
import { Input } from "@nextui-org/input";
import { Button } from "@nextui-org/react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useState } from "react";
import SubidaFichero from "../../Components/SubidaFichero";
import FlechaVolver from "../../Components/FlechaVolver";
import constants from "../../constants/constants";
import { createCourse, createStudent, createTeacher } from "../../supabase/organization/organization";
import { useAuth } from "../../context/AuthContext";


const OrganizacionCrear = () => {
  const { type } = useParams()
  const typeSingular = type == "profesores" ? "profesor" : type.slice(0, -1)

  const [isVisible, setIsVisible] = useState(false);
  const [error, setError] = useState("");
  const toggleVisibility = () => setIsVisible(!isVisible);

  // Variables que contienen el contenido de los input
  const [nombre, setNombre] = useState("")
  const [nip, setNip] = useState("")
  const [password, setPassword] = useState("")
  const [lista, setLista] = useState([])
  const { user } = useAuth();

  // Funciones para crear el item
  const create = async () => {
    // TODO: dependiendo el tipo a crear, crear uno u otro
    // llamada a funcion crear
    setError(""); // Limpiar cualquier mensaje de error anterior

    if (
      !nombre ||
      !nip ||
      !password
    ) {
      setError("Uno o varios campos están vacíos.");
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    if (isNaN(nip)) {
      setError("El NIP/NIA debe ser numérico.");
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    // Si llega aquí, se ejecuta la petición para crear

    console.log(user)

    if (typeSingular == constants.profesor) {
      // Llamada a la API para crear un profesor
      const res = await createTeacher(nombre, nip, password, user.id)
      if (res.error) {
        setError("Hubo un error en el registro: " + res.error.message);
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }
    } else if (typeSingular == constants.alumno) {
      // Llamada a la API para crear un alumno
      const res = await createStudent(nombre, nip, password, user.id)
      if (res.error) {
        setError("Hubo un error en el registro: " + res.error.message);
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }
    } else if (typeSingular == constants.curso) {
      // Llamada a la API para crear un curso
      const res = await createCourse(nombre, nip, password, user.id)
      if (res.error) {
        setError("Hubo un error en el registro: " + res.error.message);
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }
    }
  }

  return (
    <>
      <FlechaVolver />
      <h1 className="org-crear-tit"> Crear {type} </h1>
      <div className="org-crear-container">
        <div className="org-crear-uno">
          <h2 className="org-crear-tit"> Crea un {typeSingular} </h2>
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
              size="lg"
              type="name"
              labelPlacement="outside"
              color="primary"
              variant="bordered"
              label="Nombre"
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
              label="NIP / NIA"
              className="max-w-xs"
              value={nip}
              onChange={(e) => setNip(e.target.value)}
            />
            <Input
              label="Contraseña"
              size="lg"
              labelPlacement="outside"
              color="primary"
              variant="bordered"
              endContent={
                <button className="focus:outline-none" type="button" onClick={toggleVisibility} aria-label="toggle password visibility">
                  {isVisible ? (
                    <FaEyeSlash className="text-2xl text-default-400 pointer-events-none" />
                  ) : (
                    <FaEye className="text-2xl text-default-400 pointer-events-none" />
                  )}
                </button>
              }
              type={isVisible ? "text" : "password"}
              className="max-w-xs"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button size="lg" color="primary" onClick={create}>
              Crear
            </Button>
          </div>
        </div>
        <div className="fich">
          <h2 className="org-crear-tit"> Sube un fichero de {type} </h2>
          <p className="formato">
            El formato del fichero por línea será el siguiente: <br />
            <span>
              Nombre Apellidos;NIP;Contraseña; <br />
            </span>
          </p>
          <SubidaFichero type={type} lista={lista} setLista={setLista} />
        </div>
      </div>
    </>
  )
}

export default OrganizacionCrear