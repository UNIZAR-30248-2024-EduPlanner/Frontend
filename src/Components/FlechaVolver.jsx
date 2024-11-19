import { useNavigate } from "react-router-dom";
import "../css/Components/FlechaVolver.css"
import { Button, Tooltip } from "@nextui-org/react";
import { FaArrowLeft } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import constants from "../constants/constants"

const FlechaVolver = () => {
  const { logout } = useAuth();

  const navigate = useNavigate()
  const handleClick = () => {
    if (location.pathname === constants.root + "Calendario") {
      logout();
      navigate(constants.root);
    } else {
      navigate(-1);
    }
  };
  return (
    <div className="flecha">
      <Tooltip content="Atrás">
        <Button
          className="flecha-volver-container"
          onClick={handleClick}
          size="lg"
        >
          <FaArrowLeft
            className="flecha-volver"
          />
        </Button>
      </Tooltip>
    </div>
  )
}

export default FlechaVolver