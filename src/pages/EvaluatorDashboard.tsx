
import { useState } from "react";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/components/ui/use-toast";
import { mockPatients, Patient } from "@/lib/mockData";
import { 
  Eye, 
  FileText, 
  Trash2, 
  Edit, 
  RefreshCcw, 
  ClipboardCheck, 
  ArrowRight 
} from "lucide-react";
import { Link } from "react-router-dom";

const EvaluatorDashboard = () => {
  const [patients, setPatients] = useState<Patient[]>(mockPatients.filter(p => !p.isEvaluated));
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleViewDetails = (patient: Patient) => {
    setSelectedPatient(patient);
    setDetailsDialogOpen(true);
  };

  const handleDeletePatient = (patient: Patient) => {
    setSelectedPatient(patient);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (selectedPatient) {
      setPatients(patients.filter(p => p.id !== selectedPatient.id));
      toast({
        title: "Registro eliminado",
        description: `El registro de ${selectedPatient.name} ha sido eliminado exitosamente.`,
      });
      setDeleteDialogOpen(false);
    }
  };

  const handleEnableForTest = (patientId: string) => {
    setPatients(patients.map(p => 
      p.id === patientId ? { ...p, isEnabled: true } : p
    ));
    
    toast({
      title: "Paciente habilitado",
      description: "El paciente ha sido habilitado para la prueba de antropometría.",
    });
  };

  const handleRefreshList = () => {
    // In a real app, this would fetch fresh data from the server
    toast({
      title: "Lista actualizada",
      description: "La lista de pacientes ha sido actualizada.",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header title="Panel de Evaluador" />
      
      <main className="container mx-auto py-6 px-4 flex-1">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Pacientes Registrados</h1>
          <div className="space-x-2">
            <Link to="/evaluator/evaluated">
              <Button variant="outline">
                <FileText className="mr-2 h-4 w-4" />
                Ver Evaluados
              </Button>
            </Link>
            <Button onClick={handleRefreshList}>
              <RefreshCcw className="mr-2 h-4 w-4" />
              Actualizar Lista
            </Button>
          </div>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Lista de Pacientes</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Documento</TableHead>
                  <TableHead>Edad</TableHead>
                  <TableHead>Tipo de Formulario</TableHead>
                  <TableHead>Fecha de Registro</TableHead>
                  <TableHead>Estado</TableHead>
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
                      <TableCell>{patient.formType}</TableCell>
                      <TableCell>{patient.formSubmissionDate}</TableCell>
                      <TableCell>
                        {patient.isEnabled ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Habilitado
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            Pendiente
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="text-right space-x-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleViewDetails(patient)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeletePatient(patient)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                        {!patient.isEnabled && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEnableForTest(patient.id)}
                          >
                            <ClipboardCheck className="mr-1 h-4 w-4" />
                            Habilitar
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                      No hay pacientes registrados
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
                
                <div className="border-t pt-4">
                  <h4 className="font-medium mb-2">Estado de Pruebas</h4>
                  <div className="flex items-center space-x-2">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      selectedPatient.isEnabled ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {selectedPatient.isEnabled ? 'Habilitado para prueba' : 'Pendiente de habilitación'}
                    </span>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      selectedPatient.isEvaluated ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {selectedPatient.isEvaluated ? 'Evaluado' : 'No evaluado'}
                    </span>
                  </div>
                </div>
              </div>
            )}
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setDetailsDialogOpen(false)}>Cerrar</Button>
              {selectedPatient && !selectedPatient.isEnabled && (
                <Button onClick={() => {
                  handleEnableForTest(selectedPatient.id);
                  setDetailsDialogOpen(false);
                }}>
                  <ClipboardCheck className="mr-2 h-4 w-4" />
                  Habilitar para Prueba
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        {/* Delete Confirmation Dialog */}
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>¿Está seguro que desea eliminar?</AlertDialogTitle>
              <AlertDialogDescription>
                Esta acción no se puede deshacer. Se eliminará permanentemente el registro
                del paciente {selectedPatient?.name}.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
                Eliminar
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </main>
    </div>
  );
};

export default EvaluatorDashboard;
