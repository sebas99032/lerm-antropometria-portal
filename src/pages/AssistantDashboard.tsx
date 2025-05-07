
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { mockPatients, Patient, getPatientsForAssistant } from "@/lib/mockData";
import { 
  ClipboardList, 
  RefreshCcw, 
  Eye,
  ArrowRight
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

const AssistantDashboard = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Load patients that are enabled for anthropometry
    const enabledPatients = getPatientsForAssistant();
    setPatients(enabledPatients);
  }, []);

  const handleViewDetails = (patient: Patient) => {
    setSelectedPatient(patient);
    setDetailsDialogOpen(true);
  };

  const handleStartTest = (patientId: string) => {
    navigate(`/assistant/anthropometry/${patientId}`);
  };

  const handleRefreshList = () => {
    // In a real app, this would fetch fresh data from the server
    const enabledPatients = getPatientsForAssistant();
    setPatients(enabledPatients);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header title="Panel del Asistente" />
      
      <main className="container mx-auto py-6 px-4 flex-1">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Pacientes para Evaluación</h1>
          <Button onClick={handleRefreshList}>
            <RefreshCcw className="mr-2 h-4 w-4" />
            Actualizar Lista
          </Button>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Pacientes Habilitados para Antropometría</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Documento</TableHead>
                  <TableHead>Edad</TableHead>
                  <TableHead>Género</TableHead>
                  <TableHead>Tipo de Formulario</TableHead>
                  <TableHead>Fecha de Registro</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {patients.length > 0 ? (
                  patients.map((patient) => (
                    <TableRow key={patient.id}>
                      <TableCell className="font-medium">{patient.name}</TableCell>
                      <TableCell>{patient.documentId}</TableCell>
                      <TableCell>{patient.age}</TableCell>
                      <TableCell>{patient.gender === 'male' ? 'Masculino' : 'Femenino'}</TableCell>
                      <TableCell>{patient.formType}</TableCell>
                      <TableCell>{patient.formSubmissionDate}</TableCell>
                      <TableCell className="text-right space-x-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleViewDetails(patient)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          onClick={() => handleStartTest(patient.id)}
                        >
                          <ClipboardList className="mr-2 h-4 w-4" />
                          Realizar Prueba
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                      No hay pacientes habilitados para pruebas
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        
        {/* Patient Details Dialog */}
        <Dialog open={detailsDialogOpen} onOpenChange={setDetailsDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Detalles del Paciente</DialogTitle>
            </DialogHeader>
            
            {selectedPatient && (
              <div className="mt-4 space-y-4">
                <div className="flex justify-between">
                  <div className="space-y-1">
                    <h3 className="font-semibold text-lg">{selectedPatient.name}</h3>
                    <p className="text-sm text-gray-500">
                      {selectedPatient.gender === 'male' ? 'Masculino' : 'Femenino'}, {selectedPatient.age} años
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">Documento: {selectedPatient.documentId}</p>
                    <p className="text-sm text-gray-500">Registro: {selectedPatient.formSubmissionDate}</p>
                  </div>
                </div>
                
                <div className="border-t pt-4">
                  <h4 className="font-medium mb-2">Información del Formulario</h4>
                  <dl className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <dt className="text-gray-500">Altura:</dt>
                      <dd>{selectedPatient.formData.height} cm</dd>
                    </div>
                    <div>
                      <dt className="text-gray-500">Peso:</dt>
                      <dd>{selectedPatient.formData.weight} kg</dd>
                    </div>
                    <div className="col-span-2">
                      <dt className="text-gray-500">Condiciones Médicas:</dt>
                      <dd>{selectedPatient.formData.medicalConditions}</dd>
                    </div>
                    <div className="col-span-2">
                      <dt className="text-gray-500">Alergias:</dt>
                      <dd>{selectedPatient.formData.allergies}</dd>
                    </div>
                    <div className="col-span-2">
                      <dt className="text-gray-500">Lesiones Previas:</dt>
                      <dd>{selectedPatient.formData.previousInjuries}</dd>
                    </div>
                  </dl>
                </div>
              </div>
            )}
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setDetailsDialogOpen(false)}>Cerrar</Button>
              <Button onClick={() => {
                setDetailsDialogOpen(false);
                if (selectedPatient) handleStartTest(selectedPatient.id);
              }}>
                <ArrowRight className="mr-2 h-4 w-4" />
                Realizar Prueba
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
};

export default AssistantDashboard;
