import { useState } from 'react'

function ConfirmacoesPendentesPanel({ dados }) {
  const [confirmados, setConfirmados] = useState({})

  // Filtrar apenas não confirmados
  const pendentes = dados
    .filter(a => !a.confirmado)
    .sort((a, b) => {
      // Ordenar por data (mais próximo primeiro)
      if (a.data !== b.data) return a.data.localeCompare(b.data)
      return a.hora.localeCompare(b.hora)
    })

  // Calcular dias até o agendamento
  const calcularDiasRestantes = (data) => {
    const hoje = new Date()
    hoje.setHours(0, 0, 0, 0)
    const dataAgendamento = new Date(data + 'T00:00:00')
    const diffTime = dataAgendamento - hoje
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  // Determinar urgência
  const getUrgenciaClasses = (dias) => {
    if (dias < 0) return 'bg-gray-100 text-gray-600' // Passado
    if (dias === 0) return 'bg-red-100 text-red-700' // Hoje
    if (dias === 1) return 'bg-orange-100 text-orange-700' // Amanhã
    if (dias <= 3) return 'bg-yellow-100 text-yellow-700' // Próximos 3 dias
    return 'bg-blue-100 text-blue-700' // Normal
  }

  const getUrgenciaTexto = (dias) => {
    if (dias < 0) return 'Atrasado'
    if (dias === 0) return 'HOJE'
    if (dias === 1) return 'AMANHÃ'
    return `${dias} dias`
  }

  // Simular confirmação
  const handleConfirmar = (index) => {
    setConfirmados(prev => ({ ...prev, [index]: true }))
  }

  // Filtrar confirmados localmente
  const pendentesFiltrados = pendentes.filter((_, index) => !confirmados[index])

  if (pendentesFiltrados.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          Confirmações Pendentes
        </h3>
        <div className="text-center py-8 text-gray-500">
          <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <p className="text-lg font-medium">Todas as confirmações em dia!</p>
          <p className="text-sm mt-1">Não há agendamentos pendentes de confirmação</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <svg className="w-6 h-6 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
          </svg>
          Confirmações Pendentes
        </h3>
        <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm font-semibold">
          {pendentesFiltrados.length} pendente(s)
        </span>
      </div>

      <div className="space-y-2 max-h-96 overflow-y-auto">
        {pendentesFiltrados.slice(0, 10).map((agendamento, index) => {
          const dias = calcularDiasRestantes(agendamento.data)
          return (
            <div
              key={index}
              className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${getUrgenciaClasses(dias)}`}>
                      {getUrgenciaTexto(dias)}
                    </span>
                    <span className="text-sm font-semibold text-gray-900">
                      {new Date(agendamento.data + 'T00:00:00').toLocaleDateString('pt-BR', {
                        weekday: 'short',
                        day: '2-digit',
                        month: '2-digit'
                      })}
                    </span>
                    <span className="text-sm text-gray-600">{agendamento.hora}</span>
                  </div>
                  <p className="font-medium text-gray-900">{agendamento.paciente}</p>
                  <p className="text-sm text-gray-600">{agendamento.tipo}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleConfirmar(pendentes.indexOf(agendamento))}
                    className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition"
                    title="Marcar como confirmado"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </button>
                  <button
                    className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition"
                    title="Adicionar à lista de ligações"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {pendentesFiltrados.length > 10 && (
        <div className="mt-4 text-center">
          <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
            Ver todos ({pendentesFiltrados.length})
          </button>
        </div>
      )}
    </div>
  )
}

export default ConfirmacoesPendentesPanel
