import { useState, useMemo } from 'react'
import { useAuth } from '../contexts/AuthContext'
import mockData from '../data/mockData.json'
import mockProfessionals from '../data/mockProfessionals.json'
import { getWeekDays, formatDateShort, getDayName } from '../utils/dateUtils'
import { aggregateByDay, calculateWeekTotals } from '../utils/dataAggregation'
import KPICard from '../components/KPICard'
import {
  calculateNoShowRate,
  calculateConfirmationRate,
  calculateAttendanceRate
} from '../utils/kpiCalculations'
import TendenciasSemanaChart from '../components/charts/TendenciasSemanaChart'
import OcupacaoProfissionaisChart from '../components/charts/OcupacaoProfissionaisChart'
import DistribuicaoTiposChart from '../components/charts/DistribuicaoTiposChart'
import AlertasOperacionais from '../components/AlertasOperacionais'
import ConfirmacoesPendentesPanel from '../components/ConfirmacoesPendentesPanel'
import AcoesRapidas from '../components/AcoesRapidas'
import FilaAgendamentosUBS from '../components/FilaAgendamentosUBS'

function DashboardUBS() {
  const { user } = useAuth()
  const [abaAtiva, setAbaAtiva] = useState('visao-geral')
  const [selectedDay, setSelectedDay] = useState('todos')
  const [selectedProfessional, setSelectedProfessional] = useState('todos')
  const [selectedTipo, setSelectedTipo] = useState('todos')

  // Filtra dados pela UBS do gestor
  const dadosUBS = useMemo(() => {
    return mockData.filter(item => item.ubs === user.ubs)
  }, [user.ubs])

  // Profissionais da UBS
  const profissionaisUBS = useMemo(() => {
    return mockProfessionals.filter(p => p.ubs === user.ubs)
  }, [user.ubs])

  // Semana atual
  const weekDays = useMemo(() => getWeekDays(new Date()), [])

  // Dados da semana
  const dadosSemana = useMemo(() => {
    return dadosUBS.filter(item => weekDays.includes(item.data))
  }, [dadosUBS, weekDays])

  // Agrega dados por dia
  const dadosAgregados = useMemo(() => {
    return aggregateByDay(dadosSemana, weekDays)
  }, [dadosSemana, weekDays])

  // Totais da semana
  const totais = useMemo(() => {
    return calculateWeekTotals(dadosAgregados)
  }, [dadosAgregados])

  // KPIs
  const kpis = useMemo(() => {
    return {
      noShowRate: calculateNoShowRate(dadosSemana),
      confirmationRate: calculateConfirmationRate(dadosSemana),
      attendanceRate: calculateAttendanceRate(dadosSemana)
    }
  }, [dadosSemana])

  // Agendamentos por profissional
  const agendamentosPorProfissional = useMemo(() => {
    return profissionaisUBS.map(prof => {
      const agendamentos = dadosSemana.filter(a => {
        // Simula associação por tipo
        if (prof.tipo === 'medico' && a.tipo === 'Consulta') return true
        if (prof.tipo === 'enfermeira' && a.tipo === 'Consulta') return true
        if (prof.tipo === 'tecnico' && a.tipo === 'Exame') return true
        return false
      })

      const vagasSemanais = prof.horarios.length * prof.vagasPorHorario
      const ocupacao = agendamentos.length > 0 ? (agendamentos.length / vagasSemanais) * 100 : 0

      return {
        ...prof,
        agendamentos: agendamentos.length,
        vagasSemanais,
        ocupacao: ocupacao.toFixed(1),
        confirmados: agendamentos.filter(a => a.confirmado).length,
        presencas: agendamentos.filter(a => a.status === 'Presente').length,
        faltas: agendamentos.filter(a => a.status === 'Faltou').length
      }
    })
  }, [profissionaisUBS, dadosSemana])

  // Agrupa profissionais por tipo
  const profissionaisPorTipo = useMemo(() => {
    return {
      medicos: agendamentosPorProfissional.filter(p => p.tipo === 'medico'),
      enfermeiras: agendamentosPorProfissional.filter(p => p.tipo === 'enfermeira'),
      tecnicos: agendamentosPorProfissional.filter(p => p.tipo === 'tecnico')
    }
  }, [agendamentosPorProfissional])

  // Filtra agendamentos para lista
  const agendamentosFiltrados = useMemo(() => {
    let filtrados = dadosSemana

    if (selectedDay !== 'todos') {
      filtrados = filtrados.filter(a => a.data === selectedDay)
    }

    if (selectedTipo !== 'todos') {
      const tipoMap = {
        medico: 'Consulta',
        enfermeira: 'Consulta',
        tecnico: 'Exame'
      }
      filtrados = filtrados.filter(a => a.tipo === tipoMap[selectedTipo])
    }

    return filtrados.sort((a, b) => {
      if (a.data !== b.data) return a.data.localeCompare(b.data)
      return a.hora.localeCompare(b.hora)
    })
  }, [dadosSemana, selectedDay, selectedTipo])

  // Hoje
  const hoje = new Date().toISOString().split('T')[0]
  const agendamentosHoje = dadosSemana.filter(a => a.data === hoje)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Dashboard Operacional</h2>
          <p className="text-gray-600 mt-1">
            UBS {user.ubs} - {user.regiao}
          </p>
        </div>
      </div>

      {/* Sistema de Abas */}
      <div className="bg-white rounded-lg shadow">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px overflow-x-auto">
            <button
              onClick={() => setAbaAtiva('visao-geral')}
              className={`px-6 py-4 text-sm font-medium border-b-2 whitespace-nowrap transition ${
                abaAtiva === 'visao-geral'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
                Visão Geral
              </div>
            </button>
            <button
              onClick={() => setAbaAtiva('fila-agendamentos')}
              className={`px-6 py-4 text-sm font-medium border-b-2 whitespace-nowrap transition ${
                abaAtiva === 'fila-agendamentos'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                Fila de Agendamentos
              </div>
            </button>
            <button
              onClick={() => setAbaAtiva('profissionais')}
              className={`px-6 py-4 text-sm font-medium border-b-2 whitespace-nowrap transition ${
                abaAtiva === 'profissionais'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                </svg>
                Profissionais
              </div>
            </button>
            <button
              onClick={() => setAbaAtiva('agenda')}
              className={`px-6 py-4 text-sm font-medium border-b-2 whitespace-nowrap transition ${
                abaAtiva === 'agenda'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                </svg>
                Agenda da Semana
              </div>
            </button>
          </nav>
        </div>
      </div>

      {/* Aba: Visão Geral */}
      {abaAtiva === 'visao-geral' && (
        <>
          {/* Alertas para Hoje */}
          {agendamentosHoje.length > 0 && (
            <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <svg className="h-6 w-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3 flex-1">
                  <h3 className="text-sm font-bold text-blue-900">Hoje ({new Date().toLocaleDateString('pt-BR')})</h3>
                  <div className="mt-2 text-sm text-blue-700">
                    <p>
                      <strong>{agendamentosHoje.length}</strong> agendamento(s) para hoje
                    </p>
                    <p className="mt-1">
                      <strong>{agendamentosHoje.filter(a => !a.confirmado).length}</strong> aguardando
                      confirmação
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

      {/* KPIs da Semana */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <KPICard
          titulo="Agendados"
          valor={totais.agendados}
          cor="blue"
          subtitulo="Total na semana"
        />
        <KPICard
          titulo="Confirmados"
          valor={totais.confirmados}
          percentual={kpis.confirmationRate}
          cor="green"
          subtitulo={`${kpis.confirmationRate.toFixed(1)}% confirmação`}
        />
        <KPICard
          titulo="Presenças"
          valor={totais.presencas}
          percentual={kpis.attendanceRate}
          cor="purple"
          subtitulo={`${kpis.attendanceRate.toFixed(1)}% presença`}
        />
        <KPICard
          titulo="Faltas"
          valor={totais.faltas}
          percentual={kpis.noShowRate}
          cor="red"
          subtitulo={`${kpis.noShowRate.toFixed(1)}% no-show`}
        />
        <KPICard
          titulo="Cancelados"
          valor={totais.cancelados}
          cor="yellow"
          subtitulo="Cancelamentos"
        />
      </div>

      {/* Seção de Analytics - Gráficos */}
      <div className="space-y-6">
        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          Analytics
        </h2>

        {/* Grid de Gráficos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <TendenciasSemanaChart dados={dadosAgregados} />
          <OcupacaoProfissionaisChart profissionais={agendamentosPorProfissional} />
        </div>

        {/* Gráfico de Pizza - Full Width */}
        <div className="grid grid-cols-1">
          <DistribuicaoTiposChart dados={dadosSemana} />
        </div>
      </div>

          {/* Ações Rápidas */}
          <AcoesRapidas />

          {/* Alertas e Confirmações Pendentes */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <AlertasOperacionais dados={dadosSemana} profissionais={agendamentosPorProfissional} />
            <div id="confirmacoes-pendentes">
              <ConfirmacoesPendentesPanel dados={dadosSemana} />
            </div>
          </div>
        </>
      )}

      {/* Aba: Fila de Agendamentos */}
      {abaAtiva === 'fila-agendamentos' && (
        <FilaAgendamentosUBS dados={dadosSemana} profissionais={profissionaisUBS} />
      )}

      {/* Aba: Profissionais */}
      {abaAtiva === 'profissionais' && (
        <>
          {/* Profissionais - Médicos */}
          <div id="profissionais-section" className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
          </svg>
          Médicos ({profissionaisPorTipo.medicos.length})
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {profissionaisPorTipo.medicos.map(prof => (
            <div key={prof.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="font-semibold text-gray-900">{prof.nome}</p>
                  <p className="text-sm text-gray-600">{prof.especialidade}</p>
                </div>
                <span
                  className={`px-2 py-1 rounded text-xs font-semibold ${
                    parseFloat(prof.ocupacao) > 80
                      ? 'bg-red-100 text-red-700'
                      : parseFloat(prof.ocupacao) > 60
                      ? 'bg-yellow-100 text-yellow-700'
                      : 'bg-green-100 text-green-700'
                  }`}
                >
                  {prof.ocupacao}% ocupado
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-3 text-sm">
                <div>
                  <p className="text-gray-600">Agendamentos</p>
                  <p className="font-semibold text-blue-600">
                    {prof.agendamentos}/{prof.vagasSemanais}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600">Confirmados</p>
                  <p className="font-semibold text-green-600">{prof.confirmados}</p>
                </div>
                <div>
                  <p className="text-gray-600">Presenças</p>
                  <p className="font-semibold text-purple-600">{prof.presencas}</p>
                </div>
                <div>
                  <p className="text-gray-600">Faltas</p>
                  <p className="font-semibold text-red-600">{prof.faltas}</p>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-gray-100">
                <p className="text-xs text-gray-600 font-semibold mb-1">Horários:</p>
                <div className="flex flex-wrap gap-1">
                  {prof.horarios.map((h, i) => (
                    <span key={i} className="text-xs bg-gray-100 px-2 py-1 rounded">
                      {h.dia.substring(0, 3)}: {h.inicio}-{h.fim}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Profissionais - Enfermeiras */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
          </svg>
          Enfermeiras ({profissionaisPorTipo.enfermeiras.length})
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {profissionaisPorTipo.enfermeiras.map(prof => (
            <div key={prof.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="font-semibold text-gray-900">{prof.nome}</p>
                  <p className="text-sm text-gray-600">{prof.especialidade}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-3 text-sm">
                <div>
                  <p className="text-gray-600">Agendados</p>
                  <p className="font-semibold text-blue-600">
                    {prof.agendamentos}/{prof.vagasSemanais}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600">Confirmados</p>
                  <p className="font-semibold text-green-600">{prof.confirmados}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Profissionais - Técnicos */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <svg className="w-6 h-6 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
            <path
              fillRule="evenodd"
              d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z"
              clipRule="evenodd"
            />
          </svg>
          Técnicos de Exames ({profissionaisPorTipo.tecnicos.length})
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {profissionaisPorTipo.tecnicos.map(prof => (
            <div key={prof.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="font-semibold text-gray-900">{prof.nome}</p>
                  <p className="text-sm text-gray-600">{prof.especialidade}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-3 text-sm">
                <div>
                  <p className="text-gray-600">Exames</p>
                  <p className="font-semibold text-blue-600">
                    {prof.agendamentos}/{prof.vagasSemanais}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600">Confirmados</p>
                  <p className="font-semibold text-green-600">{prof.confirmados}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
        </>
      )}

      {/* Aba: Agenda da Semana */}
      {abaAtiva === 'agenda' && (
        <div id="agenda-semana" className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Agenda da Semana</h3>
          <div className="flex gap-2">
            <select
              value={selectedDay}
              onChange={(e) => setSelectedDay(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
            >
              <option value="todos">Todos os dias</option>
              {weekDays.map(day => (
                <option key={day} value={day}>
                  {getDayName(day)} - {formatDateShort(day)}
                </option>
              ))}
            </select>
            <select
              value={selectedTipo}
              onChange={(e) => setSelectedTipo(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
            >
              <option value="todos">Todos</option>
              <option value="medico">Médicos</option>
              <option value="enfermeira">Enfermeiras</option>
              <option value="tecnico">Exames</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Data
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Hora
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Paciente
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Tipo
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Confirmado
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {agendamentosFiltrados.length > 0 ? (
                agendamentosFiltrados.slice(0, 50).map((agendamento, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                      {new Date(agendamento.data + 'T00:00:00').toLocaleDateString('pt-BR', {
                        weekday: 'short',
                        day: '2-digit',
                        month: '2-digit'
                      })}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                      {agendamento.hora}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                      {agendamento.paciente}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                      {agendamento.tipo}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">
                      <span
                        className={`px-2 py-1 rounded text-xs font-semibold ${
                          agendamento.status === 'Presente'
                            ? 'bg-green-100 text-green-700'
                            : agendamento.status === 'Faltou'
                            ? 'bg-red-100 text-red-700'
                            : agendamento.status === 'Cancelado'
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {agendamento.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">
                      {agendamento.confirmado ? (
                        <span className="text-green-600">Sim</span>
                      ) : (
                        <span className="text-gray-400">Não</span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-4 py-8 text-center text-gray-500">
                    Nenhum agendamento encontrado
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          {agendamentosFiltrados.length > 50 && (
            <p className="text-sm text-gray-500 mt-4 text-center">
              Mostrando 50 de {agendamentosFiltrados.length} agendamentos
            </p>
          )}
        </div>
        </div>
      )}
    </div>
  )
}

export default DashboardUBS
