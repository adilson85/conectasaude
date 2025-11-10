import { useState, useMemo } from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  Legend,
  Cell,
  PieChart,
  Pie
} from 'recharts'
import mockQueues from '../data/mockQueues.json'
import KPICard from '../components/KPICard'
import {
  calculateQueueTotals,
  categorizeCriticalQueues,
  analyzeQueuesByRegion,
  analyzeQueuesByUBS,
  analyzeQueuesByType,
  identifyReofferOpportunities,
  generateAlerts,
  filterQueues
} from '../utils/queueAnalytics'

function Filas() {
  const [filtros, setFiltros] = useState({
    regiao: '',
    ubs: '',
    tipo: '',
    especialidade: '',
    status: '',
    prioridade: ''
  })

  // Filtra filas
  const filasFiltradas = useMemo(() => {
    return filterQueues(mockQueues, filtros)
  }, [filtros])

  // Calcula totais
  const totais = useMemo(() => {
    return calculateQueueTotals(filasFiltradas)
  }, [filasFiltradas])

  // Categoriza filas por criticidade
  const filasPorCriticidade = useMemo(() => {
    return categorizeCriticalQueues(filasFiltradas)
  }, [filasFiltradas])

  // Análises
  const analysisByRegion = useMemo(() => {
    return analyzeQueuesByRegion(filasFiltradas)
  }, [filasFiltradas])

  const analysisByUBS = useMemo(() => {
    return analyzeQueuesByUBS(filasFiltradas)
  }, [filasFiltradas])

  const analysisByType = useMemo(() => {
    return analyzeQueuesByType(filasFiltradas)
  }, [filasFiltradas])

  // Oportunidades de reoferta
  const oportunidades = useMemo(() => {
    return identifyReofferOpportunities(filasFiltradas)
  }, [filasFiltradas])

  // Alertas
  const alertas = useMemo(() => {
    return generateAlerts(filasFiltradas, totais)
  }, [filasFiltradas, totais])

  // Opções para filtros
  const opcoes = useMemo(() => {
    const regioes = [...new Set(mockQueues.map(f => f.regiao))].sort()
    const ubsList = [...new Set(mockQueues.map(f => f.ubs))].sort()
    const tipos = [...new Set(mockQueues.map(f => f.tipo))].sort()
    const especialidades = [...new Set(mockQueues.map(f => f.especialidade))].sort()
    const statusList = [...new Set(mockQueues.map(f => f.status))].sort()
    const prioridades = [...new Set(mockQueues.map(f => f.prioridade))].sort()

    return { regioes, ubsList, tipos, especialidades, statusList, prioridades }
  }, [])

  const resetarFiltros = () => {
    setFiltros({
      regiao: '',
      ubs: '',
      tipo: '',
      especialidade: '',
      status: '',
      prioridade: ''
    })
  }

  // Cores
  const cores = {
    criticas: '#dc2626',
    alerta: '#f59e0b',
    atencao: '#3b82f6',
    normais: '#10b981'
  }

  // Dados para gráfico de distribuição por criticidade
  const dadosCriticidade = [
    {
      name: 'Críticas (>90d)',
      value: filasPorCriticidade.criticas.length,
      pacientes: filasPorCriticidade.criticas.reduce((sum, f) => sum + f.pacientesNaFila, 0)
    },
    {
      name: 'Alerta (60-90d)',
      value: filasPorCriticidade.alerta.length,
      pacientes: filasPorCriticidade.alerta.reduce((sum, f) => sum + f.pacientesNaFila, 0)
    },
    {
      name: 'Atenção (30-60d)',
      value: filasPorCriticidade.atencao.length,
      pacientes: filasPorCriticidade.atencao.reduce((sum, f) => sum + f.pacientesNaFila, 0)
    },
    {
      name: 'Normal (<30d)',
      value: filasPorCriticidade.normais.length,
      pacientes: filasPorCriticidade.normais.reduce((sum, f) => sum + f.pacientesNaFila, 0)
    }
  ].filter(item => item.value > 0)

  const COLORS = ['#dc2626', '#f59e0b', '#3b82f6', '#10b981']

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <h2 className="text-2xl font-bold text-gray-900">Dashboard de Filas</h2>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Filtros</h3>
          <button
            onClick={resetarFiltros}
            className="px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition"
          >
            Resetar
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Região</label>
            <select
              value={filtros.regiao}
              onChange={(e) => setFiltros({ ...filtros, regiao: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Todas</option>
              {opcoes.regioes.map(regiao => (
                <option key={regiao} value={regiao}>{regiao}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">UBS</label>
            <select
              value={filtros.ubs}
              onChange={(e) => setFiltros({ ...filtros, ubs: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Todas</option>
              {opcoes.ubsList.map(ubs => (
                <option key={ubs} value={ubs}>{ubs}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
            <select
              value={filtros.tipo}
              onChange={(e) => setFiltros({ ...filtros, tipo: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Todos</option>
              {opcoes.tipos.map(tipo => (
                <option key={tipo} value={tipo}>{tipo}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Especialidade</label>
            <select
              value={filtros.especialidade}
              onChange={(e) => setFiltros({ ...filtros, especialidade: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Todas</option>
              {opcoes.especialidades.map(esp => (
                <option key={esp} value={esp}>{esp}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              value={filtros.status}
              onChange={(e) => setFiltros({ ...filtros, status: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Todos</option>
              {opcoes.statusList.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Prioridade</label>
            <select
              value={filtros.prioridade}
              onChange={(e) => setFiltros({ ...filtros, prioridade: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Todas</option>
              {opcoes.prioridades.map(prioridade => (
                <option key={prioridade} value={prioridade}>{prioridade}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Alertas Críticos */}
      {alertas.length > 0 && (
        <div className="space-y-3">
          {alertas.map((alerta, index) => (
            <div
              key={index}
              className={`rounded-lg p-4 ${
                alerta.tipo === 'critico'
                  ? 'bg-red-50 border-2 border-red-200'
                  : alerta.tipo === 'oportunidade'
                  ? 'bg-green-50 border-2 border-green-200'
                  : 'bg-yellow-50 border-2 border-yellow-200'
              }`}
            >
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  {alerta.tipo === 'critico' ? (
                    <svg className="h-6 w-6 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  ) : alerta.tipo === 'oportunidade' ? (
                    <svg className="h-6 w-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg className="h-6 w-6 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
                <div className="ml-3 flex-1">
                  <h3
                    className={`text-sm font-bold ${
                      alerta.tipo === 'critico'
                        ? 'text-red-900'
                        : alerta.tipo === 'oportunidade'
                        ? 'text-green-900'
                        : 'text-yellow-900'
                    }`}
                  >
                    {alerta.titulo}
                  </h3>
                  <div
                    className={`mt-2 text-sm ${
                      alerta.tipo === 'critico'
                        ? 'text-red-700'
                        : alerta.tipo === 'oportunidade'
                        ? 'text-green-700'
                        : 'text-yellow-700'
                    }`}
                  >
                    <p>{alerta.mensagem}</p>
                    <p className="mt-2 font-semibold">
                      Ação recomendada: {alerta.acao}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Cards de KPI */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-4">
        <KPICard
          titulo="Total em Filas"
          valor={totais.totalPacientes.toLocaleString('pt-BR')}
          cor="blue"
          subtitulo="Pacientes aguardando"
        />
        <KPICard
          titulo="Vagas Disponíveis"
          valor={totais.totalVagas}
          cor="green"
          subtitulo="Para reoferta"
        />
        <KPICard
          titulo="Filas Críticas"
          valor={filasPorCriticidade.criticas.length}
          cor="red"
          subtitulo="> 90 dias de espera"
        />
        <KPICard
          titulo="Tempo Médio"
          valor={`${totais.tempoMedioEspera}d`}
          cor="purple"
          subtitulo="Tempo de espera"
        />
        <KPICard
          titulo="Maior Espera"
          valor={`${totais.maiorTempoEspera}d`}
          cor="red"
          subtitulo="Tempo máximo"
        />
        <KPICard
          titulo="Reaproveitamento"
          valor={`${totais.taxaReaproveitamento}%`}
          cor="green"
          subtitulo="Taxa média"
        />
        <KPICard
          titulo="Vagas Perdidas"
          valor={totais.vagasPerdidas}
          cor="yellow"
          subtitulo="Não reaproveitadas"
        />
      </div>

      {/* Distribuição por Criticidade */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Distribuição por Criticidade
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={dadosCriticidade}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {dadosCriticidade.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value, name, entry) =>
                  [`${value} filas (${entry.payload.pacientes} pacientes)`, name]
                }
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Distribuição por Tipo de Atendimento
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={analysisByType}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="tipo" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="totalPacientes" fill="#3b82f6" name="Pacientes" />
              <Bar dataKey="totalVagas" fill="#10b981" name="Vagas" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Distribuição por Região */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Distribuição por Região
        </h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Região
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Pacientes
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Vagas
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tempo Médio
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Críticas
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Alerta
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {analysisByRegion.map((regiao) => (
                <tr key={regiao.regiao}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {regiao.regiao}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {regiao.totalPacientes.toLocaleString('pt-BR')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-semibold">
                    {regiao.totalVagas}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {regiao.tempoMedioEspera} dias
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600 font-semibold">
                    {regiao.filasCriticas}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-yellow-600 font-semibold">
                    {regiao.filasAlerta}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Top 10 UBS com mais pacientes em fila */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Top 10 UBS - Maior Fila de Pacientes
        </h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  #
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  UBS
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Região
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Pacientes
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Vagas
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tempo Médio
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Críticas
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {analysisByUBS.slice(0, 10).map((ubs, index) => (
                <tr key={`${ubs.regiao}-${ubs.ubs}`} className={index < 3 ? 'bg-red-50' : ''}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {index + 1}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {ubs.ubs}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {ubs.regiao}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-blue-600">
                    {ubs.totalPacientes.toLocaleString('pt-BR')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">
                    {ubs.totalVagas}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {ubs.tempoMedioEspera} dias
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600 font-semibold">
                    {ubs.filasCriticas}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Oportunidades de Reoferta */}
      {oportunidades.length > 0 && (
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            Top 10 Oportunidades de Reoferta
          </h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    UBS
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Especialidade
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Vagas Disponíveis
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Taxa Reaproveitamento
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ação
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {oportunidades.map((oportunidade, index) => (
                  <tr key={oportunidade.id} className={index === 0 ? 'bg-green-100' : ''}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {oportunidade.ubs}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {oportunidade.especialidade}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-600">
                      {oportunidade.vagasDisponiveis} vagas
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {oportunidade.taxaReaproveitamento}%
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button className="text-blue-600 hover:text-blue-800 font-semibold">
                        Iniciar Reoferta
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

export default Filas
