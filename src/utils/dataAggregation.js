/**
 * Funções puras para agregação de dados de agendamentos
 */

/**
 * Mapeia status para categoria
 * @param {string} status - Status do agendamento
 * @param {boolean} confirmado - Campo confirmado (opcional)
 * @param {boolean} avisado - Campo avisado (opcional)
 * @returns {string|null} - Categoria ou null
 */
export function mapStatusToCategory(status, confirmado = false, avisado = false) {
  const statusUpper = status?.toUpperCase() || ''
  
  // Cancelado tem prioridade - pessoa cancelou quando recebeu o aviso
  if (statusUpper === 'CANCELADO') {
    return 'cancelado'
  }
  
  // Presenças (compareceu realmente)
  if (statusUpper === 'PRESENTE' || statusUpper === 'COMPARECEU') {
    return 'presenca'
  }
  
  // Faltas (faltou no dia)
  if (statusUpper === 'FALTOU' || statusUpper === 'NO-SHOW') {
    return 'falta'
  }
  
  // Confirmado (recebeu aviso E confirmou presença)
  // Só conta como confirmado se recebeu aviso E confirmou
  if ((statusUpper === 'CONFIRMADO' || confirmado === true) && avisado === true) {
    return 'confirmado'
  }
  
  return null
}

/**
 * Agrupa dados por dia e calcula indicadores
 * @param {Array} data - Array de agendamentos
 * @param {Array<string>} weekDays - Array de datas da semana (YYYY-MM-DD)
 * @returns {Array} - Array com dados agrupados por dia
 */
export function aggregateByDay(data, weekDays) {
  // Inicializa objeto com todos os dias da semana
  const dailyData = {}
  weekDays.forEach(day => {
    dailyData[day] = {
      data: day,
      agendados: 0,
      confirmados: 0,
      presencas: 0,
      faltas: 0,
      cancelados: 0
    }
  })
  
  // Processa cada registro
  data.forEach(item => {
    const date = item.data
    if (!dailyData[date]) return
    
    // Agendados: total do dia (total de pessoas agendadas pelas UBS)
    dailyData[date].agendados++
    
    // Categoriza o status
    const category = mapStatusToCategory(item.status, item.confirmado, item.avisado)
    
    // Conta cada categoria (mutuamente exclusivas)
    if (category === 'cancelado') {
      // Cancelados: pessoas que receberam aviso e cancelaram
      dailyData[date].cancelados++
    } else if (category === 'presenca') {
      // Presenças: realmente compareceram
      dailyData[date].presencas++
      // Presença também conta como confirmado (quem compareceu recebeu aviso e confirmou)
      if (item.avisado) {
        dailyData[date].confirmados++
      }
    } else if (category === 'falta') {
      // Faltas: faltaram no dia
      dailyData[date].faltas++
      // Falta também conta como confirmado (quem faltou recebeu aviso e confirmou, mas não compareceu)
      if (item.avisado) {
        dailyData[date].confirmados++
      }
    } else if (category === 'confirmado') {
      // Confirmados: receberam aviso E confirmaram presença (mas ainda não sabemos se compareceu)
      dailyData[date].confirmados++
    }
  })
  
  // Ajusta presenças: se não há presenças explícitas suficientes, calcula
  // Presenças = Agendados - Cancelados - Faltas (os que não cancelaram e não faltaram)
  weekDays.forEach(day => {
    const dayData = dailyData[day]
    if (dayData.agendados > 0) {
      const presencasExplicitas = dayData.presencas
      const faltasExplicitas = dayData.faltas
      const canceladosExplicitos = dayData.cancelados
      
      // Se a soma de presenças + faltas + cancelados não bate com agendados,
      // calcula presenças implicitamente: presenças = agendados - cancelados - faltas
      // (assumindo que os restantes compareceram)
      const totalComResultado = presencasExplicitas + faltasExplicitas + canceladosExplicitos
      if (totalComResultado < dayData.agendados) {
        // Presenças = agendados - cancelados - faltas (os que não cancelaram e não faltaram)
        dayData.presencas = dayData.agendados - canceladosExplicitos - faltasExplicitas
      }
      
      // Confirmados já foi contado acima baseado em avisado=true e confirmado/status
      // Não precisamos ajustar aqui, pois a contagem já está correta
    }
  })
  
  // Converte para array e ordena por data
  // Garante que todos os dias têm dados válidos (nunca undefined)
  return weekDays.map(day => {
    const dayData = dailyData[day]
    if (!dayData) {
      // Fallback: se por algum motivo o dia não foi inicializado, cria um objeto vazio
      return {
        data: day,
        agendados: 0,
        confirmados: 0,
        presencas: 0,
        faltas: 0,
        cancelados: 0
      }
    }
    return dayData
  })
}

/**
 * Calcula totais da semana
 * @param {Array} dailyData - Array de dados diários
 * @returns {Object} - Objeto com totais
 */
export function calculateWeekTotals(dailyData) {
  // Valida se dailyData é um array válido
  if (!Array.isArray(dailyData) || dailyData.length === 0) {
    return {
      agendados: 0,
      confirmados: 0,
      presencas: 0,
      faltas: 0,
      cancelados: 0
    }
  }

  return dailyData.reduce((totals, day) => {
    // Valida se day existe e tem as propriedades necessárias
    if (!day) return totals

    totals.agendados += day.agendados || 0
    totals.confirmados += day.confirmados || 0
    totals.presencas += day.presencas || 0
    totals.faltas += day.faltas || 0
    totals.cancelados += day.cancelados || 0
    return totals
  }, {
    agendados: 0,
    confirmados: 0,
    presencas: 0,
    faltas: 0,
    cancelados: 0
  })
}

/**
 * Filtra dados baseado nos filtros aplicados
 * @param {Array} data - Array de agendamentos
 * @param {Object} filters - Objeto com filtros
 * @returns {Array} - Array filtrado
 */
export function filterData(data, filters) {
  return data.filter(item => {
    if (filters.regiao && item.regiao !== filters.regiao) return false
    if (filters.ubs && item.ubs !== filters.ubs) return false
    if (filters.tipo && item.tipo !== filters.tipo) return false
    if (filters.data && item.data !== filters.data) return false
    if (filters.canal_aviso && item.canal_aviso !== filters.canal_aviso) return false
    if (filters.status && item.status !== filters.status) return false
    if (filters.busca) {
      const buscaLower = filters.busca.toLowerCase()
      if (!item.paciente?.toLowerCase().includes(buscaLower)) return false
    }
    return true
  })
}

