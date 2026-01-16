import React from 'react';
import { PaperGrade, ProductionTelemetry } from '../types';

interface TelemetryPanelProps {
  telemetry: ProductionTelemetry;
  setTelemetry: React.Dispatch<React.SetStateAction<ProductionTelemetry>>;
  disabled: boolean;
}

const TelemetryPanel: React.FC<TelemetryPanelProps> = ({ telemetry, setTelemetry, disabled }) => {
  
  const handleChange = (field: keyof ProductionTelemetry, value: string | number) => {
    setTelemetry(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="bg-varaka-800 border-r border-varaka-700 h-full flex flex-col overflow-y-auto">
      <div className="p-4 border-b border-varaka-700 bg-varaka-900/50 sticky top-0 z-10 backdrop-blur">
        <h2 className="text-varaka-accent font-mono text-sm tracking-wider font-bold flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
          AR-GE LABORATUVAR GİRİŞİ
        </h2>
        <p className="text-xs text-slate-400 mt-1">Hassas Proses Verileri</p>
      </div>

      <div className="p-4 space-y-6">
        {/* Paper Grade & Material */}
        <div className="space-y-3">
          <label className="text-xs font-bold text-slate-500 uppercase">Ürün Spektleri</label>
          
          <div>
            <label className="block text-xs text-slate-400 mb-1">Kağıt Cinsi</label>
            <select 
              value={telemetry.grade}
              onChange={(e) => handleChange('grade', e.target.value)}
              className="w-full bg-varaka-900 border border-varaka-700 rounded p-2 text-sm text-white focus:border-varaka-accent focus:outline-none transition-colors"
              disabled={disabled}
            >
              {Object.values(PaperGrade).map(grade => (
                <option key={grade} value={grade}>{grade}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs text-slate-400 mb-1">Gramaj (g/m²)</label>
              <input 
                type="number" 
                value={telemetry.grammage}
                onChange={(e) => handleChange('grammage', Number(e.target.value))}
                className="w-full bg-varaka-900 border border-varaka-700 rounded p-2 text-sm text-white focus:border-varaka-accent focus:outline-none font-mono"
              />
            </div>
             <div>
              <label className="block text-xs text-slate-400 mb-1">Hedef CMT (N)</label>
              <input 
                type="number" 
                value={telemetry.targetCMT}
                onChange={(e) => handleChange('targetCMT', Number(e.target.value))}
                className="w-full bg-varaka-900 border border-varaka-accent/50 rounded p-2 text-sm text-varaka-accent focus:outline-none font-mono font-bold text-center"
              />
            </div>
          </div>
        </div>

        {/* Critical Physics Parameters */}
        <div className="space-y-3 p-3 bg-varaka-700/30 rounded border border-varaka-600/50">
          <label className="text-xs font-bold text-varaka-warning uppercase flex items-center gap-1">
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            Kritik Ar-Ge Metrikleri
          </label>
          
          <div className="grid grid-cols-2 gap-2">
             <div>
              <label className="block text-[10px] text-slate-300 mb-1">Freeness (°SR)</label>
              <input 
                type="number" 
                value={telemetry.freeness}
                onChange={(e) => handleChange('freeness', Number(e.target.value))}
                className="w-full bg-varaka-900 border border-varaka-600 rounded p-2 text-sm text-white focus:border-varaka-warning focus:outline-none font-mono text-right"
              />
            </div>
            <div>
              <label className="block text-[10px] text-slate-300 mb-1">Kül Oranı (%)</label>
              <input 
                type="number" 
                step="0.1"
                value={telemetry.ashContent}
                onChange={(e) => handleChange('ashContent', Number(e.target.value))}
                className="w-full bg-varaka-900 border border-varaka-600 rounded p-2 text-sm text-white focus:border-varaka-warning focus:outline-none font-mono text-right"
              />
            </div>
          </div>
           <div className="grid grid-cols-2 gap-2 mt-2">
              <div>
                <label className="block text-[10px] text-slate-300 mb-1">Rutubet (%)</label>
                <input 
                  type="number" 
                  step="0.1"
                  value={telemetry.moistureContent}
                  onChange={(e) => handleChange('moistureContent', Number(e.target.value))}
                  className="w-full bg-varaka-900 border border-varaka-600 rounded p-2 text-sm text-white focus:border-cyan-400 focus:outline-none font-mono text-right"
                />
              </div>
              <div>
                <label className="block text-[10px] text-red-400 mb-1 font-bold">Atık/Kirlilik (%)</label>
                <input 
                  type="number" 
                  step="0.1"
                  value={telemetry.wasteContent}
                  onChange={(e) => handleChange('wasteContent', Number(e.target.value))}
                  className="w-full bg-varaka-900 border border-red-900/50 rounded p-2 text-sm text-red-400 focus:border-red-500 focus:outline-none font-mono text-right"
                />
              </div>
            </div>
          <p className="text-[9px] text-slate-500 italic mt-1">Kirlilik oranı (Trash %), mukavemeti doğrudan düşürür.</p>
        </div>

        {/* Machine Dynamics */}
        <div className="space-y-3">
          <label className="text-xs font-bold text-slate-500 uppercase">Makine & Proses</label>
          
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs text-slate-400 mb-1">Hız (m/dk)</label>
              <input 
                type="number" 
                value={telemetry.machineSpeed}
                onChange={(e) => handleChange('machineSpeed', Number(e.target.value))}
                className="w-full bg-varaka-900 border border-varaka-700 rounded p-2 text-sm text-white focus:border-varaka-accent focus:outline-none font-mono text-right"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">Buhar (bar)</label>
              <input 
                type="number" 
                step="0.1"
                value={telemetry.steamPressure}
                onChange={(e) => handleChange('steamPressure', Number(e.target.value))}
                className={`w-full bg-varaka-900 border border-varaka-700 rounded p-2 text-sm text-white focus:border-varaka-accent focus:outline-none font-mono text-right ${telemetry.steamPressure > 4.5 ? 'text-red-500 border-red-900' : ''}`}
              />
            </div>
          </div>

           <div>
            <label className="block text-xs text-slate-400 mb-1">Rafinör Yükü (kW)</label>
            <div className="flex items-center gap-2">
              <input 
                type="range" 
                min="0" 
                max="600" 
                value={telemetry.refiningLoad} 
                onChange={(e) => handleChange('refiningLoad', Number(e.target.value))}
                className="flex-1 h-1 bg-varaka-700 rounded-lg appearance-none cursor-pointer accent-varaka-accent"
              />
              <span className="font-mono text-sm w-12 text-right">{telemetry.refiningLoad}</span>
            </div>
          </div>
        </div>

        {/* Chemistry */}
        <div className="space-y-3">
          <label className="text-xs font-bold text-slate-500 uppercase">Kimyasal Reçete</label>
          
          <div className="grid grid-cols-2 gap-2">
             <div>
              <label className="block text-xs text-slate-400 mb-1">Elyaf Kaynağı</label>
              <select 
                value={telemetry.fiberType}
                onChange={(e) => handleChange('fiberType', e.target.value)}
                className="w-full bg-varaka-900 border border-varaka-700 rounded p-2 text-[10px] text-white focus:border-varaka-accent focus:outline-none"
              >
                <option value="100% OCC">100% OCC</option>
                <option value="80% OCC - 20% Mix">80% OCC - 20% Mix</option>
                <option value="Karışık (A3)">Karışık (A3)</option>
              </select>
            </div>
             <div>
              <label className="block text-xs text-slate-400 mb-1">Nişasta Tipi</label>
               <select 
                value={telemetry.starchType}
                onChange={(e) => handleChange('starchType', e.target.value)}
                className="w-full bg-varaka-900 border border-varaka-700 rounded p-2 text-[10px] text-white focus:border-varaka-accent focus:outline-none"
              >
                <option value="Katyonik">Katyonik</option>
                <option value="Amfoterik">Amfoterik</option>
                <option value="Nativ">Nativ</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
             <div>
              <label className="block text-xs text-slate-400 mb-1">Nişasta (%)</label>
              <input 
                type="number" 
                step="0.1"
                value={telemetry.starchDosage}
                onChange={(e) => handleChange('starchDosage', Number(e.target.value))}
                className="w-full bg-varaka-900 border border-varaka-700 rounded p-2 text-sm text-white focus:border-varaka-accent focus:outline-none font-mono text-right"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">Retensiyon (ppm)</label>
              <input 
                type="number" 
                value={telemetry.retentionAgent}
                onChange={(e) => handleChange('retentionAgent', Number(e.target.value))}
                className="w-full bg-varaka-900 border border-varaka-700 rounded p-2 text-sm text-white focus:border-varaka-accent focus:outline-none font-mono text-right"
              />
            </div>
          </div>
          
           <div className="grid grid-cols-2 gap-2">
             <div>
              <label className="block text-xs text-slate-400 mb-1">pH</label>
              <input 
                type="number" 
                step="0.1"
                value={telemetry.phLevel}
                onChange={(e) => handleChange('phLevel', Number(e.target.value))}
                className="w-full bg-varaka-900 border border-varaka-700 rounded p-2 text-sm text-white focus:border-varaka-accent focus:outline-none font-mono text-right"
              />
            </div>
             <div>
              <label className="block text-xs text-slate-400 mb-1">İletkenlik</label>
              <input 
                type="number" 
                value={telemetry.conductivity}
                onChange={(e) => handleChange('conductivity', Number(e.target.value))}
                className="w-full bg-varaka-900 border border-varaka-700 rounded p-2 text-sm text-white focus:border-varaka-accent focus:outline-none font-mono text-right"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TelemetryPanel;