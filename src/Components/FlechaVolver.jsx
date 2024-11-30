import { useNavigate } from "react-router-dom";
import "../css/Components/FlechaVolver.css"
import { Button, Tooltip } from "@nextui-org/react";
import { FaArrowLeft, FaSave } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import constants from "../constants/constants"

const FlechaVolver = ({ isSave = false }) => {
  const { logout } = useAuth();

  const navigate = useNavigate()

  const mustGoCursoMenu = () => {
    return location.pathname.includes("CursoCrear") || location.pathname.includes("CursoModificar")
    && !location.pathname.includes("Calendario") && !location.pathname.includes("Matriculas");
  }

  const handleClick = () => {
    if (location.pathname === constants.root + "Calendario") {
      logout();
      navigate(constants.root);
    } else if (mustGoCursoMenu()) {
        navigate(constants.root + "CursoMenu");
    } else {
        navigate(-1);
    }
  };
  return (
    <div className="flecha">
      <Tooltip content={isSave ? "Guardar" : "Atrás"}>
        <Button
          className="flecha-volver-container"
          onClick={handleClick}
          size="lg"
        >
          {isSave ? (
            <FaSave className="flecha-volver" />
          ) : (
            <FaArrowLeft className="flecha-volver" />
          )}
        </Button>
      </Tooltip>
    </div>
  )
}

export default FlechaVolver