import React, { useState, useEffect, useMemo } from 'react';
import {
  Car,
  Fuel,
  Wrench,
  Calendar,
  Sparkles,
  Bot,
  Plus,
  Trash2,
  Edit3,
  Search,
  CheckCircle2,
  Clock,
  Gauge,
  DollarSign,
  AlertCircle,
  FileText,
  Download,
  Upload,
  ChevronRight,
  ShieldCheck,
  Droplet,
  Settings2,
  Menu,
  X,
  ExternalLink,
  Info,
  RefreshCw,
  Send,
  Zap,
  Printer,
  Sliders,
  Check,
  Disc
} from 'lucide-react';

// --- TYPES & INTERFACES ---

export interface VehicleProfile {
  id: string;
  model: string;
  brand: string;
  year: string;
  plate: string;
  currentMileage: number;
  acquisitionDate: string;
  version: string;
  color: string;
  chassis: string;
  fuelType: 'Flex' | 'Gasolina' | 'Etanol' | 'Diesel' | 'Híbrido' | 'Elétrico';
  tankCapacity: number;
}

export interface FuelLog {
  id: string;
  date: string;
  gasStation: string;
  fuelType: 'Gasolina Comum' | 'Gasolina Aditivada' | 'Etanol' | 'Diesel S10' | 'GNV';
  totalPrice: number;
  liters: number;
  pricePerLiter: number;
  mileage: number;
  projectedRange?: number;
  isFullTank: boolean;
  notes?: string;
}

export interface MaintenanceLog {
  id: string;
  date: string;
  mileage: number;
  workshop: string;
  category: 'Preventiva' | 'Corretiva' | 'Troca de Óleo e Filtros' | 'Freios e Pneus' | 'Suspensão' | 'Elétrica e Bateria' | 'Ar Condicionado' | 'Outros';
  services: string;
  partsReplaced: string;
  partsCost: number;
  laborCost: number;
  totalCost: number;
  invoiceNumber?: string;
  warrantyPeriod?: string;
  notes?: string;
}

export interface ScheduledService {
  id: string;
  title: string;
  targetMileage?: number;
  targetDate?: string;
  category: string;
  estimatedCost?: number;
  priority: 'Alta' | 'Média' | 'Normal';
  isCompleted: boolean;
  notes?: string;
}

export interface VehicleModification {
  id: string;
  date: string;
  category: 'Performance' | 'Estética & Visual' | 'Som & Multimídia' | 'Conforto & Interior' | 'Iluminação' | 'Suspensão & Rodas';
  title: string;
  brand: string;
  cost: number;
  workshop: string;
  warrantyTerms: string;
  description: string;
}

export interface ReminderItem {
  id: string;
  title: string;
  dueDate: string;
  category: 'Licenciamento' | 'IPVA' | 'Seguro' | 'Vistoria' | 'Manutenção' | 'Outro';
  amount?: number;
  isPaid: boolean;
  notes?: string;
}

export interface VehicleSpecData {
  plateOrChassis: string;
  brand: string;
  model: string;
  yearModel: string;
  engine: string;
  power: string;
  torque: string;
  transmission: string;
  fuel: string;
  tankCapacity: number;
  recommendedOil: {
    viscosity: string;
    spec: string;
    capacityWithFilter: string;
    changeInterval: string;
  };
  coolant: {
    type: string;
    ratio: string;
    interval: string;
  };
  brakeFluid: {
    type: string;
    interval: string;
  };
  tirePressure: {
    frontPsi: number;
    rearPsi: number;
    loadedFrontPsi: number;
    loadedRearPsi: number;
    tireSize: string;
  };
  oemParts: Array<{
    category: string;
    name: string;
    code: string;
    brand: string;
    recommendedChange: string;
  }>;
  preventiveTips: string[];
}

// --- INITIAL MOCK DATA ---

const DEFAULT_VEHICLE: VehicleProfile = {
  id: 'veh_01',
  brand: 'Honda',
  model: 'Civic Touring 1.5 Turbo',
  year: '2021/2021',
  plate: 'BRA-2E19',
  currentMileage: 46250,
  acquisitionDate: '2022-04-18',
  version: '1.5 VTEC Turbo 16V Gasolina CVT',
  color: 'Preto Cristal Perolizado',
  chassis: '93HFC1640NZ184920',
  fuelType: 'Gasolina',
  tankCapacity: 56,
};

const DEFAULT_REMINDERS: ReminderItem[] = [
  {
    id: 'rem_1',
    title: 'Licenciamento Anual (Final 9)',
    dueDate: '2026-11-30',
    category: 'Licenciamento',
    amount: 160.22,
    isPaid: false,
    notes: 'Realizar emissão do CRLV-e pelo Detran',
  },
  {
    id: 'rem_2',
    title: 'Renovação Seguro Porto Seguro Auto',
    dueDate: '2026-12-15',
    category: 'Seguro',
    amount: 3450.0,
    isPaid: false,
    notes: 'Apólice #82910-A. Contato corretora: (11) 98765-4321',
  },
  {
    id: 'rem_3',
    title: 'IPVA 2027 (Cota Única / 1ª Parcela)',
    dueDate: '2027-01-18',
    category: 'IPVA',
    amount: 3890.0,
    isPaid: false,
    notes: 'Desconto de 3% para pagamento em cota única',
  },
  {
    id: 'rem_4',
    title: 'Alinhamento & Balanceamento 3D',
    dueDate: '2026-11-25',
    category: 'Manutenção',
    amount: 180.0,
    isPaid: false,
    notes: 'Recomendado a cada 10.000 km ou 6 meses',
  },
];

const DEFAULT_FUELS: FuelLog[] = [
  {
    id: 'fuel_1',
    date: '2026-10-28',
    gasStation: 'Posto Shell V-Power',
    fuelType: 'Gasolina Aditivada',
    totalPrice: 285.5,
    liters: 47.74,
    pricePerLiter: 5.98,
    mileage: 45710,
    projectedRange: 610,
    isFullTank: true,
    notes: 'Abastecimento na volta da viagem pela Rodovia dos Bandeirantes.',
  },
  {
    id: 'fuel_2',
    date: '2026-11-08',
    gasStation: 'Posto Ipiranga Rota',
    fuelType: 'Gasolina Aditivada',
    totalPrice: 294.2,
    liters: 49.12,
    pricePerLiter: 5.99,
    mileage: 46250,
    projectedRange: 625,
    isFullTank: true,
    notes: 'Tanque cheio. Uso urbano e rodoviário.',
  },
];

const DEFAULT_MAINTENANCES: MaintenanceLog[] = [
  {
    id: 'maint_1',
    date: '2026-06-12',
    mileage: 40150,
    workshop: 'Concessionária Honda Daitan',
    category: 'Troca de Óleo e Filtros',
    services: 'Revisão dos 40.000 km. Troca de óleo 0W-20 sintético, substituição do filtro de óleo, filtro de ar do motor e filtro de cabine com higienização do ar-condicionado.',
    partsReplaced: 'Óleo Honda 0W-20 Pro Honda (3.5L), Filtro Óleo 15400-RTA-003, Filtro Ar Motor 17220-5AA-A00, Filtro Cabine AC.',
    partsCost: 395.0,
    laborCost: 280.0,
    totalCost: 675.0,
    invoiceNumber: 'NF-e 0048192',
    warrantyPeriod: '12 meses ou 10.000 km nas peças genuínas Honda',
    notes: 'Check-up de 27 itens sem apontamentos. Bateria e pastilhas aprovadas.',
  },
  {
    id: 'maint_2',
    date: '2026-09-04',
    mileage: 43800,
    workshop: 'Centro Automotivo Bosch Car Service',
    category: 'Freios e Pneus',
    services: 'Substituição das pastilhas de freio dianteiras de cerâmica e sangria com fluido de freio DOT 4 LV.',
    partsReplaced: 'Jogo de pastilhas dianteiras Brembo P28077N, Fluido de Freio Bosch DOT 4 LV (1L).',
    partsCost: 460.0,
    laborCost: 190.0,
    totalCost: 650.0,
    invoiceNumber: 'NF-e 019283',
    warrantyPeriod: '6 meses ou 10.000 km',
    notes: 'Discos dianteiros retificados dentro da espessura limite de tolerância.',
  },
];

const DEFAULT_SCHEDULED: ScheduledService[] = [
  {
    id: 'sched_1',
    title: 'Revisão dos 50.000 km / 5 Anos',
    targetMileage: 50000,
    targetDate: '2027-03-15',
    category: 'Preventiva',
    estimatedCost: 890.0,
    priority: 'Alta',
    isCompleted: false,
    notes: 'Troca de óleo do motor, filtro de combustível e inspeção da correia e velas.',
  },
  {
    id: 'sched_2',
    title: 'Troca do Fluido da Transmissão CVT',
    targetMileage: 50000,
    targetDate: '2027-04-10',
    category: 'Câmbio',
    estimatedCost: 750.0,
    priority: 'Média',
    isCompleted: false,
    notes: 'Fluido genuíno Honda HCF-2 para câmbio CVT.',
  },
  {
    id: 'sched_3',
    title: 'Rodízio de Pneus e Geometria 3D',
    targetMileage: 48000,
    targetDate: '2026-12-10',
    category: 'Freios e Pneus',
    estimatedCost: 160.0,
    priority: 'Normal',
    isCompleted: false,
    notes: 'Avaliar desgaste da banda de rodagem dos pneus Michelin Primacy 4.',
  },
];

const DEFAULT_MODIFICATIONS: VehicleModification[] = [
  {
    id: 'mod_1',
    date: '2025-05-20',
    category: 'Conforto & Interior',
    title: 'Película Solar Nanocerâmica Alta Performance',
    brand: '3M Crystalline',
    cost: 1450.0,
    workshop: 'Insulfilm Premium Studio',
    warrantyTerms: '10 anos de garantia de fábrica contra bolhas e desbotamento térmico',
    description: 'Instalação em todos os vidros e para-brisa frontal transparente (70% de visibilidade e 97% de rejeição de raios infravermelhos).',
  },
  {
    id: 'mod_2',
    date: '2025-11-14',
    category: 'Performance',
    title: 'Filtro de Ar Inbox de Alto Fluxo Lavável',
    brand: 'K&N Engineering',
    cost: 490.0,
    workshop: 'Instalação Própria / Garagem',
    warrantyTerms: 'Garantia limitada de 1 milhão de milhas pelo fabricante',
    description: 'Filtro de ar esportivo em algodão cirúrgico encaixado diretamente na caixa de ar original sem alterações estruturais.',
  },
];

// --- INTERNAL AUTOMOTIVE INTELLIGENCE DATABASE ---

export interface TechnicalVehicleEntry {
  keys: string[];
  brand: string;
  model: string;
  defaultYearModel: string;
  engine: string;
  power: string;
  torque: string;
  transmission: string;
  fuel: string;
  tankCapacity: number;
  recommendedOil: {
    viscosity: string;
    spec: string;
    capacityWithFilter: string;
    changeInterval: string;
  };
  coolant: {
    type: string;
    ratio: string;
    interval: string;
  };
  brakeFluid: {
    type: string;
    interval: string;
  };
  tirePressure: {
    frontPsi: number;
    rearPsi: number;
    loadedFrontPsi: number;
    loadedRearPsi: number;
    tireSize: string;
  };
  oemParts: Array<{
    category: string;
    name: string;
    code: string;
    brand: string;
    recommendedChange: string;
  }>;
  preventiveTips: string[];
}

export const POPULAR_VEHICLES_DATABASE: TechnicalVehicleEntry[] = [
  {
    keys: ['onix', 'onix plus', 'tracker', 'montana'],
    brand: 'Chevrolet',
    model: 'Onix 1.0 Turbo Flex',
    defaultYearModel: '2022/2023',
    engine: '1.0L 12V 3 Cilindros Ecotec Turbo Flex Injeção Direta',
    power: '116 cv (Etanol / Gasolina) @ 5.500 rpm',
    torque: '16,8 kgfm (Etanol) / 16,3 kgfm (Gasolina) @ 2.000 rpm',
    transmission: 'Automático de 6 velocidades com modo sequencial Active Select',
    fuel: 'Flex (Etanol / Gasolina)',
    tankCapacity: 44,
    recommendedOil: {
      viscosity: '0W-20 ou 5W-30 100% Sintético Homologação dexos1 Gen 3',
      spec: 'ACDelco dexos1 Gen 3 (obrigatório para correia banhada a óleo)',
      capacityWithFilter: '3,5 Litros',
      changeInterval: 'A cada 10.000 km ou 12 meses (5.000 km em uso severo)',
    },
    coolant: {
      type: 'Aditivo Orgânico ACDelco Dex-Cool Laranja Long Life',
      ratio: '50% aditivo concentrado / 50% água desmineralizada',
      interval: 'A cada 5 anos ou 150.000 km',
    },
    brakeFluid: {
      type: 'DOT 4 ACDelco / GM Genuine',
      interval: 'A cada 2 anos ou 40.000 km',
    },
    tirePressure: {
      frontPsi: 32,
      rearPsi: 32,
      loadedFrontPsi: 35,
      loadedRearPsi: 35,
      tireSize: '185/65 R15 ou 195/55 R16',
    },
    oemParts: [
      { category: 'Óleo & Filtro', name: 'Filtro de Óleo do Motor', code: 'GM 12693541', brand: 'ACDelco Original', recommendedChange: '10.000 km' },
      { category: 'Admissão', name: 'Filtro de Ar do Motor', code: 'GM 52147321', brand: 'GM / ACDelco', recommendedChange: '20.000 km' },
      { category: 'Climatização', name: 'Filtro de Cabine Anti-pólen', code: 'GM 13508023', brand: 'ACDelco Carvão', recommendedChange: '10.000 km' },
      { category: 'Combustível', name: 'Filtro de Combustível Externo', code: 'GM 25313814', brand: 'ACDelco', recommendedChange: '10.000 km' },
      { category: 'Freios', name: 'Jogo de Pastilhas de Freio Dianteiras', code: 'GM 13502886', brand: 'Cobreq / Fras-le', recommendedChange: '30.000 km' },
      { category: 'Ignição', name: 'Velas de Ignição Iridium', code: 'GM 12688094 (NGK ILKAR7G7)', brand: 'NGK Laser Iridium', recommendedChange: '60.000 km' },
      { category: 'Distribuição', name: 'Correia Dentada Banhada a Óleo', code: 'GM 55490408', brand: 'Gates / GM Original', recommendedChange: '240.000 km ou 15 anos (conforme manual GM)' },
    ],
    preventiveTips: [
      'Atenção estrita ao óleo: utilize exclusivamente especificação dexos1 Gen 3 para preservar a integridade da correia dentada banhada a óleo.',
      'Nunca aplique aditivos desengraxantes, flushs químicos ou "milagres" no cárter do motor.',
      'O sistema de partida a frio dispensa reservatório auxiliar; recomenda-se abastecer periodicamente com gasolina aditivada para limpeza dos bicos injetores de alta pressão.',
      'Faça a drenagem completa e substituição do filtro de combustível a cada 10.000 km.',
    ],
  },
  {
    keys: ['corolla', 'corolla cross', 'yaris', 'etios'],
    brand: 'Toyota',
    model: 'Corolla 2.0 Dynamic Force Flex',
    defaultYearModel: '2022/2023',
    engine: '2.0L 16V Dual VVT-iE Flex com Injeção Direta e Indireta (D-4S)',
    power: '177 cv (Etanol) / 169 cv (Gasolina) @ 6.600 rpm',
    torque: '21,4 kgfm @ 4.400 rpm',
    transmission: 'Direct Shift CVT com primeira marcha por engrenagem física e 10 marchas virtuais',
    fuel: 'Flex (Etanol / Gasolina)',
    tankCapacity: 47,
    recommendedOil: {
      viscosity: '0W-16 ou 0W-20 100% Sintético Homologação API SP / ILSAC GF-6B',
      spec: 'Toyota Genuine Motor Oil (TGMO) 0W-16 SP',
      capacityWithFilter: '4,2 Litros',
      changeInterval: 'A cada 10.000 km ou 12 meses',
    },
    coolant: {
      type: 'Toyota Super Long Life Coolant (Rosa Pré-misturado)',
      ratio: '50% concentrado / 50% água desmineralizada de fábrica',
      interval: 'Primeira troca aos 160.000 km, depois a cada 80.000 km',
    },
    brakeFluid: {
      type: 'DOT 4 Toyota Genuine / Baixa Viscosidade',
      interval: 'A cada 2 anos ou 40.000 km',
    },
    tirePressure: {
      frontPsi: 32,
      rearPsi: 32,
      loadedFrontPsi: 35,
      loadedRearPsi: 35,
      tireSize: '215/50 R17 ou 225/45 R17',
    },
    oemParts: [
      { category: 'Óleo & Filtro', name: 'Filtro de Óleo do Motor Blindado', code: '90915-10009', brand: 'Toyota Denso', recommendedChange: '10.000 km' },
      { category: 'Admissão', name: 'Filtro de Ar do Motor', code: '17801-77050', brand: 'Toyota Denso', recommendedChange: '20.000 km' },
      { category: 'Climatização', name: 'Filtro de Cabine Ar-Condicionado', code: '87139-0E040', brand: 'Toyota Carvão Ativo', recommendedChange: '10.000 km' },
      { category: 'Freios', name: 'Jogo de Pastilhas de Freio Dianteiras', code: '04465-02420', brand: 'Akebono / Toyota', recommendedChange: '35.000 - 45.000 km' },
      { category: 'Ignição', name: 'Velas de Ignição Iridium Long Life', code: 'FC20HR8 (Denso)', brand: 'Denso Iridium', recommendedChange: '100.000 km' },
      { category: 'Distribuição', name: 'Corrente de Comando Sincronizadora', code: '13506-F0010', brand: 'Toyota Original (Livre de troca periódica)', recommendedChange: 'Inspeção aos 150.000 km' },
    ],
    preventiveTips: [
      'O motor Dynamic Force possui duplo sistema de injeção D-4S (direta e indireta) que realiza autolimpeza das válvulas de admissão contra carbonização.',
      'O óleo de ultrabaixa viscosidade 0W-16 reduz atrito interno e otimiza em até 3,5% a economia de combustível.',
      'O câmbio Direct Shift CVT tem engrenagem real na 1ª marcha para arrancadas com menor aquecimento das polias cônicas.',
      'Inspecione a suspensão traseira independente (multibraço) e faça alinhamento a cada 10.000 km.',
    ],
  },
  {
    keys: ['civic', 'city', 'hr-v', 'hrv', 'cr-v', 'fit'],
    brand: 'Honda',
    model: 'Civic 1.5 Turbo Touring / 2.0 i-VTEC',
    defaultYearModel: '2021/2022',
    engine: '1.5L 16V DOHC VTEC Turbo Gasolina com Injeção Direta (ou 2.0 Flex)',
    power: '173 cv @ 5.500 rpm (1.5 Turbo) / 155 cv @ 6.300 rpm (2.0)',
    torque: '22,4 kgfm @ 1.700 - 5.500 rpm',
    transmission: 'Automático CVT com paddle shifts e 7 marchas simuladas',
    fuel: 'Gasolina (1.5 Turbo) / Flex (2.0 i-VTEC)',
    tankCapacity: 56,
    recommendedOil: {
      viscosity: '0W-20 100% Sintético Homologação API SP / ILSAC GF-6',
      spec: 'Pro Honda Genuine Motor Oil 0W-20',
      capacityWithFilter: '3,5 Litros',
      changeInterval: 'A cada 10.000 km ou 12 meses (5.000 km severo)',
    },
    coolant: {
      type: 'Aditivo Orgânico Long Life Tipo 2 Azul Honda (Pronto para Uso)',
      ratio: '50% aditivo / 50% água desmineralizada de fábrica',
      interval: 'Primeira troca aos 10 anos ou 200.000 km, depois a cada 5 anos',
    },
    brakeFluid: {
      type: 'DOT 4 LV (Baixa Viscosidade para ABS/ESP/VSA)',
      interval: 'A cada 3 anos ou 30.000 km',
    },
    tirePressure: {
      frontPsi: 32,
      rearPsi: 32,
      loadedFrontPsi: 34,
      loadedRearPsi: 34,
      tireSize: '215/50 R17 91V',
    },
    oemParts: [
      { category: 'Óleo & Filtro', name: 'Filtro de Óleo do Motor', code: '15400-RTA-003', brand: 'Honda OEM / Mahle', recommendedChange: '10.000 km' },
      { category: 'Admissão', name: 'Filtro de Ar do Motor', code: '17220-5AA-A00', brand: 'Honda OEM / Mann-Filter', recommendedChange: '20.000 km' },
      { category: 'Climatização', name: 'Filtro de Cabine Ar-Condicionado', code: '80292-TF0-G01', brand: 'Honda Carbono Ativo', recommendedChange: '10.000 km' },
      { category: 'Combustível', name: 'Filtro de Combustível Principal', code: '17048-TBA-A00', brand: 'Honda OEM', recommendedChange: '40.000 km' },
      { category: 'Freios', name: 'Jogo de Pastilhas de Freio Dianteiras', code: '45022-TBA-A01', brand: 'Nissin / Brembo', recommendedChange: '30.000 - 40.000 km' },
      { category: 'Ignição', name: 'Velas de Ignição Iridium Laser', code: '12290-59B-003 (NGK ILZKAR8H8S)', brand: 'NGK Japan', recommendedChange: '60.000 km' },
    ],
    preventiveTips: [
      'Nos motores VTEC Turbo com injeção direta, utilize gasolina de alta procedência ou aditivada para evitar depósitos nas válvulas.',
      'Aguarde cerca de 30 segundos em marcha lenta antes de desligar o veículo após condução em rodovia para resfriar a turbina.',
      'O fluido da transmissão CVT Honda HCF-2 deve ser substituído impreterivelmente a cada 40.000 km em uso urbano.',
      'Inspecione a folga de válvulas a cada 40.000 km em versões que rodam exclusivamente com etanol.',
    ],
  },
  {
    keys: ['hb20', 'hb20s', 'creta', 'tucson', 'i30'],
    brand: 'Hyundai',
    model: 'HB20 1.0 TGDI Turbo Flex',
    defaultYearModel: '2023/2023',
    engine: '1.0L 12V 3 Cilindros Kappa TGDI Turbo Flex com Injeção Direta',
    power: '120 cv (Etanol / Gasolina) @ 6.000 rpm',
    torque: '17,5 kgfm @ 1.500 - 3.500 rpm',
    transmission: 'Automático de 6 marchas com conversor de torque',
    fuel: 'Flex (Etanol / Gasolina)',
    tankCapacity: 50,
    recommendedOil: {
      viscosity: '0W-20 ou 5W-30 100% Sintético API SP / ILSAC GF-6',
      spec: 'Shell Helix Ultra Professional / Total Quartz 9000 NFC',
      capacityWithFilter: '3,3 Litros',
      changeInterval: 'A cada 10.000 km ou 12 meses',
    },
    coolant: {
      type: 'Aditivo Orgânico Long Life Verde/Azul Hyundai Genuine',
      ratio: '50% concentrado / 50% água desmineralizada',
      interval: 'A cada 5 anos ou 100.000 km',
    },
    brakeFluid: {
      type: 'DOT 4 Hyundai Genuine',
      interval: 'A cada 2 anos ou 40.000 km',
    },
    tirePressure: {
      frontPsi: 32,
      rearPsi: 30,
      loadedFrontPsi: 35,
      loadedRearPsi: 35,
      tireSize: '185/65 R15 ou 195/55 R16',
    },
    oemParts: [
      { category: 'Óleo & Filtro', name: 'Filtro de Óleo do Motor', code: '26300-02503', brand: 'Hyundai Mobis Original', recommendedChange: '10.000 km' },
      { category: 'Admissão', name: 'Filtro de Ar do Motor', code: '28113-1Y100', brand: 'Hyundai Mobis', recommendedChange: '20.000 km' },
      { category: 'Climatização', name: 'Filtro de Cabine Anti-pólen', code: '97133-0C000', brand: 'Hyundai Mobis', recommendedChange: '10.000 km' },
      { category: 'Combustível', name: 'Filtro de Combustível Externo', code: '31980-1S000', brand: 'Mahle / Mobis', recommendedChange: '10.000 km' },
      { category: 'Freios', name: 'Jogo de Pastilhas Dianteiras', code: '58101-1YA00', brand: 'Mando / Fras-le', recommendedChange: '30.000 km' },
      { category: 'Ignição', name: 'Velas de Ignição Iridium', code: '18846-08070 (NGK SILZKR7B11)', brand: 'NGK Iridium', recommendedChange: '40.000 km' },
      { category: 'Distribuição', name: 'Corrente de Comando', code: '24321-04000', brand: 'Hyundai Original (Sem troca periódica)', recommendedChange: 'Inspeção aos 120.000 km' },
    ],
    preventiveTips: [
      'O motor Kappa possui acionamento por corrente de comando, dispensando troca preventiva de correia dentada.',
      'Substitua o filtro de combustível externo a cada 10.000 km para proteger os injetores de alta pressão do sistema TGDI.',
      'Se rodar muito no etanol, verifique o nível de óleo semanalmente para checar eventual diluição por combustível a frio.',
      'Faça o rodízio dos pneus a cada 10.000 km para desgaste uniforme.',
    ],
  },
  {
    keys: ['virtus', 'nivus', 'polo', 't-cross', 'tcross', 'taos', 'golf', 'jetta'],
    brand: 'Volkswagen',
    model: 'Virtus / Nivus / Polo 200 TSI 1.0 Flex',
    defaultYearModel: '2023/2024',
    engine: '1.0L 12V 3 Cilindros TSI Total Flex Turbo com Injeção Direta',
    power: '128 cv (Etanol) / 116 cv (Gasolina) @ 5.500 rpm',
    torque: '20,4 kgfm @ 2.000 - 3.500 rpm',
    transmission: 'Automático Tiptronic de 6 velocidades (AQ160)',
    fuel: 'Flex (Etanol / Gasolina)',
    tankCapacity: 52,
    recommendedOil: {
      viscosity: '0W-20 ou 5W-40 100% Sintético Norma VW 508.88 / 509.99',
      spec: 'Maxi Performance VW 508.88 100% Sintético Original',
      capacityWithFilter: '4,0 Litros',
      changeInterval: 'A cada 10.000 km ou 12 meses',
    },
    coolant: {
      type: 'Aditivo Orgânico G12 evo / G13 Rosa',
      ratio: '40% a 50% de aditivo diluído em água desmineralizada',
      interval: 'Long Life (inspeção de nível a cada revisão)',
    },
    brakeFluid: {
      type: 'DOT 4 Original VW / Pentosin',
      interval: 'Primeira troca aos 3 anos, depois a cada 2 anos',
    },
    tirePressure: {
      frontPsi: 33,
      rearPsi: 30,
      loadedFrontPsi: 35,
      loadedRearPsi: 34,
      tireSize: '205/60 R16 ou 205/50 R17',
    },
    oemParts: [
      { category: 'Óleo & Filtro', name: 'Filtro de Óleo do Motor Blindado', code: '04E-115-561-H', brand: 'Volkswagen / Mann', recommendedChange: '10.000 km' },
      { category: 'Admissão', name: 'Filtro de Ar do Motor', code: '04C-129-620-A', brand: 'Volkswagen OEM', recommendedChange: '20.000 km' },
      { category: 'Climatização', name: 'Filtro de Cabine Anti-pólen', code: '2Q0-819-653', brand: 'Valeo / VW', recommendedChange: '10.000 km' },
      { category: 'Freios', name: 'Jogo de Pastilhas de Freio Dianteiras', code: '2Q0-698-151', brand: 'Bosch / VW', recommendedChange: '30.000 - 40.000 km' },
      { category: 'Ignição', name: 'Velas de Ignição Iridium', code: '04E-905-601-B', brand: 'Bosch / VW', recommendedChange: '40.000 km' },
      { category: 'Distribuição', name: 'Correia Dentada com Revestimento em PTFE', code: '04E-109-119-F', brand: 'Continental / VW', recommendedChange: '120.000 km ou 4 anos' },
    ],
    preventiveTips: [
      'Respeite estritamente a norma VW 508.88 para garantir a durabilidade dos tuchos hidráulicos e comandos de válvulas.',
      'A correia dentada dos motores EA211 TSI possui longa vida útil, devendo ser inspecionada aos 80.000 km e trocada aos 120.000 km.',
      'Em caso de uso exclusivo com Etanol, realize abastecimento com gasolina aditivada a cada 4 tanques para limpeza do sistema de partida a frio.',
      'Monitore a pressão dos pneus a cada 15 dias: pneus calibrados protegem as rodas aro 17 contra impactos em buracos.',
    ],
  },
  {
    keys: ['compass', 'renegade', 'toro', 'commander'],
    brand: 'Jeep',
    model: 'Compass / Renegade 1.3 Turbo Flex T270',
    defaultYearModel: '2022/2023',
    engine: '1.3L 16V Turbo GSE T270 Flex com Sistema MultiAir III',
    power: '185 cv (Etanol) / 180 cv (Gasolina) @ 5.750 rpm',
    torque: '27,5 kgfm @ 1.750 rpm',
    transmission: 'Automático Aisin de 6 marchas (4x2) ou 9 marchas ZF (4x4)',
    fuel: 'Flex (Etanol / Gasolina)',
    tankCapacity: 60,
    recommendedOil: {
      viscosity: '0W-20 ou 5W-30 100% Sintético ACEA C2 / C3',
      spec: 'Mopar Selenia K Pure Energy 0W-20 Fiat 9.55535-GS1',
      capacityWithFilter: '4,8 Litros',
      changeInterval: 'A cada 10.000 km ou 12 meses',
    },
    coolant: {
      type: 'Aditivo Orgânico Long Life Vermelho Mopar Paraflu UP',
      ratio: '50% aditivo concentrado / 50% água desmineralizada',
      interval: 'A cada 5 anos ou 100.000 km',
    },
    brakeFluid: {
      type: 'DOT 4 Plus / Baixa Viscosidade Mopar',
      interval: 'A cada 2 anos ou 20.000 km',
    },
    tirePressure: {
      frontPsi: 33,
      rearPsi: 31,
      loadedFrontPsi: 36,
      loadedRearPsi: 36,
      tireSize: '225/55 R18 ou 235/45 R19',
    },
    oemParts: [
      { category: 'Óleo & Filtro', name: 'Filtro de Óleo do Motor Blindado', code: 'Mopar 50055424', brand: 'Mopar / Wega', recommendedChange: '10.000 km' },
      { category: 'Admissão', name: 'Filtro de Ar do Motor', code: 'Mopar 51977755', brand: 'Mopar Original', recommendedChange: '20.000 km' },
      { category: 'Climatização', name: 'Filtro de Cabine Ar-Condicionado', code: 'Mopar 7088924', brand: 'MicronAir', recommendedChange: '10.000 km' },
      { category: 'Freios', name: 'Jogo de Pastilhas de Freio Dianteiras', code: 'Mopar 77367355', brand: 'Fras-le / Bosch', recommendedChange: '30.000 km' },
      { category: 'Ignição', name: 'Velas de Ignição Iridium Laser', code: 'Mopar 55278143', brand: 'NGK Iridium', recommendedChange: '60.000 km' },
      { category: 'Distribuição', name: 'Corrente de Comando Sincronizadora', code: 'Mopar 55283411', brand: 'Mopar (Sem troca periódica)', recommendedChange: 'Inspeção aos 150.000 km' },
    ],
    preventiveTips: [
      'No motor 1.3 T270, acompanhe periodicamente a vareta de óleo com o veículo em piso plano e motor frio.',
      'O sistema MultiAir III controla eletronicamente as válvulas de admissão e requer óleo com aditivação de alta estabilidade térmica.',
      'Troque o fluido de freio rigorosamente a cada 2 anos para evitar oxidação no atuador do freio de estacionamento elétrico.',
      'Faça alinhamento completo nas 4 rodas devido à suspensão traseira independente McPherson.',
    ],
  },
  {
    keys: ['strada', 'argo', 'cronos', 'mobi', 'pulse', 'fastback', 'uno'],
    brand: 'Fiat',
    model: 'Strada / Argo 1.3 Firefly Flex',
    defaultYearModel: '2023/2024',
    engine: '1.3L 8V 4 Cilindros Firefly Flex com Comando de Válvulas Variável (GSE)',
    power: '107 cv (Etanol) / 98 cv (Gasolina) @ 6.250 rpm',
    torque: '13,7 kgfm (Etanol) / 13,2 kgfm (Gasolina) @ 4.000 rpm',
    transmission: 'Manual de 5 marchas ou Automático CVT com 7 marchas simuladas',
    fuel: 'Flex (Etanol / Gasolina)',
    tankCapacity: 47,
    recommendedOil: {
      viscosity: '0W-20 ou 5W-30 100% Sintético Homologação Fiat 9.55535-GS1',
      spec: 'Selenia K Forward 0W-20 API SP',
      capacityWithFilter: '3,5 Litros',
      changeInterval: 'A cada 10.000 km ou 12 meses',
    },
    coolant: {
      type: 'Petronas Coolant Paraflu UP Orgânico Rosa',
      ratio: '50% concentrado / 50% água desmineralizada',
      interval: 'A cada 4 anos ou 80.000 km',
    },
    brakeFluid: {
      type: 'DOT 4 Tutela Top 4 / Petronas',
      interval: 'A cada 2 anos ou 40.000 km',
    },
    tirePressure: {
      frontPsi: 30,
      rearPsi: 30,
      loadedFrontPsi: 36,
      loadedRearPsi: 36,
      tireSize: '175/70 R14 ou 185/60 R15 ou 205/60 R16',
    },
    oemParts: [
      { category: 'Óleo & Filtro', name: 'Filtro de Óleo do Motor Blindado', code: 'Mopar 46796687', brand: 'Mopar / Mann', recommendedChange: '10.000 km' },
      { category: 'Admissão', name: 'Filtro de Ar do Motor', code: 'Mopar 51952441', brand: 'Mopar Original', recommendedChange: '20.000 km' },
      { category: 'Climatização', name: 'Filtro de Cabine Anti-pólen', code: 'Mopar 52063799', brand: 'Mopar Carvão', recommendedChange: '10.000 km' },
      { category: 'Combustível', name: 'Filtro de Combustível Externo', code: 'Mopar 51806073', brand: 'Fram / Mopar', recommendedChange: '10.000 km' },
      { category: 'Freios', name: 'Jogo de Pastilhas de Freio Dianteiras', code: 'Mopar 7088922', brand: 'Cobreq / Fras-le', recommendedChange: '30.000 km' },
      { category: 'Ignição', name: 'Velas de Ignição Green Plug', code: 'NGK ZKR7AI-8', brand: 'NGK Original', recommendedChange: '40.000 km' },
    ],
    preventiveTips: [
      'O motor Firefly utiliza corrente de comando silenciosa desenvolvida para durar toda a vida útil do motor.',
      'Em pickups Strada com transporte frequente de carga, calibre os pneus traseiros com 36 PSI para prevenir desgaste irregular.',
      'Inspecione a correia de acessórios (alternador e ar-condicionado) a cada 20.000 km.',
      'Substitua o filtro de combustível no prazo para evitar sobrecarga na bomba do tanque.',
    ],
  },
  {
    keys: ['kwid', 'sandero', 'stepway', 'logan', 'duster', 'oroch', 'kaptur', 'captur'],
    brand: 'Renault',
    model: 'Kwid / Sandero 1.0 12V SCe Flex',
    defaultYearModel: '2022/2023',
    engine: '1.0L 12V 3 Cilindros SCe Flex com Duplo Comando de Válvulas Variável',
    power: '71 cv (Etanol) / 68 cv (Gasolina) @ 5.500 rpm',
    torque: '10,0 kgfm (Etanol) / 9,4 kgfm (Gasolina) @ 4.250 rpm',
    transmission: 'Manual de 5 marchas (ou CVT no Duster/Sandero)',
    fuel: 'Flex (Etanol / Gasolina)',
    tankCapacity: 38,
    recommendedOil: {
      viscosity: '5W-30 ou 0W-20 100% Sintético Homologação Renault RN0700 / RN17',
      spec: 'Castrol GTX RN-SPEC / Elf Evolution 900 SXR 5W-30',
      capacityWithFilter: '3,0 Litros',
      changeInterval: 'A cada 10.000 km ou 12 meses',
    },
    coolant: {
      type: 'Glaceol RX Type D Amarelo / Verde Renault Original',
      ratio: '50% concentrado / 50% água desmineralizada',
      interval: 'A cada 4 anos ou 80.000 km',
    },
    brakeFluid: {
      type: 'DOT 4 Renault Genuine',
      interval: 'A cada 2 anos ou 40.000 km',
    },
    tirePressure: {
      frontPsi: 32,
      rearPsi: 32,
      loadedFrontPsi: 34,
      loadedRearPsi: 34,
      tireSize: '165/70 R14',
    },
    oemParts: [
      { category: 'Óleo & Filtro', name: 'Filtro de Óleo do Motor', code: 'Renault 152089599R', brand: 'Renault / Purflux', recommendedChange: '10.000 km' },
      { category: 'Admissão', name: 'Filtro de Ar do Motor', code: 'Renault 165467674R', brand: 'Renault OEM', recommendedChange: '20.000 km' },
      { category: 'Climatização', name: 'Filtro de Cabine Ar-Condicionado', code: 'Renault 272773016R', brand: 'Valeo / Renault', recommendedChange: '10.000 km' },
      { category: 'Freios', name: 'Jogo de Pastilhas Dianteiras', code: 'Renault 410605536R', brand: 'Fras-le / Renault', recommendedChange: '30.000 km' },
      { category: 'Ignição', name: 'Velas de Ignição Resistivas', code: 'Renault 224018760R (NGK LZKAR7A)', brand: 'NGK Original', recommendedChange: '40.000 km' },
    ],
    preventiveTips: [
      'No Kwid, mantenha a calibragem dos pneus aro 14 em 32 PSI para otimizar a estabilidade direcional.',
      'A corrente de comando do motor SCe requer óleo com norma RN0700 para manter a lubrificação ideal dos tensores hidráulicos.',
      'Realize rodízio e alinhamento a cada 10.000 km para prevenir desgaste prematuro dos pneus de baixa resistência à rolagem.',
    ],
  },
];

// Fallback generator for any car model not in the direct database
export function generateFallbackVehicleData(modelInput: string, yearEngineInput: string): VehicleSpecData {
  const cleanModel = modelInput.trim() || 'Veículo';
  const cleanYearEngine = yearEngineInput.trim() || 'Flex / Gasolina';
  const lower = `${cleanModel} ${cleanYearEngine}`.toLowerCase();

  const isTurbo = lower.includes('turbo') || lower.includes('tsi') || lower.includes('tgdi') || lower.includes('t270');
  const isDiesel = lower.includes('diesel') || lower.includes('td') || lower.includes('4x4');
  const isHybrid = lower.includes('híbrido') || lower.includes('hibrido') || lower.includes('hybrid');
  const isRecent = /\b(202[0-9]|201[8-9])\b/.test(lower);

  let viscosity = '5W-30 100% Sintético';
  let spec = 'API SP / ILSAC GF-6 (Alta Proteção contra Desgaste e LSPI)';
  let oilCapacity = '4,0 Litros';

  if (isDiesel) {
    viscosity = '5W-30 100% Sintético ACEA C2 / C3';
    spec = 'Homologação Low SAPS para proteção de filtro DPF';
    oilCapacity = '5,5 Litros';
  } else if (isTurbo || isRecent || isHybrid) {
    viscosity = '0W-20 ou 5W-30 100% Sintético';
    spec = 'API SP / ILSAC GF-6 (Prevenção de Pré-ignição em Baixas Rotações)';
    oilCapacity = '3,8 Litros';
  } else {
    viscosity = '5W-30 ou 5W-40 100% Sintético';
    spec = 'API SN / ACEA A3/B4';
    oilCapacity = '4,0 Litros';
  }

  return {
    plateOrChassis: 'CONSULTA TÉCNICA',
    brand: cleanModel.split(' ')[0] || 'Veículo',
    model: cleanModel,
    yearModel: cleanYearEngine,
    engine: cleanYearEngine,
    power: isTurbo ? '125 a 170 cv (Estimado para motores turbo modernos)' : '85 a 120 cv (Estimado para motores aspirados)',
    torque: isTurbo ? '20,0 a 25,0 kgfm @ 1.800 rpm' : '12,0 a 16,0 kgfm @ 3.800 rpm',
    transmission: lower.includes('autom') || lower.includes('cvt') ? 'Transmissão Automática' : 'Transmissão Manual ou Automática',
    fuel: isDiesel ? 'Diesel S10' : isHybrid ? 'Híbrido (Gasolina / Elétrico)' : 'Flex (Etanol / Gasolina)',
    tankCapacity: isDiesel ? 65 : 50,
    recommendedOil: {
      viscosity,
      spec,
      capacityWithFilter: oilCapacity,
      changeInterval: 'A cada 10.000 km ou 12 meses (5.000 km em trânsito urbano severo)',
    },
    coolant: {
      type: 'Aditivo Orgânico Long Life OAT Concentrado',
      ratio: '50% aditivo orgânico / 50% água desmineralizada',
      interval: 'A cada 4 a 5 anos ou 80.000 km',
    },
    brakeFluid: {
      type: 'DOT 4 Sintético com Ponto de Ebulição Úmido > 165°C',
      interval: 'A cada 2 anos ou 40.000 km',
    },
    tirePressure: {
      frontPsi: 32,
      rearPsi: 30,
      loadedFrontPsi: 35,
      loadedRearPsi: 35,
      tireSize: 'Conforme etiqueta de fábrica na coluna da porta do motorista',
    },
    oemParts: [
      { category: 'Óleo & Filtro', name: 'Filtro de Óleo do Motor com Válvula Anti-retorno', code: 'OEM STD-01', brand: 'Mann / Mahle / Fram', recommendedChange: '10.000 km' },
      { category: 'Admissão', name: 'Filtro de Ar do Motor com Papel Microporoso', code: 'OEM STD-02', brand: 'Tecfil / Mann-Filter', recommendedChange: '20.000 km' },
      { category: 'Climatização', name: 'Filtro de Cabine Anti-pólen e Fungos', code: 'OEM STD-03', brand: 'MicronAir / Filtros Brasil', recommendedChange: '10.000 km' },
      { category: 'Combustível', name: 'Filtro de Combustível Principal', code: 'OEM STD-04', brand: 'Bosch / Mahle', recommendedChange: '10.000 km' },
      { category: 'Freios', name: 'Jogo de Pastilhas de Freio Dianteiras Cerâmica / Semi-metálica', code: 'OEM STD-05', brand: 'Cobreq / Fras-le / Ferodo', recommendedChange: '30.000 km' },
      { category: 'Ignição', name: 'Velas de Ignição Long Life (Iridium ou Níquel)', code: 'OEM STD-06', brand: 'NGK / Bosch', recommendedChange: '40.000 a 60.000 km' },
    ],
    preventiveTips: [
      'Verifique semanalmente o nível do óleo do motor a frio com o carro nivelado.',
      'Nunca adicione água de torneira ao reservatório de arrefecimento; utilize apenas mistura com água desmineralizada e aditivo orgânico.',
      'Realize o alinhamento de suspensão e balanceamento das rodas a cada 10.000 km ou sempre que trocar os pneus.',
      'Substitua o filtro de ar-condicionado a cada 6 a 12 meses para garantir ar limpo e preservar o compressor.',
    ],
  };
}

// Master lookup function: matches database or uses intelligent fallback
export function lookupVehicleTechnicalData(modelInput: string, yearEngineInput: string): { spec: VehicleSpecData; isOfficialHomologated: boolean } {
  const normModel = (modelInput || '').toLowerCase().trim();
  const normEngine = (yearEngineInput || '').toLowerCase().trim();

  // Search in database
  for (const entry of POPULAR_VEHICLES_DATABASE) {
    const matched = entry.keys.some((k) => normModel.includes(k));
    if (matched) {
      const adaptedSpec: VehicleSpecData = {
        plateOrChassis: 'BASE TÉCNICA OFICIAL',
        brand: entry.brand,
        model: normModel.includes('virtus')
          ? 'Virtus 200 TSI 1.0 Flex'
          : normModel.includes('polo')
          ? 'Polo 200 TSI 1.0 Flex'
          : normModel.includes('nivus')
          ? 'Nivus 200 TSI 1.0 Flex'
          : normModel.includes('t-cross') || normModel.includes('tcross')
          ? 'T-Cross 200 TSI 1.0 Flex'
          : entry.model,
        yearModel: yearEngineInput.trim() ? yearEngineInput.trim() : entry.defaultYearModel,
        engine: entry.engine,
        power: entry.power,
        torque: entry.torque,
        transmission: entry.transmission,
        fuel: entry.fuel,
        tankCapacity: entry.tankCapacity,
        recommendedOil: entry.recommendedOil,
        coolant: entry.coolant,
        brakeFluid: entry.brakeFluid,
        tirePressure: entry.tirePressure,
        oemParts: entry.oemParts,
        preventiveTips: entry.preventiveTips,
      };
      return { spec: adaptedSpec, isOfficialHomologated: true };
    }
  }

  // Not in popular list: run algorithmic smart fallback
  return { spec: generateFallbackVehicleData(modelInput, yearEngineInput), isOfficialHomologated: false };
}

// --- HELPER FUNCTIONS ---

const formatCurrency = (val: number): string => {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
};

const formatDateBR = (dateStr: string): string => {
  if (!dateStr) return '-';
  const parts = dateStr.split('-');
  if (parts.length === 3) {
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
  }
  return dateStr;
};

const formatKm = (km: number): string => {
  return new Intl.NumberFormat('pt-BR').format(km) + ' km';
};

const getDaysDifference = (targetDateStr: string): number => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(targetDateStr);
  target.setHours(0, 0, 0, 0);
  const diffTime = target.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

export default function App() {
  // Navigation tabs
  const [activeTab, setActiveTab] = useState<
    'garage' | 'fuels' | 'maintenance' | 'schedule' | 'upgrades' | 'ai_assistant' | 'report'
  >('garage');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Persistent States in LocalStorage
  const [vehicle, setVehicle] = useState<VehicleProfile>(() => {
    const saved = localStorage.getItem('mnr_vehicle');
    return saved ? JSON.parse(saved) : DEFAULT_VEHICLE;
  });

  const [reminders, setReminders] = useState<ReminderItem[]>(() => {
    const saved = localStorage.getItem('mnr_reminders');
    return saved ? JSON.parse(saved) : DEFAULT_REMINDERS;
  });

  const [fuelLogs, setFuelLogs] = useState<FuelLog[]>(() => {
    const saved = localStorage.getItem('mnr_fuel_logs');
    return saved ? JSON.parse(saved) : DEFAULT_FUELS;
  });

  const [maintenances, setMaintenances] = useState<MaintenanceLog[]>(() => {
    const saved = localStorage.getItem('mnr_maintenances');
    return saved ? JSON.parse(saved) : DEFAULT_MAINTENANCES;
  });

  const [scheduledServices, setScheduledServices] = useState<ScheduledService[]>(() => {
    const saved = localStorage.getItem('mnr_scheduled');
    return saved ? JSON.parse(saved) : DEFAULT_SCHEDULED;
  });

  const [modifications, setModifications] = useState<VehicleModification[]>(() => {
    const saved = localStorage.getItem('mnr_modifications');
    return saved ? JSON.parse(saved) : DEFAULT_MODIFICATIONS;
  });

  // Sync state to localStorage
  useEffect(() => {
    localStorage.setItem('mnr_vehicle', JSON.stringify(vehicle));
  }, [vehicle]);

  useEffect(() => {
    localStorage.setItem('mnr_reminders', JSON.stringify(reminders));
  }, [reminders]);

  useEffect(() => {
    localStorage.setItem('mnr_fuel_logs', JSON.stringify(fuelLogs));
  }, [fuelLogs]);

  useEffect(() => {
    localStorage.setItem('mnr_maintenances', JSON.stringify(maintenances));
  }, [maintenances]);

  useEffect(() => {
    localStorage.setItem('mnr_scheduled', JSON.stringify(scheduledServices));
  }, [scheduledServices]);

  useEffect(() => {
    localStorage.setItem('mnr_modifications', JSON.stringify(modifications));
  }, [modifications]);

  // Modals
  const [isEditVehicleModalOpen, setIsEditVehicleModalOpen] = useState(false);
  const [isFuelModalOpen, setIsFuelModalOpen] = useState(false);
  const [isMaintModalOpen, setIsMaintModalOpen] = useState(false);
  const [isSchedModalOpen, setIsSchedModalOpen] = useState(false);
  const [isModModalOpen, setIsModModalOpen] = useState(false);
  const [isReminderModalOpen, setIsReminderModalOpen] = useState(false);
  const [selectedInvoiceMaint, setSelectedInvoiceMaint] = useState<MaintenanceLog | null>(null);

  // Forms temporary states
  const [vehicleForm, setVehicleForm] = useState<VehicleProfile>(vehicle);
  const [newReminder, setNewReminder] = useState<Partial<ReminderItem>>({
    title: '',
    dueDate: '',
    category: 'Manutenção',
    amount: 0,
    isPaid: false,
    notes: '',
  });

  const [newFuel, setNewFuel] = useState<{
    date: string;
    gasStation: string;
    fuelType: 'Gasolina Comum' | 'Gasolina Aditivada' | 'Etanol' | 'Diesel S10' | 'GNV';
    totalPrice: string;
    liters: string;
    mileage: string;
    projectedRange: string;
    isFullTank: boolean;
    notes: string;
  }>({
    date: new Date().toISOString().split('T')[0],
    gasStation: 'Posto Shell',
    fuelType: 'Gasolina Aditivada',
    totalPrice: '',
    liters: '',
    mileage: vehicle.currentMileage.toString(),
    projectedRange: '',
    isFullTank: true,
    notes: '',
  });

  const [newMaint, setNewMaint] = useState<{
    date: string;
    mileage: string;
    workshop: string;
    category: MaintenanceLog['category'];
    services: string;
    partsReplaced: string;
    partsCost: string;
    laborCost: string;
    invoiceNumber: string;
    warrantyPeriod: string;
    notes: string;
  }>({
    date: new Date().toISOString().split('T')[0],
    mileage: vehicle.currentMileage.toString(),
    workshop: '',
    category: 'Preventiva',
    services: '',
    partsReplaced: '',
    partsCost: '',
    laborCost: '',
    invoiceNumber: '',
    warrantyPeriod: '90 dias ou 5.000 km',
    notes: '',
  });

  const [newSched, setNewSched] = useState<{
    title: string;
    targetMileage: string;
    targetDate: string;
    category: string;
    estimatedCost: string;
    priority: 'Alta' | 'Média' | 'Normal';
    notes: string;
  }>({
    title: '',
    targetMileage: (vehicle.currentMileage + 5000).toString(),
    targetDate: '',
    category: 'Preventiva',
    estimatedCost: '',
    priority: 'Alta',
    notes: '',
  });

  const [newMod, setNewMod] = useState<{
    date: string;
    category: VehicleModification['category'];
    title: string;
    brand: string;
    cost: string;
    workshop: string;
    warrantyTerms: string;
    description: string;
  }>({
    date: new Date().toISOString().split('T')[0],
    category: 'Conforto & Interior',
    title: '',
    brand: '',
    cost: '',
    workshop: '',
    warrantyTerms: '1 ano',
    description: '',
  });

  // Technical Consultation States (Internal Intelligent Knowledge Base)
  const [modelQueryInput, setModelQueryInput] = useState('Chevrolet Onix');
  const [yearEngineQueryInput, setYearEngineQueryInput] = useState('2022 1.0 Turbo Flex');
  const [isOfficialHomologated, setIsOfficialHomologated] = useState(true);
  const [technicalQueryResult, setTechnicalQueryResult] = useState<VehicleSpecData>(() => {
    return lookupVehicleTechnicalData('Chevrolet Onix', '2022 1.0 Turbo Flex').spec;
  });
  const [aiChatMessages, setAiChatMessages] = useState<Array<{ sender: 'user' | 'assistant'; text: string; time: string }>>([
    {
      sender: 'assistant',
      text: 'Olá! Sou o Assistente Técnico Inteligente Mão na Roda. Posso te ajudar a consultar dados técnicos, indicar especificações de óleo, fluidos e calibragem dos principais modelos ou orientar sobre manutenções preventivas.',
      time: 'Agora',
    },
  ]);
  const [userChatInput, setUserChatInput] = useState('');
  const [isAiReplying, setIsAiReplying] = useState(false);

  // Search filter for Maintenances
  const [maintSearchTerm, setMaintSearchTerm] = useState('');
  const [maintCategoryFilter, setMaintCategoryFilter] = useState('Todas');

  // --- DERIVED METRICS ---

  // Fuel consumption calculation (between successive full-tank logs)
  const sortedFuelLogs = useMemo(() => {
    return [...fuelLogs].sort((a, b) => a.mileage - b.mileage);
  }, [fuelLogs]);

  const fuelStats = useMemo(() => {
    let totalLiters = 0;
    let totalSpent = 0;
    let kmDiffSum = 0;
    let litersDiffSum = 0;

    sortedFuelLogs.forEach((log, index) => {
      totalLiters += log.liters;
      totalSpent += log.totalPrice;

      if (index > 0) {
        const prev = sortedFuelLogs[index - 1];
        if (log.isFullTank && prev.isFullTank) {
          const kmDiff = log.mileage - prev.mileage;
          if (kmDiff > 0 && log.liters > 0) {
            kmDiffSum += kmDiff;
            litersDiffSum += log.liters;
          }
        }
      }
    });

    const averageKmL = litersDiffSum > 0 ? (kmDiffSum / litersDiffSum).toFixed(2) : '11.8';
    const averagePricePerLiter = totalLiters > 0 ? (totalSpent / totalLiters).toFixed(2) : '5.98';
    const totalKmTracked =
      sortedFuelLogs.length > 1
        ? sortedFuelLogs[sortedFuelLogs.length - 1].mileage - sortedFuelLogs[0].mileage
        : 0;

    return {
      totalSpent,
      totalLiters,
      averageKmL,
      averagePricePerLiter,
      totalKmTracked,
    };
  }, [sortedFuelLogs]);

  // Maintenance statistics
  const maintStats = useMemo(() => {
    const totalSpent = maintenances.reduce((acc, m) => acc + m.totalCost, 0);
    const totalParts = maintenances.reduce((acc, m) => acc + m.partsCost, 0);
    const totalLabor = maintenances.reduce((acc, m) => acc + m.laborCost, 0);
    return { totalSpent, totalParts, totalLabor, count: maintenances.length };
  }, [maintenances]);

  // Upgrades statistics
  const modStats = useMemo(() => {
    const totalInvested = modifications.reduce((acc, m) => acc + m.cost, 0);
    return { totalInvested, count: modifications.length };
  }, [modifications]);

  // Filtered maintenances
  const filteredMaintenances = useMemo(() => {
    return maintenances.filter((m) => {
      const matchesSearch =
        m.services.toLowerCase().includes(maintSearchTerm.toLowerCase()) ||
        m.workshop.toLowerCase().includes(maintSearchTerm.toLowerCase()) ||
        m.partsReplaced.toLowerCase().includes(maintSearchTerm.toLowerCase());
      const matchesCategory =
        maintCategoryFilter === 'Todas' || m.category === maintCategoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [maintenances, maintSearchTerm, maintCategoryFilter]);

  // --- ACTIONS ---

  const handleSaveVehicleProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setVehicle(vehicleForm);
    setIsEditVehicleModalOpen(false);
  };

  const handleAddFuel = (e: React.FormEvent) => {
    e.preventDefault();
    const price = parseFloat(newFuel.totalPrice) || 0;
    const liters = parseFloat(newFuel.liters) || 0;
    const mileage = parseInt(newFuel.mileage, 10) || vehicle.currentMileage;
    const pricePerLiter = liters > 0 ? price / liters : 0;

    const entry: FuelLog = {
      id: 'fuel_' + Date.now(),
      date: newFuel.date,
      gasStation: newFuel.gasStation,
      fuelType: newFuel.fuelType,
      totalPrice: price,
      liters,
      pricePerLiter,
      mileage,
      projectedRange: newFuel.projectedRange ? parseInt(newFuel.projectedRange, 10) : undefined,
      isFullTank: newFuel.isFullTank,
      notes: newFuel.notes,
    };

    setFuelLogs([entry, ...fuelLogs]);

    // Update vehicle mileage if higher
    if (mileage > vehicle.currentMileage) {
      setVehicle((prev) => ({ ...prev, currentMileage: mileage }));
    }

    setIsFuelModalOpen(false);
    setNewFuel({
      date: new Date().toISOString().split('T')[0],
      gasStation: 'Posto Shell',
      fuelType: 'Gasolina Aditivada',
      totalPrice: '',
      liters: '',
      mileage: (mileage + 400).toString(),
      projectedRange: '',
      isFullTank: true,
      notes: '',
    });
  };

  const handleDeleteFuel = (id: string) => {
    if (confirm('Deseja realmente remover este registro de abastecimento?')) {
      setFuelLogs(fuelLogs.filter((f) => f.id !== id));
    }
  };

  const handleAddMaintenance = (e: React.FormEvent) => {
    e.preventDefault();
    const partsCost = parseFloat(newMaint.partsCost) || 0;
    const laborCost = parseFloat(newMaint.laborCost) || 0;
    const totalCost = partsCost + laborCost;
    const mileage = parseInt(newMaint.mileage, 10) || vehicle.currentMileage;

    const entry: MaintenanceLog = {
      id: 'maint_' + Date.now(),
      date: newMaint.date,
      mileage,
      workshop: newMaint.workshop || 'Oficina Mecânica Especializada',
      category: newMaint.category,
      services: newMaint.services,
      partsReplaced: newMaint.partsReplaced,
      partsCost,
      laborCost,
      totalCost,
      invoiceNumber: newMaint.invoiceNumber || `NF-e ${Math.floor(10000 + Math.random() * 90000)}`,
      warrantyPeriod: newMaint.warrantyPeriod,
      notes: newMaint.notes,
    };

    setMaintenances([entry, ...maintenances]);

    if (mileage > vehicle.currentMileage) {
      setVehicle((prev) => ({ ...prev, currentMileage: mileage }));
    }

    setIsMaintModalOpen(false);
    setNewMaint({
      date: new Date().toISOString().split('T')[0],
      mileage: vehicle.currentMileage.toString(),
      workshop: '',
      category: 'Preventiva',
      services: '',
      partsReplaced: '',
      partsCost: '',
      laborCost: '',
      invoiceNumber: '',
      warrantyPeriod: '90 dias ou 5.000 km',
      notes: '',
    });
  };

  const handleDeleteMaintenance = (id: string) => {
    if (confirm('Deseja remover este histórico de manutenção?')) {
      setMaintenances(maintenances.filter((m) => m.id !== id));
    }
  };

  const handleAddScheduled = (e: React.FormEvent) => {
    e.preventDefault();
    const entry: ScheduledService = {
      id: 'sched_' + Date.now(),
      title: newSched.title,
      targetMileage: newSched.targetMileage ? parseInt(newSched.targetMileage, 10) : undefined,
      targetDate: newSched.targetDate || undefined,
      category: newSched.category,
      estimatedCost: newSched.estimatedCost ? parseFloat(newSched.estimatedCost) : undefined,
      priority: newSched.priority,
      isCompleted: false,
      notes: newSched.notes,
    };

    setScheduledServices([...scheduledServices, entry]);
    setIsSchedModalOpen(false);
    setNewSched({
      title: '',
      targetMileage: (vehicle.currentMileage + 5000).toString(),
      targetDate: '',
      category: 'Preventiva',
      estimatedCost: '',
      priority: 'Alta',
      notes: '',
    });
  };

  const handleToggleScheduledCompleted = (id: string) => {
    setScheduledServices(
      scheduledServices.map((s) => (s.id === id ? { ...s, isCompleted: !s.isCompleted } : s))
    );
  };

  const handleDeleteScheduled = (id: string) => {
    setScheduledServices(scheduledServices.filter((s) => s.id !== id));
  };

  const handleConvertScheduledToMaintenance = (sched: ScheduledService) => {
    setNewMaint({
      date: new Date().toISOString().split('T')[0],
      mileage: vehicle.currentMileage.toString(),
      workshop: '',
      category: 'Preventiva',
      services: sched.title,
      partsReplaced: '',
      partsCost: sched.estimatedCost ? (sched.estimatedCost * 0.6).toFixed(2) : '',
      laborCost: sched.estimatedCost ? (sched.estimatedCost * 0.4).toFixed(2) : '',
      invoiceNumber: `NF-e ${Math.floor(10000 + Math.random() * 90000)}`,
      warrantyPeriod: '90 dias ou 5.000 km',
      notes: sched.notes || '',
    });
    // Mark as completed
    handleToggleScheduledCompleted(sched.id);
    setIsMaintModalOpen(true);
  };

  const handleAddModification = (e: React.FormEvent) => {
    e.preventDefault();
    const cost = parseFloat(newMod.cost) || 0;
    const entry: VehicleModification = {
      id: 'mod_' + Date.now(),
      date: newMod.date,
      category: newMod.category,
      title: newMod.title,
      brand: newMod.brand,
      cost,
      workshop: newMod.workshop,
      warrantyTerms: newMod.warrantyTerms,
      description: newMod.description,
    };

    setModifications([entry, ...modifications]);
    setIsModModalOpen(false);
    setNewMod({
      date: new Date().toISOString().split('T')[0],
      category: 'Conforto & Interior',
      title: '',
      brand: '',
      cost: '',
      workshop: '',
      warrantyTerms: '1 ano',
      description: '',
    });
  };

  const handleDeleteMod = (id: string) => {
    if (confirm('Deseja remover esta modificação?')) {
      setModifications(modifications.filter((m) => m.id !== id));
    }
  };

  const handleAddReminder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReminder.title || !newReminder.dueDate) return;

    const entry: ReminderItem = {
      id: 'rem_' + Date.now(),
      title: newReminder.title,
      dueDate: newReminder.dueDate,
      category: newReminder.category as ReminderItem['category'],
      amount: newReminder.amount ? Number(newReminder.amount) : undefined,
      isPaid: false,
      notes: newReminder.notes || '',
    };

    setReminders([...reminders, entry]);
    setIsReminderModalOpen(false);
    setNewReminder({
      title: '',
      dueDate: '',
      category: 'Manutenção',
      amount: 0,
      isPaid: false,
      notes: '',
    });
  };

  const handleToggleReminderPaid = (id: string) => {
    setReminders(
      reminders.map((r) => (r.id === id ? { ...r, isPaid: !r.isPaid } : r))
    );
  };

  const handleDeleteReminder = (id: string) => {
    setReminders(reminders.filter((r) => r.id !== id));
  };

  // --- INSTANT INTERNAL TECHNICAL CONSULTATION ENGINE ---
  const handleConsultTechnicalData = (modelToUse?: string, yearEngineToUse?: string) => {
    const targetModel = modelToUse !== undefined ? modelToUse : modelQueryInput;
    const targetYearEngine = yearEngineToUse !== undefined ? yearEngineToUse : yearEngineQueryInput;

    const result = lookupVehicleTechnicalData(targetModel, targetYearEngine);
    setTechnicalQueryResult(result.spec);
    setIsOfficialHomologated(result.isOfficialHomologated);
  };

  const handleQuickSelectModel = (presetModel: string, presetYearEngine: string) => {
    setModelQueryInput(presetModel);
    setYearEngineQueryInput(presetYearEngine);
    handleConsultTechnicalData(presetModel, presetYearEngine);
  };

  const handleUseGarageCar = () => {
    setModelQueryInput(vehicle.model);
    const engineInfo = vehicle.version ? `${vehicle.year} • ${vehicle.version}` : vehicle.year;
    setYearEngineQueryInput(engineInfo);
    handleConsultTechnicalData(vehicle.model, engineInfo);
  };

  const handleApplyAiVehicleToGarage = (spec: VehicleSpecData) => {
    setVehicle((prev) => ({
      ...prev,
      brand: spec.brand,
      model: spec.model,
      year: spec.yearModel,
      plate: spec.plateOrChassis,
      version: spec.engine,
      tankCapacity: spec.tankCapacity,
    }));
    setActiveTab('garage');
  };

  // AI Mechanic Chat Handler
  const handleSendAiChatMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userChatInput.trim() || isAiReplying) return;

    const userText = userChatInput.trim();
    const newMsg = {
      sender: 'user' as const,
      text: userText,
      time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
    };

    setAiChatMessages((prev) => [...prev, newMsg]);
    setUserChatInput('');
    setIsAiReplying(true);

    // Intelligent Automotive mechanics response simulator
    await new Promise((resolve) => setTimeout(resolve, 900));

    let reply = `Com base nas informações do seu veículo (${vehicle.model} - ${vehicle.currentMileage} km):`;
    const lower = userText.toLowerCase();

    if (lower.includes('barulho') || lower.includes('freio') || lower.includes('pastilha')) {
      reply +=
        ' Ruídos metálicos agudos ao acionar o pedal de freio geralmente indicam que o sensor sonoro de desgaste das pastilhas encostou no disco. Recomendamos a inspeção visual imediata da espessura das pastilhas dianteiras e traseiras. Se a espessura for inferior a 3 mm, faça a substituição preventiva para não danificar o disco de freio.';
    } else if (lower.includes('óleo') || lower.includes('oleo') || lower.includes('viscosidade')) {
      reply +=
        ' Para o seu motor, a especificação técnica recomendada é óleo 100% sintético de baixa viscosidade (geralmente 0W-20 ou 5W-30 com homologação API SP). Nunca misture viscosidades diferentes e troque impreterivelmente o filtro de óleo a cada troca. O intervalo recomendado para uso urbano severo é de 6 meses ou 5.000 a 7.500 km.';
    } else if (lower.includes('combustível') || lower.includes('etanol') || lower.includes('gasolina') || lower.includes('consumo')) {
      reply +=
        ' O cálculo da paridade financeira clássica é: se o preço do etanol for inferior a 70% do preço da gasolina, o etanol compensa financeiramente. Se seu motor possui injeção direta turbo, a gasolina de alta octanagem ou aditivada de qualidade previne a formação de depósitos carbonizados nas válvulas e garante o pico de torque com menor detonação.';
    } else if (lower.includes('correia') || lower.includes('dentada')) {
      reply +=
        ' A correia dentada (ou sincronizadora) é um dos componentes mais críticos do motor. A ruptura causa colisão entre pistões e válvulas, gerando danos severos no cabeçote. Recomendamos a substituição preventiva entre 40.000 km e 60.000 km ou no máximo a cada 4 anos, trocando também o rolamento tensor e a bomba d’água preventiva.';
    } else if (lower.includes('pneu') || lower.includes('calibragem') || lower.includes('psi')) {
      reply +=
        ' A calibragem dos pneus deve ser feita a cada 15 dias, sempre com os pneus frios (rodados menos de 3 km). A pressão recomendada para o seu modelo é de 32 PSI em uso normal e 34 PSI quando estiver com lotação máxima de passageiros e bagagens.';
    } else {
      reply +=
        ' Essa é uma dúvida técnica importante. Mantenha os registros de manutenção e revisões sempre atualizados aqui no Mão na Roda. O acompanhamento rigoroso do hodômetro e das datas de troca de fluidos evita surpresas na estrada e preserva até 20% a mais o valor de revenda do seu veículo.';
    }

    setAiChatMessages((prev) => [
      ...prev,
      {
        sender: 'assistant',
        text: reply,
        time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
    setIsAiReplying(false);
  };

  // Export / Backup handler
  const handleExportData = () => {
    const dataToExport = {
      app: 'Mão na Roda',
      exportedAt: new Date().toISOString(),
      vehicle,
      reminders,
      fuelLogs,
      maintenances,
      scheduledServices,
      modifications,
    };

    const blob = new Blob([JSON.stringify(dataToExport, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mao_na_roda_backup_${vehicle.plate.replace(/[^a-zA-Z0-9]/g, '')}_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        if (json.vehicle) setVehicle(json.vehicle);
        if (json.reminders) setReminders(json.reminders);
        if (json.fuelLogs) setFuelLogs(json.fuelLogs);
        if (json.maintenances) setMaintenances(json.maintenances);
        if (json.scheduledServices) setScheduledServices(json.scheduledServices);
        if (json.modifications) setModifications(json.modifications);
        alert('Dados importados com sucesso!');
      } catch (err) {
        alert('Erro ao importar arquivo. Verifique se o formato JSON é válido.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="min-h-screen bg-[#080d1a] text-slate-100 flex flex-col md:flex-row antialiased selection:bg-blue-600 selection:text-white">
      {/* --- DESKTOP & MOBILE SIDEBAR / HEADER --- */}

      {/* Mobile Top Bar */}
      <div className="md:hidden flex items-center justify-between px-4 py-3 bg-[#0d152c] border-b border-blue-900/40 sticky top-0 z-40">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-600/30">
            <Car className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="font-extrabold text-base tracking-tight text-white block leading-none">
              Mão na Roda
            </span>
            <span className="text-[10px] text-blue-400 font-medium">Assistente Inteligente</span>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <div className="bg-[#101b36] border border-blue-500/30 px-2.5 py-1 rounded text-xs font-mono font-bold text-blue-300">
            {vehicle.plate}
          </div>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg bg-[#142145] text-blue-400 hover:text-white transition-colors"
            aria-label="Abrir Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Sidebar for Desktop & Mobile Overlay */}
      <aside
        className={`fixed md:sticky top-0 left-0 z-50 h-screen w-72 bg-[#0c142b] border-r border-blue-950/80 flex flex-col justify-between transition-transform duration-300 ease-in-out ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="flex flex-col h-full overflow-y-auto">
          {/* Brand Header */}
          <div className="p-5 border-b border-blue-950/60">
            <div className="flex items-center space-x-3 mb-1">
              <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-md shadow-blue-600/40 ring-2 ring-blue-500/20">
                <Car className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-extrabold tracking-tight text-white leading-tight">
                  Mão na Roda
                </h1>
                <p className="text-xs text-blue-400 font-medium">Assistente Automotivo</p>
              </div>
            </div>
            <p className="text-[11px] text-slate-400 mt-2 italic">
              "O seu assistente automotivo inteligente."
            </p>
          </div>

          {/* Active Vehicle Card Mini in Sidebar */}
          <div className="mx-4 my-3 p-3.5 rounded-xl bg-[#101c3d] border border-blue-800/40 shadow-inner">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span className="font-semibold text-blue-400 uppercase tracking-wider text-[10px]">
                Veículo Ativo
              </span>
              <button
                onClick={() => {
                  setVehicleForm(vehicle);
                  setIsEditVehicleModalOpen(true);
                  setMobileMenuOpen(false);
                }}
                className="text-blue-400 hover:text-blue-300 flex items-center gap-1 transition-colors"
                title="Editar dados do carro"
              >
                <Edit3 className="w-3 h-3" />
                <span>Editar</span>
              </button>
            </div>
            <div className="font-bold text-sm text-white truncate">{vehicle.model}</div>
            <div className="flex items-center justify-between mt-2 pt-2 border-t border-blue-900/40 text-xs">
              <div className="flex items-center gap-1.5 text-blue-300 font-mono font-semibold">
                <span className="inline-block w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
                {vehicle.plate}
              </div>
              <div className="text-slate-300 font-medium">{formatKm(vehicle.currentMileage)}</div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 px-3 py-2 space-y-1">
            <button
              onClick={() => {
                setActiveTab('garage');
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                activeTab === 'garage'
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                  : 'text-slate-300 hover:bg-[#121f44] hover:text-white'
              }`}
            >
              <Gauge className="w-4 h-4 text-blue-400" />
              <span>Garagem & Painel</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('fuels');
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                activeTab === 'fuels'
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                  : 'text-slate-300 hover:bg-[#121f44] hover:text-white'
              }`}
            >
              <Fuel className="w-4 h-4 text-blue-400" />
              <span>Abastecimentos</span>
              <span className="ml-auto text-xs px-2 py-0.5 rounded-full bg-blue-950 text-blue-300 border border-blue-800/40">
                {fuelLogs.length}
              </span>
            </button>

            <button
              onClick={() => {
                setActiveTab('maintenance');
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                activeTab === 'maintenance'
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                  : 'text-slate-300 hover:bg-[#121f44] hover:text-white'
              }`}
            >
              <Wrench className="w-4 h-4 text-blue-400" />
              <span>Revisões & Manutenções</span>
              <span className="ml-auto text-xs px-2 py-0.5 rounded-full bg-blue-950 text-blue-300 border border-blue-800/40">
                {maintenances.length}
              </span>
            </button>

            <button
              onClick={() => {
                setActiveTab('schedule');
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                activeTab === 'schedule'
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                  : 'text-slate-300 hover:bg-[#121f44] hover:text-white'
              }`}
            >
              <Calendar className="w-4 h-4 text-blue-400" />
              <span>Agenda de Revisões</span>
              {scheduledServices.filter((s) => !s.isCompleted).length > 0 && (
                <span className="ml-auto text-xs px-2 py-0.5 rounded-full bg-blue-500/30 text-blue-300 border border-blue-500/40 font-bold">
                  {scheduledServices.filter((s) => !s.isCompleted).length}
                </span>
              )}
            </button>

            <button
              onClick={() => {
                setActiveTab('upgrades');
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                activeTab === 'upgrades'
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                  : 'text-slate-300 hover:bg-[#121f44] hover:text-white'
              }`}
            >
              <Sliders className="w-4 h-4 text-blue-400" />
              <span>Upgrades & Modificações</span>
              <span className="ml-auto text-xs px-2 py-0.5 rounded-full bg-blue-950 text-blue-300 border border-blue-800/40">
                {modifications.length}
              </span>
            </button>

            <div className="pt-2 pb-1">
              <div className="text-[10px] font-bold uppercase tracking-wider text-blue-400/80 px-3.5 mb-1">
                Inteligência Veicular
              </div>
            </div>

            <button
              onClick={() => {
                setActiveTab('ai_assistant');
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                activeTab === 'ai_assistant'
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                  : 'text-slate-300 hover:bg-[#121f44] hover:text-white border border-blue-500/20'
              }`}
            >
              <div className="relative">
                <Bot className="w-4 h-4 text-blue-400" />
                <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-blue-400 animate-ping"></span>
              </div>
              <span className="flex-1 text-left">Assistente IA / Consulta</span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30 font-bold">
                Técnica
              </span>
            </button>

            <button
              onClick={() => {
                setActiveTab('report');
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                activeTab === 'report'
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                  : 'text-slate-300 hover:bg-[#121f44] hover:text-white'
              }`}
            >
              <FileText className="w-4 h-4 text-blue-400" />
              <span>Dossiê & Backup</span>
            </button>
          </nav>

          {/* Quick Footer */}
          <div className="p-4 border-t border-blue-950/60 mt-auto bg-[#0a1124]">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
                Armazenamento Local
              </span>
              <span className="text-blue-400 font-mono text-[11px]">100% Privado</span>
            </div>
            <div className="text-[11px] text-slate-400 leading-relaxed">
              Todos os dados ficam salvos de forma segura no seu navegador.
            </div>
          </div>
        </div>
      </aside>

      {/* Backdrop for mobile sidebar */}
      {mobileMenuOpen && (
        <div
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 bg-black/70 backdrop-blur-xs z-40 md:hidden"
        />
      )}

      {/* --- MAIN CONTENT AREA --- */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Header Bar for Desktop */}
        <header className="hidden md:flex items-center justify-between px-8 py-4 bg-[#0c142b]/80 backdrop-blur border-b border-blue-950/60 sticky top-0 z-30">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              {activeTab === 'garage' && 'Garagem & Visão Geral'}
              {activeTab === 'fuels' && 'Módulo de Abastecimentos & Eficiência'}
              {activeTab === 'maintenance' && 'Histórico de Revisões & Manutenções'}
              {activeTab === 'schedule' && 'Agenda Programada de Revisões'}
              {activeTab === 'upgrades' && 'Modificações, Upgrades & Acessórios'}
              {activeTab === 'ai_assistant' && 'Assistente IA / Consulta Técnica Veicular'}
              {activeTab === 'report' && 'Dossiê do Veículo & Gerenciamento de Backup'}
            </h2>
            <p className="text-xs text-slate-400">
              {vehicle.model} • {vehicle.year} • {formatKm(vehicle.currentMileage)}
            </p>
          </div>

          <div className="flex items-center space-x-3">
            {/* Mercosul Plate Styled Badge */}
            <div className="flex items-center border border-blue-700/60 rounded-md overflow-hidden shadow-sm bg-[#101c3d]">
              <div className="bg-blue-700 px-2 py-0.5 text-[9px] font-bold text-white tracking-widest flex items-center gap-1">
                <span>BRASIL</span>
              </div>
              <div className="px-3 py-0.5 font-mono font-bold text-sm text-blue-200 tracking-wider">
                {vehicle.plate}
              </div>
            </div>

            <button
              onClick={() => {
                setVehicleForm(vehicle);
                setIsEditVehicleModalOpen(true);
              }}
              className="px-3.5 py-1.5 rounded-lg bg-[#142247] hover:bg-blue-600 text-blue-300 hover:text-white border border-blue-700/40 text-xs font-semibold flex items-center gap-1.5 transition-all"
            >
              <Settings2 className="w-3.5 h-3.5" />
              <span>Ajustar Carro</span>
            </button>
          </div>
        </header>

        {/* Tab Content Container */}
        <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full">
          {/* ========================================================= */}
          {/* TAB 1: GARAGE & DASHBOARD OVERVIEW */}
          {/* ========================================================= */}
          {activeTab === 'garage' && (
            <div className="space-y-6">
              {/* Hero Vehicle Banner */}
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#101c3d] via-[#0d162f] to-[#0a1124] border border-blue-800/40 p-5 sm:p-7 shadow-xl">
                <div className="absolute top-0 right-0 -mt-10 -mr-10 w-72 h-72 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

                <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                  <div className="space-y-3">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-600/20 border border-blue-500/30 text-blue-300 text-xs font-semibold">
                      <Car className="w-3.5 h-3.5" />
                      <span>{vehicle.brand} • Garagem Principal</span>
                    </div>

                    <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                      {vehicle.model}
                    </h1>

                    <p className="text-sm text-slate-300 max-w-xl font-normal leading-relaxed">
                      {vehicle.version} • Cor {vehicle.color} • Tanque com {vehicle.tankCapacity} Litros
                    </p>

                    <div className="flex flex-wrap items-center gap-3 pt-1">
                      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#14234c] border border-blue-800/50 text-xs font-mono font-bold text-blue-300">
                        <span>Placa:</span> {vehicle.plate}
                      </div>
                      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#14234c] border border-blue-800/50 text-xs text-slate-300">
                        <Gauge className="w-3.5 h-3.5 text-blue-400" />
                        <span className="font-bold text-white">{formatKm(vehicle.currentMileage)}</span>
                      </div>
                      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#14234c] border border-blue-800/50 text-xs text-slate-300">
                        <Calendar className="w-3.5 h-3.5 text-blue-400" />
                        <span>Adquirido em: {formatDateBR(vehicle.acquisitionDate)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions & Quick Buttons */}
                  <div className="flex flex-col sm:flex-row lg:flex-col gap-2.5">
                    <button
                      onClick={() => setIsFuelModalOpen(true)}
                      className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 transition-all cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Novo Abastecimento</span>
                    </button>
                    <button
                      onClick={() => setIsMaintModalOpen(true)}
                      className="px-4 py-2.5 rounded-xl bg-[#142247] hover:bg-blue-600/30 text-blue-300 hover:text-white border border-blue-600/40 font-semibold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
                    >
                      <Wrench className="w-4 h-4 text-blue-400" />
                      <span>Registrar Manutenção</span>
                    </button>
                    <button
                      onClick={() => {
                        setVehicleForm(vehicle);
                        setIsEditVehicleModalOpen(true);
                      }}
                      className="px-4 py-2 rounded-xl bg-transparent hover:bg-[#131f40] text-slate-300 hover:text-white text-xs font-medium flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5 text-blue-400" />
                      <span>Editar Ficha Técnica</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Quick Stat Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 rounded-xl bg-[#0f1936] border border-blue-900/40 relative overflow-hidden">
                  <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
                    <span>Odômetro Atual</span>
                    <Gauge className="w-4 h-4 text-blue-400" />
                  </div>
                  <div className="text-xl font-extrabold text-white font-mono">
                    {formatKm(vehicle.currentMileage)}
                  </div>
                  <div className="text-[11px] text-blue-400 mt-1 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Em dia no sistema</span>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-[#0f1936] border border-blue-900/40 relative overflow-hidden">
                  <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
                    <span>Consumo Médio</span>
                    <Fuel className="w-4 h-4 text-blue-400" />
                  </div>
                  <div className="text-xl font-extrabold text-white font-mono">
                    {fuelStats.averageKmL} <span className="text-xs text-slate-400">km/L</span>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1">
                    Média de {formatCurrency(Number(fuelStats.averagePricePerLiter))} / L
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-[#0f1936] border border-blue-900/40 relative overflow-hidden">
                  <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
                    <span>Gasto em Manutenções</span>
                    <Wrench className="w-4 h-4 text-blue-400" />
                  </div>
                  <div className="text-xl font-extrabold text-white">
                    {formatCurrency(maintStats.totalSpent)}
                  </div>
                  <div className="text-[11px] text-blue-400 mt-1">
                    {maintStats.count} manutenções registradas
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-[#0f1936] border border-blue-900/40 relative overflow-hidden">
                  <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
                    <span>Investido em Upgrades</span>
                    <Sparkles className="w-4 h-4 text-blue-400" />
                  </div>
                  <div className="text-xl font-extrabold text-white">
                    {formatCurrency(modStats.totalInvested)}
                  </div>
                  <div className="text-[11px] text-blue-400 mt-1">
                    {modStats.count} modificações ativas
                  </div>
                </div>
              </div>

              {/* Reminders & Alerts Section */}
              <div className="p-5 sm:p-6 rounded-2xl bg-[#0f1936] border border-blue-900/40 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-lg bg-blue-600/20 text-blue-400">
                      <Clock className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white">
                        Lembretes Importantes & Vencimentos
                      </h3>
                      <p className="text-xs text-slate-400">
                        Licenciamento anual, IPVA, seguro obrigatório e manutenções programadas
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsReminderModalOpen(true)}
                    className="px-3 py-1.5 rounded-lg bg-blue-600/20 hover:bg-blue-600 text-blue-300 hover:text-white border border-blue-600/30 text-xs font-semibold flex items-center gap-1.5 transition-all self-start sm:self-auto cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Adicionar Lembrete</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3.5 pt-2">
                  {reminders.map((rem) => {
                    const daysLeft = getDaysDifference(rem.dueDate);
                    const isUrgent = daysLeft <= 15 && !rem.isPaid;
                    const isLate = daysLeft < 0 && !rem.isPaid;

                    return (
                      <div
                        key={rem.id}
                        className={`p-4 rounded-xl border transition-all flex flex-col justify-between ${
                          rem.isPaid
                            ? 'bg-[#0d152a]/60 border-blue-950 opacity-60'
                            : isLate
                            ? 'bg-blue-950/40 border-blue-500/60 shadow-md shadow-blue-900/20'
                            : isUrgent
                            ? 'bg-blue-900/20 border-blue-600/50'
                            : 'bg-[#121c3b] border-blue-900/40'
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between text-xs mb-1.5">
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-600/20 text-blue-300 border border-blue-500/30">
                              {rem.category}
                            </span>
                            <span
                              className={`text-[11px] font-semibold ${
                                rem.isPaid
                                  ? 'text-blue-400'
                                  : isLate
                                  ? 'text-blue-300 font-bold'
                                  : isUrgent
                                  ? 'text-blue-400 font-bold'
                                  : 'text-slate-400'
                              }`}
                            >
                              {rem.isPaid
                                ? 'Concluído'
                                : isLate
                                ? `Venceu há ${Math.abs(daysLeft)} dias`
                                : daysLeft === 0
                                ? 'Vence Hoje!'
                                : `Faltam ${daysLeft} dias`}
                            </span>
                          </div>

                          <h4 className="text-sm font-bold text-white leading-snug">{rem.title}</h4>

                          <div className="text-xs text-slate-400 mt-1">
                            Vencimento: <span className="text-slate-200">{formatDateBR(rem.dueDate)}</span>
                          </div>

                          {rem.amount ? (
                            <div className="text-xs text-blue-300 font-bold mt-1">
                              {formatCurrency(rem.amount)}
                            </div>
                          ) : null}

                          {rem.notes && (
                            <p className="text-[11px] text-slate-400 mt-2 line-clamp-2 italic">
                              "{rem.notes}"
                            </p>
                          )}
                        </div>

                        <div className="flex items-center justify-between pt-3 mt-3 border-t border-blue-900/30">
                          <button
                            onClick={() => handleToggleReminderPaid(rem.id)}
                            className={`text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                              rem.isPaid
                                ? 'text-slate-400 hover:text-white'
                                : 'text-blue-400 hover:text-blue-300'
                            }`}
                          >
                            <CheckCircle2 className="w-4 h-4" />
                            <span>{rem.isPaid ? 'Reabrir' : 'Marcar Pago'}</span>
                          </button>
                          <button
                            onClick={() => handleDeleteReminder(rem.id)}
                            className="text-slate-400 hover:text-blue-300 p-1 transition-colors"
                            title="Excluir lembrete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Two columns: Next Scheduled Services & Recent History */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Upcoming scheduled */}
                <div className="p-5 sm:p-6 rounded-2xl bg-[#0f1936] border border-blue-900/40 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-blue-400" />
                      <h3 className="font-bold text-white text-base">Próximas Revisões na Fila</h3>
                    </div>
                    <button
                      onClick={() => setActiveTab('schedule')}
                      className="text-xs text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1"
                    >
                      <span>Ver agenda</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="space-y-2.5">
                    {scheduledServices.slice(0, 3).map((item) => {
                      const kmRemaining = item.targetMileage
                        ? item.targetMileage - vehicle.currentMileage
                        : null;

                      return (
                        <div
                          key={item.id}
                          className="p-3.5 rounded-xl bg-[#121c3b] border border-blue-900/30 flex items-center justify-between gap-3"
                        >
                          <div>
                            <div className="font-semibold text-sm text-white">{item.title}</div>
                            <div className="text-xs text-slate-400 mt-0.5 flex flex-wrap gap-2">
                              {item.targetMileage && (
                                <span>
                                  Alvo: <strong className="text-blue-300">{formatKm(item.targetMileage)}</strong>
                                </span>
                              )}
                              {kmRemaining !== null && (
                                <span className="text-blue-400 font-bold">
                                  ({kmRemaining > 0 ? `Faltam ${kmRemaining} km` : 'Atingido!'})
                                </span>
                              )}
                              {item.targetDate && (
                                <span>Data: {formatDateBR(item.targetDate)}</span>
                              )}
                            </div>
                          </div>

                          <button
                            onClick={() => handleConvertScheduledToMaintenance(item)}
                            className="px-2.5 py-1.5 rounded-lg bg-blue-600/20 hover:bg-blue-600 text-blue-300 hover:text-white border border-blue-600/30 text-xs font-semibold whitespace-nowrap transition-all cursor-pointer"
                          >
                            Registrar
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Recent Maintenance preview */}
                <div className="p-5 sm:p-6 rounded-2xl bg-[#0f1936] border border-blue-900/40 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Wrench className="w-4 h-4 text-blue-400" />
                      <h3 className="font-bold text-white text-base">Últimas Manutenções Realizadas</h3>
                    </div>
                    <button
                      onClick={() => setActiveTab('maintenance')}
                      className="text-xs text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1"
                    >
                      <span>Histórico completo</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="space-y-2.5">
                    {maintenances.slice(0, 2).map((m) => (
                      <div
                        key={m.id}
                        className="p-3.5 rounded-xl bg-[#121c3b] border border-blue-900/30 flex items-center justify-between gap-3"
                      >
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-blue-300 font-mono">
                              {formatKm(m.mileage)}
                            </span>
                            <span className="text-slate-400 text-xs">• {formatDateBR(m.date)}</span>
                          </div>
                          <div className="font-semibold text-sm text-white truncate mt-0.5">
                            {m.workshop}
                          </div>
                          <div className="text-xs text-slate-300 truncate mt-0.5">{m.services}</div>
                        </div>

                        <div className="text-right whitespace-nowrap">
                          <div className="font-bold text-sm text-white">
                            {formatCurrency(m.totalCost)}
                          </div>
                          <button
                            onClick={() => setSelectedInvoiceMaint(m)}
                            className="text-[11px] text-blue-400 hover:text-blue-300 underline mt-0.5 block"
                          >
                            Ver O.S.
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 2: FUEL LOGS & CONSUMPTION MODULE */}
          {/* ========================================================= */}
          {activeTab === 'fuels' && (
            <div className="space-y-6">
              {/* Header with stats and action */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <Fuel className="w-5 h-5 text-blue-400" />
                    Controle de Abastecimentos & Consumo
                  </h2>
                  <p className="text-xs text-slate-400">
                    Acompanhe autonomia, custo por quilômetro e consumo médio (km/l) do seu carro
                  </p>
                </div>

                <button
                  onClick={() => setIsFuelModalOpen(true)}
                  className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 transition-all cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Novo Abastecimento</span>
                </button>
              </div>

              {/* Fuel Highlights */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 rounded-xl bg-[#0f1936] border border-blue-900/40">
                  <span className="text-xs text-slate-400">Consumo Médio Registrado</span>
                  <div className="text-2xl font-extrabold text-white font-mono mt-1">
                    {fuelStats.averageKmL} <span className="text-xs text-slate-400">km/L</span>
                  </div>
                  <span className="text-[11px] text-blue-400 mt-1 block">
                    Calculado entre tanques cheios
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-[#0f1936] border border-blue-900/40">
                  <span className="text-xs text-slate-400">Preço Médio por Litro</span>
                  <div className="text-2xl font-extrabold text-white font-mono mt-1">
                    {formatCurrency(Number(fuelStats.averagePricePerLiter))}
                  </div>
                  <span className="text-[11px] text-slate-400 mt-1 block">
                    Total abastecido: {fuelStats.totalLiters.toFixed(1)} L
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-[#0f1936] border border-blue-900/40">
                  <span className="text-xs text-slate-400">Gasto Total Acumulado</span>
                  <div className="text-2xl font-extrabold text-white mt-1">
                    {formatCurrency(fuelStats.totalSpent)}
                  </div>
                  <span className="text-[11px] text-blue-400 mt-1 block">
                    {fuelLogs.length} abastecimentos registrados
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-[#0f1936] border border-blue-900/40">
                  <span className="text-xs text-slate-400">Quilômetros Monitorados</span>
                  <div className="text-2xl font-extrabold text-white font-mono mt-1">
                    {formatKm(fuelStats.totalKmTracked)}
                  </div>
                  <span className="text-[11px] text-slate-400 mt-1 block">
                    No período dos registros
                  </span>
                </div>
              </div>

              {/* Fuel Table */}
              <div className="rounded-2xl bg-[#0f1936] border border-blue-900/40 overflow-hidden shadow-lg">
                <div className="p-4 border-b border-blue-900/40 flex items-center justify-between">
                  <span className="text-sm font-bold text-white">Histórico Detalhado</span>
                  <span className="text-xs text-slate-400 font-mono">{fuelLogs.length} registros</span>
                </div>

                {fuelLogs.length === 0 ? (
                  <div className="p-12 text-center text-slate-400">
                    <Fuel className="w-12 h-12 text-blue-500/30 mx-auto mb-3" />
                    <p className="text-sm font-semibold text-white">Nenhum abastecimento cadastrado ainda.</p>
                    <p className="text-xs text-slate-400 mt-1">
                      Clique no botão acima para registrar seu primeiro abastecimento.
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-sm">
                      <thead>
                        <tr className="border-b border-blue-950 bg-[#121c3b]/60 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                          <th className="py-3 px-4">Data</th>
                          <th className="py-3 px-4">Posto / Bandeira</th>
                          <th className="py-3 px-4">Combustível</th>
                          <th className="py-3 px-4">Litros</th>
                          <th className="py-3 px-4">R$ / Litro</th>
                          <th className="py-3 px-4">Total Pago</th>
                          <th className="py-3 px-4">Odômetro</th>
                          <th className="py-3 px-4">Autonomia Painel</th>
                          <th className="py-3 px-4 text-right">Ação</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-blue-950/60">
                        {fuelLogs.map((log) => (
                          <tr key={log.id} className="hover:bg-[#121c3b]/40 transition-colors">
                            <td className="py-3.5 px-4 font-medium text-slate-200">
                              {formatDateBR(log.date)}
                            </td>
                            <td className="py-3.5 px-4 font-semibold text-white">
                              {log.gasStation}
                            </td>
                            <td className="py-3.5 px-4">
                              <span className="px-2 py-0.5 rounded text-xs font-medium bg-blue-600/20 text-blue-300 border border-blue-500/30">
                                {log.fuelType}
                              </span>
                            </td>
                            <td className="py-3.5 px-4 font-mono text-slate-200">
                              {log.liters.toFixed(2)} L
                            </td>
                            <td className="py-3.5 px-4 font-mono text-slate-300">
                              {formatCurrency(log.pricePerLiter)}
                            </td>
                            <td className="py-3.5 px-4 font-bold text-white font-mono">
                              {formatCurrency(log.totalPrice)}
                            </td>
                            <td className="py-3.5 px-4 font-mono text-blue-300 font-semibold">
                              {formatKm(log.mileage)}
                            </td>
                            <td className="py-3.5 px-4 text-slate-300 font-mono">
                              {log.projectedRange ? `${log.projectedRange} km` : '-'}
                            </td>
                            <td className="py-3.5 px-4 text-right">
                              <button
                                onClick={() => handleDeleteFuel(log.id)}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-blue-300 hover:bg-blue-950/40 transition-colors"
                                title="Excluir abastecimento"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 3: MAINTENANCE HISTORY */}
          {/* ========================================================= */}
          {activeTab === 'maintenance' && (
            <div className="space-y-6">
              {/* Top bar & actions */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <Wrench className="w-5 h-5 text-blue-400" />
                    Histórico de Revisões & Manutenções
                  </h2>
                  <p className="text-xs text-slate-400">
                    Livro digital com notas fiscais, peças trocadas, garantia e ordens de serviço
                  </p>
                </div>

                <button
                  onClick={() => setIsMaintModalOpen(true)}
                  className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 transition-all cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Nova Manutenção</span>
                </button>
              </div>

              {/* Filter and Search Bar */}
              <div className="p-4 rounded-xl bg-[#0f1936] border border-blue-900/40 flex flex-col md:flex-row gap-3 items-center justify-between">
                <div className="relative w-full md:w-80">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Buscar oficina, serviço ou peça..."
                    value={maintSearchTerm}
                    onChange={(e) => setMaintSearchTerm(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 rounded-lg bg-[#121c3b] border border-blue-900/50 text-white placeholder-slate-400 text-sm focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
                  <span className="text-xs text-slate-400 whitespace-nowrap">Filtrar:</span>
                  {[
                    'Todas',
                    'Preventiva',
                    'Troca de Óleo e Filtros',
                    'Freios e Pneus',
                    'Corretiva',
                  ].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setMaintCategoryFilter(cat)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                        maintCategoryFilter === cat
                          ? 'bg-blue-600 text-white'
                          : 'bg-[#121c3b] text-slate-300 hover:text-white border border-blue-900/40'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Maintenance Cards List */}
              <div className="space-y-4">
                {filteredMaintenances.length === 0 ? (
                  <div className="p-12 text-center rounded-2xl bg-[#0f1936] border border-blue-900/40 text-slate-400">
                    <Wrench className="w-12 h-12 text-blue-500/30 mx-auto mb-3" />
                    <p className="text-sm font-semibold text-white">Nenhuma manutenção encontrada.</p>
                    <p className="text-xs text-slate-400 mt-1">
                      Ajuste os filtros ou adicione um novo registro de serviço.
                    </p>
                  </div>
                ) : (
                  filteredMaintenances.map((item) => (
                    <div
                      key={item.id}
                      className="p-5 sm:p-6 rounded-2xl bg-[#0f1936] border border-blue-900/40 hover:border-blue-700/60 transition-all shadow-md space-y-4"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-3 border-b border-blue-900/30">
                        <div>
                          <div className="flex items-center gap-2.5 flex-wrap">
                            <span className="px-2.5 py-0.5 rounded text-xs font-bold bg-blue-600/20 text-blue-300 border border-blue-500/30">
                              {item.category}
                            </span>
                            <span className="text-xs text-slate-400 font-mono">
                              {formatDateBR(item.date)}
                            </span>
                            <span className="text-xs font-bold text-blue-300 font-mono">
                              • {formatKm(item.mileage)}
                            </span>
                          </div>
                          <h3 className="text-base sm:text-lg font-bold text-white mt-1.5">
                            {item.workshop}
                          </h3>
                        </div>

                        <div className="flex items-center gap-3 self-end sm:self-start">
                          <div className="text-right">
                            <span className="text-xs text-slate-400 block">Total do Serviço</span>
                            <span className="text-lg font-extrabold text-white font-mono">
                              {formatCurrency(item.totalCost)}
                            </span>
                          </div>
                          <button
                            onClick={() => setSelectedInvoiceMaint(item)}
                            className="px-3 py-1.5 rounded-lg bg-blue-600/20 hover:bg-blue-600 text-blue-300 hover:text-white border border-blue-500/30 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
                            title="Ver nota fiscal e ordem de serviço"
                          >
                            <FileText className="w-3.5 h-3.5" />
                            <span>Comprovante / O.S.</span>
                          </button>
                        </div>
                      </div>

                      {/* Service description & Parts */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                        <div className="bg-[#121c3b] p-3.5 rounded-xl border border-blue-900/30">
                          <span className="font-semibold text-blue-400 uppercase text-[10px] tracking-wider block mb-1">
                            Serviços Executados
                          </span>
                          <p className="text-slate-200 leading-relaxed">{item.services}</p>
                        </div>

                        <div className="bg-[#121c3b] p-3.5 rounded-xl border border-blue-900/30">
                          <span className="font-semibold text-blue-400 uppercase text-[10px] tracking-wider block mb-1">
                            Peças & Componentes Substituídos
                          </span>
                          <p className="text-slate-200 leading-relaxed">
                            {item.partsReplaced || 'Nenhuma peça física discriminada.'}
                          </p>
                        </div>
                      </div>

                      {/* Footer Info: Warranty, Cost breakdown & delete */}
                      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-xs text-slate-400">
                        <div className="flex items-center gap-4 flex-wrap">
                          <span>
                            Peças: <strong className="text-white">{formatCurrency(item.partsCost)}</strong>
                          </span>
                          <span>
                            Mão de Obra: <strong className="text-white">{formatCurrency(item.laborCost)}</strong>
                          </span>
                          {item.warrantyPeriod && (
                            <span className="flex items-center gap-1 text-blue-400 font-semibold">
                              <ShieldCheck className="w-3.5 h-3.5" />
                              Garantia: {item.warrantyPeriod}
                            </span>
                          )}
                          {item.invoiceNumber && (
                            <span className="font-mono text-slate-400">{item.invoiceNumber}</span>
                          )}
                        </div>

                        <button
                          onClick={() => handleDeleteMaintenance(item.id)}
                          className="text-slate-400 hover:text-blue-300 text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Excluir</span>
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 4: SCHEDULE OF UPCOMING REVISIONS */}
          {/* ========================================================= */}
          {activeTab === 'schedule' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-blue-400" />
                    Agenda Personalizável de Próximas Revisões
                  </h2>
                  <p className="text-xs text-slate-400">
                    Programe revisões futuras por quilometragem ou data e receba alertas proativos
                  </p>
                </div>

                <button
                  onClick={() => setIsSchedModalOpen(true)}
                  className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 transition-all cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Agendar Manutenção</span>
                </button>
              </div>

              {/* Status Banner */}
              <div className="p-4 rounded-xl bg-blue-950/30 border border-blue-700/40 flex items-center gap-3">
                <Info className="w-5 h-5 text-blue-400 shrink-0" />
                <div className="text-xs text-slate-300">
                  Odômetro atual de referência:{' '}
                  <strong className="text-white font-mono">{formatKm(vehicle.currentMileage)}</strong>. O
                  sistema calcula automaticamente a distância restante para cada manutenção programada.
                </div>
              </div>

              {/* Scheduled Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {scheduledServices.map((sched) => {
                  const kmLeft = sched.targetMileage
                    ? sched.targetMileage - vehicle.currentMileage
                    : null;
                  const isClose = kmLeft !== null && kmLeft <= 1500;

                  return (
                    <div
                      key={sched.id}
                      className={`p-5 rounded-2xl border transition-all flex flex-col justify-between ${
                        sched.isCompleted
                          ? 'bg-[#0b1226]/60 border-blue-950 opacity-60'
                          : isClose
                          ? 'bg-blue-900/20 border-blue-500/60 shadow-lg shadow-blue-950/40'
                          : 'bg-[#0f1936] border-blue-900/40'
                      }`}
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-xs">
                          <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-blue-600/20 text-blue-300 border border-blue-500/30">
                            {sched.category}
                          </span>
                          <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-950 text-blue-400 border border-blue-800/40">
                            Prioridade: {sched.priority}
                          </span>
                        </div>

                        <h3 className="font-bold text-white text-base leading-snug">
                          {sched.title}
                        </h3>

                        <div className="space-y-1.5 text-xs text-slate-300 pt-1">
                          {sched.targetMileage && (
                            <div className="flex items-center justify-between">
                              <span className="text-slate-400">Quilometragem Alvo:</span>
                              <span className="font-mono font-bold text-blue-300">
                                {formatKm(sched.targetMileage)}
                              </span>
                            </div>
                          )}

                          {kmLeft !== null && (
                            <div className="flex items-center justify-between">
                              <span className="text-slate-400">Distância Restante:</span>
                              <span
                                className={`font-mono font-bold ${
                                  kmLeft <= 0
                                    ? 'text-blue-300 font-extrabold animate-pulse'
                                    : isClose
                                    ? 'text-blue-400'
                                    : 'text-slate-200'
                                }`}
                              >
                                {kmLeft <= 0 ? 'Vencida!' : `${kmLeft} km`}
                              </span>
                            </div>
                          )}

                          {sched.targetDate && (
                            <div className="flex items-center justify-between">
                              <span className="text-slate-400">Data Limite:</span>
                              <span>{formatDateBR(sched.targetDate)}</span>
                            </div>
                          )}

                          {sched.estimatedCost && (
                            <div className="flex items-center justify-between">
                              <span className="text-slate-400">Custo Estimado:</span>
                              <span className="font-mono text-white">
                                {formatCurrency(sched.estimatedCost)}
                              </span>
                            </div>
                          )}
                        </div>

                        {sched.notes && (
                          <p className="text-xs text-slate-400 bg-[#121c3b] p-2.5 rounded-lg border border-blue-900/30 italic">
                            "{sched.notes}"
                          </p>
                        )}
                      </div>

                      <div className="pt-4 mt-4 border-t border-blue-900/30 flex items-center justify-between gap-2">
                        <button
                          onClick={() => handleToggleScheduledCompleted(sched.id)}
                          className={`text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                            sched.isCompleted
                              ? 'text-slate-400 hover:text-white'
                              : 'text-blue-400 hover:text-blue-300'
                          }`}
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          <span>{sched.isCompleted ? 'Concluída' : 'Concluir'}</span>
                        </button>

                        <div className="flex items-center gap-2">
                          {!sched.isCompleted && (
                            <button
                              onClick={() => handleConvertScheduledToMaintenance(sched)}
                              className="px-2.5 py-1 rounded bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition-all cursor-pointer"
                            >
                              Registrar O.S.
                            </button>
                          )}
                          <button
                            onClick={() => handleDeleteScheduled(sched.id)}
                            className="p-1 text-slate-400 hover:text-blue-300 transition-colors"
                            title="Excluir"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 5: UPGRADES, MODIFICATIONS & ACCESSORIES */}
          {/* ========================================================= */}
          {activeTab === 'upgrades' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <Sliders className="w-5 h-5 text-blue-400" />
                    Registro de Modificações & Upgrades (Tuning)
                  </h2>
                  <p className="text-xs text-slate-400">
                    Acessórios, customizações, películas térmicas, som, remap e termos de garantia
                  </p>
                </div>

                <button
                  onClick={() => setIsModModalOpen(true)}
                  className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 transition-all cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Novo Upgrade</span>
                </button>
              </div>

              {/* Total invested in upgrades */}
              <div className="p-5 rounded-2xl bg-gradient-to-r from-[#101c3d] to-[#0f1936] border border-blue-800/40 flex items-center justify-between flex-wrap gap-4">
                <div>
                  <span className="text-xs text-blue-400 font-semibold uppercase tracking-wider">
                    Investimento Total em Customizações
                  </span>
                  <div className="text-2xl font-extrabold text-white mt-0.5">
                    {formatCurrency(modStats.totalInvested)}
                  </div>
                  <span className="text-xs text-slate-400 mt-1 block">
                    {modifications.length} modificações catalogadas com comprovantes
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="p-3 rounded-xl bg-blue-600/20 text-blue-400">
                    <Sparkles className="w-6 h-6" />
                  </div>
                </div>
              </div>

              {/* Upgrades List */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {modifications.length === 0 ? (
                  <div className="col-span-full p-12 text-center rounded-2xl bg-[#0f1936] border border-blue-900/40 text-slate-400">
                    <Sliders className="w-12 h-12 text-blue-500/30 mx-auto mb-3" />
                    <p className="text-sm font-semibold text-white">Nenhum upgrade registrado ainda.</p>
                    <p className="text-xs text-slate-400 mt-1">
                      Adicione películas, acessórios multimídia, rodas, iluminação ou filtros esportivos.
                    </p>
                  </div>
                ) : (
                  modifications.map((item) => (
                    <div
                      key={item.id}
                      className="p-5 rounded-2xl bg-[#0f1936] border border-blue-900/40 hover:border-blue-700/60 transition-all space-y-3"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-blue-600/20 text-blue-300 border border-blue-500/30">
                              {item.category}
                            </span>
                            <span className="text-xs text-slate-400">{formatDateBR(item.date)}</span>
                          </div>
                          <h3 className="text-base font-bold text-white mt-1.5">{item.title}</h3>
                          <div className="text-xs text-blue-300 font-medium">
                            Fabricante: {item.brand} • Instalador: {item.workshop}
                          </div>
                        </div>

                        <div className="text-right">
                          <span className="text-sm font-extrabold text-white font-mono block">
                            {formatCurrency(item.cost)}
                          </span>
                        </div>
                      </div>

                      <p className="text-xs text-slate-300 bg-[#121c3b] p-3 rounded-xl border border-blue-900/30 leading-relaxed">
                        {item.description}
                      </p>

                      <div className="flex items-center justify-between pt-2 text-xs border-t border-blue-900/30">
                        <div className="flex items-center gap-1.5 text-blue-400 font-semibold">
                          <ShieldCheck className="w-4 h-4" />
                          <span>Termos de Garantia: {item.warrantyTerms}</span>
                        </div>
                        <button
                          onClick={() => handleDeleteMod(item.id)}
                          className="text-slate-400 hover:text-blue-300 p-1 transition-colors"
                          title="Excluir"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 6: AI AGENT & VEHICLE CONSULTATION API */}
          {/* ========================================================= */}
          {/* ========================================================= */}
          {/* TAB 6: TECHNICAL CONSULTATION & INTELLIGENT KNOWLEDGE BASE */}
          {/* ========================================================= */}
          {activeTab === 'ai_assistant' && (
            <div className="space-y-6">
              {/* Header */}
              <div className="p-6 rounded-2xl bg-gradient-to-br from-[#101c3d] via-[#0d162f] to-[#0a1124] border border-blue-700/50 relative overflow-hidden">
                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-600/20 border border-blue-500/30 text-blue-300 text-xs font-semibold mb-2">
                      <Bot className="w-3.5 h-3.5" />
                      <span>Assistente IA / Consulta Técnica Veicular</span>
                    </div>
                    <h2 className="text-2xl font-extrabold text-white tracking-tight">
                      Consulta Técnica por Modelo e Motorização
                    </h2>
                    <p className="text-xs text-slate-300 mt-1 max-w-xl">
                      Base interna inteligente integrada. Consulte instantaneamente especificações de fluidos recomendados, viscosidade de óleo, calibragem de pneus e peças compatíveis sem necessidade de chaves de API externas.
                    </p>
                  </div>

                  {/* Button to fill from active garage car */}
                  <button
                    onClick={handleUseGarageCar}
                    className="px-3.5 py-2 rounded-xl bg-blue-600/20 hover:bg-blue-600 text-blue-300 hover:text-white border border-blue-600/40 text-xs font-semibold flex items-center gap-2 transition-all self-start md:self-auto cursor-pointer"
                    title="Preencher com os dados do veículo atualmente ativo na Garagem"
                  >
                    <Car className="w-4 h-4 text-blue-400" />
                    <span>Usar Meu Carro da Garagem</span>
                  </button>
                </div>

                {/* Popular Models Quick Select */}
                <div className="mt-5 pt-4 border-t border-blue-900/40">
                  <span className="text-[10px] text-blue-400 font-bold uppercase tracking-wider block mb-2">
                    Modelos Populares Pré-cadastrados (Acesso Imediato):
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { model: 'Chevrolet Onix', engine: '2022 1.0 Turbo Flex' },
                      { model: 'Toyota Corolla', engine: '2022 2.0 Dynamic Force Flex' },
                      { model: 'Honda Civic', engine: '2021 1.5 Turbo Touring' },
                      { model: 'Hyundai HB20', engine: '2023 1.0 TGDI Turbo' },
                      { model: 'Volkswagen Virtus', engine: '2023 1.0 200 TSI Flex' },
                      { model: 'Volkswagen Nivus', engine: '2023 1.0 200 TSI Flex' },
                      { model: 'Jeep Compass', engine: '2022 1.3 Turbo Flex T270' },
                      { model: 'Fiat Strada', engine: '2023 1.3 Firefly Flex' },
                      { model: 'Renault Kwid', engine: '2022 1.0 12V SCe Flex' },
                    ].map((item) => (
                      <button
                        key={item.model}
                        onClick={() => handleQuickSelectModel(item.model, item.engine)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                          modelQueryInput.toLowerCase().includes(item.model.split(' ')[1].toLowerCase())
                            ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                            : 'bg-[#14234c] hover:bg-blue-600/30 text-blue-300 hover:text-white border border-blue-800/60'
                        }`}
                      >
                        {item.model}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Simple Text Fields Form */}
              <div className="p-5 sm:p-6 rounded-2xl bg-[#0f1936] border border-blue-900/40 shadow-lg">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleConsultTechnicalData();
                  }}
                  className="space-y-4"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Campo 1: Modelo do Carro */}
                    <div>
                      <label className="text-slate-300 font-semibold text-xs block mb-1.5">
                        Modelo do Carro
                      </label>
                      <div className="relative">
                        <Car className="w-4 h-4 text-blue-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          required
                          placeholder="Ex: Chevrolet Onix, Toyota Corolla, Honda Civic..."
                          value={modelQueryInput}
                          onChange={(e) => setModelQueryInput(e.target.value)}
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#121c3b] border border-blue-900/60 text-white placeholder-slate-400 text-sm focus:outline-none focus:border-blue-500 shadow-inner"
                        />
                      </div>
                    </div>

                    {/* Campo 2: Ano / Motorização */}
                    <div>
                      <label className="text-slate-300 font-semibold text-xs block mb-1.5">
                        Ano / Motorização
                      </label>
                      <div className="relative">
                        <Gauge className="w-4 h-4 text-blue-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          required
                          placeholder="Ex: 2022 1.0 Turbo Flex, 2021 2.0 Flex, 2019 1.6..."
                          value={yearEngineQueryInput}
                          onChange={(e) => setYearEngineQueryInput(e.target.value)}
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#121c3b] border border-blue-900/60 text-white placeholder-slate-400 text-sm focus:outline-none focus:border-blue-500 shadow-inner"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
                    <span className="text-xs text-slate-400">
                      Digite qualquer modelo para consulta instantânea via base homologada ou gerador técnico inteligente.
                    </span>

                    <button
                      type="submit"
                      className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 transition-all cursor-pointer shrink-0"
                    >
                      <Bot className="w-4 h-4" />
                      <span>Consultar Ficha Técnica</span>
                    </button>
                  </div>
                </form>
              </div>

              {/* Consultation Result Display */}
              {technicalQueryResult && (
                <div className="space-y-6">
                  {/* Vehicle Identity Header */}
                  <div className="p-5 sm:p-6 rounded-2xl bg-[#0f1936] border border-blue-900/40 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                        <span
                          className={`px-2.5 py-0.5 rounded text-xs font-semibold ${
                            isOfficialHomologated
                              ? 'bg-blue-600 text-white font-bold'
                              : 'bg-blue-950 text-blue-300 border border-blue-700/60'
                          }`}
                        >
                          {isOfficialHomologated
                            ? 'Base Técnica Oficial Homologada (Dados Reais)'
                            : 'Especificação Inteligente de Referência Técnica'}
                        </span>
                        <span className="text-xs text-slate-400 font-mono">
                          {technicalQueryResult.brand}
                        </span>
                      </div>
                      <h3 className="text-xl font-extrabold text-white">
                        {technicalQueryResult.model} ({technicalQueryResult.yearModel})
                      </h3>
                      <p className="text-xs text-slate-300 mt-1">{technicalQueryResult.engine}</p>
                    </div>

                    <button
                      onClick={() => handleApplyAiVehicleToGarage(technicalQueryResult)}
                      className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-2 transition-all shadow-md self-start md:self-auto cursor-pointer"
                    >
                      <Check className="w-4 h-4" />
                      <span>Aplicar este Veículo na Minha Garagem</span>
                    </button>
                  </div>

                  {/* Engine Specs & Factory Recommendations */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Oil Spec */}
                    <div className="p-4 rounded-xl bg-[#0f1936] border border-blue-900/40 space-y-2">
                      <div className="flex items-center gap-2 text-blue-400 text-xs font-bold uppercase tracking-wider">
                        <Droplet className="w-4 h-4" />
                        <span>Óleo do Motor Recomendado</span>
                      </div>
                      <div className="text-lg font-extrabold text-white font-mono">
                        {technicalQueryResult.recommendedOil.viscosity}
                      </div>
                      <div className="text-xs text-slate-300 font-medium">
                        {technicalQueryResult.recommendedOil.spec}
                      </div>
                      <div className="text-[11px] text-blue-400 pt-1 border-t border-blue-900/30">
                        Capacidade: <strong>{technicalQueryResult.recommendedOil.capacityWithFilter}</strong> • {technicalQueryResult.recommendedOil.changeInterval}
                      </div>
                    </div>

                    {/* Coolant */}
                    <div className="p-4 rounded-xl bg-[#0f1936] border border-blue-900/40 space-y-2">
                      <div className="flex items-center gap-2 text-blue-400 text-xs font-bold uppercase tracking-wider">
                        <Zap className="w-4 h-4" />
                        <span>Fluido de Arrefecimento</span>
                      </div>
                      <div className="text-sm font-extrabold text-white">
                        {technicalQueryResult.coolant.type}
                      </div>
                      <div className="text-xs text-slate-300">
                        Proporção: {technicalQueryResult.coolant.ratio}
                      </div>
                      <div className="text-[11px] text-blue-400 pt-1 border-t border-blue-900/30">
                        Troca: {technicalQueryResult.coolant.interval}
                      </div>
                    </div>

                    {/* Brake Fluid */}
                    <div className="p-4 rounded-xl bg-[#0f1936] border border-blue-900/40 space-y-2">
                      <div className="flex items-center gap-2 text-blue-400 text-xs font-bold uppercase tracking-wider">
                        <Disc className="w-4 h-4" />
                        <span>Fluido de Freio</span>
                      </div>
                      <div className="text-lg font-extrabold text-white font-mono">
                        {technicalQueryResult.brakeFluid.type}
                      </div>
                      <div className="text-xs text-slate-300">
                        Intervalo: {technicalQueryResult.brakeFluid.interval}
                      </div>
                      <div className="text-[11px] text-blue-400 pt-1 border-t border-blue-900/30">
                        Sistemas ABS / EBD / ESP
                      </div>
                    </div>

                    {/* Tire Pressure */}
                    <div className="p-4 rounded-xl bg-[#0f1936] border border-blue-900/40 space-y-2">
                      <div className="flex items-center gap-2 text-blue-400 text-xs font-bold uppercase tracking-wider">
                        <Gauge className="w-4 h-4" />
                        <span>Calibragem dos Pneus (PSI)</span>
                      </div>
                      <div className="flex items-center justify-between text-xs text-white pt-1">
                        <span>Diant / Tras Normal:</span>
                        <strong className="font-mono text-blue-300">
                          {technicalQueryResult.tirePressure.frontPsi} / {technicalQueryResult.tirePressure.rearPsi} PSI
                        </strong>
                      </div>
                      <div className="flex items-center justify-between text-xs text-white">
                        <span>Com Carga Máxima:</span>
                        <strong className="font-mono text-blue-300">
                          {technicalQueryResult.tirePressure.loadedFrontPsi} / {technicalQueryResult.tirePressure.loadedRearPsi} PSI
                        </strong>
                      </div>
                      <div className="text-[11px] text-slate-400 pt-1 border-t border-blue-900/30 truncate">
                        Medida recomendada: {technicalQueryResult.tirePressure.tireSize}
                      </div>
                    </div>
                  </div>

                  {/* OEM Compatible Parts Table */}
                  <div className="rounded-2xl bg-[#0f1936] border border-blue-900/40 overflow-hidden shadow-lg">
                    <div className="p-4 border-b border-blue-900/40 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Wrench className="w-4 h-4 text-blue-400" />
                        <h4 className="text-sm font-bold text-white">
                          Peças Originais Compatíveis & Códigos de Referência
                        </h4>
                      </div>
                      <span className="text-xs text-blue-400 font-semibold">
                        Garantia de Compatibilidade Mecânica
                      </span>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse text-sm">
                        <thead>
                          <tr className="border-b border-blue-950 bg-[#121c3b]/60 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                            <th className="py-3 px-4">Componente</th>
                            <th className="py-3 px-4">Descrição da Peça</th>
                            <th className="py-3 px-4">Código OEM Oficial</th>
                            <th className="py-3 px-4">Fabricante Recomendado</th>
                            <th className="py-3 px-4">Intervalo Sugerido</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-blue-950/60">
                          {technicalQueryResult.oemParts.map((part, idx) => (
                            <tr key={idx} className="hover:bg-[#121c3b]/40 transition-colors">
                              <td className="py-3.5 px-4 font-semibold text-blue-300 text-xs">
                                {part.category}
                              </td>
                              <td className="py-3.5 px-4 font-bold text-white">{part.name}</td>
                              <td className="py-3.5 px-4 font-mono text-xs text-blue-400 font-semibold">
                                {part.code}
                              </td>
                              <td className="py-3.5 px-4 text-slate-300 text-xs">{part.brand}</td>
                              <td className="py-3.5 px-4 text-slate-200 text-xs font-mono">
                                {part.recommendedChange}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Preventive Tips from Knowledge Base */}
                  <div className="p-5 rounded-2xl bg-[#0f1936] border border-blue-900/40 space-y-3">
                    <div className="flex items-center gap-2 text-sm font-bold text-white">
                      <ShieldCheck className="w-4 h-4 text-blue-400" />
                      <span>Dicas Preventivas Especializadas para este Motor</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {technicalQueryResult.preventiveTips.map((tip, idx) => (
                        <div
                          key={idx}
                          className="p-3.5 rounded-xl bg-[#121c3b] border border-blue-900/30 flex items-start gap-2.5"
                        >
                          <span className="w-5 h-5 rounded-full bg-blue-600/30 text-blue-400 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                            {idx + 1}
                          </span>
                          <p className="text-xs text-slate-200 leading-relaxed">{tip}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Interactive AI Mechanic Chat Box */}
              <div className="rounded-2xl bg-[#0f1936] border border-blue-900/40 overflow-hidden shadow-xl flex flex-col h-[460px]">
                <div className="p-4 border-b border-blue-900/40 bg-[#101b38] flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center text-white">
                      <Bot className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">
                        Assistente Mecânico Mão na Roda
                      </h4>
                      <p className="text-[11px] text-blue-400">
                        Tire dúvidas sobre barulhos, sintomas, troca de correia, óleo e revisões
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-600/20 text-blue-300 border border-blue-500/30 font-mono">
                    Online
                  </span>
                </div>

                {/* Message flow */}
                <div className="flex-1 p-4 overflow-y-auto space-y-3">
                  {aiChatMessages.map((msg, idx) => (
                    <div
                      key={idx}
                      className={`flex flex-col ${
                        msg.sender === 'user' ? 'items-end' : 'items-start'
                      }`}
                    >
                      <div
                        className={`max-w-[85%] sm:max-w-[75%] p-3.5 rounded-2xl text-xs leading-relaxed ${
                          msg.sender === 'user'
                            ? 'bg-blue-600 text-white rounded-br-xs shadow-md shadow-blue-600/20'
                            : 'bg-[#121c3b] text-slate-200 rounded-bl-xs border border-blue-900/40'
                        }`}
                      >
                        {msg.text}
                      </div>
                      <span className="text-[10px] text-slate-400 mt-1 px-1">{msg.time}</span>
                    </div>
                  ))}

                  {isAiReplying && (
                    <div className="flex items-center gap-2 text-xs text-blue-400 p-2">
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>O assistente mecânico está formulando a resposta técnica...</span>
                    </div>
                  )}
                </div>

                {/* Chat input */}
                <form
                  onSubmit={handleSendAiChatMessage}
                  className="p-3 border-t border-blue-900/40 bg-[#0d162f] flex items-center gap-2"
                >
                  <input
                    type="text"
                    placeholder="Ex: 'Meu carro está fazendo um barulho agudo no freio ao parar'..."
                    value={userChatInput}
                    onChange={(e) => setUserChatInput(e.target.value)}
                    className="flex-1 px-4 py-2.5 rounded-xl bg-[#121c3b] border border-blue-900/60 text-white placeholder-slate-400 text-xs focus:outline-none focus:border-blue-500"
                  />
                  <button
                    type="submit"
                    disabled={isAiReplying || !userChatInput.trim()}
                    className="p-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white transition-all cursor-pointer"
                    title="Enviar dúvida"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 7: REPORT DOSSIER & BACKUP */}
          {/* ========================================================= */}
          {activeTab === 'report' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <FileText className="w-5 h-5 text-blue-400" />
                    Dossiê de Procedência & Backup Local
                  </h2>
                  <p className="text-xs text-slate-400">
                    Gere o relatório completo de histórico para valorizar seu carro na hora da venda
                  </p>
                </div>

                <div className="flex items-center gap-2.5">
                  <button
                    onClick={() => window.print()}
                    className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-2 transition-all cursor-pointer"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Imprimir / Salvar PDF</span>
                  </button>
                  <button
                    onClick={handleExportData}
                    className="px-3.5 py-2 rounded-xl bg-[#14234c] hover:bg-blue-600/30 text-blue-300 hover:text-white border border-blue-700/40 text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Exportar Backup (JSON)</span>
                  </button>
                </div>
              </div>

              {/* Printable Car Dossier Container */}
              <div className="p-6 sm:p-8 rounded-2xl bg-[#0f1936] border border-blue-900/40 space-y-6 shadow-xl print:bg-white print:text-black print:border-none">
                {/* Dossier Header */}
                <div className="flex items-center justify-between pb-6 border-b border-blue-900/40">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center text-white font-black text-xl shadow-md">
                      MNR
                    </div>
                    <div>
                      <h3 className="text-xl font-extrabold text-white">
                        Dossiê Automotivo Certificado Mão na Roda
                      </h3>
                      <p className="text-xs text-blue-400 font-medium">
                        Histórico completo de procedência, revisões, abastecimentos e customizações
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-xs text-slate-400 block">Emitido em</span>
                    <span className="text-sm font-bold text-white">
                      {new Date().toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                </div>

                {/* Car details row */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-[#121c3b] border border-blue-900/30 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase">Veículo</span>
                    <span className="font-bold text-white text-sm">{vehicle.model}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase">Placa / Ano</span>
                    <span className="font-bold text-blue-300 text-sm font-mono">
                      {vehicle.plate} • {vehicle.year}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase">Quilometragem</span>
                    <span className="font-bold text-white text-sm font-mono">
                      {formatKm(vehicle.currentMileage)}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase">Chassi</span>
                    <span className="font-mono text-slate-300 text-xs">{vehicle.chassis || 'Não informado'}</span>
                  </div>
                </div>

                {/* Summary numbers */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 rounded-xl bg-[#121c3b] border border-blue-900/30">
                    <span className="text-xs text-slate-400">Total Investido em Revisões</span>
                    <div className="text-xl font-extrabold text-white mt-1">
                      {formatCurrency(maintStats.totalSpent)}
                    </div>
                    <span className="text-[11px] text-blue-400 mt-1 block">
                      {maintenances.length} serviços comprovados com O.S.
                    </span>
                  </div>

                  <div className="p-4 rounded-xl bg-[#121c3b] border border-blue-900/30">
                    <span className="text-xs text-slate-400">Consumo Médio Histórico</span>
                    <div className="text-xl font-extrabold text-white font-mono mt-1">
                      {fuelStats.averageKmL} km/L
                    </div>
                    <span className="text-[11px] text-slate-400 mt-1 block">
                      {fuelLogs.length} registros de postos
                    </span>
                  </div>

                  <div className="p-4 rounded-xl bg-[#121c3b] border border-blue-900/30">
                    <span className="text-xs text-slate-400">Customizações & Acessórios</span>
                    <div className="text-xl font-extrabold text-white mt-1">
                      {formatCurrency(modStats.totalInvested)}
                    </div>
                    <span className="text-[11px] text-blue-400 mt-1 block">
                      {modifications.length} upgrades instalados
                    </span>
                  </div>
                </div>

                {/* Maintenance Timeline list */}
                <div className="space-y-3">
                  <h4 className="text-sm font-bold text-white uppercase tracking-wider text-blue-400">
                    Cronograma de Manutenções & Revisões Realizadas
                  </h4>

                  <div className="space-y-2.5">
                    {maintenances.map((m) => (
                      <div
                        key={m.id}
                        className="p-3.5 rounded-xl bg-[#121c3b] border border-blue-900/30 flex items-center justify-between text-xs"
                      >
                        <div>
                          <div className="font-bold text-white text-sm">{m.services}</div>
                          <div className="text-slate-400 mt-0.5">
                            {formatDateBR(m.date)} • {formatKm(m.mileage)} • {m.workshop} • {m.invoiceNumber}
                          </div>
                        </div>
                        <div className="font-mono font-bold text-white text-sm">
                          {formatCurrency(m.totalCost)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Seal / Certification */}
                <div className="p-4 rounded-xl bg-blue-950/40 border border-blue-700/40 flex items-center justify-between text-xs text-slate-300">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-blue-400" />
                    <span>
                      Dossiê gerado com tecnologia Mão na Roda. O valor do carro com histórico é em média
                      15% superior no mercado.
                    </span>
                  </div>
                  <div className="font-mono text-blue-400 font-bold">#MNR-VERIFIED</div>
                </div>
              </div>

              {/* Data Import Card */}
              <div className="p-5 rounded-2xl bg-[#0f1936] border border-blue-900/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h4 className="text-sm font-bold text-white">Restaurar Dados de Backup</h4>
                  <p className="text-xs text-slate-400">
                    Envie um arquivo JSON exportado anteriormente para restaurar todas as manutenções e abastecimentos.
                  </p>
                </div>

                <label className="px-4 py-2 rounded-xl bg-[#14234c] hover:bg-blue-600 text-blue-300 hover:text-white border border-blue-700/40 text-xs font-semibold flex items-center gap-2 cursor-pointer transition-all self-start sm:self-auto">
                  <Upload className="w-4 h-4" />
                  <span>Importar Arquivo JSON</span>
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleImportData}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* ========================================================= */}
      {/* MODAL 1: EDIT VEHICLE PROFILE */}
      {/* ========================================================= */}
      {isEditVehicleModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
          <div className="bg-[#0f1936] border border-blue-800/60 rounded-2xl max-w-lg w-full p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-blue-900/40">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Car className="w-5 h-5 text-blue-400" />
                Dados do Veículo (Garagem)
              </h3>
              <button
                onClick={() => setIsEditVehicleModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveVehicleProfile} className="space-y-4 mt-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Montadora / Marca</label>
                  <input
                    type="text"
                    required
                    value={vehicleForm.brand}
                    onChange={(e) => setVehicleForm({ ...vehicleForm, brand: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-[#121c3b] border border-blue-900/60 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Modelo do Carro</label>
                  <input
                    type="text"
                    required
                    value={vehicleForm.model}
                    onChange={(e) => setVehicleForm({ ...vehicleForm, model: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-[#121c3b] border border-blue-900/60 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Ano / Modelo</label>
                  <input
                    type="text"
                    required
                    placeholder="2022/2023"
                    value={vehicleForm.year}
                    onChange={(e) => setVehicleForm({ ...vehicleForm, year: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-[#121c3b] border border-blue-900/60 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Placa</label>
                  <input
                    type="text"
                    required
                    placeholder="BRA-2E19"
                    value={vehicleForm.plate}
                    onChange={(e) => setVehicleForm({ ...vehicleForm, plate: e.target.value.toUpperCase() })}
                    className="w-full px-3 py-2 rounded-lg bg-[#121c3b] border border-blue-900/60 text-white font-mono focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Quilometragem Atual (Km)</label>
                  <input
                    type="number"
                    required
                    value={vehicleForm.currentMileage}
                    onChange={(e) =>
                      setVehicleForm({
                        ...vehicleForm,
                        currentMileage: parseInt(e.target.value, 10) || 0,
                      })
                    }
                    className="w-full px-3 py-2 rounded-lg bg-[#121c3b] border border-blue-900/60 text-white font-mono focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Data de Aquisição</label>
                  <input
                    type="date"
                    required
                    value={vehicleForm.acquisitionDate}
                    onChange={(e) =>
                      setVehicleForm({ ...vehicleForm, acquisitionDate: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-lg bg-[#121c3b] border border-blue-900/60 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">Versão & Motorização</label>
                <input
                  type="text"
                  placeholder="Ex: 1.5 Turbo 16V Flex Automático"
                  value={vehicleForm.version}
                  onChange={(e) => setVehicleForm({ ...vehicleForm, version: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-[#121c3b] border border-blue-900/60 text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Cor</label>
                  <input
                    type="text"
                    value={vehicleForm.color}
                    onChange={(e) => setVehicleForm({ ...vehicleForm, color: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-[#121c3b] border border-blue-900/60 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Combustível</label>
                  <select
                    value={vehicleForm.fuelType}
                    onChange={(e) =>
                      setVehicleForm({
                        ...vehicleForm,
                        fuelType: e.target.value as VehicleProfile['fuelType'],
                      })
                    }
                    className="w-full px-3 py-2 rounded-lg bg-[#121c3b] border border-blue-900/60 text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="Gasolina">Gasolina</option>
                    <option value="Flex">Flex</option>
                    <option value="Etanol">Etanol</option>
                    <option value="Diesel">Diesel</option>
                    <option value="Híbrido">Híbrido</option>
                    <option value="Elétrico">Elétrico</option>
                  </select>
                </div>
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Tanque (Litros)</label>
                  <input
                    type="number"
                    value={vehicleForm.tankCapacity}
                    onChange={(e) =>
                      setVehicleForm({
                        ...vehicleForm,
                        tankCapacity: parseInt(e.target.value, 10) || 50,
                      })
                    }
                    className="w-full px-3 py-2 rounded-lg bg-[#121c3b] border border-blue-900/60 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-blue-900/40 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsEditVehicleModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-[#121c3b] hover:bg-slate-800 text-slate-300 text-xs font-semibold cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md shadow-blue-600/30 cursor-pointer"
                >
                  Salvar Veículo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 2: REGISTER FUEL LOG */}
      {/* ========================================================= */}
      {isFuelModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
          <div className="bg-[#0f1936] border border-blue-800/60 rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-blue-900/40">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Fuel className="w-4 h-4 text-blue-400" />
                Registrar Abastecimento
              </h3>
              <button onClick={() => setIsFuelModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddFuel} className="space-y-3.5 mt-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Data</label>
                  <input
                    type="date"
                    required
                    value={newFuel.date}
                    onChange={(e) => setNewFuel({ ...newFuel, date: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-[#121c3b] border border-blue-900/60 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Posto / Bandeira</label>
                  <input
                    type="text"
                    required
                    placeholder="Shell, Ipiranga, BR..."
                    value={newFuel.gasStation}
                    onChange={(e) => setNewFuel({ ...newFuel, gasStation: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-[#121c3b] border border-blue-900/60 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Combustível</label>
                  <select
                    value={newFuel.fuelType}
                    onChange={(e) =>
                      setNewFuel({
                        ...newFuel,
                        fuelType: e.target.value as FuelLog['fuelType'],
                      })
                    }
                    className="w-full px-3 py-2 rounded-lg bg-[#121c3b] border border-blue-900/60 text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="Gasolina Comum">Gasolina Comum</option>
                    <option value="Gasolina Aditivada">Gasolina Aditivada</option>
                    <option value="Etanol">Etanol</option>
                    <option value="Diesel S10">Diesel S10</option>
                    <option value="GNV">GNV</option>
                  </select>
                </div>
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Odômetro no Momento (Km)</label>
                  <input
                    type="number"
                    required
                    value={newFuel.mileage}
                    onChange={(e) => setNewFuel({ ...newFuel, mileage: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-[#121c3b] border border-blue-900/60 text-white font-mono focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Valor Total Pago (R$)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    placeholder="250.00"
                    value={newFuel.totalPrice}
                    onChange={(e) => setNewFuel({ ...newFuel, totalPrice: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-[#121c3b] border border-blue-900/60 text-white font-mono focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Quantidade de Litros</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    placeholder="42.50"
                    value={newFuel.liters}
                    onChange={(e) => setNewFuel({ ...newFuel, liters: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-[#121c3b] border border-blue-900/60 text-white font-mono focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">Autonomia Marcada no Painel (Km Projetada)</label>
                <input
                  type="number"
                  placeholder="Ex: 580"
                  value={newFuel.projectedRange}
                  onChange={(e) => setNewFuel({ ...newFuel, projectedRange: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-[#121c3b] border border-blue-900/60 text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="fullTank"
                  checked={newFuel.isFullTank}
                  onChange={(e) => setNewFuel({ ...newFuel, isFullTank: e.target.checked })}
                  className="rounded border-blue-800 text-blue-600 focus:ring-0 bg-[#121c3b]"
                />
                <label htmlFor="fullTank" className="text-slate-300 text-xs cursor-pointer">
                  Tanque Cheio (Permite cálculo preciso de Km/L)
                </label>
              </div>

              <div className="pt-3 border-t border-blue-900/40 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsFuelModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-[#121c3b] text-slate-300 hover:text-white text-xs font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md shadow-blue-600/30"
                >
                  Registrar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 3: REGISTER MAINTENANCE */}
      {/* ========================================================= */}
      {isMaintModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
          <div className="bg-[#0f1936] border border-blue-800/60 rounded-2xl max-w-lg w-full p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-blue-900/40">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Wrench className="w-4 h-4 text-blue-400" />
                Registrar Revisão ou Manutenção
              </h3>
              <button onClick={() => setIsMaintModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddMaintenance} className="space-y-3.5 mt-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Data</label>
                  <input
                    type="date"
                    required
                    value={newMaint.date}
                    onChange={(e) => setNewMaint({ ...newMaint, date: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-[#121c3b] border border-blue-900/60 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Quilometragem (Km)</label>
                  <input
                    type="number"
                    required
                    value={newMaint.mileage}
                    onChange={(e) => setNewMaint({ ...newMaint, mileage: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-[#121c3b] border border-blue-900/60 text-white font-mono focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Nome da Oficina / Mecânica</label>
                  <input
                    type="text"
                    required
                    placeholder="Concessionária ou Oficina"
                    value={newMaint.workshop}
                    onChange={(e) => setNewMaint({ ...newMaint, workshop: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-[#121c3b] border border-blue-900/60 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Categoria</label>
                  <select
                    value={newMaint.category}
                    onChange={(e) =>
                      setNewMaint({
                        ...newMaint,
                        category: e.target.value as MaintenanceLog['category'],
                      })
                    }
                    className="w-full px-3 py-2 rounded-lg bg-[#121c3b] border border-blue-900/60 text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="Preventiva">Preventiva</option>
                    <option value="Troca de Óleo e Filtros">Troca de Óleo e Filtros</option>
                    <option value="Freios e Pneus">Freios e Pneus</option>
                    <option value="Suspensão">Suspensão</option>
                    <option value="Elétrica e Bateria">Elétrica e Bateria</option>
                    <option value="Ar Condicionado">Ar Condicionado</option>
                    <option value="Corretiva">Corretiva</option>
                    <option value="Outros">Outros</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">Serviços Realizados</label>
                <textarea
                  rows={2}
                  required
                  placeholder="Descrição minuciosa do trabalho executado..."
                  value={newMaint.services}
                  onChange={(e) => setNewMaint({ ...newMaint, services: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-[#121c3b] border border-blue-900/60 text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">Peças Trocadas (com especificações)</label>
                <textarea
                  rows={2}
                  placeholder="Ex: Filtro de óleo Honda, 4L Óleo 0W-20, Jogo de pastilhas dianteiras..."
                  value={newMaint.partsReplaced}
                  onChange={(e) => setNewMaint({ ...newMaint, partsReplaced: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-[#121c3b] border border-blue-900/60 text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Valor das Peças (R$)</label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={newMaint.partsCost}
                    onChange={(e) => setNewMaint({ ...newMaint, partsCost: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-[#121c3b] border border-blue-900/60 text-white font-mono focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Mão de Obra (R$)</label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={newMaint.laborCost}
                    onChange={(e) => setNewMaint({ ...newMaint, laborCost: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-[#121c3b] border border-blue-900/60 text-white font-mono focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Número NF-e / Ordem de Serviço</label>
                  <input
                    type="text"
                    placeholder="NF-e 004812"
                    value={newMaint.invoiceNumber}
                    onChange={(e) => setNewMaint({ ...newMaint, invoiceNumber: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-[#121c3b] border border-blue-900/60 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Garantia Oferecida</label>
                  <input
                    type="text"
                    placeholder="90 dias ou 5.000 km"
                    value={newMaint.warrantyPeriod}
                    onChange={(e) => setNewMaint({ ...newMaint, warrantyPeriod: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-[#121c3b] border border-blue-900/60 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-blue-900/40 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsMaintModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-[#121c3b] text-slate-300 hover:text-white text-xs font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md shadow-blue-600/30"
                >
                  Salvar Manutenção
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 4: SCHEDULE SERVICE */}
      {/* ========================================================= */}
      {isSchedModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
          <div className="bg-[#0f1936] border border-blue-800/60 rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-blue-900/40">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Calendar className="w-4 h-4 text-blue-400" />
                Agendar Próxima Manutenção
              </h3>
              <button onClick={() => setIsSchedModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddScheduled} className="space-y-3 mt-4 text-xs">
              <div>
                <label className="text-slate-300 font-semibold block mb-1">Título do Serviço</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Troca de Óleo 50.000 km, Troca de Correia..."
                  value={newSched.title}
                  onChange={(e) => setNewSched({ ...newSched, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-[#121c3b] border border-blue-900/60 text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Quilometragem Alvo</label>
                  <input
                    type="number"
                    value={newSched.targetMileage}
                    onChange={(e) => setNewSched({ ...newSched, targetMileage: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-[#121c3b] border border-blue-900/60 text-white font-mono focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Data Estimada</label>
                  <input
                    type="date"
                    value={newSched.targetDate}
                    onChange={(e) => setNewSched({ ...newSched, targetDate: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-[#121c3b] border border-blue-900/60 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Custo Estimado (R$)</label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="Ex: 650.00"
                    value={newSched.estimatedCost}
                    onChange={(e) => setNewSched({ ...newSched, estimatedCost: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-[#121c3b] border border-blue-900/60 text-white font-mono focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Prioridade</label>
                  <select
                    value={newSched.priority}
                    onChange={(e) =>
                      setNewSched({
                        ...newSched,
                        priority: e.target.value as ScheduledService['priority'],
                      })
                    }
                    className="w-full px-3 py-2 rounded-lg bg-[#121c3b] border border-blue-900/60 text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="Alta">Alta</option>
                    <option value="Média">Média</option>
                    <option value="Normal">Normal</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">Notas / Lembretes Adicionais</label>
                <textarea
                  rows={2}
                  placeholder="Itens a serem revisados no momento do serviço..."
                  value={newSched.notes}
                  onChange={(e) => setNewSched({ ...newSched, notes: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-[#121c3b] border border-blue-900/60 text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="pt-3 border-t border-blue-900/40 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsSchedModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-[#121c3b] text-slate-300 hover:text-white text-xs font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md shadow-blue-600/30"
                >
                  Salvar Agendamento
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 5: ADD MODIFICATION / UPGRADE */}
      {/* ========================================================= */}
      {isModModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
          <div className="bg-[#0f1936] border border-blue-800/60 rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-blue-900/40">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Sliders className="w-4 h-4 text-blue-400" />
                Registrar Upgrade ou Customização
              </h3>
              <button onClick={() => setIsModModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddModification} className="space-y-3.5 mt-4 text-xs">
              <div>
                <label className="text-slate-300 font-semibold block mb-1">Título da Modificação</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Película Nanocerâmica, Remap, Central Multimídia..."
                  value={newMod.title}
                  onChange={(e) => setNewMod({ ...newMod, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-[#121c3b] border border-blue-900/60 text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Categoria</label>
                  <select
                    value={newMod.category}
                    onChange={(e) =>
                      setNewMod({
                        ...newMod,
                        category: e.target.value as VehicleModification['category'],
                      })
                    }
                    className="w-full px-3 py-2 rounded-lg bg-[#121c3b] border border-blue-900/60 text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="Conforto & Interior">Conforto & Interior</option>
                    <option value="Estética & Visual">Estética & Visual</option>
                    <option value="Performance">Performance</option>
                    <option value="Som & Multimídia">Som & Multimídia</option>
                    <option value="Iluminação">Iluminação</option>
                    <option value="Suspensão & Rodas">Suspensão & Rodas</option>
                  </select>
                </div>
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Data da Instalação</label>
                  <input
                    type="date"
                    required
                    value={newMod.date}
                    onChange={(e) => setNewMod({ ...newMod, date: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-[#121c3b] border border-blue-900/60 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Marca / Modelo do Acessório</label>
                  <input
                    type="text"
                    placeholder="Ex: 3M Crystalline, K&N..."
                    value={newMod.brand}
                    onChange={(e) => setNewMod({ ...newMod, brand: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-[#121c3b] border border-blue-900/60 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Valor Investido (R$)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    placeholder="1200.00"
                    value={newMod.cost}
                    onChange={(e) => setNewMod({ ...newMod, cost: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-[#121c3b] border border-blue-900/60 text-white font-mono focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Loja / Instalador</label>
                  <input
                    type="text"
                    placeholder="Oficina ou instaladora"
                    value={newMod.workshop}
                    onChange={(e) => setNewMod({ ...newMod, workshop: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-[#121c3b] border border-blue-900/60 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Garantia / Termos</label>
                  <input
                    type="text"
                    placeholder="Ex: 5 anos de garantia"
                    value={newMod.warrantyTerms}
                    onChange={(e) => setNewMod({ ...newMod, warrantyTerms: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-[#121c3b] border border-blue-900/60 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">Detalhes & Especificações</label>
                <textarea
                  rows={2}
                  placeholder="Descreva o que foi alterado ou melhorado no carro..."
                  value={newMod.description}
                  onChange={(e) => setNewMod({ ...newMod, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-[#121c3b] border border-blue-900/60 text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="pt-3 border-t border-blue-900/40 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsModModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-[#121c3b] text-slate-300 hover:text-white text-xs font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md shadow-blue-600/30"
                >
                  Salvar Upgrade
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 6: ADD REMINDER */}
      {/* ========================================================= */}
      {isReminderModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
          <div className="bg-[#0f1936] border border-blue-800/60 rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-blue-900/40">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-400" />
                Adicionar Lembrete de Vencimento
              </h3>
              <button onClick={() => setIsReminderModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddReminder} className="space-y-3.5 mt-4 text-xs">
              <div>
                <label className="text-slate-300 font-semibold block mb-1">Título do Lembrete</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Licenciamento, IPVA, Renovação de Seguro..."
                  value={newReminder.title}
                  onChange={(e) => setNewReminder({ ...newReminder, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-[#121c3b] border border-blue-900/60 text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Categoria</label>
                  <select
                    value={newReminder.category}
                    onChange={(e) =>
                      setNewReminder({
                        ...newReminder,
                        category: e.target.value as ReminderItem['category'],
                      })
                    }
                    className="w-full px-3 py-2 rounded-lg bg-[#121c3b] border border-blue-900/60 text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="Licenciamento">Licenciamento</option>
                    <option value="IPVA">IPVA</option>
                    <option value="Seguro">Seguro</option>
                    <option value="Vistoria">Vistoria</option>
                    <option value="Manutenção">Manutenção</option>
                    <option value="Outro">Outro</option>
                  </select>
                </div>
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Data de Vencimento</label>
                  <input
                    type="date"
                    required
                    value={newReminder.dueDate}
                    onChange={(e) => setNewReminder({ ...newReminder, dueDate: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-[#121c3b] border border-blue-900/60 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">Valor Previsto (R$, opcional)</label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={newReminder.amount || ''}
                  onChange={(e) =>
                    setNewReminder({ ...newReminder, amount: parseFloat(e.target.value) || 0 })
                  }
                  className="w-full px-3 py-2 rounded-lg bg-[#121c3b] border border-blue-900/60 text-white font-mono focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">Notas & Instruções</label>
                <textarea
                  rows={2}
                  placeholder="Ex: Pagar pelo app bancário com desconto..."
                  value={newReminder.notes}
                  onChange={(e) => setNewReminder({ ...newReminder, notes: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-[#121c3b] border border-blue-900/60 text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="pt-3 border-t border-blue-900/40 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsReminderModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-[#121c3b] text-slate-300 hover:text-white text-xs font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md shadow-blue-600/30"
                >
                  Salvar Lembrete
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 7: DIGITAL INVOICE / WORK ORDER VIEWER */}
      {/* ========================================================= */}
      {selectedInvoiceMaint && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
          <div className="bg-[#0f1936] border border-blue-800/60 rounded-2xl max-w-lg w-full p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-blue-900/40">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">
                    Comprovante Digital & Ordem de Serviço
                  </h3>
                  <span className="text-[10px] text-blue-400 font-mono">
                    {selectedInvoiceMaint.invoiceNumber || 'Documento Oficial'}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelectedInvoiceMaint(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 mt-4 text-xs">
              {/* Receipt Header */}
              <div className="p-4 rounded-xl bg-[#121c3b] border border-blue-900/40 flex items-center justify-between">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase">Estabelecimento Emissor</span>
                  <span className="font-extrabold text-white text-sm">
                    {selectedInvoiceMaint.workshop}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-slate-400 block text-[10px] uppercase">Data / Km</span>
                  <span className="font-mono text-white">
                    {formatDateBR(selectedInvoiceMaint.date)} • {formatKm(selectedInvoiceMaint.mileage)}
                  </span>
                </div>
              </div>

              {/* Service Details */}
              <div className="p-4 rounded-xl bg-[#121c3b] border border-blue-900/40 space-y-2">
                <span className="font-semibold text-blue-400 uppercase text-[10px] tracking-wider block">
                  Discriminação dos Serviços
                </span>
                <p className="text-slate-200 leading-relaxed">{selectedInvoiceMaint.services}</p>
              </div>

              {/* Parts replaced */}
              <div className="p-4 rounded-xl bg-[#121c3b] border border-blue-900/40 space-y-2">
                <span className="font-semibold text-blue-400 uppercase text-[10px] tracking-wider block">
                  Peças e Insumos Faturados
                </span>
                <p className="text-slate-200 leading-relaxed font-mono">
                  {selectedInvoiceMaint.partsReplaced || 'Nenhuma peça física discriminada na O.S.'}
                </p>
              </div>

              {/* Financial Breakdown */}
              <div className="p-4 rounded-xl bg-[#121c3b] border border-blue-900/40 space-y-2">
                <div className="flex items-center justify-between text-slate-300">
                  <span>Subtotal Peças:</span>
                  <span className="font-mono">{formatCurrency(selectedInvoiceMaint.partsCost)}</span>
                </div>
                <div className="flex items-center justify-between text-slate-300">
                  <span>Mão de Obra Especializada:</span>
                  <span className="font-mono">{formatCurrency(selectedInvoiceMaint.laborCost)}</span>
                </div>
                <div className="pt-2 border-t border-blue-900/40 flex items-center justify-between text-sm font-extrabold text-white">
                  <span>Valor Total da O.S.:</span>
                  <span className="font-mono text-blue-400">
                    {formatCurrency(selectedInvoiceMaint.totalCost)}
                  </span>
                </div>
              </div>

              {/* Digital stamp */}
              <div className="p-3 rounded-xl bg-blue-950/40 border border-blue-700/30 flex items-center justify-between text-blue-300">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-blue-400" />
                  <div>
                    <span className="font-bold block text-[11px]">Certificado de Autenticidade</span>
                    <span className="text-[10px] text-slate-400">
                      Garantia: {selectedInvoiceMaint.warrantyPeriod || '90 dias legais'}
                    </span>
                  </div>
                </div>
                <span className="font-mono text-[10px] text-blue-400 font-bold">#AUT-MNR-VERIFIED</span>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => setSelectedInvoiceMaint(null)}
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold"
                >
                  Fechar Comprovante
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
