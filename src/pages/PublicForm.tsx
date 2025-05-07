
import { useState } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/ui/use-toast";

const PublicForm = () => {
  const { formId } = useParams();
  const [formStep, setFormStep] = useState(0);
  const [formData, setFormData] = useState({
    name: "",
    documentType: "",
    documentId: "",
    age: "",
    gender: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    healthInsurance: "",
    emergencyContactName: "",
    emergencyContactPhone: "",
    medicalConditions: "",
    allergies: "",
    medications: "",
    previousInjuries: "",
    surgeries: "",
    familyMedicalHistory: "",
    exerciseFrequency: "",
    exerciseType: "",
    termsAccepted: false
  });
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleRadioChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData({ ...formData, [name]: checked });
  };

  const handleNextStep = () => {
    if (formStep < 3) {
      setFormStep(formStep + 1);
      window.scrollTo(0, 0);
    }
  };

  const handlePreviousStep = () => {
    if (formStep > 0) {
      setFormStep(formStep - 1);
      window.scrollTo(0, 0);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.termsAccepted) {
      toast({
        variant: "destructive",
        title: "Error de validación",
        description: "Debes aceptar los términos y condiciones para continuar."
      });
      return;
    }
    
    // Submit form (would normally send to server)
    toast({
      title: "Formulario enviado",
      description: "Tu información ha sido registrada exitosamente. Gracias por completar el formulario."
    });
    
    // Reset form after submission
    setFormStep(0);
    setFormData({
      name: "",
      documentType: "",
      documentId: "",
      age: "",
      gender: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      healthInsurance: "",
      emergencyContactName: "",
      emergencyContactPhone: "",
      medicalConditions: "",
      allergies: "",
      medications: "",
      previousInjuries: "",
      surgeries: "",
      familyMedicalHistory: "",
      exerciseFrequency: "",
      exerciseType: "",
      termsAccepted: false
    });
  };

  // Define form steps
  const steps = [
    {
      title: "Información Personal",
      description: "Introduce tus datos personales"
    },
    {
      title: "Información de Contacto",
      description: "Introduce tu información de contacto"
    },
    {
      title: "Historia Médica",
      description: "Información sobre tu historial médico"
    },
    {
      title: "Actividad Física",
      description: "Información sobre tus actividades físicas"
    }
  ];

  const getStepContent = () => {
    switch (formStep) {
      case 0:
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div>
                <Label htmlFor="name">Nombre Completo</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Ej. Juan Pérez Gómez"
                  required
                />
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="documentType">Tipo de Documento</Label>
                  <Select 
                    value={formData.documentType}
                    onValueChange={(value) => handleSelectChange("documentType", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cc">Cédula de Ciudadanía</SelectItem>
                      <SelectItem value="ti">Tarjeta de Identidad</SelectItem>
                      <SelectItem value="passport">Pasaporte</SelectItem>
                      <SelectItem value="ce">Cédula de Extranjería</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="documentId">Número de Documento</Label>
                  <Input
                    id="documentId"
                    name="documentId"
                    value={formData.documentId}
                    onChange={handleInputChange}
                    placeholder="Ej. 1234567890"
                    required
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="age">Edad</Label>
                  <Input
                    id="age"
                    name="age"
                    type="number"
                    min="0"
                    max="120"
                    value={formData.age}
                    onChange={handleInputChange}
                    placeholder="Ej. 30"
                    required
                  />
                </div>
                <div>
                  <Label>Género</Label>
                  <RadioGroup 
                    value={formData.gender}
                    onValueChange={(value) => handleRadioChange("gender", value)}
                    className="flex space-x-4 pt-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="male" id="male" />
                      <Label htmlFor="male">Masculino</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="female" id="female" />
                      <Label htmlFor="female">Femenino</Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>
            </div>
          </div>
        );
      case 1:
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="email">Correo Electrónico</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Ej. correo@ejemplo.com"
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Teléfono</Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="Ej. 3001234567"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="address">Dirección</Label>
                <Input
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="Ej. Calle 123 # 45-67"
                />
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="city">Ciudad</Label>
                  <Input
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    placeholder="Ej. Bogotá"
                  />
                </div>
                <div>
                  <Label htmlFor="healthInsurance">EPS</Label>
                  <Input
                    id="healthInsurance"
                    name="healthInsurance"
                    value={formData.healthInsurance}
                    onChange={handleInputChange}
                    placeholder="Ej. Nueva EPS"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="emergencyContactName">Contacto de Emergencia</Label>
                  <Input
                    id="emergencyContactName"
                    name="emergencyContactName"
                    value={formData.emergencyContactName}
                    onChange={handleInputChange}
                    placeholder="Ej. Maria Gómez"
                  />
                </div>
                <div>
                  <Label htmlFor="emergencyContactPhone">Teléfono de Emergencia</Label>
                  <Input
                    id="emergencyContactPhone"
                    name="emergencyContactPhone"
                    value={formData.emergencyContactPhone}
                    onChange={handleInputChange}
                    placeholder="Ej. 3109876543"
                  />
                </div>
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="medicalConditions">Condiciones Médicas</Label>
              <Textarea
                id="medicalConditions"
                name="medicalConditions"
                value={formData.medicalConditions}
                onChange={handleInputChange}
                placeholder="Describe cualquier condición médica que tengas (hipertensión, diabetes, etc.)"
              />
            </div>
            
            <div>
              <Label htmlFor="allergies">Alergias</Label>
              <Textarea
                id="allergies"
                name="allergies"
                value={formData.allergies}
                onChange={handleInputChange}
                placeholder="Describe cualquier alergia que tengas (medicamentos, alimentos, etc.)"
              />
            </div>
            
            <div>
              <Label htmlFor="medications">Medicamentos</Label>
              <Textarea
                id="medications"
                name="medications"
                value={formData.medications}
                onChange={handleInputChange}
                placeholder="Medicamentos que estás tomando actualmente"
              />
            </div>
            
            <div>
              <Label htmlFor="previousInjuries">Lesiones Previas</Label>
              <Textarea
                id="previousInjuries"
                name="previousInjuries"
                value={formData.previousInjuries}
                onChange={handleInputChange}
                placeholder="Describe cualquier lesión que hayas tenido (fracturas, esguinces, etc.)"
              />
            </div>
            
            <div>
              <Label htmlFor="surgeries">Cirugías</Label>
              <Textarea
                id="surgeries"
                name="surgeries"
                value={formData.surgeries}
                onChange={handleInputChange}
                placeholder="Cirugías que hayas tenido y sus fechas aproximadas"
              />
            </div>
            
            <div>
              <Label htmlFor="familyMedicalHistory">Historial Médico Familiar</Label>
              <Textarea
                id="familyMedicalHistory"
                name="familyMedicalHistory"
                value={formData.familyMedicalHistory}
                onChange={handleInputChange}
                placeholder="Historial de enfermedades significativas en tu familia"
              />
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-4">
            <div>
              <Label>Frecuencia de Actividad Física</Label>
              <RadioGroup 
                value={formData.exerciseFrequency}
                onValueChange={(value) => handleRadioChange("exerciseFrequency", value)}
                className="flex flex-col space-y-2 pt-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="never" id="never" />
                  <Label htmlFor="never">Nunca</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="rarely" id="rarely" />
                  <Label htmlFor="rarely">Raramente (1-2 veces al mes)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="sometimes" id="sometimes" />
                  <Label htmlFor="sometimes">A veces (1-2 veces por semana)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="regularly" id="regularly" />
                  <Label htmlFor="regularly">Regularmente (3-5 veces por semana)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="daily" id="daily" />
                  <Label htmlFor="daily">Diariamente</Label>
                </div>
              </RadioGroup>
            </div>
            
            <div>
              <Label htmlFor="exerciseType">Tipo de Actividad Física</Label>
              <Textarea
                id="exerciseType"
                name="exerciseType"
                value={formData.exerciseType}
                onChange={handleInputChange}
                placeholder="Describe que tipo de actividad física realizas (caminar, correr, nadar, etc.)"
              />
            </div>
            
            <div className="pt-4">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="termsAccepted"
                  checked={formData.termsAccepted}
                  onCheckedChange={(checked) => 
                    handleCheckboxChange("termsAccepted", checked as boolean)
                  }
                />
                <Label htmlFor="termsAccepted" className="text-sm">
                  Acepto los términos y condiciones y autorizo el procesamiento de mis datos personales para fines relacionados con las pruebas físicas y antropométricas.
                </Label>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-lerm-50 to-lerm-100 flex items-center justify-center p-4 py-8">
      <div className="container max-w-3xl">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-lerm-700">LERM</h1>
          <p className="text-gray-600">Laboratorio de Evaluación y Rehabilitación Musculoesquelética</p>
        </div>
        
        <Card className="border-t-4 border-t-lerm-500">
          <CardHeader>
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
              <div>
                <CardTitle className="text-xl">{steps[formStep].title}</CardTitle>
                <CardDescription>{steps[formStep].description}</CardDescription>
              </div>
              
              <div className="flex items-center space-x-1">
                {steps.map((_, index) => (
                  <div 
                    key={index} 
                    className={`h-2 w-8 rounded-full transition-all ${
                      index === formStep 
                        ? 'bg-lerm-500' 
                        : index < formStep 
                          ? 'bg-lerm-300' 
                          : 'bg-gray-200'
                    }`}
                  />
                ))}
              </div>
            </div>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit}>
              {getStepContent()}
            </form>
          </CardContent>
          
          <CardFooter className="flex justify-between">
            <Button
              variant="outline"
              onClick={handlePreviousStep}
              disabled={formStep === 0}
            >
              Anterior
            </Button>
            
            {formStep === steps.length - 1 ? (
              <Button onClick={handleSubmit}>
                Enviar Formulario
              </Button>
            ) : (
              <Button onClick={handleNextStep}>
                Siguiente
              </Button>
            )}
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default PublicForm;
