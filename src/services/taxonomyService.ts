import { DescriptiveIntentQuery, IntentFamily, OperationalCluster, DecisionStage, BrandComparison } from '../types';
import { formatVolumeNumber } from './volumeCalibration';

/**
 * Catálogo Maestro de las 7 Familias Operativas de Intención de Búsqueda
 * Basado en el documento "TAXONOMÍA COMPLETA DE INTENCIÓN DE BÚSQUEDA" (Google + SEO Operacional)
 */
export const INTENT_FAMILIES_INFO: Record<IntentFamily, {
  name: string;
  shortName: string;
  googleIntent: string;
  objective: string;
  badgeBg: string;
  badgeText: string;
  badgeBorder: string;
  operationalCluster: OperationalCluster;
  examples: string[];
}> = {
  'Transaccional / Do': {
    name: 'Transaccional / Do',
    shortName: 'Transaccional',
    googleIntent: 'Do',
    objective: 'Ejecutar una acción o compra concreta (adquirir, pedir, agendar, suscribirse, descargar, cotizar, pagar).',
    badgeBg: 'bg-[#FFF8D6]',
    badgeText: 'text-[#946200]',
    badgeBorder: 'border-[#EADB9F]',
    operationalCluster: 'BUY',
    examples: ['comprar online', 'pedir delivery', 'agendar cita', 'cotizar seguro', 'pagar tarjeta']
  },
  'Investigación comercial / Commercial Investigation': {
    name: 'Investigación comercial / Commercial Investigation',
    shortName: 'Investigación Comercial',
    googleIntent: 'Know / Do mix',
    objective: 'Evaluar opciones, reducir incertidumbre, comparar alternativas y construir una decisión antes de actuar.',
    badgeBg: 'bg-[#EFF6FF]',
    badgeText: 'text-[#1D4ED8]',
    badgeBorder: 'border-[#BFDBFE]',
    operationalCluster: 'COMPARE',
    examples: ['mejores opciones 2026', 'marca X vs marca Y', 'precios y planes', 'opiniones y reviews', 'calidad precio']
  },
  'Local / Visit-in-Person': {
    name: 'Local / Visit-in-Person',
    shortName: 'Local',
    googleIntent: 'Visit-in-Person',
    objective: 'Encontrar, comparar o visitar una entidad física; la geografía, sucursal u horario es central.',
    badgeBg: 'bg-[#ECFDF5]',
    badgeText: 'text-[#047857]',
    badgeBorder: 'border-[#A7F3D0]',
    operationalCluster: 'VISIT',
    examples: ['cerca de mí', 'sucursal Quito', 'horario de atención', 'dirección y cómo llegar', 'tienda abierta ahora']
  },
  'Navegacional / Website': {
    name: 'Navegacional / Website',
    shortName: 'Navegacional',
    googleIntent: 'Website',
    objective: 'Llegar a un sitio web, app, portal institucional, login o recurso conocido.',
    badgeBg: 'bg-[#F3F4F6]',
    badgeText: 'text-[#374151]',
    badgeBorder: 'border-[#D1D5DB]',
    operationalCluster: 'RETURN',
    examples: ['sitio oficial', 'login portal', 'banca virtual', 'app móvil', 'contacto oficial']
  },
  'Informacional / Know': {
    name: 'Informacional / Know',
    shortName: 'Informacional',
    googleIntent: 'Know / Know Simple',
    objective: 'Obtener conocimiento, aprender, resolver una duda o explorar conceptos y datos.',
    badgeBg: 'bg-[#FAF5FF]',
    badgeText: 'text-[#7E22CE]',
    badgeBorder: 'border-[#E9D5FF]',
    operationalCluster: 'LEARN',
    examples: ['qué es', 'cómo funciona', 'requisitos para', 'guía paso a paso', 'beneficios de']
  },
  'Post-compra / Soporte': {
    name: 'Post-compra / Soporte',
    shortName: 'Post-compra',
    googleIntent: 'Website / Know',
    objective: 'Capturar búsquedas de clientes existentes: soporte técnico, garantía, facturación, seguimiento o reclamos.',
    badgeBg: 'bg-[#FFF1F2]',
    badgeText: 'text-[#BE123C]',
    badgeBorder: 'border-[#FECDD3]',
    operationalCluster: 'RETURN',
    examples: ['soporte técnico', 'rastrear pedido', 'descargar factura', 'reclamo servicio', 'garantía servicio']
  },
  'Multi-intent / Ambigua': {
    name: 'Multi-intent / Ambigua',
    shortName: 'Multi-intención',
    googleIntent: 'Mixed SERP',
    objective: 'Consultas donde coexisten varias necesidades simultáneas o el término es amplio/exploratorio.',
    badgeBg: 'bg-[#FEF3C7]',
    badgeText: 'text-[#B45309]',
    badgeBorder: 'border-[#FDE68A]',
    operationalCluster: 'EXPLORE',
    examples: ['término genérico', 'catálogo y promociones', 'guía y precios', 'novedades y modelos']
  }
};

/**
 * Clusters Operativos de la Taxonomía (7 Grupos de Acción SEM & SEO)
 */
export const OPERATIONAL_CLUSTERS_INFO: Record<OperationalCluster, {
  name: string;
  role: string;
  goal: string;
  typicalSubintents: string[];
}> = {
  LEARN: {
    name: 'LEARN (Entender)',
    role: 'Captura selectiva / Educación',
    goal: 'Explicación, How-to, Definición, Troubleshooting.',
    typicalSubintents: ['Definición', 'Procedimental / How-to', 'Benchmark', 'Explicativa', 'Guía']
  },
  EXPLORE: {
    name: 'EXPLORE (Descubrir opciones)',
    role: 'Ampliar demanda relevante',
    goal: 'Category browsing, Discovery, Inspiración de alternativas.',
    typicalSubintents: ['Exploración de categoría', 'Category browsing', 'Discovery', 'Tendencias']
  },
  COMPARE: {
    name: 'COMPARE (Evaluar alternativas)',
    role: 'Ganar consideración',
    goal: 'Best, vs, reviews, alternatives, pricing research.',
    typicalSubintents: ['Comparación X vs Y', 'Mejores / Best', 'Pricing research', 'Alternativas']
  },
  VALIDATE: {
    name: 'VALIDATE (Reducir riesgo)',
    role: 'Construir confianza',
    goal: 'Opiniones, reputación, proof, case studies, garantías.',
    typicalSubintents: ['Opiniones', 'Reputación / Confianza', 'Garantía / Warranty', 'Testimonios']
  },
  BUY: {
    name: 'BUY (Actuar / Comprar)',
    role: 'Conversión directa',
    goal: 'Comprar, cotizar, demo, registro, agendar, pedir.',
    typicalSubintents: ['Comprar', 'Order / Pedir', 'Agendar cita', 'Cotizar', 'Ecommerce product', 'Pago']
  },
  VISIT: {
    name: 'VISIT (Resolver localmente)',
    role: 'Conversión local',
    goal: 'Near me, horarios, open now, sucursales y ubicaciones físicas.',
    typicalSubintents: ['Sucursal', 'Near me', 'Horario', 'Store locator', 'Local transactional']
  },
  RETURN: {
    name: 'RETURN (Gestionar relación)',
    role: 'Servicio / Retención',
    goal: 'Pago de cuotas, tracking, soporte, cancelación, login.',
    typicalSubintents: ['Login', 'Soporte técnico', 'Facturación', 'Tracking', 'Atención al cliente']
  }
};

/**
 * Normaliza y clasifica la temática de categoría para evitar concatenaciones artificiales
 * como "análisis competitivo ... a domicilio ecuador ecuador".
 */
function normalizeCategoryContext(topic: string, location: string, brands: BrandComparison[]) {
  const normLocation = location?.trim() || 'Ecuador';
  
  // Limpiar frases de metadatos o prefijos de análisis
  let clean = topic
    .replace(/an[áa]lisis\s+competitivo\s+(de(l)?\s+)?/gi, '')
    .replace(/an[áa]lisis\s+comparativo\s+(de(l)?\s+)?/gi, '')
    .replace(/estudio\s+de\s+mercado\s+(de(l)?\s+)?/gi, '')
    .replace(/an[áa]lisis\s+de(l)?\s+/gi, '')
    .replace(/comparativa\s+de(l)?\s+/gi, '')
    .replace(/sector\s+(de(l)?\s+)?/gi, '')
    .replace(/industria\s+(de(l)?\s+)?/gi, '')
    .replace(/mercado\s+(de(l)?\s+)?/gi, '')
    .replace(new RegExp(`\\s+en\\s+${normLocation}`, 'gi'), '')
    .replace(new RegExp(`\\b${normLocation}\\b`, 'gi'), '')
    .replace(/\s+/g, ' ')
    .trim();

  const fullCorpus = `${topic} ${brands.map(b => b.brand).join(' ')}`.toLowerCase();

  // Detección de vertical por semántica
  if (
    fullCorpus.includes('banco') ||
    fullCorpus.includes('bancari') ||
    fullCorpus.includes('fintech') ||
    fullCorpus.includes('financier') ||
    fullCorpus.includes('prestamo') ||
    fullCorpus.includes('crédito') ||
    fullCorpus.includes('credito') ||
    fullCorpus.includes('tarjeta') ||
    fullCorpus.includes('invers') ||
    fullCorpus.includes('cooperativa') ||
    fullCorpus.includes('pichincha') ||
    fullCorpus.includes('guayaquil') ||
    fullCorpus.includes('produbanco') ||
    fullCorpus.includes('pacifico') ||
    fullCorpus.includes('deuna') ||
    fullCorpus.includes('payphone') ||
    fullCorpus.includes('kushki')
  ) {
    return {
      vertical: 'banking_fintech',
      displayName: clean || 'Banca y Fintech',
      categoryShort: 'servicios bancarios y fintech'
    };
  }

  if (
    fullCorpus.includes('auto') ||
    fullCorpus.includes('vehicul') ||
    fullCorpus.includes('carro') ||
    fullCorpus.includes('concesionar') ||
    fullCorpus.includes('chevrolet') ||
    fullCorpus.includes('kia') ||
    fullCorpus.includes('toyota') ||
    fullCorpus.includes('hyundai') ||
    fullCorpus.includes('chery') ||
    fullCorpus.includes('suv')
  ) {
    return {
      vertical: 'automotive',
      displayName: clean || 'Automotriz',
      categoryShort: 'autos y camionetas'
    };
  }

  if (
    fullCorpus.includes('internet') ||
    fullCorpus.includes('fibra') ||
    fullCorpus.includes('telecom') ||
    fullCorpus.includes('claro') ||
    fullCorpus.includes('movistar') ||
    fullCorpus.includes('cnt') ||
    fullCorpus.includes('celular') ||
    fullCorpus.includes('planes')
  ) {
    return {
      vertical: 'telecom',
      displayName: clean || 'Telecomunicaciones e Internet',
      categoryShort: 'planes de internet y telefonía'
    };
  }

  if (
    fullCorpus.includes('comida') ||
    fullCorpus.includes('restaurante') ||
    fullCorpus.includes('pizza') ||
    fullCorpus.includes('hamburguesa') ||
    fullCorpus.includes('pedidosya') ||
    fullCorpus.includes('rappi') ||
    fullCorpus.includes('supermaxi') ||
    fullCorpus.includes('supermercado') ||
    fullCorpus.includes('delivery') ||
    fullCorpus.includes('kfc')
  ) {
    return {
      vertical: 'food_delivery',
      displayName: clean || 'Alimentos y Delivery',
      categoryShort: clean || 'comida y restaurantes'
    };
  }

  if (
    fullCorpus.includes('salud') ||
    fullCorpus.includes('farmacia') ||
    fullCorpus.includes('medic') ||
    fullCorpus.includes('clinica') ||
    fullCorpus.includes('hospital') ||
    fullCorpus.includes('fybeca') ||
    fullCorpus.includes('seguro')
  ) {
    return {
      vertical: 'health_pharma',
      displayName: clean || 'Salud y Farmacia',
      categoryShort: 'farmacias y servicios de salud'
    };
  }

  if (
    fullCorpus.includes('universidad') ||
    fullCorpus.includes('educacion') ||
    fullCorpus.includes('colegio') ||
    fullCorpus.includes('maestria') ||
    fullCorpus.includes('carrera') ||
    fullCorpus.includes('instituto')
  ) {
    return {
      vertical: 'education',
      displayName: clean || 'Educación Superior',
      categoryShort: 'carreras universitarias y posgrados'
    };
  }

  return {
    vertical: 'general',
    displayName: clean || 'Servicios y Productos',
    categoryShort: clean || 'servicios y productos'
  };
}

/**
 * Genera la matriz decodificada de consultas de mayor volumen para la Categoría y cada Marca
 * aplicando rigurosamente la tipología descriptiva de la taxonomía.
 */
export function generateTaxonomyQueriesForMarket(
  categoryTopic: string,
  arg2: BrandComparison[] | string,
  arg3?: string | BrandComparison[]
): {
  categoryTopQueries: DescriptiveIntentQuery[];
  brandsWithDecodedQueries: BrandComparison[];
} {
  const brands: BrandComparison[] = Array.isArray(arg2) 
    ? arg2 
    : (Array.isArray(arg3) ? arg3 : []);
  const location: string = typeof arg2 === 'string' 
    ? arg2 
    : (typeof arg3 === 'string' ? arg3 : 'Ecuador');

  const categoryLeader = [...brands].sort((a, b) => b.shareOfSearch - a.shareOfSearch)[0] || brands[0];
  const secondBrand = brands.find(b => b.brand !== categoryLeader?.brand) || brands[1] || categoryLeader;
  const baseVol = categoryLeader?.monthlySearchVolumeNumeric || 250000;

  // Analizar vertical y nombre limpio
  const context = normalizeCategoryContext(categoryTopic, location, brands);
  const loc = location.toLowerCase();

  // 1. Consultas de Mayor Volumen a Nivel de Categoría adaptadas a la vertical real
  let categoryTopQueries: DescriptiveIntentQuery[] = [];

  if (context.vertical === 'banking_fintech') {
    categoryTopQueries = [
      {
        query: `abrir cuenta de ahorros en línea ${loc}`,
        scope: 'Categoría',
        primaryFamily: 'Transaccional / Do',
        googleIntent: 'Do',
        subintent: 'Apertura de cuenta + Onboarding digital',
        operationalCluster: 'BUY',
        decisionStage: 'Act',
        monthlyVolume: formatVolumeNumber(Math.round(baseVol * 0.48)),
        monthlyVolumeNumeric: Math.round(baseVol * 0.48),
        intentValueScore: 97,
        conversionPotential: 'Muy Alto',
        cpcBenchmarkUSD: 0.85,
        preferredModality: 'Formulario Digital + App'
      },
      {
        query: `mejores bancos y fintech en ${loc} para ahorrar e invertir`,
        scope: 'Categoría',
        primaryFamily: 'Investigación comercial / Commercial Investigation',
        googleIntent: 'Know/Do mix',
        subintent: 'Mejores / Best + Rentabilidad',
        operationalCluster: 'COMPARE',
        decisionStage: 'Compare',
        monthlyVolume: formatVolumeNumber(Math.round(baseVol * 0.36)),
        monthlyVolumeNumeric: Math.round(baseVol * 0.36),
        intentValueScore: 86,
        conversionPotential: 'Alto',
        cpcBenchmarkUSD: 0.72,
        preferredModality: 'Tabla Comparativa + Reviews'
      },
      {
        query: `comparar tasas de interés cuentas de ahorro y pólizas ${loc}`,
        scope: 'Categoría',
        primaryFamily: 'Investigación comercial / Commercial Investigation',
        googleIntent: 'Know/Do mix',
        subintent: 'Tasas de interés + Comparativa financiera',
        operationalCluster: 'COMPARE',
        decisionStage: 'Validate',
        monthlyVolume: formatVolumeNumber(Math.round(baseVol * 0.28)),
        monthlyVolumeNumeric: Math.round(baseVol * 0.28),
        intentValueScore: 89,
        conversionPotential: 'Muy Alto',
        cpcBenchmarkUSD: 0.95,
        preferredModality: 'Simulador Financiero + Ranking'
      },
      {
        query: `cajeros y agencias bancarias cerca de mí abiertas hoy`,
        scope: 'Categoría',
        primaryFamily: 'Local / Visit-in-Person',
        googleIntent: 'Visit-in-Person',
        subintent: 'Agencias + Cajeros automáticos + Horarios',
        operationalCluster: 'VISIT',
        decisionStage: 'Act',
        monthlyVolume: formatVolumeNumber(Math.round(baseVol * 0.32)),
        monthlyVolumeNumeric: Math.round(baseVol * 0.32),
        intentValueScore: 91,
        conversionPotential: 'Alto',
        cpcBenchmarkUSD: 0.35,
        preferredModality: 'Map Pack + Geolocalización'
      },
      {
        query: `requisitos para crédito personal o hipotecario en ${loc}`,
        scope: 'Categoría',
        primaryFamily: 'Informacional / Know',
        googleIntent: 'Know',
        subintent: 'Requisitos + Trámites y buró',
        operationalCluster: 'LEARN',
        decisionStage: 'Learn',
        monthlyVolume: formatVolumeNumber(Math.round(baseVol * 0.22)),
        monthlyVolumeNumeric: Math.round(baseVol * 0.22),
        intentValueScore: 45,
        conversionPotential: 'Medio',
        cpcBenchmarkUSD: 0.45,
        preferredModality: 'Guía Explicativa + FAQ'
      },
      {
        query: `préstamos rápidos en línea sin buró de crédito ${loc}`,
        scope: 'Categoría',
        primaryFamily: 'Transaccional / Do',
        googleIntent: 'Do',
        subintent: 'Microcrédito + Solicitud inmediata',
        operationalCluster: 'BUY',
        decisionStage: 'Act',
        monthlyVolume: formatVolumeNumber(Math.round(baseVol * 0.40)),
        monthlyVolumeNumeric: Math.round(baseVol * 0.40),
        intentValueScore: 95,
        conversionPotential: 'Muy Alto',
        cpcBenchmarkUSD: 1.10,
        preferredModality: 'Solicitud Inmediata + Scoring'
      }
    ];
  } else if (context.vertical === 'automotive') {
    categoryTopQueries = [
      {
        query: `cotizar autos nuevos financiamiento ${loc}`,
        scope: 'Categoría',
        primaryFamily: 'Transaccional / Do',
        googleIntent: 'Do',
        subintent: 'Cotización + Financiamiento',
        operationalCluster: 'BUY',
        decisionStage: 'Act',
        monthlyVolume: formatVolumeNumber(Math.round(baseVol * 0.42)),
        monthlyVolumeNumeric: Math.round(baseVol * 0.42),
        intentValueScore: 95,
        conversionPotential: 'Muy Alto',
        cpcBenchmarkUSD: 0.90,
        preferredModality: 'Cotizador + Ficha Técnica'
      },
      {
        query: `mejores autos suv calidad precio en ${loc}`,
        scope: 'Categoría',
        primaryFamily: 'Investigación comercial / Commercial Investigation',
        googleIntent: 'Know/Do mix',
        subintent: 'Mejores SUV + Relación valor/precio',
        operationalCluster: 'COMPARE',
        decisionStage: 'Compare',
        monthlyVolume: formatVolumeNumber(Math.round(baseVol * 0.35)),
        monthlyVolumeNumeric: Math.round(baseVol * 0.35),
        intentValueScore: 84,
        conversionPotential: 'Alto',
        cpcBenchmarkUSD: 0.75,
        preferredModality: 'Ranking + Comparativa'
      },
      {
        query: `concesionarias de autos abiertas cerca de mí`,
        scope: 'Categoría',
        primaryFamily: 'Local / Visit-in-Person',
        googleIntent: 'Visit-in-Person',
        subintent: 'Concesionarias + Talleres oficiales',
        operationalCluster: 'VISIT',
        decisionStage: 'Act',
        monthlyVolume: formatVolumeNumber(Math.round(baseVol * 0.30)),
        monthlyVolumeNumeric: Math.round(baseVol * 0.30),
        intentValueScore: 92,
        conversionPotential: 'Muy Alto',
        cpcBenchmarkUSD: 0.60,
        preferredModality: 'Mapa + Agendamiento Test Drive'
      },
      {
        query: `simulador de crédito vehicular y requisitos en ${loc}`,
        scope: 'Categoría',
        primaryFamily: 'Informacional / Know',
        googleIntent: 'Know',
        subintent: 'Simulador + Entrada y cuotas',
        operationalCluster: 'LEARN',
        decisionStage: 'Validate',
        monthlyVolume: formatVolumeNumber(Math.round(baseVol * 0.24)),
        monthlyVolumeNumeric: Math.round(baseVol * 0.24),
        intentValueScore: 78,
        conversionPotential: 'Alto',
        cpcBenchmarkUSD: 0.65,
        preferredModality: 'Calculadora de Cuotas'
      },
      {
        query: `promociones y bonos en autos nuevos 0km ${loc}`,
        scope: 'Categoría',
        primaryFamily: 'Investigación comercial / Commercial Investigation',
        googleIntent: 'Know/Do mix',
        subintent: 'Promociones + Bonos de descuento',
        operationalCluster: 'COMPARE',
        decisionStage: 'Select',
        monthlyVolume: formatVolumeNumber(Math.round(baseVol * 0.26)),
        monthlyVolumeNumeric: Math.round(baseVol * 0.26),
        intentValueScore: 88,
        conversionPotential: 'Alto',
        cpcBenchmarkUSD: 0.80,
        preferredModality: 'Catálogo de Promociones'
      }
    ];
  } else if (context.vertical === 'food_delivery') {
    categoryTopQueries = [
      {
        query: `pedir comida a domicilio en ${loc} online`,
        scope: 'Categoría',
        primaryFamily: 'Transaccional / Do',
        googleIntent: 'Do',
        subintent: 'Order / Pedir comida',
        operationalCluster: 'BUY',
        decisionStage: 'Act',
        monthlyVolume: formatVolumeNumber(Math.round(baseVol * 0.45)),
        monthlyVolumeNumeric: Math.round(baseVol * 0.45),
        intentValueScore: 96,
        conversionPotential: 'Muy Alto',
        cpcBenchmarkUSD: 0.35,
        preferredModality: 'App Delivery + Menú'
      },
      {
        query: `mejores restaurantes con promociones hoy en ${loc}`,
        scope: 'Categoría',
        primaryFamily: 'Investigación comercial / Commercial Investigation',
        googleIntent: 'Know/Do mix',
        subintent: 'Restaurantes + Ofertas 2x1',
        operationalCluster: 'COMPARE',
        decisionStage: 'Select',
        monthlyVolume: formatVolumeNumber(Math.round(baseVol * 0.32)),
        monthlyVolumeNumeric: Math.round(baseVol * 0.32),
        intentValueScore: 85,
        conversionPotential: 'Alto',
        cpcBenchmarkUSD: 0.28,
        preferredModality: 'Lista + Reseñas'
      },
      {
        query: `restaurantes y comida rápida abiertos cerca de mí`,
        scope: 'Categoría',
        primaryFamily: 'Local / Visit-in-Person',
        googleIntent: 'Visit-in-Person',
        subintent: 'Near me + Abierto ahora',
        operationalCluster: 'VISIT',
        decisionStage: 'Act',
        monthlyVolume: formatVolumeNumber(Math.round(baseVol * 0.28)),
        monthlyVolumeNumeric: Math.round(baseVol * 0.28),
        intentValueScore: 92,
        conversionPotential: 'Muy Alto',
        cpcBenchmarkUSD: 0.25,
        preferredModality: 'Mapa + Distancia'
      },
      {
        query: `supermercado online con entrega hoy en ${loc}`,
        scope: 'Categoría',
        primaryFamily: 'Transaccional / Do',
        googleIntent: 'Do',
        subintent: 'Compras del hogar + Despacho express',
        operationalCluster: 'BUY',
        decisionStage: 'Act',
        monthlyVolume: formatVolumeNumber(Math.round(baseVol * 0.25)),
        monthlyVolumeNumeric: Math.round(baseVol * 0.25),
        intentValueScore: 93,
        conversionPotential: 'Muy Alto',
        cpcBenchmarkUSD: 0.38,
        preferredModality: 'E-commerce + Checkout'
      }
    ];
  } else {
    // Categoría general con concatenación natural y limpia
    const cat = context.categoryShort;
    categoryTopQueries = [
      {
        query: `comprar ${cat} online en ${loc}`,
        scope: 'Categoría',
        primaryFamily: 'Transaccional / Do',
        googleIntent: 'Do',
        subintent: 'Compra en línea + Contratación',
        operationalCluster: 'BUY',
        decisionStage: 'Act',
        monthlyVolume: formatVolumeNumber(Math.round(baseVol * 0.40)),
        monthlyVolumeNumeric: Math.round(baseVol * 0.40),
        intentValueScore: 95,
        conversionPotential: 'Muy Alto',
        cpcBenchmarkUSD: 0.45,
        preferredModality: 'E-commerce + Catálogo'
      },
      {
        query: `mejores proveedores de ${cat} en ${loc} calidad precio`,
        scope: 'Categoría',
        primaryFamily: 'Investigación comercial / Commercial Investigation',
        googleIntent: 'Know/Do mix',
        subintent: 'Mejores opciones + Comparativa',
        operationalCluster: 'COMPARE',
        decisionStage: 'Compare',
        monthlyVolume: formatVolumeNumber(Math.round(baseVol * 0.30)),
        monthlyVolumeNumeric: Math.round(baseVol * 0.30),
        intentValueScore: 84,
        conversionPotential: 'Alto',
        cpcBenchmarkUSD: 0.40,
        preferredModality: 'Tabla Comparativa + Reviews'
      },
      {
        query: `comparar precios y planes de ${cat} en ${loc}`,
        scope: 'Categoría',
        primaryFamily: 'Investigación comercial / Commercial Investigation',
        googleIntent: 'Know/Do mix',
        subintent: 'Precios + Tarifas actualizadas',
        operationalCluster: 'COMPARE',
        decisionStage: 'Validate',
        monthlyVolume: formatVolumeNumber(Math.round(baseVol * 0.25)),
        monthlyVolumeNumeric: Math.round(baseVol * 0.25),
        intentValueScore: 88,
        conversionPotential: 'Alto',
        cpcBenchmarkUSD: 0.42,
        preferredModality: 'Comparador de Precios'
      },
      {
        query: `locales y oficinas de ${cat} cerca de mí en ${loc}`,
        scope: 'Categoría',
        primaryFamily: 'Local / Visit-in-Person',
        googleIntent: 'Visit-in-Person',
        subintent: 'Ubicación física + Horarios',
        operationalCluster: 'VISIT',
        decisionStage: 'Act',
        monthlyVolume: formatVolumeNumber(Math.round(baseVol * 0.22)),
        monthlyVolumeNumeric: Math.round(baseVol * 0.22),
        intentValueScore: 90,
        conversionPotential: 'Muy Alto',
        cpcBenchmarkUSD: 0.30,
        preferredModality: 'Mapa + Localizador'
      },
      {
        query: `ofertas y promociones en ${cat} ${loc} vigentes`,
        scope: 'Categoría',
        primaryFamily: 'Investigación comercial / Commercial Investigation',
        googleIntent: 'Know/Do mix',
        subintent: 'Ofertas + Descuentos especiales',
        operationalCluster: 'COMPARE',
        decisionStage: 'Select',
        monthlyVolume: formatVolumeNumber(Math.round(baseVol * 0.28)),
        monthlyVolumeNumeric: Math.round(baseVol * 0.28),
        intentValueScore: 89,
        conversionPotential: 'Muy Alto',
        cpcBenchmarkUSD: 0.48,
        preferredModality: 'Catálogo de Ofertas'
      }
    ];
  }

  // 2. Consultas de Mayor Volumen para CADA UNA de las Marcas
  const brandsWithDecodedQueries = brands.map((b) => {
    const brandVol = b.monthlySearchVolumeNumeric || 100000;
    const rival = brands.find(r => r.brand !== b.brand) || secondBrand;
    const bName = b.brand.toLowerCase();

    let topBrandQueries: DescriptiveIntentQuery[] = [];

    if (context.vertical === 'banking_fintech') {
      topBrandQueries = [
        {
          query: `abrir cuenta en ${bName} en línea requisitos`,
          scope: 'Marca',
          brand: b.brand,
          primaryFamily: 'Transaccional / Do',
          googleIntent: 'Do',
          subintent: 'Apertura de cuenta digital',
          operationalCluster: 'BUY',
          decisionStage: 'Act',
          monthlyVolume: formatVolumeNumber(Math.round(brandVol * 0.30)),
          monthlyVolumeNumeric: Math.round(brandVol * 0.30),
          intentValueScore: 98,
          conversionPotential: 'Muy Alto',
          cpcBenchmarkUSD: 0.85,
          preferredModality: 'Onboarding Digital + App'
        },
        {
          query: `${bName} banca web login / app personas`,
          scope: 'Marca',
          brand: b.brand,
          primaryFamily: 'Navegacional / Website',
          googleIntent: 'Website',
          subintent: 'Banca Virtual + Acceso a cuenta',
          operationalCluster: 'RETURN',
          decisionStage: 'Act',
          monthlyVolume: formatVolumeNumber(Math.round(brandVol * 0.42)),
          monthlyVolumeNumeric: Math.round(brandVol * 0.42),
          intentValueScore: 82,
          conversionPotential: 'Alto',
          cpcBenchmarkUSD: 0.18,
          preferredModality: 'Portal Oficial Seguro'
        },
        {
          query: `${bName} vs ${rival?.brand?.toLowerCase() || 'competencia'} tasas de interes y prestamos`,
          scope: 'Marca',
          brand: b.brand,
          primaryFamily: 'Investigación comercial / Commercial Investigation',
          googleIntent: 'Know/Do mix',
          subintent: 'Comparativa financiera X vs Y',
          operationalCluster: 'COMPARE',
          decisionStage: 'Compare',
          monthlyVolume: formatVolumeNumber(Math.round(brandVol * 0.12)),
          monthlyVolumeNumeric: Math.round(brandVol * 0.12),
          intentValueScore: 87,
          conversionPotential: 'Alto',
          cpcBenchmarkUSD: 0.75,
          preferredModality: 'Simulador y Comparador'
        },
        {
          query: `${bName} agencias cajeros y horarios en ${loc}`,
          scope: 'Marca',
          brand: b.brand,
          primaryFamily: 'Local / Visit-in-Person',
          googleIntent: 'Visit-in-Person',
          subintent: 'Agencias físicas + Horarios de atención',
          operationalCluster: 'VISIT',
          decisionStage: 'Act',
          monthlyVolume: formatVolumeNumber(Math.round(brandVol * 0.16)),
          monthlyVolumeNumeric: Math.round(brandVol * 0.16),
          intentValueScore: 88,
          conversionPotential: 'Muy Alto',
          cpcBenchmarkUSD: 0.25,
          preferredModality: 'Localizador de Agencias'
        },
        {
          query: `servicio al cliente ${bName} telefono reclamos y soporte`,
          scope: 'Marca',
          brand: b.brand,
          primaryFamily: 'Post-compra / Soporte',
          googleIntent: 'Website',
          subintent: 'Call center + Bloqueo de tarjetas / Reclamos',
          operationalCluster: 'RETURN',
          decisionStage: 'Post-purchase',
          monthlyVolume: formatVolumeNumber(Math.round(brandVol * 0.10)),
          monthlyVolumeNumeric: Math.round(brandVol * 0.10),
          intentValueScore: 25,
          conversionPotential: 'Bajo',
          cpcBenchmarkUSD: 0.20,
          preferredModality: 'Portal de Atención y Canales'
        }
      ];
    } else if (context.vertical === 'automotive') {
      topBrandQueries = [
        {
          query: `cotizar ${bName} precios y financiamiento ${loc}`,
          scope: 'Marca',
          brand: b.brand,
          primaryFamily: 'Transaccional / Do',
          googleIntent: 'Do',
          subintent: 'Cotización 0km + Crédito',
          operationalCluster: 'BUY',
          decisionStage: 'Act',
          monthlyVolume: formatVolumeNumber(Math.round(brandVol * 0.32)),
          monthlyVolumeNumeric: Math.round(brandVol * 0.32),
          intentValueScore: 97,
          conversionPotential: 'Muy Alto',
          cpcBenchmarkUSD: 0.95,
          preferredModality: 'Cotizador Oficial + Concesionario'
        },
        {
          query: `${bName} modelos y catalogo oficial ${loc}`,
          scope: 'Marca',
          brand: b.brand,
          primaryFamily: 'Navegacional / Website',
          googleIntent: 'Website',
          subintent: 'Sitio oficial + Fichas técnicas',
          operationalCluster: 'RETURN',
          decisionStage: 'Act',
          monthlyVolume: formatVolumeNumber(Math.round(brandVol * 0.34)),
          monthlyVolumeNumeric: Math.round(brandVol * 0.34),
          intentValueScore: 80,
          conversionPotential: 'Alto',
          cpcBenchmarkUSD: 0.25,
          preferredModality: 'Catálogo de Modelos'
        },
        {
          query: `${bName} vs ${rival?.brand?.toLowerCase() || 'competencia'} consumo y seguridad`,
          scope: 'Marca',
          brand: b.brand,
          primaryFamily: 'Investigación comercial / Commercial Investigation',
          googleIntent: 'Know/Do mix',
          subintent: 'Comparativa de modelos y rendimiento',
          operationalCluster: 'COMPARE',
          decisionStage: 'Compare',
          monthlyVolume: formatVolumeNumber(Math.round(brandVol * 0.14)),
          monthlyVolumeNumeric: Math.round(brandVol * 0.14),
          intentValueScore: 85,
          conversionPotential: 'Alto',
          cpcBenchmarkUSD: 0.70,
          preferredModality: 'Reseñas y Especificaciones'
        },
        {
          query: `concesionarias ${bName} talleres y repuestos ${loc}`,
          scope: 'Marca',
          brand: b.brand,
          primaryFamily: 'Local / Visit-in-Person',
          googleIntent: 'Visit-in-Person',
          subintent: 'Red de talleres y repuestos originales',
          operationalCluster: 'VISIT',
          decisionStage: 'Act',
          monthlyVolume: formatVolumeNumber(Math.round(brandVol * 0.18)),
          monthlyVolumeNumeric: Math.round(brandVol * 0.18),
          intentValueScore: 89,
          conversionPotential: 'Muy Alto',
          cpcBenchmarkUSD: 0.40,
          preferredModality: 'Ubicación de Concesionarias'
        }
      ];
    } else {
      topBrandQueries = [
        {
          query: `comprar en ${bName} online ${loc}`,
          scope: 'Marca',
          brand: b.brand,
          primaryFamily: 'Transaccional / Do',
          googleIntent: 'Do',
          subintent: 'Comprar + Ecommerce oficial',
          operationalCluster: 'BUY',
          decisionStage: 'Act',
          monthlyVolume: formatVolumeNumber(Math.round(brandVol * 0.28)),
          monthlyVolumeNumeric: Math.round(brandVol * 0.28),
          intentValueScore: 98,
          conversionPotential: 'Muy Alto',
          cpcBenchmarkUSD: 0.40,
          preferredModality: 'E-commerce + Checkout'
        },
        {
          query: `${bName} sitio oficial / app / catalogo`,
          scope: 'Marca',
          brand: b.brand,
          primaryFamily: 'Navegacional / Website',
          googleIntent: 'Website',
          subintent: 'Portal oficial de marca',
          operationalCluster: 'RETURN',
          decisionStage: 'Act',
          monthlyVolume: formatVolumeNumber(Math.round(brandVol * 0.36)),
          monthlyVolumeNumeric: Math.round(brandVol * 0.36),
          intentValueScore: 78,
          conversionPotential: 'Alto',
          cpcBenchmarkUSD: 0.15,
          preferredModality: 'Sitio Web Oficial'
        },
        {
          query: `${bName} vs ${rival?.brand?.toLowerCase() || 'competencia'} precios y opiniones`,
          scope: 'Marca',
          brand: b.brand,
          primaryFamily: 'Investigación comercial / Commercial Investigation',
          googleIntent: 'Know/Do mix',
          subintent: 'Comparativa de marcas y valor',
          operationalCluster: 'COMPARE',
          decisionStage: 'Compare',
          monthlyVolume: formatVolumeNumber(Math.round(brandVol * 0.14)),
          monthlyVolumeNumeric: Math.round(brandVol * 0.14),
          intentValueScore: 84,
          conversionPotential: 'Alto',
          cpcBenchmarkUSD: 0.45,
          preferredModality: 'Comparativa de Productos'
        },
        {
          query: `${bName} sucursales direcciones y horarios en ${loc}`,
          scope: 'Marca',
          brand: b.brand,
          primaryFamily: 'Local / Visit-in-Person',
          googleIntent: 'Visit-in-Person',
          subintent: 'Tiendas físicas + Horarios',
          operationalCluster: 'VISIT',
          decisionStage: 'Act',
          monthlyVolume: formatVolumeNumber(Math.round(brandVol * 0.18)),
          monthlyVolumeNumeric: Math.round(brandVol * 0.18),
          intentValueScore: 87,
          conversionPotential: 'Muy Alto',
          cpcBenchmarkUSD: 0.22,
          preferredModality: 'Localizador de Tiendas'
        },
        {
          query: `atención al cliente ${bName} teléfono reclamos soporte`,
          scope: 'Marca',
          brand: b.brand,
          primaryFamily: 'Post-compra / Soporte',
          googleIntent: 'Website',
          subintent: 'Soporte al cliente y postventa',
          operationalCluster: 'RETURN',
          decisionStage: 'Post-purchase',
          monthlyVolume: formatVolumeNumber(Math.round(brandVol * 0.08)),
          monthlyVolumeNumeric: Math.round(brandVol * 0.08),
          intentValueScore: 24,
          conversionPotential: 'Bajo',
          cpcBenchmarkUSD: 0.18,
          preferredModality: 'Canales de Contacto Oficial'
        }
      ];
    }

    return {
      ...b,
      topBrandQueries
    };
  });

  return {
    categoryTopQueries,
    brandsWithDecodedQueries
  };
}
