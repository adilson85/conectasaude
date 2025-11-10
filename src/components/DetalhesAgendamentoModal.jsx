import { useMemo } from 'react'

function DetalhesAgendamentoModal({ agendamento, profissional, onClose }) {
  if (!agendamento) return null

  // Calcula dias até a consulta
  const diasAteConsulta = useMemo(() => {
    const hoje = new Date()
    hoje.setHours(0, 0, 0, 0)
    const dataAgendamento = new Date(agendamento.data + 'T00:00:00')
    const diffTime = dataAgendamento - hoje
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }, [agendamento.data])

  const getStatusColor = (status) => {
    switch (status) {
      case 'Presente':
      case 'Compareceu':
        return 'bg-green-100 text-green-800'
      case 'Faltou':
      case 'No-show':
        return 'bg-red-100 text-red-800'
      case 'Cancelado':
        return 'bg-yellow-100 text-yellow-800'
      case 'Pendente':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-blue-100 text-blue-800'
    }
  }

  const getDiasTexto = () => {
    if (diasAteConsulta < 0) return `Há ${Math.abs(diasAteConsulta)} dia(s)`
    if (diasAteConsulta === 0) return 'HOJE'
    if (diasAteConsulta === 1) return 'AMANHÃ'
    return `Em ${diasAteConsulta} dia(s)`
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-t-lg">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold mb-1">Detalhes do Agendamento</h2>
              <p className="text-blue-100 text-sm">
                {new Date(agendamento.data + 'T00:00:00').toLocaleDateString('pt-BR', {
                  weekday: 'long',
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                })}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-blue-200 transition"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          {/* Informações do Paciente */}
          <div className="border-b border-gray-200 pb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
              Informações do Paciente
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Nome Completo</p>
                <p className="font-semibold text-gray-900">{agendamento.paciente}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">CPF</p>
                <p className="font-semibold text-gray-900">{agendamento.cpf || 'Não informado'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Telefone</p>
                <p className="font-semibold text-gray-900">{agendamento.telefone || 'Não informado'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Cartão SUS</p>
                <p className="font-semibold text-gray-900">{agendamento.cartao_sus || 'Não informado'}</p>
              </div>
            </div>
          </div>

          {/* Informações da Consulta */}
          <div className="border-b border-gray-200 pb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
              </svg>
              Informações da Consulta
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Data</p>
                <p className="font-semibold text-gray-900">
                  {new Date(agendamento.data + 'T00:00:00').toLocaleDateString('pt-BR')}
                  <span className="ml-2 text-sm font-normal text-blue-600">({getDiasTexto()})</span>
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Horário</p>
                <p className="font-semibold text-gray-900">{agendamento.hora}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Tipo</p>
                <p className="font-semibold text-gray-900">{agendamento.tipo}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Especialidade</p>
                <p className="font-semibold text-gray-900">{agendamento.especialidade || 'Não especificado'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Status</p>
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(agendamento.status)}`}>
                  {agendamento.status}
                </span>
              </div>
              <div>
                <p className="text-sm text-gray-600">Confirmado</p>
                <p className="font-semibold">
                  {agendamento.confirmado ? (
                    <span className="text-green-600">Sim</span>
                  ) : (
                    <span className="text-orange-600">Não confirmado</span>
                  )}
                </p>
              </div>
            </div>
          </div>

          {/* Informações do Profissional */}
          {profissional && (
            <div className="border-b border-gray-200 pb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
                  <path d="M13 7a1 1 0 11-2 0 1 1 0 012 0z" />
                </svg>
                Profissional Responsável
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Nome</p>
                  <p className="font-semibold text-gray-900">{profissional.nome}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Tipo</p>
                  <p className="font-semibold text-gray-900 capitalize">{profissional.tipo}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Especialidade</p>
                  <p className="font-semibold text-gray-900">{profissional.especialidade}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Registro</p>
                  <p className="font-semibold text-gray-900">{profissional.registro || 'Não informado'}</p>
                </div>
              </div>
            </div>
          )}

          {/* Informações de Comunicação */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              Comunicação
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Canal de Aviso</p>
                <p className="font-semibold text-gray-900">{agendamento.canal_aviso || 'Nenhum'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Paciente Avisado</p>
                <p className="font-semibold">
                  {agendamento.avisado ? (
                    <span className="text-green-600">Sim</span>
                  ) : (
                    <span className="text-gray-500">Não</span>
                  )}
                </p>
              </div>
            </div>
          </div>

          {/* Observações */}
          {agendamento.observacoes && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2">
                <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                </svg>
                Observações
              </h3>
              <p className="text-gray-700 bg-gray-50 p-3 rounded">{agendamento.observacoes}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 rounded-b-lg flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-medium"
          >
            Fechar
          </button>
          {!agendamento.confirmado && agendamento.status === 'Pendente' && (
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
              onClick={() => alert('Funcionalidade de confirmação será implementada em breve!')}
            >
              Confirmar Agendamento
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default DetalhesAgendamentoModal
