export enum PaperGrade {
  FLUTING = 'Fluting',
  TESTLINER = 'Testliner',
  HP_FLUTING = 'HP Fluting',
  IMITATION_KRAFT = 'Imitation Kraft'
}

export interface ProductionTelemetry {
  grade: PaperGrade;
  grammage: number; // g/m2
  machineSpeed: number; // m/min
  steamPressure: number; // bar
  refiningLoad: number; // kW
  starchDosage: number; // %
  retentionAgent: number; // ppm
  targetCMT: number; // N
  rawMaterialQuality: 'High (A1)' | 'Medium (Mixed)' | 'Low (A3/Local)';
  
  // Detailed Chemistry & Physics
  fiberType: '100% OCC' | '80% OCC - 20% Mix' | 'Karışık (A3)' | 'Kraft/NSSC';
  starchType: 'Katyonik' | 'Amfoterik' | 'Nativ' | 'Okside';
  glueType: 'ASA' | 'AKD' | 'Rosin' | 'Yok';
  phLevel: number;
  conductivity: number; // µS/cm
  
  // CRITICAL R&D PARAMETERS
  freeness: number; // °SR
  ashContent: number; // %
  moistureContent: number; // %
  wasteContent: number; // % (YENİ: Atık/Kirlilik Oranı - Realite Faktörü)
}

// YENİ: Makine Karakteristiği (Sabitler)
export interface MachineConstants {
  trimWidth: number; // cm (Makine Eni)
  maxSteamCapacity: number; // bar
  productionEfficiency: number; // % (OEE)
  dryerCount: number; // Silindir sayısı
}

export interface UnitCosts {
  electricityPrice: number; // $/kWh
  steamPrice: number; // $/ton
  starchPrice: number; // $/ton
  occPrice: number; // $/ton
  freshWaterPrice: number; // $/m3
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: Date;
}

// YENİ: Yapılandırılmış AI verisi ve Kazanan Senaryo
export interface AISimulationResponse {
  markdownReport: string;
  chartData: {
    name: string;
    CMT: number;
    Maliyet: number;
    Risk: number;
  }[];
  winningScenario: { // Grafiğin altında konuşacak olan kısım
    name: string;
    reason: string;
    improvement: string;
  } | null;
}