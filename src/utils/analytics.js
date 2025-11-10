/**
 * Funções avançadas de analytics e relatórios
 */

/**
 * Calcula análise por UBS
 * @param {Array} data - Array de agendamentos
 * @returns {Array} - Array com análise por UBS
 */
export function calculateAnalyticsByUBS(data) {
  const ubsMap = {}

  // Agrupa por UBS
  data.forEach(item => {
    if (!ubsMap[item.ubs]) {
      ubsMap[item.ubs] = {
        ubs: item.ubs,
        regiao: item.regiao,
        agendados: 0,
        confirmados: 0,
        presencas: 0,
        faltas: 0,
        cancelados: 0,
        avisados: 0
      }
    }

    const ubs = ubsMap[item.ubs]
    ubs.agendados++

    if (item.avisado) ubs.avisados++
    if (item.status === 'Confirmado' || item.confirmado) ubs.confirmados++
    if (item.status === 'Presente' || item.status === 'Compareceu') ubs.presencas++
    if (item.status === 'Faltou' || item.status === 'No-show') ubs.faltas++
    if (item.status === 'Cancelado') ubs.cancelados++
  })

  // Calcula KPIs por UBS
  return Object.values(ubsMap).map(ubs => ({
    ...ubs,
    taxaNoShow: ubs.agendados > 0 ? ((ubs.faltas / ubs.agendados) * 100).toFixed(2) : 0,
    taxaConfirmacao: ubs.avisados > 0 ? ((ubs.confirmados / ubs.avisados) * 100).toFixed(2) : 0,
    taxaPresenca: ubs.agendados > 0 ? ((ubs.presencas / ubs.agendados) * 100).toFixed(2) : 0,
    taxaCancelamento: ubs.agendados > 0 ? ((ubs.cancelados / ubs.agendados) * 100).toFixed(2) : 0
  })).sort((a, b) => parseFloat(b.taxaPresenca) - parseFloat(a.taxaPresenca)) // Ordena por melhor taxa de presença
}

/**
 * Calcula análise de canais de comunicação
 * @param {Array} data - Array de agendamentos
 * @returns {Array} - Array com análise por canal
 */
export function calculateAnalyticsByCanal(data) {
  const canalMap = {}

  data.forEach(item => {
    const canal = item.canal_aviso || 'Sem Canal'

    if (!canalMap[canal]) {
      canalMap[canal] = {
        canal,
        enviados: 0,
        confirmados: 0,
        presencas: 0,
        faltas: 0,
        cancelados: 0
      }
    }

    const c = canalMap[canal]
    if (item.avisado) c.enviados++
    if (item.status === 'Confirmado' || item.confirmado) c.confirmados++
    if (item.status === 'Presente' || item.status === 'Compareceu') c.presencas++
    if (item.status === 'Faltou' || item.status === 'No-show') c.faltas++
    if (item.status === 'Cancelado') c.cancelados++
  })

  return Object.values(canalMap).map(canal => ({
    ...canal,
    taxaResposta: canal.enviados > 0 ? ((canal.confirmados / canal.enviados) * 100).toFixed(2) : 0,
    taxaEfetividade: canal.enviados > 0 ? ((canal.presencas / canal.enviados) * 100).toFixed(2) : 0,
    taxaNoShow: canal.enviados > 0 ? ((canal.faltas / canal.enviados) * 100).toFixed(2) : 0
  })).sort((a, b) => parseFloat(b.taxaEfetividade) - parseFloat(a.taxaEfetividade))
}

/**
 * Calcula ROI e economia gerada
 * @param {Object} totais - Totais consolidados
 * @param {Object} kpis - KPIs calculados
 * @returns {Object} - ROI calculado
 */
export function calculateROI(totais, kpis) {
  // Valores médios estimados (podem ser configurados)
  const CUSTO_CONSULTA_MEDIA = 150 // R$ por consulta
  const CUSTO_NOTIFICACAO_WHATSAPP = 0.10 // R$ por mensagem
  const CUSTO_NOTIFICACAO_SMS = 0.25 // R$ por SMS
  const CUSTO_NOTIFICACAO_LIGACAO = 1.50 // R$ por ligação

  // Cálculo simplificado (idealmente seria baseado em dados reais)
  const consultasRecuperadas = Math.floor(totais.presencas * 0.15) // Estima 15% de recuperação
  const economiaGerada = consultasRecuperadas * CUSTO_CONSULTA_MEDIA

  // Custo estimado do sistema (mensagens + plataforma)
  const custoNotificacoes = (totais.agendados * CUSTO_NOTIFICACAO_WHATSAPP) // Simplificado
  const custoPlataforma = 500 // R$ por mês (estimado)
  const custoTotal = custoNotificacoes + custoPlataforma

  const roi = economiaGerada > 0 ? (((economiaGerada - custoTotal) / custoTotal) * 100).toFixed(2) : 0

  return {
    consultasRecuperadas,
    economiaGerada: economiaGerada.toFixed(2),
    custoTotal: custoTotal.toFixed(2),
    roi,
    economiaLiquida: (economiaGerada - custoTotal).toFixed(2)
  }
}

/**
 * Análise temporal - identifica tendências
 * @param {Array} dadosAgregados - Dados agregados por dia
 * @returns {Object} - Análise de tendências
 */
export function analyzeTrends(dadosAgregados) {
  if (!dadosAgregados || dadosAgregados.length < 2) {
    return {
      tendenciaAgendados: 'estável',
      tendenciaConfirmacao: 'estável',
      tendenciaFaltas: 'estável',
      variacaoAgendados: 0,
      variacaoConfirmacao: 0,
      variacaoFaltas: 0
    }
  }

  const primeiro = dadosAgregados[0]
  const ultimo = dadosAgregados[dadosAgregados.length - 1]

  const variacaoAgendados = primeiro.agendados > 0
    ? ((ultimo.agendados - primeiro.agendados) / primeiro.agendados) * 100
    : 0

  const taxaConfirmacaoPrimeiro = primeiro.agendados > 0
    ? (primeiro.confirmados / primeiro.agendados) * 100
    : 0

  const taxaConfirmacaoUltimo = ultimo.agendados > 0
    ? (ultimo.confirmados / ultimo.agendados) * 100
    : 0

  const variacaoConfirmacao = taxaConfirmacaoPrimeiro > 0
    ? ((taxaConfirmacaoUltimo - taxaConfirmacaoPrimeiro) / taxaConfirmacaoPrimeiro) * 100
    : 0

  const taxaFaltasPrimeiro = primeiro.agendados > 0
    ? (primeiro.faltas / primeiro.agendados) * 100
    : 0

  const taxaFaltasUltimo = ultimo.agendados > 0
    ? (ultimo.faltas / ultimo.agendados) * 100
    : 0

  const variacaoFaltas = taxaFaltasPrimeiro > 0
    ? ((taxaFaltasUltimo - taxaFaltasPrimeiro) / taxaFaltasPrimeiro) * 100
    : 0

  return {
    tendenciaAgendados: variacaoAgendados > 5 ? 'crescente' : variacaoAgendados < -5 ? 'decrescente' : 'estável',
    tendenciaConfirmacao: variacaoConfirmacao > 5 ? 'melhorando' : variacaoConfirmacao < -5 ? 'piorando' : 'estável',
    tendenciaFaltas: variacaoFaltas > 5 ? 'aumentando' : variacaoFaltas < -5 ? 'diminuindo' : 'estável',
    variacaoAgendados: variacaoAgendados.toFixed(2),
    variacaoConfirmacao: variacaoConfirmacao.toFixed(2),
    variacaoFaltas: variacaoFaltas.toFixed(2)
  }
}

/**
 * Análise de horários críticos
 * @param {Array} data - Array de agendamentos
 * @returns {Array} - Análise por horário
 */
export function analyzeByTime(data) {
  const timeMap = {}

  data.forEach(item => {
    const hora = item.hora ? item.hora.substring(0, 2) : '00' // Extrai apenas a hora (HH)

    if (!timeMap[hora]) {
      timeMap[hora] = {
        hora: `${hora}:00`,
        agendados: 0,
        faltas: 0,
        presencas: 0
      }
    }

    timeMap[hora].agendados++
    if (item.status === 'Faltou' || item.status === 'No-show') timeMap[hora].faltas++
    if (item.status === 'Presente' || item.status === 'Compareceu') timeMap[hora].presencas++
  })

  return Object.values(timeMap)
    .map(t => ({
      ...t,
      taxaNoShow: t.agendados > 0 ? ((t.faltas / t.agendados) * 100).toFixed(2) : 0
    }))
    .sort((a, b) => a.hora.localeCompare(b.hora))
}
