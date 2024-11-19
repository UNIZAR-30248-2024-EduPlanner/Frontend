import { Modal, ModalContent, ModalBody, ModalHeader, Button, Checkbox } from "@nextui-org/react";
import { useState, useEffect } from "react";

const ModalHorarioCrearEditar = ({ 
    isOpen, 
    onOpenChange, 
    title,
    initialData,
    gruposExistentes,
    tiposExistentes,
    onSubmit,
    onDelete
}) => {

    const [id, setId] = useState("");
    const [starting_date, setStartingDate] = useState("");
    const [end_date, setEndDate] = useState("");
    const [date, setDate] = useState("");
    const [start, setStart] = useState("");
    const [end, setEnd] = useState("");
    const [place, setPlace] = useState("");
    const [description, setDescription] = useState("");
    const [group_name, setGroupName] = useState("");
    const [type, setType] = useState("");
    const [name, setName] = useState("");
    const [subjectId, setSubjectId] = useState("");
    const [newGroup, setNewGroup] = useState(false);
    const [isPeriodic, setIsPeriodic] = useState(false);
    const [periodicity, setPeriodicity] = useState("");

    const clearData = () => {
        setId("");
        setStartingDate("");
        setEndDate("");
        setStart("");
        setEnd("");
        setPlace("");
        setDescription("");
        setGroupName("");
        setDate("");
        setType("");
        setNewGroup(false);
        setName("");
        setSubjectId("");
        setIsPeriodic("");
    };

    useEffect(() => {
        if (initialData) {
            setId(initialData.id || "");
            setStartingDate(initialData.starting_date || "");
            setEndDate(initialData.end_date || "");
            setStart(initialData.start || "");
            setDate(initialData.date || "");
            setEnd(initialData.end || "");
            setPlace(initialData.place || "");
            setDescription(initialData.description || "");
            setGroupName(initialData.group_name || "");
            setType(initialData.type || "");
            setName(initialData.name || "");
            setSubjectId(initialData.subjectId || "");
            setIsPeriodic(initialData.periodicity !== "");
            setPeriodicity(initialData.periodicity || "");
        } else {
            title = "Crear horario";
        }
    }, [initialData]);

    const handleGroupChange = (e) => {
        const value = e.target.value;
        if (value === "nuevo") {
            setNewGroup(true);
            setGroupName("");
        } else {
            setNewGroup(false);
            setGroupName(value);
        }
    };

    const handleTipoChange = (e) => {
        setType(e.target.value);
    };

    const handleSubmit = () => {

        // Validaciones
        if (start > end) {
            alert("La hora de inicio debe ser igual o anterior a la hora de finalización");
            return;
        }
        if (group_name === "") {
            alert("Debe seleccionar un grupo o crear uno nuevo");
            return;
        }
        if (isPeriodic && starting_date >= end_date) {
            alert("La fecha de inicio debe ser anterior a la fecha de finalización");
            return;
        }
        if (isPeriodic && (periodicity < 7 || periodicity % 7 !== 0)) {
            alert("La periodicidad debe ser un múltiplo de 7");
            return;
        }

        const horario = {
            id: id,
            name: name,
            starting_date: starting_date !== "" ? starting_date : date,
            end_date: end_date !== "" ? end_date : date,
            day: date,
            date: date,
            start: start,
            end: end,
            type: type === "click" ? "Clase Magistral" : type,
            place: place,
            description: description,
            group_name: group_name,
            subject_id: subjectId,
            periodicity: periodicity
        };
        onSubmit(horario);
        clearData();
        onOpenChange(false);
    };

    const handleDelete = () => {
        onDelete(id);
        clearData();
        onOpenChange(false);
    }

    return (
        <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className="modal-header">{title}</ModalHeader>
                        <hr className="separator" />
                        <ModalBody>
                        <div className="mb-4">
                            <h2 className="text-xl font-bold mb-4">Fecha y Hora</h2>
                            <Checkbox
                                isSelected={isPeriodic}
                                onChange={() => setIsPeriodic(!isPeriodic)}
                                className="mb-4"
                            >Horario periódico</Checkbox>
                            {isPeriodic ? (
                                <>
                                    <div className="flex space-x-4">
                                        <div>
                                            <label className="block text-md font-semibold">Fecha de inicio</label>
                                            <input
                                                type="date"
                                                className="border p-2 mb-4 mr-2"
                                                value={starting_date}
                                                onChange={(e) => setStartingDate(e.target.value)}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-md font-semibold">Fecha de finalización</label>
                                            <input
                                                type="date"
                                                className="border p-2 mb-4"
                                                value={end_date}
                                                onChange={(e) => setEndDate(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-md font-semibold">¿Cada cuántos días se repite el horario?</label>
                                        <input
                                            type="number"
                                            className="border p-2 w-full"
                                            value={periodicity}
                                            onChange={(e) => setPeriodicity(e.target.value)}
                                        />
                                    </div>
                                </>
                                ) : (
                                    <div className="flex space-x-4">
                                        <div>
                                            <label className="block text-md font-semibold">Fecha</label>
                                            <input
                                                type="date"
                                                className="border p-2 mb-4 mr-2"
                                                value={date}
                                                onChange={(e) => setDate(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                )}
                                <div className="flex space-x-4">
                                    <div>
                                        <label className="block text-md font-semibold">Hora de inicio</label>
                                        <input
                                            type="time"
                                            className="border p-2 mr-16"
                                            value={start}
                                            min="08:00"
                                            max="21:00"
                                            onChange={(e) => {
                                                const value = e.target.value;
                                                if (value < "08:00" || value > "21:00") {
                                                    alert("La hora debe estar entre 08:00 y 21:00");
                                                } else {
                                                    setStart(value);
                                                }
                                            }}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-md font-semibold">Hora de finalización</label>
                                        <input
                                            type="time"
                                            className="border p-2"
                                            value={end}
                                            min="8:00"
                                            max="21:00"
                                            onChange={(e) => {
                                                const value = e.target.value;
                                                if (value < "08:00" || value > "21:00") {
                                                    alert("La hora debe estar entre 08:00 y 21:00");
                                                } else {
                                                    setEnd(value);
                                                }
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="mb-4">
                                <h2 className="text-xl font-bold mb-4">Lugar</h2>
                                <input
                                    type="text"
                                    className="border p-2 w-full"
                                    placeholder="Ingrese el espacio reservado"
                                    value={place}
                                    onChange={(e) => setPlace(e.target.value)}
                                />
                            </div>
                            <div className="mb-4">
                                <h2 className="text-xl font-bold mb-4">Grupo</h2>
                                <select
                                    className="border p-2 w-full"
                                    value={newGroup ? "nuevo" : group_name}
                                    onChange={handleGroupChange}
                                >
                                    <option value="" disabled>Seleccione un grupo</option>
                                    {gruposExistentes.map((grupo, idx) => (
                                        <option key={idx} value={grupo}>{grupo}</option>
                                    ))}
                                    <option value="nuevo">Nuevo grupo</option>
                                </select>
                                {newGroup && (
                                    <input
                                        type="text"
                                        className="border p-2 w-full mt-4"
                                        placeholder="Ingrese el grupo"
                                        value={group_name}
                                        onChange={(e) => setGroupName(e.target.value)}
                                    />
                                )}
                            </div>
                            <div className="mb-4">
                                <h2 className="text-xl font-bold mb-4">Tipo</h2>
                                <select
                                    className="border p-2 w-full"
                                    value={type}
                                    onChange={handleTipoChange}
                                >
                                    <option value="" disabled>Seleccione un tipo</option>
                                    {tiposExistentes.map((tipo, idx) => (
                                        <option key={idx} value={tipo}>{tipo}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="mb-4">
                                <h2 className="text-xl font-bold mb-4">Descripción</h2>
                                <textarea
                                    className="border p-2 w-full"
                                    placeholder="Ingrese una descripción"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}>
                                </textarea>
                            </div>
                            {id && (
                                    <Button 
                                        style={{ backgroundColor: '#FF0000', color: 'white' }}
                                        onPress={handleDelete}>
                                        Eliminar
                                    </Button>
                            )}
                            <Button 
                                color="primary" 
                                onPress={handleSubmit}>
                                Guardar en el calendario
                            </Button>
                        </ModalBody>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
};

export default ModalHorarioCrearEditar;
