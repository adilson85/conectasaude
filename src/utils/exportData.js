/**
 * Utilitários para exportação de dados
 */

/**
 * Converte array de objetos para CSV
 * @param {Array} data - Array de objetos
 * @param {Array} columns - Array de colunas {key, label}
 * @returns {string} - String CSV
 */
export function convertToCSV(data, columns) {
  if (!data || data.length === 0) return ''

  // Cabeçalho
  const header = columns.map(col => col.label).join(';')

  // Linhas de dados
  const rows = data.map(item => {
    return columns.map(col => {
      const value = item[col.key]
      // Escapar aspas e adicionar aspas se contiver vírgula ou ponto-e-vírgula
      if (value === null || value === undefined) return ''
      const stringValue = String(value)
      if (stringValue.includes(';') || stringValue.includes(',') || stringValue.includes('"')) {
        return `"${stringValue.replace(/"/g, '""')}"`
      }
      return stringValue
    }).join(';')
  })

  return [header, ...rows].join('\n')
}

/**
 * Baixa arquivo CSV
 * @param {string} csvContent - Conteúdo CSV
 * @param {string} filename - Nome do arquivo
 */
export function downloadCSV(csvContent, filename) {
  // Adiciona BOM para UTF-8 (para Excel abrir corretamente caracteres especiais)
  const BOM = '\uFEFF'
  const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')

  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', filename)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }
}

/**
 * Exporta agendamentos para CSV
 * @param {Array} data - Array de agendamentos
 * @param {string} filename - Nome do arquivo (opcional)
 */
export function exportAgendamentosCSV(data, filename = 'agendamentos.csv') {
  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'data', label: 'Data' },
    { key: 'hora', label: 'Hora' },
    { key: 'regiao', label: 'Região' },
    { key: 'ubs', label: 'UBS' },
    { key: 'tipo', label: 'Tipo' },
    { key: 'paciente', label: 'Paciente' },
    { key: 'contato', label: 'Contato' },
    { key: 'canal_aviso', label: 'Canal de Aviso' },
    { key: 'status', label: 'Status' },
    { key: 'avisado', label: 'Avisado' },
    { key: 'confirmado', label: 'Confirmado' }
  ]

  const csvContent = convertToCSV(data, columns)
  downloadCSV(csvContent, filename)
}

/**
 * Exporta relatório consolidado para CSV
 * @param {Object} totais - Objeto com totais
 * @param {Object} kpis - Objeto com KPIs
 * @param {string} periodo - Descrição do período
 * @param {string} filename - Nome do arquivo (opcional)
 */
export function exportRelatorioConsolidadoCSV(totais, kpis, periodo, filename = 'relatorio_consolidado.csv') {
  const data = [
    { indicador: 'Período', valor: periodo },
    { indicador: '', valor: '' },
    { indicador: 'TOTAIS', valor: '' },
    { indicador: 'Agendados', valor: totais.agendados },
    { indicador: 'Confirmados', valor: totais.confirmados },
    { indicador: 'Presenças', valor: totais.presencas },
    { indicador: 'Faltas', valor: totais.faltas },
    { indicador: 'Cancelados', valor: totais.cancelados },
    { indicador: '', valor: '' },
    { indicador: 'KPIs', valor: '' },
    { indicador: 'Taxa de Confirmação', valor: `${kpis.confirmationRate.toFixed(2)}%` },
    { indicador: 'Taxa de Presença', valor: `${kpis.attendanceRate.toFixed(2)}%` },
    { indicador: 'Taxa de No-Show', valor: `${kpis.noShowRate.toFixed(2)}%` }
  ]

  const columns = [
    { key: 'indicador', label: 'Indicador' },
    { key: 'valor', label: 'Valor' }
  ]

  const csvContent = convertToCSV(data, columns)
  downloadCSV(csvContent, filename)
}

/**
 * Exporta dados agregados por dia para CSV
 * @param {Array} dadosAgregados - Array de dados diários
 * @param {string} filename - Nome do arquivo (opcional)
 */
export function exportDadosDiariosCSV(dadosAgregados, filename = 'dados_diarios.csv') {
  const columns = [
    { key: 'data', label: 'Data' },
    { key: 'agendados', label: 'Agendados' },
    { key: 'confirmados', label: 'Confirmados' },
    { key: 'presencas', label: 'Presenças' },
    { key: 'faltas', label: 'Faltas' },
    { key: 'cancelados', label: 'Cancelados' }
  ]

  const csvContent = convertToCSV(dadosAgregados, columns)
  downloadCSV(csvContent, filename)
}

/**
 * Exporta análise por UBS para CSV
 * @param {Array} dadosPorUBS - Array de dados por UBS
 * @param {string} filename - Nome do arquivo (opcional)
 */
export function exportAnaliseUBSCSV(dadosPorUBS, filename = 'analise_por_ubs.csv') {
  const columns = [
    { key: 'ubs', label: 'UBS' },
    { key: 'regiao', label: 'Região' },
    { key: 'agendados', label: 'Agendados' },
    { key: 'confirmados', label: 'Confirmados' },
    { key: 'presencas', label: 'Presenças' },
    { key: 'faltas', label: 'Faltas' },
    { key: 'taxaNoShow', label: 'Taxa No-Show (%)' },
    { key: 'taxaConfirmacao', label: 'Taxa Confirmação (%)' }
  ]

  const csvContent = convertToCSV(dadosPorUBS, columns)
  downloadCSV(csvContent, filename)
}

/**
 * Exporta análise de canais para CSV
 * @param {Array} dadosPorCanal - Array de dados por canal
 * @param {string} filename - Nome do arquivo (opcional)
 */
export function exportAnaliseCanaisCSV(dadosPorCanal, filename = 'analise_canais.csv') {
  const columns = [
    { key: 'canal', label: 'Canal' },
    { key: 'enviados', label: 'Enviados' },
    { key: 'confirmados', label: 'Confirmados' },
    { key: 'presencas', label: 'Presenças' },
    { key: 'faltas', label: 'Faltas' },
    { key: 'taxaResposta', label: 'Taxa Resposta (%)' },
    { key: 'taxaEfetividade', label: 'Taxa Efetividade (%)' },
    { key: 'taxaNoShow', label: 'Taxa No-Show (%)' }
  ]

  const csvContent = convertToCSV(dadosPorCanal, columns)
  downloadCSV(csvContent, filename)
}

/**
 * Exporta relatório executivo completo para CSV
 * @param {Object} relatorio - Objeto com todos os dados do relatório
 * @param {string} filename - Nome do arquivo (opcional)
 */
export function exportRelatorioExecutivoCSV(relatorio, filename = 'relatorio_executivo.csv') {
  const data = [
    { secao: 'RELATÓRIO EXECUTIVO', valor: '' },
    { secao: 'Período', valor: relatorio.periodo },
    { secao: 'Data de Geração', valor: new Date().toLocaleString('pt-BR') },
    { secao: '', valor: '' },
    { secao: 'INDICADORES GERAIS', valor: '' },
    { secao: 'Agendamentos Totais', valor: relatorio.totais.agendados },
    { secao: 'Taxa de Confirmação', valor: `${relatorio.kpis.confirmationRate.toFixed(2)}%` },
    { secao: 'Taxa de Presença', valor: `${relatorio.kpis.attendanceRate.toFixed(2)}%` },
    { secao: 'Taxa de No-Show', valor: `${relatorio.kpis.noShowRate.toFixed(2)}%` },
    { secao: '', valor: '' },
    { secao: 'ROI E ECONOMIA', valor: '' },
    { secao: 'Consultas Recuperadas', valor: relatorio.roi.consultasRecuperadas },
    { secao: 'Economia Gerada (R$)', valor: relatorio.roi.economiaGerada },
    { secao: 'Custo Total (R$)', valor: relatorio.roi.custoTotal },
    { secao: 'ROI (%)', valor: `${relatorio.roi.roi}%` },
    { secao: 'Economia Líquida (R$)', valor: relatorio.roi.economiaLiquida },
    { secao: '', valor: '' },
    { secao: 'TOP 5 UBS - MELHOR DESEMPENHO', valor: '' }
  ]

  // Adiciona top 5 UBS
  if (relatorio.analysisByUBS && relatorio.analysisByUBS.length > 0) {
    relatorio.analysisByUBS.slice(0, 5).forEach((ubs, index) => {
      data.push({
        secao: `${index + 1}. ${ubs.ubs}`,
        valor: `Taxa Presença: ${ubs.taxaPresenca}% | No-Show: ${ubs.taxaNoShow}%`
      })
    })
  }

  data.push({ secao: '', valor: '' })
  data.push({ secao: 'ANÁLISE DE CANAIS', valor: '' })

  // Adiciona análise de canais
  if (relatorio.analysisByCanal && relatorio.analysisByCanal.length > 0) {
    relatorio.analysisByCanal.forEach(canal => {
      data.push({
        secao: canal.canal,
        valor: `Efetividade: ${canal.taxaEfetividade}% | Resposta: ${canal.taxaResposta}%`
      })
    })
  }

  const columns = [
    { key: 'secao', label: 'Seção' },
    { key: 'valor', label: 'Valor' }
  ]

  const csvContent = convertToCSV(data, columns)
  downloadCSV(csvContent, filename)
}
