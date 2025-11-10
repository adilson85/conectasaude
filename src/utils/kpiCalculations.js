/**
 * Utilitário para cálculos de KPIs do Conecta Saúde
 * Calcula métricas, percentuais e tendências
 */

/**
 * Calcula taxa de no-show (faltas / total de atendimentos passados)
 */
export function calculateNoShowRate(data) {
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);

  const passados = data.filter(item => {
    const dataAgendamento = new Date(item.data);
    return dataAgendamento < hoje;
  });

  if (passados.length === 0) return 0;

  const faltas = passados.filter(
    item => item.status === 'Faltou' || item.status === 'No-show'
  ).length;

  const atendimentos = passados.filter(
    item =>
      item.status === 'Presente' ||
      item.status === 'Compareceu' ||
      item.status === 'Faltou' ||
      item.status === 'No-show'
  ).length;

  if (atendimentos === 0) return 0;

  return (faltas / atendimentos) * 100;
}

/**
 * Calcula taxa de confirmação (confirmados / total de agendados)
 * Confirmados = pessoas que receberam aviso E confirmaram presença
 */
export function calculateConfirmationRate(data) {
  if (data.length === 0) return 0;

  // Confirmados = receberam aviso E confirmaram (confirmado = true OU status = "Confirmado")
  // Exclui cancelados (eles cancelaram quando receberam o aviso)
  const confirmados = data.filter(
    item => item.status !== 'Cancelado' &&
            item.avisado === true &&
            (item.confirmado === true || item.status === 'Confirmado' || 
             item.status === 'Presente' || item.status === 'Compareceu' ||
             item.status === 'Faltou' || item.status === 'No-show')
  ).length;

  return (confirmados / data.length) * 100;
}

/**
 * Calcula taxa de presença (presenças / total de atendimentos passados)
 */
export function calculateAttendanceRate(data) {
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);

  const passados = data.filter(item => {
    const dataAgendamento = new Date(item.data);
    return dataAgendamento < hoje;
  });

  if (passados.length === 0) return 0;

  const presentes = passados.filter(
    item => item.status === 'Presente' || item.status === 'Compareceu'
  ).length;

  const atendimentos = passados.filter(
    item =>
      item.status === 'Presente' ||
      item.status === 'Compareceu' ||
      item.status === 'Faltou' ||
      item.status === 'No-show'
  ).length;

  if (atendimentos === 0) return 0;

  return (presentes / atendimentos) * 100;
}

/**
 * Calcula taxa de reaproveitamento de vagas canceladas
 * (cancelados que foram substituídos / total cancelados)
 */
export function calculateReallocationRate(data) {
  const cancelados = data.filter(item => item.status === 'Cancelado');

  if (cancelados.length === 0) return 0;

  // Contar quantos agendamentos vieram da fila de espera (substituíram um cancelado)
  const reaproveitados = data.filter(
    item => item.origem === 'Fila de espera' && item.substituiu_agendamento_id
  ).length;

  return (reaproveitados / cancelados.length) * 100;
}

/**
 * Calcula tendência comparando período atual com período anterior
 * Retorna { value: número, trend: 'up'|'down'|'stable', percentage: número }
 */
export function calculateTrend(currentValue, previousValue) {
  if (previousValue === 0) {
    return {
      value: currentValue,
      trend: currentValue > 0 ? 'up' : 'stable',
      percentage: 0
    };
  }

  const diff = currentValue - previousValue;
  const percentChange = (diff / previousValue) * 100;

  let trend = 'stable';
  if (Math.abs(percentChange) >= 5) {
    // Mudança significativa >= 5%
    trend = diff > 0 ? 'up' : 'down';
  }

  return {
    value: currentValue,
    trend,
    percentage: Math.abs(percentChange)
  };
}

/**
 * Agrupa dados por critério (região, UBS, tipo, canal)
 */
export function groupBy(data, field) {
  return data.reduce((acc, item) => {
    const key = item[field] || 'Não informado';
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(item);
    return acc;
  }, {});
}

/**
 * Calcula no-show por UBS
 */
export function calculateNoShowByUBS(data) {
  const porUBS = groupBy(data, 'ubs');
  const resultado = {};

  Object.keys(porUBS).forEach(ubs => {
    const dadosUBS = porUBS[ubs];
    resultado[ubs] = {
      total: dadosUBS.length,
      noShowRate: calculateNoShowRate(dadosUBS),
      faltas: dadosUBS.filter(
        item => item.status === 'Faltou' || item.status === 'No-show'
      ).length,
      presencas: dadosUBS.filter(
        item => item.status === 'Presente' || item.status === 'Compareceu'
      ).length
    };
  });

  // Ordenar por taxa de no-show (maior para menor)
  return Object.entries(resultado)
    .map(([ubs, stats]) => ({ ubs, ...stats }))
    .sort((a, b) => b.noShowRate - a.noShowRate);
}

/**
 * Calcula no-show por tipo de agendamento
 */
export function calculateNoShowByTipo(data) {
  const porTipo = groupBy(data, 'tipo');
  const resultado = {};

  Object.keys(porTipo).forEach(tipo => {
    const dadosTipo = porTipo[tipo];
    resultado[tipo] = {
      total: dadosTipo.length,
      noShowRate: calculateNoShowRate(dadosTipo),
      faltas: dadosTipo.filter(
        item => item.status === 'Faltou' || item.status === 'No-show'
      ).length,
      presencas: dadosTipo.filter(
        item => item.status === 'Presente' || item.status === 'Compareceu'
      ).length
    };
  });

  return Object.entries(resultado)
    .map(([tipo, stats]) => ({ tipo, ...stats }))
    .sort((a, b) => b.noShowRate - a.noShowRate);
}

/**
 * Calcula taxa de confirmação por canal
 */
export function calculateConfirmationByCanal(data) {
  const porCanal = groupBy(data, 'canal_aviso');
  const resultado = {};

  Object.keys(porCanal).forEach(canal => {
    const dadosCanal = porCanal[canal];
    resultado[canal] = {
      total: dadosCanal.length,
      confirmados: dadosCanal.filter(
        item => item.confirmado === true || item.status === 'Confirmado'
      ).length,
      confirmationRate: calculateConfirmationRate(dadosCanal),
      avisados: dadosCanal.filter(item => item.avisado === true).length
    };
  });

  return Object.entries(resultado)
    .map(([canal, stats]) => ({ canal, ...stats }))
    .sort((a, b) => b.confirmationRate - a.confirmationRate);
}

/**
 * Calcula distribuição geográfica (agendamentos por região)
 */
export function calculateGeographicDistribution(data) {
  const porRegiao = groupBy(data, 'regiao');
  const resultado = {};

  Object.keys(porRegiao).forEach(regiao => {
    const dadosRegiao = porRegiao[regiao];
    resultado[regiao] = {
      total: dadosRegiao.length,
      confirmados: dadosRegiao.filter(item => item.confirmado).length,
      presencas: dadosRegiao.filter(
        item => item.status === 'Presente' || item.status === 'Compareceu'
      ).length,
      faltas: dadosRegiao.filter(
        item => item.status === 'Faltou' || item.status === 'No-show'
      ).length,
      noShowRate: calculateNoShowRate(dadosRegiao)
    };
  });

  return Object.entries(resultado)
    .map(([regiao, stats]) => ({ regiao, ...stats }))
    .sort((a, b) => b.total - a.total);
}

/**
 * Filtra dados por período de dias
 */
export function filterByDays(data, days) {
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);

  const dataInicio = new Date(hoje);
  dataInicio.setDate(dataInicio.getDate() - days);

  return data.filter(item => {
    const dataAgendamento = new Date(item.data);
    return dataAgendamento >= dataInicio && dataAgendamento <= hoje;
  });
}

/**
 * Filtra dados para "hoje"
 */
export function filterToday(data) {
  const hoje = new Date().toISOString().split('T')[0];
  return data.filter(item => item.data === hoje);
}

/**
 * Filtra dados para próximos N dias
 */
export function filterNextDays(data, days) {
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);

  const dataFim = new Date(hoje);
  dataFim.setDate(dataFim.getDate() + days);

  return data.filter(item => {
    const dataAgendamento = new Date(item.data);
    return dataAgendamento >= hoje && dataAgendamento <= dataFim;
  });
}

/**
 * Calcula dados para gráfico de linha (progressão diária)
 */
export function calculateDailyProgression(data, days = 7) {
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);

  const resultado = [];

  for (let i = days - 1; i >= 0; i--) {
    const data = new Date(hoje);
    data.setDate(data.getDate() - i);
    const dataStr = data.toISOString().split('T')[0];

    const dadosDia = data.filter(item => item.data === dataStr);

    resultado.push({
      data: dataStr,
      dataFormatada: `${data.getDate()}/${data.getMonth() + 1}`,
      agendados: dadosDia.length,
      confirmados: dadosDia.filter(item => item.confirmado).length,
      presentes: dadosDia.filter(
        item => item.status === 'Presente' || item.status === 'Compareceu'
      ).length,
      faltas: dadosDia.filter(
        item => item.status === 'Faltou' || item.status === 'No-show'
      ).length,
      cancelados: dadosDia.filter(item => item.status === 'Cancelado').length
    });
  }

  return resultado;
}

/**
 * Calcula progresso em direção às metas do MVP
 * Meta 1: Reduzir faltas em 20% (baseline vs atual)
 * Meta 2: Taxa de confirmação ≥70%
 * Meta 3: Reaproveitamento ≥50%
 */
export function calculateGoalsProgress(currentData, baselineData = null) {
  // Se não houver baseline, usar os dados mais antigos como referência
  let baselineNoShowRate = 30; // Taxa padrão brasileira estimada

  if (baselineData) {
    baselineNoShowRate = calculateNoShowRate(baselineData);
  }

  const currentNoShowRate = calculateNoShowRate(currentData);
  const reducaoNoShow = ((baselineNoShowRate - currentNoShowRate) / baselineNoShowRate) * 100;

  const taxaConfirmacao = calculateConfirmationRate(currentData);
  const taxaReaproveitamento = calculateReallocationRate(currentData);

  return {
    meta1: {
      nome: 'Redução de Faltas',
      meta: 20, // 20% de redução
      atual: Math.max(0, reducaoNoShow),
      atingida: reducaoNoShow >= 20,
      baseline: baselineNoShowRate,
      current: currentNoShowRate
    },
    meta2: {
      nome: 'Taxa de Confirmação',
      meta: 70, // 70%
      atual: taxaConfirmacao,
      atingida: taxaConfirmacao >= 70
    },
    meta3: {
      nome: 'Reaproveitamento de Vagas',
      meta: 50, // 50%
      atual: taxaReaproveitamento,
      atingida: taxaReaproveitamento >= 50
    }
  };
}
