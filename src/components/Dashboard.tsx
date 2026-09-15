import React, { useState, useMemo } from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell
} from 'recharts';
import { ResearchReport } from '../types';
import { 
  Activity, 
  Target, 
  ArrowUpRight, 
  ArrowDownRight, 
  Layers, 
  FileText, 
  Copy, 
  Check, 
  Sliders, 
  Zap,
  TrendingUp,
  MapPin,
  BarChart3,
  Gauge,
  DollarSign,
  Sparkles,
  BookOpen,
  HelpCircle
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { ramAudio } from '../utils/audio';
import { SemStrategyModule } from './SemStrategyModule';
import { TaxonomyIntentModule } from './TaxonomyIntentModule';
import { SystemGuideModal } from './SystemGuideModal';
import { researchService } from '../services/researchService';
import { generateTaxonomyQueriesForMarket } from '../services/taxonomyService';

// Paleta cromática de 5 canales inspirada en la paleta del usuario
export const RAM_COLORS = [
  '#FFBA08', // Amarillo Dorado Cálido (Color 1 de la paleta con punto negro)
  '#161B26', // Obsidiana Carbón Profundo (Color 3 de la paleta)
  '#525866', // Gris Pizarra Neutro (Color 4 de la paleta)
  '#10B981', // Verde Señal / Conversión
  '#2563EB', // Azul Precisión / Navegacional
];

interface DashboardProps {
  report: ResearchReport;
  onNewSearch: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ report, onNewSearch }) => {
  const [copied, setCopied] = useState(false);
  const [selectedBrandFilter, setSelectedBrandFilter] = useState<string | null>(null);
  const [selectedIntentFilter, setSelectedIntentFilter] = useState<string | null>(null);
  const [activeCurve, setActiveCurve] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'demand' | 'sem'>('all');
  const [isGuideOpen, setIsGuideOpen] = useState(false);

  // Asegura que la taxonomía de intención esté disponible para categoría y marcas
  const decodedTaxonomyData = useMemo(() => {
    if (report.categoryTopQueries && report.categoryTopQueries.length > 0) {
      return {
        categoryQueries: report.categoryTopQueries,
        brandsWithQueries: report.brands
      };
    }
    const generated = generateTaxonomyQueriesForMarket(report.topic, report.location, report.brands);
    return {
      categoryQueries: generated.categoryTopQueries,
      brandsWithQueries: generated.brandsWithDecodedQueries
    };
  }, [report]);

  // Asegura que la estrategia SEM esté siempre presente y completa
  const semStrategy = report.semStrategy || researchService.buildFallbackSemStrategy(
    report.brands, 
    report.location, 
    report.insights
  );

  const brandNames = report.brands.map(b => b.brand);

  // Transformar datos para Recharts
  const chartData = report.trends.map(t => {
    const dataPoint: Record<string, string | number> = { date: t.date };
    t.values.forEach(v => {
      dataPoint[v.brand] = v.value;
    });
    return dataPoint;
  });

  // Filtrar tabla de palabras clave
  const filteredInsights = report.insights.filter(item => {
    const matchesBrand = selectedBrandFilter ? item.brand === selectedBrandFilter : true;
    const matchesIntent = selectedIntentFilter ? item.intent.toLowerCase().includes(selectedIntentFilter.toLowerCase()) : true;
    return matchesBrand && matchesIntent;
  });

  const handleCopyReport = () => {
    ramAudio.playClick(900, 0.04);
    const textData = `=== RAM SEARCH // INFORME DE TELEMETRÍA ===
TEMA / MARCAS: ${report.topic}
REGIÓN: ${report.location}
FECHA: ${new Date().toISOString().split('T')[0]}

--- CUOTA DE BÚSQUEDA (SHARE OF SEARCH) E INTENCIÓN ---
${report.brands.map((b, i) => `CH-0${i + 1} ${b.brand}:
  • Cuota de Búsqueda: ${b.shareOfSearch}%
  • Volumen Estimado: ${b.searchVolume}
  • Intención Principal: ${b.topIntent}
  • Sentimiento: ${b.sentiment.positive}% Pos / ${b.sentiment.neutral}% Neu / ${b.sentiment.negative}% Neg
`).join('\n')}

--- RESUMEN EJECUTIVO ---
${report.summary}

--- DIRECTIVAS ESTRATÉGICAS ---
${report.recommendations.map((r, i) => `[DIR-${i + 1}] ${r}`).join('\n')}
`;
    navigator.clipboard.writeText(textData);
    setCopied(true);
    setTimeout(() => setCopied(false), 2400);
  };

  const getChannelColor = (index: number) => {
    return RAM_COLORS[index % RAM_COLORS.length];
  };

  // Identificar dinámicamente al líder real del mercado por mayor Share of Search / volumen
  const marketLeader = useMemo(() => {
    return [...report.brands].sort((a, b) => (b.shareOfSearch || 0) - (a.shareOfSearch || 0))[0] || report.brands[0];
  }, [report.brands]);

  // Lista ordenada por cuota de búsqueda decreciente para ranking riguroso
  const sortedBrandsForSOS = useMemo(() => {
    return [...report.brands].sort((a, b) => (b.shareOfSearch || 0) - (a.shareOfSearch || 0));
  }, [report.brands]);

  const getIntentBadgeStyle = (intent: string) => {
    const norm = intent.toLowerCase();
    if (norm.includes('trans') || norm.includes('compra')) {
      return 'bg-[#FFF8D6] text-[#161B26] border-[#EADB9F]';
    }
    if (norm.includes('comerc')) {
      return 'bg-[#F4F6F8] text-[#161B26] border-[#CFD3D8]';
    }
    if (norm.includes('nav')) {
      return 'bg-[#EFF6FF] text-[#1D4ED8] border-[#BFDBFE]';
    }
    return 'bg-[#F0FDF4] text-[#15803D] border-[#BBF7D0]';
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Panel Superior de Control de Telemetría (Clean UX) */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-[#E2E5E9] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-3 mb-1.5">
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10B981] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#10B981]"></span>
            </span>
            <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#6E7380]">
              RAM OS // UNIDAD DE TELEMETRÍA RS-900
            </span>
            <span className="text-[#CFD3D8] text-xs font-mono">|</span>
            <div className="flex items-center text-xs font-mono text-[#161B26] bg-[#FFF8D6] px-2.5 py-0.5 rounded-full border border-[#EADB9F] font-bold">
              <MapPin className="w-3 h-3 mr-1 text-[#FFBA08]" />
              {report.location.toUpperCase()}
            </div>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#161B26] font-display">
            {report.topic}
          </h1>
        </div>

        {/* Controles de Acción */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => {
              ramAudio.playSwitch();
              setIsGuideOpen(true);
            }}
            className="ram-btn px-3.5 py-2 rounded-xl bg-white border border-[#E2E5E9] hover:bg-[#F4F6F8] text-[#161B26] text-xs font-mono font-bold flex items-center shadow-xs transition-all"
          >
            <BookOpen className="w-3.5 h-3.5 mr-1.5 text-[#2563EB]" />
            <span>INSTRUCTIVO & MANUAL</span>
          </button>

          <button
            onClick={() => {
              ramAudio.playSwitch();
              setActiveTab(activeTab === 'sem' ? 'all' : 'sem');
            }}
            className={`ram-btn px-3.5 py-2 rounded-xl border text-xs font-mono font-bold flex items-center shadow-xs transition-all ${
              activeTab === 'sem'
                ? 'bg-[#FFBA08] text-[#161B26] border-[#E5A700]'
                : 'bg-white border-[#E2E5E9] hover:bg-[#F4F6F8] text-[#161B26]'
            }`}
          >
            <DollarSign className={`w-3.5 h-3.5 mr-1.5 ${activeTab === 'sem' ? 'text-[#161B26]' : 'text-[#FFBA08]'}`} />
            <span>ESTRATEGIA SEM</span>
          </button>

          <button
            onClick={handleCopyReport}
            className="ram-btn px-3.5 py-2 rounded-xl bg-white border border-[#E2E5E9] hover:bg-[#F4F6F8] text-[#161B26] text-xs font-mono font-bold flex items-center shadow-xs"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 mr-1.5 text-[#10B981]" />
                <span>COPIADO</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 mr-1.5 text-[#6E7380]" />
                <span>EXPORTAR</span>
              </>
            )}
          </button>

          <button
            onClick={() => {
              ramAudio.playSwitch();
              onNewSearch();
            }}
            className="ram-btn-accent px-4 py-2 rounded-xl text-xs font-mono font-bold tracking-wider uppercase flex items-center"
          >
            <Sliders className="w-3.5 h-3.5 mr-1.5" />
            <span>NUEVO ANÁLISIS</span>
          </button>
        </div>
      </div>

      {/* Selector de Módulos (Separación Clara de Módulo 1 y Módulo 2) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-[#F4F6F8] p-1.5 rounded-xl border border-[#E2E5E9] text-xs font-mono font-bold gap-2">
        <div className="flex items-center space-x-1 overflow-x-auto">
          <button
            onClick={() => {
              ramAudio.playSwitch();
              setActiveTab('demand');
            }}
            className={`px-3.5 py-1.5 rounded-lg transition-all flex items-center space-x-1.5 whitespace-nowrap ${
              activeTab === 'demand' 
                ? 'bg-[#161B26] text-white shadow-xs' 
                : 'text-[#525866] hover:bg-white'
            }`}
          >
            <Activity className="w-3.5 h-3.5 text-[#10B981]" />
            <span>MÓDULO 1: INTENCIÓN DE BÚSQUEDA & DEMANDA</span>
          </button>

          <button
            onClick={() => {
              ramAudio.playSwitch();
              setActiveTab('sem');
            }}
            className={`px-3.5 py-1.5 rounded-lg transition-all flex items-center space-x-1.5 whitespace-nowrap ${
              activeTab === 'sem' 
                ? 'bg-[#FFBA08] text-[#161B26] shadow-xs font-bold' 
                : 'text-[#161B26] hover:bg-[#FFF8D6]'
            }`}
          >
            <DollarSign className="w-3.5 h-3.5 text-[#161B26]" />
            <span>MÓDULO 2: ESTRATEGIA SEM & FRAMEWORK NUMÉRICO</span>
          </button>

          <button
            onClick={() => {
              ramAudio.playSwitch();
              setActiveTab('all');
            }}
            className={`px-3.5 py-1.5 rounded-lg transition-all flex items-center space-x-1.5 whitespace-nowrap ${
              activeTab === 'all' 
                ? 'bg-[#161B26] text-white shadow-xs' 
                : 'text-[#525866] hover:bg-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>VISTA CONSOLIDADA (AMBOS MÓDULOS)</span>
          </button>
        </div>

        <div className="flex items-center space-x-2 text-[11px] text-[#6E7380] pr-2">
          <button
            onClick={() => {
              ramAudio.playClick(800, 0.03);
              setIsGuideOpen(true);
            }}
            className="flex items-center space-x-1 text-[#2563EB] hover:underline font-bold"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>¿CÓMO USAR?</span>
          </button>
        </div>
      </div>

      {/* Secciones de Demanda e Intención de Búsqueda */}
      {(activeTab === 'all' || activeTab === 'demand') && (
        <>
        {/* Grupo de Indicadores de Hardware (4 Gauges) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Indicador 1: Líder Real de Cuota de Búsqueda */}
          <div className="bg-white rounded-2xl p-5 border border-[#E2E5E9] shadow-xs relative overflow-hidden">
            <div className="flex items-center justify-between mb-3">
              <span className="ram-label text-[10px] text-[#6E7380]">INDICADOR 01 // DOMINANCIA</span>
              <span className="w-2 h-2 rounded-full bg-[#FFBA08]"></span>
            </div>
            <p className="text-xs text-[#6E7380] font-mono mb-1">LÍDER DE MERCADO</p>
            <div className="flex items-baseline space-x-2 mb-2">
              <span className="text-2xl font-black text-[#161B26] font-display tracking-tight truncate">
                {marketLeader?.brand || 'N/A'}
              </span>
              <span className="font-mono text-sm font-bold text-[#FFBA08]">
                {marketLeader?.shareOfSearch}%
              </span>
            </div>
            {/* Barra de nivel LED */}
            <div className="flex space-x-1 mt-3">
              {Array.from({ length: 12 }).map((_, idx) => {
                const activeCount = Math.round(((marketLeader?.shareOfSearch || 0) / 100) * 12);
                const isActive = idx < activeCount;
                return (
                  <div 
                    key={idx}
                    className={`h-2 flex-1 rounded-xs transition-all duration-300 ${
                      isActive 
                        ? idx > 8 ? 'bg-[#FFBA08]' : 'bg-[#161B26]'
                        : 'bg-[#E2E5E9]'
                    }`}
                  />
                );
              })}
            </div>
          </div>

          {/* Indicador 2: Vector de Intención Dominante */}
          <div className="bg-white rounded-2xl p-5 border border-[#E2E5E9] shadow-xs relative overflow-hidden">
            <div className="flex items-center justify-between mb-3">
              <span className="ram-label text-[10px] text-[#6E7380]">INDICADOR 02 // VECTOR DE INTENCIÓN</span>
              <Target className="w-3.5 h-3.5 text-[#6E7380]" />
            </div>
            <p className="text-xs text-[#6E7380] font-mono mb-1">INTENCIÓN DOMINANTE</p>
            <div className="flex items-baseline space-x-2 mb-2">
              <span className="text-xl font-black text-[#161B26] font-display tracking-tight uppercase">
                {marketLeader?.topIntent || 'Transaccional'}
              </span>
            </div>
            <div className="mt-2 text-[11px] font-mono text-[#525866] flex items-center justify-between border-t border-[#E2E5E9] pt-2">
              <span>LÍDER</span>
              <span className="font-bold text-[#161B26] uppercase truncate">{marketLeader?.brand}</span>
            </div>
          </div>

          {/* Indicador 3: Volumen Total de la Categoría */}
          <div className="bg-white rounded-2xl p-5 border border-[#E2E5E9] shadow-xs relative overflow-hidden">
            <div className="flex items-center justify-between mb-3">
              <span className="ram-label text-[10px] text-[#6E7380]">INDICADOR 03 // VOLUMEN TOTAL CATEGORÍA</span>
              <Activity className="w-3.5 h-3.5 text-[#6E7380]" />
            </div>
            <p className="text-xs text-[#6E7380] font-mono mb-1">DEMANDA DE BÚSQUEDA TOTAL</p>
            <div className="flex items-baseline space-x-2 mb-2">
              <span className="text-xl sm:text-2xl font-black text-[#161B26] font-mono truncate">
                {report.categoryTotalSearchVolume || `${report.brands.length} Marcas`}
              </span>
            </div>
            <div className="mt-2 text-[11px] font-mono text-[#525866] flex items-center justify-between border-t border-[#E2E5E9] pt-2">
              <span>BASE DE CÁLCULO</span>
              <span className="font-bold text-[#10B981]">100% CATEGORÍA</span>
            </div>
          </div>

          {/* Indicador 4: Sentimiento del Consumidor */}
          <div className="bg-white rounded-2xl p-5 border border-[#E2E5E9] shadow-xs relative overflow-hidden">
            <div className="flex items-center justify-between mb-3">
              <span className="ram-label text-[10px] text-[#6E7380]">INDICADOR 04 // ÍNDICE DE SENTIMIENTO</span>
              <Gauge className="w-3.5 h-3.5 text-[#6E7380]" />
            </div>
            <p className="text-xs text-[#6E7380] font-mono mb-1">PERCEPCIÓN DEL CONSUMIDOR</p>
            <div className="flex items-baseline space-x-2 mb-2">
              <span className="text-2xl font-black text-[#161B26] font-mono">
                {Math.round(report.brands.reduce((acc, b) => acc + (b.sentiment?.positive || 0), 0) / (report.brands.length || 1))}%
              </span>
              <span className="text-xs font-mono font-bold text-[#10B981]">RATIO POSITIVO</span>
            </div>
            {/* Medidor tricolor */}
            <div className="w-full bg-[#E2E5E9] h-2 rounded-xs overflow-hidden flex mt-3">
              <div 
                style={{ width: `${Math.round(report.brands.reduce((acc, b) => acc + (b.sentiment?.positive || 0), 0) / (report.brands.length || 1))}%` }} 
                className="bg-[#10B981] h-full"
              />
              <div 
                style={{ width: `${Math.round(report.brands.reduce((acc, b) => acc + (b.sentiment?.neutral || 0), 0) / (report.brands.length || 1))}%` }} 
                className="bg-[#FFBA08] h-full"
              />
              <div 
                style={{ width: `${Math.round(report.brands.reduce((acc, b) => acc + (b.sentiment?.negative || 0), 0) / (report.brands.length || 1))}%` }} 
                className="bg-[#EF4444] h-full"
              />
            </div>
          </div>
        </div>

        {/* Fila de Gráficos Principales: Osciloscopio & Barras de Cuota de Búsqueda */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Gráfico Osciloscopio de Tendencias (7 columnas) */}
          <div className="lg:col-span-7 bg-white rounded-2xl p-5 sm:p-6 border border-[#E2E5E9] shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-4 border-b border-[#E2E5E9] gap-3">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 rounded-xs bg-[#FFBA08]"></span>
                  <h3 className="text-sm font-bold font-mono tracking-wider uppercase text-[#161B26]">
                    OSCILOSCOPIO DE INTERÉS DE BÚSQUEDA
                  </h3>
                </div>
                <p className="text-[11px] text-[#6E7380] font-mono mt-0.5">
                  VELOCIDAD TEMPORAL COMPARATIVA A 12 MESES
                </p>
              </div>

              {/* Filtros Interactivos de Canales */}
              <div className="flex flex-wrap items-center gap-1.5">
                <button
                  onClick={() => {
                    ramAudio.playClick(750, 0.03);
                    setActiveCurve(null);
                  }}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold transition-colors ${
                    activeCurve === null 
                      ? 'bg-[#161B26] text-white' 
                      : 'bg-[#F4F6F8] text-[#525866] hover:bg-[#E2E5E9]'
                  }`}
                >
                  TODAS
                </button>
                {brandNames.map((brand, i) => (
                  <button
                    key={brand}
                    onClick={() => {
                      ramAudio.playClick(650 + i * 80, 0.03);
                      setActiveCurve(activeCurve === brand ? null : brand);
                    }}
                    style={{
                      borderColor: activeCurve === brand ? getChannelColor(i) : undefined,
                    }}
                    className={`px-2 py-1 rounded-lg text-[10px] font-mono font-bold transition-all flex items-center space-x-1 ${
                      activeCurve === brand 
                        ? 'bg-white text-[#161B26] border-2 shadow-xs' 
                        : 'bg-[#F4F6F8] text-[#525866] hover:bg-[#E2E5E9]'
                    }`}
                  >
                    <span 
                      className="w-1.5 h-1.5 rounded-full" 
                      style={{ backgroundColor: getChannelColor(i) }}
                    />
                    <span>{brand}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="h-72 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="2 2" stroke="#EDF0F3" vertical={false} />
                  <XAxis 
                    dataKey="date" 
                    tick={{ fontSize: 10, fontFamily: 'monospace', fill: '#6E7380' }} 
                    tickLine={false} 
                    axisLine={{ stroke: '#E2E5E9' }} 
                  />
                  <YAxis 
                    tick={{ fontSize: 10, fontFamily: 'monospace', fill: '#6E7380' }} 
                    tickLine={false} 
                    axisLine={false} 
                  />
                  <Tooltip 
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-[#161B26] text-white p-3 rounded-xl border border-[#2B3242] shadow-xl font-mono text-xs space-y-1.5 min-w-[160px]">
                            <div className="text-[10px] text-[#9499A5] border-b border-[#232836] pb-1 font-bold">
                              PERÍODO // {label}
                            </div>
                            {payload.map((entry, index) => (
                              <div key={index} className="flex items-center justify-between space-x-3">
                                <span className="flex items-center space-x-1.5 text-[#D4D7DC]">
                                  <span 
                                    className="w-2 h-2 rounded-full" 
                                    style={{ backgroundColor: entry.color }}
                                  />
                                  <span className="truncate max-w-[100px]">{entry.name}:</span>
                                </span>
                                <span className="font-bold text-white">{entry.value}</span>
                              </div>
                            ))}
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  {brandNames.map((brand, i) => {
                    const isDimmed = activeCurve !== null && activeCurve !== brand;
                    const isHighlighted = activeCurve === brand;
                    return (
                      <Line 
                        key={brand} 
                        type="monotone" 
                        dataKey={brand} 
                        name={brand}
                        stroke={getChannelColor(i)} 
                        strokeWidth={isHighlighted ? 3.5 : isDimmed ? 1 : 2} 
                        opacity={isDimmed ? 0.2 : 1}
                        dot={isHighlighted ? { r: 4, fill: getChannelColor(i) } : false}
                        activeDot={{ r: 5, strokeWidth: 1, stroke: '#FFFFFF' }}
                      />
                    );
                  })}
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-4 pt-3 border-t border-[#E2E5E9] flex items-center justify-between text-[11px] font-mono text-[#6E7380]">
              <div className="flex items-center space-x-1">
                <span className="inline-block w-2 h-2 bg-[#10B981] rounded-full mr-1"></span>
                <span>BASADO EN SEÑALES REALES DE GOOGLE SEARCH</span>
              </div>
              <span>ESCALA: 0-100 NORMALIZADA</span>
            </div>
          </div>

          {/* Barras de Cuota de Búsqueda (Share of Search - 5 columnas) */}
          <div className="lg:col-span-5 bg-white rounded-2xl p-5 sm:p-6 border border-[#E2E5E9] shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#E2E5E9]">
                <div className="flex items-center space-x-2">
                  <BarChart3 className="w-4 h-4 text-[#FFBA08]" />
                  <h3 className="text-sm font-bold font-mono tracking-wider uppercase text-[#161B26]">
                    CUOTA DE BÚSQUEDA // SOS
                  </h3>
                </div>
                <span className="text-[10px] font-mono text-[#161B26] bg-[#FFF8D6] border border-[#EADB9F] px-2 py-0.5 rounded-full font-bold">
                  % PROPORCIONAL DE CATEGORÍA
                </span>
              </div>

              {/* Fila de Sustento Metodológico con Volumen de Categoría */}
              <div className="bg-[#F4F6F8] p-2.5 rounded-xl border border-[#E2E5E9] mb-4">
                <div className="flex items-center justify-between text-xs font-mono mb-1">
                  <span className="text-[#6E7380] text-[11px] font-bold">VOLUMEN TOTAL CATEGORÍA:</span>
                  <span className="font-bold text-[#161B26] bg-white px-2 py-0.5 rounded border border-[#E2E5E9]">
                    {report.categoryTotalSearchVolume || 'Calculando...'}
                  </span>
                </div>
                <p className="text-[10px] text-[#6E7380] font-mono leading-tight">
                  Sustento: <strong className="text-[#161B26]">SOS % = (Volumen Marca ÷ Total Categoría) × 100</strong>
                </p>
              </div>

              {/* Barras de Nivel Calibradas (Ordenadas por Cuota Real) */}
              <div className="space-y-4">
                {sortedBrandsForSOS.map((brand, i) => {
                  const originalIndex = report.brands.findIndex(b => b.brand === brand.brand);
                  const isLeader = i === 0;
                  return (
                    <div key={brand.brand} className="group">
                      <div className="flex items-center justify-between text-xs mb-1.5 font-mono">
                        <div className="flex items-center space-x-2">
                          <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold flex items-center justify-center border ${
                            isLeader 
                              ? 'bg-[#161B26] text-white border-[#161B26]' 
                              : 'bg-[#F4F6F8] text-[#525866] border-[#E2E5E9]'
                          }`}>
                            {isLeader ? '01 LÍDER' : `0${i + 1}`}
                          </span>
                          <span className="font-bold text-[#161B26]">{brand.brand}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-[#6E7380] text-[11px]">{brand.searchVolume}</span>
                          <span className="font-bold text-sm text-[#161B26]">{brand.shareOfSearch}%</span>
                        </div>
                      </div>

                      {/* Pista del Medidor */}
                      <div className="w-full bg-[#F4F6F8] h-3.5 rounded-full p-0.5 border border-[#E2E5E9] relative overflow-hidden">
                        <div 
                          className="h-full rounded-full transition-all duration-700 relative"
                          style={{ 
                            width: `${Math.min(100, Math.max(2, brand.shareOfSearch))}%`,
                            backgroundColor: getChannelColor(originalIndex >= 0 ? originalIndex : i)
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Escala de Calibración */}
            <div className="mt-6 pt-3 border-t border-[#E2E5E9]">
              <div className="flex justify-between text-[10px] font-mono text-[#6E7380] px-1">
                <span>0%</span>
                <span>25%</span>
                <span>50%</span>
                <span>75%</span>
                <span>100%</span>
              </div>
              <div className="h-1.5 w-full ram-ticks mt-1 opacity-60" />
              <p className="text-[10px] text-[#6E7380] font-mono mt-2 text-center">
                LA CUOTA DE BÚSQUEDA SUSTENTADA EN VOLUMEN PREDICE LA CUOTA DE MERCADO
              </p>
            </div>
          </div>
        </div>

        {/* Módulos de Marcas: Perfiles de Intención & Decodificación */}
        <div className="bg-white rounded-2xl p-6 border border-[#E2E5E9] shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-6 border-b border-[#E2E5E9] gap-2">
            <div>
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 bg-[#10B981] rounded-full"></span>
                <h3 className="text-base font-bold font-mono tracking-wider uppercase text-[#161B26]">
                  PERFILES DE INTENCIÓN Y DECODIFICACIÓN DE BÚSQUEDA
                </h3>
              </div>
              <p className="text-xs text-[#6E7380] font-mono mt-0.5">
                CLASIFICACIÓN DE INTENCIÓN Y VOLUMEN MENSUAL EN {report.location.toUpperCase()}
              </p>
            </div>
            <div className="text-[11px] font-mono text-[#161B26] bg-[#F4F6F8] px-3 py-1 rounded-lg border border-[#E2E5E9] font-bold">
              {report.brands.length} CANALES ACTIVOS
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {report.brands.map((brand, i) => (
              <div 
                key={brand.brand} 
                className="bg-[#FAFBFD] rounded-2xl p-5 border border-[#E2E5E9] hover:border-[#FFBA08] transition-all relative overflow-hidden flex flex-col justify-between shadow-xs"
              >
                <div>
                  {/* Cabecera del canal con métricas individuales */}
                  <div className="flex items-center justify-between mb-3.5 pb-3 border-b border-[#E2E5E9] gap-2">
                    <div className="flex items-center space-x-2 min-w-0">
                      <span 
                        className="w-3 h-3 rounded-full border border-black/10 flex-shrink-0"
                        style={{ backgroundColor: getChannelColor(i) }}
                      />
                      <span className="font-mono text-xs font-bold text-[#6E7380] flex-shrink-0">
                        CH-0{i + 1}
                      </span>
                      <h4 className="font-bold text-[#161B26] text-base font-display truncate">
                        {brand.brand}
                      </h4>
                    </div>

                    <div className="flex items-center space-x-1.5 flex-shrink-0">
                      <span className="font-mono text-[10px] font-bold bg-white border border-[#E2E5E9] px-2 py-0.5 rounded text-[#161B26]">
                        {brand.searchVolume}
                      </span>
                      <span 
                        className="font-mono text-[10px] font-bold text-white px-2 py-0.5 rounded"
                        style={{ backgroundColor: getChannelColor(i) }}
                      >
                        {brand.shareOfSearch}% SOS
                      </span>
                    </div>
                  </div>

                  {/* Lectura Diagnóstica Individualizada */}
                  <div className="mb-4 bg-white p-3.5 rounded-xl border border-[#E2E5E9] space-y-2">
                    <div className="flex items-center justify-between text-[11px] font-mono text-[#6E7380] border-b border-[#F0F2F5] pb-1.5">
                      <span className="font-bold text-[#161B26]">INTENCIÓN DOMINANTE:</span>
                      <span 
                        className="font-bold px-2 py-0.5 rounded text-[10px]"
                        style={{ 
                          backgroundColor: `${getChannelColor(i)}15`,
                          color: '#161B26'
                        }}
                      >
                        {brand.topIntent}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#2D3139] leading-relaxed font-sans">
                      {brand.intentDiagnostic || (
                        brand.topIntent.toLowerCase().includes('trans') 
                          ? `Para ${brand.brand}, los usuarios buscan activamente contratar, comprar o solicitar servicios online con alta disposición transaccional.`
                          : brand.topIntent.toLowerCase().includes('comerc')
                          ? `Para ${brand.brand}, los usuarios priorizan evaluar comparativas, planes competitivos y ofertas antes de tomar la decisión.`
                          : brand.topIntent.toLowerCase().includes('nav')
                          ? `Para ${brand.brand}, el tráfico dominante es de clientes fidelizados que acceden directamente a su plataforma, app o red de agencias.`
                          : `Para ${brand.brand}, las consultas se concentran en investigación informativa de requisitos y soporte técnico.`
                      )}
                    </p>

                    {/* Consulta de mayor tracción individual */}
                    {brand.topConvertingQuery && (
                      <div className="pt-2 border-t border-[#F0F2F5] text-[10px] font-mono">
                        <span className="text-[#6E7380] uppercase block text-[9px] font-bold">Consulta de Mayor Tracción:</span>
                        <span className="text-[#161B26] font-semibold block truncate bg-[#F8F9FB] px-2 py-1 rounded border border-[#E2E5E9] mt-0.5">
                          "{brand.topConvertingQuery}"
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Desglose de 4 Intenciones Diferenciado */}
                  <div className="space-y-2.5 mb-4">
                    <div className="flex justify-between items-center">
                      <p className="ram-label text-[9px] text-[#6E7380]">DISTRIBUCIÓN INDIVIDUAL DE INTENCIÓN</p>
                      <span className="text-[9px] font-mono text-[#8C919D]">SUMA 100%</span>
                    </div>
                    {brand.intentBreakdown.map(item => (
                      <div key={item.intent} className="text-xs">
                        <div className="flex justify-between font-mono text-[11px] mb-1">
                          <span className="text-[#525866]">{item.intent}</span>
                          <span className="font-bold text-[#161B26]">{item.percentage}%</span>
                        </div>
                        <div className="w-full bg-[#E2E5E9] h-2 rounded-full overflow-hidden">
                          <div 
                            className="h-full rounded-full transition-all duration-500"
                            style={{ 
                              width: `${item.percentage}%`,
                              backgroundColor: getChannelColor(i)
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Pie de tarjeta con Diferenciador y Sentimiento */}
                <div className="pt-3 border-t border-[#E2E5E9] space-y-2">
                  {brand.competitiveDifferentiator && (
                    <div className="text-[10px] text-[#525866] leading-tight">
                      <span className="font-bold text-[#161B26] font-mono text-[9px] uppercase block">Diferenciador en Búsquedas:</span>
                      <p className="mt-0.5">{brand.competitiveDifferentiator}</p>
                    </div>
                  )}
                  <div className="flex items-center justify-between text-[11px] font-mono text-[#6E7380] pt-1">
                    <span>SENTIMIENTO:</span>
                    <span className="font-bold text-[#10B981]">
                      {brand.sentiment?.positive || 0}% POSITIVO
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tabla de Telemetría de Palabras Clave */}
        <div className="bg-white rounded-2xl border border-[#E2E5E9] shadow-xs overflow-hidden">
          <div className="p-5 border-b border-[#E2E5E9] flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div>
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 rounded-xs bg-[#FFBA08]" />
                <h3 className="text-sm font-bold font-mono tracking-wider uppercase text-[#161B26]">
                  TELEMETRÍA DE PALABRAS CLAVE E INTENCIÓN
                </h3>
              </div>
              <p className="text-[11px] text-[#6E7380] font-mono mt-0.5">
                TÉRMINOS DE BÚSQUEDA CLASIFICADOS POR INTENCIÓN Y VELOCIDAD DE CRECIMIENTO
              </p>
            </div>

            {/* Filtros de la Tabla */}
            <div className="flex flex-wrap items-center gap-2">
              {/* Filtro por Marca */}
              <div className="flex items-center space-x-1 bg-[#F4F6F8] px-2.5 py-1 rounded-lg border border-[#E2E5E9] text-xs font-mono">
                <span className="text-[#6E7380] text-[10px]">MARCA:</span>
                <select
                  value={selectedBrandFilter || ''}
                  onChange={(e) => {
                    ramAudio.playClick(700, 0.02);
                    setSelectedBrandFilter(e.target.value ? e.target.value : null);
                  }}
                  className="bg-transparent border-none text-xs font-bold text-[#161B26] focus:ring-0 p-0 cursor-pointer"
                >
                  <option value="">TODAS LAS MARCAS</option>
                  {brandNames.map(b => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
              </div>

              {/* Filtro por Intención */}
              <div className="flex items-center space-x-1 bg-[#F4F6F8] px-2.5 py-1 rounded-lg border border-[#E2E5E9] text-xs font-mono">
                <span className="text-[#6E7380] text-[10px]">INTENCIÓN:</span>
                <select
                  value={selectedIntentFilter || ''}
                  onChange={(e) => {
                    ramAudio.playClick(700, 0.02);
                    setSelectedIntentFilter(e.target.value ? e.target.value : null);
                  }}
                  className="bg-transparent border-none text-xs font-bold text-[#161B26] focus:ring-0 p-0 cursor-pointer"
                >
                  <option value="">TODAS LAS INTENCIONES</option>
                  <option value="trans">TRANSACCIONAL</option>
                  <option value="comerc">COMERCIAL</option>
                  <option value="nav">NAVEGACIONAL</option>
                  <option value="info">INFORMATIVA</option>
                </select>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs">
              <thead>
                <tr className="bg-[#F4F6F8] border-b border-[#E2E5E9] text-[#6E7380]">
                  <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-wider">CANAL / MARCA</th>
                  <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-wider">TÉRMINO DE BÚSQUEDA</th>
                  <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-wider">TIPO DE INTENCIÓN</th>
                  <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-wider">VOL. ESTIMADO</th>
                  <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-wider">CRECIMIENTO</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E5E9] bg-white">
                {filteredInsights.length > 0 ? (
                  filteredInsights.map((insight, idx) => {
                    const brandIndex = brandNames.indexOf(insight.brand || '');
                    const brandColor = brandIndex >= 0 ? getChannelColor(brandIndex) : '#555';
                    return (
                      <tr key={idx} className="hover:bg-[#F4F6F8] transition-colors">
                        <td className="px-5 py-3.5 font-bold text-[#161B26] flex items-center space-x-2">
                          <span 
                            className="w-2 h-2 rounded-full flex-shrink-0"
                            style={{ backgroundColor: brandColor }}
                          />
                          <span>{insight.brand || 'MERCADO'}</span>
                        </td>
                        <td className="px-5 py-3.5 font-semibold text-[#161B26] font-sans">
                          {insight.keyword}
                        </td>
                        <td className="px-5 py-3.5">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getIntentBadgeStyle(insight.intent)}`}>
                            {insight.intent}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 text-[#525866] font-bold">
                          {insight.volume}
                        </td>
                        <td className="px-5 py-3.5">
                          <span className={`inline-flex items-center text-xs font-bold ${
                            insight.growth >= 0 ? 'text-[#10B981]' : 'text-[#EF4444]'
                          }`}>
                            {insight.growth >= 0 ? (
                              <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" />
                            ) : (
                              <ArrowDownRight className="w-3.5 h-3.5 mr-0.5" />
                            )}
                            {Math.abs(insight.growth)}%
                          </span>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={5} className="px-5 py-8 text-center text-[#9499A5]">
                      NO HAY TÉRMINOS QUE COINCIDAN CON LOS FILTROS
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* MÓDULO 1 TAXONOMÍA: Tipología Descriptiva de Intención para Categoría y Marcas */}
        <TaxonomyIntentModule
          categoryQueries={decodedTaxonomyData.categoryQueries}
          brands={decodedTaxonomyData.brandsWithQueries}
          location={report.location}
          categoryTopic={report.topic}
        />

        {/* Análisis de Inteligencia de Búsqueda y Directivas Estratégicas */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Análisis de Inteligencia (7 cols) */}
          <div className="lg:col-span-7 bg-white rounded-2xl p-6 sm:p-7 border border-[#E2E5E9] shadow-xs">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#E2E5E9]">
              <div className="flex items-center space-x-2">
                <FileText className="w-4 h-4 text-[#FFBA08]" />
                <h3 className="text-sm font-bold font-mono tracking-wider uppercase text-[#161B26]">
                  ANÁLISIS DE INTELIGENCIA DE BÚSQUEDA
                </h3>
              </div>
              <span className="text-[10px] font-mono text-[#6E7380] bg-[#F4F6F8] px-2 py-0.5 rounded border border-[#E2E5E9]">
                REF // {report.location.toUpperCase()}
              </span>
            </div>

            <div className="prose prose-sm max-w-none text-[#2B3242] leading-relaxed font-sans">
              <ReactMarkdown>{report.summary}</ReactMarkdown>
            </div>
          </div>

          {/* Directivas Accionables (5 cols - Obsidiana de la paleta) */}
          <div className="lg:col-span-5 bg-[#161B26] text-white rounded-2xl p-6 sm:p-7 border border-[#232836] shadow-lg flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 mb-5 border-b border-[#2B3242]">
                <div className="flex items-center space-x-2">
                  <Zap className="w-4 h-4 text-[#FFBA08]" />
                  <h3 className="text-sm font-bold font-mono tracking-wider uppercase text-white">
                    DIRECTIVAS ESTRATÉGICAS
                  </h3>
                </div>
                <span className="text-[10px] font-mono text-[#161B26] font-bold bg-[#FFBA08] px-2 py-0.5 rounded-full">
                  PRIORIDAD ALTA
                </span>
              </div>

              <div className="space-y-4">
                {report.recommendations.map((rec, i) => (
                  <div key={i} className="flex items-start space-x-3 text-xs leading-relaxed">
                    <div className="w-5 h-5 rounded-full bg-[#FFBA08] text-[#161B26] flex items-center justify-center flex-shrink-0 font-mono text-[10px] font-bold mt-0.5">
                      {i + 1}
                    </div>
                    <p className="text-[#D4D7DC] font-sans">
                      {rec}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-[#232836] flex items-center justify-between text-[10px] font-mono text-[#9499A5]">
              <span>PROTOCOLO DE DIRECTIVAS</span>
              <span className="text-[#FFBA08] font-bold">RAM OS // VERIFICADO</span>
            </div>
          </div>
        </div>
        </>
      )}

      {/* Módulo 2: Recomendación SEM & Framework Numérico */}
      {(activeTab === 'all' || activeTab === 'sem') && (
        <SemStrategyModule 
          semStrategy={semStrategy}
          brands={report.brands}
          location={report.location}
        />
      )}

      {/* Modal del Instructivo Completo y Manual de la Herramienta */}
      <SystemGuideModal 
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
      />
    </div>
  );
};
