
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { getPatientById, Patient } from "@/lib/mockData";
import { ArrowLeft, Calculator, Save } from "lucide-react";

interface MeasurementField {
  label: string;
  key: string;
  unit: string;
}

// Group measurement fields by category
const measurementGroups = [
  {
    title: "Datos Básicos",
    fields: [
      { label: "Masa corporal", key: "bodyMass", unit: "kg" },
      { label: "Talla", key: "height", unit: "cm" },
      { label: "Talla sentado", key: "sittingHeight", unit: "cm" },
      { label: "Envergadura de brazos", key: "armSpan", unit: "cm" },
    ]
  },
  {
    title: "Pliegues Cutáneos",
    fields: [
      { label: "Pliegue del tríceps", key: "tricepsFold", unit: "mm" },
      { label: "Pliegue del subescapular", key: "subscapularFold", unit: "mm" },
      { label: "Pliegue del bíceps", key: "bicepsFold", unit: "mm" },
      { label: "Pliegue de la cresta ilíaca", key: "iliacCrestFold", unit: "mm" },
      { label: "Pliegue del supraespinal", key: "supraspinalFold", unit: "mm" },
      { label: "Pliegue del abdominal", key: "abdominalFold", unit: "mm" },
      { label: "Pliegue del muslo", key: "thighFold", unit: "mm" },
      { label: "Pliegue de la pierna", key: "calfFold", unit: "mm" },
    ]
  },
  {
    title: "Perímetros",
    fields: [
      { label: "Perímetro de la cabeza", key: "headCircumference", unit: "cm" },
      { label: "Perímetro del cuello", key: "neckCircumference", unit: "cm" },
      { label: "Perímetro del brazo relajado", key: "relaxedArmCircumference", unit: "cm" },
      { label: "Perímetro del brazo flexionado y contraído", key: "flexedArmCircumference", unit: "cm" },
      { label: "Perímetro del antebrazo", key: "forearmCircumference", unit: "cm" },
      { label: "Perímetro de la muñeca", key: "wristCircumference", unit: "cm" },
      { label: "Perímetro del tórax", key: "chestCircumference", unit: "cm" },
      { label: "Perímetro de la cintura", key: "waistCircumference", unit: "cm" },
      { label: "Perímetro de las caderas", key: "hipCircumference", unit: "cm" },
      { label: "Perímetro del muslo 1 cm glúteo", key: "thigh1cmCircumference", unit: "cm" },
      { label: "Perímetro del muslo medio", key: "midThighCircumference", unit: "cm" },
      { label: "Perímetro de la pierna", key: "calfCircumference", unit: "cm" },
      { label: "Perímetro del tobillo", key: "ankleCircumference", unit: "cm" },
    ]
  },
  {
    title: "Longitudes",
    fields: [
      { label: "Longitud acromiale-radiale", key: "acromialRadialeLength", unit: "cm" },
      { label: "Longitud radiale-stylion", key: "radialStylionLength", unit: "cm" },
      { label: "Longitud stylion medio-dactylion", key: "stylionDactylionLength", unit: "cm" },
      { label: "Altura iliospinale", key: "iliospinaleHeight", unit: "cm" },
      { label: "Altura trochanterion", key: "trochanterionHeight", unit: "cm" },
      { label: "Longitud trochanterion-tibiale laterale", key: "trochanterionTibialeLength", unit: "cm" },
      { label: "Altura tibiale laterale", key: "tibialeHeight", unit: "cm" },
      { label: "Longitud pie", key: "footLength", unit: "cm" },
      { label: "Longitud tibiale mediale-sphyrion tibiale", key: "tibialeSphyrionLength", unit: "cm" },
    ]
  },
  {
    title: "Diámetros",
    fields: [
      { label: "Diámetro biacromial", key: "biacromialDiameter", unit: "cm" },
      { label: "Diámetro antero-posterior del abdomen", key: "abdomenAnteroPosteriorDiameter", unit: "cm" },
      { label: "Diámetro biiliocristal", key: "biiliocristalDiameter", unit: "cm" },
      { label: "Diámetro transverso del tórax", key: "chestTransverseDiameter", unit: "cm" },
      { label: "Diámetro anteroposterior del tórax", key: "chestAnteroPosteriorDiameter", unit: "cm" },
      { label: "Diámetro húmero", key: "humerusDiameter", unit: "cm" },
      { label: "Diámetro biestiloideo", key: "biestyloidDiameter", unit: "cm" },
      { label: "Diámetro fémur", key: "femurDiameter", unit: "cm" },
      { label: "Diámetro bimaleolar", key: "bimalleolarDiameter", unit: "cm" },
    ]
  }
];

interface MeasurementValues {
  [key: string]: {
    measurement1: string;
    measurement2: string;
    measurement3?: string;
    result: string;
    needsThirdMeasurement: boolean;
  };
}

const AnthropometryForm = () => {
  const { patientId } = useParams();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [measurementValues, setMeasurementValues] = useState<MeasurementValues>({});
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (patientId) {
      const patientData = getPatientById(patientId);
      if (patientData) {
        setPatient(patientData);
        
        // Initialize measurement values
        const initialValues: MeasurementValues = {};
        measurementGroups.forEach(group => {
          group.fields.forEach(field => {
            initialValues[field.key] = {
              measurement1: "",
              measurement2: "",
              measurement3: "",
              result: "",
              needsThirdMeasurement: false
            };
          });
        });
        setMeasurementValues(initialValues);
      }
    }
  }, [patientId]);

  const handleMeasurementChange = (key: string, measurementNumber: number, value: string) => {
    const measurementKey = `measurement${measurementNumber}` as 'measurement1' | 'measurement2' | 'measurement3';
    
    setMeasurementValues(prev => {
      const updatedValues = { ...prev };
      updatedValues[key] = {
        ...updatedValues[key],
        [measurementKey]: value
      };
      
      // Check if we need a third measurement after entering the second
      if (measurementNumber === 2 && value && updatedValues[key].measurement1) {
        const measure1 = parseFloat(updatedValues[key].measurement1);
        const measure2 = parseFloat(value);
        
        if (!isNaN(measure1) && !isNaN(measure2)) {
          const avgMeasurement = (measure1 + measure2) / 2;
          const difference = Math.abs(measure1 - measure2);
          const percentDifference = (difference / avgMeasurement) * 100;
          
          // For skinfold measurements, threshold is 5%, for others it's 1%
          const isSkinfold = key.toLowerCase().includes('fold');
          const threshold = isSkinfold ? 5 : 1;
          
          if (percentDifference > threshold) {
            updatedValues[key].needsThirdMeasurement = true;
          } else {
            updatedValues[key].needsThirdMeasurement = false;
            updatedValues[key].result = avgMeasurement.toFixed(2);
          }
        }
      }
      
      // If we have all three measurements and third was needed, use the median
      if (
        updatedValues[key].needsThirdMeasurement &&
        updatedValues[key].measurement1 && 
        updatedValues[key].measurement2 && 
        updatedValues[key].measurement3
      ) {
        const measurements = [
          parseFloat(updatedValues[key].measurement1),
          parseFloat(updatedValues[key].measurement2),
          parseFloat(updatedValues[key].measurement3)
        ].sort((a, b) => a - b);
        
        if (!measurements.some(isNaN)) {
          // Use the median value (the middle one)
          updatedValues[key].result = measurements[1].toFixed(2);
        }
      }
      
      return updatedValues;
    });
  };

  const calculateResults = () => {
    // This would normally perform all the complex anthropometric calculations
    // For the demo, we'll just show a success message
    
    setLoading(true);
    
    setTimeout(() => {
      toast({
        title: "Cálculos realizados",
        description: "Los resultados antropométricos han sido calculados exitosamente."
      });
      
      setLoading(false);
    }, 1500);
  };

  if (!patient) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header title="Formulario Antropométrico" />
        <main className="container mx-auto py-6 px-4 flex-1 flex items-center justify-center">
          <p>Paciente no encontrado</p>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header title="Formulario Antropométrico" />
      
      <main className="container mx-auto py-6 px-4 flex-1">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <Button variant="ghost" onClick={() => navigate('/assistant')} className="mr-4">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Volver
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Prueba Antropométrica</h1>
              <p className="text-sm text-gray-500">Paciente: {patient.name} ({patient.gender === 'male' ? 'M' : 'F'}, {patient.age} años)</p>
            </div>
          </div>
        </div>
        
        <Alert className="mb-6 bg-blue-50 border-blue-200">
          <AlertDescription className="text-blue-800">
            <p>
              <strong>Instrucciones para toma de medidas:</strong>
            </p>
            <ul className="list-disc pl-5 space-y-1 mt-2 text-sm">
              <li>Realice dos mediciones para cada campo.</li>
              <li>Si la diferencia entre las dos primeras medidas es {'>'} 5% para pliegues o {'>'} 1% para el resto de variables, se habilitará una tercera medición.</li>
              <li>El resultado final será la media de dos mediciones (si son similares) o la mediana de las tres mediciones (si fue necesaria una tercera).</li>
            </ul>
          </AlertDescription>
        </Alert>
        
        <div className="space-y-8">
          {measurementGroups.map((group, groupIndex) => (
            <Card key={groupIndex}>
              <CardHeader className="bg-gray-50">
                <CardTitle className="text-lg">{group.title}</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-8">
                  {group.fields.map((field, fieldIndex) => (
                    <div key={fieldIndex} className="space-y-2">
                      <Label className="font-medium">{field.label} ({field.unit})</Label>
                      <div className="grid grid-cols-4 gap-2">
                        <div>
                          <Label htmlFor={`${field.key}-m1`} className="text-xs text-gray-500">Medida 1</Label>
                          <Input
                            id={`${field.key}-m1`}
                            type="number"
                            step="0.1"
                            value={measurementValues[field.key]?.measurement1 || ""}
                            onChange={(e) => handleMeasurementChange(field.key, 1, e.target.value)}
                            placeholder="0.0"
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor={`${field.key}-m2`} className="text-xs text-gray-500">Medida 2</Label>
                          <Input
                            id={`${field.key}-m2`}
                            type="number"
                            step="0.1"
                            value={measurementValues[field.key]?.measurement2 || ""}
                            onChange={(e) => handleMeasurementChange(field.key, 2, e.target.value)}
                            placeholder="0.0"
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor={`${field.key}-m3`} className="text-xs text-gray-500">Medida 3</Label>
                          <Input
                            id={`${field.key}-m3`}
                            type="number"
                            step="0.1"
                            value={measurementValues[field.key]?.measurement3 || ""}
                            onChange={(e) => handleMeasurementChange(field.key, 3, e.target.value)}
                            placeholder="0.0"
                            disabled={!measurementValues[field.key]?.needsThirdMeasurement}
                            className={!measurementValues[field.key]?.needsThirdMeasurement ? "bg-gray-100" : ""}
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor={`${field.key}-result`} className="text-xs text-gray-500">Resultado</Label>
                          <Input
                            id={`${field.key}-result`}
                            value={measurementValues[field.key]?.result || ""}
                            readOnly
                            className="bg-gray-50 font-medium"
                          />
                        </div>
                      </div>
                      
                      {measurementValues[field.key]?.needsThirdMeasurement && (
                        <p className="text-amber-600 text-xs">
                          La diferencia entre medidas supera el umbral permitido. Se requiere una tercera medición.
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="flex justify-end mt-8 space-x-4">
          <Button variant="outline" onClick={() => navigate('/assistant')}>
            Cancelar
          </Button>
          <Button onClick={calculateResults} disabled={loading}>
            {loading ? (
              <span className="flex items-center">
                <span className="animate-spin mr-2">⊚</span> Calculando...
              </span>
            ) : (
              <>
                <Calculator className="mr-2 h-4 w-4" />
                Calcular Resultados
              </>
            )}
          </Button>
          <Button className="bg-green-600 hover:bg-green-700" disabled={loading}>
            <Save className="mr-2 h-4 w-4" />
            Guardar y Finalizar
          </Button>
        </div>
      </main>
    </div>
  );
};

export default AnthropometryForm;
