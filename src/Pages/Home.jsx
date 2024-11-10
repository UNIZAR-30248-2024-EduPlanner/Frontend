import "../css/Home.css";
import { useNavigate } from "react-router-dom";
import constants from "../constants/constants";
import { Button } from "@nextui-org/react";
import EduplannerLogo from "../assets/Eduplanner.png";
import { FaUserPlus, FaSignInAlt } from 'react-icons/fa';
import Gallery from 'react-image-gallery';
import 'react-image-gallery/styles/css/image-gallery.css';

// Imágenes de ejemplo
import image1 from "../assets/image1.jpg";
import image2 from "../assets/image2.jpg";
import image3 from "../assets/image3.jpg";
import image4 from "../assets/image4.jpg";
import image5 from "../assets/image5.jpg";

const Home = () => {
    const navigate = useNavigate();

    // Lista de imágenes para la galería
    const images = [
        { original: image1, thumbnail: image1, description: "Imagen 1" },
        { original: image2, thumbnail: image2, description: "Imagen 2" },
        { original: image3, thumbnail: image3, description: "Imagen 3" },
        { original: image4, thumbnail: image4, description: "Imagen 4" },
        { original: image5, thumbnail: image5, description: "Imagen 5" }
    ];

    return (
        <div className="home-container">
            {/*<div className="logo-container">
                 <img
                    src={EduplannerLogo}
                    alt="EduPlanner Logo"
                    className="eduplanner-logo"
                />
            </div>*/}

            <div className="button-container">
                <Button size="md" color="primary"
                    icon={<FaSignInAlt />}
                    onClick={() => navigate(constants.root + "IniciarSesion")}
                >
                    Iniciar sesión
                </Button>
                <Button size="md" color="primary"
                    icon={<FaUserPlus />}
                    onClick={() => navigate(constants.root + "CrearOrganizacion")}
                >
                    Crear organización
                </Button>
            </div>

            <hr className="separator" />

            <header className="header">
                <h1>Bienvenido a EduPlanner</h1>
                <p>La plataforma que mejora la planificación educativa de tu organización.</p>
            </header>

            {/* Galería de imágenes */}
            <div className="image-slice">
                <Gallery
                    items={images}
                    showThumbnails={false} // Oculta las miniaturas
                    autoPlay={true}        // Activa la reproducción automática
                    slideInterval={3000}   // Intervalo de 3 segundos para el cambio de imagen
                    showFullscreenButton={false} // Deshabilita el botón de pantalla completa
                    showPlayButton={false} // Deshabilita el botón de reproducción
                />
            </div>

            <footer className="footer">
                <p>© 2024 EduPlanner. Todos los derechos reservados.</p>
            </footer>
        </div>
    );
};

export default Home;
