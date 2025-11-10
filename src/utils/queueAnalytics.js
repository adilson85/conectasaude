/**
 * Funções para análise de filas de espera
 */

/**
 * Calcula totais consolidados das filas
 * @param {Array} filas - Array de filas
 * @returns {Object} - Totais consolidados
 */
export function calculateQueueTotals(filas) {
  if (!filas || filas.length === 0) {
    return {
      totalPacientes: 0,
      totalVagas: 0,
      totalFilas: 0,
      tempoMedioEspera: 0,
      maiorTempoEspera: 0,
      taxaReaproveitamento: 0,
      vagasPerdidas: 0
    }
  }

  const totalPacientes = filas.reduce((sum, fila) => sum + fila.pacientesNaFila, 0)
  const totalVagas = filas.reduce((sum, fila) => sum + fila.vagasDisponiveis, 0)
  const totalVagasPerdidas = filas.reduce((sum, fila) => sum + (fila.vagasPerdidas || 0), 0)

  // Tempo médio ponderado pelo número de pacientes
  const tempoMedioEspera = filas.reduce((sum, fila) =>
    sum + (fila.tempoMedioEspera * fila.pacientesNaFila), 0) / totalPacientes

  const maiorTempoEspera = Math.max(...filas.map(f => f.maiorTempoEspera || 0))

  // Taxa média de reaproveitamento ponderada
  const taxaReaproveitamento = filas.reduce((sum, fila) =>
    sum + (fila.taxaReaproveitamento * fila.pacientesNaFila), 0) / totalPacientes

  return {
    totalPacientes,
    totalVagas,
    totalFilas: filas.length,
    tempoMedioEspera: Math.floor(tempoMedioEspera),
    maiorTempoEspera,
    taxaReaproveitamento: taxaReaproveitamento.toFixed(2),
    vagasPerdidas: totalVagasPerdidas
  }
}

/**
 * Identifica filas críticas (> 30, 60, 90 dias)
 * @param {Array} filas - Array de filas
 * @returns {Object} - Filas por criticidade
 */
export function categorizeCriticalQueues(filas) {
  if (!filas || filas.length === 0) {
    return {
      criticas: [],
      alerta: [],
      atencao: [],
      normais: []
    }
  }

  const criticas = filas.filter(f => f.maiorTempoEspera > 90)
  const alerta = filas.filter(f => f.maiorTempoEspera > 60 && f.maiorTempoEspera <= 90)
  const atencao = filas.filter(f => f.maiorTempoEspera > 30 && f.maiorTempoEspera <= 60)
  const normais = filas.filter(f => f.maiorTempoEspera <= 30)

  return {
    criticas: criticas.sort((a, b) => b.maiorTempoEspera - a.maiorTempoEspera),
    alerta: alerta.sort((a, b) => b.maiorTempoEspera - a.maiorTempoEspera),
    atencao: atencao.sort((a, b) => b.maiorTempoEspera - a.maiorTempoEspera),
    normais
  }
}

/**
 * Analisa distribuição de filas por região
 * @param {Array} filas - Array de filas
 * @returns {Array} - Análise por região
 */
export function analyzeQueuesByRegion(filas) {
  if (!filas || filas.length === 0) return []

  const regiaoMap = {}

  filas.forEach(fila => {
    if (!regiaoMap[fila.regiao]) {
      regiaoMap[fila.regiao] = {
        regiao: fila.regiao,
        totalPacientes: 0,
        totalVagas: 0,
        totalFilas: 0,
        tempoMedioEspera: 0,
        filasCriticas: 0,
        filasAlerta: 0
      }
    }

    const r = regiaoMap[fila.regiao]
    r.totalPacientes += fila.pacientesNaFila
    r.totalVagas += fila.vagasDisponiveis
    r.totalFilas++
    r.tempoMedioEspera += fila.tempoMedioEspera * fila.pacientesNaFila

    if (fila.maiorTempoEspera > 90) r.filasCriticas++
    else if (fila.maiorTempoEspera > 60) r.filasAlerta++
  })

  return Object.values(regiaoMap).map(r => ({
    ...r,
    tempoMedioEspera: r.totalPacientes > 0
      ? Math.floor(r.tempoMedioEspera / r.totalPacientes)
      : 0
  })).sort((a, b) => b.totalPacientes - a.totalPacientes)
}

/**
 * Analisa distribuição de filas por UBS
 * @param {Array} filas - Array de filas
 * @returns {Array} - Análise por UBS
 */
export function analyzeQueuesByUBS(filas) {
  if (!filas || filas.length === 0) return []

  const ubsMap = {}

  filas.forEach(fila => {
    const key = `${fila.regiao}-${fila.ubs}`

    if (!ubsMap[key]) {
      ubsMap[key] = {
        regiao: fila.regiao,
        ubs: fila.ubs,
        totalPacientes: 0,
        totalVagas: 0,
        totalFilas: 0,
        tempoMedioEspera: 0,
        filasCriticas: 0
      }
    }

    const u = ubsMap[key]
    u.totalPacientes += fila.pacientesNaFila
    u.totalVagas += fila.vagasDisponiveis
    u.totalFilas++
    u.tempoMedioEspera += fila.tempoMedioEspera * fila.pacientesNaFila

    if (fila.maiorTempoEspera > 90) u.filasCriticas++
  })

  return Object.values(ubsMap).map(u => ({
    ...u,
    tempoMedioEspera: u.totalPacientes > 0
      ? Math.floor(u.tempoMedioEspera / u.totalPacientes)
      : 0
  })).sort((a, b) => b.totalPacientes - a.totalPacientes)
}

/**
 * Analisa distribuição por tipo de atendimento
 * @param {Array} filas - Array de filas
 * @returns {Array} - Análise por tipo
 */
export function analyzeQueuesByType(filas) {
  if (!filas || filas.length === 0) return []

  const tipoMap = {}

  filas.forEach(fila => {
    if (!tipoMap[fila.tipo]) {
      tipoMap[fila.tipo] = {
        tipo: fila.tipo,
        totalPacientes: 0,
        totalVagas: 0,
        totalFilas: 0,
        tempoMedioEspera: 0,
        filasCriticas: 0
      }
    }

    const t = tipoMap[fila.tipo]
    t.totalPacientes += fila.pacientesNaFila
    t.totalVagas += fila.vagasDisponiveis
    t.totalFilas++
    t.tempoMedioEspera += fila.tempoMedioEspera * fila.pacientesNaFila

    if (fila.maiorTempoEspera > 90) t.filasCriticas++
  })

  return Object.values(tipoMap).map(t => ({
    ...t,
    tempoMedioEspera: t.totalPacientes > 0
      ? Math.floor(t.tempoMedioEspera / t.totalPacientes)
      : 0
  })).sort((a, b) => b.totalPacientes - a.totalPacientes)
}

/**
 * Identifica oportunidades de reoferta
 * @param {Array} filas - Array de filas
 * @returns {Array} - Oportunidades identificadas
 */
export function identifyReofferOpportunities(filas) {
  if (!filas || filas.length === 0) return []

  // Oportunidades: filas com muitas vagas disponíveis e baixa taxa de reaproveitamento
  return filas
    .filter(f => f.vagasDisponiveis >= 5 || f.taxaReaproveitamento < 70)
    .map(f => ({
      ...f,
      oportunidadeScore: (f.vagasDisponiveis * 10) + (100 - f.taxaReaproveitamento)
    }))
    .sort((a, b) => b.oportunidadeScore - a.oportunidadeScore)
    .slice(0, 10) // Top 10 oportunidades
}

/**
 * Gera alertas e recomendações
 * @param {Array} filas - Array de filas
 * @param {Object} totais - Totais consolidados
 * @returns {Array} - Lista de alertas
 */
export function generateAlerts(filas, totais) {
  const alertas = []

  if (!filas || filas.length === 0) return alertas

  // Alerta de filas críticas
  const filasCriticas = filas.filter(f => f.maiorTempoEspera > 90)
  if (filasCriticas.length > 0) {
    alertas.push({
      tipo: 'critico',
      titulo: `${filasCriticas.length} filas críticas (>90 dias)`,
      mensagem: `Há ${filasCriticas.length} filas com tempo de espera superior a 90 dias, afetando ${filasCriticas.reduce((sum, f) => sum + f.pacientesNaFila, 0)} pacientes.`,
      acao: 'Priorizar redistribuição de recursos e reofer de vagas',
      prioridade: 'alta'
    })
  }

  // Alerta de vagas disponíveis não aproveitadas
  const vagasDisponiveis = totais.totalVagas
  if (vagasDisponiveis > 100) {
    alertas.push({
      tipo: 'oportunidade',
      titulo: `${vagasDisponiveis} vagas disponíveis`,
      mensagem: `Há ${vagasDisponiveis} vagas disponíveis no sistema que podem ser oferecidas para reduzir filas.`,
      acao: 'Iniciar processo de reoferta automática',
      prioridade: 'media'
    })
  }

  // Alerta de baixa taxa de reaproveitamento
  if (parseFloat(totais.taxaReaproveitamento) < 75) {
    alertas.push({
      tipo: 'atencao',
      titulo: 'Taxa de reaproveitamento abaixo do ideal',
      mensagem: `A taxa média de reaproveitamento está em ${totais.taxaReaproveitamento}%, abaixo da meta de 80%.`,
      acao: 'Revisar processos de reoferta e notificação',
      prioridade: 'media'
    })
  }

  // Alerta de tempo médio de espera alto
  if (totais.tempoMedioEspera > 45) {
    alertas.push({
      tipo: 'atencao',
      titulo: 'Tempo médio de espera elevado',
      mensagem: `O tempo médio de espera é de ${totais.tempoMedioEspera} dias, acima da meta de 30 dias.`,
      acao: 'Aumentar capacidade de atendimento ou redistribuir recursos',
      prioridade: 'alta'
    })
  }

  return alertas
}

/**
 * Filtra filas baseado nos filtros aplicados
 * @param {Array} filas - Array de filas
 * @param {Object} filters - Objeto com filtros
 * @returns {Array} - Array filtrado
 */
export function filterQueues(filas, filters) {
  return filas.filter(fila => {
    if (filters.regiao && fila.regiao !== filters.regiao) return false
    if (filters.ubs && fila.ubs !== filters.ubs) return false
    if (filters.tipo && fila.tipo !== filters.tipo) return false
    if (filters.especialidade && fila.especialidade !== filters.especialidade) return false
    if (filters.status && fila.status !== filters.status) return false
    if (filters.prioridade && fila.prioridade !== filters.prioridade) return false
    return true
  })
}
