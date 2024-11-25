import { Button } from "@nextui-org/react"
import { useAuth } from "../../context/AuthContext"
import { useNavigate } from "react-router-dom";
import constants from "../../constants/constants";

const ProfesorMenu = () => {

    const { user } = useAuth();
    const navigate = useNavigate();

    return (
        <>
            <h1 className="w-full text-center mt-[5vh]"> 
                Bienvenid@, {user.name}
            </h1>
            <div className="h-full flex flex-col items-center justify-center gap-6 mt-[20vh]">
                <Button
                  className="text-[1.5rem] h-[80px]"
                  color="primary" 
                  size="lg" 
                  onClick={() => navigate(constants.root + "Calendario")}
                >
                    Calendario
                </Button>
                <Button 
                  className="text-[1.5rem] h-[80px]"
                  color="primary" 
                  size="lg"
                  onClick={() => navigate(constants.root + "ProfesorMatriculas")}
                >
                    Gestionar matrículas
                </Button>
            </div>
        </>
    )
}

export default ProfesorMenu