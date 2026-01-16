import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine
} from 'recharts';
import { AISimulationResponse } from '../types';

interface SimulationChartProps {
  data: AISimulationResponse['chartData'];
  winningScenario: AISimulationResponse['winningScenario'];
  targetCMT?: number;
}

const SimulationChart: React.FC<SimulationChartProps> = ({ data, winningScenario, targetCMT = 180 }) => {
  if (!data || data.length === 0) {
    return (
      <div className="h-full w-full bg-varaka-800/50 rounded-lg p-4 border border-varaka-700/50 flex items-center justify-center min-h-[300px]">
         <div className="text-center text-slate-500 font-mono text-xs">
           <p>SİMÜLASYON VERİSİ BEKLENİYOR...</p>
           <p className="mt-2 text-[10px] opacity-60">Fine-Tuning Modülü Hazır.</p>
         </div>
      </div>
    );
  }

  // Mobil kontrolü (Basitçe window width veya CSS class ile yönetilebilir, burada responsive container hallediyor)
  const isMobile = window.innerWidth < 768;

  return (
    <div className="w-full bg-varaka-800/50 rounded-lg p-4 border border-varaka-700/50 flex flex-col gap-4">
      {/* Chart Section */}
      <div className="h-72 w-full">
        <h3 className="text-sm font-mono text-varaka-accent mb-4 flex items-center gap-2 justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-varaka-accent rounded-full animate-pulse"></span>
            KARAR MATRİSİ: KALİTE vs MALİYET
          </div>
          <span className="text-[10px] text-slate-400 bg-varaka-900 px-2 py-1 rounded border border-varaka-700">
            HEDEF: {targetCMT} N
          </span>
        </h3>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} vertical={false} />
            
            <XAxis 
              dataKey="name" 
              stroke="#94a3b8" 
              fontSize={10} 
              tick={{fill: '#94a3b8'}} 
              interval={0} 
            />

            <YAxis 
              yAxisId="left" 
              stroke="#10b981" 
              fontSize={10}
              label={{ value: 'Mukavemet (N)', angle: -90, position: 'insideLeft', fill: '#10b981', fontSize: 10, offset: 10 }} 
            />

            <YAxis 
              yAxisId="right" 
              orientation="right" 
              stroke="#f59e0b" 
              fontSize={10}
              label={{ value: 'Maliyet Endeksi', angle: 90, position: 'insideRight', fill: '#f59e0b', fontSize: 10, offset: 10 }} 
            />

            <Tooltip 
              contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#f1f5f9' }}
              cursor={{fill: 'rgba(255,255,255,0.05)'}}
            />
            <Legend wrapperStyle={{fontSize: '11px', paddingTop: '10px'}} />

            <Bar yAxisId="left" dataKey="CMT" fill="#10b981" name="Kalite (CMT)" radius={[4, 4, 0, 0]} maxBarSize={40} />
            <Bar yAxisId="right" dataKey="Maliyet" fill="#f59e0b" name="Maliyet" radius={[4, 4, 0, 0]} maxBarSize={40} />
            
            <ReferenceLine 
              yAxisId="left" 
              y={targetCMT} 
              stroke="#ef4444" 
              strokeDasharray="5 5"
              strokeWidth={2}
              label={{ 
                value: 'MÜŞTERİ HEDEFİ', 
                position: 'insideTopRight', 
                fill: '#ef4444', 
                fontSize: 10,
                fontWeight: 'bold'
              }} 
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* WINNING SCENARIO BOX - "Konuşan Grafik" */}
      {winningScenario && (
        <div className="bg-gradient-to-r from-varaka-900 to-varaka-800 border-l-4 border-varaka-success p-4 rounded-r-lg shadow-inner">
          <div className="flex items-start gap-3">
            <div className="bg-varaka-success/20 p-2 rounded-full mt-1">
              <svg className="w-5 h-5 text-varaka-success" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
            <div>
              <h4 className="text-varaka-success font-bold font-mono text-sm uppercase tracking-wide">
                NEXUS ÖNERİSİ: {winningScenario.name}
              </h4>
              <p className="text-slate-300 text-xs mt-1 leading-relaxed">
                {winningScenario.reason}
              </p>
              <div className="mt-2 flex items-center gap-2">
                <span className="text-[10px] bg-varaka-success/10 text-varaka-success px-2 py-0.5 rounded border border-varaka-success/20">
                  {winningScenario.improvement}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SimulationChart;