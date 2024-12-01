import { Button, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@nextui-org/react";
import { useState } from "react";
import { unenrollStudent } from "../supabase/student/student.js";
import PropTypes from 'prop-types';
import { useAuth } from "../context/AuthContext";

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
    
        // Desasociar cada asignatura seleccionada
        const asignatura = asignaturas.find((a) => a.id === asignaturaId);
        await unenrollStudent(user.nip, asignatura.subject_code);
      }
      // Limpiar las asignaturas seleccionadas y cerrar el modal
      setSelectedAsignaturas([]);
      setConfirmModalOpen(false);
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
          <ModalHeader className="text-center text-xl">{"Gestionar Asignaturas"}</ModalHeader>
          <hr className="separator" style={{ width: "100%", margin: "10px 0", border: "1px solid #ccc" }} />
          <ModalBody
            style={{
              transform: "scale(0.9)",
              maxHeight: "80vh",
              overflow: "auto",
              padding: "20px",
            }}
          >
            {!empty ? (
              <ul className="list-disc pl-5">
                {asignaturas.map((asignatura) => (
                  <li
                    key={asignatura.id}
                    className="flex justify-between items-center mb-4"
                  >
                    <input
                      type="checkbox"
                      checked={selectedAsignaturas.includes(asignatura.id)}
                      onChange={() => handleCheckboxChange(asignatura.id)}
                      className="mr-2"
                    />
                    <span className="text-lg font-semibold">{asignatura.name && asignatura.name }</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No tienes asignaturas asociadas.</p>
            )}
            <Button
              color="danger"
              onPress={handleDesasociarClick}
              disabled={selectedAsignaturas.length === 0} // Solo habilitar si hay asignaturas seleccionadas
            >
              Desasociarse
            </Button>
          </ModalBody>
          <ModalFooter>
            <Button color="secondary" onPress={onOpenChange}>
              Cerrar
            </Button>
          </ModalFooter>
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
          <ModalHeader className="text-center text-xl">
            Confirmar desasociación
          </ModalHeader>
          <hr
            className="separator"
            style={{ width: "100%", margin: "10px 0", border: "1px solid #ccc" }}
          />
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
            <Button color="secondary" onPress={handleConfirmModalClose}>
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
