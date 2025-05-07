
import { useState } from "react";
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
import { useToast } from "@/components/ui/use-toast";
import { mockPatients } from "@/lib/mockData";
import { Eye, Download, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

const EvaluatedList = () => {
  const [patients] = useState(mockPatients.filter(p => p.isEvaluated));
  const [selectedPatient, setSelectedPatient] = useState<typeof patients[0] | null>(null);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const { toast } = useToast();

  const handleViewDetails = (patient: typeof patients[0]) => {
    setSelectedPatient(patient);
    setDetailsDialogOpen(true);
  };

  const handleDownloadPDF = (patientId: string) => {
    // In a real app, this would generate and download a PDF
    toast({
      title: "PDF generado",
      description: "El PDF ha sido generado y descargado exitosamente.",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header title="Lista de Evaluados" />
      
      <main className="container mx-auto py-6 px-4 flex-1">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <Link to="/evaluator" className="mr-4">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-1" />
                Volver
              </Button>
            </Link>
            <h1 className="text-2xl font-bold text-gray-800">Pacientes Evaluados</h1>
          </div>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Resultados de Evaluaciones</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Documento</TableHead>
                  <TableHead>Edad</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>IMC</TableHead>
                  <TableHead>Fecha Evaluación</TableHead>
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
                      <TableCell>
                        {patient.anthropometryResults?.bmi?.toFixed(1) || "N/A"}
                      </TableCell>
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
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDownloadPDF(patient.id)}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                      No hay pacientes evaluados
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        
        {/* Patient Results Dialog */}
        <Dialog open={detailsDialogOpen} onOpenChange={setDetailsDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Resultados de la Evaluación</DialogTitle>
            </DialogHeader>
            
            {selectedPatient && selectedPatient.anthropometryResults && (
              <div className="space-y-6 py-4">
                <div className="flex justify-between">
                  <div>
                    <h2 className="text-xl font-bold">{selectedPatient.name}</h2>
                    <p className="text-sm text-gray-500">
                      {selectedPatient.gender === 'male' ? 'Masculino' : 'Femenino'}, {selectedPatient.age} años
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm">ID: {selectedPatient.documentId}</p>
                    <p className="text-sm text-gray-500">Fecha: {selectedPatient.formSubmissionDate}</p>
                  </div>
                </div>
                
                <div className="border-t pt-4">
                  <h3 className="text-lg font-semibold mb-4">Resultados Antropométricos</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card className="border border-gray-200">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-md">Índices Corporales Básicos</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <dl className="space-y-2">
                          <div className="flex justify-between">
                            <dt className="text-gray-600">IMC:</dt>
                            <dd className="font-medium">{selectedPatient.anthropometryResults.bmi?.toFixed(2) || "N/A"}</dd>
                          </div>
                          <div className="flex justify-between">
                            <dt className="text-gray-600">Índice de Livi:</dt>
                            <dd className="font-medium">{selectedPatient.anthropometryResults.liviIndex?.toFixed(2) || "N/A"}</dd>
                          </div>
                          <div className="flex justify-between">
                            <dt className="text-gray-600">Índice de Röhrer:</dt>
                            <dd className="font-medium">{selectedPatient.anthropometryResults.rohrerIndex?.toFixed(2) || "N/A"}</dd>
                          </div>
                          <div className="flex justify-between">
                            <dt className="text-gray-600">Índice Ponderal:</dt>
                            <dd className="font-medium">{selectedPatient.anthropometryResults.ponderalIndex?.toFixed(2) || "N/A"}</dd>
                          </div>
                          <div className="flex justify-between">
                            <dt className="text-gray-600">Relación Cintura-Altura:</dt>
                            <dd className="font-medium">{selectedPatient.anthropometryResults.waistHeightRatio?.toFixed(2) || "N/A"}</dd>
                          </div>
                        </dl>
                      </CardContent>
                    </Card>
                    
                    <Card className="border border-gray-200">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-md">Composición Corporal</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <dl className="space-y-2">
                          <div className="flex justify-between">
                            <dt className="text-gray-600">% Masa Grasa:</dt>
                            <dd className="font-medium">{selectedPatient.anthropometryResults.bodyComposition?.fatMass?.toFixed(2) || "N/A"}%</dd>
                          </div>
                          <div className="flex justify-between">
                            <dt className="text-gray-600">% Masa Ósea:</dt>
                            <dd className="font-medium">{selectedPatient.anthropometryResults.bodyComposition?.boneMass?.toFixed(2) || "N/A"}%</dd>
                          </div>
                          <div className="flex justify-between">
                            <dt className="text-gray-600">% Masa Muscular:</dt>
                            <dd className="font-medium">{selectedPatient.anthropometryResults.bodyComposition?.skeletalMuscleMass?.toFixed(2) || "N/A"}%</dd>
                          </div>
                          <div className="flex justify-between">
                            <dt className="text-gray-600">Densidad Corporal:</dt>
                            <dd className="font-medium">{selectedPatient.anthropometryResults.bodyDensity?.toFixed(4) || "N/A"} g/cm³</dd>
                          </div>
                        </dl>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <div className="mt-6 bg-blue-50 p-4 rounded-md">
                    <h4 className="font-medium text-blue-800 mb-2">Clasificación según IMC:</h4>
                    <p className="text-blue-700">
                      {(() => {
                        const bmi = selectedPatient.anthropometryResults.bmi;
                        if (!bmi) return "No disponible";
                        if (bmi < 18.5) return "Peso insuficiente";
                        if (bmi < 25) return "Peso normal";
                        if (bmi < 27) return "Sobrepeso grado I";
                        if (bmi < 30) return "Sobrepeso grado II (preobesidad)";
                        if (bmi < 35) return "Obesidad I";
                        if (bmi < 40) return "Obesidad II";
                        if (bmi < 50) return "Obesidad III (mórbida)";
                        return "Obesidad IV (extrema)";
                      })()}
                    </p>
                  </div>
                </div>
              </div>
            )}
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setDetailsDialogOpen(false)}>
                Cerrar
              </Button>
              <Button onClick={() => handleDownloadPDF(selectedPatient?.id || "")}>
                <Download className="mr-2 h-4 w-4" />
                Descargar PDF
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
};

export default EvaluatedList;
