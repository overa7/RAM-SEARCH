import React, { useState } from 'react';
import { 
  BookOpen, 
  X, 
  HelpCircle, 
  CheckCircle2, 
  Layers, 
  Activity, 
  DollarSign, 
  Target, 
  ShieldAlert, 
  Sliders, 
  Compass, 
  BarChart3, 
  ArrowRight,
  ExternalLink,
  Info,
  Check,
  Zap,
  Gauge
} from 'lucide-react';
import { ramAudio } from '../utils/audio';

interface SystemGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SystemGuideModal: React.FC<SystemGuideModalProps> = ({ isOpen, onClose }) => {
  const [activeSection, setActiveSection] = useState<'overview' | 'how-to-use' | 'spaces-dictionary' | 'methodology'>('overview');

  if (!isOpen) return null;

  const handleClose = () => {
    ramAudio.playClick(500, 0.03);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#161B26]/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-fadeIn">
      <div className="bg-white rounded-3xl border border-[#E2E5E9] shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col overflow-hidden text-[#161B26]">
        
        {/* Encabezado del Manual (Clean UX Header) */}
        <div className="bg-[#161B26] text-white p-5 sm:p-6 flex items-center justify-between border-b border-[#2B3242]">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-[#FFBA08] text-[#161B26] flex items-center justify-center font-bold shadow-xs">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[10px] font-mono text-[#FFBA08] font-bold tracking-widest uppercase">
                  MANUAL DE OPERACIÓN & INSTRUCTIVO RS-900
                </span>
                <span className="text-[#525866] text-xs">|</span>
                <span className="text-[10px] font-mono text-[#9499A5]">
                  TAXONOMÍA GOOGLE + SEM INTENT FRAMEWORK
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight font-display text-white">
                GUÍA DE USO Y DICCIONARIO METODOLÓGICO
              </h2>
            </div>
          </div>

          <button
            onClick={handleClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Barra de Navegación del Manual */}
        <div className="flex items-center bg-[#F4F6F8] border-b border-[#E2E5E9] px-4 sm:px-6 py-2 overflow-x-auto text-xs font-mono font-bold gap-2">
          <button
            onClick={() => {
              ramAudio.playSwitch();
              setActiveSection('overview');
            }}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center space-x-1.5 whitespace-nowrap ${
              activeSection === 'overview' 
                ? 'bg-[#161B26] text-white shadow-xs' 
                : 'text-[#525866] hover:bg-white'
            }`}
          >
            <Compass className="w-3.5 h-3.5 text-[#FFBA08]" />
            <span>1. CÓMO FUNCIONA</span>
          </button>

          <button
            onClick={() => {
              ramAudio.playSwitch();
              setActiveSection('how-to-use');
            }}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center space-x-1.5 whitespace-nowrap ${
              activeSection === 'how-to-use' 
                ? 'bg-[#161B26] text-white shadow-xs' 
                : 'text-[#525866] hover:bg-white'
            }`}
          >
            <Sliders className="w-3.5 h-3.5 text-[#FFBA08]" />
            <span>2. CÓMO USAR (PASO A PASO)</span>
          </button>

          <button
            onClick={() => {
              ramAudio.playSwitch();
              setActiveSection('spaces-dictionary');
            }}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center space-x-1.5 whitespace-nowrap ${
              activeSection === 'spaces-dictionary' 
                ? 'bg-[#161B26] text-white shadow-xs' 
                : 'text-[#525866] hover:bg-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-[#FFBA08]" />
            <span>3. QUÉ SIGNIFICA CADA ESPACIO</span>
          </button>

          <button
            onClick={() => {
              ramAudio.playSwitch();
              setActiveSection('methodology');
            }}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center space-x-1.5 whitespace-nowrap ${
              activeSection === 'methodology' 
                ? 'bg-[#161B26] text-white shadow-xs' 
                : 'text-[#525866] hover:bg-white'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5 text-[#FFBA08]" />
            <span>4. FÓRMULAS & FRAMEWORKS</span>
          </button>
        </div>

        {/* Contenido Dinámico con Scroll */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6 text-sm font-sans">
          
          {/* SECCIÓN 1: CÓMO FUNCIONA LA HERRAMIENTA */}
          {activeSection === 'overview' && (
            <div className="space-y-6">
              <div className="bg-[#FAFBFD] p-5 rounded-2xl border border-[#E2E5E9]">
                <h3 className="text-base font-bold font-mono text-[#161B26] uppercase mb-2 flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#FFBA08]" />
                  <span>SISTEMA DE INTELIGENCIA DE BÚSQUEDA Y CAPTURA DE VALOR</span>
                </h3>
                <p className="text-[#525866] leading-relaxed mb-3">
                  <strong>RAM SEARCH</strong> es una plataforma de análisis competitivo de demanda y planificación de medios basada en datos de Google Search. Funciona como un <em>telescopio de mercado</em> que traduce millones de consultas en decisiones comerciales accionables.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                  <div className="bg-white p-4 rounded-xl border border-[#E2E5E9]">
                    <div className="text-xs font-mono font-bold text-[#FFBA08] mb-1">01 // TELEMETRÍA REAL</div>
                    <p className="text-xs text-[#525866]">Indexa volúmenes de búsqueda mensuales y curvas de estacionalidad histórica de Google en Ecuador y Latinoamérica.</p>
                  </div>
                  <div className="bg-white p-4 rounded-xl border border-[#E2E5E9]">
                    <div className="text-xs font-mono font-bold text-[#161B26] mb-1">02 // TAXONOMÍA RIGUROSA</div>
                    <p className="text-xs text-[#525866]">Aplica la <strong>Taxonomía Operativa de 7 Familias y 251 Subintenciones</strong> para no reducir las búsquedas a simples palabras clave.</p>
                  </div>
                  <div className="bg-white p-4 rounded-xl border border-[#E2E5E9]">
                    <div className="text-xs font-mono font-bold text-[#10B981] mb-1">03 // SEM INTENT FRAMEWORK</div>
                    <p className="text-xs text-[#525866]">Modela presupuestos de medios siguiendo <strong>Valor Marginal</strong> y elimina el desperdicio (Zero Waste Search) de queries sin retorno.</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-[#E2E5E9] space-y-3">
                <h4 className="font-mono text-xs font-bold text-[#161B26] uppercase tracking-wider">
                  TESIS CENTRAL METODOLÓGICA (SEPTIEMBRE 2026)
                </h4>
                <div className="bg-[#161B26] text-white p-4 rounded-xl font-mono text-xs leading-relaxed border border-[#2B3242]">
                  <p className="text-[#FFBA08] font-bold mb-1">
                    SEM YA NO ES COMPRAR KEYWORDS. ES IDENTIFICAR, VALORAR Y CAPTURAR INTENCIÓN.
                  </p>
                  <p className="text-[#D4D7DC]">
                    INTENCIÓN &gt; VALOR &gt; QUERY &gt; RESPUESTA &gt; LANDING &gt; CONVERSIÓN &gt; APRENDIZAJE
                  </p>
                </div>
                <p className="text-xs text-[#525866]">
                  La herramienta separa con nitidez dos universos: <strong>Módulo 1 (Inteligencia de Demanda y Taxonomía)</strong> y <strong>Módulo 2 (Recomendación Estratégica SEM y Modelo Numérico)</strong> para garantizar orden y claridad visual.
                </p>
              </div>
            </div>
          )}

          {/* SECCIÓN 2: CÓMO USAR PASO A PASO */}
          {activeSection === 'how-to-use' && (
            <div className="space-y-4">
              <h3 className="text-base font-bold font-mono text-[#161B26] uppercase mb-1">
                GUÍA DE USO OPERATIVO EN 6 PASOS
              </h3>
              <p className="text-xs text-[#525866] mb-4">
                Sigue este procedimiento para realizar un análisis competitivo de alto rigor técnico:
              </p>

              <div className="space-y-3">
                {[
                  {
                    step: '01',
                    title: 'DEFINIR TERRITORIO Y MERCADO',
                    desc: 'Selecciona el país en el selector del encabezado (ej. Ecuador [EC-593]). Esto calibra los benchmarks de volumen, costos de CPC en USD y modismos de búsqueda.'
                  },
                  {
                    step: '02',
                    title: 'CONFIGURAR CANALES DE MARCAS (HASTA 5)',
                    desc: 'Escribe el nombre de la categoría o las marcas rivales (ej: Supermaxi, Mi Comisariato, Tipti). Puedes usar los botones de "Presets Rápidos" para cargar categorías del mercado ecuatoriano en 1 clic.'
                  },
                  {
                    step: '03',
                    title: 'ACTIVAR EL ESCÁNER DE DEMANDA',
                    desc: 'Presiona el interruptor "INICIAR ESCÁNER". El motor indexa los volúmenes de búsqueda mensuales, calcula el total de la categoría y normaliza el Share of Search.'
                  },
                  {
                    step: '04',
                    title: 'ANALIZAR MÓDULO 1 (INTELIGENCIA Y TAXONOMÍA)',
                    desc: 'Revisa qué marca lidera realmente la demanda por volumen. Explora la tabla de consultas decodificadas con las 7 familias y los clusters operativos (LEARN, EXPLORE, COMPARE, VALIDATE, BUY, VISIT, RETURN).'
                  },
                  {
                    step: '05',
                    title: 'EXPLORAR MÓDULO 2 (ESTRATEGIA SEM & EJERCICIO NUMÉRICO)',
                    desc: 'Cambia a la pestaña de SEM para ver cómo distribuir el presupuesto según valor marginal en lugar de volumen. Revisa el ejercicio numérico de Zero Waste Search, el Intent Value Score (IVS) y los valores de entrenamiento downstream.'
                  },
                  {
                    step: '06',
                    title: 'SIMULAR PRESUPUESTOS Y EXPORTAR PARA GOOGLE ADS',
                    desc: 'Mueve el slider de presupuesto mensual para proyectar clics, CPA y conversiones. Copia o descarga el archivo TSV estructurado y súbelo directamente a Google Ads Editor.'
                  }
                ].map((item) => (
                  <div key={item.step} className="bg-[#FAFBFD] p-4 rounded-xl border border-[#E2E5E9] flex items-start space-x-3.5">
                    <div className="w-8 h-8 rounded-lg bg-[#161B26] text-white font-mono text-xs font-bold flex items-center justify-center flex-shrink-0">
                      {item.step}
                    </div>
                    <div>
                      <h4 className="font-mono text-xs font-bold text-[#161B26] uppercase">
                        {item.title}
                      </h4>
                      <p className="text-xs text-[#525866] mt-0.5 leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SECCIÓN 3: DICCIONARIO DE ESPACIOS Y MÉTRICAS */}
          {activeSection === 'spaces-dictionary' && (
            <div className="space-y-5">
              <h3 className="text-base font-bold font-mono text-[#161B26] uppercase mb-1">
                DICCIONARIO DE PANELES, MÉTRICAS Y ESPACIOS
              </h3>
              <p className="text-xs text-[#525866] mb-4">
                Descripción técnica de cada indicador, gráfico y módulo de la interfaz:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-[#FAFBFD] p-4 rounded-xl border border-[#E2E5E9] space-y-1.5">
                  <span className="text-[10px] font-mono font-bold text-[#FFBA08] bg-[#FFF8D6] px-2 py-0.5 rounded border border-[#EADB9F]">
                    INDICADOR 01 // LÍDER DE MERCADO (SOS)
                  </span>
                  <h4 className="font-mono text-xs font-bold text-[#161B26]">Marca con Mayor Cuota de Búsqueda</h4>
                  <p className="text-xs text-[#525866]">
                    Se determina matemáticamente por el mayor volumen real mensual de búsquedas, no por el orden en que fue escrita. Incluye barra de nivel tipo hardware LED.
                  </p>
                </div>

                <div className="bg-[#FAFBFD] p-4 rounded-xl border border-[#E2E5E9] space-y-1.5">
                  <span className="text-[10px] font-mono font-bold text-[#161B26] bg-white px-2 py-0.5 rounded border border-[#E2E5E9]">
                    INDICADOR 02 // VECTOR DOMINANTE
                  </span>
                  <h4 className="font-mono text-xs font-bold text-[#161B26]">Tipo de Intención Predominante</h4>
                  <p className="text-xs text-[#525866]">
                    Indica si la mayoría de las búsquedas son Transaccionales (alta compra), de Investigación Comercial (evaluación), Navegacionales o Informacionales.
                  </p>
                </div>

                <div className="bg-[#FAFBFD] p-4 rounded-xl border border-[#E2E5E9] space-y-1.5">
                  <span className="text-[10px] font-mono font-bold text-[#10B981] bg-[#ECFDF5] px-2 py-0.5 rounded border border-[#A7F3D0]">
                    INDICADOR 03 // VOLUMEN TOTAL CATEGORÍA
                  </span>
                  <h4 className="font-mono text-xs font-bold text-[#161B26]">Demanda Agregada del Mercado (100%)</h4>
                  <p className="text-xs text-[#525866]">
                    Suma total de búsquedas mensuales de las marcas analizadas. Representa el universo sobre el cual se calcula el Share of Search de cada competidor.
                  </p>
                </div>

                <div className="bg-[#FAFBFD] p-4 rounded-xl border border-[#E2E5E9] space-y-1.5">
                  <span className="text-[10px] font-mono font-bold text-[#2563EB] bg-[#EFF6FF] px-2 py-0.5 rounded border border-[#BFDBFE]">
                    INDICADOR 04 // ÍNDICE DE SENTIMIENTO
                  </span>
                  <h4 className="font-mono text-xs font-bold text-[#161B26]">Percepción Neta del Consumidor</h4>
                  <p className="text-xs text-[#525866]">
                    Medidor tricolor de porcentaje positivo (verde), neutro (amarillo) y negativo (rojo) basado en reviews y menciones en la web.
                  </p>
                </div>

                <div className="bg-[#FAFBFD] p-4 rounded-xl border border-[#E2E5E9] space-y-1.5">
                  <span className="text-[10px] font-mono font-bold text-[#161B26]">
                    OSCILOSCOPIO DE TENDENCIAS
                  </span>
                  <h4 className="font-mono text-xs font-bold text-[#161B26]">Curvas de Velocidad a 12 Meses</h4>
                  <p className="text-xs text-[#525866]">
                    Líneas dinámicas que muestran picos de demanda estacional (Black Friday, Navidad, Cyberdays) para cada marca con interruptores de encendido/apagado.
                  </p>
                </div>

                <div className="bg-[#FAFBFD] p-4 rounded-xl border border-[#E2E5E9] space-y-1.5">
                  <span className="text-[10px] font-mono font-bold text-[#161B26]">
                    BARRA DE CUOTA DE BÚSQUEDA (SOS)
                  </span>
                  <h4 className="font-mono text-xs font-bold text-[#161B26]">Ranking de Demanda por Volumen</h4>
                  <p className="text-xs text-[#525866]">
                    Barras proporcionales ordenadas de mayor a menor con el volumen mensual en miles (K) o millones (M) y su porcentaje exacto de participación.
                  </p>
                </div>

                <div className="bg-[#FAFBFD] p-4 rounded-xl border border-[#E2E5E9] space-y-1.5 md:col-span-2">
                  <span className="text-[10px] font-mono font-bold text-[#FFBA08] bg-[#FFF8D6] px-2 py-0.5 rounded border border-[#EADB9F]">
                    MATRIZ DESCRIPTIVA DE INTENCIONES (TAXONOMÍA COMPLETA)
                  </span>
                  <h4 className="font-mono text-xs font-bold text-[#161B26]">Clasificador Granular de Búsquedas</h4>
                  <p className="text-xs text-[#525866]">
                    Tabla que decodifica las búsquedas de mayor volumen tanto a nivel de Categoría como para cada Marca individual, clasificándolas con las 7 familias operativas, Google Intent, subtipos (ej. Pricing research, Store locator), cluster operativo y su Intent Value Score (IVS).
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* SECCIÓN 4: FÓRMULAS & FRAMEWORKS */}
          {activeSection === 'methodology' && (
            <div className="space-y-5">
              <h3 className="text-base font-bold font-mono text-[#161B26] uppercase mb-1">
                FUNDAMENTOS MATEMÁTICOS Y REGLAS DE DECISIÓN
              </h3>

              {/* Fórmula 1: Share of Search */}
              <div className="bg-[#FAFBFD] p-5 rounded-2xl border border-[#E2E5E9] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-[#161B26]">01 // CÁLCULO DE SHARE OF SEARCH (SOS)</span>
                  <span className="text-[10px] font-mono text-[#10B981] font-bold bg-[#ECFDF5] px-2 py-0.5 rounded">FÓRMULA BASE</span>
                </div>
                <div className="bg-white p-3 rounded-xl border border-[#E2E5E9] font-mono text-xs text-[#161B26] overflow-x-auto">
                  Share of Search (%) = (Volumen Mensual de la Marca ÷ Volumen Total de la Categoría) × 100
                </div>
                <p className="text-xs text-[#525866]">
                  La suma de todas las marcas siempre totaliza 100%. La investigación de Les Binet y James Hankins demostró que el Share of Search anticipa la cuota de mercado con 6 meses de antelación.
                </p>
              </div>

              {/* Fórmula 2: Intent Value Score (IVS) */}
              <div className="bg-[#FAFBFD] p-5 rounded-2xl border border-[#E2E5E9] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-[#161B26]">02 // INTENT VALUE SCORE (IVS)</span>
                  <span className="text-[10px] font-mono text-[#FFBA08] font-bold bg-[#FFF8D6] px-2 py-0.5 rounded">VALORACIÓN SEM</span>
                </div>
                <div className="bg-white p-3 rounded-xl border border-[#E2E5E9] font-mono text-xs text-[#161B26] overflow-x-auto">
                  IVS = Intención Comercial × Probabilidad de Conversión × Valor Económico × Prioridad Estratégica
                </div>
                <p className="text-xs text-[#525866]">
                  Puntúa cada consulta de 0 a 100. Una consulta con IVS 98 ("agendar cita") merece puja prioritaria, mientras que una con IVS 16 ("qué es...") solo justifica cobertura selectiva.
                </p>
              </div>

              {/* Fórmula 3: Zero Waste Search */}
              <div className="bg-[#FAFBFD] p-5 rounded-2xl border border-[#E2E5E9] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-[#161B26]">03 // ZERO WASTE SEARCH: VALOR ESPERADO (EV)</span>
                  <span className="text-[10px] font-mono text-[#EF4444] font-bold bg-[#FEF2F2] px-2 py-0.5 rounded">DETECCIÓN DE DESPERDICIO</span>
                </div>
                <div className="bg-white p-3 rounded-xl border border-[#E2E5E9] font-mono text-xs text-[#161B26] overflow-x-auto">
                  Valor Esperado (EV) = Probabilidad de Conversión (%) × Valor del Lead/Venta (USD)
                  <br />
                  Condición de Desperdicio (Waste): Si CPC &gt; Valor Esperado (EV)
                </div>
                <div className="bg-[#161B26] text-white p-3 rounded-xl text-xs font-mono">
                  <p className="text-[#FFBA08] font-bold">EJEMPLO NUMÉRICO DEL DOCUMENTO:</p>
                  <p className="text-[#D4D7DC]">Query: "qué es CRM" | CPC: $4.20 | Prob: 0.1% | Valor: $100</p>
                  <p className="text-[#EF4444] font-bold mt-1">
                    EV = 0.1% × $100 = $0.10. Pagar $4.20 por $0.10 de valor = DESPERDICIO (WASTE) DE $4.10/clic.
                  </p>
                </div>
              </div>

              {/* Eventos Downstream */}
              <div className="bg-[#FAFBFD] p-5 rounded-2xl border border-[#E2E5E9] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-[#161B26]">04 // SEÑALES DOWNSTREAM PARA LEAD GEN</span>
                  <span className="text-[10px] font-mono text-[#2563EB] font-bold bg-[#EFF6FF] px-2 py-0.5 rounded">SMART BIDDING</span>
                </div>
                <p className="text-xs text-[#525866] mb-2">
                  "50 formularios basura no equivalen a 5 oportunidades reales". Valores de entrenamiento para algoritmos de Google Ads:
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center font-mono">
                  <div className="bg-white p-2.5 rounded-xl border border-[#E2E5E9]">
                    <div className="text-[10px] text-[#6E7380]">LEAD INICIAL</div>
                    <div className="text-base font-bold text-[#161B26]">$10 USD</div>
                  </div>
                  <div className="bg-white p-2.5 rounded-xl border border-[#E2E5E9]">
                    <div className="text-[10px] text-[#6E7380]">QUALIFIED LEAD (MQL)</div>
                    <div className="text-base font-bold text-[#2563EB]">$50 USD</div>
                  </div>
                  <div className="bg-white p-2.5 rounded-xl border border-[#E2E5E9]">
                    <div className="text-[10px] text-[#6E7380]">OPPORTUNITY (SQL)</div>
                    <div className="text-base font-bold text-[#FFBA08]">$250 USD</div>
                  </div>
                  <div className="bg-white p-2.5 rounded-xl border border-[#E2E5E9]">
                    <div className="text-[10px] text-[#6E7380]">VENTA CERRADA (SALE)</div>
                    <div className="text-base font-bold text-[#10B981]">$2,500 USD</div>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Pie del Modal con Acción de Cierre */}
        <div className="bg-[#FAFBFD] p-4 sm:p-5 border-t border-[#E2E5E9] flex items-center justify-between">
          <div className="flex items-center space-x-2 text-xs font-mono text-[#6E7380]">
            <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
            <span>RAM SEARCH OS // VERIFICACIÓN METODOLÓGICA ACTIVA</span>
          </div>
          <button
            onClick={handleClose}
            className="ram-btn-accent px-5 py-2 rounded-xl text-xs font-mono font-bold uppercase tracking-wider shadow-xs"
          >
            ENTENDIDO // CONTINUAR
          </button>
        </div>

      </div>
    </div>
  );
};
