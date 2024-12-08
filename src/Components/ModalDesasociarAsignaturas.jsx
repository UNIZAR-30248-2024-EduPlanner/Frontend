import { Button, Modal, ModalContent, ModalBody, ModalFooter } from "@nextui-org/react";
import { useState } from "react";
import { unenrollStudent } from "../supabase/student/student.js";
import PropTypes from 'prop-types';
import { useAuth } from "../context/AuthContext";
import '../css/Components/ModalHorario.css';
import '../css/Components/ModalEditarHorario.css';

const ModalDesasociarAsignaturas = ({ isOpen, onOpenChange, asignaturas, empty }) => {
  const [selectedAsignaturas, setSelectedAsignaturas] = useState([]); // Para guardar asignaturas seleccionadas
  const [isConfirmModalOpen, setConfirmModalOpen] = useState(false);
  const {user} = useAuth();
  // Manejador para cuando se selecciona o deselecciona una asignatura
  const handleCheckboxChange = (asignaturaId) => {
    setSelectedAsignaturas((prev) => {
      if (prev.includes(asignaturaId)) {
        // Si ya está seleccionada, la eliminamos
        return prev.filter((id) => id !== asignaturaId);
      } else {
        // Si no está seleccionada, la agregamos
        return [...prev, asignaturaId];
      }
    });
  };

  // Manejador de clic en Desasociarse
  const handleDesasociarClick = () => {
    setConfirmModalOpen(true);
  };

  // Confirmar desasociación
  const confirmarDesasociacion = async () => {
    if (user){
      for (const asignaturaId of selectedAsignaturas) {
        //console.log("Desasociando asignatura");
        // Desasociar cada asignatura seleccionada
        const asignatura = asignaturas.find((a) => a.id === asignaturaId);
        //console.log(user.nip, asignatura.subject_code);
        await unenrollStudent(user.nip, asignatura.subject_code);
      }
      // Limpiar las asignaturas seleccionadas y cerrar el modal
      setSelectedAsignaturas([]);
      setConfirmModalOpen(false);
      window.location.reload();
    }

  };

  const handleConfirmModalClose = () => {
    setConfirmModalOpen(false);
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        style={{
          transform: "scale(0.95)",
          overflow: "auto",
          width: "90%",
          maxWidth: "600px",
          margin: "auto",
        }}
      >
        <ModalContent
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            textAlign: "center",
          }}
        >
          <hr className="separator"/>
          <div className="modal-header">
            <h2 style={{ marginBottom: "0" }} className="large-bold-title">Gestionar Asignaturas</h2>
          </div>
          <ModalBody
            style={{
              transform: "scale(0.9)",
              maxHeight: "80vh",
              overflow: "auto",
              padding: "20px",
            }}
          >
            {!empty ? (
              <ul className="pl-5">
                {asignaturas.map((asignatura) => (
                  <li
                    key={asignatura.id}
                    className="flex justify-between items-center mb-4"
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      backgroundColor: '#f0f0f0', // Fondo gris claro
                      borderRadius: '8px', // Bordes redondeados
                      padding: '10px', // Margen interno
                      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', // Sombra para resaltar
                    }}
                  >
                    {/* Nombre de la asignatura alineado a la izquierda */}
                    <span
                      //className="text-xl"
                      style={{
                        flex: 1,
                        textAlign: 'left',
                        marginRight: '10px',
                      }}
                    >
                      {asignatura.name && asignatura.name}
                    </span>
                    <input
                      type="checkbox"
                      checked={selectedAsignaturas.includes(asignatura.id)}
                      onChange={() => handleCheckboxChange(asignatura.id)}
                      className="mr-2"
                      style={{
                        width: '24px',
                        height: '24px',
                        cursor: 'pointer',
                      }}
                    />
                  </li>
                ))}
              </ul>
            ) : (
              <p>No tienes asignaturas asociadas.</p>
            )}
          </ModalBody>
          {/* Botón solo aparece si hay asignaturas seleccionadas */}
          {selectedAsignaturas.length > 0 && (
              <Button
                style={{ marginBottom: "20px" }}
                color="danger"
                onPress={handleDesasociarClick}
              >
                Desasociarse
              </Button>
            )}
        </ModalContent>
      </Modal>

      {/* Modal de Confirmación */}
      <Modal
        isOpen={isConfirmModalOpen}
        onOpenChange={setConfirmModalOpen}
        style={{
          transform: "scale(0.95)",
          overflow: "auto",
          width: "90%",
          maxWidth: "500px",
          margin: "auto",
        }}
      >
        <ModalContent
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            textAlign: "center",
          }}
        >
          <hr className="separator"/>
          <div className="modal-header" style={{ marginTop: "20px" }}>
            <h2 style={{ marginBottom: "0" }} className="large-bold-title">Confirmar Desasociación</h2>
          </div>
          <ModalBody
            style={{
              transform: "scale(0.9)",
              maxHeight: "80vh",
              overflow: "auto",
              padding: "20px",
            }}
          >
            <p>
              ¿Estás seguro de que quieres desasociarte de{" "}
              <strong>{selectedAsignaturas.map((id) => asignaturas.find((a) => a.id === id).name).join(", ")}</strong>?
            </p>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onPress={handleConfirmModalClose}>
              Cancelar
            </Button>
            <Button color="danger" onPress={confirmarDesasociacion}>
              Confirmar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

ModalDesasociarAsignaturas.propTypes = {
  asignaturas: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      subject_code: PropTypes.number.isRequired,
      course_id: PropTypes.number.isRequired,
    })
  ).isRequired,
  isOpen: PropTypes.bool.isRequired,
  onOpenChange: PropTypes.func.isRequired,
  empty: PropTypes.bool.isRequired
};
export default ModalDesasociarAsignaturas;
