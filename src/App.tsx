import React, { useState, useEffect } from 'react';
import { 
  Search, 
  MapPin, 
  Volume2, 
  VolumeX, 
  RotateCcw, 
  Plus, 
  X, 
  Sparkles, 
  History, 
  ArrowRight,
  Radio,
  Cpu,
  Layers,
  ChevronRight,
  Sliders,
  BookOpen
} from 'lucide-react';
import { researchService } from './services/researchService';
import { ResearchReport } from './types';
import { Dashboard, RAM_COLORS } from './components/Dashboard';
import { SystemGuideModal } from './components/SystemGuideModal';
import { motion, AnimatePresence } from 'motion/react';
import { ramAudio } from './utils/audio';

// Presets del mercado ecuatoriano para comparativas instantáneas
const ECUADOR_PRESETS = [
  {
    category: 'SUPERMERCADOS & RETAIL',
    brands: ['Supermaxi', 'Mi Comisariato', 'Tipti', 'Coral', 'Santa María']
  },
  {
    category: 'BANCA & FINTECH',
    brands: ['Banco Pichincha', 'Banco Guayaquil', 'Produbanco', 'Banco del Pacífico', 'Deuna']
  },
  {
    category: 'TELECOM & CONECTIVIDAD',
    brands: ['Claro', 'Movistar', 'CNT', 'Tuenti', 'Netlife']
  },
  {
    category: 'E-COMMERCE & DELIVERY',
    brands: ['Mercado Libre', 'De Prati', 'PedidosYa', 'Rappi', 'Tipti']
  },
  {
    category: 'AUTOMOTRIZ',
    brands: ['Chevrolet', 'Kia', 'Toyota', 'Hyundai', 'Chery']
  }
];

export default function App() {
  const [brands, setBrands] = useState<string[]>(['Supermaxi', 'Mi Comisariato', 'Tipti']);
  const [inputBrand, setInputBrand] = useState('');
  const [location, setLocation] = useState('Ecuador');
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [report, setReport] = useState<ResearchReport | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<string[]>([
    'Supermaxi, Mi Comisariato, Tipti',
    'Banco Pichincha, Banco Guayaquil, Produbanco'
  ]);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [currentTime, setCurrentTime] = useState('');
  const [isGuideOpen, setIsGuideOpen] = useState(false);

  // Reloj de telemetría en tiempo real
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('es-EC', { hour12: false }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Animación del escáner de carga
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (loading) {
      setLoadingStep(0);
      interval = setInterval(() => {
        setLoadingStep(prev => (prev < 4 ? prev + 1 : prev));
      }, 1600);
    }
    return () => clearInterval(interval);
  }, [loading]);

  const toggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    ramAudio.enabled = next;
    if (next) ramAudio.playClick(900, 0.03);
  };

  const addBrand = (name: string) => {
    const trimmed = name.trim();
    if (!trimmed) return;
    if (brands.length >= 5) return;
    if (!brands.some(b => b.toLowerCase() === trimmed.toLowerCase())) {
      ramAudio.playClick(750, 0.03);
      setBrands(prev => [...prev, trimmed]);
    }
    setInputBrand('');
  };

  const removeBrand = (index: number) => {
    ramAudio.playClick(500, 0.03);
    setBrands(prev => prev.filter((_, i) => i !== index));
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addBrand(inputBrand);
    }
  };

  const applyPreset = (presetBrands: string[]) => {
    ramAudio.playSwitch();
    setBrands(presetBrands.slice(0, 5));
    setError(null);
  };

  const handleExecuteScan = async (searchTopicQuery?: string) => {
    ramAudio.playExecute();
    let topicToSearch = '';

    if (searchTopicQuery) {
      topicToSearch = searchTopicQuery;
      const parsed = searchTopicQuery.split(',').map(s => s.trim()).filter(Boolean);
      if (parsed.length > 0) {
        setBrands(parsed.slice(0, 5));
      }
    } else {
      if (inputBrand.trim() && brands.length < 5) {
        addBrand(inputBrand);
      }
      if (brands.length === 0 && !inputBrand.trim()) {
        setError('POR FAVOR INGRESA AL MENOS 1 MARCA PARA EL ANÁLISIS');
        return;
      }
      const allBrands = inputBrand.trim() && !brands.includes(inputBrand.trim()) 
        ? [...brands, inputBrand.trim()].slice(0, 5) 
        : brands;
      topicToSearch = allBrands.join(', ');
    }

    setLoading(true);
    setError(null);

    try {
      const result = await researchService.researchTopic(topicToSearch, location);
      setReport(result);
      ramAudio.playBeep();
      if (!history.includes(topicToSearch)) {
        setHistory(prev => [topicToSearch, ...prev].slice(0, 5));
      }
    } catch (err) {
      console.error(err);
      setError('ERROR DE CONEXIÓN: NO SE PUDO OBTENER TELEMETRÍA DE BÚSQUEDA. INTENTA DE NUEVO.');
    } finally {
      setLoading(false);
    }
  };

  const loadingMessages = [
    'CONECTANDO AL BUS DE DATOS DE GOOGLE SEARCH...',
    `INDEXANDO VOLÚMENES DE BÚSQUEDA EN ${location.toUpperCase()}...`,
    'CLASIFICANDO INTENCIÓN: TRANSACCIONAL / COMERCIAL / NAVEGACIONAL...',
    'CALIBRANDO ESTRATEGIA SEM Y PLAN DE MEDIOS (USD)...',
    'FINALIZANDO INFORME EJECUTIVO DE TELEMETRÍA...'
  ];

  return (
    <div className="min-h-screen bg-[#F0F2F5] text-[#161B26] font-sans pb-16 selection:bg-[#FFBA08] selection:text-[#161B26]">
      {/* Barra de Sistema Superior (Clean UX Header) */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#E2E5E9] shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Logotipo e Identidad (Icono con punto negro de la paleta) */}
            <div 
              className="flex items-center space-x-3 cursor-pointer group"
              onClick={() => {
                ramAudio.playSwitch();
                setReport(null);
              }}
            >
              <div className="w-8 h-8 rounded-lg bg-[#FFBA08] flex items-center justify-center border border-[#E5A700] shadow-xs group-hover:scale-105 transition-all">
                {/* Punto negro emblemático de la paleta */}
                <div className="w-2.5 h-2.5 rounded-full bg-[#161B26]" />
              </div>

              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-extrabold tracking-tight text-lg text-[#161B26] font-display">
                    RAM SEARCH
                  </span>
                  <span className="text-[10px] font-mono font-bold bg-[#161B26] text-white px-1.5 py-0.5 rounded">
                    OS 3.8
                  </span>
                </div>
                <p className="text-[9px] font-mono uppercase tracking-widest text-[#6E7380] -mt-0.5">
                  INTELIGENCIA DE BÚSQUEDA & SEM
                </p>
              </div>
            </div>

            {/* Centro: Estado de Telemetría */}
            <div className="hidden md:flex items-center space-x-6 text-xs font-mono text-[#525866]">
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
                <span className="font-bold text-[#161B26]">CONEXIÓN EN VIVO: GOOGLE DATA</span>
              </div>

              <div className="h-4 w-px bg-[#E2E5E9]" />

              <div className="flex items-center space-x-1.5">
                <Radio className="w-3.5 h-3.5 text-[#FFBA08]" />
                <span className="text-[#161B26] font-bold">104.8 MHz</span>
              </div>

              <div className="h-4 w-px bg-[#E2E5E9]" />

              <div className="flex items-center space-x-1.5">
                <span className="text-[#6E7380]">HORA //</span>
                <span className="font-bold text-[#161B26]">{currentTime || '12:00:00'}</span>
              </div>
            </div>

            {/* Derecha: Instructivo, Selector de Región y Sonido */}
            <div className="flex items-center space-x-2.5">
              {/* Botón Instructivo & Manual */}
              <button
                onClick={() => {
                  ramAudio.playClick(800, 0.03);
                  setIsGuideOpen(true);
                }}
                className="flex items-center space-x-1.5 bg-white border border-[#E2E5E9] hover:bg-[#F4F6F8] px-2.5 py-1.5 rounded-lg text-xs font-mono font-bold text-[#161B26] shadow-xs transition-colors"
                title="Ver instructivo detallado y guía de uso"
              >
                <BookOpen className="w-3.5 h-3.5 text-[#2563EB]" />
                <span className="hidden sm:inline">INSTRUCTIVO</span>
              </button>

              {/* Selector de Región */}
              <div className="flex items-center bg-[#F4F6F8] p-1 rounded-lg border border-[#E2E5E9]">
                <MapPin className="w-3.5 h-3.5 ml-1.5 text-[#FFBA08]" />
                <select
                  value={location}
                  onChange={(e) => {
                    ramAudio.playClick(800, 0.03);
                    setLocation(e.target.value);
                  }}
                  className="bg-transparent border-none text-xs font-mono font-bold text-[#161B26] focus:ring-0 cursor-pointer pl-1.5 pr-2 py-0.5 uppercase"
                >
                  <option value="Ecuador">Ecuador [EC-593]</option>
                  <option value="Colombia">Colombia [CO-57]</option>
                  <option value="Perú">Perú [PE-51]</option>
                  <option value="México">México [MX-52]</option>
                  <option value="Global">Global [WW-00]</option>
                </select>
              </div>

              {/* Botón de Sonido Mecánico */}
              <button
                onClick={toggleSound}
                title={soundEnabled ? 'Silenciar clics de hardware' : 'Activar clics de hardware'}
                className="w-8 h-8 rounded-lg bg-white border border-[#E2E5E9] hover:bg-[#F4F6F8] flex items-center justify-center text-[#525866] shadow-xs transition-colors"
              >
                {soundEnabled ? (
                  <Volume2 className="w-4 h-4 text-[#161B26]" />
                ) : (
                  <VolumeX className="w-4 h-4 text-[#9499A5]" />
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Contenedor Principal */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <AnimatePresence mode="wait">
          {!report ? (
            <motion.div
              key="search-deck"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="max-w-4xl mx-auto space-y-8"
            >
              {/* Consola Principal (Clean UX Card) */}
              <div className="bg-white rounded-2xl p-6 sm:p-10 border border-[#E2E5E9] shadow-sm relative overflow-hidden">
                {/* Detalle visual sutil */}
                <div className="absolute top-0 right-0 w-32 h-20 ram-grille opacity-40 pointer-events-none" />

                {/* Encabezado Técnico */}
                <div className="mb-8">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-[#FFF8D6] text-[#161B26] border border-[#EADB9F]">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#FFBA08] mr-1.5" />
                      SISTEMA RAM-SEARCH // DIETER RAMS
                    </span>
                    <span className="text-[#CFD3D8] text-xs font-mono">|</span>
                    <span className="text-xs font-mono text-[#6E7380] font-bold">
                      MERCADO: {location.toUpperCase()}
                    </span>
                  </div>

                  <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-[#161B26] font-display">
                    INTENCIÓN DE BÚSQUEDA Y <span className="text-[#FFBA08] underline decoration-[#161B26] decoration-4 underline-offset-4">ESTRATEGIA SEM</span>
                  </h2>

                  <p className="text-sm sm:text-base text-[#525866] mt-3 max-w-2xl leading-relaxed">
                    Consola de inteligencia de mercado basada en telemetría de Google Search. 
                    Compara hasta 5 marcas simultáneamente en <strong>{location}</strong> para descubrir dominancia de demanda, 
                    clasificación de intención y un plan integral de compra de medios SEM en USD.
                  </p>
                </div>

                {/* Ranuras de Canales de Marca */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="ram-label text-[11px] font-bold text-[#161B26]">
                      CANALES DE MARCA [{brands.length}/5 CONFIGURADOS]
                    </span>
                    <span className="text-[10px] font-mono text-[#6E7380]">
                      PULSA ENTER O COMA PARA AGREGAR
                    </span>
                  </div>

                  {/* Chips de Marcas */}
                  <div className="flex flex-wrap gap-2.5 p-3.5 bg-[#F4F6F8] rounded-xl border border-[#E2E5E9] min-h-[58px] items-center">
                    {brands.map((brand, i) => (
                      <div
                        key={brand}
                        className="ram-btn flex items-center space-x-2 bg-white px-3 py-1.5 rounded-lg border border-[#E2E5E9] shadow-xs text-xs font-mono font-bold text-[#161B26]"
                      >
                        <span 
                          className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                          style={{ backgroundColor: RAM_COLORS[i % RAM_COLORS.length] }}
                        />
                        <span className="text-[#6E7380] text-[10px]">CH-0{i + 1}</span>
                        <span>{brand}</span>
                        <button
                          type="button"
                          onClick={() => removeBrand(i)}
                          className="text-[#9499A5] hover:text-[#EF4444] ml-1 transition-colors"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}

                    {brands.length < 5 && (
                      <div className="flex items-center flex-1 min-w-[200px]">
                        <input
                          type="text"
                          value={inputBrand}
                          onChange={(e) => setInputBrand(e.target.value)}
                          onKeyDown={handleInputKeyDown}
                          placeholder={brands.length === 0 ? "Escribe el nombre de la marca (ej. Supermaxi)..." : "+ Agregar siguiente marca..."}
                          className="w-full bg-transparent border-none text-xs font-mono font-semibold text-[#161B26] placeholder-[#9499A5] focus:ring-0 focus:outline-none px-2 py-1"
                        />
                        {inputBrand.trim() && (
                          <button
                            type="button"
                            onClick={() => addBrand(inputBrand)}
                            className="text-xs font-mono font-bold bg-[#161B26] text-white px-3 py-1 rounded-md hover:bg-[#2B3242] transition-colors"
                          >
                            AGREGAR
                          </button>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Gatillo Primario: Botón Amarillo Dorado con Punto Negro */}
                  <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                    <div className="text-xs font-mono text-[#6E7380]">
                      {brands.length > 0 ? (
                        <span>LISTO PARA ANALIZAR {brands.length} MARCAS EN {location.toUpperCase()}</span>
                      ) : (
                        <span>CONFIGURA AL MENOS 1 MARCA PARA INICIAR</span>
                      )}
                    </div>

                    <button
                      type="button"
                      disabled={loading || brands.length === 0}
                      onClick={() => handleExecuteScan()}
                      className="ram-btn-accent px-7 py-3 rounded-xl font-mono text-xs font-bold tracking-wider uppercase flex items-center justify-center space-x-2 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                    >
                      <span className="w-2.5 h-2.5 rounded-full bg-[#161B26] mr-1" />
                      <span>EJECUTAR ESCANEO RAM</span>
                      <Sparkles className="w-3.5 h-3.5 ml-1 text-[#161B26]" />
                    </button>
                  </div>
                </div>

                {/* Banner de Error */}
                {error && (
                  <div className="mt-5 p-3.5 bg-[#FEF2F2] border border-[#FCA5A5] text-[#991B1B] rounded-xl text-xs font-mono font-bold">
                    {error}
                  </div>
                )}
              </div>

              {/* Presets del Mercado Ecuatoriano */}
              <div className="bg-white rounded-2xl p-6 border border-[#E2E5E9] shadow-xs">
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#E2E5E9]">
                  <div className="flex items-center space-x-2">
                    <Layers className="w-4 h-4 text-[#FFBA08]" />
                    <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#161B26]">
                      PRESETS DE REFERENCIA // ECUADOR
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-[#6E7380] bg-[#F4F6F8] px-2 py-0.5 rounded border border-[#E2E5E9]">
                    CARGA RÁPIDA EN 1 CLIC
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {ECUADOR_PRESETS.map((preset, idx) => (
                    <button
                      key={idx}
                      onClick={() => applyPreset(preset.brands)}
                      className="text-left p-3.5 rounded-xl bg-[#FAFBFD] border border-[#E2E5E9] hover:border-[#FFBA08] hover:bg-[#FFFDF5] hover:shadow-xs transition-all group"
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[10px] font-mono font-bold text-[#6E7380] group-hover:text-[#161B26] transition-colors">
                          {preset.category}
                        </span>
                        <ChevronRight className="w-3.5 h-3.5 text-[#9499A5] group-hover:text-[#FFBA08] transition-colors" />
                      </div>
                      <p className="text-xs font-bold text-[#161B26] truncate">
                        {preset.brands.join(' vs ')}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Historial de Escaneos Recientes */}
              {history.length > 0 && (
                <div className="flex flex-wrap items-center gap-2 pt-2">
                  <span className="text-[10px] font-mono text-[#6E7380] uppercase font-bold flex items-center mr-2">
                    <History className="w-3 h-3 mr-1" /> EJECUCIONES RECIENTES:
                  </span>
                  {history.map((h, i) => (
                    <button
                      key={i}
                      onClick={() => handleExecuteScan(h)}
                      className="px-3 py-1 bg-white border border-[#E2E5E9] rounded-full text-xs font-mono text-[#525866] hover:border-[#FFBA08] hover:text-[#161B26] transition-all flex items-center space-x-1.5"
                    >
                      <span>{h}</span>
                      <ArrowRight className="w-3 h-3 text-[#9499A5]" />
                    </button>
                  ))}
                </div>
              )}

              {/* Principio de Dieter Rams */}
              <div className="pt-6 border-t border-[#E2E5E9] text-center text-xs font-mono text-[#6E7380] space-y-1">
                <p className="font-bold text-[#161B26]">
                  RAM OS // "WENIGER, ABER BESSER" (MENOS, PERO MEJOR)
                </p>
                <p className="text-[11px] text-[#9499A5]">
                  Dominancia de Búsqueda • Clasificadores de Intención • Calibración de Medios SEM en USD
                </p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="report-view"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <Dashboard 
                report={report} 
                onNewSearch={() => setReport(null)} 
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Modal de Carga (Sleek Telemetry Scanner) */}
      {loading && (
        <div className="fixed inset-0 bg-[#161B26]/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl p-8 max-w-md w-full border border-[#E2E5E9] text-center shadow-2xl relative overflow-hidden"
          >
            {/* Indicador de estado */}
            <div className="flex items-center justify-center space-x-2 mb-6">
              <span className="w-2.5 h-2.5 rounded-full bg-[#FFBA08] animate-ping" />
              <span className="font-mono text-xs font-bold text-[#161B26] uppercase tracking-widest">
                ANALIZANDO // {location.toUpperCase()}
              </span>
            </div>

            {/* Barras LED de nivel */}
            <div className="flex justify-center space-x-1 mb-6">
              {Array.from({ length: 16 }).map((_, i) => (
                <div
                  key={i}
                  className={`w-2 h-7 rounded-xs transition-all duration-300 ${
                    i <= loadingStep * 3 + 2 
                      ? i > 12 ? 'bg-[#FFBA08]' : i > 8 ? 'bg-[#161B26]' : 'bg-[#525866]' 
                      : 'bg-[#E2E5E9]'
                  }`}
                />
              ))}
            </div>

            <h3 className="text-xl font-bold font-display text-[#161B26] mb-2">
              TELEMETRÍA RAM SEARCH ACTIVA
            </h3>

            <p className="text-xs font-mono text-[#525866] min-h-[36px] flex items-center justify-center px-4">
              {loadingMessages[loadingStep] || 'PROCESANDO SEÑALES DE BÚSQUEDA...'}
            </p>

            <div className="mt-6 pt-4 border-t border-[#E2E5E9] flex items-center justify-between text-[10px] font-mono text-[#9499A5]">
              <span>PROTOCOLO: GEMINI-3-SEARCH</span>
              <span className="text-[#10B981] font-bold">ACTIVO</span>
            </div>
          </motion.div>
        </div>
      )}

      {/* Instructivo y Manual de la Herramienta */}
      <SystemGuideModal 
        isOpen={isGuideOpen} 
        onClose={() => setIsGuideOpen(false)} 
      />
    </div>
  );
}
