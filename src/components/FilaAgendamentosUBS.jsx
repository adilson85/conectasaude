import { useState, useMemo } from 'react'
import DetalhesAgendamentoModal from './DetalhesAgendamentoModal'

function FilaAgendamentosUBS({ dados, profissionais }) {
  const [agendamentoSelecionado, setAgendamentoSelecionado] = useState(null)
  const [filtroStatus, setFiltroStatus] = useState('todos')
  const [filtroData, setFiltroData] = useState('todos')
  const [filtroProfissional, setFiltroProfissional] = useState('todos')

  // Gera lista de datas únicas
  const datasUnicas = useMemo(() => {
    const datas = [...new Set(dados.map(a => a.data))].sort()
    return datas
  }, [dados])

  // Filtra agendamentos
  const agendamentosFiltrados = useMemo(() => {
    let filtrados = [...dados]

    if (filtroStatus !== 'todos') {
      if (filtroStatus === 'pendentes') {
        filtrados = filtrados.filter(a => !a.confirmado && a.status === 'Pendente')
      } else if (filtroStatus === 'confirmados') {
        filtrados = filtrados.filter(a => a.confirmado)
      } else if (filtroStatus === 'presentes') {
        filtrados = filtrados.filter(a => a.status === 'Presente' || a.status === 'Compareceu')
      } else if (filtroStatus === 'faltas') {
        filtrados = filtrados.filter(a => a.status === 'Faltou' || a.status === 'No-show')
      } else if (filtroStatus === 'cancelados') {
        filtrados = filtrados.filter(a => a.status === 'Cancelado')
      }
    }

    if (filtroData !== 'todos') {
      filtrados = filtrados.filter(a => a.data === filtroData)
    }

    if (filtroProfissional !== 'todos') {
      const prof = profissionais.find(p => p.id === filtroProfissional)
      if (prof) {
        // Filtra por tipo do profissional
        if (prof.tipo === 'medico' || prof.tipo === 'enfermeira') {
          filtrados = filtrados.filter(a => a.tipo === 'Consulta')
        } else if (prof.tipo === 'tecnico') {
          filtrados = filtrados.filter(a => a.tipo === 'Exame')
        }
      }
    }

    // Ordena por data e hora
    return filtrados.sort((a, b) => {
      if (a.data !== b.data) return a.data.localeCompare(b.data)
      return a.hora.localeCompare(b.hora)
    })
  }, [dados, filtroStatus, filtroData, filtroProfissional, profissionais])

  // Encontra profissional responsável pelo agendamento
  const getProfissionalResponsavel = (agendamento) => {
    // Simula a lógica de atribuição de profissional
    const profissionaisDisponiveis = profissionais.filter(p => {
      if (agendamento.tipo === 'Consulta') {
        return p.tipo === 'medico' || p.tipo === 'enfermeira'
      } else if (agendamento.tipo === 'Exame') {
        return p.tipo === 'tecnico'
      }
      return false
    })

    // Retorna o primeiro profissional disponível (ou poderia ser aleatório)
    return profissionaisDisponiveis[0] || null
  }

  const getStatusBadge = (agendamento) => {
    if (agendamento.status === 'Presente' || agendamento.status === 'Compareceu') {
      return <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded">Presente</span>
    } else if (agendamento.status === 'Faltou' || agendamento.status === 'No-show') {
      return <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-semibold rounded">Faltou</span>
    } else if (agendamento.status === 'Cancelado') {
      return <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs font-semibold rounded">Cancelado</span>
    } else if (agendamento.confirmado) {
      return <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded">Confirmado</span>
    } else {
      return <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs font-semibold rounded">Pendente</span>
    }
  }

  const handleAbrirDetalhes = (agendamento) => {
    setAgendamentoSelecionado(agendamento)
  }

  const handleFecharModal = () => {
    setAgendamentoSelecionado(null)
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          Fila de Agendamentos
        </h3>
        <div className="text-sm text-gray-600">
          <span className="font-semibold">{agendamentosFiltrados.length}</span> agendamento(s)
        </div>
      </div>

      {/* Filtros */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <select
            value={filtroStatus}
            onChange={(e) => setFiltroStatus(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
          >
            <option value="todos">Todos os Status</option>
            <option value="pendentes">Pendentes</option>
            <option value="confirmados">Confirmados</option>
            <option value="presentes">Presenças</option>
            <option value="faltas">Faltas</option>
            <option value="cancelados">Cancelados</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Data</label>
          <select
            value={filtroData}
            onChange={(e) => setFiltroData(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
          >
            <option value="todos">Todas as Datas</option>
            {datasUnicas.map(data => (
              <option key={data} value={data}>
                {new Date(data + 'T00:00:00').toLocaleDateString('pt-BR', {
                  weekday: 'short',
                  day: '2-digit',
                  month: '2-digit'
                })}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Profissional</label>
          <select
            value={filtroProfissional}
            onChange={(e) => setFiltroProfissional(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
          >
            <option value="todos">Todos os Profissionais</option>
            {profissionais.map(prof => (
              <option key={prof.id} value={prof.id}>
                {prof.nome} ({prof.especialidade})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Lista de Agendamentos */}
      {agendamentosFiltrados.length > 0 ? (
        <div className="space-y-3">
          {agendamentosFiltrados.map((agendamento, index) => {
            const profissional = getProfissionalResponsavel(agendamento)
            const hoje = new Date().toISOString().split('T')[0]
            const isHoje = agendamento.data === hoje

            return (
              <div
                key={index}
                onClick={() => handleAbrirDetalhes(agendamento)}
                className={`border rounded-lg p-4 hover:shadow-md transition cursor-pointer ${
                  isHoje ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-300'
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                  {/* Coluna 1: Data e Hora */}
                  <div className="flex items-center gap-3 min-w-[140px]">
                    <div className="flex-shrink-0">
                      <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">
                        {new Date(agendamento.data + 'T00:00:00').toLocaleDateString('pt-BR', {
                          day: '2-digit',
                          month: '2-digit'
                        })}
                        {isHoje && <span className="ml-1 text-blue-600 font-bold text-xs">(HOJE)</span>}
                      </p>
                      <p className="text-xs text-gray-600">{agendamento.hora}</p>
                    </div>
                  </div>

                  {/* Coluna 2: Paciente */}
                  <div className="flex-1 min-w-[200px]">
                    <div className="flex items-start gap-2">
                      <svg className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                      </svg>
                      <div>
                        <p className="font-semibold text-gray-900">{agendamento.paciente}</p>
                        <p className="text-xs text-gray-600">{agendamento.tipo}</p>
                      </div>
                    </div>
                  </div>

                  {/* Coluna 3: Profissional */}
                  {profissional && (
                    <div className="flex-1 min-w-[180px]">
                      <div className="flex items-start gap-2">
                        <svg className="w-5 h-5 text-purple-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
                        </svg>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{profissional.nome}</p>
                          <p className="text-xs text-gray-600">{profissional.especialidade}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Coluna 4: Status */}
                  <div className="flex items-center gap-2">
                    {getStatusBadge(agendamento)}
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>

                {/* Informações Adicionais */}
                {(agendamento.telefone || agendamento.observacoes) && (
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <div className="flex flex-wrap gap-4 text-xs text-gray-600">
                      {agendamento.telefone && (
                        <div className="flex items-center gap-1">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                          </svg>
                          {agendamento.telefone}
                        </div>
                      )}
                      {agendamento.observacoes && (
                        <div className="flex items-center gap-1">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                          </svg>
                          {agendamento.observacoes.substring(0, 50)}{agendamento.observacoes.length > 50 ? '...' : ''}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      ) : (
        <div className="text-center py-12 text-gray-500">
          <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <p className="text-lg font-medium">Nenhum agendamento encontrado</p>
          <p className="text-sm mt-1">Ajuste os filtros para ver mais resultados</p>
        </div>
      )}

      {/* Modal de Detalhes */}
      {agendamentoSelecionado && (
        <DetalhesAgendamentoModal
          agendamento={agendamentoSelecionado}
          profissional={getProfissionalResponsavel(agendamentoSelecionado)}
          onClose={handleFecharModal}
        />
      )}
    </div>
  )
}

export default FilaAgendamentosUBS
