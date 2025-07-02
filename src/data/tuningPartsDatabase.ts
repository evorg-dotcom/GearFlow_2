// Comprehensive Automotive Tuning Parts Database
export interface TuningPart {
  id: string;
  name: string;
  category: string;
  make: string;
  model: string;
  year: number;
  price: number;
  originalPrice?: number;
  description: string;
  detailedDescription: string;
  performanceGain: string;
  difficulty: 'easy' | 'medium' | 'hard' | 'expert';
  rating: number;
  reviews: number;
  imageUrl: string;
  additionalImages: string[];
  inStock: boolean;
  brand: string;
  installTime: string;
  partNumber?: string;
  warranty?: string;
  isPopular?: boolean;
  isBestSeller?: boolean;
  specifications: Record<string, string>;
  compatibility: string[];
  installation: {
    tools: string[];
    steps: string[];
    tips: string[];
  };
  reviews_data: Array<{
    author: string;
    rating: number;
    date: string;
    title: string;
    content: string;
    verified: boolean;
  }>;
  certifications: string[];
  shipping: {
    weight: string;
    dimensions: string;
    freeShipping: boolean;
    estimatedDays: string;
  };
  safetyNotes?: string[];
  technicalDocs?: Array<{
    title: string;
    type: 'manual' | 'guide' | 'spec_sheet' | 'installation';
    url: string;
  }>;
}

export const tuningPartsDatabase: TuningPart[] = [
  // ENGINE PERFORMANCE - INTAKE SYSTEMS
  {
    id: 'eng-001',
    name: 'K&N 57-3510 FIPK Cold Air Intake System',
    category: 'intake',
    make: 'Honda',
    model: 'Civic Si',
    year: 2020,
    price: 299,
    originalPrice: 349,
    description: 'High-flow cold air intake system with washable filter. Increases horsepower and improves throttle response.',
    detailedDescription: 'The K&N 57-3510 FIPK (Fuel Injection Performance Kit) is engineered to dramatically reduce air flow restriction while smoothing and straightening air flow. This allows your engine to inhale a larger volume of air than the OEM air filter assembly. The oversized conical air filter can be used for up to 100,000 miles before service is required.',
    performanceGain: '+15-20 HP, +18 lb-ft',
    difficulty: 'easy',
    rating: 4.8,
    reviews: 156,
    imageUrl: 'https://images.pexels.com/photos/3806288/pexels-photo-3806288.jpeg?auto=compress&cs=tinysrgb&w=400',
    additionalImages: [
      'https://images.pexels.com/photos/3806288/pexels-photo-3806288.jpeg?auto=compress&cs=tinysrgb&w=400',
      'https://images.pexels.com/photos/3806288/pexels-photo-3806288.jpeg?auto=compress&cs=tinysrgb&w=400'
    ],
    inStock: true,
    brand: 'K&N',
    installTime: '1-2 hours',
    partNumber: '57-3510',
    warranty: 'Million Mile Limited Warranty',
    isPopular: true,
    specifications: {
      'Filter Type': 'Reusable Cotton Gauze',
      'Filter Shape': 'Conical',
      'Inlet Diameter': '3.5 inches',
      'Filter Height': '9 inches',
      'Material': 'Aluminum Tube',
      'Finish': 'Powder Coated',
      'Weight': '4.2 lbs',
      'CARB Legal': 'Yes (EO D-269-39)'
    },
    compatibility: [
      '2017-2021 Honda Civic Si 1.5L Turbo',
      '2017-2021 Honda Civic Type R 2.0L Turbo',
      '2019-2021 Honda Civic Hatchback Sport 1.5L Turbo'
    ],
    installation: {
      tools: ['Phillips screwdriver', 'Flathead screwdriver', '8mm socket', '10mm socket', 'Ratchet'],
      steps: [
        'Remove the engine cover by lifting up',
        'Disconnect the mass air flow sensor electrical connector',
        'Loosen the hose clamp at the throttle body',
        'Remove the air box assembly',
        'Install the new K&N intake tube',
        'Connect the mass air flow sensor to the new intake',
        'Secure all connections and test fit'
      ],
      tips: [
        'Take photos before disassembly for reference',
        'Clean the throttle body while you have access',
        'Allow engine to cool before installation',
        'Double-check all connections before starting engine'
      ]
    },
    reviews_data: [
      {
        author: 'Mike_Si_2020',
        rating: 5,
        date: '2024-01-15',
        title: 'Amazing sound and noticeable power gain!',
        content: 'Installed this on my 2020 Civic Si and the difference is immediately noticeable. The turbo spool sound is incredible and I can feel the extra power.',
        verified: true
      }
    ],
    certifications: ['CARB Legal', 'ISO 9001:2015', '50-State Legal'],
    shipping: {
      weight: '4.2 lbs',
      dimensions: '24" x 12" x 8"',
      freeShipping: true,
      estimatedDays: '2-3 business days'
    },
    safetyNotes: [
      'Ensure engine is cool before installation',
      'Do not over-tighten clamps to avoid damage',
      'Check all connections after installation'
    ],
    technicalDocs: [
      {
        title: 'Installation Manual',
        type: 'manual',
        url: '#'
      },
      {
        title: 'Performance Data Sheet',
        type: 'spec_sheet',
        url: '#'
      }
    ]
  },

  {
    id: 'eng-002',
    name: 'AEM 21-8034DC Brute Force Cold Air Intake',
    category: 'intake',
    make: 'Ford',
    model: 'Mustang GT',
    year: 2019,
    price: 389,
    originalPrice: 449,
    description: 'Dyno-tested cold air intake system with heat shield and high-flow filter for maximum performance gains.',
    detailedDescription: 'The AEM Brute Force intake system moves the filter outside of the engine compartment for cooler air and improved performance. Features a mandrel-bent aluminum intake tube and washable synthetic filter.',
    performanceGain: '+18-25 HP, +22 lb-ft',
    difficulty: 'medium',
    rating: 4.7,
    reviews: 89,
    imageUrl: 'https://images.pexels.com/photos/3806288/pexels-photo-3806288.jpeg?auto=compress&cs=tinysrgb&w=400',
    additionalImages: [
      'https://images.pexels.com/photos/3806288/pexels-photo-3806288.jpeg?auto=compress&cs=tinysrgb&w=400'
    ],
    inStock: true,
    brand: 'AEM',
    installTime: '2-3 hours',
    partNumber: '21-8034DC',
    warranty: 'Limited Lifetime Warranty',
    specifications: {
      'Filter Type': 'Dryflow Synthetic',
      'Tube Material': 'Mandrel-bent Aluminum',
      'Heat Shield': 'Included',
      'Filter Size': '9" x 6"',
      'Inlet Size': '4 inches',
      'CARB Legal': 'Yes (EO D-670-2)'
    },
    compatibility: [
      '2018-2023 Ford Mustang GT 5.0L V8',
      '2020-2023 Ford Mustang Mach 1 5.0L V8'
    ],
    installation: {
      tools: ['Socket set', 'Screwdriver set', 'Pliers', 'Heat gun (optional)'],
      steps: [
        'Remove factory air box and intake tube',
        'Install heat shield in fender well',
        'Mount filter in heat shield',
        'Install intake tube and connect to throttle body',
        'Secure all clamps and connections'
      ],
      tips: [
        'Use heat gun to warm tube for easier installation',
        'Apply dielectric grease to electrical connections',
        'Check clearances before final tightening'
      ]
    },
    reviews_data: [
      {
        author: 'MustangGT_Owner',
        rating: 5,
        date: '2024-01-20',
        title: 'Excellent build quality and performance',
        content: 'The AEM intake is very well made and the performance gains are noticeable. Installation was straightforward.',
        verified: true
      }
    ],
    certifications: ['CARB Legal', 'ISO 9001:2015'],
    shipping: {
      weight: '8.5 lbs',
      dimensions: '28" x 16" x 10"',
      freeShipping: true,
      estimatedDays: '3-5 business days'
    }
  },

  {
    id: 'eng-003',
    name: 'Mishimoto Performance Air Intake System',
    category: 'intake',
    make: 'Subaru',
    model: 'WRX',
    year: 2021,
    price: 349,
    originalPrice: 399,
    description: 'Aluminum intake pipe with heat shield and high-flow oiled filter for maximum airflow and performance.',
    detailedDescription: 'The Mishimoto Performance Air Intake features a polished aluminum intake pipe, heat-resistant silicone couplers, and a washable oiled filter. Designed to improve throttle response and provide a more aggressive engine sound.',
    performanceGain: '+15-18 HP, +12-15 lb-ft',
    difficulty: 'easy',
    rating: 4.6,
    reviews: 112,
    imageUrl: 'https://images.pexels.com/photos/3806288/pexels-photo-3806288.jpeg?auto=compress&cs=tinysrgb&w=400',
    additionalImages: [
      'https://images.pexels.com/photos/3806288/pexels-photo-3806288.jpeg?auto=compress&cs=tinysrgb&w=400'
    ],
    inStock: true,
    brand: 'Mishimoto',
    installTime: '1-2 hours',
    partNumber: 'MMAI-WRX-15WBK',
    warranty: 'Lifetime Warranty',
    specifications: {
      'Filter Type': 'Oiled Cotton Gauze',
      'Pipe Material': 'Polished Aluminum',
      'Coupler Material': 'Silicone',
      'Heat Shield': 'Included',
      'Filter Size': '6" x 5"',
      'CARB Status': 'Pending'
    },
    compatibility: [
      '2015-2021 Subaru WRX 2.0L',
      '2014-2018 Subaru Forester XT 2.0L'
    ],
    installation: {
      tools: ['10mm socket', '12mm socket', 'Phillips screwdriver', 'Pliers'],
      steps: [
        'Remove factory intake system',
        'Install Mishimoto heat shield',
        'Mount air filter to intake pipe',
        'Install intake pipe assembly',
        'Connect MAF sensor and secure all clamps'
      ],
      tips: [
        'Clean MAF sensor with appropriate cleaner',
        'Don\'t overtighten plastic components',
        'Check for vacuum leaks after installation'
      ]
    },
    reviews_data: [
      {
        author: 'WRX_Driver',
        rating: 5,
        date: '2024-02-05',
        title: 'Great sound and performance',
        content: 'The turbo spool sound is amazing and throttle response is noticeably improved. Easy installation too.',
        verified: true
      }
    ],
    certifications: ['ISO 9001:2015'],
    shipping: {
      weight: '7.5 lbs',
      dimensions: '26" x 14" x 9"',
      freeShipping: true,
      estimatedDays: '2-4 business days'
    }
  },

  // ENGINE PERFORMANCE - EXHAUST SYSTEMS
  {
    id: 'exh-001',
    name: 'Borla ATAK Cat-Back Exhaust System',
    category: 'exhaust',
    make: 'Ford',
    model: 'Mustang GT',
    year: 2019,
    price: 1299,
    originalPrice: 1499,
    description: 'Aggressive ATAK sound technology with T-304 stainless steel construction for maximum performance and sound.',
    detailedDescription: 'The Borla ATAK (Acoustically-Tuned Applied Kinetics) exhaust system represents the most aggressive sound in the Borla lineup. Features patented straight-through and multi-core technology to unleash hidden horsepower.',
    performanceGain: '+25-30 HP, +28 lb-ft',
    difficulty: 'medium',
    rating: 4.9,
    reviews: 234,
    imageUrl: 'https://images.pexels.com/photos/3806288/pexels-photo-3806288.jpeg?auto=compress&cs=tinysrgb&w=400',
    additionalImages: [
      'https://images.pexels.com/photos/3806288/pexels-photo-3806288.jpeg?auto=compress&cs=tinysrgb&w=400'
    ],
    inStock: true,
    brand: 'Borla',
    installTime: '3-4 hours',
    partNumber: '140679',
    warranty: 'Million Mile Warranty',
    isPopular: true,
    specifications: {
      'Material': 'T-304 Stainless Steel',
      'Tip Style': 'Dual 4.25" Round',
      'Tip Finish': 'Polished',
      'Sound Level': 'Aggressive (ATAK)',
      'Pipe Diameter': '3.0 inches',
      'Weight': '42 lbs',
      'Emissions': '50-State Legal'
    },
    compatibility: [
      '2018-2023 Ford Mustang GT 5.0L V8',
      '2020-2023 Ford Mustang Mach 1 5.0L V8'
    ],
    installation: {
      tools: ['Jack and jack stands', '15mm socket', '13mm socket', 'Penetrating oil', 'Safety glasses'],
      steps: [
        'Raise vehicle and secure on jack stands',
        'Apply penetrating oil to exhaust clamps',
        'Remove factory exhaust from catalytic converters back',
        'Install new Borla muffler assembly',
        'Connect tailpipe sections',
        'Align system and tighten all clamps'
      ],
      tips: [
        'Use penetrating oil 24 hours before installation',
        'Have a helper to support heavy sections',
        'Check for proper ground clearance'
      ]
    },
    reviews_data: [
      {
        author: 'V8_Enthusiast',
        rating: 5,
        date: '2024-01-18',
        title: 'Worth every penny',
        content: 'The build quality is exceptional. Sound is perfect - aggressive when you want it, civilized during cruising.',
        verified: true
      }
    ],
    certifications: ['50-State Legal', 'ISO 9001:2015', 'Made in USA'],
    shipping: {
      weight: '42 lbs',
      dimensions: '48" x 24" x 12"',
      freeShipping: true,
      estimatedDays: '3-5 business days'
    }
  },

  {
    id: 'exh-002',
    name: 'Akrapovič Evolution Line Titanium Exhaust',
    category: 'exhaust',
    make: 'BMW',
    model: 'M3',
    year: 2020,
    price: 4299,
    description: 'Premium titanium exhaust system with carbon fiber tips. Significant weight reduction and performance gains.',
    detailedDescription: 'Hand-crafted titanium exhaust system featuring Akrapovič\'s signature sound and build quality. Includes carbon fiber tailpipes and titanium mufflers for ultimate performance and aesthetics.',
    performanceGain: '+35-40 HP, +45 lb-ft',
    difficulty: 'expert',
    rating: 4.9,
    reviews: 67,
    imageUrl: 'https://images.pexels.com/photos/3806288/pexels-photo-3806288.jpeg?auto=compress&cs=tinysrgb&w=400',
    additionalImages: [
      'https://images.pexels.com/photos/3806288/pexels-photo-3806288.jpeg?auto=compress&cs=tinysrgb&w=400'
    ],
    inStock: true,
    brand: 'Akrapovič',
    installTime: '4-6 hours',
    partNumber: 'S-BM/T/4H',
    warranty: '2 Year Limited Warranty',
    isBestSeller: true,
    specifications: {
      'Material': 'Titanium',
      'Tip Material': 'Carbon Fiber',
      'Weight Reduction': '15.4 lbs',
      'Sound Level': 'Sport',
      'Pipe Diameter': '70mm',
      'Tip Diameter': '100mm',
      'Emissions': 'EU Compliant'
    },
    compatibility: [
      '2014-2020 BMW M3 (F80)',
      '2014-2020 BMW M4 (F82/F83)'
    ],
    installation: {
      tools: ['Professional lift', 'Torque wrench', 'Socket set', 'Cutting tools'],
      steps: [
        'Remove factory exhaust system',
        'Install new titanium mufflers',
        'Connect intermediate pipes',
        'Install carbon fiber tips',
        'Perform final alignment and torque check'
      ],
      tips: [
        'Professional installation highly recommended',
        'Use proper titanium-compatible tools',
        'Follow torque specifications exactly'
      ]
    },
    reviews_data: [
      {
        author: 'M3_Track_Driver',
        rating: 5,
        date: '2024-01-25',
        title: 'Ultimate exhaust system',
        content: 'The sound is incredible and the weight savings are noticeable. Expensive but worth it for the quality.',
        verified: true
      }
    ],
    certifications: ['TÜV Approved', 'EU Type Approval', 'ISO 9001:2015'],
    shipping: {
      weight: '35 lbs',
      dimensions: '52" x 28" x 16"',
      freeShipping: true,
      estimatedDays: '7-10 business days'
    }
  },

  {
    id: 'exh-003',
    name: 'Magnaflow Competition Series Cat-Back Exhaust',
    category: 'exhaust',
    make: 'Chevrolet',
    model: 'Camaro SS',
    year: 2021,
    price: 1199,
    originalPrice: 1349,
    description: 'Straight-through muffler design with mandrel-bent tubing for maximum flow and aggressive sound.',
    detailedDescription: 'The Magnaflow Competition Series features a straight-through, free-flowing design with mandrel-bent stainless steel tubing and polished tips. Delivers an aggressive sound with minimal drone.',
    performanceGain: '+20-25 HP, +22 lb-ft',
    difficulty: 'medium',
    rating: 4.7,
    reviews: 178,
    imageUrl: 'https://images.pexels.com/photos/3806288/pexels-photo-3806288.jpeg?auto=compress&cs=tinysrgb&w=400',
    additionalImages: [
      'https://images.pexels.com/photos/3806288/pexels-photo-3806288.jpeg?auto=compress&cs=tinysrgb&w=400'
    ],
    inStock: true,
    brand: 'Magnaflow',
    installTime: '2-3 hours',
    partNumber: '19351',
    warranty: 'Lifetime Warranty',
    specifications: {
      'Material': '409 Stainless Steel',
      'Tip Style': 'Dual 4.5" Round',
      'Tip Finish': 'Polished',
      'Sound Level': 'Aggressive',
      'Pipe Diameter': '3.0 inches',
      'Muffler Type': 'Straight-Through',
      'Weight': '38 lbs'
    },
    compatibility: [
      '2016-2023 Chevrolet Camaro SS 6.2L V8',
      '2017-2023 Chevrolet Camaro ZL1 6.2L Supercharged'
    ],
    installation: {
      tools: ['Jack and jack stands', 'Socket set', 'WD-40 or penetrating oil', 'Exhaust hanger removal tool'],
      steps: [
        'Raise and secure vehicle',
        'Spray exhaust hangers with lubricant',
        'Remove factory exhaust system',
        'Install Magnaflow components',
        'Align system and tighten all clamps',
        'Check for clearance issues'
      ],
      tips: [
        'Allow vehicle to cool completely before starting',
        'Use exhaust hanger removal tool for easier installation',
        'Tighten all clamps evenly'
      ]
    },
    reviews_data: [
      {
        author: 'Camaro_SS_Owner',
        rating: 5,
        date: '2024-02-10',
        title: 'Incredible sound, perfect fit',
        content: 'The sound is exactly what I was looking for - deep and aggressive without being too loud for daily driving.',
        verified: true
      }
    ],
    certifications: ['50-State Legal', 'Made in USA'],
    shipping: {
      weight: '45 lbs',
      dimensions: '50" x 22" x 14"',
      freeShipping: true,
      estimatedDays: '3-5 business days'
    }
  },

  // BRAKE SYSTEMS
  {
    id: 'brk-001',
    name: 'Brembo GT 6-Piston Big Brake Kit',
    category: 'brakes',
    make: 'BMW',
    model: 'M3',
    year: 2020,
    price: 3599,
    description: 'Monoblock 6-piston calipers with 380mm slotted rotors for ultimate stopping power.',
    detailedDescription: 'The Brembo GT brake system features monoblock aluminum calipers machined from a single piece for maximum rigidity. The 380mm two-piece floating rotors provide superior thermal management.',
    performanceGain: 'Superior Braking Performance',
    difficulty: 'hard',
    rating: 4.9,
    reviews: 92,
    imageUrl: 'https://images.pexels.com/photos/3806288/pexels-photo-3806288.jpeg?auto=compress&cs=tinysrgb&w=400',
    additionalImages: [
      'https://images.pexels.com/photos/3806288/pexels-photo-3806288.jpeg?auto=compress&cs=tinysrgb&w=400'
    ],
    inStock: true,
    brand: 'Brembo',
    installTime: '4-6 hours',
    partNumber: '1N1.9001A',
    warranty: '2 Year Limited Warranty',
    isBestSeller: true,
    specifications: {
      'Caliper Type': 'Monoblock 6-Piston',
      'Rotor Diameter': '380mm (14.96")',
      'Rotor Type': 'Two-Piece Floating',
      'Rotor Thickness': '34mm',
      'Caliper Material': 'Aluminum Alloy',
      'Pad Compound': 'High-Performance Ceramic',
      'Weight Savings': '8 lbs per corner'
    },
    compatibility: [
      '2014-2020 BMW M3 (F80)',
      '2014-2020 BMW M4 (F82/F83)'
    ],
    installation: {
      tools: ['Brake fluid', 'Brake bleeder kit', 'Torque wrench', '17mm socket', '19mm socket'],
      steps: [
        'Remove wheels and secure vehicle',
        'Remove brake fluid from master cylinder',
        'Remove factory calipers and rotors',
        'Install new Brembo rotors and calipers',
        'Connect brake lines with new hardware',
        'Bleed brake system thoroughly'
      ],
      tips: [
        'Professional installation highly recommended',
        'Use only DOT 4 brake fluid',
        'Bed in pads gradually over 200 miles'
      ]
    },
    reviews_data: [
      {
        author: 'BMW_Enthusiast',
        rating: 5,
        date: '2024-01-22',
        title: 'Ultimate braking upgrade',
        content: 'The stopping power is phenomenal. Build quality is exactly what you\'d expect from Brembo.',
        verified: true
      }
    ],
    certifications: ['TÜV Approved', 'FIA Homologated', 'ISO 9001:2015'],
    shipping: {
      weight: '65 lbs',
      dimensions: '36" x 24" x 18"',
      freeShipping: true,
      estimatedDays: '5-7 business days'
    }
  },

  {
    id: 'brk-002',
    name: 'StopTech ST-40 Big Brake Kit',
    category: 'brakes',
    make: 'Subaru',
    model: 'WRX STI',
    year: 2018,
    price: 2199,
    originalPrice: 2499,
    description: '4-piston fixed calipers with 355mm slotted rotors. Excellent value for performance braking.',
    detailedDescription: 'StopTech ST-40 brake kit offers race-proven performance at an affordable price. Features forged aluminum calipers and high-carbon iron rotors for consistent performance.',
    performanceGain: 'Enhanced Braking Performance',
    difficulty: 'hard',
    rating: 4.7,
    reviews: 145,
    imageUrl: 'https://images.pexels.com/photos/3806288/pexels-photo-3806288.jpeg?auto=compress&cs=tinysrgb&w=400',
    additionalImages: [
      'https://images.pexels.com/photos/3806288/pexels-photo-3806288.jpeg?auto=compress&cs=tinysrgb&w=400'
    ],
    inStock: true,
    brand: 'StopTech',
    installTime: '3-5 hours',
    partNumber: '83.842.4700.R',
    warranty: '2 Year Limited Warranty',
    specifications: {
      'Caliper Type': 'Fixed 4-Piston',
      'Rotor Diameter': '355mm (14")',
      'Rotor Type': 'Slotted',
      'Rotor Thickness': '32mm',
      'Caliper Material': 'Forged Aluminum',
      'Pad Type': 'Street Performance',
      'Caliper Colors': 'Red, Blue, Silver, Black'
    },
    compatibility: [
      '2015-2021 Subaru WRX',
      '2015-2021 Subaru WRX STI'
    ],
    installation: {
      tools: ['Brake fluid', 'Brake bleeder', 'Socket set', 'Torque wrench', 'Jack stands'],
      steps: [
        'Remove wheels and support vehicle',
        'Disconnect brake lines from factory calipers',
        'Remove factory brake components',
        'Install StopTech rotors and calipers',
        'Connect brake lines and bleed system',
        'Test brake pedal feel and operation'
      ],
      tips: [
        'Mark brake line routing before removal',
        'Use thread locker on caliper bolts',
        'Perform proper pad bedding procedure'
      ]
    },
    reviews_data: [
      {
        author: 'STI_Driver',
        rating: 5,
        date: '2024-01-20',
        title: 'Great upgrade for the price',
        content: 'Significant improvement over stock brakes. Perfect for street and occasional track use.',
        verified: true
      }
    ],
    certifications: ['DOT Approved', 'ISO 9001:2015'],
    shipping: {
      weight: '55 lbs',
      dimensions: '32" x 20" x 16"',
      freeShipping: true,
      estimatedDays: '3-5 business days'
    }
  },

  {
    id: 'brk-003',
    name: 'Wilwood AERO6 Front Big Brake Kit',
    category: 'brakes',
    make: 'Ford',
    model: 'Mustang GT',
    year: 2020,
    price: 2499,
    originalPrice: 2799,
    description: 'Race-proven 6-piston calipers with 14.25" rotors for exceptional braking performance and pedal feel.',
    detailedDescription: 'Wilwood\'s AERO6 Big Brake Kit features forged billet 6-piston calipers and 14.25" two-piece rotors. The kit includes BP-10 compound brake pads, braided stainless steel lines, and all necessary mounting hardware.',
    performanceGain: 'Race-Level Braking Performance',
    difficulty: 'hard',
    rating: 4.8,
    reviews: 87,
    imageUrl: 'https://images.pexels.com/photos/3806288/pexels-photo-3806288.jpeg?auto=compress&cs=tinysrgb&w=400',
    additionalImages: [
      'https://images.pexels.com/photos/3806288/pexels-photo-3806288.jpeg?auto=compress&cs=tinysrgb&w=400'
    ],
    inStock: true,
    brand: 'Wilwood',
    installTime: '4-6 hours',
    partNumber: '140-15177-DR',
    warranty: '3 Year Limited Warranty',
    specifications: {
      'Caliper Type': 'Forged Billet 6-Piston',
      'Rotor Diameter': '14.25" (362mm)',
      'Rotor Type': 'GT Slotted',
      'Rotor Material': 'SRP Drilled & Slotted',
      'Caliper Material': 'Forged Aluminum',
      'Pad Compound': 'BP-10 SmartPad',
      'Caliper Finish': 'Red, Black, or Nickel'
    },
    compatibility: [
      '2015-2023 Ford Mustang GT',
      '2015-2023 Ford Mustang EcoBoost (with Performance Pack)'
    ],
    installation: {
      tools: ['Brake fluid', 'Brake bleeder', 'Metric socket set', 'Torque wrench', 'Line wrenches'],
      steps: [
        'Remove wheels and factory brake components',
        'Install caliper brackets to spindle',
        'Mount rotors and calipers',
        'Install brake lines and bleed system',
        'Torque all fasteners to specifications',
        'Perform pad bedding procedure'
      ],
      tips: [
        'Use only DOT 4 or DOT 5.1 brake fluid',
        'Follow proper break-in procedure for optimal performance',
        'Check rotor runout before final assembly'
      ]
    },
    reviews_data: [
      {
        author: 'Mustang_Racer',
        rating: 5,
        date: '2024-02-15',
        title: 'Track-proven performance',
        content: 'These brakes transformed my Mustang\'s track performance. Consistent pedal feel even after multiple hot laps.',
        verified: true
      }
    ],
    certifications: ['SFI Approved', 'Made in USA'],
    shipping: {
      weight: '60 lbs',
      dimensions: '34" x 22" x 16"',
      freeShipping: true,
      estimatedDays: '3-5 business days'
    }
  },

  // SUSPENSION & HANDLING
  {
    id: 'sus-001',
    name: 'KW Variant 3 Coilover System',
    category: 'suspension',
    make: 'BMW',
    model: '330i',
    year: 2020,
    price: 2899,
    description: 'Premium 3-way adjustable coilovers with separate compression and rebound damping adjustment.',
    detailedDescription: 'KW Variant 3 coilovers offer the ultimate in suspension adjustability with independent compression and rebound damping controls. Features stainless steel construction and lifetime warranty.',
    performanceGain: 'Adjustable Handling Characteristics',
    difficulty: 'expert',
    rating: 4.8,
    reviews: 78,
    imageUrl: 'https://images.pexels.com/photos/3806288/pexels-photo-3806288.jpeg?auto=compress&cs=tinysrgb&w=400',
    additionalImages: [
      'https://images.pexels.com/photos/3806288/pexels-photo-3806288.jpeg?auto=compress&cs=tinysrgb&w=400'
    ],
    inStock: true,
    brand: 'KW',
    installTime: '6-8 hours',
    partNumber: '35220854',
    warranty: 'Limited Lifetime Warranty',
    specifications: {
      'Adjustment Type': '3-Way (Height, Compression, Rebound)',
      'Spring Rate Front': '7.0 kg/mm',
      'Spring Rate Rear': '8.5 kg/mm',
      'Lowering Range': '0.4" - 2.4"',
      'Material': 'Stainless Steel',
      'Damper Type': 'Monotube',
      'TÜV Approved': 'Yes'
    },
    compatibility: [
      '2019-2023 BMW 330i (G20)',
      '2020-2023 BMW M340i (G20)'
    ],
    installation: {
      tools: ['Spring compressor', 'Strut mount tools', 'Alignment equipment', 'Torque wrench'],
      steps: [
        'Remove factory suspension components',
        'Install KW coilover assemblies',
        'Set initial height and damping settings',
        'Perform wheel alignment',
        'Road test and fine-tune settings'
      ],
      tips: [
        'Professional installation and alignment required',
        'Start with middle damping settings',
        'Allow 500 miles for settling'
      ]
    },
    reviews_data: [
      {
        author: 'BMW_Tuner',
        rating: 5,
        date: '2024-01-18',
        title: 'Best coilovers money can buy',
        content: 'The adjustability is incredible. You can dial in exactly the ride quality you want.',
        verified: true
      }
    ],
    certifications: ['TÜV Approved', 'ISO 9001:2015'],
    shipping: {
      weight: '85 lbs',
      dimensions: '48" x 24" x 12"',
      freeShipping: true,
      estimatedDays: '5-7 business days'
    }
  },

  {
    id: 'sus-002',
    name: 'Bilstein B14 PSS Coilover Kit',
    category: 'suspension',
    make: 'Volkswagen',
    model: 'Golf GTI',
    year: 2019,
    price: 1599,
    originalPrice: 1799,
    description: 'Height and damping adjustable coilovers designed for street performance and comfort.',
    detailedDescription: 'Bilstein B14 PSS coilovers combine the legendary Bilstein damping quality with height adjustability. Perfect balance of performance and daily drivability.',
    performanceGain: 'Improved Handling & Comfort',
    difficulty: 'hard',
    rating: 4.6,
    reviews: 134,
    imageUrl: 'https://images.pexels.com/photos/3806288/pexels-photo-3806288.jpeg?auto=compress&cs=tinysrgb&w=400',
    additionalImages: [
      'https://images.pexels.com/photos/3806288/pexels-photo-3806288.jpeg?auto=compress&cs=tinysrgb&w=400'
    ],
    inStock: true,
    brand: 'Bilstein',
    installTime: '4-6 hours',
    partNumber: '47-264423',
    warranty: '2 Year Limited Warranty',
    specifications: {
      'Adjustment Type': 'Height and Damping',
      'Lowering Range': '1.2" - 2.1"',
      'Damper Type': 'Monotube',
      'Spring Type': 'Progressive Rate',
      'Material': 'Zinc-plated Steel',
      'Rebound Adjustment': '10 Clicks',
      'TÜV Approved': 'Yes'
    },
    compatibility: [
      '2015-2021 Volkswagen Golf GTI (Mk7)',
      '2015-2021 Volkswagen Golf R (Mk7)'
    ],
    installation: {
      tools: ['Spring compressor', 'Strut tools', 'Socket set', 'Alignment equipment'],
      steps: [
        'Remove factory struts and springs',
        'Assemble Bilstein coilover units',
        'Install coilovers and set initial height',
        'Perform wheel alignment',
        'Test drive and adjust damping'
      ],
      tips: [
        'Mark original ride height before removal',
        'Use proper spring compressor safety',
        'Professional alignment recommended'
      ]
    },
    reviews_data: [
      {
        author: 'GTI_Enthusiast',
        rating: 5,
        date: '2024-01-15',
        title: 'Perfect for daily driving',
        content: 'Great balance of performance and comfort. The adjustability lets you fine-tune for any situation.',
        verified: true
      }
    ],
    certifications: ['TÜV Approved', 'ISO 9001:2015'],
    shipping: {
      weight: '75 lbs',
      dimensions: '44" x 20" x 14"',
      freeShipping: true,
      estimatedDays: '3-5 business days'
    }
  },

  {
    id: 'sus-003',
    name: 'Ohlins Road & Track Coilover System',
    category: 'suspension',
    make: 'Porsche',
    model: '911',
    year: 2020,
    price: 3499,
    description: 'Premium DFV (Dual Flow Valve) technology coilovers with adjustable damping for road and track use.',
    detailedDescription: 'Ohlins Road & Track coilovers feature patented DFV technology that provides exceptional performance on both street and track. The twin-tube design offers superior damping control and ride quality.',
    performanceGain: 'Race-Level Handling with Street Comfort',
    difficulty: 'expert',
    rating: 4.9,
    reviews: 56,
    imageUrl: 'https://images.pexels.com/photos/3806288/pexels-photo-3806288.jpeg?auto=compress&cs=tinysrgb&w=400',
    additionalImages: [
      'https://images.pexels.com/photos/3806288/pexels-photo-3806288.jpeg?auto=compress&cs=tinysrgb&w=400'
    ],
    inStock: true,
    brand: 'Ohlins',
    installTime: '6-8 hours',
    partNumber: 'POS MP00',
    warranty: '2 Year Limited Warranty',
    isBestSeller: true,
    specifications: {
      'Technology': 'DFV (Dual Flow Valve)',
      'Damper Type': 'Twin-Tube',
      'Adjustment': 'Rebound & Compression',
      'Spring Type': 'Linear Rate',
      'Spring Material': 'Steel Alloy',
      'Adjustment Range': '20 Clicks',
      'Ride Height Adjustment': 'Yes'
    },
    compatibility: [
      '2017-2023 Porsche 911 Carrera (992)',
      '2012-2019 Porsche 911 Carrera (991)'
    ],
    installation: {
      tools: ['Vehicle lift', 'Specialized Porsche tools', 'Torque wrench', 'Alignment equipment'],
      steps: [
        'Remove wheels and factory suspension',
        'Install Ohlins coilover assemblies',
        'Set initial ride height',
        'Perform four-wheel alignment',
        'Test drive and adjust settings'
      ],
      tips: [
        'Professional installation required',
        'Start with factory recommended settings',
        'Follow break-in procedure for optimal performance'
      ]
    },
    reviews_data: [
      {
        author: 'Porsche_Enthusiast',
        rating: 5,
        date: '2024-02-20',
        title: 'Transforms the car completely',
        content: 'The difference is night and day. Incredible control on track while maintaining excellent street manners.',
        verified: true
      }
    ],
    certifications: ['TÜV Approved', 'ISO 9001:2015'],
    shipping: {
      weight: '90 lbs',
      dimensions: '50" x 26" x 14"',
      freeShipping: true,
      estimatedDays: '7-10 business days'
    }
  },

  {
    id: 'sus-004',
    name: 'Eibach Pro-Kit Lowering Springs',
    category: 'suspension',
    make: 'Honda',
    model: 'Civic Si',
    year: 2020,
    price: 299,
    originalPrice: 349,
    description: 'Progressive rate lowering springs for improved handling and appearance with minimal sacrifice in ride quality.',
    detailedDescription: 'Eibach Pro-Kit springs are designed to lower your vehicle\'s center of gravity, reducing body roll and improving handling. The progressive spring rate design maintains ride comfort while enhancing performance.',
    performanceGain: 'Improved Handling & Appearance',
    difficulty: 'medium',
    rating: 4.7,
    reviews: 215,
    imageUrl: 'https://images.pexels.com/photos/3806288/pexels-photo-3806288.jpeg?auto=compress&cs=tinysrgb&w=400',
    additionalImages: [
      'https://images.pexels.com/photos/3806288/pexels-photo-3806288.jpeg?auto=compress&cs=tinysrgb&w=400'
    ],
    inStock: true,
    brand: 'Eibach',
    installTime: '3-4 hours',
    partNumber: 'E10-40-029-01-22',
    warranty: 'Million Mile Warranty',
    isPopular: true,
    specifications: {
      'Spring Type': 'Progressive Rate',
      'Lowering Amount': '1.2" Front, 1.0" Rear',
      'Spring Material': 'Chrome Silicon',
      'Spring Finish': 'Powder Coated',
      'Spring Rate': 'Progressive',
      'Lifetime': '1,000,000+ Cycles',
      'Made In': 'USA'
    },
    compatibility: [
      '2016-2021 Honda Civic Si',
      '2016-2021 Honda Civic Sport',
      '2016-2021 Honda Civic EX-L'
    ],
    installation: {
      tools: ['Spring compressor', 'Socket set', 'Strut tools', 'Torque wrench'],
      steps: [
        'Remove wheels and factory springs',
        'Compress springs and remove from struts',
        'Install Eibach springs on strut assemblies',
        'Reinstall strut assemblies',
        'Perform wheel alignment'
      ],
      tips: [
        'Always use a quality spring compressor',
        'Replace strut mounts if worn',
        'Professional alignment is required after installation'
      ]
    },
    reviews_data: [
      {
        author: 'Civic_Driver',
        rating: 5,
        date: '2024-02-05',
        title: 'Perfect drop and handling',
        content: 'The 1.2" drop is perfect - not too low for daily driving but enough to eliminate wheel gap and improve handling.',
        verified: true
      }
    ],
    certifications: ['ISO 9001:2015', 'TÜV Approved'],
    shipping: {
      weight: '15 lbs',
      dimensions: '24" x 12" x 8"',
      freeShipping: true,
      estimatedDays: '2-3 business days'
    }
  },

  // FORCED INDUCTION
  {
    id: 'turbo-001',
    name: 'Garrett GT2860RS Turbocharger',
    category: 'turbo',
    make: 'Subaru',
    model: 'WRX',
    year: 2018,
    price: 2299,
    description: 'Ball bearing turbocharger with integrated wastegate. Excellent response and reliability.',
    detailedDescription: 'The Garrett GT2860RS features dual ball bearing technology for quick spool and long life. Integrated wastegate simplifies installation while providing excellent boost control.',
    performanceGain: '+100-150 HP potential',
    difficulty: 'expert',
    rating: 4.8,
    reviews: 56,
    imageUrl: 'https://images.pexels.com/photos/3806288/pexels-photo-3806288.jpeg?auto=compress&cs=tinysrgb&w=400',
    additionalImages: [
      'https://images.pexels.com/photos/3806288/pexels-photo-3806288.jpeg?auto=compress&cs=tinysrgb&w=400'
    ],
    inStock: true,
    brand: 'Garrett',
    installTime: '8-12 hours',
    partNumber: '836026-5003S',
    warranty: '2 Year Limited Warranty',
    specifications: {
      'Bearing Type': 'Dual Ball Bearing',
      'Compressor Wheel': '60mm',
      'Turbine Wheel': '62mm',
      'A/R Ratio': '0.64',
      'Max HP': '400 HP',
      'Wastegate': 'Integrated',
      'Oil Cooled': 'Yes'
    },
    compatibility: [
      '2015-2021 Subaru WRX 2.0L',
      '2008-2014 Subaru WRX 2.5L (with modifications)'
    ],
    installation: {
      tools: ['Engine hoist', 'Turbo tools', 'Torque wrench', 'Gasket scraper'],
      steps: [
        'Remove factory turbocharger',
        'Install new Garrett turbo with gaskets',
        'Connect oil and coolant lines',
        'Install intake and exhaust piping',
        'Tune ECU for new turbocharger'
      ],
      tips: [
        'Professional installation strongly recommended',
        'Prime oil system before first start',
        'ECU tuning is mandatory'
      ]
    },
    reviews_data: [
      {
        author: 'WRX_Builder',
        rating: 5,
        date: '2024-01-12',
        title: 'Excellent turbo upgrade',
        content: 'Spools quickly and makes great power. Build quality is top notch as expected from Garrett.',
        verified: true
      }
    ],
    certifications: ['ISO 9001:2015', 'TS 16949'],
    shipping: {
      weight: '25 lbs',
      dimensions: '18" x 14" x 12"',
      freeShipping: true,
      estimatedDays: '5-7 business days'
    },
    safetyNotes: [
      'Professional tuning required',
      'Supporting modifications may be necessary',
      'Proper break-in procedure must be followed'
    ]
  },

  {
    id: 'turbo-002',
    name: 'Precision Turbo 6266 Gen2 CEA Turbocharger',
    category: 'turbo',
    make: 'Mitsubishi',
    model: 'Lancer Evolution X',
    year: 2015,
    price: 2499,
    description: 'Competition engineered aerodynamics turbocharger with billet compressor wheel for maximum performance.',
    detailedDescription: 'The Precision 6266 Gen2 CEA turbocharger features a forged, fully machined billet compressor wheel and competition engineered aerodynamics for maximum airflow and efficiency.',
    performanceGain: '+150-200 HP potential',
    difficulty: 'expert',
    rating: 4.9,
    reviews: 42,
    imageUrl: 'https://images.pexels.com/photos/3806288/pexels-photo-3806288.jpeg?auto=compress&cs=tinysrgb&w=400',
    additionalImages: [
      'https://images.pexels.com/photos/3806288/pexels-photo-3806288.jpeg?auto=compress&cs=tinysrgb&w=400'
    ],
    inStock: true,
    brand: 'Precision Turbo',
    installTime: '10-14 hours',
    partNumber: 'PTE-6266-CEA',
    warranty: '1 Year Limited Warranty',
    specifications: {
      'Compressor Wheel': '62mm Billet (inducer)',
      'Turbine Wheel': '66mm (exducer)',
      'A/R Ratio Options': '0.63, 0.82, 1.00',
      'Bearing Type': 'Journal Bearing',
      'Wastegate': 'External',
      'Max HP': '650+ HP',
      'Boost Threshold': '3,200 RPM'
    },
    compatibility: [
      '2008-2015 Mitsubishi Lancer Evolution X',
      'Universal with proper manifold and downpipe'
    ],
    installation: {
      tools: ['Engine hoist', 'Specialized turbo tools', 'Fabrication equipment', 'Welding equipment'],
      steps: [
        'Remove factory turbocharger system',
        'Install aftermarket manifold if required',
        'Mount Precision turbocharger',
        'Install oil and coolant lines',
        'Connect intake and exhaust components',
        'Install external wastegate and boost controller',
        'Professional ECU tuning'
      ],
      tips: [
        'Professional installation mandatory',
        'Supporting fuel system upgrades required',
        'Custom intercooler piping may be necessary',
        'Allow proper break-in period'
      ]
    },
    reviews_data: [
      {
        author: 'EvoX_Racer',
        rating: 5,
        date: '2024-02-18',
        title: 'Beast of a turbo',
        content: 'Incredible power potential with surprisingly good spool characteristics. Makes my Evo X an absolute monster.',
        verified: true
      }
    ],
    certifications: ['ISO 9001:2015'],
    shipping: {
      weight: '28 lbs',
      dimensions: '16" x 16" x 12"',
      freeShipping: true,
      estimatedDays: '5-7 business days'
    },
    safetyNotes: [
      'Professional installation and tuning required',
      'Supporting modifications necessary (fuel system, clutch, etc.)',
      'Not legal for street use in all areas'
    ]
  },

  {
    id: 'turbo-003',
    name: 'Edelbrock E-Force Supercharger System',
    category: 'turbo',
    make: 'Ford',
    model: 'Mustang GT',
    year: 2021,
    price: 7899,
    description: 'Complete supercharger system with Eaton TVS R2650 rotor assembly for maximum power and reliability.',
    detailedDescription: 'The Edelbrock E-Force Supercharger System features an Eaton TVS R2650 rotor assembly, integrated intake manifold, and intercooler system. Designed for maximum performance while maintaining OEM-like drivability and reliability.',
    performanceGain: '+200-225 HP, +175 lb-ft',
    difficulty: 'expert',
    rating: 4.9,
    reviews: 38,
    imageUrl: 'https://images.pexels.com/photos/3806288/pexels-photo-3806288.jpeg?auto=compress&cs=tinysrgb&w=400',
    additionalImages: [
      'https://images.pexels.com/photos/3806288/pexels-photo-3806288.jpeg?auto=compress&cs=tinysrgb&w=400'
    ],
    inStock: true,
    brand: 'Edelbrock',
    installTime: '12-16 hours',
    partNumber: '15832',
    warranty: '3 Year Limited Warranty',
    specifications: {
      'Supercharger Type': 'Roots-type TVS R2650',
      'Displacement': '2.65L',
      'Max Boost': '12 PSI',
      'Intercooler': 'Air-to-Water',
      'Fuel System': 'High-Flow Injectors Included',
      'Tune': 'Included',
      'CARB Status': 'EO Pending'
    },
    compatibility: [
      '2018-2023 Ford Mustang GT 5.0L'
    ],
    installation: {
      tools: ['Engine hoist', 'Specialized Ford tools', 'Torque wrench', 'Fuel line tools'],
      steps: [
        'Remove factory intake system',
        'Install new fuel injectors',
        'Mount supercharger assembly',
        'Install intercooler system',
        'Connect drive belt system',
        'Install ECU calibration',
        'Test system operation'
      ],
      tips: [
        'Professional installation strongly recommended',
        'Follow break-in procedure exactly',
        'Use only recommended octane fuel',
        'Check belt tension after 500 miles'
      ]
    },
    reviews_data: [
      {
        author: 'Mustang_Fanatic',
        rating: 5,
        date: '2024-03-10',
        title: 'Incredible power, factory-like reliability',
        content: 'This supercharger transformed my Mustang. The power delivery is smooth and linear, and it drives like it came from the factory this way.',
        verified: true
      }
    ],
    certifications: ['CARB EO Pending', 'ISO 9001:2015', 'Made in USA'],
    shipping: {
      weight: '120 lbs',
      dimensions: '36" x 30" x 24"',
      freeShipping: true,
      estimatedDays: '7-10 business days'
    },
    safetyNotes: [
      'Professional installation required',
      'Use only 91+ octane fuel',
      'Regular maintenance critical for longevity',
      'May void factory powertrain warranty'
    ]
  },

  // ECU TUNING
  {
    id: 'ecu-001',
    name: 'COBB Accessport V3 Tuning Device',
    category: 'electronics',
    make: 'Subaru',
    model: 'WRX',
    year: 2020,
    price: 699,
    description: 'Handheld ECU tuning device with pre-loaded maps and real-time monitoring capabilities.',
    detailedDescription: 'The COBB Accessport V3 is the industry standard for ECU tuning. Features a large color display, pre-loaded performance maps, and comprehensive data logging capabilities.',
    performanceGain: '+20-40 HP, +30-50 lb-ft',
    difficulty: 'easy',
    rating: 4.9,
    reviews: 312,
    imageUrl: 'https://images.pexels.com/photos/3806288/pexels-photo-3806288.jpeg?auto=compress&cs=tinysrgb&w=400',
    additionalImages: [
      'https://images.pexels.com/photos/3806288/pexels-photo-3806288.jpeg?auto=compress&cs=tinysrgb&w=400'
    ],
    inStock: true,
    brand: 'COBB',
    installTime: '30 minutes',
    partNumber: 'AP3-SUB-004',
    warranty: '1 Year Limited Warranty',
    isPopular: true,
    specifications: {
      'Display': '4.3" Color Touchscreen',
      'Memory': '4GB Internal',
      'Connectivity': 'USB, OBD-II',
      'Data Logging': 'Real-time',
      'Map Switching': 'On-the-fly',
      'Gauges': 'Customizable',
      'Updates': 'Over-the-air'
    },
    compatibility: [
      '2015-2021 Subaru WRX',
      '2015-2021 Subaru WRX STI',
      '2013-2020 Subaru BRZ'
    ],
    installation: {
      tools: ['None required'],
      steps: [
        'Connect Accessport to OBD-II port',
        'Follow on-screen setup instructions',
        'Install desired performance map',
        'Verify installation success',
        'Enjoy improved performance'
      ],
      tips: [
        'Read all instructions before starting',
        'Ensure battery is fully charged',
        'Start with Stage 1 map for stock vehicles'
      ]
    },
    reviews_data: [
      {
        author: 'SubaruTuner',
        rating: 5,
        date: '2024-01-25',
        title: 'Best tuning device available',
        content: 'Easy to use and the performance gains are immediately noticeable. The data logging is incredibly useful.',
        verified: true
      }
    ],
    certifications: ['CARB Pending', 'ISO 9001:2015'],
    shipping: {
      weight: '1.5 lbs',
      dimensions: '8" x 6" x 3"',
      freeShipping: true,
      estimatedDays: '1-2 business days'
    }
  },

  {
    id: 'ecu-002',
    name: 'APR ECU Upgrade - Stage 2',
    category: 'electronics',
    make: 'Audi',
    model: 'S4',
    year: 2020,
    price: 899,
    description: 'Professional ECU calibration for modified vehicles with intake and exhaust upgrades.',
    detailedDescription: 'APR Stage 2 ECU Upgrade is designed for vehicles with bolt-on modifications like intake and exhaust. Features multiple program switching, enhanced throttle response, and optimized power delivery.',
    performanceGain: '+80-100 HP, +90-110 lb-ft',
    difficulty: 'easy',
    rating: 4.8,
    reviews: 156,
    imageUrl: 'https://images.pexels.com/photos/3806288/pexels-photo-3806288.jpeg?auto=compress&cs=tinysrgb&w=400',
    additionalImages: [
      'https://images.pexels.com/photos/3806288/pexels-photo-3806288.jpeg?auto=compress&cs=tinysrgb&w=400'
    ],
    inStock: true,
    brand: 'APR',
    installTime: '1-2 hours (professional installation)',
    partNumber: 'ECU-S4-B9-STG2',
    warranty: 'Limited Lifetime Warranty',
    specifications: {
      'Programs': 'Multiple (Performance, Stock, Valet)',
      'Octane Requirements': '91, 93, 100, 104',
      'Boost Increase': '+4-6 PSI',
      'Rev Limiter': 'Increased',
      'Speed Limiter': 'Removed',
      'Fuel Cut': 'Optimized',
      'Throttle Response': 'Enhanced'
    },
    compatibility: [
      '2018-2023 Audi S4 (B9/B9.5)',
      '2018-2023 Audi S5 (B9/B9.5)'
    ],
    installation: {
      tools: ['Laptop with internet connection', 'Battery charger'],
      steps: [
        'Schedule appointment with APR authorized dealer',
        'Connect battery maintainer',
        'Technician connects to OBD-II port',
        'Upload new calibration to ECU',
        'Verify installation and test drive'
      ],
      tips: [
        'Professional installation required',
        'Ensure vehicle has supporting modifications',
        'Use recommended fuel octane',
        'Allow ECU to adapt for optimal performance'
      ]
    },
    reviews_data: [
      {
        author: 'Audi_S4_Owner',
        rating: 5,
        date: '2024-02-15',
        title: 'Completely transforms the car',
        content: 'The difference is night and day. Power delivery is smooth and linear with no drivability issues. Worth every penny.',
        verified: true
      }
    ],
    certifications: ['ISO 9001:2015'],
    shipping: {
      weight: '0 lbs (dealer installation)',
      dimensions: 'N/A',
      freeShipping: true,
      estimatedDays: 'Same day (at dealer)'
    },
    safetyNotes: [
      'Use only recommended fuel octane',
      'Ensure vehicle has supporting modifications',
      'May affect factory warranty'
    ]
  },

  {
    id: 'ecu-003',
    name: 'HP Tuners MPVI2 Pro Package',
    category: 'electronics',
    make: 'Chevrolet',
    model: 'Camaro SS',
    year: 2020,
    price: 899,
    description: 'Professional-grade ECU tuning interface with VCM Suite software for complete engine and transmission control.',
    detailedDescription: 'The HP Tuners MPVI2 Pro Package provides complete access to your vehicle\'s ECU and TCU parameters. Includes VCM Editor and VCM Scanner software for comprehensive tuning capabilities.',
    performanceGain: 'Fully Customizable',
    difficulty: 'expert',
    rating: 4.7,
    reviews: 87,
    imageUrl: 'https://images.pexels.com/photos/3806288/pexels-photo-3806288.jpeg?auto=compress&cs=tinysrgb&w=400',
    additionalImages: [
      'https://images.pexels.com/photos/3806288/pexels-photo-3806288.jpeg?auto=compress&cs=tinysrgb&w=400'
    ],
    inStock: true,
    brand: 'HP Tuners',
    installTime: 'N/A (Software)',
    partNumber: 'MPVI2-PRO',
    warranty: '1 Year Limited Warranty',
    specifications: {
      'Interface': 'MPVI2 Hardware',
      'Software': 'VCM Suite (Editor & Scanner)',
      'Credits': '8 Universal Credits',
      'Connectivity': 'USB, OBD-II',
      'Data Logging': 'Comprehensive',
      'Transmission Control': 'Yes',
      'Operating System': 'Windows'
    },
    compatibility: [
      '2010-2023 GM Vehicles',
      '2005-2023 Ford Vehicles',
      '2005-2023 Chrysler/Dodge/Jeep Vehicles'
    ],
    installation: {
      tools: ['Windows PC', 'Internet connection'],
      steps: [
        'Install VCM Suite software',
        'Connect MPVI2 interface to PC',
        'Register and activate credits',
        'Connect to vehicle OBD-II port',
        'Read factory calibration',
        'Make tuning adjustments',
        'Write calibration to vehicle'
      ],
      tips: [
        'Professional tuning knowledge required',
        'Always save backup of stock calibration',
        'Use datalogging for safe tuning',
        'Start with small adjustments'
      ]
    },
    reviews_data: [
      {
        author: 'Professional_Tuner',
        rating: 5,
        date: '2024-03-05',
        title: 'Industry standard for pro tuning',
        content: 'As a professional tuner, this is my go-to tool. The software is powerful and the interface is reliable.',
        verified: true
      }
    ],
    certifications: ['ISO 9001:2015'],
    shipping: {
      weight: '2 lbs',
      dimensions: '10" x 8" x 4"',
      freeShipping: true,
      estimatedDays: '2-3 business days'
    },
    safetyNotes: [
      'Professional tuning knowledge required',
      'Improper tuning can damage engine',
      'Not legal for emissions-controlled vehicles in some areas'
    ]
  },

  // TRANSMISSION & DRIVETRAIN
  {
    id: 'trans-001',
    name: 'Clutch Masters FX400 Stage 4 Clutch Kit',
    category: 'transmission',
    make: 'Honda',
    model: 'Civic Si',
    year: 2019,
    price: 899,
    originalPrice: 999,
    description: 'High-performance clutch kit designed for modified engines. Increased torque capacity with smooth engagement.',
    detailedDescription: 'The Clutch Masters FX400 features a segmented Kevlar disc for smooth engagement and increased torque capacity. Perfect for street and track use with modified engines.',
    performanceGain: '400 lb-ft torque capacity',
    difficulty: 'expert',
    rating: 4.7,
    reviews: 89,
    imageUrl: 'https://images.pexels.com/photos/3806288/pexels-photo-3806288.jpeg?auto=compress&cs=tinysrgb&w=400',
    additionalImages: [
      'https://images.pexels.com/photos/3806288/pexels-photo-3806288.jpeg?auto=compress&cs=tinysrgb&w=400'
    ],
    inStock: true,
    brand: 'Clutch Masters',
    installTime: '6-8 hours',
    partNumber: '03048-HDKV-R',
    warranty: '1 Year Limited Warranty',
    specifications: {
      'Disc Material': 'Segmented Kevlar',
      'Pressure Plate': 'Ductile Iron',
      'Torque Capacity': '400 lb-ft',
      'Clamp Load': '2,650 lbs',
      'Disc Count': 'Single',
      'Flywheel': 'Not Included',
      'Release Bearing': 'Included'
    },
    compatibility: [
      '2017-2021 Honda Civic Si 1.5L Turbo',
      '2017-2021 Honda Civic Type R 2.0L Turbo'
    ],
    installation: {
      tools: ['Transmission jack', 'Engine support', 'Clutch alignment tool', 'Torque wrench'],
      steps: [
        'Remove transmission from vehicle',
        'Remove factory clutch components',
        'Install new pressure plate and disc',
        'Reinstall transmission with proper alignment',
        'Bleed clutch hydraulic system'
      ],
      tips: [
        'Professional installation recommended',
        'Use clutch alignment tool for proper installation',
        'Break in clutch gradually over 500 miles'
      ]
    },
    reviews_data: [
      {
        author: 'Si_Tuner',
        rating: 5,
        date: '2024-01-20',
        title: 'Perfect for modified engines',
        content: 'Handles the extra power from my turbo upgrade perfectly. Engagement is smooth and progressive.',
        verified: true
      }
    ],
    certifications: ['SFI Approved', 'ISO 9001:2015'],
    shipping: {
      weight: '35 lbs',
      dimensions: '16" x 16" x 8"',
      freeShipping: true,
      estimatedDays: '3-5 business days'
    }
  },

  {
    id: 'trans-002',
    name: 'South Bend Stage 3 Daily Clutch Kit',
    category: 'transmission',
    make: 'Volkswagen',
    model: 'Golf R',
    year: 2019,
    price: 1299,
    description: 'Dual disc clutch system designed for high-torque applications while maintaining street drivability.',
    detailedDescription: 'South Bend\'s Stage 3 Daily clutch features a dual-disc design for high torque capacity with organic/ceramic hybrid friction material for smooth engagement and long life.',
    performanceGain: '550 lb-ft torque capacity',
    difficulty: 'expert',
    rating: 4.8,
    reviews: 64,
    imageUrl: 'https://images.pexels.com/photos/3806288/pexels-photo-3806288.jpeg?auto=compress&cs=tinysrgb&w=400',
    additionalImages: [
      'https://images.pexels.com/photos/3806288/pexels-photo-3806288.jpeg?auto=compress&cs=tinysrgb&w=400'
    ],
    inStock: true,
    brand: 'South Bend',
    installTime: '8-10 hours',
    partNumber: 'KTSIF-HD-O',
    warranty: '1 Year Limited Warranty',
    specifications: {
      'Disc Design': 'Dual Disc',
      'Disc Material': 'Organic/Ceramic Hybrid',
      'Pressure Plate': 'Performance Diaphragm',
      'Torque Capacity': '550 lb-ft',
      'Flywheel': 'Included - Single Mass',
      'Release Bearing': 'Included',
      'Alignment Tool': 'Included'
    },
    compatibility: [
      '2015-2021 Volkswagen Golf R',
      '2015-2021 Audi S3',
      '2017-2021 Audi RS3 (with modifications)'
    ],
    installation: {
      tools: ['Transmission jack', 'Engine support bar', 'Special VW/Audi tools', 'Torque wrench'],
      steps: [
        'Support engine and remove transmission',
        'Remove factory clutch and flywheel',
        'Install new single mass flywheel',
        'Install dual disc clutch assembly',
        'Reinstall transmission',
        'Bleed hydraulic system'
      ],
      tips: [
        'Professional installation highly recommended',
        'Replace rear main seal while transmission is removed',
        'Follow proper break-in procedure',
        'Expect increased pedal effort'
      ]
    },
    reviews_data: [
      {
        author: 'Golf_R_Tuned',
        rating: 5,
        date: '2024-02-25',
        title: 'Holds power without compromise',
        content: 'Running 480whp/520wtq with no issues. Pedal is slightly heavier than stock but still very drivable for daily use.',
        verified: true
      }
    ],
    certifications: ['SFI Approved'],
    shipping: {
      weight: '45 lbs',
      dimensions: '18" x 18" x 10"',
      freeShipping: true,
      estimatedDays: '3-5 business days'
    }
  },

  {
    id: 'trans-003',
    name: 'Wavetrac Limited Slip Differential',
    category: 'transmission',
    make: 'BMW',
    model: 'M3',
    year: 2020,
    price: 1499,
    description: 'Patented limited slip differential with wave ramp design for improved traction in all conditions.',
    detailedDescription: 'The Wavetrac differential features a patented wave ramp design that provides power to both wheels even when one wheel is completely unloaded. Perfect for high-performance street and track applications.',
    performanceGain: 'Improved Traction & Cornering',
    difficulty: 'expert',
    rating: 4.9,
    reviews: 47,
    imageUrl: 'https://images.pexels.com/photos/3806288/pexels-photo-3806288.jpeg?auto=compress&cs=tinysrgb&w=400',
    additionalImages: [
      'https://images.pexels.com/photos/3806288/pexels-photo-3806288.jpeg?auto=compress&cs=tinysrgb&w=400'
    ],
    inStock: true,
    brand: 'Wavetrac',
    installTime: '8-10 hours',
    partNumber: '309-130-160WK',
    warranty: '2 Year Limited Warranty',
    specifications: {
      'Type': 'Helical Limited Slip',
      'Bias Ratio': '2.5:1 - 3.5:1',
      'Material': '9310 Steel Alloy',
      'Preload': 'Adjustable',
      'Patented Features': 'Wave Ramp Technology',
      'ABS Compatible': 'Yes',
      'Bearings': 'Included'
    },
    compatibility: [
      '2014-2020 BMW M3 (F80)',
      '2014-2020 BMW M4 (F82/F83)'
    ],
    installation: {
      tools: ['Differential service tools', 'Press', 'Bearing puller', 'Dial indicator', 'Torque wrench'],
      steps: [
        'Remove differential from vehicle',
        'Disassemble factory differential',
        'Install Wavetrac differential with proper preload',
        'Set up bearing preload and backlash',
        'Reinstall differential in vehicle',
        'Fill with appropriate gear oil'
      ],
      tips: [
        'Professional installation required',
        'Use factory service manual for torque specifications',
        'Use only recommended gear oil',
        'Allow break-in period of 500 miles'
      ]
    },
    reviews_data: [
      {
        author: 'M3_Track_Enthusiast',
        rating: 5,
        date: '2024-03-15',
        title: 'Game-changing upgrade',
        content: 'The difference in corner exit traction is incredible. No more one-wheel spin, just pure grip and acceleration.',
        verified: true
      }
    ],
    certifications: ['ISO 9001:2015', 'Made in USA'],
    shipping: {
      weight: '22 lbs',
      dimensions: '14" x 14" x 10"',
      freeShipping: true,
      estimatedDays: '5-7 business days'
    }
  },

  // EXTERIOR MODIFICATIONS
  {
    id: 'ext-001',
    name: 'APR Carbon Fiber Front Splitter',
    category: 'exterior',
    make: 'Volkswagen',
    model: 'Golf R',
    year: 2020,
    price: 1299,
    description: 'Dry carbon fiber front splitter for improved aerodynamics and aggressive styling.',
    detailedDescription: 'APR\'s dry carbon fiber front splitter is designed using CFD analysis for optimal aerodynamic performance. Features pre-preg carbon fiber construction with clear coat finish.',
    performanceGain: 'Improved Front Downforce',
    difficulty: 'medium',
    rating: 4.8,
    reviews: 45,
    imageUrl: 'https://images.pexels.com/photos/3806288/pexels-photo-3806288.jpeg?auto=compress&cs=tinysrgb&w=400',
    additionalImages: [
      'https://images.pexels.com/photos/3806288/pexels-photo-3806288.jpeg?auto=compress&cs=tinysrgb&w=400'
    ],
    inStock: true,
    brand: 'APR',
    installTime: '2-3 hours',
    partNumber: 'CB-100200',
    warranty: '1 Year Limited Warranty',
    specifications: {
      'Material': 'Dry Carbon Fiber',
      'Weave': '2x2 Twill',
      'Finish': 'Clear Coat',
      'Weight': '8.5 lbs',
      'Mounting': 'Hardware Included',
      'Aerodynamic Benefit': 'Front Downforce',
      'Fitment': 'OEM Perfect'
    },
    compatibility: [
      '2018-2021 Volkswagen Golf R (Mk7.5)',
      '2019-2021 Volkswagen Golf GTI TCR'
    ],
    installation: {
      tools: ['Drill', 'Socket set', 'Measuring tape', 'Level'],
      steps: [
        'Remove factory undertray',
        'Test fit splitter and mark mounting points',
        'Drill mounting holes in bumper',
        'Install splitter with provided hardware',
        'Reinstall undertray and check clearance'
      ],
      tips: [
        'Use template for accurate hole placement',
        'Check ground clearance before final installation',
        'Apply thread locker to mounting bolts'
      ]
    },
    reviews_data: [
      {
        author: 'Golf_R_Owner',
        rating: 5,
        date: '2024-01-18',
        title: 'Perfect fit and finish',
        content: 'The carbon fiber quality is excellent and the fitment is perfect. Really changes the look of the car.',
        verified: true
      }
    ],
    certifications: ['ISO 9001:2015'],
    shipping: {
      weight: '12 lbs',
      dimensions: '48" x 24" x 6"',
      freeShipping: true,
      estimatedDays: '5-7 business days'
    }
  },

  {
    id: 'ext-002',
    name: 'Voltex Type 2S Carbon Fiber Wing',
    category: 'exterior',
    make: 'Subaru',
    model: 'WRX STI',
    year: 2020,
    price: 1899,
    description: 'Functional carbon fiber rear wing with adjustable angle of attack for optimal downforce.',
    detailedDescription: 'The Voltex Type 2S wing is track-proven and wind tunnel tested for optimal aerodynamic performance. Features full carbon fiber construction with adjustable angle of attack and CNC machined aluminum stands.',
    performanceGain: 'Significant Rear Downforce',
    difficulty: 'medium',
    rating: 4.9,
    reviews: 32,
    imageUrl: 'https://images.pexels.com/photos/3806288/pexels-photo-3806288.jpeg?auto=compress&cs=tinysrgb&w=400',
    additionalImages: [
      'https://images.pexels.com/photos/3806288/pexels-photo-3806288.jpeg?auto=compress&cs=tinysrgb&w=400'
    ],
    inStock: true,
    brand: 'Voltex',
    installTime: '3-4 hours',
    partNumber: 'VXSTI-T2S',
    warranty: '1 Year Limited Warranty',
    specifications: {
      'Material': 'Carbon Fiber',
      'Wing Span': '1700mm',
      'Chord Length': '250mm',
      'Stand Material': 'CNC Machined Aluminum',
      'Adjustment': 'Multiple Angle Settings',
      'Weight': '12 lbs',
      'Mounting': 'Trunk Mount'
    },
    compatibility: [
      '2015-2021 Subaru WRX STI',
      '2015-2021 Subaru WRX (with modifications)'
    ],
    installation: {
      tools: ['Drill', 'Measuring tape', 'Paint pen', 'Socket set', 'Torque wrench'],
      steps: [
        'Remove factory wing if equipped',
        'Measure and mark mounting locations',
        'Drill mounting holes in trunk',
        'Apply anti-corrosion treatment',
        'Mount wing stands and secure wing',
        'Adjust angle of attack as desired'
      ],
      tips: [
        'Use template for accurate hole placement',
        'Apply touch-up paint to drilled holes',
        'Start with middle angle setting',
        'Use thread locker on all fasteners'
      ]
    },
    reviews_data: [
      {
        author: 'STI_Track_Driver',
        rating: 5,
        date: '2024-02-20',
        title: 'Functional and beautiful',
        content: 'The quality is exceptional and the downforce is noticeable at track speeds. Completely transformed the high-speed stability of my STI.',
        verified: true
      }
    ],
    certifications: ['ISO 9001:2015'],
    shipping: {
      weight: '25 lbs',
      dimensions: '72" x 18" x 12"',
      freeShipping: true,
      estimatedDays: '10-14 business days'
    }
  },

  {
    id: 'ext-003',
    name: 'Seibon Carbon Fiber Hood',
    category: 'exterior',
    make: 'Nissan',
    model: '370Z',
    year: 2020,
    price: 1099,
    originalPrice: 1299,
    description: 'Lightweight carbon fiber hood with functional vents for improved engine cooling and weight reduction.',
    detailedDescription: 'Seibon carbon fiber hood features vacuum-infused carbon fiber construction for maximum strength and minimum weight. Includes functional vents for improved engine cooling and heat extraction.',
    performanceGain: '15-20 lbs Weight Reduction',
    difficulty: 'medium',
    rating: 4.7,
    reviews: 58,
    imageUrl: 'https://images.pexels.com/photos/3806288/pexels-photo-3806288.jpeg?auto=compress&cs=tinysrgb&w=400',
    additionalImages: [
      'https://images.pexels.com/photos/3806288/pexels-photo-3806288.jpeg?auto=compress&cs=tinysrgb&w=400'
    ],
    inStock: true,
    brand: 'Seibon',
    installTime: '1-2 hours',
    partNumber: 'HD0910NS370-TS',
    warranty: '1 Year Limited Warranty',
    specifications: {
      'Material': 'Carbon Fiber',
      'Construction': 'Vacuum-Infused',
      'Weave': '2x2 Twill',
      'Finish': 'UV-Resistant Clear Coat',
      'Weight': '18 lbs',
      'Weight Savings': '15-20 lbs',
      'Vents': 'Functional'
    },
    compatibility: [
      '2009-2020 Nissan 370Z'
    ],
    installation: {
      tools: ['Socket set', 'Hood prop', 'Helper', 'Painter\'s tape'],
      steps: [
        'Protect fenders with painter\'s tape',
        'Disconnect hood release and any electrical connections',
        'Remove factory hood with helper',
        'Transfer hood latch and other hardware',
        'Install carbon fiber hood',
        'Adjust fitment and gaps'
      ],
      tips: [
        'Use two people for safe removal and installation',
        'Transfer all OEM hardware',
        'Adjust hood bumpers for proper alignment',
        'Apply additional UV protectant regularly'
      ]
    },
    reviews_data: [
      {
        author: '370Z_Enthusiast',
        rating: 5,
        date: '2024-03-05',
        title: 'Excellent quality and fitment',
        content: 'Perfect OEM-like fitment with significant weight savings. The vents actually work to reduce engine bay temperatures.',
        verified: true
      }
    ],
    certifications: ['ISO 9001:2015'],
    shipping: {
      weight: '30 lbs (packaged)',
      dimensions: '72" x 48" x 12"',
      freeShipping: true,
      estimatedDays: '7-10 business days'
    }
  },

  // INTERIOR UPGRADES
  {
    id: 'int-001',
    name: 'Recaro Sportster CS Racing Seats',
    category: 'interior',
    make: 'BMW',
    model: 'M3',
    year: 2020,
    price: 2899,
    description: 'FIA-approved racing seats with carbon fiber shell and premium Dinamica upholstery.',
    detailedDescription: 'Recaro Sportster CS seats feature a lightweight carbon fiber shell with integrated head protection. FIA 8855-1999 approved for motorsport use while maintaining street comfort.',
    performanceGain: 'Enhanced Driver Support',
    difficulty: 'medium',
    rating: 4.9,
    reviews: 67,
    imageUrl: 'https://images.pexels.com/photos/3806288/pexels-photo-3806288.jpeg?auto=compress&cs=tinysrgb&w=400',
    additionalImages: [
      'https://images.pexels.com/photos/3806288/pexels-photo-3806288.jpeg?auto=compress&cs=tinysrgb&w=400'
    ],
    inStock: true,
    brand: 'Recaro',
    installTime: '3-4 hours',
    partNumber: '410.00.2587',
    warranty: '3 Year Limited Warranty',
    specifications: {
      'Shell Material': 'Carbon Fiber',
      'Upholstery': 'Dinamica/Leather',
      'Weight': '24 lbs',
      'FIA Approval': '8855-1999',
      'Side Bolster': 'Adjustable',
      'Seat Heater': 'Optional',
      'Harness Slots': 'Integrated'
    },
    compatibility: [
      '2014-2020 BMW M3 (F80)',
      '2014-2020 BMW M4 (F82/F83)',
      'Universal with proper brackets'
    ],
    installation: {
      tools: ['Socket set', 'Torque wrench', 'Seat bracket kit', 'Electrical tools'],
      steps: [
        'Remove factory seats and brackets',
        'Install Recaro seat brackets',
        'Mount Recaro seats to brackets',
        'Connect electrical connections if equipped',
        'Test seat operation and adjustment'
      ],
      tips: [
        'Purchase vehicle-specific brackets separately',
        'Disconnect battery before electrical work',
        'Test fit before final installation'
      ]
    },
    reviews_data: [
      {
        author: 'Track_Driver',
        rating: 5,
        date: '2024-01-22',
        title: 'Perfect for track use',
        content: 'Incredible support during track sessions. The carbon shell is lightweight and the comfort is surprising.',
        verified: true
      }
    ],
    certifications: ['FIA 8855-1999', 'ISO 9001:2015'],
    shipping: {
      weight: '30 lbs',
      dimensions: '32" x 24" x 28"',
      freeShipping: true,
      estimatedDays: '7-10 business days'
    }
  },

  {
    id: 'int-002',
    name: 'Sparco Competition Pro 2000 Racing Seat',
    category: 'interior',
    make: 'Subaru',
    model: 'WRX STI',
    year: 2020,
    price: 1099,
    description: 'FIA-approved fiberglass shell racing seat with high-grip fabric and superior side support.',
    detailedDescription: 'The Sparco Pro 2000 features a fiberglass composite shell with anatomical design for maximum support during high-G cornering. Includes integrated head protection and harness slots.',
    performanceGain: 'Improved Driver Control',
    difficulty: 'medium',
    rating: 4.8,
    reviews: 82,
    imageUrl: 'https://images.pexels.com/photos/3806288/pexels-photo-3806288.jpeg?auto=compress&cs=tinysrgb&w=400',
    additionalImages: [
      'https://images.pexels.com/photos/3806288/pexels-photo-3806288.jpeg?auto=compress&cs=tinysrgb&w=400'
    ],
    inStock: true,
    brand: 'Sparco',
    installTime: '2-3 hours',
    partNumber: '00961NR',
    warranty: '2 Year Limited Warranty',
    specifications: {
      'Shell Material': 'Fiberglass Composite',
      'Upholstery': 'High-Grip Fabric',
      'Weight': '19.8 lbs',
      'FIA Approval': '8855-1999',
      'Side Support': 'Extra Large Bolsters',
      'Harness Slots': '5',
      'Mounting': 'Side Mount'
    },
    compatibility: [
      'Universal with proper brackets',
      'Requires vehicle-specific mounting brackets'
    ],
    installation: {
      tools: ['Socket set', 'Torque wrench', 'Vehicle-specific brackets', 'Drill (if needed)'],
      steps: [
        'Remove factory seats',
        'Install seat brackets to vehicle floor',
        'Mount Sparco seat to brackets',
        'Secure all mounting hardware',
        'Install harness if applicable'
      ],
      tips: [
        'Order vehicle-specific brackets separately',
        'Check seat position before final installation',
        'Ensure proper clearance for recline/slide mechanisms'
      ]
    },
    reviews_data: [
      {
        author: 'Rally_Driver',
        rating: 5,
        date: '2024-02-28',
        title: 'Excellent support for aggressive driving',
        content: 'These seats hold you firmly in place during hard cornering. Much better control of the car when pushing the limits.',
        verified: true
      }
    ],
    certifications: ['FIA 8855-1999', 'ISO 9001:2015'],
    shipping: {
      weight: '25 lbs',
      dimensions: '34" x 22" x 26"',
      freeShipping: true,
      estimatedDays: '5-7 business days'
    }
  },

  {
    id: 'int-003',
    name: 'NRG Quick Release Steering Wheel Hub',
    category: 'interior',
    make: 'Honda',
    model: 'Civic Type R',
    year: 2020,
    price: 179,
    originalPrice: 199,
    description: 'Quick release hub adapter for aftermarket steering wheels with security lock and two-tone finish.',
    detailedDescription: 'The NRG Quick Release hub allows for easy removal of aftermarket steering wheels. Features a security lock system and self-locking mechanism for safety and reliability.',
    performanceGain: 'Enhanced Steering Feel',
    difficulty: 'medium',
    rating: 4.6,
    reviews: 124,
    imageUrl: 'https://images.pexels.com/photos/3806288/pexels-photo-3806288.jpeg?auto=compress&cs=tinysrgb&w=400',
    additionalImages: [
      'https://images.pexels.com/photos/3806288/pexels-photo-3806288.jpeg?auto=compress&cs=tinysrgb&w=400'
    ],
    inStock: true,
    brand: 'NRG',
    installTime: '1-2 hours',
    partNumber: 'SRK-200BK',
    warranty: '1 Year Limited Warranty',
    specifications: {
      'Material': 'Aluminum',
      'Finish': 'Black/Neo Chrome',
      'Lock System': 'Gen 3.0',
      'Bolt Pattern': '6x70mm & 6x74mm',
      'Release Mechanism': 'Pull Ring',
      'Weight': '1.5 lbs',
      'Horn Wiring': 'Included'
    },
    compatibility: [
      'Universal with NRG short hubs',
      'Requires vehicle-specific short hub'
    ],
    installation: {
      tools: ['Socket set', 'Steering wheel puller', 'Wire cutters/strippers', 'Electrical tape'],
      steps: [
        'Disconnect battery',
        'Remove factory steering wheel',
        'Install vehicle-specific short hub',
        'Connect horn wiring',
        'Install quick release hub',
        'Attach aftermarket steering wheel'
      ],
      tips: [
        'Purchase vehicle-specific short hub separately',
        'Label all electrical connections',
        'Test horn function before final assembly',
        'Apply thread locker to all fasteners'
      ]
    },
    reviews_data: [
      {
        author: 'Type_R_Enthusiast',
        rating: 5,
        date: '2024-03-10',
        title: 'Solid construction, easy installation',
        content: 'The build quality is excellent and the locking mechanism is secure. Makes swapping wheels a breeze.',
        verified: true
      }
    ],
    certifications: ['ISO 9001:2015'],
    shipping: {
      weight: '2.5 lbs',
      dimensions: '8" x 8" x 4"',
      freeShipping: true,
      estimatedDays: '2-3 business days'
    }
  },

  // Additional parts for more categories
  {
    id: 'wheel-001',
    name: 'HRE P101 Forged Wheels - 19"',
    category: 'wheels',
    make: 'BMW',
    model: 'M4',
    year: 2021,
    price: 6999,
    description: 'Premium forged monoblock wheels with custom finish options. Significant weight reduction over factory wheels.',
    detailedDescription: 'HRE P101 wheels are precision-engineered and forged from aerospace-grade 6061-T6 aluminum. Each wheel is custom-made to order with your choice of finish and specifications for perfect fitment.',
    performanceGain: 'Reduced Unsprung Weight',
    difficulty: 'easy',
    rating: 4.9,
    reviews: 42,
    imageUrl: 'https://images.pexels.com/photos/3806288/pexels-photo-3806288.jpeg?auto=compress&cs=tinysrgb&w=400',
    additionalImages: [
      'https://images.pexels.com/photos/3806288/pexels-photo-3806288.jpeg?auto=compress&cs=tinysrgb&w=400'
    ],
    inStock: true,
    brand: 'HRE',
    installTime: '1-2 hours',
    partNumber: 'P101-BMW-M4-19',
    warranty: 'Limited Lifetime Structural Warranty',
    specifications: {
      'Construction': 'Forged Monoblock',
      'Material': '6061-T6 Aluminum',
      'Size': '19x9.5" Front, 19x11" Rear',
      'Weight': '19-21 lbs per wheel',
      'Finish': 'Custom Options Available',
      'Bolt Pattern': '5x120',
      'Center Bore': '72.56mm'
    },
    compatibility: [
      '2015-2023 BMW M3/M4',
      '2018-2023 BMW M5',
      'Custom fitments available'
    ],
    installation: {
      tools: ['Torque wrench', 'Socket set', 'Jack and stands'],
      steps: [
        'Raise vehicle and secure on stands',
        'Remove factory wheels',
        'Install new HRE wheels with proper torque',
        'Lower vehicle and final torque check'
      ],
      tips: [
        'Use torque wrench to factory specifications',
        'Re-torque after 50-100 miles',
        'Use proper wheel locks if included'
      ]
    },
    reviews_data: [
      {
        author: 'M4_Collector',
        rating: 5,
        date: '2024-03-15',
        title: 'Perfection in wheel form',
        content: 'The quality and craftsmanship are unmatched. Significant weight savings over factory wheels and the custom finish is flawless.',
        verified: true
      }
    ],
    certifications: ['JWL', 'VIA', 'ISO 9001:2015'],
    shipping: {
      weight: '100 lbs (set)',
      dimensions: '30" x 30" x 30"',
      freeShipping: true,
      estimatedDays: '4-6 weeks (custom made)'
    }
  },

  {
    id: 'fuel-001',
    name: 'Injector Dynamics ID1050X Fuel Injectors',
    category: 'fuel',
    make: 'Subaru',
    model: 'WRX STI',
    year: 2020,
    price: 999,
    description: 'High-flow fuel injectors with excellent linearity and response for modified engines.',
    detailedDescription: 'Injector Dynamics ID1050X injectors feature XDS technology for exceptional linearity and response. Each set is data-matched to within 1% for perfect cylinder-to-cylinder consistency.',
    performanceGain: 'Supports up to 650 WHP (E85)',
    difficulty: 'medium',
    rating: 4.9,
    reviews: 76,
    imageUrl: 'https://images.pexels.com/photos/3806288/pexels-photo-3806288.jpeg?auto=compress&cs=tinysrgb&w=400',
    additionalImages: [
      'https://images.pexels.com/photos/3806288/pexels-photo-3806288.jpeg?auto=compress&cs=tinysrgb&w=400'
    ],
    inStock: true,
    brand: 'Injector Dynamics',
    installTime: '2-3 hours',
    partNumber: '1050X-STI',
    warranty: '1 Year Limited Warranty',
    specifications: {
      'Flow Rate': '1065 cc/min at 3.0 Bar',
      'Connector': 'USCAR',
      'Impedance': 'High Impedance',
      'Filter': 'Internal',
      'O-rings': 'Included',
      'Data-Matched': 'Within 1%',
      'Compatible Fuels': 'Gasoline, E85, Methanol'
    },
    compatibility: [
      '2004-2021 Subaru WRX STI',
      '2002-2014 Subaru WRX',
      'Universal with proper adapters'
    ],
    installation: {
      tools: ['Fuel line tools', 'Socket set', 'Torque wrench', 'Fuel pressure gauge'],
      steps: [
        'Relieve fuel pressure',
        'Remove fuel rail with factory injectors',
        'Replace injectors with ID1050X',
        'Reinstall fuel rail',
        'Check for leaks',
        'Update ECU calibration'
      ],
      tips: [
        'Replace all o-rings and seals',
        'Professional tuning required',
        'Use fuel injector grease on o-rings',
        'Pressure test system before starting'
      ]
    },
    reviews_data: [
      {
        author: 'STI_Builder',
        rating: 5,
        date: '2024-02-10',
        title: 'Best injectors for E85 builds',
        content: 'Perfect linearity and consistency. My tuner was impressed with how well they performed across the entire RPM range.',
        verified: true
      }
    ],
    certifications: ['ISO 9001:2015'],
    shipping: {
      weight: '2 lbs',
      dimensions: '8" x 6" x 4"',
      freeShipping: true,
      estimatedDays: '2-3 business days'
    }
  },

  {
    id: 'oil-001',
    name: 'Mishimoto Oil Cooler Kit',
    category: 'engine',
    make: 'Ford',
    model: 'Mustang GT',
    year: 2020,
    price: 699,
    originalPrice: 799,
    description: 'Direct-fit oil cooler kit with thermostatic sandwich plate for optimal oil temperature control.',
    detailedDescription: 'The Mishimoto Oil Cooler Kit features a 19-row stacked-plate cooler, thermostatic sandwich plate, and all necessary hardware for installation. Maintains optimal oil temperatures even under extreme conditions.',
    performanceGain: 'Reduced Oil Temperatures',
    difficulty: 'medium',
    rating: 4.7,
    reviews: 68,
    imageUrl: 'https://images.pexels.com/photos/3806288/pexels-photo-3806288.jpeg?auto=compress&cs=tinysrgb&w=400',
    additionalImages: [
      'https://images.pexels.com/photos/3806288/pexels-photo-3806288.jpeg?auto=compress&cs=tinysrgb&w=400'
    ],
    inStock: true,
    brand: 'Mishimoto',
    installTime: '3-4 hours',
    partNumber: 'MMOC-MUS-15T',
    warranty: 'Lifetime Warranty',
    specifications: {
      'Cooler Type': '19-Row Stacked Plate',
      'Sandwich Plate': 'Thermostatic (180°F)',
      'Lines': 'Braided Stainless Steel',
      'Fittings': 'AN-10',
      'Mounting': 'Direct Fit',
      'Temperature Reduction': '30-50°F',
      'Finish': 'Black'
    },
    compatibility: [
      '2015-2023 Ford Mustang GT 5.0L',
      '2016-2023 Ford Mustang Shelby GT350'
    ],
    installation: {
      tools: ['Oil filter wrench', 'Socket set', 'Torque wrench', 'Oil drain pan'],
      steps: [
        'Drain engine oil',
        'Remove oil filter',
        'Install thermostatic sandwich plate',
        'Mount oil cooler in front of radiator',
        'Connect oil lines',
        'Fill with fresh oil and test'
      ],
      tips: [
        'Use thread sealant on fittings',
        'Route lines away from moving parts and heat sources',
        'Bleed air from system before driving',
        'Monitor oil pressure after installation'
      ]
    },
    reviews_data: [
      {
        author: 'Track_Day_Mustang',
        rating: 5,
        date: '2024-03-05',
        title: 'Essential for track use',
        content: 'Oil temperatures stay below 220°F even after multiple hot laps. Installation was straightforward with the included instructions.',
        verified: true
      }
    ],
    certifications: ['ISO 9001:2015'],
    shipping: {
      weight: '18 lbs',
      dimensions: '24" x 16" x 8"',
      freeShipping: true,
      estimatedDays: '3-5 business days'
    }
  },

  {
    id: 'cooling-001',
    name: 'CSF High-Performance Aluminum Radiator',
    category: 'engine',
    make: 'BMW',
    model: 'M3',
    year: 2020,
    price: 899,
    description: 'All-aluminum racing radiator with B-tube technology for maximum cooling efficiency.',
    detailedDescription: 'CSF\'s high-performance radiator features all-aluminum construction with B-tube technology for improved heat dissipation. Includes built-in oil cooler and transmission cooler for complete thermal management.',
    performanceGain: 'Reduced Engine Temperatures',
    difficulty: 'medium',
    rating: 4.8,
    reviews: 54,
    imageUrl: 'https://images.pexels.com/photos/3806288/pexels-photo-3806288.jpeg?auto=compress&cs=tinysrgb&w=400',
    additionalImages: [
      'https://images.pexels.com/photos/3806288/pexels-photo-3806288.jpeg?auto=compress&cs=tinysrgb&w=400'
    ],
    inStock: true,
    brand: 'CSF',
    installTime: '3-4 hours',
    partNumber: '7062',
    warranty: '2 Year Limited Warranty',
    specifications: {
      'Core Type': 'B-Tube Technology',
      'Material': 'All Aluminum',
      'Rows': '42mm Dual Pass',
      'Fins': 'Louvered',
      'Integrated Coolers': 'Oil & Transmission',
      'Capacity': '+40% Over Stock',
      'Pressure Tested': '150 PSI'
    },
    compatibility: [
      '2015-2020 BMW M3 (F80)',
      '2015-2020 BMW M4 (F82/F83)'
    ],
    installation: {
      tools: ['Coolant drain pan', 'Socket set', 'Hose clamp pliers', 'Torque wrench'],
      steps: [
        'Drain cooling system',
        'Remove front bumper cover',
        'Remove factory radiator',
        'Transfer sensors and fittings',
        'Install CSF radiator',
        'Refill and bleed cooling system'
      ],
      tips: [
        'Use proper BMW coolant',
        'Follow bleeding procedure carefully',
        'Pressure test system before driving',
        'Replace all hoses and clamps if worn'
      ]
    },
    reviews_data: [
      {
        author: 'M3_Track_Day',
        rating: 5,
        date: '2024-02-25',
        title: 'No more overheating on track',
        content: 'Temperatures stay consistent even after multiple sessions on hot days. Fitment is perfect and the quality is excellent.',
        verified: true
      }
    ],
    certifications: ['ISO 9001:2015'],
    shipping: {
      weight: '35 lbs',
      dimensions: '32" x 24" x 6"',
      freeShipping: true,
      estimatedDays: '3-5 business days'
    }
  },

  {
    id: 'susp-001',
    name: 'Whiteline Front and Rear Sway Bar Kit',
    category: 'suspension',
    make: 'Subaru',
    model: 'WRX',
    year: 2021,
    price: 599,
    originalPrice: 699,
    description: 'Adjustable front and rear sway bars with polyurethane bushings for reduced body roll and improved handling.',
    detailedDescription: 'Whiteline sway bar kit includes adjustable front and rear sway bars with multiple stiffness settings. Features 4140 chromoly steel construction and polyurethane bushings for precise handling.',
    performanceGain: 'Reduced Body Roll, Improved Turn-in',
    difficulty: 'medium',
    rating: 4.7,
    reviews: 128,
    imageUrl: 'https://images.pexels.com/photos/3806288/pexels-photo-3806288.jpeg?auto=compress&cs=tinysrgb&w=400',
    additionalImages: [
      'https://images.pexels.com/photos/3806288/pexels-photo-3806288.jpeg?auto=compress&cs=tinysrgb&w=400'
    ],
    inStock: true,
    brand: 'Whiteline',
    installTime: '3-4 hours',
    partNumber: 'BSK017',
    warranty: '3 Year Limited Warranty',
    specifications: {
      'Material': '4140 Chromoly Steel',
      'Front Bar Diameter': '24mm (Adjustable)',
      'Rear Bar Diameter': '22mm (Adjustable)',
      'Bushings': 'Polyurethane',
      'Adjustment': '3-position',
      'Finish': 'Powder Coated',
      'Hardware': 'Included'
    },
    compatibility: [
      '2015-2023 Subaru WRX',
      '2015-2023 Subaru WRX STI'
    ],
    installation: {
      tools: ['Socket set', 'Jack and stands', 'Torque wrench', 'Penetrating oil'],
      steps: [
        'Raise vehicle and secure on stands',
        'Remove factory sway bars',
        'Install new polyurethane bushings',
        'Mount Whiteline sway bars',
        'Set desired stiffness setting',
        'Torque all hardware to specifications'
      ],
      tips: [
        'Use penetrating oil on factory hardware',
        'Apply grease to bushings before installation',
        'Start with middle stiffness setting',
        'Check all connections after 500 miles'
      ]
    },
    reviews_data: [
      {
        author: 'WRX_Autocrosser',
        rating: 5,
        date: '2024-03-12',
        title: 'Transformed the handling',
        content: 'Dramatic reduction in body roll and much more neutral handling. The adjustability lets you fine-tune for your driving style.',
        verified: true
      }
    ],
    certifications: ['ISO 9001:2015'],
    shipping: {
      weight: '25 lbs',
      dimensions: '60" x 12" x 8"',
      freeShipping: true,
      estimatedDays: '3-5 business days'
    }
  },
  {
    id: 'tp-006',
    name: 'Garrett G25-660 Turbocharger Kit',
    brand: 'Garrett',
    category: 'engine',
    make: 'Subaru',
    model: 'WRX STI',
    year: 2015,
    description: 'High-performance turbocharger kit for significant power gains and improved throttle response.',
    detailedDescription: 'The Garrett G25-660 turbocharger kit is designed for enthusiasts seeking substantial horsepower and torque increases. Featuring a lightweight, high-flow turbine wheel and a forged, fully-machined compressor wheel, it delivers rapid spool-up and sustained power throughout the RPM range. This kit includes all necessary components for installation, though professional tuning is highly recommended.',
    price: 3299.99,
    originalPrice: 3500.00,
    performanceGain: '+150-200 HP',
    installTime: '12-16 hours',
    difficulty: 'expert',
    rating: 4.9,
    reviews: 75,
    partNumber: '871388-5001S',
    inStock: true,
    isPopular: true,
    isBestSeller: false,
    additionalImages: [
      'https://images.pexels.com/photos/164634/pexels-photo-164634.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      'https://images.pexels.com/photos/100741/pexels-photo-100741.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      'https://images.pexels.com/photos/1035108/pexels-photo-1035108.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
    ],
    safetyNotes: [
      'Requires professional installation and engine tuning.',
      'May void factory warranty.',
      'Not street legal in all regions; check local regulations.'
    ],
    certifications: ['ISO 9001'],
    specifications: {
      'Compressor Wheel Inducer': '54mm',
      'Turbine Wheel Exducer': '49mm',
      'Horsepower Rating': '350-660 HP',
      'Turbine Housing A/R': '0.72',
      'Bearing Type': 'Ceramic Ball Bearing'
    },
    compatibility: [
      'Subaru WRX STI 2015-2021',
      'Subaru Impreza WRX 2008-2014 (with modifications)'
    ],
    technicalDocs: [
      { title: 'Garrett G25-660 Installation Manual', type: 'PDF', url: '#' },
      { title: 'Turbocharger Sizing Guide', type: 'PDF', url: '#' }
    ],
    installation: {
      tools: ['Full Metric Socket Set', 'Torque Wrench', 'Jack Stands', 'Engine Hoist (recommended)', 'OBD-II Scanner'],
      steps: [
        'Drain coolant and oil.',
        'Remove existing turbocharger and exhaust components.',
        'Install new turbocharger and associated piping.',
        'Connect oil and coolant lines.',
        'Reinstall exhaust and intake components.',
        'Refill fluids and perform initial leak check.',
        'Perform professional ECU tune.'
      ],
      tips: [
        'Ensure all connections are torqued to spec to prevent leaks.',
        'Use new gaskets and seals for all connections.',
        'Consider upgrading fuel system and intercooler for optimal performance.'
      ]
    },
    reviews_data: [
      { author: 'TurboNut', rating: 5, title: 'Unbelievable Power!', content: 'This turbo transformed my STI. Spools incredibly fast and pulls hard all the way to redline. Highly recommend!', date: '2024-05-20', verified: true },
      { author: 'BoostedLife', rating: 4, title: 'Great Kit, Complex Install', content: 'The kit is comprehensive, but the installation is definitely not for beginners. Performance is fantastic once tuned.', date: '2024-04-10', verified: true }
    ],
    shipping: {
      freeShipping: true,
      estimatedDays: '5-7 business days'
    }
  },
  {
    id: 'tp-007',
    name: 'KW V3 Coilover Suspension Kit',
    brand: 'KW Suspensions',
    category: 'suspension',
    make: 'BMW',
    model: 'M3 (F80)',
    year: 2015,
    description: 'Adjustable coilover kit for superior handling and ride comfort on street and track.',
    detailedDescription: 'The KW V3 coilover kit offers independent rebound and compression damping adjustments, allowing for precise tuning of your vehicle\'s handling characteristics. Stainless steel construction ensures durability and corrosion resistance. Ideal for drivers who demand high performance without sacrificing daily drivability.',
    price: 2899.00,
    originalPrice: 3000.00,
    performanceGain: 'Improved Handling, Reduced Body Roll',
    installTime: '6-8 hours',
    difficulty: 'hard',
    rating: 4.8,
    reviews: 120,
    partNumber: '35220087',
    inStock: true,
    isPopular: true,
    isBestSeller: true,
    additionalImages: [
      'https://images.pexels.com/photos/112460/pexels-photo-112460.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      'https://images.pexels.com/photos/100656/pexels-photo-100656.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
    ],
    safetyNotes: [
      'Professional alignment required after installation.',
      'Improper installation can affect vehicle stability.'
    ],
    certifications: ['TÜV Approved'],
    specifications: {
      'Lowering Range Front': '15-40mm',
      'Lowering Range Rear': '10-35mm',
      'Damping Adjustment': 'Independent Rebound & Compression',
      'Material': 'Stainless Steel'
    },
    compatibility: [
      'BMW M3 (F80) 2015-2018',
      'BMW M4 (F82/F83) 2015-2020'
    ],
    technicalDocs: [
      { title: 'KW V3 Installation Instructions', type: 'PDF', url: '#' },
      { title: 'KW V3 Damping Adjustment Guide', type: 'PDF', url: '#' }
    ],
    installation: {
      tools: ['Spring Compressor', 'Metric Socket Set', 'Torque Wrench', 'Jack Stands', 'Alignment Machine'],
      steps: [
        'Safely lift vehicle and remove wheels.',
        'Remove OEM suspension components.',
        'Assemble and install KW V3 coilovers.',
        'Adjust ride height and initial damping settings.',
        'Reinstall wheels and lower vehicle.',
        'Perform professional wheel alignment.'
      ],
      tips: [
        'Start with recommended damping settings and fine-tune to your preference.',
        'Ensure proper spring preload for optimal performance.',
        'Consider replacing top mounts for best results.'
      ]
    },
    reviews_data: [
      { author: 'BimmerFan', rating: 5, title: 'Transforms the M3!', content: 'The V3s are incredible. The car feels so much more planted and responsive. Worth every penny.', date: '2024-06-01', verified: true },
      { author: 'TrackAddict', rating: 4, title: 'Excellent for Track Days', content: 'Handles track abuse perfectly. Takes some time to dial in the settings, but the adjustability is amazing.', date: '2024-05-15', verified: true }
    ],
    shipping: {
      freeShipping: true,
      estimatedDays: '3-5 business days'
    }
  },
  {
    id: 'tp-008',
    name: 'Borla S-Type Cat-Back Exhaust System',
    brand: 'Borla',
    category: 'exhaust',
    make: 'Ford',
    model: 'Mustang GT',
    year: 2018,
    description: 'Aggressive exhaust note with improved flow and horsepower.',
    detailedDescription: 'The Borla S-Type cat-back exhaust system delivers a classic, aggressive muscle car sound without excessive drone. Constructed from T-304 stainless steel for maximum durability and corrosion resistance, it features mandrel-bent tubing for optimal exhaust flow. This system is a direct bolt-on replacement for the factory exhaust.',
    price: 1249.99,
    originalPrice: 1300.00,
    performanceGain: '+10-15 HP, Enhanced Sound',
    installTime: '2-3 hours',
    difficulty: 'medium',
    rating: 4.7,
    reviews: 250,
    partNumber: '140969BC',
    inStock: true,
    isPopular: true,
    isBestSeller: true,
    additionalImages: [
      'https://images.pexels.com/photos/1035108/pexels-photo-1035108.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      'https://images.pexels.com/photos/100741/pexels-photo-100741.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
    ],
    safetyNotes: [
      'Ensure proper clearance from heat-sensitive components.',
      'Check local noise regulations.'
    ],
    certifications: ['SAE J1169'],
    specifications: {
      'Material': 'T-304 Stainless Steel',
      'Tip Style': 'Dual Round Rolled Angle-Cut',
      'Inlet Diameter': '3.0 inches',
      'Outlet Diameter': '2.5 inches',
      'Sound Level': 'Aggressive'
    },
    compatibility: [
      'Ford Mustang GT 5.0L 2018-2023'
    ],
    technicalDocs: [
      { title: 'Borla S-Type Installation Guide', type: 'PDF', url: '#' }
    ],
    installation: {
      tools: ['Metric Socket Set', 'Ratchet', 'Exhaust Hanger Removal Tool', 'Penetrating Oil'],
      steps: [
        'Safely lift vehicle and support with jack stands.',
        'Remove factory cat-back exhaust system.',
        'Install new Borla S-Type system, ensuring proper alignment.',
        'Tighten all clamps and bolts.',
        'Check for exhaust leaks.'
      ],
      tips: [
        'Lubricate rubber hangers for easier removal and installation.',
        'Have a friend help support the exhaust during removal/installation.',
        'Allow exhaust to cool completely before working on it.'
      ]
    },
    reviews_data: [
      { author: 'MustangFan', rating: 5, title: 'Perfect Sound!', content: 'This exhaust sounds absolutely incredible. Deep, aggressive tone without being obnoxious on the highway.', date: '2024-05-28', verified: true },
      { author: 'GearHead', rating: 4, title: 'Easy Install, Great Quality', content: 'Took me about 2 hours to install in my garage. The quality is top-notch and the sound is exactly what I wanted.', date: '2024-05-10', verified: true }
    ],
    shipping: {
      freeShipping: true,
      estimatedDays: '4-6 business days'
    }
  },
  {
    id: 'tp-009',
    name: 'Brembo GT 6-Piston Big Brake Kit',
    brand: 'Brembo',
    category: 'brakes',
    make: 'Porsche',
    model: '911 Carrera (991)',
    year: 2012,
    description: 'Ultimate braking performance for street and track applications.',
    detailedDescription: 'The Brembo GT 6-Piston Big Brake Kit provides unparalleled stopping power and fade resistance. Featuring large, drilled or slotted two-piece rotors and high-performance calipers, this kit significantly improves thermal capacity and pedal feel. Designed for direct bolt-on installation, it is a must-have for spirited driving and track use.',
    price: 4999.00,
    originalPrice: 5500.00,
    performanceGain: 'Superior Stopping Power, Zero Fade',
    installTime: '8-10 hours',
    difficulty: 'hard',
    rating: 4.9,
    reviews: 60,
    partNumber: '1N1.8001A',
    inStock: false,
    isPopular: false,
    isBestSeller: false,
    additionalImages: [
      'https://images.pexels.com/photos/100741/pexels-photo-100741.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      'https://images.pexels.com/photos/112460/pexels-photo-112460.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
    ],
    safetyNotes: [
      'Requires professional installation and brake fluid flush.',
      'May require larger wheels for clearance.',
      'Not compatible with all wheel designs.'
    ],
    certifications: ['DOT Compliant'],
    specifications: {
      'Caliper Type': '6-Piston Fixed',
      'Rotor Size': '380x34mm',
      'Rotor Type': 'Two-Piece, Drilled/Slotted',
      'Piston Material': 'Aluminum',
      'Brake Pad Compound': 'High Performance Street/Track'
    },
    compatibility: [
      'Porsche 911 Carrera (991) 2012-2019',
      'Porsche 911 Carrera S (991) 2012-2019'
    ],
    technicalDocs: [
      { title: 'Brembo GT Kit Installation Manual', type: 'PDF', url: '#' },
      { title: 'Brembo Brake Bleeding Guide', type: 'PDF', url: '#' }
    ],
    installation: {
      tools: ['Metric Socket Set', 'Torque Wrench', 'Brake Bleeder Kit', 'Jack Stands', 'Brake Fluid'],
      steps: [
        'Safely lift vehicle and remove wheels.',
        'Remove factory brake calipers and rotors.',
        'Install Brembo calipers and rotors, ensuring proper fitment.',
        'Connect brake lines and bleed the entire brake system.',
        'Reinstall wheels and perform initial brake bedding procedure.'
      ],
      tips: [
        'Use high-quality DOT4 or DOT5.1 brake fluid.',
        'Bed-in new pads and rotors according to manufacturer instructions.',
        'Ensure no air is left in the brake lines after bleeding.'
      ]
    },
    reviews_data: [
      { author: 'PorscheDriver', rating: 5, title: 'Confidence Inspiring', content: 'These brakes are phenomenal. The pedal feel is firm and consistent, and I have absolute confidence on the track now.', date: '2024-04-01', verified: true },
      { author: 'TrackDayHero', rating: 5, title: 'No More Fade!', content: 'Finally, brakes that can handle multiple laps without fading. A game-changer for track days.', date: '2024-03-15', verified: true }
    ],
    shipping: {
      freeShipping: true,
      estimatedDays: '7-10 business days'
    }
  },
  {
    id: 'tp-010',
    name: 'APR Carbon Fiber Cold Air Intake',
    brand: 'APR',
    category: 'engine',
    make: 'Volkswagen',
    model: 'Golf R',
    year: 2018,
    description: 'Enhanced engine sound and minor horsepower gains with a premium carbon fiber finish.',
    detailedDescription: 'The APR Carbon Fiber Cold Air Intake system is designed to improve airflow to your engine, resulting in a more aggressive induction sound and a slight increase in horsepower and torque. Its high-quality carbon fiber construction not only looks great under the hood but also helps reduce intake air temperatures. This is a direct bolt-on upgrade.',
    price: 599.99,
    originalPrice: 650.00,
    performanceGain: '+5-10 HP, Improved Sound',
    installTime: '1-2 hours',
    difficulty: 'easy',
    rating: 4.6,
    reviews: 180,
    partNumber: 'CI100020',
    inStock: true,
    isPopular: true,
    isBestSeller: false,
    additionalImages: [
      'https://images.pexels.com/photos/164634/pexels-photo-164634.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      'https://images.pexels.com/photos/100741/pexels-photo-100741.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
    ],
    safetyNotes: [
      'Ensure all clamps are tightened to prevent air leaks.',
      'Regularly clean or replace air filter element.'
    ],
    certifications: ['CARB Exempt (some models)'],
    specifications: {
      'Material': 'Carbon Fiber',
      'Filter Type': 'Dry Cotton',
      'Inlet Diameter': '3.5 inches',
      'Heat Shield': 'Integrated'
    },
    compatibility: [
      'Volkswagen Golf R (MK7/MK7.5) 2015-2021',
      'Audi S3 (8V) 2015-2020'
    ],
    technicalDocs: [
      { title: 'APR Cold Air Intake Installation Guide', type: 'PDF', url: '#' }
    ],
    installation: {
      tools: ['Screwdriver Set', 'Metric Socket Set', 'Pliers'],
      steps: [
        'Remove factory airbox and intake piping.',
        'Install new APR intake system, ensuring all connections are secure.',
        'Tighten clamps and recheck all fittings.'
      ],
      tips: [
        'Take care not to damage the MAF sensor during removal/installation.',
        'Ensure the heat shield is properly sealed to prevent hot engine air from entering the intake.'
      ]
    },
    reviews_data: [
      { author: 'VWGolfR', rating: 5, title: 'Looks and Sounds Amazing!', content: 'The carbon fiber looks fantastic, and the induction sound is much more noticeable. Definitely worth it for the aesthetics and sound alone.', date: '2024-06-10', verified: true },
      { author: 'DailyDriver', rating: 4, title: 'Easy Upgrade', content: 'Very straightforward installation. Not a huge power gain, but the improved throttle response and sound are great for a daily driver.', date: '2024-05-25', verified: true }
    ],
    shipping: {
      freeShipping: true,
      estimatedDays: '3-5 business days'
    }
  }
];

// Helper functions for filtering and searching
export const getPartsByCategory = (category: string): TuningPart[] => {
  return tuningPartsDatabase.filter(part => part.category === category);
};

export const getPartsByMake = (make: string): TuningPart[] => {
  return tuningPartsDatabase.filter(part => part.make.toLowerCase() === make.toLowerCase());
};

export const getPartsByPriceRange = (min: number, max: number): TuningPart[] => {
  return tuningPartsDatabase.filter(part => part.price >= min && part.price <= max);
};

export const searchParts = (query: string): TuningPart[] => {
  const lowerQuery = query.toLowerCase();
  return tuningPartsDatabase.filter(part =>
    part.name.toLowerCase().includes(lowerQuery) ||
    part.brand.toLowerCase().includes(lowerQuery) ||
    part.make.toLowerCase().includes(lowerQuery) ||
    part.model.toLowerCase().includes(lowerQuery) ||
    part.description.toLowerCase().includes(lowerQuery) ||
    part.category.toLowerCase().includes(lowerQuery)
  );
};

export const getPopularParts = (): TuningPart[] => {
  return tuningPartsDatabase.filter(part => part.isPopular);
};

export const getBestSellerParts = (): TuningPart[] => {
  return tuningPartsDatabase.filter(part => part.isBestSeller);
};

export const getPartsOnSale = (): TuningPart[] => {
  return tuningPartsDatabase.filter(part => part.originalPrice && part.originalPrice > part.price);
};

// Categories for navigation
export const categories = [
  { id: 'intake', name: 'Intake Systems', description: 'Cold air intakes and filters' },
  { id: 'exhaust', name: 'Exhaust Systems', description: 'Cat-back and turbo-back exhausts' },
  { id: 'brakes', name: 'Brake Systems', description: 'Big brake kits and components' },
  { id: 'suspension', name: 'Suspension', description: 'Coilovers and handling upgrades' },
  { id: 'turbo', name: 'Forced Induction', description: 'Turbochargers and superchargers' },
  { id: 'electronics', name: 'ECU Tuning', description: 'Engine management and tuning' },
  { id: 'transmission', name: 'Drivetrain', description: 'Clutches and transmission upgrades' },
  { id: 'exterior', name: 'Exterior', description: 'Aerodynamic and styling components' },
  { id: 'interior', name: 'Interior', description: 'Racing seats and interior upgrades' },
  { id: 'wheels', name: 'Wheels & Tires', description: 'Performance wheels and tires' },
  { id: 'fuel', name: 'Fuel Systems', description: 'Injectors, pumps, and rails' },
  { id: 'engine', name: 'Engine Components', description: 'Internal engine parts and cooling' }
];

// Popular brands
export const popularBrands = [
  'K&N', 'Borla', 'Brembo', 'KW', 'Garrett', 'COBB', 'APR', 'Recaro',
  'AEM', 'Akrapovič', 'StopTech', 'Bilstein', 'Clutch Masters', 'Mishimoto',
  'Eibach', 'HRE', 'Sparco', 'Wilwood', 'Edelbrock', 'Whiteline', 'Seibon',
  'Voltex', 'Injector Dynamics', 'South Bend', 'Wavetrac', 'Magnaflow', 'Ohlins'
];

// Safety disclaimers
export const safetyDisclaimers = [
  'Professional installation recommended for complex modifications',
  'Modifications may affect vehicle warranty',
  'Check local laws and regulations before installation',
  'Proper tuning required for forced induction upgrades',
  'Regular maintenance intervals may change with performance modifications',
  'Track use may require additional safety equipment',
  'Some modifications may not be street legal in all areas',
  'Ensure all safety systems remain functional after modifications',
  'Performance driving requires additional driver training',
  'Increased power requires appropriate supporting modifications',
  'Consult with a professional before making multiple modifications'
];