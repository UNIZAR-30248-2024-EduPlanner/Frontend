import "../css/Home.css";
import { useNavigate } from "react-router-dom";
import constants from "../constants/constants";
import { Button } from "@nextui-org/react";
import EduplannerLogo from "../assets/Eduplanner.png";

const Home = () => {
    const navigate = useNavigate();

    return (
        <>
            <img src={EduplannerLogo} alt="EduPlanner Logo" className="eduplanner-logo" />

            <div className="page-form space-y-20">
                <Button size="lg" color="primary"
                    className="button-iniciar-sesion"
                    style={{ marginTop: "20px" }}
                    onClick={() => navigate(constants.root + "IniciarSesion")}
                >
                    Iniciar sesión
                </Button>
                <p className="text-eduplanner">
                    ¿Quieres EduPlanner para tu organización?
                </p>
                <Button size="lg" color="primary"
                    className="button-crear-organizacion"
                    style={{ marginTop: "20px" }}
                    onClick={() => navigate(constants.root + "CrearOrganizacion")}
                >
                    Crear organización
                </Button>
            </div>
        </>
    );
};

export default Home;
