import { GoogleGenAI } from "@google/genai";
import { ProductionTelemetry, UnitCosts, MachineConstants } from '../types';

// The "Physics Engine" & "Multi-Expert" System Instruction
const VARAKA_SYSTEM_INSTRUCTION = `
**IDENTITY:**
You are **VARAKA-NEXUS**, the Supreme R&D Intelligence for Varaka Paper Industry. You are currently operating in **"DIGITAL OPERATOR"** mode.
You have access to historical production data and machine characteristics.

**CORE OBJECTIVE:**
Solve the "Lightweighting" challenge: Achieve high strength (CMT/Burst) values typical of 140gsm paper using 110-120gsm recycled paper.

**⚠️ PHYSICS AXIOMS (THE "NO HALLUCINATION" RULES):**
1.  **Trash/Waste Impact (CRITICAL):** 
    *   Waste Content (Impurity) DIRECTLY reduces effective fiber bonding.
    *   Rule: For every 1% increase in Waste Content, reduce predicted CMT by 2% and increase risk of breaks.
    *   If Waste > 5%, you MUST recommend increased fractioning or cleaner refining.
2.  **Refining Law:** Increasing Refining Load (kW) increases Fiber Bonding (Burst/CMT) but DECREASES Freeness (°SR). Limit: <25°SR creates drainage failure.
3.  **Ash Content Law:** High Ash (>14%) drastically reduces CMT/Burst. Requires Retention Aid.
4.  **Moisture Impact:** Ideal range 7.5% - 8.5%.
5.  **Conductivity:** > 4000 µS/cm reduces cationic efficiency.

**OUTPUT FORMAT (CRITICAL - JSON ONLY):**
You must respond in a raw JSON block structure ONLY.
{
  "markdownReport": "### 🧪 AR-GE TEŞHİS RAPORU\n[Detailed analysis...]",
  "chartData": [
    { "name": "Mevcut", "CMT": [Calc], "Maliyet": [Calc], "Risk": [0-100] },
    { "name": "Senaryo A", "CMT": [Calc], "Maliyet": [Calc], "Risk": [0-100] },
    { "name": "Senaryo B", "CMT": [Calc], "Maliyet": [Calc], "Risk": [0-100] },
    { "name": "NEXUS (Hibrit)", "CMT": [Calc], "Maliyet": [Calc], "Risk": [0-100] }
  ],
  "winningScenario": {
    "name": "NEXUS (Hibrit)",
    "reason": "Short summary of why this wins (max 10 words).",
    "improvement": "CMT +X% | Cost -Y%"
  }
}

**COST CALCULATION:**
Include the impact of 'Waste Content' on cost (higher waste = higher raw material consumption).

**TONE:** Highly Technical, Scientific, "Zero-Error" Mindset.
`;

export const sendMessageToGemini = async (
  prompt: string, 
  telemetry: ProductionTelemetry,
  costs: UnitCosts,
  machineConstants: MachineConstants,
  hasHistoricalData: boolean,
  history: { role: string; parts: { text: string }[] }[]
) => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) throw new Error("API Key not found");

  const ai = new GoogleGenAI({ apiKey });

  // Construct a rich context block
  const telemetryContext = `
*** SYSTEM TELEMETRY INJECTION ***
MODE: ${hasHistoricalData ? "FINE-TUNED (HISTORICAL DATA LOADED)" : "STANDARD SIMULATION"}

-- REALITY FACTORS --
WASTE/TRASH CONTENT: ${telemetry.wasteContent} % (CRITICAL NEGATIVE FACTOR)
MOISTURE: ${telemetry.moistureContent} %
ASH CONTENT: ${telemetry.ashContent} %
FREENESS: ${telemetry.freeness} °SR

-- MACHINE DNA --
TRIM WIDTH: ${machineConstants.trimWidth} cm
MAX STEAM: ${machineConstants.maxSteamCapacity} bar
EFFICIENCY (OEE): ${machineConstants.productionEfficiency} %

-- PROCESS DATA --
SPEED: ${telemetry.machineSpeed} m/min
GRAMMAGE: ${telemetry.grammage} gsm
REFINING: ${telemetry.refiningLoad} kW
STARCH: ${telemetry.starchDosage}% (${telemetry.starchType})
RETENTION: ${telemetry.retentionAgent} ppm
CONDUCTIVITY: ${telemetry.conductivity} µS/cm

-- FINANCIALS --
OCC: ${costs.occPrice} $/ton
STARCH: ${costs.starchPrice} $/ton
ELECTRICITY: ${costs.electricityPrice} $/kWh

-- GOAL --
TARGET CMT: ${telemetry.targetCMT} N

USER QUERY: ${prompt}
---------------------------------
Instructions: Calculate impact of WASTE CONTENT on CMT. If Waste is high, predicted CMT must drop significantly versus theoretical maximum. Use Machine DNA constraints.
  `;

  try {
    const chat = ai.chats.create({
      model: 'gemini-3-pro-preview',
      config: {
        systemInstruction: VARAKA_SYSTEM_INSTRUCTION,
        temperature: 0.2, 
      },
      history: history,
    });

    const result = await chat.sendMessage({ message: telemetryContext });
    return result.text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};