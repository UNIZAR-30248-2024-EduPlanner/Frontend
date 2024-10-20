import { RxExit } from "react-icons/rx";
import {Button, Tooltip} from "@nextui-org/react";
import { useNavigate } from "react-router-dom";
import "../css/Components/Logout.css"
import { useAuth } from "../context/AuthContext";
import constants from "../constants/constants";


const Logout = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleClick = () => {
        logout();
        navigate(constants.root);
    }

    return (
        <div className="logout">
            <Tooltip content="Logout">
            <Button 
              className="logout-container"
              onClick={() => handleClick()}
              size="lg"
            >
                <RxExit 
                  className="logout"
                />
            </Button>
            </Tooltip>

        </div>
    )

        
}

export default Logout