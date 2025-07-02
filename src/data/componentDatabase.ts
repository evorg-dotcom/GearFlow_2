// Comprehensive automotive component database with realistic pricing
export interface ComponentData {
  id: string;
  name: string;
  category: 'engine' | 'transmission' | 'brakes' | 'electrical' | 'suspension' | 'cooling' | 'fuel' | 'exhaust' | 'hvac' | 'steering';
  partNumber?: string;
  priceRange: {
    min: number;
    max: number;
    oem: number;
    aftermarket: number;
  };
  laborHours: {
    min: number;
    max: number;
    difficulty: 'easy' | 'medium' | 'hard' | 'expert';
  };
  symptoms: string[];
  compatibleMakes: string[];
  description: string;
  commonFailureReasons: string[];
  diagnosticCodes?: string[];
  tools: string[];
  warningLevel: 'low' | 'medium' | 'high' | 'critical';
}

export const componentDatabase: ComponentData[] = [
  // Engine Components
  {
    id: 'mass-airflow-sensor',
    name: 'Mass Airflow Sensor (MAF)',
    category: 'engine',
    partNumber: 'MAF-001',
    priceRange: {
      min: 120,
      max: 350,
      oem: 280,
      aftermarket: 150
    },
    laborHours: {
      min: 0.5,
      max: 1.5,
      difficulty: 'easy'
    },
    symptoms: [
      'rough idle',
      'poor acceleration',
      'black smoke',
      'engine hesitation',
      'check engine light',
      'poor fuel economy',
      'engine stalling'
    ],
    compatibleMakes: ['Honda', 'Toyota', 'Ford', 'Chevrolet', 'Nissan', 'BMW', 'Mercedes-Benz', 'Audi'],
    description: 'Measures the amount of air entering the engine to determine proper fuel mixture',
    commonFailureReasons: [
      'Contamination from oil or dirt',
      'Electrical connection issues',
      'Age-related sensor degradation',
      'Aftermarket air filter contamination'
    ],
    diagnosticCodes: ['P0101', 'P0102', 'P0103', 'P0104'],
    tools: ['Basic hand tools', 'MAF cleaner', 'Multimeter'],
    warningLevel: 'medium'
  },
  {
    id: 'oxygen-sensor',
    name: 'Oxygen Sensor (O2 Sensor)',
    category: 'engine',
    partNumber: 'O2S-001',
    priceRange: {
      min: 80,
      max: 250,
      oem: 180,
      aftermarket: 100
    },
    laborHours: {
      min: 0.5,
      max: 2.0,
      difficulty: 'medium'
    },
    symptoms: [
      'poor fuel economy',
      'rough idle',
      'failed emissions test',
      'check engine light',
      'engine hesitation',
      'black exhaust smoke'
    ],
    compatibleMakes: ['Honda', 'Toyota', 'Ford', 'Chevrolet', 'Nissan', 'BMW', 'Mercedes-Benz', 'Audi', 'Volkswagen'],
    description: 'Monitors oxygen levels in exhaust gases to optimize fuel mixture',
    commonFailureReasons: [
      'Carbon buildup from poor fuel quality',
      'Contamination from coolant or oil leaks',
      'Age-related sensor degradation',
      'Physical damage from road debris'
    ],
    diagnosticCodes: ['P0130', 'P0131', 'P0132', 'P0133', 'P0134', 'P0135'],
    tools: ['O2 sensor socket', 'Anti-seize compound', 'Basic hand tools'],
    warningLevel: 'medium'
  },
  {
    id: 'spark-plugs',
    name: 'Spark Plugs',
    category: 'engine',
    partNumber: 'SP-001',
    priceRange: {
      min: 60,
      max: 200,
      oem: 120,
      aftermarket: 80
    },
    laborHours: {
      min: 1.0,
      max: 3.0,
      difficulty: 'medium'
    },
    symptoms: [
      'engine misfire',
      'rough idle',
      'poor acceleration',
      'hard starting',
      'engine knocking',
      'poor fuel economy',
      'check engine light'
    ],
    compatibleMakes: ['Honda', 'Toyota', 'Ford', 'Chevrolet', 'Nissan', 'BMW', 'Mercedes-Benz', 'Audi', 'Volkswagen', 'Subaru'],
    description: 'Ignites the air-fuel mixture in the combustion chamber',
    commonFailureReasons: [
      'Normal wear from high mileage',
      'Carbon buildup',
      'Incorrect gap setting',
      'Poor fuel quality',
      'Oil contamination'
    ],
    diagnosticCodes: ['P0300', 'P0301', 'P0302', 'P0303', 'P0304'],
    tools: ['Spark plug socket', 'Gap gauge', 'Torque wrench', 'Anti-seize compound'],
    warningLevel: 'high'
  },
  {
    id: 'ignition-coil',
    name: 'Ignition Coil',
    category: 'engine',
    partNumber: 'IC-001',
    priceRange: {
      min: 100,
      max: 400,
      oem: 250,
      aftermarket: 150
    },
    laborHours: {
      min: 1.0,
      max: 2.5,
      difficulty: 'medium'
    },
    symptoms: [
      'engine misfire',
      'rough idle',
      'poor acceleration',
      'check engine light',
      'engine stalling',
      'hard starting'
    ],
    compatibleMakes: ['Honda', 'Toyota', 'Ford', 'Chevrolet', 'Nissan', 'BMW', 'Mercedes-Benz', 'Audi'],
    description: 'Transforms battery voltage into high voltage needed to fire spark plugs',
    commonFailureReasons: [
      'Heat and vibration damage',
      'Electrical overload',
      'Age-related insulation breakdown',
      'Moisture infiltration'
    ],
    diagnosticCodes: ['P0351', 'P0352', 'P0353', 'P0354'],
    tools: ['Basic hand tools', 'Multimeter', 'Ignition coil tester'],
    warningLevel: 'high'
  },
  // Brake Components
  {
    id: 'brake-pads',
    name: 'Brake Pads',
    category: 'brakes',
    partNumber: 'BP-001',
    priceRange: {
      min: 80,
      max: 300,
      oem: 180,
      aftermarket: 120
    },
    laborHours: {
      min: 1.0,
      max: 2.0,
      difficulty: 'medium'
    },
    symptoms: [
      'squealing brakes',
      'grinding noise',
      'reduced braking power',
      'brake pedal vibration',
      'longer stopping distance',
      'brake warning light'
    ],
    compatibleMakes: ['Honda', 'Toyota', 'Ford', 'Chevrolet', 'Nissan', 'BMW', 'Mercedes-Benz', 'Audi', 'Volkswagen'],
    description: 'Friction material that presses against brake rotors to stop the vehicle',
    commonFailureReasons: [
      'Normal wear from use',
      'Aggressive driving habits',
      'Contamination from brake fluid',
      'Overheating from heavy braking'
    ],
    diagnosticCodes: [],
    tools: ['C-clamp', 'Basic hand tools', 'Brake cleaner', 'Jack and jack stands'],
    warningLevel: 'critical'
  },
  {
    id: 'brake-rotors',
    name: 'Brake Rotors',
    category: 'brakes',
    partNumber: 'BR-001',
    priceRange: {
      min: 150,
      max: 500,
      oem: 320,
      aftermarket: 200
    },
    laborHours: {
      min: 1.5,
      max: 3.0,
      difficulty: 'medium'
    },
    symptoms: [
      'brake pedal vibration',
      'grinding noise',
      'squealing brakes',
      'reduced braking power',
      'brake pedal pulsation',
      'visible scoring on rotor surface'
    ],
    compatibleMakes: ['Honda', 'Toyota', 'Ford', 'Chevrolet', 'Nissan', 'BMW', 'Mercedes-Benz', 'Audi'],
    description: 'Metal discs that brake pads clamp onto to create friction and stop the vehicle',
    commonFailureReasons: [
      'Warping from overheating',
      'Scoring from worn brake pads',
      'Corrosion from moisture',
      'Normal wear over time'
    ],
    diagnosticCodes: [],
    tools: ['Micrometer', 'Basic hand tools', 'Jack and jack stands', 'Brake cleaner'],
    warningLevel: 'critical'
  },
  // Transmission Components
  {
    id: 'transmission-fluid',
    name: 'Transmission Fluid',
    category: 'transmission',
    partNumber: 'TF-001',
    priceRange: {
      min: 80,
      max: 200,
      oem: 140,
      aftermarket: 100
    },
    laborHours: {
      min: 1.0,
      max: 2.0,
      difficulty: 'easy'
    },
    symptoms: [
      'rough shifting',
      'slipping transmission',
      'delayed engagement',
      'transmission overheating',
      'burnt smell',
      'red fluid leaks'
    ],
    compatibleMakes: ['Honda', 'Toyota', 'Ford', 'Chevrolet', 'Nissan', 'BMW', 'Mercedes-Benz', 'Audi'],
    description: 'Hydraulic fluid that lubricates and cools transmission components',
    commonFailureReasons: [
      'Normal degradation over time',
      'Contamination from metal particles',
      'Overheating damage',
      'Seal leaks causing low fluid'
    ],
    diagnosticCodes: ['P0868', 'P0842', 'P0841'],
    tools: ['Transmission funnel', 'Drain pan', 'Basic hand tools'],
    warningLevel: 'high'
  },
  // Cooling System Components
  {
    id: 'thermostat',
    name: 'Engine Thermostat',
    category: 'cooling',
    partNumber: 'THERM-001',
    priceRange: {
      min: 25,
      max: 80,
      oem: 50,
      aftermarket: 35
    },
    laborHours: {
      min: 1.5,
      max: 3.0,
      difficulty: 'medium'
    },
    symptoms: [
      'engine overheating',
      'engine running cold',
      'poor heater performance',
      'coolant leaks',
      'temperature gauge fluctuation'
    ],
    compatibleMakes: ['Honda', 'Toyota', 'Ford', 'Chevrolet', 'Nissan', 'BMW', 'Mercedes-Benz'],
    description: 'Regulates coolant flow to maintain optimal engine temperature',
    commonFailureReasons: [
      'Corrosion from old coolant',
      'Mechanical failure of spring mechanism',
      'Debris blocking operation',
      'Age-related seal deterioration'
    ],
    diagnosticCodes: ['P0128', 'P0126'],
    tools: ['Basic hand tools', 'Drain pan', 'Coolant', 'Gasket scraper'],
    warningLevel: 'critical'
  },
  {
    id: 'water-pump',
    name: 'Water Pump',
    category: 'cooling',
    partNumber: 'WP-001',
    priceRange: {
      min: 150,
      max: 500,
      oem: 320,
      aftermarket: 220
    },
    laborHours: {
      min: 3.0,
      max: 6.0,
      difficulty: 'hard'
    },
    symptoms: [
      'engine overheating',
      'coolant leaks',
      'whining noise from engine',
      'steam from engine bay',
      'sweet smell from coolant'
    ],
    compatibleMakes: ['Honda', 'Toyota', 'Ford', 'Chevrolet', 'Nissan', 'BMW', 'Mercedes-Benz'],
    description: 'Circulates coolant through the engine and radiator',
    commonFailureReasons: [
      'Bearing wear from age',
      'Seal failure causing leaks',
      'Impeller corrosion',
      'Contaminated coolant damage'
    ],
    diagnosticCodes: ['P0128', 'P0217'],
    tools: ['Timing belt tools', 'Coolant', 'Basic hand tools', 'Torque wrench'],
    warningLevel: 'critical'
  },
  // Electrical Components
  {
    id: 'alternator',
    name: 'Alternator',
    category: 'electrical',
    partNumber: 'ALT-001',
    priceRange: {
      min: 200,
      max: 600,
      oem: 450,
      aftermarket: 300
    },
    laborHours: {
      min: 2.0,
      max: 4.0,
      difficulty: 'medium'
    },
    symptoms: [
      'battery warning light',
      'dim headlights',
      'electrical issues',
      'battery not charging',
      'whining noise',
      'dead battery'
    ],
    compatibleMakes: ['Honda', 'Toyota', 'Ford', 'Chevrolet', 'Nissan', 'BMW', 'Mercedes-Benz'],
    description: 'Generates electrical power to charge battery and run electrical systems',
    commonFailureReasons: [
      'Bearing wear from age',
      'Brush wear in rotor',
      'Diode failure',
      'Voltage regulator failure'
    ],
    diagnosticCodes: ['P0622', 'P0621', 'P0620'],
    tools: ['Multimeter', 'Basic hand tools', 'Belt tension gauge'],
    warningLevel: 'high'
  },
  {
    id: 'starter',
    name: 'Starter Motor',
    category: 'electrical',
    partNumber: 'START-001',
    priceRange: {
      min: 150,
      max: 450,
      oem: 320,
      aftermarket: 220
    },
    laborHours: {
      min: 1.5,
      max: 3.5,
      difficulty: 'medium'
    },
    symptoms: [
      'engine won\'t start',
      'clicking noise when starting',
      'grinding noise',
      'intermittent starting issues',
      'slow cranking'
    ],
    compatibleMakes: ['Honda', 'Toyota', 'Ford', 'Chevrolet', 'Nissan', 'BMW', 'Mercedes-Benz'],
    description: 'Electric motor that cranks the engine to start it',
    commonFailureReasons: [
      'Solenoid contact wear',
      'Brush wear in motor',
      'Bendix drive failure',
      'Heat damage from engine bay'
    ],
    diagnosticCodes: [],
    tools: ['Basic hand tools', 'Multimeter', 'Jack and jack stands'],
    warningLevel: 'high'
  },
  // Fuel System Components
  {
    id: 'fuel-pump',
    name: 'Fuel Pump',
    category: 'fuel',
    partNumber: 'FP-001',
    priceRange: {
      min: 200,
      max: 600,
      oem: 450,
      aftermarket: 300
    },
    laborHours: {
      min: 2.0,
      max: 5.0,
      difficulty: 'hard'
    },
    symptoms: [
      'engine won\'t start',
      'engine stalling',
      'loss of power',
      'whining noise from tank',
      'poor acceleration',
      'engine sputtering'
    ],
    compatibleMakes: ['Honda', 'Toyota', 'Ford', 'Chevrolet', 'Nissan', 'BMW', 'Mercedes-Benz'],
    description: 'Delivers fuel from tank to engine at proper pressure',
    commonFailureReasons: [
      'Contaminated fuel damage',
      'Running on low fuel frequently',
      'Electrical connection issues',
      'Age-related motor wear'
    ],
    diagnosticCodes: ['P0230', 'P0231', 'P0232'],
    tools: ['Fuel pressure gauge', 'Basic hand tools', 'Fuel line tools'],
    warningLevel: 'high'
  },
  {
    id: 'fuel-filter',
    name: 'Fuel Filter',
    category: 'fuel',
    partNumber: 'FF-001',
    priceRange: {
      min: 20,
      max: 80,
      oem: 45,
      aftermarket: 30
    },
    laborHours: {
      min: 0.5,
      max: 1.5,
      difficulty: 'easy'
    },
    symptoms: [
      'poor acceleration',
      'engine hesitation',
      'hard starting',
      'engine stalling',
      'reduced fuel economy'
    ],
    compatibleMakes: ['Honda', 'Toyota', 'Ford', 'Chevrolet', 'Nissan', 'BMW', 'Mercedes-Benz'],
    description: 'Filters contaminants from fuel before reaching engine',
    commonFailureReasons: [
      'Clogging from fuel contaminants',
      'Normal wear over time',
      'Poor fuel quality',
      'Water contamination'
    ],
    diagnosticCodes: ['P0171', 'P0174'],
    tools: ['Fuel line tools', 'Basic hand tools', 'Drain pan'],
    warningLevel: 'medium'
  }
];

// Helper functions for component matching
export class ComponentMatcher {
  static findComponentsBySymptoms(symptoms: string[]): ComponentData[] {
    const normalizedSymptoms = symptoms.map(s => s.toLowerCase());
    
    return componentDatabase.filter(component => {
      return component.symptoms.some(symptom => 
        normalizedSymptoms.some(userSymptom => 
          userSymptom.includes(symptom.toLowerCase()) || 
          symptom.toLowerCase().includes(userSymptom)
        )
      );
    }).sort((a, b) => {
      // Sort by warning level (critical first) and then by price
      const warningOrder = { critical: 4, high: 3, medium: 2, low: 1 };
      const aWarning = warningOrder[a.warningLevel];
      const bWarning = warningOrder[b.warningLevel];
      
      if (aWarning !== bWarning) {
        return bWarning - aWarning;
      }
      
      return a.priceRange.min - b.priceRange.min;
    });
  }

  static findComponentsByDiagnosticCodes(codes: string[]): ComponentData[] {
    return componentDatabase.filter(component => 
      component.diagnosticCodes && 
      component.diagnosticCodes.some(code => codes.includes(code))
    );
  }

  static findComponentsByMake(make: string): ComponentData[] {
    return componentDatabase.filter(component => 
      component.compatibleMakes.some(compatibleMake => 
        compatibleMake.toLowerCase() === make.toLowerCase()
      )
    );
  }

  static calculateTotalRepairCost(components: ComponentData[], laborRate: number = 120): {
    partsMin: number;
    partsMax: number;
    laborMin: number;
    laborMax: number;
    totalMin: number;
    totalMax: number;
  } {
    const partsMin = components.reduce((sum, comp) => sum + comp.priceRange.min, 0);
    const partsMax = components.reduce((sum, comp) => sum + comp.priceRange.max, 0);
    const laborMin = components.reduce((sum, comp) => sum + (comp.laborHours.min * laborRate), 0);
    const laborMax = components.reduce((sum, comp) => sum + (comp.laborHours.max * laborRate), 0);

    return {
      partsMin,
      partsMax,
      laborMin,
      laborMax,
      totalMin: partsMin + laborMin,
      totalMax: partsMax + laborMax
    };
  }

  static getComponentsByCategory(category: ComponentData['category']): ComponentData[] {
    return componentDatabase.filter(component => component.category === category);
  }

  static searchComponents(query: string): ComponentData[] {
    const normalizedQuery = query.toLowerCase();
    
    return componentDatabase.filter(component => 
      component.name.toLowerCase().includes(normalizedQuery) ||
      component.description.toLowerCase().includes(normalizedQuery) ||
      component.symptoms.some(symptom => symptom.toLowerCase().includes(normalizedQuery)) ||
      component.commonFailureReasons.some(reason => reason.toLowerCase().includes(normalizedQuery))
    );
  }
}