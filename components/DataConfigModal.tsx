import React, { useRef, useState } from 'react';
import { MachineConstants } from '../types';

interface DataConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  machineConstants: MachineConstants;
  setMachineConstants: React.Dispatch<React.SetStateAction<MachineConstants>>;
  onDataUpload: () => void; // Trigger for "Fake" upload simulation
}

const DataConfigModal: React.FC<DataConfigModalProps> = ({ isOpen, onClose, machineConstants, setMachineConstants, onDataUpload }) => {
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success'>('idle');
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setUploadStatus('uploading');
      // Simulate file processing delay
      setTimeout(() => {
        setUploadStatus('success');
        onDataUpload();
      }, 2000);
    }
  };

  const handleChange = (field: keyof MachineConstants, value: number) => {
    setMachineConstants(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md">
      <div className="bg-varaka-900 border border-varaka-700 rounded-lg shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-varaka-950 p-5 border-b border-varaka-800 flex justify-between items-center">
          <div>
            <h2 className="text-white font-mono font-bold text-lg flex items-center gap-2">
              <svg className="w-6 h-6 text-varaka-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
              DİJİTAL OPERATÖR YAPILANDIRMASI
            </h2>
            <p className="text-xs text-slate-400 mt-1">Makine DNA'sı ve Geçmiş Üretim Verisi Entegrasyonu</p>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-8">
          
          {/* Section 1: Data Set Upload */}
          <div className="bg-varaka-800/50 p-5 rounded-lg border border-varaka-700 border-dashed">
            <h3 className="text-varaka-accent font-bold text-sm mb-3 flex items-center gap-2 uppercase tracking-wider">
              <span className="w-2 h-2 bg-varaka-accent rounded-full"></span>
              Fine-Tuning (Geçmiş Veri Seti)
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              AI'ın fabrikanın gerçek üretim alışkanlıklarını öğrenmesi için son 6 aylık Üretim Raporunu (CSV/XLSX) yükleyin. Sistem otomatik olarak "Header" analizi yapacaktır.
            </p>
            
            <div className="flex items-center gap-4">
              <input 
                type="file" 
                ref={fileInputRef}
                className="hidden" 
                accept=".csv,.xlsx"
                onChange={handleFileChange}
              />
              
              <button 
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadStatus !== 'idle'}
                className={`flex-1 py-8 rounded border-2 border-dashed flex flex-col items-center justify-center transition-all ${
                  uploadStatus === 'success' 
                    ? 'border-varaka-success bg-varaka-success/10 cursor-default'
                    : 'border-varaka-600 hover:border-varaka-accent hover:bg-varaka-700 cursor-pointer'
                }`}
              >
                {uploadStatus === 'idle' && (
                  <>
                    <svg className="w-10 h-10 text-slate-500 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
                    <span className="text-sm text-slate-300 font-mono">Dosya Seç veya Sürükle</span>
                  </>
                )}
                
                {uploadStatus === 'uploading' && (
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 border-4 border-varaka-accent border-t-transparent rounded-full animate-spin mb-2"></div>
                    <span className="text-xs text-varaka-accent animate-pulse">VERİ SETİ İŞLENİYOR...</span>
                  </div>
                )}

                {uploadStatus === 'success' && (
                  <div className="flex flex-col items-center">
                    <svg className="w-10 h-10 text-varaka-success mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    <span className="text-sm text-varaka-success font-bold">VERİ SETİ ENTEGRE EDİLDİ</span>
                    <span className="text-[10px] text-varaka-success/70">6 Aylık Üretim Verisi (14,203 Satır)</span>
                  </div>
                )}
              </button>
            </div>
          </div>

          {/* Section 2: Machine Constants */}
          <div>
            <h3 className="text-white font-bold text-sm mb-4 flex items-center gap-2 uppercase tracking-wider">
              <span className="w-2 h-2 bg-white rounded-full"></span>
              Makine Karakteristikleri (Sabitler)
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-slate-400 mb-1">PM Trim Genişliği (cm)</label>
                <input 
                  type="number" 
                  value={machineConstants.trimWidth}
                  onChange={(e) => handleChange('trimWidth', Number(e.target.value))}
                  className="w-full bg-varaka-800 border border-varaka-600 rounded p-2 text-white font-mono focus:border-varaka-accent focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">Maks. Buhar Kapasitesi (bar)</label>
                <input 
                  type="number" 
                  value={machineConstants.maxSteamCapacity}
                  onChange={(e) => handleChange('maxSteamCapacity', Number(e.target.value))}
                  className="w-full bg-varaka-800 border border-varaka-600 rounded p-2 text-white font-mono focus:border-varaka-accent focus:outline-none"
                />
              </div>
               <div>
                <label className="block text-xs text-slate-400 mb-1">Genel Ekipman Verimliliği (OEE %)</label>
                <input 
                  type="number" 
                  value={machineConstants.productionEfficiency}
                  onChange={(e) => handleChange('productionEfficiency', Number(e.target.value))}
                  className="w-full bg-varaka-800 border border-varaka-600 rounded p-2 text-white font-mono focus:border-varaka-accent focus:outline-none"
                />
              </div>
               <div>
                <label className="block text-xs text-slate-400 mb-1">Kurutma Silindir Sayısı</label>
                <input 
                  type="number" 
                  value={machineConstants.dryerCount}
                  onChange={(e) => handleChange('dryerCount', Number(e.target.value))}
                  className="w-full bg-varaka-800 border border-varaka-600 rounded p-2 text-white font-mono focus:border-varaka-accent focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-varaka-950 p-4 border-t border-varaka-800 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 text-slate-400 hover:text-white text-sm">İptal</button>
          <button 
            onClick={onClose}
            className="bg-varaka-accent hover:bg-sky-500 text-varaka-900 font-bold py-2 px-6 rounded transition-colors text-sm shadow-lg shadow-sky-900/20"
          >
            YAPILANDIRMAYI KAYDET
          </button>
        </div>
      </div>
    </div>
  );
};

export default DataConfigModal;