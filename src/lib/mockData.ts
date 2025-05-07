
export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: 'male' | 'female';
  documentId: string;
  formSubmissionDate: string;
  formType: string;
  isEnabled: boolean;
  isEvaluated: boolean;
  formData: {
    height: number;
    weight: number;
    [key: string]: any;
  };
  anthropometryResults?: AnthropometryResults;
}

export interface AnthropometryResults {
  bmi?: number;
  liviIndex?: number;
  rohrerIndex?: number;
  ponderalIndex?: number;
  bouchardIndex?: number;
  pignetIndex?: number;
  whr?: number; // Waist-Hip Ratio
  wci?: number; // Waist Circumference Index
  sudi?: number; // Sagittal Umbilical Diameter Index
  waistHeightRatio?: number;
  bfdi?: number; // Body Fat Distribution Index
  conicityIndex?: number;
  cormicIndex?: number;
  acromioIliacIndex?: number;
  brachialIndex?: number;
  rull?: number; // Relative Upper Limb Length
  manouvrierIndex?: number;
  rlll?: number; // Relative Lower Limb Length
  cruralIndex?: number;
  bodyComposition?: {
    fatMass?: number;
    boneMass?: number;
    skeletalMuscleMass?: number;
  };
  bodyDensity?: number;
  muscleMass?: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'evaluator' | 'assistant';
  createdAt: string;
}

// Mock patients data
export const mockPatients: Patient[] = [
  {
    id: "1",
    name: "Juan Pérez",
    age: 25,
    gender: "male",
    documentId: "1065432198",
    formSubmissionDate: "2025-05-02",
    formType: "Adulto",
    isEnabled: true,
    isEvaluated: false,
    formData: {
      height: 175,
      weight: 70,
      medicalConditions: "Ninguna",
      allergies: "Ninguna",
      previousInjuries: "Esguince de tobillo en 2022"
    }
  },
  {
    id: "2",
    name: "María López",
    age: 30,
    gender: "female",
    documentId: "1065987654",
    formSubmissionDate: "2025-05-03",
    formType: "Adulto",
    isEnabled: false,
    isEvaluated: false,
    formData: {
      height: 165,
      weight: 58,
      medicalConditions: "Asma leve",
      allergies: "Polen",
      previousInjuries: "Ninguna"
    }
  },
  {
    id: "3",
    name: "Carlos Rodríguez",
    age: 22,
    gender: "male",
    documentId: "1098765432",
    formSubmissionDate: "2025-05-01",
    formType: "Deportista",
    isEnabled: true,
    isEvaluated: false,
    formData: {
      height: 182,
      weight: 75,
      medicalConditions: "Ninguna",
      allergies: "Ninguna",
      previousInjuries: "Tendinitis en el hombro derecho"
    }
  },
  {
    id: "4",
    name: "Ana Martínez",
    age: 40,
    gender: "female",
    documentId: "1045678912",
    formSubmissionDate: "2025-04-30",
    formType: "Adulto",
    isEnabled: false,
    isEvaluated: true,
    formData: {
      height: 160,
      weight: 62,
      medicalConditions: "Hipertensión controlada",
      allergies: "Penicilina",
      previousInjuries: "Fractura de muñeca en 2019"
    },
    anthropometryResults: {
      bmi: 24.2,
      liviIndex: 2.34,
      rohrerIndex: 15.12,
      ponderalIndex: 41.54,
      waistHeightRatio: 0.48
    }
  },
  {
    id: "5",
    name: "Pedro Gómez",
    age: 17,
    gender: "male",
    documentId: "1102345678",
    formSubmissionDate: "2025-05-04",
    formType: "Adolescente",
    isEnabled: true,
    isEvaluated: false,
    formData: {
      height: 173,
      weight: 65,
      medicalConditions: "Ninguna",
      allergies: "Mariscos",
      previousInjuries: "Ninguna"
    }
  }
];

// Mock users data
export const mockUsers: User[] = [
  {
    id: "1",
    name: "Administrador",
    email: "Admin@cecar.edu.co",
    role: "admin",
    createdAt: "2024-01-01"
  },
  {
    id: "2",
    name: "José Evaluador",
    email: "Evaluador@cecar.edu.co",
    role: "evaluator",
    createdAt: "2024-01-15"
  },
  {
    id: "3",
    name: "María Asistente",
    email: "Asistente@cecar.edu.co",
    role: "assistant",
    createdAt: "2024-01-20"
  }
];

// Helper function to get patient by ID
export const getPatientById = (id: string): Patient | undefined => {
  return mockPatients.find(patient => patient.id === id);
};

// Helper function to get patients for assistant (only enabled ones)
export const getPatientsForAssistant = (): Patient[] => {
  return mockPatients.filter(patient => patient.isEnabled && !patient.isEvaluated);
};

// Helper function to get patients for evaluator
export const getPatientsForEvaluator = (): Patient[] => {
  return mockPatients.filter(patient => !patient.isEvaluated);
};

// Helper function to get evaluated patients
export const getEvaluatedPatients = (): Patient[] => {
  return mockPatients.filter(patient => patient.isEvaluated);
};
