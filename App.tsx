import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import TelemetryPanel from './components/TelemetryPanel';
import SimulationChart from './components/SimulationChart';
import CostSettingsModal from './components/CostSettingsModal';
import DataConfigModal from './components/DataConfigModal'; // New Modal
import { PaperGrade, ProductionTelemetry, ChatMessage, UnitCosts, AISimulationResponse, MachineConstants } from './types';
import { sendMessageToGemini } from './services/geminiService';

const App: React.FC = () => {
  // --- STATE ---
  const [telemetry, setTelemetry] = useState<ProductionTelemetry>({
    grade: PaperGrade.HP_FLUTING,
    grammage: 120, 
    machineSpeed: 600,
    steamPressure: 3.2,
    refiningLoad: 350,
    starchDosage: 1.8,
    retentionAgent: 200,
    targetCMT: 180,
    rawMaterialQuality: 'Low (A3/Local)',
    fiberType: '100% OCC',
    starchType: 'Katyonik',
    glueType: 'ASA',
    phLevel: 7.2,
    conductivity: 3500,
    freeness: 35, 
    ashContent: 12,
    moistureContent: 7.5,
    wasteContent: 3.5 // Default impurity %
  });

  const [unitCosts, setUnitCosts] = useState<UnitCosts>({
    electricityPrice: 0.12,
    steamPrice: 25.0,
    starchPrice: 600.0,
    occPrice: 150.0,
    freshWaterPrice: 1.5
  });

  // Machine Constants (Digital Operator Mode)
  const [machineConstants, setMachineConstants] = useState<MachineConstants>({
    trimWidth: 250, // cm example
    maxSteamCapacity: 5.0,
    productionEfficiency: 85,
    dryerCount: 40
  });

  const [hasHistoricalData, setHasHistoricalData] = useState(false);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'model',
      content: `**VARAKA-NEXUS DİJİTAL OPERATÖR SİSTEMİ**
      
Sistem hazır. Gerçekçi simülasyon için:
1.  **Veri Yapılandırma** butonundan Makine DNA'sını ve Geçmiş Verileri yükleyin.
2.  Sol panelden anlık **Kirlilik/Atık Oranını** girin.
      `,
      timestamp: new Date()
    }
  ]);

  const [simulationData, setSimulationData] = useState<AISimulationResponse['chartData']>([]);
  const [winningScenario, setWinningScenario] = useState<AISimulationResponse['winningScenario']>(null);
  
  const [isCostModalOpen, setIsCostModalOpen] = useState(false);
  const [isDataConfigOpen, setIsDataConfigOpen] = useState(false); // New Modal State
  
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isApiKeyMissing, setIsApiKeyMissing] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // --- EFFECTS ---
  useEffect(() => {
    if (!process.env.API_KEY) {
      setIsApiKeyMissing(true);
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // --- HANDLERS ---
  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsLoading(true);

    try {
      const history = messages
        .filter(m => !m.content.includes("JSON Parsing Error")) 
        .map(m => ({
          role: m.role,
          parts: [{ text: m.content }]
        }));

      const responseText = await sendMessageToGemini(
        userMsg.content, 
        telemetry, 
        unitCosts, 
        machineConstants,
        hasHistoricalData,
        history
      );
      
      // JSON Parsing Logic (Improved Regex)
      try {
        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        const cleanJson = jsonMatch ? jsonMatch[0] : null;
        
        if (!cleanJson) throw new Error("JSON structure not found in response");
        
        const parsedResponse: AISimulationResponse = JSON.parse(cleanJson);
        
        setSimulationData(parsedResponse.chartData);
        setWinningScenario(parsedResponse.winningScenario);
        
        const modelMsg: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: 'model',
          content: parsedResponse.markdownReport,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, modelMsg]);

      } catch (parseError) {
        console.error("JSON Parsing failed", parseError);
        const modelMsg: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: 'model',
          content: responseText, // Fallback to raw text
          timestamp: new Date()
        };
        setMessages(prev => [...prev, modelMsg]);
      }

    } catch (error) {
      console.error("Chat Error", error);
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'model',
        content: "⚠️ **Sistem Hatası:** Simülasyon motoruna erişilemedi.",
        timestamp: new Date()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDataUpload = () => {
    setHasHistoricalData(true);
    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      role: 'model',
      content: "✅ **FINE-TUNING BAŞARILI:** 6 aylık üretim veri seti işlendi. AI artık Varaka'nın üretim alışkanlıklarını ve atık kağıt tepkilerini biliyor.",
      timestamp: new Date()
    }]);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const runSimulation = (type: 'lightweighting' | 'waste' | 'efficiency') => {
    let prompt = "";
    if (type === 'lightweighting') prompt = `Elimde ${telemetry.grammage} gsm HP Fluting var. Atık Oranı %${telemetry.wasteContent}. Hedef CMT ${telemetry.targetCMT}. 140 gsm mukavemetini bu gramajda yakalamak için optimum reçete nedir? Atık oranını dikkate al.`;
    if (type === 'waste') prompt = `Atık kağıtta kirlilik %${telemetry.wasteContent} seviyesine çıktı. CMT düşüşünü engellemek için Rafinasyon ve Nişasta'da nasıl bir agresif ayar yapmalıyız? Makine trim ${machineConstants.trimWidth} cm.`;
    if (type === 'efficiency') prompt = `Makine hızı ${telemetry.machineSpeed} m/dk. OEE %${machineConstants.productionEfficiency}. Hızı 50 m/dk artırırsak kirlilik yüzünden kopma riski ne olur?`;
    
    setInputValue(prompt);
  };

  if (isApiKeyMissing) {
    return (
      <div className="min-h-screen bg-varaka-900 flex items-center justify-center text-white p-4">
        <div className="max-w-md text-center space-y-4">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold font-mono">Sistem Başlatılamadı</h1>
          <p className="text-slate-400">Varaka Nexus API Anahtarı Gerekli.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-varaka-900 text-slate-200 font-sans">
      
      {/* HEADER */}
      <header className="h-16 bg-varaka-950 border-b border-varaka-800 flex items-center justify-between px-6 shrink-0 z-20 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-varaka-accent rounded flex items-center justify-center text-varaka-900 font-bold text-xl">V</div>
          <div>
            <h1 className="font-mono font-bold text-lg text-white tracking-widest">VARAKA<span className="text-varaka-accent">NEXUS</span></h1>
            <p className="text-[10px] text-varaka-success uppercase tracking-wider flex items-center gap-1">
              <span className={`w-1.5 h-1.5 rounded-full ${hasHistoricalData ? 'bg-purple-500 animate-pulse' : 'bg-varaka-success'}`}></span>
              {hasHistoricalData ? 'DIGITAL OPERATOR: ACTIVE' : 'R&D Lab Online'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
             {/* CONFIG BUTTONS */}
             <button 
               onClick={() => setIsDataConfigOpen(true)}
               className="flex items-center gap-2 px-3 py-1.5 bg-varaka-800 hover:bg-varaka-700 border border-varaka-700 hover:border-varaka-accent rounded text-xs text-white font-mono transition-colors group"
             >
               <svg className="w-4 h-4 text-slate-400 group-hover:text-varaka-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
               VERİ YAPILANDIRMA
             </button>

             <button 
               onClick={() => setIsCostModalOpen(true)}
               className="flex items-center gap-2 px-3 py-1.5 bg-varaka-800 hover:bg-varaka-700 border border-varaka-700 rounded text-xs text-varaka-warning font-mono transition-colors"
             >
               <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
             </button>
        </div>
      </header>

      {/* MODALS */}
      <CostSettingsModal 
        isOpen={isCostModalOpen} 
        onClose={() => setIsCostModalOpen(false)}
        costs={unitCosts}
        setCosts={setUnitCosts}
      />
      <DataConfigModal 
        isOpen={isDataConfigOpen}
        onClose={() => setIsDataConfigOpen(false)}
        machineConstants={machineConstants}
        setMachineConstants={setMachineConstants}
        onDataUpload={handleDataUpload}
      />

      {/* MAIN CONTENT */}
      <div className="flex flex-1 overflow-hidden">
        <aside className="w-80 shrink-0 z-10 shadow-xl">
          <TelemetryPanel telemetry={telemetry} setTelemetry={setTelemetry} disabled={isLoading} />
        </aside>

        <main className="flex-1 flex flex-col relative bg-gradient-to-br from-varaka-900 to-varaka-950">
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-4xl rounded-lg p-5 shadow-lg border ${
                  msg.role === 'user' 
                    ? 'bg-varaka-700/50 border-varaka-600 text-white rounded-br-none' 
                    : 'bg-varaka-800/80 border-varaka-700/50 text-slate-200 rounded-bl-none backdrop-blur-sm'
                }`}>
                  <div className="flex items-center gap-2 mb-2 border-b border-white/5 pb-2">
                    <span className={`text-xs font-bold uppercase tracking-wider ${msg.role === 'user' ? 'text-varaka-accent' : 'text-varaka-success'}`}>
                      {msg.role === 'user' ? 'BAŞ MÜHENDİS' : 'NEXUS AI'}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">{msg.timestamp.toLocaleTimeString()}</span>
                  </div>
                  
                  <div className="prose prose-invert prose-sm max-w-none">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {msg.content}
                    </ReactMarkdown>
                  </div>

                  {msg.role === 'model' && msg.id === messages[messages.length - 1].id && messages.length > 2 && (
                    <div className="mt-6 pt-4 border-t border-white/5">
                      <SimulationChart 
                        data={simulationData} 
                        winningScenario={winningScenario} 
                        targetCMT={telemetry.targetCMT}
                      />
                    </div>
                  )}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-varaka-800/50 border border-varaka-700 rounded-lg p-4 flex items-center gap-3">
                  <div className="w-2 h-2 bg-varaka-accent rounded-full animate-bounce"></div>
                  <span className="text-xs text-varaka-accent font-mono animate-pulse">
                    {hasHistoricalData ? 'GEÇMİŞ VERİ SETİ TARANIYOR...' : 'SİMÜLASYON HESAPLANIYOR...'}
                  </span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-4 bg-varaka-900 border-t border-varaka-800 z-20">
            <div className="flex gap-2 mb-3 overflow-x-auto pb-2 scrollbar-none">
              <button onClick={() => runSimulation('lightweighting')} className="whitespace-nowrap px-3 py-1.5 rounded-full bg-varaka-800 border border-varaka-700 hover:border-varaka-accent text-xs text-slate-300 hover:text-white transition-all flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>Lightweighting
              </button>
              <button onClick={() => runSimulation('waste')} className="whitespace-nowrap px-3 py-1.5 rounded-full bg-varaka-800 border border-varaka-700 hover:border-red-500 text-xs text-slate-300 hover:text-white transition-all flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>Kirlilik Analizi
              </button>
               <button onClick={() => runSimulation('efficiency')} className="whitespace-nowrap px-3 py-1.5 rounded-full bg-varaka-800 border border-varaka-700 hover:border-varaka-success text-xs text-slate-300 hover:text-white transition-all flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>OEE/Hız Simülasyonu
              </button>
            </div>
            <div className="relative">
              <textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Simülasyon talimatı girin..."
                className="w-full bg-varaka-950 border border-varaka-700 rounded-lg p-4 pr-32 text-slate-200 placeholder-slate-600 focus:border-varaka-accent focus:ring-1 focus:ring-varaka-accent focus:outline-none resize-none h-24 font-mono text-sm shadow-inner"
              />
              <div className="absolute bottom-3 right-3">
                <button onClick={handleSendMessage} disabled={isLoading || !inputValue.trim()} className="bg-varaka-accent hover:bg-sky-400 text-varaka-900 font-bold py-2 px-4 rounded shadow-lg shadow-sky-900/20 text-xs">
                  ANALİZ ET
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;