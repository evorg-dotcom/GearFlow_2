import React, { useState, useEffect } from 'react';
import { Search, AlertTriangle, CheckCircle, Clock, Wrench, DollarSign, User, ThumbsUp, Shield, Lock, Star, TrendingUp } from 'lucide-react';

interface CommonIssue {
  id: string;
  title: string;
  description: string;
  make: string;
  model: string;
  yearRange: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  symptoms: string[];
  causes: string[];
  solutions: string[];
  estimatedCost: string;
  difficulty: 'easy' | 'medium' | 'hard' | 'expert';
  preventionTips: string[];
  relatedParts: string[];
  reportedBy: number;
  lastUpdated: Date;
  isAdminVerified?: boolean;
  adminNotes?: string;
  affectedVehicles?: number;
  recallInfo?: {
    hasRecall: boolean;
    recallNumber?: string;
    description?: string;
  };
}

const CommonIssues: React.FC = () => {
  const [issues, setIssues] = useState<CommonIssue[]>([]);
  const [filteredIssues, setFilteredIssues] = useState<CommonIssue[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSeverity, setSelectedSeverity] = useState('all');
  const [selectedMake, setSelectedMake] = useState('all');
  const [showAdminOnly, setShowAdminOnly] = useState(false);
  const [loading, setLoading] = useState(true);

  const severities = ['all', 'low', 'medium', 'high', 'critical'];
  const makes = ['all', 'Honda', 'Toyota', 'BMW', 'Audi', 'Volkswagen', 'Subaru', 'Ford', 'Chevrolet', 'Nissan', 'Mazda', 'Hyundai'];

  useEffect(() => {
    // Simulate API call to fetch common issues (including admin-verified ones)
    const mockIssues: CommonIssue[] = [
      // ADMIN-VERIFIED CRITICAL ISSUES
      {
        id: 'admin-1',
        title: 'Takata Airbag Inflator Defect',
        description: 'Defective airbag inflators can rupture and send metal fragments into the vehicle cabin, potentially causing serious injury or death.',
        make: 'Honda',
        model: 'Civic',
        yearRange: '2001-2016',
        severity: 'critical',
        symptoms: [
          'Airbag warning light',
          'No airbag deployment in crash',
          'Abnormal airbag deployment',
          'Metal fragments in cabin after deployment'
        ],
        causes: [
          'Moisture exposure to ammonium nitrate propellant',
          'Manufacturing defect in inflator',
          'Age-related degradation',
          'Temperature cycling'
        ],
        solutions: [
          'Immediate recall repair at authorized dealer',
          'Replace airbag inflator assembly',
          'Do not drive until repaired',
          'Contact manufacturer immediately'
        ],
        estimatedCost: 'FREE (Recall Repair)',
        difficulty: 'expert',
        preventionTips: [
          'Check recall status regularly',
          'Register vehicle with manufacturer',
          'Respond to recall notices immediately',
          'Avoid driving if recall notice received'
        ],
        relatedParts: ['Airbag inflator', 'Airbag module', 'Wiring harness'],        
        reportedBy: 1256,
        lastUpdated: new Date('2024-01-15'),
        isAdminVerified: true,
        adminNotes: 'CRITICAL SAFETY RECALL - Immediate action required. This is a widespread safety defect affecting millions of vehicles.',
        affectedVehicles: 67000000,
        recallInfo: {
          hasRecall: true,
          recallNumber: 'NHTSA-14V-351',
          description: 'Driver and passenger airbag inflators may rupture'
        }
      },
      {
        id: 'admin-2',
        title: 'BMW N20 Timing Chain Tensioner Failure',
        description: 'Premature failure of timing chain tensioner in BMW N20 engines can lead to catastrophic engine damage if not addressed promptly.',
        make: 'BMW',
        model: '320i',
        yearRange: '2012-2016',
        severity: 'critical',
        symptoms: [
          'Rattling noise on cold startup',
          'Metal grinding sounds from engine',
          'Check engine light',
          'Loss of power',
          'Engine won\'t start'
        ],
        causes: [
          'Defective tensioner design',
          'Oil starvation',
          'Extended oil change intervals',
          'Manufacturing defect in plastic guides'
        ],
        solutions: [
          'Replace timing chain and tensioner immediately',
          'Update to revised parts (Service Action)',
          'Perform oil analysis',
          'Consider extended warranty coverage'
        ],
        estimatedCost: '$2,500 - $4,500',
        difficulty: 'expert',
        preventionTips: [
          'Oil changes every 5,000 miles maximum',
          'Use BMW approved oil only',
          'Listen for unusual startup noises',
          'Address symptoms immediately'
        ],
        relatedParts: ['Timing chain', 'Chain tensioner', 'Chain guides', 'Sprockets'],
        reportedBy: 567,
        lastUpdated: new Date('2024-01-12'),
        isAdminVerified: true,
        adminNotes: 'Known widespread issue. BMW has issued Service Action 11-05-17 for affected vehicles. Early detection is crucial.',
        affectedVehicles: 185000,
        recallInfo: {
          hasRecall: false
        }
      },
      {
        id: 'admin-3',
        title: 'Toyota Prius Hybrid Battery Degradation',
        description: 'High voltage hybrid battery degradation in Toyota Prius vehicles, leading to reduced fuel economy and potential system failure.',
        make: 'Toyota',
        model: 'Prius',
        yearRange: '2004-2015',
        severity: 'high',
        symptoms: [
          'Reduced fuel economy',
          'Hybrid system warning lights',
          'Frequent engine cycling',
          'Reduced electric-only range',
          'Battery cooling fan noise'
        ],
        causes: [
          'Normal battery aging',
          'Cell imbalance',
          'Extreme temperature exposure',
          'Lack of regular use'
        ],
        solutions: [
          'Hybrid battery replacement',
          'Battery reconditioning service',
          'Individual cell replacement',
          'Regular hybrid system maintenance'
        ],
        estimatedCost: '$2,000 - $4,000',
        difficulty: 'expert',
        preventionTips: [
          'Drive regularly to maintain battery',
          'Avoid extreme temperatures when possible',
          'Follow hybrid maintenance schedule',
          'Monitor fuel economy trends'
        ],
        relatedParts: ['Hybrid battery pack', 'Battery cooling system', 'Inverter'],
        reportedBy: 892,
        lastUpdated: new Date('2024-01-10'),
        isAdminVerified: true,
        adminNotes: 'Expected wear item in high-mileage vehicles. Toyota extended warranty to 10 years/150k miles for some model years.',
        affectedVehicles: 450000,
        recallInfo: {
          hasRecall: false
        }
      },
      {
        id: 'admin-4',
        title: 'Volkswagen/Audi 2.0T Carbon Buildup',
        description: 'Direct injection engines suffer from carbon buildup on intake valves, causing performance issues and rough idle.',
        make: 'Volkswagen',
        model: 'GTI',
        yearRange: '2008-2018',
        severity: 'medium',
        symptoms: [
          'Rough idle',
          'Reduced power',
          'Poor fuel economy',
          'Engine hesitation',
          'Misfires at idle'
        ],
        causes: [
          'Direct injection design limitation',
          'PCV system issues',
          'Poor quality fuel',
          'Short trip driving patterns'
        ],
        solutions: [
          'Walnut blasting intake valves',
          'Chemical intake cleaning',
          'PCV system repair',
          'Use top-tier gasoline'
        ],
        estimatedCost: '$400 - $800',
        difficulty: 'expert',
        preventionTips: [
          'Use high-quality fuel',
          'Regular highway driving',
          'Maintain PCV system',
          'Consider catch can installation'
        ],
        relatedParts: ['Intake valves', 'PCV valve', 'Carbon cleaning equipment'],
        reportedBy: 1234,
        lastUpdated: new Date('2024-01-08'),
        isAdminVerified: true,
        adminNotes: 'Inherent design issue with direct injection engines. Regular maintenance can minimize but not eliminate the problem.',
        affectedVehicles: 750000,
        recallInfo: {
          hasRecall: false
        }
      },
      {
        id: 'admin-5',
        title: 'Ford Focus Dual Clutch Transmission Issues',
        description: 'PowerShift dual clutch transmission in Ford Focus exhibits shuddering, slipping, and premature failure.',
        make: 'Ford',
        model: 'Focus',
        yearRange: '2012-2016',
        severity: 'high',
        symptoms: [
          'Transmission shuddering',
          'Hesitation during acceleration',
          'Jerky shifting',
          'Loss of power',
          'Burning smell'
        ],
        causes: [
          'Clutch pack wear',
          'Transmission control module issues',
          'Hydraulic system problems',
          'Design limitations'
        ],
        solutions: [
          'Clutch pack replacement',
          'TCM software update',
          'Complete transmission replacement',
          'Extended warranty claim'
        ],
        estimatedCost: '$1,500 - $4,000',
        difficulty: 'expert',
        preventionTips: [
          'Gentle acceleration',
          'Regular transmission service',
          'Avoid stop-and-go traffic when possible',
          'Monitor for early symptoms'
        ],
        relatedParts: ['Clutch packs', 'TCM', 'Hydraulic pump'],
        reportedBy: 756,
        lastUpdated: new Date('2024-01-05'),
        isAdminVerified: true,
        adminNotes: 'Class action lawsuit settled. Ford extended warranty to 7 years/100k miles for affected vehicles.',
        affectedVehicles: 560000,
        recallInfo: {
          hasRecall: true,
          recallNumber: 'NHTSA-16V-301',
          description: 'Transmission may slip or shudder'
        }
      },
      {
        id: 'admin-6',
        title: 'Subaru Head Gasket Failure (EJ25 Engine)',
        description: 'External head gasket leaks in Subaru EJ25 engines, particularly affecting 2.5L naturally aspirated models.',
        make: 'Subaru',
        model: 'Outback',
        yearRange: '1999-2011',
        severity: 'high',
        symptoms: [
          'External coolant leaks',
          'White exhaust smoke',
          'Overheating',
          'Coolant loss',
          'Sweet smell from engine bay'
        ],
        causes: [
          'Multi-layer steel gasket design',
          'Thermal cycling',
          'Aluminum head expansion',
          'Coolant chemistry'
        ],
        solutions: [
          'Head gasket replacement',
          'Machine cylinder heads',
          'Replace timing belt during repair',
          'Cooling system flush'
        ],
        estimatedCost: '$1,800 - $2,500',
        difficulty: 'expert',
        preventionTips: [
          'Regular coolant changes',
          'Use Subaru approved coolant',
          'Monitor coolant levels',
          'Address leaks promptly'
        ],
        relatedParts: ['Head gaskets', 'Cylinder heads', 'Timing belt'],
        reportedBy: 934,
        lastUpdated: new Date('2024-01-03'),
        isAdminVerified: true,
        adminNotes: 'Well-documented issue with EJ25 engines. Subaru redesigned gaskets in later years.',
        affectedVehicles: 425000,
        recallInfo: {
          hasRecall: false
        }
      },
      {
        id: 'admin-7',
        title: 'Nissan CVT Transmission Premature Failure',
        description: 'Continuously Variable Transmission (CVT) in Nissan vehicles experiencing premature failure and shuddering.',
        make: 'Nissan',
        model: 'Altima',
        yearRange: '2013-2018',
        severity: 'high',
        symptoms: [
          'Transmission shuddering',
          'Whining or grinding noise',
          'Hesitation during acceleration',
          'Jerky movement',
          'Complete transmission failure'
        ],
        causes: [
          'CVT belt wear',
          'Valve body issues',
          'CVT fluid degradation',
          'Software calibration problems'
        ],
        solutions: [
          'CVT transmission replacement',
          'Software update',
          'CVT fluid change',
          'Extended warranty coverage'
        ],
        estimatedCost: '$3,000 - $5,000',
        difficulty: 'expert',
        preventionTips: [
          'Regular CVT fluid changes',
          'Avoid aggressive driving',
          'Warm up transmission',
          'Follow maintenance schedule strictly'
        ],
        relatedParts: ['CVT transmission', 'CVT fluid', 'Valve body'],
        reportedBy: 1456,
        lastUpdated: new Date('2024-01-01'),
        isAdminVerified: true,
        adminNotes: 'Nissan extended CVT warranty to 10 years/120k miles for many affected models due to widespread issues.',
        affectedVehicles: 890000,
        recallInfo: {
          hasRecall: false
        }
      },
      // COMMUNITY REPORTED ISSUES (existing ones)
      {
        id: '1',
        title: 'Carbon Build-up in Direct Injection Engines',
        description: 'Direct injection engines are prone to carbon build-up on intake valves, leading to reduced performance and rough idle.',
        make: 'Audi',
        model: 'A4',
        yearRange: '2009-2016',
        severity: 'medium',
        symptoms: [
          'Rough idle',
          'Reduced power',
          'Poor fuel economy',
          'Engine hesitation',
          'Check engine light'
        ],
        causes: [
          'Direct injection design',
          'Poor quality fuel',
          'Short trips',
          'Lack of maintenance'
        ],
        solutions: [
          'Walnut blasting intake valves',
          'Use top-tier gasoline',
          'Regular oil changes',
          'Occasional highway driving',
          'Intake valve cleaning service'
        ],
        estimatedCost: '$300 - $800',
        difficulty: 'expert',
        preventionTips: [
          'Use high-quality fuel',
          'Regular maintenance',
          'Avoid short trips when possible',
          'Consider catch can installation'
        ],
        relatedParts: ['Intake valves', 'PCV system', 'Air filter'],
        reportedBy: 89,
        lastUpdated: new Date('2024-01-10'),
        isAdminVerified: false
      },
      {
        id: '2',
        title: 'Timing Chain Tensioner Failure',
        description: 'BMW N20 engines are known for timing chain tensioner failures, which can lead to catastrophic engine damage if not addressed.',
        make: 'BMW',
        model: '320i',
        yearRange: '2012-2016',
        severity: 'critical',
        symptoms: [
          'Rattling noise on startup',
          'Metal grinding sounds',
          'Check engine light',
          'Loss of power',
          'Engine won\'t start'
        ],
        causes: [
          'Defective tensioner design',
          'Oil starvation',
          'Extended oil change intervals',
          'Manufacturing defect'
        ],
        solutions: [
          'Replace timing chain and tensioner',
          'Update to revised parts',
          'Regular oil changes',
          'Monitor for early symptoms'
        ],
        estimatedCost: '$2,500 - $4,500',
        difficulty: 'expert',
        preventionTips: [
          'Regular oil changes every 5,000 miles',
          'Use BMW approved oil',
          'Listen for unusual noises',
          'Address issues immediately'
        ],
        relatedParts: ['Timing chain', 'Chain tensioner', 'Chain guides'],
        reportedBy: 67,
        lastUpdated: new Date('2024-01-08'),
        isAdminVerified: false
      },
      {
        id: '3',
        title: 'CVT Transmission Shuddering',
        description: 'Nissan CVT transmissions are prone to shuddering and premature failure, especially in stop-and-go traffic.',
        make: 'Nissan',
        model: 'Altima',
        yearRange: '2013-2018',
        severity: 'high',
        symptoms: [
          'Transmission shuddering',
          'Hesitation during acceleration',
          'Whining noise',
          'Jerky shifting',
          'Loss of power'
        ],
        causes: [
          'CVT fluid degradation',
          'Belt wear',
          'Valve body issues',
          'Software problems'
        ],
        solutions: [
          'CVT fluid change',
          'Software update',
          'Transmission replacement',
          'Regular maintenance'
        ],
        estimatedCost: '$200 - $5,000',
        difficulty: 'expert',
        preventionTips: [
          'Regular CVT fluid changes',
          'Avoid aggressive driving',
          'Warm up transmission',
          'Follow maintenance schedule'
        ],
        relatedParts: ['CVT fluid', 'CVT belt', 'Valve body'],
        reportedBy: 123,
        lastUpdated: new Date('2024-01-05'),
        isAdminVerified: false
      },
      {
        id: '4',
        title: 'Subframe Cracking',
        description: 'BMW E46 models are known for rear subframe cracking, which affects handling and safety.',
        make: 'BMW',
        model: '330i',
        yearRange: '1999-2006',
        severity: 'high',
        symptoms: [
          'Clunking noise from rear',
          'Vibration during acceleration',
          'Uneven tire wear',
          'Handling issues',
          'Visible cracks in subframe'
        ],
        causes: [
          'Design weakness',
          'Corrosion',
          'Stress from driving',
          'Age of vehicle'
        ],
        solutions: [
          'Subframe reinforcement',
          'Complete subframe replacement',
          'Welding repairs',
          'Regular inspection'
        ],
        estimatedCost: '$1,500 - $3,500',
        difficulty: 'expert',
        preventionTips: [
          'Regular undercarriage inspection',
          'Avoid harsh impacts',
          'Address rust early',
          'Professional inspection'
        ],
        relatedParts: ['Rear subframe', 'Differential bushings', 'Control arms'],
        reportedBy: 78,
        lastUpdated: new Date('2024-01-03'),
        isAdminVerified: false
      },
      {
        id: '5',
        title: 'Oil Consumption Issues',
        description: 'Volkswagen/Audi 2.0T engines are known for excessive oil consumption due to piston ring issues.',
        make: 'Volkswagen',
        model: 'GTI',
        yearRange: '2008-2014',
        severity: 'medium',
        symptoms: [
          'Low oil level warnings',
          'Blue smoke from exhaust',
          'Frequent oil top-ups',
          'Oil burning smell',
          'Reduced performance'
        ],
        causes: [
          'Defective piston rings',
          'Carbon build-up',
          'PCV system failure',
          'Valve stem seals'
        ],
        solutions: [
          'Piston ring replacement',
          'Engine rebuild',
          'PCV system repair',
          'Regular oil monitoring'
        ],
        estimatedCost: '$3,000 - $8,000',
        difficulty: 'expert',
        preventionTips: [
          'Check oil level regularly',
          'Use high-quality oil',
          'Address PCV issues early',
          'Monitor consumption rates'
        ],
        relatedParts: ['Piston rings', 'PCV valve', 'Valve stem seals'],
        reportedBy: 94,
        lastUpdated: new Date('2024-01-01'),
        isAdminVerified: false
      },
            // More realistic issues
      {
        id: 'admin-8',
        title: 'Hyundai/Kia Theta II Engine Seizure',
        description: 'Connecting rod bearing failure leading to engine seizure due to manufacturing debris or insufficient oil flow.',
        make: 'Hyundai',
        model: 'Sonata',
        yearRange: '2011-2019',
        severity: 'critical',
        symptoms: [
          'Loud knocking noise from engine',
          'Check engine light (P1326)',
          'Reduced engine power',
          'Engine stalls or seizes',
          'Oil consumption'
        ],
        causes: [
          'Manufacturing debris in crankshaft oil passages',
          'Connecting rod bearing wear',
          'Insufficient lubrication',
          'Engine design flaw'
        ],
        solutions: [
          'Engine replacement (often covered by extended warranty/recall)',
          'Regular oil changes with correct viscosity',
          'Monitor for early warning signs'
        ],
        estimatedCost: '$5,000 - $8,000 (if not covered)',
        difficulty: 'expert',
        preventionTips: [
          'Adhere strictly to oil change intervals',
          'Use manufacturer-recommended oil',
          'Listen for unusual engine noises',
          'Check for recall status'
        ],
        relatedParts: ['Engine assembly', 'Connecting rods', 'Crankshaft', 'Bearings'],
        reportedBy: 2500,
        lastUpdated: new Date('2024-02-20'),
        isAdminVerified: true,
        adminNotes: 'Widespread issue leading to multiple recalls and class-action lawsuits. Many vehicles received extended warranties or engine replacements.',
        affectedVehicles: 3700000,
        recallInfo: {
          hasRecall: true,
          recallNumber: 'NHTSA-17V-226',
          description: 'Engine connecting rod bearings may wear prematurely'
        }
      },
      {
        id: 'admin-9',
        title: 'Mercedes-Benz M272/M273 Balance Shaft/Idler Gear Wear',
        description: 'Premature wear of the balance shaft sprocket (M272) or idler gear (M273) leading to timing chain issues and engine damage.',
        make: 'Mercedes-Benz',
        model: 'C300',
        yearRange: '2005-2011',
        severity: 'high',
        symptoms: [
          'Check engine light (P0016, P0017, P0018, P0019)',
          'Rough idle',
          'Reduced engine power',
          'Engine noise (rattling/ticking)',
          'Engine misfires'
        ],
        causes: [
          'Defective material in balance shaft sprocket/idler gear',
          'Timing chain stretch',
          'Oil sludge'
        ],
        solutions: [
          'Engine disassembly and replacement of balance shaft/idler gear',
          'Timing chain replacement',
          'Engine flush'
        ],
        estimatedCost: '$4,000 - $6,000',
        difficulty: 'expert',
        preventionTips: [
          'Regular oil changes with high-quality synthetic oil',
          'Monitor for check engine light codes',
          'Address engine noises promptly'
        ],
        relatedParts: ['Balance shaft', 'Idler gear', 'Timing chain', 'Timing chain tensioner'],
        reportedBy: 800,
        lastUpdated: new Date('2024-02-15'),
        isAdminVerified: true,
        adminNotes: 'Known design flaw. Mercedes-Benz settled a class-action lawsuit and offered extended warranty coverage for affected vehicles.',
        affectedVehicles: 100000,
        recallInfo: {
          hasRecall: false
        }
      },
      {
        id: 'admin-10',
        title: 'Audi/VW EA888 Gen 1/2 Timing Chain Tensioner Failure',
        description: 'Failure of the timing chain tensioner leading to timing chain slack, jumping timing, and catastrophic engine damage.',
        make: 'Audi',
        model: 'A4',
        yearRange: '2008-2013',
        severity: 'critical',
        symptoms: [
          'Loud rattling noise on cold start (for a few seconds)',
          'Check engine light (P0016, P0017)',
          'Engine misfires',
          'Engine stalls or fails to start',
          'Reduced engine power'
        ],
        causes: [
          'Defective timing chain tensioner design',
          'Timing chain stretch',
          'Extended oil change intervals'
        ],
        solutions: [
          'Timing chain tensioner replacement (with updated part)',
          'Timing chain replacement',
          'Engine repair/replacement if damage occurred'
        ],
        estimatedCost: '$1,500 - $3,000 (tensioner/chain only), $5,000+ (engine damage)',
        difficulty: 'expert',
        preventionTips: [
          'Replace tensioner proactively (if original design)',
          'Regular oil changes with correct oil specification',
          'Listen for startup rattle'
        ],
        relatedParts: ['Timing chain tensioner', 'Timing chain', 'Camshaft adjusters'],
        reportedBy: 1500,
        lastUpdated: new Date('2024-02-10'),
        isAdminVerified: true,
        adminNotes: 'Very common issue. Audi/VW issued a technical service bulletin and extended warranty for some vehicles. Proactive replacement is highly recommended.',
        affectedVehicles: 500000,
        recallInfo: {
          hasRecall: false
        }
      },
      {
        id: 'admin-11',
        title: 'Ford EcoBoost Carbon Buildup',
        description: 'Direct injection EcoBoost engines are prone to carbon buildup on intake valves, leading to reduced performance, misfires, and rough idle.',
        make: 'Ford',
        model: 'F-150',
        yearRange: '2011-2017',
        severity: 'medium',
        symptoms: [
          'Rough idle',
          'Reduced power and acceleration',
          'Poor fuel economy',
          'Engine misfires',
          'Check engine light'
        ],
        causes: [
          'Direct injection design (no fuel washing valves)',
          'PCV system issues',
          'Short trip driving',
          'Oil vapor accumulation'
        ],
        solutions: [
          'Walnut blasting intake valves',
          'Chemical intake cleaning',
          'Install oil catch can',
          'Regular maintenance'
        ],
        estimatedCost: '$400 - $800',
        difficulty: 'hard',
        preventionTips: [
          'Install an oil catch can',
          'Use top-tier gasoline',
          'Occasional highway driving',
          'Regular maintenance'
        ],
        relatedParts: ['Intake valves', 'PCV valve', 'Intake manifold', 'Oil catch can'],
        reportedBy: 1100,
        lastUpdated: new Date('2024-02-05'),
        isAdminVerified: true,
        adminNotes: 'Common issue with direct injection engines across many manufacturers. Maintenance is key to mitigating effects.',
        affectedVehicles: 1200000,
        recallInfo: {
          hasRecall: false
        }
      },
      {
        id: 'admin-12',
        title: 'Chevrolet Cruze/Sonic Coolant Leak',
        description: 'Coolant leaks from various plastic components in the cooling system, including thermostat housing, water outlet, and coolant reservoir.',
        make: 'Chevrolet',
        model: 'Cruze',
        yearRange: '2011-2016',
        severity: 'medium',
        symptoms: [
          'Low coolant warning light',
          'Sweet smell from engine bay',
          'Visible coolant puddles under car',
          'Engine overheating',
          'White smoke from exhaust'
        ],
        causes: [
          'Degradation of plastic components due to heat cycling',
          'Cracked thermostat housing/water outlet',
          'Hose leaks',
          'Water pump failure'
        ],
        solutions: [
          'Replace leaking components (thermostat housing, water outlet, hoses)',
          'Replace water pump if leaking',
          'Cooling system flush and refill'
        ],
        estimatedCost: '$200 - $600',
        difficulty: 'medium',
        preventionTips: [
          'Regularly inspect cooling system components for cracks/leaks',
          'Use correct coolant type',
          'Address leaks immediately to prevent overheating'
        ],
        relatedParts: ['Thermostat housing', 'Water outlet', 'Coolant hoses', 'Water pump', 'Coolant reservoir'],
        reportedBy: 950,
        lastUpdated: new Date('2024-02-01'),
        isAdminVerified: true,
        adminNotes: 'Very common issue. Many aftermarket solutions exist with more durable aluminum components.',
        affectedVehicles: 800000,
        recallInfo: {
          hasRecall: false
        }
      },
      {
        id: 'admin-13',
        title: 'Honda CR-V AC Compressor Failure',
        description: 'Premature failure of the AC compressor clutch or compressor itself, leading to loss of air conditioning.',
        make: 'Honda',
        model: 'CR-V',
        yearRange: '2007-2011',
        severity: 'low',
        symptoms: [
          'No cold air from AC vents',
          'Loud clicking noise from AC compressor area',
          'AC clutch not engaging',
          'Burning smell when AC is on'
        ],
        causes: [
          'Defective AC compressor clutch relay',
          'Compressor internal failure',
          'Low refrigerant due to leaks',
          'Electrical issues'
        ],
        solutions: [
          'Replace AC compressor clutch relay',
          'Replace AC compressor',
          'Repair refrigerant leaks and recharge system',
          'Inspect electrical connections'
        ],
        estimatedCost: '$500 - $1,200',
        difficulty: 'medium',
        preventionTips: [
          'Run AC periodically even in winter to keep seals lubricated',
          'Ensure proper refrigerant levels',
          'Address any AC performance issues early'
        ],
        relatedParts: ['AC compressor', 'AC clutch', 'AC clutch relay', 'Refrigerant', 'AC lines'],
        reportedBy: 700,
        lastUpdated: new Date('2024-01-28'),
        isAdminVerified: true,
        adminNotes: 'Common comfort issue. Some owners reported success with simply replacing the AC clutch relay.',
        affectedVehicles: 600000,
        recallInfo: {
          hasRecall: false
        }
      },
      {
        id: 'admin-14',
        title: 'Toyota Tacoma Frame Rust',
        description: 'Excessive rust and corrosion on the vehicle frame, potentially leading to structural integrity issues.',
        make: 'Toyota',
        model: 'Tacoma',
        yearRange: '2005-2010',
        severity: 'critical',
        symptoms: [
          'Visible rust on frame components',
          'Holes or perforations in frame',
          'Squeaking/creaking noises from chassis',
          'Compromised suspension mounting points'
        ],
        causes: [
          'Inadequate rustproofing from factory',
          'Exposure to road salt and moisture',
          'Environmental factors'
        ],
        solutions: [
          'Frame replacement (if covered by recall/warranty extension)',
          'Rust treatment and undercoating',
          'Regular cleaning of undercarriage'
        ],
        estimatedCost: '$10,000+ (if not covered)',
        difficulty: 'expert',
        preventionTips: [
          'Regular undercarriage washes (especially in winter)',
          'Apply aftermarket rustproofing/undercoating',
          'Inspect frame regularly for rust'
        ],
        relatedParts: ['Vehicle frame', 'Suspension components', 'Brake lines'],
        reportedBy: 1800,
        lastUpdated: new Date('2024-01-25'),
        isAdminVerified: true,
        adminNotes: 'Major recall and warranty extension program by Toyota due to severe safety concerns. Check VIN for eligibility.',
        affectedVehicles: 1500000,
        recallInfo: {
          hasRecall: true,
          recallNumber: 'NHTSA-08V-617',
          description: 'Frame corrosion may lead to structural failure'
        }
      },
      {
        id: 'admin-15',
        title: 'Subaru Oil Consumption (FA20/FB20/FB25 Engines)',
        description: 'Excessive oil consumption in certain Subaru engines, requiring frequent top-offs between oil changes.',
        make: 'Subaru',
        model: 'Forester',
        yearRange: '2011-2015',
        severity: 'medium',
        symptoms: [
          'Low oil level warning light',
          'Frequent need to add oil',
          'Blue smoke from exhaust on startup',
          'Oil burning smell'
        ],
        causes: [
          'Piston ring design issues',
          'Cylinder bore out-of-roundness',
          'PCV system issues',
          'Valve guide wear'
        ],
        solutions: [
          'Engine short block replacement (often covered by extended warranty)',
          'Piston ring replacement',
          'Regular oil level checks and top-offs',
          'PCV valve replacement'
        ],
        estimatedCost: '$3,000 - $5,000 (if not covered)',
        difficulty: 'expert',
        preventionTips: [
          'Check oil level every 1,000-2,000 miles',
          'Use manufacturer-recommended oil',
          'Address PCV system issues promptly'
        ],
        relatedParts: ['Piston rings', 'Short block', 'PCV valve'],
        reportedBy: 1300,
        lastUpdated: new Date('2024-01-22'),
        isAdminVerified: true,
        adminNotes: 'Subaru settled a class-action lawsuit and offered extended warranties for affected vehicles. Some engines were replaced.',
        affectedVehicles: 700000,
        recallInfo: {
          hasRecall: false
        }
      },
      {
        id: 'admin-16',
        title: 'BMW N54 High-Pressure Fuel Pump (HPFP) Failure',
        description: 'Premature failure of the HPFP leading to long cranks, engine stalling, and reduced power.',
        make: 'BMW',
        model: '335i',
        yearRange: '2007-2010',
        severity: 'high',
        symptoms: [
          'Long crank times (especially when cold)',
          'Engine stalling (while driving or at idle)',
          'Reduced engine power (limp mode)',
          'Check engine light (various fuel pressure codes)',
          'Rough idle'
        ],
        causes: [
          'HPFP design flaw',
          'Fuel quality issues',
          'Wear and tear'
        ],
        solutions: [
          'HPFP replacement (with updated part)',
          'Low-pressure fuel sensor replacement',
          'Fuel system cleaning'
        ],
        estimatedCost: '$800 - $1,500',
        difficulty: 'medium',
        preventionTips: [
          'Use high-quality fuel',
          'Avoid running fuel tank very low',
          'Address long cranks immediately'
        ],
        relatedParts: ['High-pressure fuel pump', 'Low-pressure fuel sensor', 'Fuel injectors'],
        reportedBy: 1600,
        lastUpdated: new Date('2024-01-18'),
        isAdminVerified: true,
        adminNotes: 'BMW issued a recall and extended warranty for the HPFP due to widespread failures. Many vehicles have already had this replaced.',
        affectedVehicles: 130000,
        recallInfo: {
          hasRecall: true,
          recallNumber: 'NHTSA-10V-044',
          description: 'High-pressure fuel pump may fail, causing engine stall'
        }
      },
      {
        id: 'admin-17',
        title: 'Mazda SkyActiv Engine Carbon Buildup',
        description: 'Carbon accumulation on intake valves and piston tops in SkyActiv direct injection engines, affecting performance and fuel economy.',
        make: 'Mazda',
        model: 'CX-5',
        yearRange: '2012-2018',
        severity: 'medium',
        symptoms: [
          'Rough idle',
          'Reduced fuel economy',
          'Loss of power',
          'Engine hesitation',
          'Misfires'
        ],
        causes: [
          'Direct injection design',
          'PCV system operation',
          'Driving habits (short trips)'
        ],
        solutions: [
          'Walnut blasting intake valves',
          'Fuel system cleaner (for piston tops)',
          'Install oil catch can',
          'Regular maintenance'
        ],
        estimatedCost: '$300 - $700',
        difficulty: 'hard',
        preventionTips: [
          'Use quality fuel with detergents',
          'Consider an oil catch can',
          'Occasional highway driving'
        ],
        relatedParts: ['Intake valves', 'PCV valve', 'Fuel injectors'],
        reportedBy: 600,
        lastUpdated: new Date('2024-01-15'),
        isAdminVerified: true,
        adminNotes: 'Less severe than some other DI engines, but still a factor. Regular maintenance and preventative measures are effective.',
        affectedVehicles: 900000,
        recallInfo: {
          hasRecall: false
        }
      },
      {
        id: 'admin-18',
        title: 'Volkswagen DSG Mechatronic Unit Failure',
        description: 'Failure of the Mechatronic unit (transmission control module) in DSG transmissions, leading to shifting issues or complete transmission failure.',
        make: 'Volkswagen',
        model: 'Jetta',
        yearRange: '2008-2015',
        severity: 'high',
        symptoms: [
          'Harsh or erratic shifting',
          'Transmission warning light',
          'Loss of drive',
          'Clunking noises from transmission',
          'Vehicle stuck in gear'
        ],
        causes: [
          'Mechatronic unit internal component failure',
          'Solenoid issues',
          'Software glitches',
          'Fluid contamination'
        ],
        solutions: [
          'Mechatronic unit replacement',
          'DSG fluid and filter change',
          'Software update',
          'Complete transmission replacement (in severe cases)'
        ],
        estimatedCost: '$1,500 - $3,000',
        difficulty: 'expert',
        preventionTips: [
          'Adhere to DSG fluid and filter change intervals',
          'Avoid aggressive driving',
          'Address shifting issues promptly'
        ],
        relatedParts: ['Mechatronic unit', 'DSG fluid', 'DSG filter', 'Clutch packs'],
        reportedBy: 1000,
        lastUpdated: new Date('2024-01-12'),
        isAdminVerified: true,
        adminNotes: 'Widespread issue leading to extended warranties and recalls in some regions. Updated Mechatronic units are more reliable.',
        affectedVehicles: 700000,
        recallInfo: {
          hasRecall: true,
          recallNumber: 'NHTSA-09V-333',
          description: 'DSG transmission may unexpectedly shift to neutral'
        }
      },
      {
        id: 'admin-19',
        title: 'Toyota Camry Excessive Oil Consumption',
        description: 'Excessive oil consumption in 2.4L 2AZ-FE engines due to defective piston rings.',
        make: 'Toyota',
        model: 'Camry',
        yearRange: '2007-2011',
        severity: 'medium',
        symptoms: [
          'Frequent need to add oil between changes',
          'Blue smoke from exhaust',
          'Low oil pressure warning light',
          'Engine noise (ticking/knocking)'
        ],
        causes: [
          'Defective piston rings (clogging/sticking)',
          'Carbon buildup on piston rings',
          'PCV valve issues'
        ],
        solutions: [
          'Piston ring replacement (engine rebuild)',
          'Engine replacement (in severe cases)',
          'Regular oil level checks and top-offs',
          'PCV valve replacement'
        ],
        estimatedCost: '$2,000 - $4,000',
        difficulty: 'expert',
        preventionTips: [
          'Check oil level regularly (every 1,000 miles)',
          'Use high-quality synthetic oil',
          'Address PCV valve issues'
        ],
        relatedParts: ['Piston rings', 'Engine short block', 'PCV valve'],
        reportedBy: 1400,
        lastUpdated: new Date('2024-01-10'),
        isAdminVerified: true,
        adminNotes: 'Toyota issued a warranty enhancement program (ZE7) for affected vehicles, extending coverage for oil consumption issues.',
        affectedVehicles: 1700000,
        recallInfo: {
          hasRecall: false
        }
      },
      {
        id: 'admin-20',
        title: 'Honda Accord V6 VCM Misfires/Oil Consumption',
        description: 'Variable Cylinder Management (VCM) system can cause misfires, excessive oil consumption, and spark plug fouling on V6 engines.',
        make: 'Honda',
        model: 'Accord',
        yearRange: '2008-2012',
        severity: 'medium',
        symptoms: [
          'Engine misfires (P0301-P0306)',
          'Excessive oil consumption',
          'Vibration during VCM activation',
          'Fouled spark plugs',
          'Check engine light'
        ],
        causes: [
          'VCM system design (deactivates cylinders, causing oil to bypass rings)',
          'Sticking piston rings',
          'Fouled spark plugs'
        ],
        solutions: [
          'Piston ring replacement (engine rebuild)',
          'VCM deactivation device (aftermarket)',
          'Frequent spark plug replacement',
          'Regular oil level checks'
        ],
        estimatedCost: '$2,000 - $4,000 (engine rebuild), $100-200 (VCM deactivation)',
        difficulty: 'expert',
        preventionTips: [
          'Consider VCM deactivation device',
          'Check oil level frequently',
          'Use quality spark plugs'
        ],
        relatedParts: ['Piston rings', 'Spark plugs', 'VCM solenoids'],
        reportedBy: 1200,
        lastUpdated: new Date('2024-01-08'),
        isAdminVerified: true,
        adminNotes: 'Class-action lawsuit settled, offering extended warranty and engine repairs for affected vehicles. Many owners opt for VCM deactivation.',
        affectedVehicles: 1500000,
        recallInfo: {
          hasRecall: false
        }
      },
      {
        id: 'admin-21',
        title: 'Nissan Rogue CVT Transmission Failure',
        description: 'Premature failure of the Continuously Variable Transmission (CVT) in Nissan Rogue vehicles, leading to shuddering, loss of power, or complete transmission failure.',
        make: 'Nissan',
        model: 'Rogue',
        yearRange: '2014-2016',
        severity: 'high',
        symptoms: [
          'Transmission shuddering or jerking',
          'Whining or grinding noise from transmission',
          'Hesitation during acceleration',
          'RPMs fluctuating erratically',
          'Vehicle stuck in limp mode or fails to move'
        ],
        causes: [
          'Overheating of CVT fluid',
          'Wear of internal components (belt/pulleys)',
          'Defective valve body',
          'Software calibration issues'
        ],
        solutions: [
          'CVT transmission replacement',
          'CVT fluid and filter change (with updated fluid)',
          'Software update',
          'External CVT cooler installation'
        ],
        estimatedCost: '$3,500 - $5,500',
        difficulty: 'expert',
        preventionTips: [
          'Adhere strictly to CVT fluid change intervals (more frequently in hot climates)',
          'Avoid aggressive driving and heavy towing',
          'Consider installing an external CVT cooler'
        ],
        relatedParts: ['CVT transmission', 'CVT fluid', 'CVT filter', 'Valve body'],
        reportedBy: 1700,
        lastUpdated: new Date('2024-01-05'),
        isAdminVerified: true,
        adminNotes: 'Widespread issue across many Nissan models with CVTs. Nissan extended warranty coverage for many affected vehicles.',
        affectedVehicles: 1000000,
        recallInfo: {
          hasRecall: false
        }
      },
      {
        id: 'admin-22',
        title: 'Ford Fiesta/Focus PowerShift Transmission Issues',
        description: 'Dual-clutch automatic transmission (DPS6 PowerShift) exhibits shuddering, hesitation, and premature wear of clutch packs.',
        make: 'Ford',
        model: 'Fiesta',
        yearRange: '2011-2016',
        severity: 'high',
        symptoms: [
          'Transmission shuddering or vibration on acceleration',
          'Harsh or delayed shifts',
          'Hesitation or loss of power',
          'Transmission warning light',
          'Grinding noises from transmission'
        ],
        causes: [
          'Defective clutch pack design',
          'Transmission Control Module (TCM) software issues',
          'Input shaft seal leaks',
          'Dry clutch design limitations'
        ],
        solutions: [
          'Clutch pack replacement (with updated parts)',
          'TCM software updates',
          'Input shaft seal replacement',
          'Complete transmission replacement (in severe cases)'
        ],
        estimatedCost: '$1,500 - $3,000',
        difficulty: 'expert',
        preventionTips: [
          'Ensure all software updates are applied',
          'Avoid aggressive driving in stop-and-go traffic',
          'Address symptoms immediately'
        ],
        relatedParts: ['Clutch packs', 'Transmission Control Module (TCM)', 'Input shaft seals'],
        reportedBy: 1900,
        lastUpdated: new Date('2024-01-03'),
        isAdminVerified: true,
        adminNotes: 'Subject of multiple class-action lawsuits and extended warranty programs by Ford. Many vehicles have had multiple repairs.',
        affectedVehicles: 2000000,
        recallInfo: {
          hasRecall: false
        }
      },
      {
        id: 'admin-23',
        title: 'BMW N63 Engine Oil Consumption/Valve Stem Seals',
        description: 'Excessive oil consumption, misfires, and smoke from exhaust due to failing valve stem seals and other issues in the N63 twin-turbo V8 engine.',
        make: 'BMW',
        model: '550i',
        yearRange: '2009-2014',
        severity: 'high',
        symptoms: [
          'Excessive oil consumption (frequent top-offs)',
          'Blue smoke from exhaust (especially on startup or deceleration)',
          'Engine misfires',
          'Rough idle',
          'Check engine light'
        ],
        causes: [
          'Degraded valve stem seals',
          'Turbocharger oil leaks',
          'PCV system issues',
          'Fuel injector leaks'
        ],
        solutions: [
          'Valve stem seal replacement',
          'Turbocharger replacement/repair',
          'PCV valve replacement',
          'Fuel injector replacement'
        ],
        estimatedCost: '$4,000 - $8,000+',
        difficulty: 'expert',
        preventionTips: [
          'Monitor oil level frequently',
          'Use high-quality synthetic oil',
          'Address any smoke or misfire symptoms immediately'
        ],
        relatedParts: ['Valve stem seals', 'Turbochargers', 'PCV valves', 'Fuel injectors'],
        reportedBy: 900,
        lastUpdated: new Date('2024-01-01'),
        isAdminVerified: true,
        adminNotes: 'BMW initiated a Customer Care Package (CCP) to address multiple issues with the N63 engine, including extended warranties for some components.',
        affectedVehicles: 200000,
        recallInfo: {
          hasRecall: false
        }
      },
      {
        id: 'admin-24',
        title: 'Audi 2.0T TFSI Oil Consumption',
        description: 'Excessive oil consumption in early generation Audi/VW 2.0T TFSI engines due to defective piston rings.',
        make: 'Audi',
        model: 'A5',
        yearRange: '2009-2011',
        severity: 'high',
        symptoms: [
          'Frequent need to add oil (every 1,000-2,000 miles)',
          'Low oil pressure warning light',
          'Blue smoke from exhaust',
          'Fouled spark plugs'
        ],
        causes: [
          'Defective piston rings (too thin, poor tension)',
          'Carbon buildup on piston rings',
          'PCV valve issues'
        ],
        solutions: [
          'Piston and connecting rod replacement (engine rebuild)',
          'Engine replacement (in severe cases)',
          'Regular oil level checks and top-offs'
        ],
        estimatedCost: '$3,000 - $6,000',
        difficulty: 'expert',
        preventionTips: [
          'Monitor oil level diligently',
          'Use correct oil specification',
          'Address PCV system issues'
        ],
        relatedParts: ['Pistons', 'Piston rings', 'Connecting rods', 'PCV valve'],
        reportedBy: 1300,
        lastUpdated: new Date('2023-12-28'),
        isAdminVerified: true,
        adminNotes: 'Subject of a class-action lawsuit and extended warranty programs. Requires significant engine work to resolve.',
        affectedVehicles: 600000,
        recallInfo: {
          hasRecall: false
        }
      },
      {
        id: 'admin-25',
        title: 'Subaru CVT Transmission Noise/Failure',
        description: 'Whining or grinding noises from the CVT transmission, often leading to premature failure.',
        make: 'Subaru',
        model: 'Outback',
        yearRange: '2010-2015',
        severity: 'high',
        symptoms: [
          'Whining or grinding noise from transmission (especially at highway speeds)',
          'Shuddering or vibration on acceleration',
          'Loss of power',
          'Transmission warning light',
          'Vehicle stuck in limp mode'
        ],
        causes: [
          'Bearing failure within the CVT',
          'Valve body issues',
          'CVT fluid degradation',
          'Internal component wear'
        ],
        solutions: [
          'CVT transmission replacement',
          'CVT fluid and filter change',
          'Valve body replacement'
        ],
        estimatedCost: '$3,000 - $6,000',
        difficulty: 'expert',
        preventionTips: [
          'Adhere to CVT fluid change intervals',
          'Avoid aggressive driving',
          'Address noises promptly'
        ],
        relatedParts: ['CVT transmission', 'CVT fluid', 'CVT filter'],
        reportedBy: 850,
        lastUpdated: new Date('2023-12-25'),
        isAdminVerified: true,
        adminNotes: 'Subaru extended the warranty on many of these CVTs due to widespread issues. Check your VIN for eligibility.',
        affectedVehicles: 900000,
        recallInfo: {
          hasRecall: false
        }
      },
      {
        id: 'admin-26',
        title: 'Honda Civic AC Compressor Failure',
        description: 'Premature failure of the AC compressor or its clutch, resulting in no cold air.',
        make: 'Honda',
        model: 'Civic',
        yearRange: '2006-2011',
        severity: 'low',
        symptoms: [
          'No cold air from AC',
          'Loud clicking noise from compressor area',
          'AC clutch not engaging',
          'Burning smell when AC is on'
        ],
        causes: [
          'Defective AC compressor clutch relay',
          'Compressor internal failure',
          'Low refrigerant due to leaks'
        ],
        solutions: [
          'Replace AC compressor clutch relay',
          'Replace AC compressor',
          'Repair leaks and recharge AC system'
        ],
        estimatedCost: '$500 - $1,000',
        difficulty: 'medium',
        preventionTips: [
          'Run AC periodically year-round',
          'Ensure proper refrigerant levels',
          'Address any AC issues early'
        ],
        relatedParts: ['AC compressor', 'AC clutch', 'AC clutch relay', 'Refrigerant'],
        reportedBy: 750,
        lastUpdated: new Date('2023-12-20'),
        isAdminVerified: true,
        adminNotes: 'Common issue. Simple relay replacement can sometimes fix it, but often requires compressor replacement.',
        affectedVehicles: 1100000,
        recallInfo: {
          hasRecall: false
        }
      },
      {
        id: 'admin-27',
        title: 'Toyota Corolla Transmission Shudder',
        description: 'Shuddering or vibration during acceleration, particularly at low speeds, due to torque converter issues.',
        make: 'Toyota',
        model: 'Corolla',
        yearRange: '2009-2013',
        severity: 'medium',
        symptoms: [
          'Shuddering or vibration on acceleration (20-40 mph)',
          'Rough shifts',
          'Check engine light (rarely)'
        ],
        causes: [
          'Torque converter internal wear',
          'Transmission fluid degradation',
          'Valve body issues'
        ],
        solutions: [
          'Transmission fluid flush and refill (multiple times)',
          'Torque converter replacement',
          'Transmission replacement (in severe cases)'
        ],
        estimatedCost: '$200 - $2,000+',
        difficulty: 'medium',
        preventionTips: [
          'Regular transmission fluid changes',
          'Avoid aggressive acceleration',
          'Address shuddering promptly'
        ],
        relatedParts: ['Torque converter', 'Transmission fluid', 'Transmission filter'],
        reportedBy: 900,
        lastUpdated: new Date('2023-12-15'),
        isAdminVerified: true,
        adminNotes: 'Toyota issued a technical service bulletin (TSB) for this issue, recommending a specific fluid flush procedure.',
        affectedVehicles: 800000,
        recallInfo: {
          hasRecall: false
        }
      },
      {
        id: 'admin-28',
        title: 'Ford Escape Transmission Failure',
        description: 'Premature failure of the automatic transmission, leading to slipping, harsh shifts, or loss of drive.',
        make: 'Ford',
        model: 'Escape',
        yearRange: '2008-2012',
        severity: 'high',
        symptoms: [
          'Transmission slipping or delayed engagement',
          'Harsh or erratic shifts',
          'Loss of forward or reverse gears',
          'Transmission warning light',
          'Burning smell'
        ],
        causes: [
          'Internal transmission component wear',
          'Valve body issues',
          'Fluid contamination',
          'Overheating'
        ],
        solutions: [
          'Transmission rebuild or replacement',
          'Transmission fluid and filter change',
          'Valve body replacement'
        ],
        estimatedCost: '$2,500 - $4,000',
        difficulty: 'expert',
        preventionTips: [
          'Regular transmission fluid and filter changes',
          'Avoid heavy towing or aggressive driving',
          'Address any transmission symptoms immediately'
        ],
        relatedParts: ['Transmission assembly', 'Valve body', 'Transmission fluid'],
        reportedBy: 1100,
        lastUpdated: new Date('2023-12-10'),
        isAdminVerified: true,
        adminNotes: 'Common issue for this generation of Escape. Often requires a full transmission rebuild or replacement.',
        affectedVehicles: 950000,
        recallInfo: {
          hasRecall: false
        }
      },
      {
        id: 'admin-29',
        title: 'BMW N20/N26 Engine Oil Filter Housing Gasket Leak',
        description: 'Oil and/or coolant leaks from the oil filter housing gasket, often dripping onto the serpentine belt and causing it to shred.',
        make: 'BMW',
        model: '428i',
        yearRange: '2012-2016',
        severity: 'medium',
        symptoms: [
          'Visible oil/coolant leak under engine',
          'Burning oil smell',
          'Serpentine belt shredding or coming off',
          'Low oil/coolant warning light'
        ],
        causes: [
          'Degradation of rubber gasket due to heat cycling',
          'Oil filter housing warping'
        ],
        solutions: [
          'Replace oil filter housing gasket (and cooler gasket if applicable)',
          'Replace serpentine belt if damaged',
          'Clean up oil/coolant residue'
        ],
        estimatedCost: '$300 - $600',
        difficulty: 'medium',
        preventionTips: [
          'Inspect gasket for leaks during oil changes',
          'Address leaks promptly to prevent belt damage'
        ],
        relatedParts: ['Oil filter housing gasket', 'Oil cooler gasket', 'Serpentine belt'],
        reportedBy: 500,
        lastUpdated: new Date('2023-12-05'),
        isAdminVerified: true,
        adminNotes: 'Very common and relatively inexpensive repair, but can lead to significant secondary damage if ignored (e.g., belt shredding, loss of power steering/alternator).',
        affectedVehicles: 400000,
        recallInfo: {
          hasRecall: false
        }
      },
      {
        id: 'admin-30',
        title: 'Audi A3/A4 Water Pump Failure',
        description: 'Premature failure of the plastic water pump housing or internal components, leading to coolant leaks and engine overheating.',
        make: 'Audi',
        model: 'A3',
        yearRange: '2008-2013',
        severity: 'high',
        symptoms: [
          'Coolant leak (visible puddles or low coolant warning)',
          'Engine overheating',
          'Sweet smell from engine bay',
          'Steam from engine compartment'
        ],
        causes: [
          'Plastic housing cracking due to heat cycling',
          'Bearing failure',
          'Seal degradation'
        ],
        solutions: [
          'Water pump replacement (with updated design)',
          'Thermostat replacement (often integrated)',
          'Cooling system flush'
        ],
        estimatedCost: '$600 - $1,200',
        difficulty: 'hard',
        preventionTips: [
          'Monitor coolant levels regularly',
          'Address any coolant leaks immediately',
          'Use correct coolant type'
        ],
        relatedParts: ['Water pump', 'Thermostat', 'Coolant'],
        reportedBy: 700,
        lastUpdated: new Date('2023-12-01'),
        isAdminVerified: true,
        adminNotes: 'Common failure point. Updated water pump designs are more robust. Can cause significant engine damage if overheating is ignored.',
        affectedVehicles: 500000,
        recallInfo: {
          hasRecall: false
        }
      },
      {
        id: 'admin-31',
        title: 'Chevrolet Equinox Excessive Oil Consumption',
        description: 'Excessive oil consumption in 2.4L Ecotec engines due to defective piston rings and PCV system issues.',
        make: 'Chevrolet',
        model: 'Equinox',
        yearRange: '2010-2017',
        severity: 'high',
        symptoms: [
          'Frequent need to add oil between changes',
          'Blue smoke from exhaust',
          'Low oil pressure warning light',
          'Engine noise (ticking/knocking)'
        ],
        causes: [
          'Defective piston rings',
          'PCV system clogging',
          'Carbon buildup'
        ],
        solutions: [
          'Piston and connecting rod replacement (engine rebuild)',
          'PCV system service/replacement',
          'Engine replacement (in severe cases)'
        ],
        estimatedCost: '$2,500 - $5,000',
        difficulty: 'expert',
        preventionTips: [
          'Check oil level every 1,000 miles',
          'Use high-quality synthetic oil',
          'Ensure PCV system is functioning correctly'
        ],
        relatedParts: ['Pistons', 'Piston rings', 'Connecting rods', 'PCV valve'],
        reportedBy: 1600,
        lastUpdated: new Date('2023-11-28'),
        isAdminVerified: true,
        adminNotes: 'Subject of a class-action lawsuit and extended warranty programs. Requires significant engine work to resolve.',
        affectedVehicles: 1800000,
        recallInfo: {
          hasRecall: false
        }
      },
      {
        id: 'admin-32',
        title: 'Honda CR-V VTC Actuator Noise',
        description: 'Loud grinding or rattling noise on cold startup, lasting for a few seconds, due to a faulty VTC (Variable Timing Control) actuator.',
        make: 'Honda',
        model: 'CR-V',
        yearRange: '2007-2014',
        severity: 'low',
        symptoms: [
          'Loud grinding/rattling noise on cold startup (lasts 1-2 seconds)',
          'Check engine light (P0340, P0341 - camshaft position sensor codes)'
        ],
        causes: [
          'Defective VTC actuator (oil drains out, causing noise until oil pressure builds)',
          'Oil viscosity issues'
        ],
        solutions: [
          'Replace VTC actuator (with updated part)',
          'Use correct oil viscosity',
          'Ensure proper oil change intervals'
        ],
        estimatedCost: '$400 - $800',
        difficulty: 'medium',
        preventionTips: [
          'Use manufacturer-recommended oil and filter',
          'Regular oil changes',
          'Address noise promptly to prevent further issues'
        ],
        relatedParts: ['VTC actuator', 'Camshaft position sensor', 'Timing chain'],
        reportedBy: 800,
        lastUpdated: new Date('2023-11-25'),
        isAdminVerified: true,
        adminNotes: 'Common nuisance issue. While not immediately critical, it can lead to timing chain wear over time if ignored. Updated parts are available.',
        affectedVehicles: 1000000,
        recallInfo: {
          hasRecall: false
        }
      },
      {
        id: 'admin-33',
        title: 'Toyota RAV4 Torque Converter Shudder',
        description: 'Shuddering or vibration felt during light acceleration, typically between 30-50 mph, caused by the torque converter.',
        make: 'Toyota',
        model: 'RAV4',
        yearRange: '2006-2012',
        severity: 'medium',
        symptoms: [
          'Shuddering or vibration during light acceleration (30-50 mph)',
          'Rough shifts',
          'Check engine light (rarely)'
        ],
        causes: [
          'Torque converter internal wear',
          'Transmission fluid degradation',
          'Valve body issues'
        ],
        solutions: [
          'Multiple transmission fluid flushes and refills',
          'Torque converter replacement',
          'Transmission replacement (in severe cases)'
        ],
        estimatedCost: '$200 - $2,500+',
        difficulty: 'medium',
        preventionTips: [
          'Regular transmission fluid changes',
          'Avoid aggressive acceleration',
          'Address shuddering promptly'
        ],
        relatedParts: ['Torque converter', 'Transmission fluid', 'Transmission filter'],
        reportedBy: 700,
        lastUpdated: new Date('2023-11-20'),
        isAdminVerified: true,
        adminNotes: 'Toyota issued a technical service bulletin (TSB) for this issue, recommending a specific fluid flush procedure. Can be a costly repair if torque converter needs replacement.',
        affectedVehicles: 900000,
        recallInfo: {
          hasRecall: false
        }
      },
      {
        id: 'admin-34',
        title: 'Ford Focus Transmission Control Module (TCM) Failure',
        description: 'Failure of the TCM in PowerShift transmissions, leading to various transmission malfunctions, including no-start conditions.',
        make: 'Ford',
        model: 'Focus',
        yearRange: '2012-2016',
        severity: 'high',
        symptoms: [
          'Transmission warning light',
          'Vehicle fails to start or engage gear',
          'Harsh or delayed shifts',
          'Loss of power while driving',
          'Engine stalls'
        ],
        causes: [
          'Internal TCM component failure (often due to heat)',
          'Software corruption'
        ],
        solutions: [
          'TCM replacement (often covered by extended warranty/recall)',
          'TCM software update',
          'Clutch pack replacement (if related damage)'
        ],
        estimatedCost: '$800 - $1,500',
        difficulty: 'medium',
        preventionTips: [
          'Ensure all software updates are applied',
          'Address any transmission warning lights immediately'
        ],
        relatedParts: ['Transmission Control Module (TCM)', 'Clutch packs'],
        reportedBy: 1500,
        lastUpdated: new Date('2023-11-15'),
        isAdminVerified: true,
        adminNotes: 'Subject of multiple class-action lawsuits and extended warranty programs. Ford extended the warranty on the TCM for many affected vehicles.',
        affectedVehicles: 2000000,
        recallInfo: {
          hasRecall: true,
          recallNumber: 'NHTSA-14V-596',
          description: 'Transmission control module may fail, causing loss of power'
        }
      },
      {
        id: 'admin-35',
        title: 'BMW N52/N51 Electric Water Pump Failure',
        description: 'Premature failure of the electric water pump, leading to engine overheating.',
        make: 'BMW',
        model: '328i',
        yearRange: '2006-2013',
        severity: 'high',
        symptoms: [
          'Engine overheating warning',
          'Coolant leak (sometimes)',
          'Electric fan running constantly',
          'No heat from heater'
        ],
        causes: [
          'Internal electronic component failure',
          'Wear and tear',
          'Overheating stress'
        ],
        solutions: [
          'Replace electric water pump (and thermostat, often replaced together)',
          'Cooling system bleed',
          'Coolant flush'
        ],
        estimatedCost: '$800 - $1,500',
        difficulty: 'hard',
        preventionTips: [
          'Replace proactively around 80k-100k miles',
          'Monitor coolant temperature',
          'Use proper coolant mixture'
        ],
        relatedParts: ['Electric water pump', 'Thermostat', 'Coolant'],
        reportedBy: 600,
        lastUpdated: new Date('2023-11-10'),
        isAdminVerified: true,
        adminNotes: 'Very common failure point on these engines. Can cause significant engine damage if ignored. Proactive replacement is recommended.',
        affectedVehicles: 700000,
        recallInfo: {
          hasRecall: false
        }
      },
      {
        id: 'admin-36',
        title: 'Audi A4 B8 MMI Control Unit Failure',
        description: 'Failure of the MMI (Multi Media Interface) control unit, leading to inoperable infotainment system, radio, or navigation.',
        make: 'Audi',
        model: 'A4',
        yearRange: '2008-2016',
        severity: 'low',
        symptoms: [
          'MMI system completely inoperable',
          'Buttons not responding',
          'Screen blank or flickering',
          'No audio from radio/media'
        ],
        causes: [
          'Internal electronic component failure',
          'Liquid damage',
          'Software corruption'
        ],
        solutions: [
          'Replace MMI control unit',
          'Repair MMI control unit (specialized service)',
          'Software update'
        ],
        estimatedCost: '$500 - $1,500',
        difficulty: 'medium',
        preventionTips: [
          'Avoid liquid spills near MMI controls',
          'Ensure proper ventilation around unit'
        ],
        relatedParts: ['MMI control unit', 'MMI display', 'Fiber optic cables'],
        reportedBy: 400,
        lastUpdated: new Date('2023-11-05'),
        isAdminVerified: true,
        adminNotes: 'Common electronic failure. Can be costly to replace, but repair services are available.',
        affectedVehicles: 500000,
        recallInfo: {
          hasRecall: false
        }
      },
      {
        id: 'admin-37',
        title: 'Chevrolet Silverado/Sierra AFM Lifter Failure',
        description: 'Failure of Active Fuel Management (AFM) lifters, leading to engine misfires, ticking noises, and potential camshaft damage.',
        make: 'Chevrolet',
        model: 'Silverado 1500',
        yearRange: '2007-2013',
        severity: 'high',
        symptoms: [
          'Engine ticking or knocking noise',
          'Engine misfires (P0300 series codes)',
          'Check engine light',
          'Excessive oil consumption',
          'Reduced engine power'
        ],
        causes: [
          'AFM lifter design flaw (collapsing/sticking)',
          'Insufficient oil pressure to lifters',
          'Oil sludge',
          'Camshaft lobe wear'
        ],
        solutions: [
          'AFM lifter replacement (often requires camshaft replacement)',
          'AFM delete kit (aftermarket)',
          'Regular oil changes with correct oil specification'
        ],
        estimatedCost: '$2,000 - $4,000+',
        difficulty: 'expert',
        preventionTips: [
          'Use high-quality synthetic oil and change regularly',
          'Consider AFM deactivation (tuning)',
          'Monitor for ticking noises'
        ],
        relatedParts: ['AFM lifters', 'Camshaft', 'Pushrods', 'Valve covers'],
        reportedBy: 1000,
        lastUpdated: new Date('2023-11-01'),
        isAdminVerified: true,
        adminNotes: 'Very common and costly issue. Many owners opt for AFM delete kits to prevent recurrence.',
        affectedVehicles: 2500000,
        recallInfo: {
          hasRecall: false
        }
      },
      {
        id: 'admin-38',
        title: 'Honda Odyssey Sliding Door Issues',
        description: 'Malfunction of the power sliding doors, including failure to open/close, getting stuck, or making grinding noises.',
        make: 'Honda',
        model: 'Odyssey',
        yearRange: '2005-2010',
        severity: 'low',
        symptoms: [
          'Power sliding door not opening/closing',
          'Door getting stuck halfway',
          'Grinding or clicking noises from door mechanism',
          'Door warning light on dashboard'
        ],
        causes: [
          'Faulty door rollers/cables',
          'Motor failure',
          'Electrical issues (wiring harness, switches)',
          'Obstruction in track'
        ],
        solutions: [
          'Replace door rollers/cables',
          'Replace door motor',
          'Inspect and repair wiring harness',
          'Clean and lubricate door tracks'
        ],
        estimatedCost: '$300 - $800',
        difficulty: 'medium',
        preventionTips: [
          'Keep door tracks clean and free of debris',
          'Lubricate rollers and hinges periodically',
          'Avoid forcing the door if it gets stuck'
        ],
        relatedParts: ['Sliding door motor', 'Door rollers', 'Door cables', 'Door switches'],
        reportedBy: 600,
        lastUpdated: new Date('2023-10-28'),
        isAdminVerified: true,
        adminNotes: 'Common nuisance issue for minivan owners. Can be frustrating but usually not a safety concern.',
        affectedVehicles: 800000,
        recallInfo: {
          hasRecall: false
        }
      },
      {
        id: 'admin-39',
        title: 'Toyota Prius ABS Actuator Failure',
        description: 'Failure of the ABS (Anti-lock Braking System) actuator, leading to ABS warning lights, brake pedal pulsation, or reduced braking performance.',
        make: 'Toyota',
        model: 'Prius',
        yearRange: '2010-2015',
        severity: 'high',
        symptoms: [
          'ABS warning light on dashboard',
          'Brake system warning light',
          'Brake pedal feels spongy or hard',
          'Brake pedal pulsation',
          'Reduced braking effectiveness'
        ],
        causes: [
          'Internal electronic component failure in ABS actuator',
          'Motor failure within actuator',
          'Brake fluid contamination'
        ],
        solutions: [
          'Replace ABS actuator assembly',
          'Brake fluid flush and bleed'
        ],
        estimatedCost: '$1,500 - $2,500',
        difficulty: 'hard',
        preventionTips: [
          'Regular brake fluid flushes',
          'Address any brake warning lights immediately'
        ],
        relatedParts: ['ABS actuator', 'Brake fluid', 'Brake lines'],
        reportedBy: 900,
        lastUpdated: new Date('2023-10-25'),
        isAdminVerified: true,
        adminNotes: 'Known issue. Toyota issued a warranty enhancement program (ZE1) for affected vehicles, extending coverage for the ABS actuator.',
        affectedVehicles: 700000,
        recallInfo: {
          hasRecall: false
        }
      },
      {
        id: 'admin-40',
        title: 'Ford Focus Transmission Shudder (Manual)',
        description: 'Shuddering or vibration during acceleration in manual transmission Ford Focus models, often due to clutch issues.',
        make: 'Ford',
        model: 'Focus',
        yearRange: '2000-2007',
        severity: 'medium',
        symptoms: [
          'Shuddering or vibration on acceleration (especially in lower gears)',
          'Difficulty shifting gears',
          'Clutch pedal feels soft or hard',
          'Burning smell from clutch'
        ],
        causes: [
          'Worn clutch disc or pressure plate',
          'Flywheel issues',
          'Pilot bearing wear',
          'Transmission fluid issues'
        ],
        solutions: [
          'Clutch kit replacement (disc, pressure plate, pilot bearing)',
          'Flywheel resurfacing or replacement',
          'Transmission fluid change'
        ],
        estimatedCost: '$600 - $1,200',
        difficulty: 'medium',
        preventionTips: [
          'Avoid riding the clutch',
          'Ensure proper clutch engagement',
          'Regular transmission fluid checks'
        ],
        relatedParts: ['Clutch kit', 'Flywheel', 'Pilot bearing', 'Transmission fluid'],
        reportedBy: 400,
        lastUpdated: new Date('2023-10-20'),
        isAdminVerified: true,
        adminNotes: 'Common wear item for manual transmissions. Driving habits significantly impact clutch lifespan.',
        affectedVehicles: 500000,
        recallInfo: {
          hasRecall: false
        }
      },
      {
        id: 'admin-41',
        title: 'BMW E90 FRM (Footwell Module) Failure',
        description: 'Failure of the Footwell Module, leading to inoperable lights (headlights, taillights, interior lights), power windows, or sunroof.',
        make: 'BMW',
        model: '328i',
        yearRange: '2007-2011',
        severity: 'high',
        symptoms: [
          'Headlights/taillights not working',
          'Interior lights inoperable',
          'Power windows not functioning',
          'Sunroof not opening/closing',
          'Error messages on iDrive/dashboard'
        ],
        causes: [
          'Electrical surge (e.g., jump starting, battery disconnect)',
          'Internal electronic component failure',
          'Software corruption'
        ],
        solutions: [
          'Replace FRM module (requires coding)',
          'Repair FRM module (specialized service)',
          'Avoid disconnecting battery without proper procedure'
        ],
        estimatedCost: '$500 - $1,000',
        difficulty: 'hard',
        preventionTips: [
          'Always use a battery maintainer when disconnecting battery',
          'Avoid jump starting without proper precautions'
        ],
        relatedParts: ['Footwell Module (FRM)', 'Wiring harness'],
        reportedBy: 700,
        lastUpdated: new Date('2023-10-15'),
        isAdminVerified: true,
        adminNotes: 'Very common issue, often triggered by low battery voltage or improper jump-starting. Can be repaired by specialists, or replaced and coded by BMW.',
        affectedVehicles: 800000,
        recallInfo: {
          hasRecall: false
        }
      },
      {
        id: 'admin-42',
        title: 'Mercedes-Benz W204 Steering Lock (ESL/ELV) Failure',
        description: 'Failure of the Electronic Steering Lock (ESL) or Electronic Ignition Switch (EIS), preventing the vehicle from starting.',
        make: 'Mercedes-Benz',
        model: 'C250',
        yearRange: '2008-2014',
        severity: 'critical',
        symptoms: [
          'Key turns in ignition but vehicle does not start',
          'Steering wheel remains locked',
          'No dashboard lights or ignition power',
          'Error message on dashboard (e.g., "Steering Lock Malfunction")'
        ],
        causes: [
          'Internal electronic component failure in ESL/EIS',
          'Wear and tear',
          'Software issues'
        ],
        solutions: [
          'Replace ESL/EIS module (requires coding and synchronization)',
          'Repair ESL module (specialized service)'
        ],
        estimatedCost: '$800 - $1,500',
        difficulty: 'expert',
        preventionTips: [
          'Avoid leaving key in ignition for extended periods when vehicle is off',
          'Address any intermittent starting issues promptly'
        ],
        relatedParts: ['Electronic Steering Lock (ESL)', 'Electronic Ignition Switch (EIS)', 'Key'],
        reportedBy: 500,
        lastUpdated: new Date('2023-10-10'),
        isAdminVerified: true,
        adminNotes: 'Common and frustrating issue that renders the car inoperable. Requires specialized tools and programming to fix.',
        affectedVehicles: 600000,
        recallInfo: {
          hasRecall: false
        }
      },
      {
        id: 'admin-43',
        title: 'Chevrolet Cruze PCV Valve/Intake Manifold Failure',
        description: 'Failure of the PCV (Positive Crankcase Ventilation) valve or intake manifold, leading to oil leaks, engine noise, and misfires.',
        make: 'Chevrolet',
        model: 'Cruze',
        yearRange: '2011-2016',
        severity: 'medium',
        symptoms: [
          'Oil leak (often from valve cover or rear main seal)',
          'Whistling or sucking noise from engine',
          'Engine misfires',
          'Check engine light',
          'Excessive oil consumption'
        ],
        causes: [
          'PCV valve diaphragm failure (integrated into intake manifold)',
          'Cracked intake manifold',
          'Excessive crankcase pressure'
        ],
        solutions: [
          'Replace intake manifold (if PCV valve is integrated)',
          'Replace PCV valve (if separate)',
          'Replace valve cover gasket/rear main seal if leaking'
        ],
        estimatedCost: '$300 - $800',
        difficulty: 'medium',
        preventionTips: [
          'Regular oil changes',
          'Address any engine noises or oil leaks promptly'
        ],
        relatedParts: ['Intake manifold', 'PCV valve', 'Valve cover gasket', 'Rear main seal'],
        reportedBy: 800,
        lastUpdated: new Date('2023-10-05'),
        isAdminVerified: true,
        adminNotes: 'Very common issue. The PCV system is often integrated into the intake manifold, making it a more expensive repair. Can lead to significant oil leaks and engine damage if ignored.',
        affectedVehicles: 1000000,
        recallInfo: {
          hasRecall: false
        }
      },
      {
        id: 'admin-44',
        title: 'Honda Accord Power Steering Pump Leak',
        description: 'Power steering pump leaks, leading to fluid loss, noise, and potential steering issues.',
        make: 'Honda',
        model: 'Accord',
        yearRange: '2003-2007',
        severity: 'low',
        symptoms: [
          'Power steering fluid leak (visible puddles)',
          'Whining or groaning noise from power steering pump',
          'Stiff steering',
          'Low power steering fluid reservoir'
        ],
        causes: [
          'Degraded seals within the power steering pump',
          'Loose hose connections',
          'Cracked reservoir'
        ],
        solutions: [
          'Replace power steering pump seals or entire pump',
          'Tighten hose connections',
          'Replace power steering reservoir if cracked'
        ],
        estimatedCost: '$200 - $500',
        difficulty: 'medium',
        preventionTips: [
          'Inspect power steering system for leaks periodically',
          'Use correct power steering fluid type',
          'Address leaks promptly'
        ],
        relatedParts: ['Power steering pump', 'Power steering fluid', 'Power steering hoses'],
        reportedBy: 500,
        lastUpdated: new Date('2023-10-01'),
        isAdminVerified: true,
        adminNotes: 'Common issue. While not immediately critical, low fluid can damage the pump and lead to loss of power assist.',
        affectedVehicles: 700000,
        recallInfo: {
          hasRecall: false
        }
      },
      {
        id: 'admin-45',
        title: 'Toyota Prius MFD (Multi-Function Display) Failure',
        description: 'Failure of the Multi-Function Display (MFD) screen, leading to inoperable touch screen, navigation, audio, and climate controls.',
        make: 'Toyota',
        model: 'Prius',
        yearRange: '2004-2009',
        severity: 'medium',
        symptoms: [
          'MFD screen is blank or black',
          'Touch screen not responding',
          'Navigation, audio, climate controls inoperable',
          'Flickering screen'
        ],
        causes: [
          'Internal electronic component failure',
          'Backlight failure',
          'Software glitches'
        ],
        solutions: [
          'Replace MFD unit',
          'Repair MFD unit (specialized service)',
          'Check fuses and electrical connections'
        ],
        estimatedCost: '$500 - $1,500',
        difficulty: 'medium',
        preventionTips: [
          'Avoid extreme temperatures (leaving car in direct sun)',
          'Address any screen issues promptly'
        ],
        relatedParts: ['Multi-Function Display (MFD) unit', 'Wiring harness'],
        reportedBy: 600,
        lastUpdated: new Date('2023-09-28'),
        isAdminVerified: true,
        adminNotes: 'Common electronic failure. Can be frustrating as many vehicle functions are integrated into the display.',
        affectedVehicles: 800000,
        recallInfo: {
          hasRecall: false
        }
      },
      {
        id: 'admin-46',
        title: 'Ford F-150 Spark Plug Ejection',
        description: 'Spark plugs ejecting from the cylinder head due to insufficient thread engagement in 2-valve 5.4L Triton engines.',
        make: 'Ford',
        model: 'F-150',
        yearRange: '1997-2003',
        severity: 'high',
        symptoms: [
          'Loud popping noise from engine',
          'Engine misfire',
          'Check engine light',
          'Loss of engine power',
          'Spark plug found loose or ejected from head'
        ],
        causes: [
          'Insufficient spark plug threads in cylinder head design',
          'Improper spark plug torque',
          'Over-tightening spark plugs'
        ],
        solutions: [
          'Repair cylinder head threads (insert kit)',
          'Replace cylinder head',
          'Replace spark plug and coil pack'
        ],
        estimatedCost: '$300 - $1,000 per cylinder (repair), $2,000+ (head replacement)',
        difficulty: 'hard',
        preventionTips: [
          'Use correct spark plugs and torque specifications',
          'Avoid over-tightening spark plugs'
        ],
        relatedParts: ['Spark plugs', 'Cylinder head', 'Coil pack'],
        reportedBy: 700,
        lastUpdated: new Date('2023-09-25'),
        isAdminVerified: true,
        adminNotes: 'Well-known design flaw. Can be repaired with thread insert kits, but requires careful work. Often affects multiple cylinders over time.',
        affectedVehicles: 1500000,
        recallInfo: {
          hasRecall: false
        }
      },
      {
        id: 'admin-47',
        title: 'BMW E46 Window Regulator Failure',
        description: 'Failure of the power window regulator mechanism, causing the window to fall into the door or become inoperable.',
        make: 'BMW',
        model: '325i',
        yearRange: '1999-2005',
        severity: 'low',
        symptoms: [
          'Window falls into door',
          'Window not moving up or down',
          'Grinding or clicking noise when operating window',
          'Window stuck in open position'
        ],
        causes: [
          'Plastic clips breaking',
          'Cable fraying or snapping',
          'Motor failure'
        ],
        solutions: [
          'Replace window regulator assembly',
          'Replace motor (if separate)'
        ],
        estimatedCost: '$200 - $400',
        difficulty: 'medium',
        preventionTips: [
          'Avoid forcing window if it gets stuck',
          'Lubricate window tracks periodically'
        ],
        relatedParts: ['Window regulator', 'Window motor'],
        reportedBy: 800,
        lastUpdated: new Date('2023-09-20'),
        isAdminVerified: true,
        adminNotes: 'Very common issue due to plastic components degrading over time. Relatively straightforward DIY repair.',
        affectedVehicles: 1000000,
        recallInfo: {
          hasRecall: false
        }
      },
      {
        id: 'admin-48',
        title: 'Audi B8 A4/A5 Thermostat Housing Leak',
        description: 'Coolant leak from the plastic thermostat housing, often leading to low coolant levels and potential overheating.',
        make: 'Audi',
        model: 'A4',
        yearRange: '2009-2016',
        severity: 'medium',
        symptoms: [
          'Coolant leak (visible puddles or low coolant warning)',
          'Sweet smell from engine bay',
          'Engine overheating (if leak is severe)',
          'Check engine light (thermostat related codes)'
        ],
        causes: [
          'Plastic housing cracking due to heat cycling',
          'Gasket degradation'
        ],
        solutions: [
          'Replace thermostat housing (often includes thermostat)',
          'Coolant flush and refill'
        ],
        estimatedCost: '$400 - $800',
        difficulty: 'medium',
        preventionTips: [
          'Monitor coolant levels regularly',
          'Address any coolant leaks immediately',
          'Use correct coolant type'
        ],
        relatedParts: ['Thermostat housing', 'Thermostat', 'Coolant'],
        reportedBy: 600,
        lastUpdated: new Date('2023-09-15'),
        isAdminVerified: true,
        adminNotes: 'Common failure point. Can be a DIY job but requires careful attention to bleeding the cooling system.',
        affectedVehicles: 700000,
        recallInfo: {
          hasRecall: false
        }
      },
      {
        id: 'admin-49',
        title: 'Chevrolet Malibu Power Steering Assist Failure',
        description: 'Loss of electric power steering assist, making steering very difficult, often due to a faulty power steering motor or module.',
        make: 'Chevrolet',
        model: 'Malibu',
        yearRange: '2004-2012',
        severity: 'high',
        symptoms: [
          'Sudden loss of power steering assist while driving',
          'Steering becomes very difficult',
          'Power steering warning light on dashboard',
          'Noises from steering column'
        ],
        causes: [
          'Faulty electric power steering motor',
          'Defective power steering control module',
          'Wiring issues'
        ],
        solutions: [
          'Replace electric power steering motor/module',
          'Inspect and repair wiring harness'
        ],
        estimatedCost: '$500 - $1,000',
        difficulty: 'medium',
        preventionTips: [
          'Address any intermittent power steering issues promptly',
          'Ensure vehicle electrical system is healthy'
        ],
        relatedParts: ['Electric power steering motor', 'Power steering control module', 'Steering column'],
        reportedBy: 900,
        lastUpdated: new Date('2023-09-10'),
        isAdminVerified: true,
        adminNotes: 'Subject of a major recall by GM due to safety concerns. Check VIN for eligibility.',
        affectedVehicles: 1300000,
        recallInfo: {
          hasRecall: true,
          recallNumber: 'NHTSA-14V-153',
          description: 'Loss of electric power steering assist'
        }
      },
      {
        id: 'admin-50',
        title: 'Honda Civic Engine Mount Failure',
        description: 'Premature failure of the passenger side engine mount, leading to excessive engine vibration and noise.',
        make: 'Honda',
        model: 'Civic',
        yearRange: '2006-2011',
        severity: 'medium',
        symptoms: [
          'Excessive engine vibration (especially at idle or low speeds)',
          'Clunking noise when shifting gears or accelerating/decelerating',
          'Engine appears to move excessively',
          'Rough idle'
        ],
        causes: [
          'Degradation of rubber in engine mount',
          'Fluid leak from hydraulic mount',
          'Wear and tear'
        ],
        solutions: [
          'Replace engine mount (passenger side is most common)',
          'Inspect other engine mounts for wear'
        ],
        estimatedCost: '$200 - $500',
        difficulty: 'medium',
        preventionTips: [
          'Inspect engine mounts during routine maintenance',
          'Avoid harsh acceleration/braking'
        ],
        relatedParts: ['Engine mount (passenger side)', 'Other engine mounts'],
        reportedBy: 700,
        lastUpdated: new Date('2023-09-05'),
        isAdminVerified: true,
        adminNotes: 'Very common issue. Can be a DIY repair, but ensure proper support for the engine during replacement.',
        affectedVehicles: 900000,
        recallInfo: {
          hasRecall: false
        }
      },
      {
        id: 'admin-51',
        title: 'Toyota Highlander V6 Oil Leak (VVT-i Line)',
        description: 'Oil leak from the VVT-i (Variable Valve Timing with intelligence) oil supply line, often due to a degraded rubber hose section.',
        make: 'Toyota',
        model: 'Highlander',
        yearRange: '2007-2011',
        severity: 'medium',
        symptoms: [
          'Visible oil leak under engine (often near passenger side)',
          'Burning oil smell',
          'Low engine oil level',
          'Oil pressure warning light (if severe)'
        ],
        causes: [
          'Degradation of rubber section in VVT-i oil line',
          'Cracked plastic components'
        ],
        solutions: [
          'Replace VVT-i oil supply line (with updated all-metal version)',
          'Clean up oil residue'
        ],
        estimatedCost: '$200 - $400',
        difficulty: 'medium',
        preventionTips: [
          'Inspect VVT-i line for leaks during oil changes',
          'Address leaks promptly to prevent oil starvation'
        ],
        relatedParts: ['VVT-i oil supply line', 'Engine oil'],
        reportedBy: 600,
        lastUpdated: new Date('2023-09-01'),
        isAdminVerified: true,
        adminNotes: 'Toyota issued a limited service campaign (LSC) for this issue, replacing the rubber hose with an all-metal line. Can lead to engine damage if oil level drops too low.',
        affectedVehicles: 750000,
        recallInfo: {
          hasRecall: false
        }
      },
      {
        id: 'admin-52',
        title: 'Ford Fusion EPAS (Electric Power Assist Steering) Failure',
        description: 'Loss of electric power steering assist, making steering very difficult, often due to a faulty EPAS motor or module.',
        make: 'Ford',
        model: 'Fusion',
        yearRange: '2010-2014',
        severity: 'high',
        symptoms: [
          'Sudden loss of power steering assist while driving',
          'Steering becomes very difficult',
          'Power steering warning light on dashboard',
          'Error message on display (e.g., "Steering Assist Fault")'
        ],
        causes: [
          'Faulty EPAS motor or torque sensor',
          'Defective EPAS control module',
          'Wiring issues'
        ],
        solutions: [
          'Replace EPAS steering gear assembly',
          'Replace EPAS control module',
          'Inspect and repair wiring harness'
        ],
        estimatedCost: '$1,000 - $2,000',
        difficulty: 'hard',
        preventionTips: [
          'Address any intermittent power steering issues promptly',
          'Ensure vehicle electrical system is healthy'
        ],
        relatedParts: ['EPAS steering gear', 'EPAS control module', 'Steering column'],
        reportedBy: 1000,
        lastUpdated: new Date('2023-08-28'),
        isAdminVerified: true,
        adminNotes: 'Subject of a major recall by Ford due to safety concerns. Check VIN for eligibility.',
        affectedVehicles: 1500000,
        recallInfo: {
          hasRecall: true,
          recallNumber: 'NHTSA-15V-340',
          description: 'Loss of electric power steering assist'
        }
      },
      {
        id: 'admin-53',
        title: 'BMW E90 Valve Cover Gasket Leak',
        description: 'Oil leak from the valve cover gasket, often leading to burning oil smell, visible leaks, and potential damage to other components.',
        make: 'BMW',
        model: '328i',
        yearRange: '2006-2013',
        severity: 'medium',
        symptoms: [
          'Visible oil leak around valve cover',
          'Burning oil smell (especially after driving)',
          'Smoke from engine bay',
          'Oil dripping onto exhaust manifold'
        ],
        causes: [
          'Degradation of rubber gasket due to heat cycling',
          'Cracked valve cover (less common)'
        ],
        solutions: [
          'Replace valve cover gasket (and sometimes valve cover itself)',
          'Clean up oil residue'
        ],
        estimatedCost: '$400 - $800',
        difficulty: 'medium',
        preventionTips: [
          'Inspect valve cover for leaks during oil changes',
          'Address leaks promptly to prevent secondary damage'
        ],
        relatedParts: ['Valve cover gasket', 'Valve cover', 'Spark plug tube seals'],
        reportedBy: 700,
        lastUpdated: new Date('2023-08-25'),
        isAdminVerified: true,
        adminNotes: 'Very common issue. Can be a time-consuming DIY job due to many components needing removal. Important to use quality replacement parts.',
        affectedVehicles: 900000,
        recallInfo: {
          hasRecall: false
        }
      },
      {
        id: 'admin-54',
        title: 'Audi B7 A4 PCV Valve Failure',
        description: 'Failure of the PCV (Positive Crankcase Ventilation) valve, leading to excessive oil consumption, engine noise, and misfires.',
        make: 'Audi',
        model: 'A4',
        yearRange: '2005-2008',
        severity: 'medium',
        symptoms: [
          'Excessive oil consumption',
          'Whistling or sucking noise from engine',
          'Engine misfires',
          'Check engine light (various codes)',
          'Rough idle'
        ],
        causes: [
          'PCV valve diaphragm failure',
          'Clogging of PCV system components'
        ],
        solutions: [
          'Replace PCV valve (with updated part)',
          'Clean PCV system hoses and passages'
        ],
        estimatedCost: '$200 - $500',
        difficulty: 'medium',
        preventionTips: [
          'Regular oil changes',
          'Address any engine noises or oil consumption promptly'
        ],
        relatedParts: ['PCV valve', 'PCV hoses'],
        reportedBy: 600,
        lastUpdated: new Date('2023-08-20'),
        isAdminVerified: true,
        adminNotes: 'Common issue. Updated PCV valve designs are more robust. Can lead to significant oil consumption and engine issues if ignored.',
        affectedVehicles: 650000,
        recallInfo: {
          hasRecall: false
        }
      },
      {
        id: 'admin-55',
        title: 'Chevrolet Cruze Turbocharger Failure',
        description: 'Premature failure of the turbocharger, leading to loss of power, excessive smoke, and loud noises.',
        make: 'Chevrolet',
        model: 'Cruze',
        yearRange: '2011-2016',
        severity: 'high',
        symptoms: [
          'Loss of engine power',
          'Excessive blue/white smoke from exhaust',
          'Loud whining or grinding noise from engine',
          'Check engine light (turbocharger related codes)',
          'Burning oil smell'
        ],
        causes: [
          'Lack of lubrication (oil starvation)',
          'Bearing failure',
          'Seal failure',
          'Foreign object damage'
        ],
        solutions: [
          'Replace turbocharger assembly',
          'Inspect oil supply/drain lines for clogs',
          'Address underlying oil pressure issues'
        ],
        estimatedCost: '$1,000 - $2,000',
        difficulty: 'hard',
        preventionTips: [
          'Regular oil changes with correct oil specification',
          'Allow engine to idle for a minute after hard driving before shutting off',
          'Address any oil leaks promptly'
        ],
        relatedParts: ['Turbocharger', 'Oil supply line', 'Oil drain line', 'Intercooler'],
        reportedBy: 900,
        lastUpdated: new Date('2023-08-15'),
        isAdminVerified: true,
        adminNotes: 'Common issue. Can be a costly repair. Proper maintenance and addressing oil issues are crucial for turbo longevity.',
        affectedVehicles: 1000000,
        recallInfo: {
          hasRecall: false
        }
      },
      {
        id: 'admin-56',
        title: 'Honda Civic Clear Coat Peeling',
        description: 'Premature clear coat peeling on various body panels, particularly on darker colored vehicles.',
        make: 'Honda',
        model: 'Civic',
        yearRange: '2006-2011',
        severity: 'low',
        symptoms: [
          'Clear coat peeling or flaking off body panels',
          'Dull or faded paint appearance',
          'White or hazy patches on paint'
        ],
        causes: [
          'Defective clear coat application from factory',
          'UV exposure',
          'Environmental factors',
          'Improper car washing techniques'
        ],
        solutions: [
          'Repaint affected panels',
          'Clear coat repair (for minor areas)',
          'Regular waxing/sealing'
        ],
        estimatedCost: '$500 - $2,000+',
        difficulty: 'easy',
        preventionTips: [
          'Regular washing and waxing',
          'Park in shade or use car cover',
          'Avoid harsh chemicals on paint'
        ],
        relatedParts: ['Body panels', 'Paint', 'Clear coat'],
        reportedBy: 1000,
        lastUpdated: new Date('2023-08-10'),
        isAdminVerified: true,
        adminNotes: 'Common cosmetic issue. Honda offered a warranty extension for paint defects on some models. Repainting is the only permanent fix.',
        affectedVehicles: 1200000,
        recallInfo: {
          hasRecall: false
        }
      },
      {
        id: 'admin-57',
        title: 'Toyota Camry Dashboard Cracking',
        description: 'Cracking and melting of the dashboard material, particularly in areas exposed to sunlight.',
        make: 'Toyota',
        model: 'Camry',
        yearRange: '2007-2011',
        severity: 'low',
        symptoms: [
          'Cracks appearing on dashboard surface',
          'Dashboard material becoming sticky or melting',
          'Discoloration of dashboard'
        ],
        causes: [
          'Defective dashboard material from factory',
          'UV exposure and heat',
          'Environmental factors'
        ],
        solutions: [
          'Replace dashboard assembly',
          'Install dashboard cover',
          'Use sunshade when parked'
        ],
        estimatedCost: '$1,000 - $2,000+',
        difficulty: 'hard',
        preventionTips: [
          'Use a sunshade when parked',
          'Apply UV protectant to dashboard',
          'Avoid harsh chemicals on dashboard'
        ],
        relatedParts: ['Dashboard assembly'],
        reportedBy: 800,
        lastUpdated: new Date('2023-08-05'),
        isAdminVerified: true,
        adminNotes: 'Toyota issued a warranty enhancement program (ZE6) for affected vehicles, offering dashboard replacement. Can be a costly repair if not covered.',
        affectedVehicles: 1700000,
        recallInfo: {
          hasRecall: false
        }
      },
      {
        id: 'admin-58',
        title: 'Ford F-150 IWE (Integrated Wheel End) Failure',
        description: 'Failure of the IWE vacuum actuator, leading to grinding noises from the front wheels in 2WD or 4WD auto modes.',
        make: 'Ford',
        model: 'F-150',
        yearRange: '2004-2014',
        severity: 'medium',
        symptoms: [
          'Grinding noise from front wheels (especially on acceleration or turning)',
          'Noise occurs in 2WD or 4WD auto modes',
          'Noise disappears in 4WD high',
          'Loss of 4WD engagement'
        ],
        causes: [
          'Vacuum leak to IWE actuator',
          'Faulty IWE solenoid',
          'Damaged IWE actuator',
          'Hub bearing wear'
        ],
        solutions: [
          'Replace IWE actuator(s)',
          'Replace IWE solenoid',
          'Repair vacuum lines',
          'Replace hub bearing if damaged'
        ],
        estimatedCost: '$200 - $800',
        difficulty: 'medium',
        preventionTips: [
          'Inspect vacuum lines for cracks',
          'Address grinding noises promptly to prevent hub damage'
        ],
        relatedParts: ['IWE actuator', 'IWE solenoid', 'Vacuum lines', 'Hub bearing'],
        reportedBy: 900,
        lastUpdated: new Date('2023-08-01'),
        isAdminVerified: true,
        adminNotes: 'Very common issue. Can lead to expensive hub and axle damage if ignored. Often related to vacuum system integrity.',
        affectedVehicles: 2000000,
        recallInfo: {
          hasRecall: false
        }
      },
      {
        id: 'admin-59',
        title: 'BMW N54 Wastegate Rattle',
        description: 'Loud rattling noise from the turbochargers, particularly on deceleration, due to worn wastegate bushings.',
        make: 'BMW',
        model: '135i',
        yearRange: '2007-2010',
        severity: 'low',
        symptoms: [
          'Loud rattling noise from engine (especially on deceleration)',
          'Noise from turbocharger area',
          'Reduced turbo boost (in severe cases)'
        ],
        causes: [
          'Worn wastegate bushings/flaps',
          'Turbocharger internal wear'
        ],
        solutions: [
          'Wastegate adjustment (temporary fix)',
          'Turbocharger replacement/rebuild',
          'Aftermarket wastegate repair kits'
        ],
        estimatedCost: '$1,500 - $3,000+',
        difficulty: 'expert',
        preventionTips: [
          'Address noise promptly to prevent further turbo damage'
        ],
        relatedParts: ['Turbochargers', 'Wastegate actuators'],
        reportedBy: 600,
        lastUpdated: new Date('2023-07-28'),
        isAdminVerified: true,
        adminNotes: 'Common nuisance issue. While not immediately critical, it indicates wear and can eventually affect turbo performance. Often requires turbo replacement.',
        affectedVehicles: 130000,
        recallInfo: {
          hasRecall: false
        }
      },
      {
        id: 'admin-60',
        title: 'Audi B8 A4/A5 Flex Pipe Failure',
        description: 'Exhaust flex pipe cracking or breaking, leading to loud exhaust noise and potential exhaust leaks.',
        make: 'Audi',
        model: 'A4',
        yearRange: '2009-2016',
        severity: 'low',
        symptoms: [
          'Loud exhaust noise (hissing or rattling)',
          'Exhaust smell in cabin',
          'Check engine light (oxygen sensor codes, rarely)'
        ],
        causes: [
          'Flex pipe material fatigue',
          'Corrosion',
          'Vibration from engine/exhaust'
        ],
        solutions: [
          'Replace flex pipe (often requires cutting and welding)',
          'Replace entire downpipe/mid-pipe assembly'
        ],
        estimatedCost: '$200 - $600',
        difficulty: 'medium',
        preventionTips: [
          'Inspect exhaust system for cracks/leaks periodically',
          'Address noise promptly'
        ],
        relatedParts: ['Exhaust flex pipe', 'Downpipe', 'Mid-pipe'],
        reportedBy: 400,
        lastUpdated: new Date('2023-07-25'),
        isAdminVerified: true,
        adminNotes: 'Common issue due to constant vibration and heat. Can be repaired by welding in a new flex pipe or replacing the entire section.',
        affectedVehicles: 700000,
        recallInfo: {
          hasRecall: false
        }
      },
      {
        id: 'admin-61',
        title: 'Chevrolet Cruze Intake Manifold Gasket Leak',
        description: 'Coolant leak from the intake manifold gasket, leading to low coolant levels and potential overheating.',
        make: 'Chevrolet',
        model: 'Cruze',
        yearRange: '2011-2016',
        severity: 'medium',
        symptoms: [
          'Coolant leak (visible puddles or low coolant warning)',
          'Sweet smell from engine bay',
          'Engine overheating (if leak is severe)',
          'Check engine light'
        ],
        causes: [
          'Degradation of plastic intake manifold gasket',
          'Warped intake manifold'
        ],
        solutions: [
          'Replace intake manifold gasket',
          'Replace intake manifold (if warped)',
          'Coolant flush and refill'
        ],
        estimatedCost: '$300 - $700',
        difficulty: 'medium',
        preventionTips: [
          'Monitor coolant levels regularly',
          'Address any coolant leaks immediately',
          'Use correct coolant type'
        ],
        relatedParts: ['Intake manifold gasket', 'Intake manifold', 'Coolant'],
        reportedBy: 500,
        lastUpdated: new Date('2023-07-20'),
        isAdminVerified: true,
        adminNotes: 'Common issue. Can be a DIY job but requires careful attention to detail. Can lead to significant engine damage if overheating is ignored.',
        affectedVehicles: 1000000,
        recallInfo: {
          hasRecall: false
        }
      },
      {
        id: 'admin-62',
        title: 'Honda Accord Starter Failure',
        description: 'Premature failure of the starter motor, leading to no-start conditions or slow cranking.',
        make: 'Honda',
        model: 'Accord',
        yearRange: '2003-2007',
        severity: 'medium',
        symptoms: [
          'Engine not cranking or slow cranking',
          'Clicking noise when trying to start',
          'No response when turning key',
          'Battery light on (rarely)'
        ],
        causes: [
          'Worn brushes or solenoid in starter motor',
          'Electrical issues (loose connections, faulty relay)',
          'Battery issues (less common)'
        ],
        solutions: [
          'Replace starter motor',
          'Inspect battery and electrical connections',
          'Replace starter relay'
        ],
        estimatedCost: '$300 - $600',
        difficulty: 'medium',
        preventionTips: [
          'Address any slow cranking issues promptly',
          'Ensure battery is in good condition'
        ],
        relatedParts: ['Starter motor', 'Battery', 'Starter relay'],
        reportedBy: 700,
        lastUpdated: new Date('2023-07-15'),
        isAdminVerified: true,
        adminNotes: 'Common wear item. Can be a challenging DIY due to location. Ensure battery is fully charged and tested before replacing starter.',
        affectedVehicles: 900000,
        recallInfo: {
          hasRecall: false
        }
      },
      {
        id: 'admin-63',
        title: 'Toyota Prius Combination Meter Failure',
        description: 'Failure of the combination meter (instrument cluster), leading to blank display, no speedometer, or no fuel gauge.',
        make: 'Toyota',
        model: 'Prius',
        yearRange: '2004-2009',
        severity: 'medium',
        symptoms: [
          'Combination meter display is blank or dark',
          'Speedometer not working',
          'Fuel gauge not working',
          'Warning lights not illuminating'
        ],
        causes: [
          'Internal electronic component failure',
          'Cold solder joints',
          'Software glitches'
        ],
        solutions: [
          'Replace combination meter unit',
          'Repair combination meter (specialized service)',
          'Check fuses and electrical connections'
        ],
        estimatedCost: '$500 - $1,000',
        difficulty: 'medium',
        preventionTips: [
          'Address any intermittent display issues promptly'
        ],
        relatedParts: ['Combination meter (instrument cluster)'],
        reportedBy: 600,
        lastUpdated: new Date('2023-07-10'),
        isAdminVerified: true,
        adminNotes: 'Toyota issued a warranty enhancement program (ZEA) for affected vehicles, extending coverage for the combination meter. Can be a costly repair if not covered.',
        affectedVehicles: 800000,
        recallInfo: {
          hasRecall: false
        }
      },
      {
        id: 'admin-64',
        title: 'Ford F-150 Cam Phasers Noise',
        description: 'Loud ticking or knocking noise from the engine, particularly at idle or low RPMs, due to faulty VCT (Variable Cam Timing) phasers.',
        make: 'Ford',
        model: 'F-150',
        yearRange: '2004-2008',
        severity: 'high',
        symptoms: [
          'Loud ticking or knocking noise from engine (especially at idle)',
          'Rough idle',
          'Reduced engine power',
          'Check engine light (VCT related codes)',
          'Engine stalling'
        ],
        causes: [
          'Worn VCT phasers',
          'Low oil pressure to phasers',
          'Timing chain stretch',
          'Oil sludge'
        ],
        solutions: [
          'Replace VCT phasers (and often timing chain components)',
          'Inspect oil pressure and lubrication system',
          'Regular oil changes with correct oil specification'
        ],
        estimatedCost: '$1,500 - $3,000+',
        difficulty: 'expert',
        preventionTips: [
          'Use high-quality synthetic oil and change regularly',
          'Address any engine noises promptly',
          'Ensure proper oil pressure'
        ],
        relatedParts: ['VCT phasers', 'Timing chain', 'Timing chain tensioners', 'Oil pump'],
        reportedBy: 1000,
        lastUpdated: new Date('2023-07-05'),
        isAdminVerified: true,
        adminNotes: 'Very common and costly issue. Can lead to significant engine damage if ignored. Often requires extensive engine work.',
        affectedVehicles: 2000000,
        recallInfo: {
          hasRecall: false
        }
      }

    ];

    setTimeout(() => {
      setIssues(mockIssues);
      setFilteredIssues(mockIssues);
      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    let filtered = issues.filter(issue => {
      const matchesSearch = issue.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           issue.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           issue.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           issue.model.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesSeverity = selectedSeverity === 'all' || issue.severity === selectedSeverity;
      const matchesMake = selectedMake === 'all' || issue.make === selectedMake;
      const matchesAdminFilter = !showAdminOnly || issue.isAdminVerified;
      
      return matchesSearch && matchesSeverity && matchesMake && matchesAdminFilter;
    });

    // Sort by admin verification first, then severity and upvotes
    filtered.sort((a, b) => {
      // Admin verified issues first
      if (a.isAdminVerified && !b.isAdminVerified) return -1;
      if (!a.isAdminVerified && b.isAdminVerified) return 1;
      
      // Then by severity
      const severityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
      const severityDiff = severityOrder[b.severity] - severityOrder[a.severity];
      if (severityDiff !== 0) return severityDiff;
      
      // Then by upvotes
      
    });

    setFilteredIssues(filtered);
  }, [issues, searchTerm, selectedSeverity, selectedMake, showAdminOnly]);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-600 bg-red-100 border-red-200';
      case 'high': return 'text-orange-600 bg-orange-100 border-orange-200';
      case 'medium': return 'text-yellow-600 bg-yellow-100 border-yellow-200';
      case 'low': return 'text-green-600 bg-green-100 border-green-200';
      default: return 'text-gray-600 bg-gray-100 border-gray-200';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical':
      case 'high':
        return <AlertTriangle className="h-5 w-5" />;
      case 'medium':
        return <Clock className="h-5 w-5" />;
      case 'low':
        return <CheckCircle className="h-5 w-5" />;
      default:
        return <AlertTriangle className="h-5 w-5" />;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'hard': return 'text-orange-600 bg-orange-100';
      case 'expert': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(0) + 'K';
    }
    return num.toString();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Common Car Issues</h1>
        <p className="text-lg text-gray-600">
          Discover known issues, symptoms, and solutions for various car models
        </p>
        <div className="mt-4 flex justify-center">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 max-w-2xl">
            <div className="flex items-center">
              <Shield className="h-5 w-5 text-blue-600 mr-2" />
              <p className="text-blue-800 text-sm">
                <strong>Admin-verified issues</strong> are professionally researched and include official recall information and manufacturer service bulletins.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-4">
          <div className="lg:col-span-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search issues, makes, or models..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
          </div>
          
          <div>
            <select
              value={selectedMake}
              onChange={(e) => setSelectedMake(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              {makes.map(make => (
                <option key={make} value={make}>
                  {make === 'all' ? 'All Makes' : make}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <select
              value={selectedSeverity}
              onChange={(e) => setSelectedSeverity(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              {severities.map(severity => (
                <option key={severity} value={severity}>
                  {severity === 'all' ? 'All Severities' : severity.charAt(0).toUpperCase() + severity.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center">
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={showAdminOnly}
                onChange={(e) => setShowAdminOnly(e.target.checked)}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded mr-2"
              />
              <span className="text-sm text-gray-700 flex items-center">
                <Shield className="h-4 w-4 mr-1 text-blue-600" />
                Admin Verified Only
              </span>
            </label>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-gray-200">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">
              {issues.filter(i => i.isAdminVerified).length}
            </div>
            <div className="text-sm text-gray-600">Admin Verified</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">
              {issues.filter(i => i.severity === 'critical').length}
            </div>
            <div className="text-sm text-gray-600">Critical Issues</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">
              {issues.filter(i => i.recallInfo?.hasRecall).length}
            </div>
            <div className="text-sm text-gray-600">Active Recalls</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">
              {formatNumber(issues.reduce((sum, i) => sum + (i.affectedVehicles || 0), 0))}
            </div>
            <div className="text-sm text-gray-600">Vehicles Affected</div>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="mb-6">
        <p className="text-gray-600">
          Showing {filteredIssues.length} of {issues.length} known issues
          {showAdminOnly && <span className="text-blue-600 font-medium"> (Admin verified only)</span>}
        </p>
      </div>

      {/* Issues List */}
      <div className="space-y-6">
        {filteredIssues.map((issue) => (
          <div key={issue.id} className={`bg-white rounded-lg shadow-md overflow-hidden ${issue.isAdminVerified ? 'ring-2 ring-blue-200' : ''}`}>
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getSeverityColor(issue.severity)}`}>
                      {getSeverityIcon(issue.severity)}
                      <span className="ml-1 capitalize">{issue.severity}</span>
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(issue.difficulty)}`}>
                      {issue.difficulty.charAt(0).toUpperCase() + issue.difficulty.slice(1) } repair
                    </span>
                    {issue.isAdminVerified && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
                        <Shield className="h-3 w-3 mr-1" />
                        Admin Verified
                      </span>
                    )}
                    {issue.recallInfo?.hasRecall && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 border border-red-200">
                        <AlertTriangle className="h-3 w-3 mr-1" />
                        Active Recall
                      </span>
                    )}
                  </div>
                  
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{issue.title}</h3>
                  <p className="text-gray-600 mb-3">{issue.description}</p>
                  
                  <div className="flex items-center text-sm text-gray-600 mb-4">
                    <span className="font-medium">{issue.make} {issue.model}</span>
                    <span className="mx-2">•</span>
                    <span>{issue.yearRange}</span>                   
                    {issue.affectedVehicles && (
                      <>
                      </>
                    )}
                  </div>

                  {/* Admin Notes */}
                  {issue.isAdminVerified && issue.adminNotes && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                      <div className="flex items-start">
                        <Shield className="h-4 w-4 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                        <div>
                          <h5 className="font-medium text-blue-800 mb-1">Expert Analysis</h5>
                          <p className="text-blue-700 text-sm">{issue.adminNotes}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Recall Information */}
                  {issue.recallInfo?.hasRecall && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                      <div className="flex items-start">
                        <AlertTriangle className="h-4 w-4 text-red-600 mr-2 mt-0.5 flex-shrink-0" />
                        <div>
                          <h5 className="font-medium text-red-800 mb-1">
                            Active Recall: {issue.recallInfo.recallNumber}
                          </h5>
                          <p className="text-red-700 text-sm">{issue.recallInfo.description}</p>
                          <p className="text-red-600 text-xs mt-1 font-medium">
                            Contact your dealer immediately for free repair
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="text-right">
                  <div className="flex items-center text-lg font-semibold text-gray-900 mb-1">
                    
                    {issue.estimatedCost}
                  </div>
                  <p className="text-sm text-gray-500">Estimated cost</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                    <AlertTriangle className="h-4 w-4 mr-1" />
                    Symptoms
                  </h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {issue.symptoms.slice(0, 3).map((symptom, index) => (
                      <li key={index} className="flex items-start">
                        <span className="w-1.5 h-1.5 bg-red-400 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                        {symptom}
                      </li>
                    ))}
                    {issue.symptoms.length > 3 && (
                      <li className="text-primary-600 text-xs">+{issue.symptoms.length - 3} more</li>
                    )}
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                    <Search className="h-4 w-4 mr-1" />
                    Causes
                  </h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {issue.causes.slice(0, 3).map((cause, index) => (
                      <li key={index} className="flex items-start">
                        <span className="w-1.5 h-1.5 bg-yellow-400 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                        {cause}
                      </li>
                    ))}
                    {issue.causes.length > 3 && (
                      <li className="text-primary-600 text-xs">+{issue.causes.length - 3} more</li>
                    )}
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                    <Wrench className="h-4 w-4 mr-1" />
                    Solutions
                  </h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {issue.solutions.slice(0, 3).map((solution, index) => (
                      <li key={index} className="flex items-start">
                        <span className="w-1.5 h-1.5 bg-green-400 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                        {solution}
                      </li>
                    ))}
                    {issue.solutions.length > 3 && (
                      <li className="text-primary-600 text-xs">+{issue.solutions.length - 3} more</li>
                    )}
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Prevention
                  </h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {issue.preventionTips.slice(0, 3).map((tip, index) => (
                      <li key={index} className="flex items-start">
                        <span className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                        {tip}
                      </li>
                    ))}
                    {issue.preventionTips.length > 3 && (
                      <li className="text-primary-600 text-xs">+{issue.preventionTips.length - 3} more</li>
                    )}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredIssues.length === 0 && (
        <div className="text-center py-16">
          <AlertTriangle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No issues found</h3>
          <p className="text-gray-600">Try adjusting your search criteria or filters.</p>
        </div>
      )}
    </div>
  );
};

export default CommonIssues;