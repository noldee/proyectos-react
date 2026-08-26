import { toast } from "react-toastify";
import { usePatientStore } from "../store/store";
import type { Patient } from "../types";
import { PatientDetailItem } from "./PatientDetailItem";

type PatientDetailsProps = {
  patient: Patient;
};
export const PatientDetails = ({ patient }: PatientDetailsProps) => {
  const removePatient = usePatientStore((state) => state.removePatient);
  const getPatientById = usePatientStore((state) => state.getPatientById);

  const handleClick = () => {
    removePatient(patient.id);
    toast("Paciente Elimiando", {
      type: "error",
    });
  };
  return (
    <div className="mx-5  my-10 px-5 py-10 bg-white shadow-md rounded-lg">
      <PatientDetailItem label="ID" data={patient.id} />
      <PatientDetailItem label="Nombre" data={patient.name} />
      <PatientDetailItem label="Propietario" data={patient.caretaker} />
      <PatientDetailItem label="Email" data={patient.email} />
      <PatientDetailItem label="Fecha Alta" data={patient.date} />
      <PatientDetailItem label="Sintomas" data={patient.symptoms} />

      <div className="flex flex-col md:flex-row gap-3 justify-between mt-10">
        <button
          onClick={() => getPatientById(patient.id)}
          type="button"
          className="py-2 px-10 bg-indigo-600 hover:bg-indigo-700 text-white font-bold uppercase rounded-lg"
        >
          Editar
        </button>
        <button
          onClick={handleClick}
          type="button"
          className="py-2 px-10 bg-red-600 hover:bg-red-700 text-white font-bold uppercase rounded-lg"
        >
          Eliminar
        </button>
      </div>
    </div>
  );
};
