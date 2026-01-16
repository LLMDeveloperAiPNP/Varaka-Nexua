import React from 'react';
import { UnitCosts } from '../types';

interface CostSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  costs: UnitCosts;
  setCosts: React.Dispatch<React.SetStateAction<UnitCosts>>;
}

const CostSettingsModal: React.FC<CostSettingsModalProps> = ({ isOpen, onClose, costs, setCosts }) => {
  if (!isOpen) return null;

  const handleChange = (field: keyof UnitCosts, value: number) => {
    setCosts(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="bg-varaka-900 border border-varaka-700 rounded-lg shadow-2xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="bg-varaka-950 p-4 border-b border-varaka-800 flex justify-between items-center">
          <h2 className="text-varaka-warning font-mono font-bold flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            BİRİM MALİYET YAPILANDIRMASI
          </h2>
          <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          <p className="text-xs text-slate-400 mb-4">
            Simülasyon motoru, maliyet analizlerini buradaki güncel birim fiyatlar üzerinden hesaplayacaktır. (Para Birimi: USD veya TL olarak standartlaştırın).
          </p>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-varaka-accent mb-1">OCC (Hurda) ($/ton)</label>
              <input 
                type="number" 
                value={costs.occPrice}
                onChange={(e) => handleChange('occPrice', Number(e.target.value))}
                className="w-full bg-varaka-800 border border-varaka-700 rounded p-2 text-white font-mono focus:border-varaka-warning focus:outline-none text-right"
              />
            </div>
             <div>
              <label className="block text-xs text-varaka-accent mb-1">Nişasta ($/ton)</label>
              <input 
                type="number" 
                value={costs.starchPrice}
                onChange={(e) => handleChange('starchPrice', Number(e.target.value))}
                className="w-full bg-varaka-800 border border-varaka-700 rounded p-2 text-white font-mono focus:border-varaka-warning focus:outline-none text-right"
              />
            </div>
             <div>
              <label className="block text-xs text-varaka-accent mb-1">Elektrik ($/kWh)</label>
              <input 
                type="number" 
                step="0.01"
                value={costs.electricityPrice}
                onChange={(e) => handleChange('electricityPrice', Number(e.target.value))}
                className="w-full bg-varaka-800 border border-varaka-700 rounded p-2 text-white font-mono focus:border-varaka-warning focus:outline-none text-right"
              />
            </div>
             <div>
              <label className="block text-xs text-varaka-accent mb-1">Buhar ($/ton)</label>
              <input 
                type="number" 
                value={costs.steamPrice}
                onChange={(e) => handleChange('steamPrice', Number(e.target.value))}
                className="w-full bg-varaka-800 border border-varaka-700 rounded p-2 text-white font-mono focus:border-varaka-warning focus:outline-none text-right"
              />
            </div>
          </div>
          
           <div>
              <label className="block text-xs text-varaka-accent mb-1">Taze Su ($/m³)</label>
              <input 
                type="number" 
                step="0.1"
                value={costs.freshWaterPrice}
                onChange={(e) => handleChange('freshWaterPrice', Number(e.target.value))}
                className="w-full bg-varaka-800 border border-varaka-700 rounded p-2 text-white font-mono focus:border-varaka-warning focus:outline-none text-right"
              />
            </div>
        </div>

        {/* Footer */}
        <div className="bg-varaka-950 p-4 border-t border-varaka-800 flex justify-end">
          <button 
            onClick={onClose}
            className="bg-varaka-success hover:bg-emerald-600 text-varaka-900 font-bold py-2 px-6 rounded transition-colors text-sm"
          >
            AYARLARI KAYDET
          </button>
        </div>
      </div>
    </div>
  );
};

export default CostSettingsModal;