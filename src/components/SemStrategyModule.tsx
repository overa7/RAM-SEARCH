import React, { useState, useMemo } from 'react';
import { 
  DollarSign, 
  Target, 
  ShieldCheck, 
  Swords, 
  Sliders, 
  TrendingUp, 
  Copy, 
  Check, 
  ExternalLink, 
  AlertTriangle, 
  Download, 
  Layers, 
  Percent, 
  MousePointerClick, 
  CheckCircle2, 
  ChevronRight,
  Info,
  Sparkles,
  Zap,
  Gauge,
  Calculator,
  ArrowRight,
  ShieldAlert,
  HelpCircle
} from 'lucide-react';
import { 
  SEMStrategyReport, 
  SEMCampaignStructure, 
  BrandComparison,
  DemandAllocationItem,
  ZeroWasteCalculation
} from '../types';
import { ramAudio } from '../utils/audio';

interface SemStrategyModuleProps {
  semStrategy: SEMStrategyReport;
  brands: BrandComparison[];
  location: string;
}

export const SemStrategyModule: React.FC<SemStrategyModuleProps> = ({
  semStrategy,
  brands,
  location
}) => {
  // Inversión mensual en USD
  const [monthlyBudget, setMonthlyBudget] = useState<number>(
    semStrategy.monthlyBudgetBenchmarkUSD || 2500
  );
  const [activeCampaignIdx, setActiveCampaignIdx] = useState<number>(0);
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  // Estados interactivos para la calculadora de Zero Waste Search
  const [wasteTestQuery, setWasteTestQuery] = useState<string>('qué es ' + (brands[0]?.brand.toLowerCase() || 'servicio'));
  const [wasteTestCpc, setWasteTestCpc] = useState<number>(4.20);
  const [wasteTestProb, setWasteTestProb] = useState<number>(0.1); // 0.1%
  const [wasteTestLeadValue, setWasteTestLeadValue] = useState<number>(100);

  // Supuestos de tasa de conversión calibrados para captura de intención
  const convRates = {
    transactional: 0.052, // 5.2% e-commerce / pedido directo
    defense: 0.125,      // 12.5% navegación / login / retención
    conquest: 0.024,     // 2.4% cambio de marca competidora
    commercial: 0.038    // 3.8% evaluación a lead / consulta comercial
  };

  // Cálculos en tiempo real según el presupuesto interactivo
  const calculations = useMemo(() => {
    const split = semStrategy.budgetSplit;
    const blendedCpc = semStrategy.blendedCpcUSD || 0.32;

    const transBudget = monthlyBudget * (split.transactionalPct / 100);
    const defenseBudget = monthlyBudget * (split.brandDefensePct / 100);
    const conquestBudget = monthlyBudget * (split.competitorConquestPct / 100);
    const commBudget = monthlyBudget * (split.commercialPct / 100);

    const transCpc = blendedCpc * 1.15;
    const defenseCpc = blendedCpc * 0.45;
    const conquestCpc = blendedCpc * 1.25;
    const commCpc = blendedCpc * 0.95;

    const transClicks = Math.round(transBudget / transCpc);
    const defenseClicks = Math.round(defenseBudget / defenseCpc);
    const conquestClicks = Math.round(conquestBudget / conquestCpc);
    const commClicks = Math.round(commBudget / commCpc);

    const totalClicks = transClicks + defenseClicks + conquestClicks + commClicks;
    const effectiveBlendedCpc = +(monthlyBudget / (totalClicks || 1)).toFixed(2);

    const transConversions = Math.round(transClicks * convRates.transactional);
    const defenseConversions = Math.round(defenseClicks * convRates.defense);
    const conquestConversions = Math.round(conquestClicks * convRates.conquest);
    const commConversions = Math.round(commClicks * convRates.commercial);
    const totalConversions = transConversions + defenseConversions + conquestConversions + commConversions;

    const blendedCpa = +(monthlyBudget / (totalConversions || 1)).toFixed(2);
    const intentEfficiencyScore = Math.min(99, Math.round(72 + (split.transactionalPct * 0.3) + (monthlyBudget > 2000 ? 8 : 4)));

    return {
      transBudget,
      defenseBudget,
      conquestBudget,
      commBudget,
      transClicks,
      defenseClicks,
      conquestClicks,
      commClicks,
      totalClicks,
      effectiveBlendedCpc,
      totalConversions,
      blendedCpa,
      intentEfficiencyScore
    };
  }, [monthlyBudget, semStrategy]);

  // Cálculo en vivo de Zero Waste Search
  const liveZeroWaste = useMemo(() => {
    const expectedValueUSD = (wasteTestProb / 100) * wasteTestLeadValue;
    const isWaste = wasteTestCpc > expectedValueUSD;
    const wasteAmount = isWaste ? wasteTestCpc - expectedValueUSD : 0;
    return {
      expectedValueUSD: +expectedValueUSD.toFixed(2),
      isWaste,
      wasteAmount: +wasteAmount.toFixed(2)
    };
  }, [wasteTestCpc, wasteTestProb, wasteTestLeadValue]);

  const activeCampaign: SEMCampaignStructure = 
    semStrategy.campaigns[activeCampaignIdx] || semStrategy.campaigns[0];

  const handleBudgetChange = (value: number) => {
    ramAudio.playClick(600 + (value / 50), 0.02);
    setMonthlyBudget(value);
  };

  const handleCopy = (text: string, sectionKey: string) => {
    ramAudio.playClick(900, 0.04);
    navigator.clipboard.writeText(text);
    setCopiedSection(sectionKey);
    setTimeout(() => setCopiedSection(null), 2500);
  };

  // Exportación para Google Ads Editor en formato TSV
  const generateGoogleAdsExport = () => {
    let output = `Campaign\tAd Group\tKeyword\tCriterion Type\tMax CPC\tHeadline 1\tHeadline 2\tHeadline 3\tDescription 1\tDescription 2\n`;
    semStrategy.campaigns.forEach(c => {
      const ad = c.adCopyBlueprint;
      c.targetKeywords.forEach(k => {
        const matchType = k.matchType.includes('Exact') ? 'Exact' : k.matchType.includes('Phrase') ? 'Phrase' : 'Broad';
        output += `${c.campaignName}\t${c.intentTier}_AG\t${k.keyword}\t${matchType}\t${k.cpcEstimateUSD}\t${ad.headlines[0] || ''}\t${ad.headlines[1] || ''}\t${ad.headlines[2] || ''}\t${ad.descriptions[0] || ''}\t${ad.descriptions[1] || ''}\n`;
      });
    });
    return output;
  };

  const handleDownloadExport = () => {
    ramAudio.playExecute();
    const data = generateGoogleAdsExport();
    const blob = new Blob([data], { type: 'text/tab-separated-values;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `RAM_PLAN_SEM_${location.toUpperCase()}_${new Date().toISOString().split('T')[0]}.tsv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const budgetPresets = [800, 1500, 2500, 5000, 10000];

  return (
    <div className="space-y-7">
      
      {/* 1. Cabecera Principal del Framework SEM */}
      <div className="bg-white rounded-2xl p-6 sm:p-7 border border-[#E2E5E9] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2.5 mb-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#FFBA08] animate-pulse"></span>
            <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#6E7380]">
              SEM INTENT FRAMEWORK // SEPTIEMBRE 2026
            </span>
            <span className="text-[#CFD3D8] text-xs font-mono">|</span>
            <span className="text-xs font-mono text-[#161B26] font-bold bg-[#FFF8D6] px-2 py-0.5 rounded border border-[#EADB9F]">
              CAPTURA DE DEMANDA BASADA EN VALOR · {location.toUpperCase()}
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-[#161B26] font-display">
            RECOMENDACIÓN ESTRATÉGICA SEM & MODELO NUMÉRICO
          </h2>
          <p className="text-xs sm:text-sm text-[#525866] mt-1 max-w-3xl leading-relaxed">
            De keywords y CPCs a un sistema de captura de demanda basado en <strong>intención</strong>, <strong>valor marginal</strong> y <strong>señales downstream</strong>.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => handleCopy(generateGoogleAdsExport(), 'editor-copy')}
            className="ram-btn px-3.5 py-2.5 rounded-xl bg-white border border-[#E2E5E9] hover:bg-[#F4F6F8] text-[#161B26] text-xs font-mono font-bold flex items-center shadow-xs"
          >
            {copiedSection === 'editor-copy' ? (
              <>
                <Check className="w-3.5 h-3.5 text-[#10B981] mr-1.5" />
                <span>COPIADO PARA ADS EDITOR</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 mr-1.5 text-[#6E7380]" />
                <span>COPIAR ESTRUCTURA</span>
              </>
            )}
          </button>

          <button
            onClick={handleDownloadExport}
            className="ram-btn-accent px-4 py-2.5 rounded-xl text-xs font-mono font-bold tracking-wider uppercase flex items-center shadow-xs"
          >
            <Download className="w-3.5 h-3.5 mr-1.5 text-[#161B26]" />
            <span>EXPORTAR TSV / CSV</span>
          </button>
        </div>
      </div>

      {/* 2. Tesis Central y Cadena de Captura (01 Principio) */}
      <div className="bg-[#161B26] text-white rounded-2xl p-6 sm:p-7 border border-[#2B3242] shadow-lg space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#2B3242]">
          <span className="text-xs font-mono font-bold text-[#FFBA08] tracking-wider uppercase">
            01 / PRINCIPIO RECTOR & TESIS CENTRAL
          </span>
          <span className="text-[11px] font-mono text-[#9499A5]">
            SEM INTENT FRAMEWORK
          </span>
        </div>

        <div className="space-y-2">
          <h3 className="text-xl sm:text-2xl font-black font-display tracking-tight text-white">
            SEM YA NO ES COMPRAR KEYWORDS. ES IDENTIFICAR, VALORAR Y CAPTURAR INTENCIÓN.
          </h3>
          <p className="text-xs sm:text-sm text-[#FFBA08] font-mono font-bold">
            INTENCIÓN &gt; VALOR &gt; QUERY &gt; RESPUESTA &gt; LANDING &gt; CONVERSIÓN &gt; APRENDIZAJE
          </p>
        </div>

        <div className="bg-[#202634] p-4 rounded-xl border border-[#2F374A] flex items-start space-x-3 text-xs text-[#D4D7DC]">
          <div className="w-6 h-6 rounded-lg bg-[#FFBA08] text-[#161B26] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
            ?
          </div>
          <div>
            <strong className="text-white block font-mono">LA PREGUNTA CORRECTA:</strong>
            <span>
              No es: <em>"¿qué keyword compro?"</em>. Es: <strong>"¿qué intención quiero capturar, cuánto vale y cuál es la mejor respuesta para convertirla?"</strong>.
            </span>
          </div>
        </div>
      </div>

      {/* 3. Mapa de Demanda vs Inversión Sugerida (02 Demanda) */}
      <div className="bg-white rounded-2xl p-6 sm:p-7 border border-[#E2E5E9] shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#E2E5E9] gap-2">
          <div>
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#161B26]" />
              <h3 className="text-base sm:text-lg font-bold font-mono tracking-wider uppercase text-[#161B26]">
                02 / DEL OBJETIVO DE NEGOCIO AL MAPA DE BÚSQUEDA
              </h3>
            </div>
            <p className="text-xs text-[#525866] font-sans mt-0.5">
              <strong>Regla de oro:</strong> Share of Search no debe convertirse automáticamente en Share of Budget. El presupuesto debe seguir <em>valor marginal</em>, no volumen.
            </p>
          </div>
          <span className="text-[10px] font-mono text-[#161B26] bg-[#F4F6F8] px-2 py-0.5 rounded border border-[#E2E5E9] font-bold">
            LECTURA ESTRATÉGICA
          </span>
        </div>

        {/* Tabla Oficial de Lectura de Demanda */}
        <div className="border border-[#E2E5E9] rounded-xl overflow-hidden">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-[#FAFBFD] text-[#525866] border-b border-[#E2E5E9]">
              <tr>
                <th className="px-4 py-3 font-bold">INTENCIÓN DE BÚSQUEDA</th>
                <th className="px-4 py-3 font-bold text-center">% DEMANDA TOTAL</th>
                <th className="px-4 py-3 font-bold text-center">% INVERSIÓN SUGERIDA</th>
                <th className="px-4 py-3 font-bold">VALOR RELATIVO</th>
                <th className="px-4 py-3 font-bold">ROL & BIDDING ESTRATÉGICO</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E5E9]">
              <tr className="hover:bg-[#F8FAFC]">
                <td className="px-4 py-3 font-bold text-[#161B26]">Transactional (Comprar / Contratar)</td>
                <td className="px-4 py-3 text-center text-[#525866]">18%</td>
                <td className="px-4 py-3 text-center font-bold text-[#10B981] bg-[#ECFDF5]">40%</td>
                <td className="px-4 py-3"><span className="px-2 py-0.5 rounded bg-[#ECFDF5] text-[#047857] text-[10px] font-bold">Muy alto</span></td>
                <td className="px-4 py-3 text-[#525866]">Max conversion value / tROAS · Conversión directa</td>
              </tr>
              <tr className="hover:bg-[#F8FAFC]">
                <td className="px-4 py-3 font-bold text-[#161B26]">Commercial (Comparativa / Evaluativa)</td>
                <td className="px-4 py-3 text-center text-[#525866]">24%</td>
                <td className="px-4 py-3 text-center font-bold text-[#2563EB] bg-[#EFF6FF]">30%</td>
                <td className="px-4 py-3"><span className="px-2 py-0.5 rounded bg-[#EFF6FF] text-[#1D4ED8] text-[10px] font-bold">Alto</span></td>
                <td className="px-4 py-3 text-[#525866]">tCPA o value-based · Ganar consideración cualificada</td>
              </tr>
              <tr className="hover:bg-[#F8FAFC]">
                <td className="px-4 py-3 font-bold text-[#161B26]">Local (Visit-in-Person / Sucursales)</td>
                <td className="px-4 py-3 text-center text-[#525866]">9%</td>
                <td className="px-4 py-3 text-center font-bold text-[#161B26] bg-[#F4F6F8]">12%</td>
                <td className="px-4 py-3"><span className="px-2 py-0.5 rounded bg-[#ECFDF5] text-[#047857] text-[10px] font-bold">Muy alto</span></td>
                <td className="px-4 py-3 text-[#525866]">Value + geo + calls/visits · Conversión física y cercanía</td>
              </tr>
              <tr className="hover:bg-[#F8FAFC]">
                <td className="px-4 py-3 font-bold text-[#161B26]">Navigational (Brand Defense / Retención)</td>
                <td className="px-4 py-3 text-center text-[#525866]">12%</td>
                <td className="px-4 py-3 text-center font-bold text-[#FFBA08] bg-[#FFF8D6]">10%</td>
                <td className="px-4 py-3"><span className="px-2 py-0.5 rounded bg-[#EFF6FF] text-[#1D4ED8] text-[10px] font-bold">Alto</span></td>
                <td className="px-4 py-3 text-[#525866]">Target Impression Share (98%+) · Proteger cuota propia</td>
              </tr>
              <tr className="hover:bg-[#F8FAFC]">
                <td className="px-4 py-3 font-bold text-[#161B26]">Informational (Know / Educacional)</td>
                <td className="px-4 py-3 text-center text-[#525866]">31%</td>
                <td className="px-4 py-3 text-center font-bold text-[#EF4444] bg-[#FEF2F2]">5%</td>
                <td className="px-4 py-3"><span className="px-2 py-0.5 rounded bg-[#F3F4F6] text-[#6E7380] text-[10px] font-bold">Bajo</span></td>
                <td className="px-4 py-3 text-[#525866]">Test / caps / audiencias · Captura selectiva, no sobrepagar</td>
              </tr>
              <tr className="hover:bg-[#F8FAFC]">
                <td className="px-4 py-3 font-bold text-[#161B26]">Exploratory / Mixed</td>
                <td className="px-4 py-3 text-center text-[#525866]">6%</td>
                <td className="px-4 py-3 text-center font-bold text-[#525866] bg-[#F4F6F8]">3%</td>
                <td className="px-4 py-3"><span className="px-2 py-0.5 rounded bg-[#F3F4F6] text-[#6E7380] text-[10px] font-bold">Variable</span></td>
                <td className="px-4 py-3 text-[#525866]">Broad / AI discovery con guardrails estrictos</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. Ejercicio Numérico: ZERO WASTE SEARCH (11 Zero Waste) */}
      <div className="bg-[#FAFBFD] rounded-2xl p-6 sm:p-7 border border-[#EADB9F] shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#E2E5E9] gap-2">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-xl bg-[#EF4444] text-white flex items-center justify-center font-bold">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold font-mono tracking-wider uppercase text-[#161B26]">
                EJERCICIO NUMÉRICO // ZERO WASTE SEARCH: MEDIR DESPERDICIO POR VALOR ESPERADO
              </h3>
              <p className="text-xs text-[#525866]">
                Relevancia semántica no es suficiente. Una query es desperdicio (WASTE) si el costo de capturarla no se justifica por su valor esperado.
              </p>
            </div>
          </div>
          <span className="text-[10px] font-mono text-[#EF4444] font-bold bg-[#FEF2F2] px-2.5 py-1 rounded-full border border-[#FECDD3]">
            SECCIÓN 11 // FRAMEWORK SEM
          </span>
        </div>

        {/* Comparación: Caso Real del Documento vs Simulador Interactivo */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Columna Izquierda: El caso didáctico exacto del PDF (5 cols) */}
          <div className="lg:col-span-5 bg-white p-5 rounded-xl border border-[#E2E5E9] space-y-3 font-mono text-xs">
            <div className="flex items-center justify-between border-b border-[#E2E5E9] pb-2">
              <span className="font-bold text-[#161B26]">CASO DIDÁCTICO DEL DOCUMENTO</span>
              <span className="text-[10px] text-[#6E7380]">BENCHMARK</span>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-[#6E7380]">Query evaluada:</span>
                <strong className="text-[#161B26]">"qué es CRM"</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-[#6E7380]">Costo por Clic (CPC):</span>
                <strong className="text-[#161B26]">$4.20 USD</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-[#6E7380]">Probabilidad de lead:</span>
                <strong className="text-[#161B26]">0.1%</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-[#6E7380]">Valor esperado del lead:</span>
                <strong className="text-[#161B26]">$100 USD</strong>
              </div>
              <div className="flex justify-between pt-2 border-t border-[#E2E5E9] font-bold">
                <span className="text-[#6E7380]">Valor Esperado (EV):</span>
                <span className="text-[#2563EB]">$0.10 USD</span>
              </div>
            </div>

            <div className="bg-[#FEF2F2] p-3 rounded-lg border border-[#FECDD3] text-[#991B1B] text-[11px] leading-relaxed">
              <strong>RESULTADO:</strong> Pagar CPC de $4.20 para capturar $0.10 de valor esperado = <span className="font-black underline">DESPERDICIO (WASTE) DE $4.10 POR CLIC</span>.
            </div>
            <p className="text-[10px] text-[#6E7380]">
              "52% de la inversión capturando intención informativa pero generando 8% del valor es un error de arquitectura".
            </p>
          </div>

          {/* Columna Derecha: Calculadora Interactiva de Desperdicio en Vivo (7 cols) */}
          <div className="lg:col-span-7 bg-white p-5 rounded-xl border border-[#E2E5E9] space-y-4">
            <div className="flex items-center justify-between border-b border-[#E2E5E9] pb-2">
              <div className="flex items-center space-x-1.5 font-mono text-xs font-bold text-[#161B26]">
                <Calculator className="w-3.5 h-3.5 text-[#FFBA08]" />
                <span>CALCULADORA DE ZERO WASTE SEARCH EN VIVO</span>
              </div>
              <span className="text-[10px] font-mono text-[#6E7380]">
                EV = Probabilidad × Valor Lead
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
              <div>
                <label className="text-[#6E7380] block mb-1">QUERY A TESTEAR:</label>
                <input
                  type="text"
                  value={wasteTestQuery}
                  onChange={(e) => setWasteTestQuery(e.target.value)}
                  className="w-full bg-[#FAFBFD] border border-[#E2E5E9] rounded-lg px-2.5 py-1.5 text-xs text-[#161B26] font-bold"
                />
              </div>

              <div>
                <label className="text-[#6E7380] block mb-1">CPC MÁXIMO (USD):</label>
                <input
                  type="number"
                  step="0.1"
                  value={wasteTestCpc}
                  onChange={(e) => setWasteTestCpc(Math.max(0.01, +e.target.value))}
                  className="w-full bg-[#FAFBFD] border border-[#E2E5E9] rounded-lg px-2.5 py-1.5 text-xs text-[#161B26] font-bold"
                />
              </div>

              <div>
                <label className="text-[#6E7380] block mb-1">PROBABILIDAD CONVERSIÓN (%):</label>
                <input
                  type="number"
                  step="0.1"
                  value={wasteTestProb}
                  onChange={(e) => setWasteTestProb(Math.max(0.01, +e.target.value))}
                  className="w-full bg-[#FAFBFD] border border-[#E2E5E9] rounded-lg px-2.5 py-1.5 text-xs text-[#161B26] font-bold"
                />
              </div>

              <div>
                <label className="text-[#6E7380] block mb-1">VALOR DEL LEAD / VENTA (USD):</label>
                <input
                  type="number"
                  step="10"
                  value={wasteTestLeadValue}
                  onChange={(e) => setWasteTestLeadValue(Math.max(1, +e.target.value))}
                  className="w-full bg-[#FAFBFD] border border-[#E2E5E9] rounded-lg px-2.5 py-1.5 text-xs text-[#161B26] font-bold"
                />
              </div>
            </div>

            {/* Veredicto de la Calculadora */}
            <div className={`p-4 rounded-xl border flex items-center justify-between ${
              liveZeroWaste.isWaste 
                ? 'bg-[#FEF2F2] border-[#FECDD3] text-[#991B1B]' 
                : 'bg-[#ECFDF5] border-[#A7F3D0] text-[#065F46]'
            }`}>
              <div>
                <span className="text-[10px] font-mono font-bold uppercase block">
                  {liveZeroWaste.isWaste ? '⚠ DETECCIÓN: QUERY CON PÉRDIDA MARGINAL (WASTE)' : '✓ CAPTURA DE VALOR RENTABLE'}
                </span>
                <p className="text-xs font-mono font-bold mt-0.5">
                  Valor Esperado (EV): ${liveZeroWaste.expectedValueUSD} USD vs CPC: ${wasteTestCpc.toFixed(2)} USD
                </p>
              </div>

              <div className="text-right font-mono">
                <span className="text-[10px] uppercase block opacity-80">
                  {liveZeroWaste.isWaste ? 'Desperdicio por Clic' : 'Ganancia Marginal'}
                </span>
                <span className="text-base font-black">
                  {liveZeroWaste.isWaste ? `-$${liveZeroWaste.wasteAmount} USD` : `+$${(liveZeroWaste.expectedValueUSD - wasteTestCpc).toFixed(2)} USD`}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 5. Señales Downstream para Lead Gen (09 Bidding) & Intent Value Score (04 IVS) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Ejercicio Numérico: Eventos Downstream ($10, $50, $250, $2,500) (6 cols) */}
        <div className="lg:col-span-6 bg-white p-6 rounded-2xl border border-[#E2E5E9] shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#E2E5E9]">
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#10B981]" />
              <h3 className="text-sm font-bold font-mono tracking-wider uppercase text-[#161B26]">
                09 / VALORES DOWNSTREAM PARA SMART BIDDING
              </h3>
            </div>
            <span className="text-[10px] font-mono font-bold text-[#10B981] bg-[#ECFDF5] px-2 py-0.5 rounded">
              VALORES REALES
            </span>
          </div>

          <p className="text-xs text-[#525866]">
            <strong>Principio:</strong> <em>"50 formularios basura no equivalen a 5 oportunidades reales. La medición debe devolver valor de negocio al algoritmo de Google Ads."</em>
          </p>

          <div className="space-y-2.5 font-mono">
            {[
              { event: 'Lead Inicial (Formulario enviado)', val: '$10 USD', desc: 'Captura básica de contacto; alto riesgo de spam o baja intención.' },
              { event: 'Qualified Lead (MQL validado)', val: '$50 USD', desc: 'Contacto verificado con presupuesto y perfil de cliente ideal (ICP).' },
              { event: 'Opportunity (SQL / Reunión comercial)', val: '$250 USD', desc: 'Propuesta económica presentada o demo técnica ejecutada.' },
              { event: 'Venta Cerrada (Won Deal / Cliente)', val: '$2,500 USD', desc: 'Ingreso real y facturado; retroalimenta el Smart Bidding hacia valor.' }
            ].map((ev, i) => (
              <div key={i} className="bg-[#FAFBFD] p-3 rounded-xl border border-[#E2E5E9] flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-[#161B26] block">{ev.event}</span>
                  <span className="text-[10px] text-[#6E7380]">{ev.desc}</span>
                </div>
                <span className="text-sm font-black text-[#10B981] bg-white px-2.5 py-1 rounded-lg border border-[#E2E5E9] flex-shrink-0 ml-2">
                  {ev.val}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Intent Value Score (IVS) - 5 Niveles Numéricos (6 cols) */}
        <div className="lg:col-span-6 bg-white p-6 rounded-2xl border border-[#E2E5E9] shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#E2E5E9]">
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#FFBA08]" />
              <h3 className="text-sm font-bold font-mono tracking-wider uppercase text-[#161B26]">
                04 / INTENT VALUE SCORE (IVS: 0 - 100)
              </h3>
            </div>
            <span className="text-[10px] font-mono font-bold text-[#946200] bg-[#FFF8D6] px-2 py-0.5 rounded">
              PUNTUACIÓN POR VALOR
            </span>
          </div>

          <p className="text-xs text-[#525866]">
            <strong>Fórmula:</strong> <code>IVS = Intención Comercial × Probabilidad × Valor Económico × Prioridad</code>
          </p>

          <div className="space-y-2 font-mono text-xs">
            {[
              { query: `qué es ${brands[0]?.brand.toLowerCase() || 'servicio'}`, intent: 'Informational', score: 16, note: 'Demanda válida, bajo valor inmediato' },
              { query: `${brands[0]?.brand.toLowerCase() || 'producto'} antes y después`, intent: 'Commercial', score: 48, note: 'Consideración con potencial' },
              { query: `mejor ${brands[0]?.brand.toLowerCase() || 'servicio'} ${location.toLowerCase()}`, intent: 'Commercial + Local', score: 76, note: 'Alta afinidad y proximidad física' },
              { query: `precio ${brands[0]?.brand.toLowerCase() || 'servicio'} ${location.toLowerCase()}`, intent: 'Transactional + Local', score: 91, note: 'Fuerte señal directa de compra' },
              { query: `comprar / contratar ${brands[0]?.brand.toLowerCase() || 'servicio'}`, intent: 'Transactional', score: 98, note: 'Intención casi directa de conversión' }
            ].map((q, i) => (
              <div key={i} className="bg-[#FAFBFD] p-2.5 rounded-xl border border-[#E2E5E9] flex items-center justify-between">
                <div className="truncate pr-2">
                  <span className="font-bold text-[#161B26] block truncate">"{q.query}"</span>
                  <span className="text-[10px] text-[#6E7380]">{q.note}</span>
                </div>
                <div className="flex items-center space-x-2 flex-shrink-0">
                  <span className="text-[10px] text-[#525866]">{q.intent}</span>
                  <span className={`px-2 py-0.5 rounded font-black text-xs ${
                    q.score >= 80 ? 'bg-[#ECFDF5] text-[#047857]' : q.score >= 50 ? 'bg-[#EFF6FF] text-[#1D4ED8]' : 'bg-[#F3F4F6] text-[#6E7380]'
                  }`}>
                    {q.score}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 6. Simulador Interactivo de Inversión en Medios (USD) */}
      <div className="bg-white rounded-2xl p-6 sm:p-7 border border-[#E2E5E9] shadow-xs space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between pb-5 border-b border-[#E2E5E9] gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <Sliders className="w-4 h-4 text-[#FFBA08]" />
              <h3 className="text-base sm:text-lg font-bold font-mono tracking-wider uppercase text-[#161B26]">
                SIMULADOR INTERACTIVO DE INVERSIÓN MENSUAL (USD)
              </h3>
            </div>
            <p className="text-xs text-[#6E7380] font-mono mt-0.5">
              AJUSTE DE PRESUPUESTO BASADO EN VALOR MARGINAL Y CUOTA DE ADQUISICIÓN
            </p>
          </div>

          {/* Presets Rápidos de Presupuesto */}
          <div className="flex items-center space-x-2">
            <span className="text-[11px] font-mono text-[#6E7380] font-bold">PRESETS:</span>
            {budgetPresets.map((preset) => (
              <button
                key={preset}
                onClick={() => handleBudgetChange(preset)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                  monthlyBudget === preset
                    ? 'bg-[#161B26] text-white shadow-xs'
                    : 'bg-[#F4F6F8] text-[#525866] hover:bg-[#E2E5E9]'
                }`}
              >
                ${preset.toLocaleString()}
              </button>
            ))}
          </div>
        </div>

        {/* Slider de Inversión */}
        <div className="space-y-2">
          <div className="flex items-center justify-between font-mono text-xs">
            <span className="text-[#6E7380]">PRESUPUESTO ASIGNADO:</span>
            <span className="text-2xl font-black text-[#161B26]">
              ${monthlyBudget.toLocaleString()} <span className="text-xs font-normal text-[#6E7380]">USD/mes</span>
            </span>
          </div>
          <input
            type="range"
            min={500}
            max={15000}
            step={250}
            value={monthlyBudget}
            onChange={(e) => handleBudgetChange(Number(e.target.value))}
            className="w-full h-2.5 bg-[#E2E5E9] rounded-lg appearance-none cursor-pointer accent-[#FFBA08]"
          />
        </div>

        {/* 4 Niveles de Distribución de Inversión */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
          {/* Nivel 1: Transaccional */}
          <div className="bg-[#FAFBFD] p-4 rounded-xl border border-[#E2E5E9]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] text-[#10B981] font-bold font-mono">01 // TRANSACCIONAL</span>
              <span className="font-mono text-xs font-bold text-[#10B981] bg-[#ECFDF5] px-1.5 py-0.5 rounded border border-[#A7F3D0]">
                {semStrategy.budgetSplit.transactionalPct}%
              </span>
            </div>
            <p className="text-xs text-[#6E7380] font-mono mb-1">CONVERSIÓN DIRECTA</p>
            <div className="flex items-baseline justify-between mb-2">
              <span className="text-xl font-bold font-mono text-[#161B26]">
                ${Math.round(calculations.transBudget).toLocaleString()}
              </span>
              <span className="text-xs font-mono text-[#525866]">
                ~{calculations.transClicks.toLocaleString()} clics
              </span>
            </div>
            <div className="w-full bg-[#E2E5E9] h-2 rounded-full overflow-hidden">
              <div 
                className="bg-[#10B981] h-full rounded-full" 
                style={{ width: `${semStrategy.budgetSplit.transactionalPct}%` }}
              />
            </div>
          </div>

          {/* Nivel 2: Brand Defense */}
          <div className="bg-[#FAFBFD] p-4 rounded-xl border border-[#E2E5E9]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] text-[#FFBA08] font-bold font-mono">02 // BRAND DEFENSE</span>
              <span className="font-mono text-xs font-bold text-[#946200] bg-[#FFF8D6] px-1.5 py-0.5 rounded border border-[#EADB9F]">
                {semStrategy.budgetSplit.brandDefensePct}%
              </span>
            </div>
            <p className="text-xs text-[#6E7380] font-mono mb-1">BLINDAJE PROPIO</p>
            <div className="flex items-baseline justify-between mb-2">
              <span className="text-xl font-bold font-mono text-[#161B26]">
                ${Math.round(calculations.defenseBudget).toLocaleString()}
              </span>
              <span className="text-xs font-mono text-[#525866]">
                ~{calculations.defenseClicks.toLocaleString()} clics
              </span>
            </div>
            <div className="w-full bg-[#E2E5E9] h-2 rounded-full overflow-hidden">
              <div 
                className="bg-[#FFBA08] h-full rounded-full" 
                style={{ width: `${semStrategy.budgetSplit.brandDefensePct}%` }}
              />
            </div>
          </div>

          {/* Nivel 3: Conquesting */}
          <div className="bg-[#FAFBFD] p-4 rounded-xl border border-[#E2E5E9]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] text-[#EF4444] font-bold font-mono">03 // CONQUESTING</span>
              <span className="font-mono text-xs font-bold text-[#EF4444] bg-[#FEF2F2] px-1.5 py-0.5 rounded border border-[#FECDD3]">
                {semStrategy.budgetSplit.competitorConquestPct}%
              </span>
            </div>
            <p className="text-xs text-[#6E7380] font-mono mb-1">INTERCEPCIÓN RIVAL</p>
            <div className="flex items-baseline justify-between mb-2">
              <span className="text-xl font-bold font-mono text-[#161B26]">
                ${Math.round(calculations.conquestBudget).toLocaleString()}
              </span>
              <span className="text-xs font-mono text-[#525866]">
                ~{calculations.conquestClicks.toLocaleString()} clics
              </span>
            </div>
            <div className="w-full bg-[#E2E5E9] h-2 rounded-full overflow-hidden">
              <div 
                className="bg-[#EF4444] h-full rounded-full" 
                style={{ width: `${semStrategy.budgetSplit.competitorConquestPct}%` }}
              />
            </div>
          </div>

          {/* Nivel 4: Comercial */}
          <div className="bg-[#FAFBFD] p-4 rounded-xl border border-[#E2E5E9]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] text-[#2563EB] font-bold font-mono">04 // EVALUACIÓN COMERCIAL</span>
              <span className="font-mono text-xs font-bold text-[#2563EB] bg-[#EFF6FF] px-1.5 py-0.5 rounded border border-[#BFDBFE]">
                {semStrategy.budgetSplit.commercialPct}%
              </span>
            </div>
            <p className="text-xs text-[#6E7380] font-mono mb-1">CATEGORÍAS Y GUÍAS</p>
            <div className="flex items-baseline justify-between mb-2">
              <span className="text-xl font-bold font-mono text-[#161B26]">
                ${Math.round(calculations.commBudget).toLocaleString()}
              </span>
              <span className="text-xs font-mono text-[#525866]">
                ~{calculations.commClicks.toLocaleString()} clics
              </span>
            </div>
            <div className="w-full bg-[#E2E5E9] h-2 rounded-full overflow-hidden">
              <div 
                className="bg-[#2563EB] h-full rounded-full" 
                style={{ width: `${semStrategy.budgetSplit.commercialPct}%` }}
              />
            </div>
          </div>
        </div>

        {/* Resumen de Métricas Proyectadas */}
        <div className="bg-[#161B26] text-white p-5 rounded-2xl border border-[#232836] flex flex-wrap items-center justify-between gap-4 shadow-md font-mono">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-[#FFBA08] text-[#161B26] flex items-center justify-center font-bold">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] text-[#9499A5]">CLICS CUALIFICADOS ESTIMADOS</p>
              <p className="text-2xl font-black text-white">{calculations.totalClicks.toLocaleString()}</p>
            </div>
          </div>

          <div className="flex items-center space-x-6 text-xs border-t sm:border-t-0 pt-3 sm:pt-0 border-[#2B3242]">
            <div>
              <p className="text-[#9499A5] text-[10px]">CPC BLENDED</p>
              <p className="text-white font-bold text-sm">${calculations.effectiveBlendedCpc} USD</p>
            </div>
            <div className="h-6 w-px bg-[#2B3242]" />
            <div>
              <p className="text-[#9499A5] text-[10px]">EST. CONVERSIONES</p>
              <p className="text-[#10B981] font-bold text-sm">~{calculations.totalConversions.toLocaleString()}</p>
            </div>
            <div className="h-6 w-px bg-[#2B3242]" />
            <div>
              <p className="text-[#9499A5] text-[10px]">CPA BLENDED</p>
              <p className="text-white font-bold text-sm">${calculations.blendedCpa} USD</p>
            </div>
            <div className="h-6 w-px bg-[#2B3242]" />
            <div>
              <p className="text-[#9499A5] text-[10px]">EFICIENCIA</p>
              <p className="text-[#FFBA08] font-bold text-sm">{calculations.intentEfficiencyScore}/100</p>
            </div>
          </div>
        </div>
      </div>

      {/* 7. Continuidad de Intención: Query -> Anuncio -> Landing -> CTA (08 Intent Continuity) */}
      <div className="bg-white rounded-2xl p-6 sm:p-7 border border-[#E2E5E9] shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#E2E5E9]">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#161B26]" />
            <h3 className="text-base font-bold font-mono tracking-wider uppercase text-[#161B26]">
              08 / INTENT CONTINUITY: QUERY → AD → LANDING → CTA
            </h3>
          </div>
          <span className="text-[10px] font-mono text-[#6E7380] bg-[#F4F6F8] px-2 py-0.5 rounded border border-[#E2E5E9]">
            EXPERIENCIA DE DEMANDA
          </span>
        </div>

        <p className="text-xs text-[#525866]">
          La experiencia correcta depende de lo que la persona intentó resolver, no solo del producto que vendemos:
        </p>

        <div className="border border-[#E2E5E9] rounded-xl overflow-hidden">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-[#FAFBFD] text-[#525866] border-b border-[#E2E5E9]">
              <tr>
                <th className="px-4 py-2.5 font-bold">INTENCIÓN</th>
                <th className="px-4 py-2.5 font-bold">PREGUNTA MENTAL</th>
                <th className="px-4 py-2.5 font-bold">RESPUESTA / PROMESA</th>
                <th className="px-4 py-2.5 font-bold">LANDING IDEAL</th>
                <th className="px-4 py-2.5 font-bold">CTA PRINCIPAL</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E5E9]">
              <tr className="hover:bg-[#F8FAFC]">
                <td className="px-4 py-2.5 font-bold text-[#10B981]">Transactional</td>
                <td className="px-4 py-2.5 text-[#525866]">¿Cuánto cuesta / cómo compro?</td>
                <td className="px-4 py-2.5 font-sans text-[#161B26]">Oferta, precio, disponibilidad, entrega</td>
                <td className="px-4 py-2.5 text-[#2563EB]">Conversion landing / Checkout</td>
                <td className="px-4 py-2.5 font-bold text-[#10B981]">Comprar / Agendar ahora</td>
              </tr>
              <tr className="hover:bg-[#F8FAFC]">
                <td className="px-4 py-2.5 font-bold text-[#2563EB]">Commercial</td>
                <td className="px-4 py-2.5 text-[#525866]">¿Por qué ustedes? ¿Cuál es mejor?</td>
                <td className="px-4 py-2.5 font-sans text-[#161B26]">Prueba social, diferencial, comparativa</td>
                <td className="px-4 py-2.5 text-[#2563EB]">Product / Comparison page</td>
                <td className="px-4 py-2.5 font-bold text-[#2563EB]">Ver comparativa / Cotizar</td>
              </tr>
              <tr className="hover:bg-[#F8FAFC]">
                <td className="px-4 py-2.5 font-bold text-[#FFBA08]">Brand Defense</td>
                <td className="px-4 py-2.5 text-[#525866]">¿Estoy en el lugar correcto?</td>
                <td className="px-4 py-2.5 font-sans text-[#161B26]">Confirmación oficial y acceso directo</td>
                <td className="px-4 py-2.5 text-[#2563EB]">Homepage oficial / Portal seguro</td>
                <td className="px-4 py-2.5 font-bold text-[#FFBA08]">Acceso directo seguro</td>
              </tr>
              <tr className="hover:bg-[#F8FAFC]">
                <td className="px-4 py-2.5 font-bold text-[#047857]">Local</td>
                <td className="px-4 py-2.5 text-[#525866]">¿Dónde y cuándo atienden?</td>
                <td className="px-4 py-2.5 font-sans text-[#161B26]">Ubicación, horario, llamada directa</td>
                <td className="px-4 py-2.5 text-[#2563EB]">Location page / Google Maps</td>
                <td className="px-4 py-2.5 font-bold text-[#047857]">Cómo llegar / Llamar</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* 8. Estructura de Campañas y Blueprint de Anuncios */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Campañas & Keywords (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl p-6 border border-[#E2E5E9] shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#E2E5E9] gap-2">
            <div className="flex items-center space-x-2">
              <Target className="w-4 h-4 text-[#FFBA08]" />
              <h3 className="text-sm font-bold font-mono tracking-wider uppercase text-[#161B26]">
                ESTRUCTURA DE CAMPAÑAS Y PALABRAS CLAVE
              </h3>
            </div>
            
            <div className="flex flex-wrap gap-1">
              {semStrategy.campaigns.map((camp, idx) => (
                <button
                  key={camp.campaignName}
                  onClick={() => {
                    ramAudio.playSwitch();
                    setActiveCampaignIdx(idx);
                  }}
                  className={`px-2 py-1 rounded-lg text-[10px] font-mono font-bold transition-all ${
                    activeCampaignIdx === idx 
                      ? 'bg-[#161B26] text-white' 
                      : 'bg-[#F4F6F8] text-[#525866] hover:bg-[#E2E5E9]'
                  }`}
                >
                  {camp.campaignName.split(' - ')[0] || `C${idx + 1}`}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-[#FAFBFD] p-3.5 rounded-xl border border-[#E2E5E9] font-mono text-xs flex justify-between items-center">
            <div>
              <span className="text-[10px] text-[#6E7380] block">CAMPAÑA SELECCIONADA:</span>
              <strong className="text-[#161B26]">{activeCampaign.campaignName}</strong>
            </div>
            <span className="bg-white border border-[#E2E5E9] px-2 py-1 rounded font-bold text-[#161B26] text-[11px]">
              {activeCampaign.biddingStrategy}
            </span>
          </div>

          <div className="border border-[#E2E5E9] rounded-xl overflow-hidden">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-[#FAFBFD] text-[#525866] border-b border-[#E2E5E9]">
                <tr>
                  <th className="px-3.5 py-2 font-bold">KEYWORD</th>
                  <th className="px-3.5 py-2 font-bold">MATCH TYPE</th>
                  <th className="px-3.5 py-2 font-bold">EST. CPC</th>
                  <th className="px-3.5 py-2 font-bold">JUSTIFICACIÓN</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E5E9]">
                {activeCampaign.targetKeywords.map((k, i) => (
                  <tr key={i} className="hover:bg-[#F8FAFC]">
                    <td className="px-3.5 py-2 font-bold text-[#161B26] font-sans">{k.keyword}</td>
                    <td className="px-3.5 py-2 text-[11px] text-[#525866]">{k.matchType}</td>
                    <td className="px-3.5 py-2 font-bold text-[#161B26]">${k.cpcEstimateUSD.toFixed(2)}</td>
                    <td className="px-3.5 py-2 text-[11px] text-[#6E7380]">{k.intentRationale}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Blueprint del Anuncio (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl p-6 border border-[#E2E5E9] shadow-xs space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#E2E5E9]">
              <span className="font-mono text-xs font-bold text-[#161B26] uppercase">
                BLUEPRINT DE ANUNCIO ADAPTATIVO (RSA)
              </span>
              <span className="text-[10px] font-mono text-[#10B981] font-bold bg-[#ECFDF5] px-2 py-0.5 rounded">
                ALTA RELEVANCIA
              </span>
            </div>

            {/* Simulación visual de Google Search SERP */}
            <div className="mt-4 bg-[#FAFBFD] p-4 rounded-xl border border-[#E2E5E9] space-y-2 font-sans">
              <div className="flex items-center space-x-1 text-[11px] text-[#202124]">
                <span className="font-bold text-[#202124]">Patrocinado</span>
                <span className="text-[#5f6368]">·</span>
                <span className="text-[#5f6368] font-mono truncate">https://www.{brands[0]?.brand.toLowerCase() || 'marca'}.com.ec</span>
              </div>
              <h4 className="text-base font-semibold text-[#1a0dab] hover:underline cursor-pointer leading-snug">
                {activeCampaign.adCopyBlueprint.headlines[0]} | {activeCampaign.adCopyBlueprint.headlines[1] || 'Ecuador'}
              </h4>
              <p className="text-xs text-[#4d5156] leading-relaxed">
                {activeCampaign.adCopyBlueprint.descriptions[0]}
              </p>
              <div className="pt-2 flex flex-wrap gap-2 text-[11px] text-[#1a0dab] font-medium">
                {activeCampaign.adCopyBlueprint.recommendedExtensions.map((ext, idx) => (
                  <span key={idx} className="hover:underline cursor-pointer bg-white px-2 py-0.5 rounded border border-[#E2E5E9]">
                    {ext}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-[#E2E5E9] flex items-center justify-between text-[11px] font-mono text-[#6E7380]">
            <span>CTA: <strong className="text-[#161B26]">{activeCampaign.adCopyBlueprint.callToAction}</strong></span>
            <span className="text-[#10B981] font-bold">QUALITY SCORE: 9/10</span>
          </div>
        </div>

      </div>

    </div>
  );
};
