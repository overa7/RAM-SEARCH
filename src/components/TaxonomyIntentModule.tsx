import React, { useState, useMemo } from 'react';
import { 
  Layers, 
  Search, 
  Filter, 
  ExternalLink, 
  CheckCircle2, 
  Compass, 
  Tag, 
  TrendingUp, 
  ArrowUpRight, 
  Zap, 
  HelpCircle,
  Eye,
  Info
} from 'lucide-react';
import { 
  DescriptiveIntentQuery, 
  IntentFamily, 
  OperationalCluster, 
  BrandComparison 
} from '../types';
import { 
  INTENT_FAMILIES_INFO, 
  OPERATIONAL_CLUSTERS_INFO 
} from '../services/taxonomyService';
import { ramAudio } from '../utils/audio';

interface TaxonomyIntentModuleProps {
  categoryQueries: DescriptiveIntentQuery[];
  brands: BrandComparison[];
  location: string;
  categoryTopic: string;
}

export const TaxonomyIntentModule: React.FC<TaxonomyIntentModuleProps> = ({
  categoryQueries,
  brands,
  location,
  categoryTopic
}) => {
  const [selectedScope, setSelectedScope] = useState<string>('all');
  const [selectedFamily, setSelectedFamily] = useState<string>('all');
  const [selectedCluster, setSelectedCluster] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedQueryItem, setSelectedQueryItem] = useState<DescriptiveIntentQuery | null>(null);

  // Unificar todas las consultas de la categoría y de las marcas
  const allDecodedQueries = useMemo(() => {
    const list: DescriptiveIntentQuery[] = [...categoryQueries];
    brands.forEach(b => {
      if (b.topBrandQueries) {
        list.push(...b.topBrandQueries);
      }
    });
    return list;
  }, [categoryQueries, brands]);

  // Filtrado de consultas
  const filteredQueries = useMemo(() => {
    return allDecodedQueries.filter(item => {
      // Filtro de alcance (Categoría o Marca específica)
      if (selectedScope === 'category' && item.scope !== 'Categoría') return false;
      if (selectedScope !== 'all' && selectedScope !== 'category' && item.brand !== selectedScope) return false;

      // Filtro de familia de intención
      if (selectedFamily !== 'all' && item.primaryFamily !== selectedFamily) return false;

      // Filtro de cluster operativo
      if (selectedCluster !== 'all' && item.operationalCluster !== selectedCluster) return false;

      // Búsqueda de texto
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          item.query.toLowerCase().includes(q) ||
          item.subintent.toLowerCase().includes(q) ||
          (item.brand && item.brand.toLowerCase().includes(q))
        );
      }

      return true;
    });
  }, [allDecodedQueries, selectedScope, selectedFamily, selectedCluster, searchQuery]);

  return (
    <div className="bg-white rounded-2xl p-5 sm:p-7 border border-[#E2E5E9] shadow-xs space-y-6">
      
      {/* Encabezado del Módulo de Taxonomía */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#E2E5E9] gap-3">
        <div>
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#161B26]" />
            <h3 className="text-base sm:text-lg font-black font-mono tracking-wider uppercase text-[#161B26]">
              TAXONOMÍA DE INTENCIÓN DE BÚSQUEDA // GOOGLE SEARCH INTENT
            </h3>
          </div>
          <p className="text-xs text-[#525866] font-sans mt-1">
            Tipología descriptiva y operativa aplicada a las búsquedas de mayor volumen de la <strong>Categoría</strong> y de <strong>cada una de las marcas</strong> en {location}.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-[10px] font-mono font-bold bg-[#FAFBFD] text-[#161B26] border border-[#E2E5E9] px-2.5 py-1 rounded-full flex items-center space-x-1.5">
            <Layers className="w-3 h-3 text-[#FFBA08]" />
            <span>7 FAMILIAS · 251 SUBINTENCIONES</span>
          </span>
        </div>
      </div>

      {/* Resumen de las 7 Familias Oficiales */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
        {(Object.keys(INTENT_FAMILIES_INFO) as IntentFamily[]).map((famKey) => {
          const fam = INTENT_FAMILIES_INFO[famKey];
          const isSelected = selectedFamily === famKey;
          return (
            <button
              key={famKey}
              onClick={() => {
                ramAudio.playSwitch();
                setSelectedFamily(isSelected ? 'all' : famKey);
              }}
              className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between ${
                isSelected 
                  ? 'bg-[#161B26] text-white border-[#161B26] shadow-xs' 
                  : 'bg-[#FAFBFD] hover:bg-white text-[#161B26] border-[#E2E5E9]'
              }`}
            >
              <div>
                <span className={`inline-block text-[9px] font-mono font-bold px-1.5 py-0.5 rounded uppercase tracking-wider mb-1 ${
                  isSelected ? 'bg-[#FFBA08] text-[#161B26]' : `${fam.badgeBg} ${fam.badgeText} border ${fam.badgeBorder}`
                }`}>
                  {fam.shortName}
                </span>
                <p className={`text-[11px] font-mono font-bold line-clamp-1 ${isSelected ? 'text-white' : 'text-[#161B26]'}`}>
                  {fam.googleIntent}
                </p>
              </div>
              <span className={`text-[10px] font-mono mt-2 flex items-center justify-between ${isSelected ? 'text-[#FFBA08]' : 'text-[#6E7380]'}`}>
                <span>{fam.operationalCluster}</span>
                <ArrowUpRight className="w-3 h-3" />
              </span>
            </button>
          );
        })}
      </div>

      {/* Barra de Filtros y Búsqueda */}
      <div className="bg-[#FAFBFD] p-3.5 rounded-xl border border-[#E2E5E9] flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs font-mono">
        
        {/* Selector de Alcance (Scope) */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-[#6E7380] font-bold text-[11px] mr-1">ALCANCE:</span>
          
          <button
            onClick={() => {
              ramAudio.playClick(600, 0.02);
              setSelectedScope('all');
            }}
            className={`px-2.5 py-1 rounded-lg transition-all ${
              selectedScope === 'all' 
                ? 'bg-[#161B26] text-white font-bold' 
                : 'bg-white text-[#525866] border border-[#E2E5E9] hover:bg-[#F4F6F8]'
            }`}
          >
            TODAS ({allDecodedQueries.length})
          </button>

          <button
            onClick={() => {
              ramAudio.playClick(600, 0.02);
              setSelectedScope('category');
            }}
            className={`px-2.5 py-1 rounded-lg transition-all ${
              selectedScope === 'category' 
                ? 'bg-[#161B26] text-white font-bold' 
                : 'bg-white text-[#525866] border border-[#E2E5E9] hover:bg-[#F4F6F8]'
            }`}
          >
            CATEGORÍA ({categoryQueries.length})
          </button>

          {brands.map(b => (
            <button
              key={b.brand}
              onClick={() => {
                ramAudio.playClick(600, 0.02);
                setSelectedScope(b.brand);
              }}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                selectedScope === b.brand 
                  ? 'bg-[#FFBA08] text-[#161B26] font-bold' 
                  : 'bg-white text-[#525866] border border-[#E2E5E9] hover:bg-[#F4F6F8]'
              }`}
            >
              {b.brand} ({b.topBrandQueries?.length || 0})
            </button>
          ))}
        </div>

        {/* Búsqueda Rápida */}
        <div className="relative min-w-[200px] sm:min-w-[240px]">
          <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-[#6E7380]" />
          <input
            type="text"
            placeholder="Filtrar consulta, subtipo..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-[#E2E5E9] rounded-lg pl-8 pr-3 py-1.5 text-xs text-[#161B26] placeholder-[#9499A5] focus:outline-hidden focus:border-[#FFBA08]"
          />
        </div>
      </div>

      {/* Tabla de Consultas Decodificadas con la Taxonomía */}
      <div className="border border-[#E2E5E9] rounded-xl overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAFBFD] text-[#525866] font-mono border-b border-[#E2E5E9]">
              <tr>
                <th className="px-4 py-3 font-bold">ALCANCE / ENTIDAD</th>
                <th className="px-4 py-3 font-bold">CONSULTA (QUERY)</th>
                <th className="px-4 py-3 font-bold">FAMILIA & GOOGLE INTENT</th>
                <th className="px-4 py-3 font-bold">SUBINTENCIÓN DESCRIPTIVA</th>
                <th className="px-4 py-3 font-bold">CLUSTER</th>
                <th className="px-4 py-3 font-bold">VOLUMEN</th>
                <th className="px-4 py-3 font-bold text-center">IVS (0-100)</th>
                <th className="px-4 py-3 font-bold text-center">DETALLE</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E5E9] font-mono">
              {filteredQueries.length > 0 ? (
                filteredQueries.map((item, idx) => {
                  const familyInfo = INTENT_FAMILIES_INFO[item.primaryFamily];
                  const isSelected = selectedQueryItem?.query === item.query;
                  return (
                    <tr 
                      key={idx} 
                      className={`hover:bg-[#F8FAFC] transition-colors cursor-pointer ${
                        isSelected ? 'bg-[#FFFDF5]' : ''
                      }`}
                      onClick={() => {
                        ramAudio.playClick(700, 0.02);
                        setSelectedQueryItem(isSelected ? null : item);
                      }}
                    >
                      <td className="px-4 py-3 font-bold">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] ${
                          item.scope === 'Categoría' 
                            ? 'bg-[#161B26] text-white' 
                            : 'bg-[#FFF8D6] text-[#946200] border border-[#EADB9F]'
                        }`}>
                          {item.scope === 'Categoría' ? 'CATEGORÍA' : item.brand}
                        </span>
                      </td>

                      <td className="px-4 py-3 font-sans font-semibold text-[#161B26]">
                        {item.query}
                      </td>

                      <td className="px-4 py-3">
                        <div className="flex flex-col space-y-0.5">
                          <span className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-bold border ${familyInfo.badgeBg} ${familyInfo.badgeText} ${familyInfo.badgeBorder}`}>
                            {familyInfo.shortName}
                          </span>
                          <span className="text-[10px] text-[#6E7380]">
                            Google: {item.googleIntent}
                          </span>
                        </div>
                      </td>

                      <td className="px-4 py-3 font-sans text-[#2B3242]">
                        <span className="font-semibold text-xs text-[#161B26]">{item.subintent}</span>
                        <div className="text-[10px] font-mono text-[#6E7380]">
                          Etapa: {item.decisionStage}
                        </div>
                      </td>

                      <td className="px-4 py-3">
                        <span className="bg-[#FAFBFD] text-[#161B26] border border-[#E2E5E9] px-2 py-0.5 rounded text-[10px] font-bold">
                          {item.operationalCluster}
                        </span>
                      </td>

                      <td className="px-4 py-3 font-bold text-[#161B26]">
                        {item.monthlyVolume}
                      </td>

                      <td className="px-4 py-3 text-center">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded font-bold text-[11px] ${
                          item.intentValueScore >= 80 
                            ? 'bg-[#ECFDF5] text-[#047857] border border-[#A7F3D0]' 
                            : item.intentValueScore >= 50 
                            ? 'bg-[#EFF6FF] text-[#1D4ED8] border border-[#BFDBFE]' 
                            : 'bg-[#F3F4F6] text-[#6E7380] border border-[#E2E5E9]'
                        }`}>
                          {item.intentValueScore}/100
                        </span>
                      </td>

                      <td className="px-4 py-3 text-center">
                        <button
                          className="p-1 hover:bg-[#E2E5E9] rounded text-[#6E7380] hover:text-[#161B26] transition-colors"
                          title="Ver esquema maestro"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-[#6E7380]">
                    NO SE ENCONTRARON CONSULTAS CON LOS FILTROS SELECCIONADOS
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Ficha Desplegable del Esquema Maestro de la Consulta Seleccionada */}
      {selectedQueryItem && (
        <div className="bg-[#FAFBFD] p-5 rounded-xl border border-[#EADB9F] space-y-3 animate-fadeIn">
          <div className="flex items-center justify-between pb-2 border-b border-[#E2E5E9]">
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-[#FFBA08]" />
              <span className="font-mono text-xs font-bold text-[#161B26] uppercase">
                ESQUEMA MAESTRO DE CLASIFICACIÓN (PÁGINA 14 - TAXONOMÍA DE BÚSQUEDA)
              </span>
            </div>
            <button
              onClick={() => setSelectedQueryItem(null)}
              className="text-xs font-mono text-[#6E7380] hover:text-[#161B26]"
            >
              [CERRAR FICHA]
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs font-mono">
            <div className="bg-white p-3 rounded-lg border border-[#E2E5E9]">
              <span className="text-[10px] text-[#6E7380] block">CONSULTA</span>
              <strong className="text-[#161B26] font-sans text-xs">{selectedQueryItem.query}</strong>
            </div>

            <div className="bg-white p-3 rounded-lg border border-[#E2E5E9]">
              <span className="text-[10px] text-[#6E7380] block">PRIMARY INTENT</span>
              <strong className="text-[#161B26] text-xs">{selectedQueryItem.primaryFamily}</strong>
            </div>

            <div className="bg-white p-3 rounded-lg border border-[#E2E5E9]">
              <span className="text-[10px] text-[#6E7380] block">GOOGLE INTENT</span>
              <strong className="text-[#161B26] text-xs">{selectedQueryItem.googleIntent}</strong>
            </div>

            <div className="bg-white p-3 rounded-lg border border-[#E2E5E9]">
              <span className="text-[10px] text-[#6E7380] block">DECISION STAGE</span>
              <strong className="text-[#161B26] text-xs">{selectedQueryItem.decisionStage}</strong>
            </div>

            <div className="bg-white p-3 rounded-lg border border-[#E2E5E9]">
              <span className="text-[10px] text-[#6E7380] block">CONVERSION POTENTIAL</span>
              <strong className="text-[#10B981] text-xs">{selectedQueryItem.conversionPotential}</strong>
            </div>

            <div className="bg-white p-3 rounded-lg border border-[#E2E5E9]">
              <span className="text-[10px] text-[#6E7380] block">CPC BENCHMARK</span>
              <strong className="text-[#FFBA08] text-xs">${selectedQueryItem.cpcBenchmarkUSD.toFixed(2)} USD</strong>
            </div>
          </div>
        </div>
      )}

      {/* Nota Metodológica de Cierre */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between text-[11px] font-mono text-[#6E7380] pt-2 border-t border-[#E2E5E9] gap-2">
        <div className="flex items-center space-x-1.5">
          <Info className="w-3.5 h-3.5 text-[#161B26]" />
          <span>REGLA: CLASIFICAR PRIMERO LA NECESIDAD, NO LA PALABRA CLAVE AISLADA.</span>
        </div>
        <span className="text-[#161B26] font-bold">
          7 FAMILIAS · 251 SUBINTENCIONES · ESQUEMA MULTIDIMENSIONAL
        </span>
      </div>

    </div>
  );
};
