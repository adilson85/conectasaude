function AcoesRapidas() {
  const acoes = [
    {
      titulo: 'Exportar Relatório',
      descricao: 'Gerar relatório semanal da UBS',
      icone: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
        </svg>
      ),
      cor: 'blue',
      acao: () => alert('Funcionalidade de exportação será implementada em breve!')
    },
    {
      titulo: 'Ver Confirmações',
      descricao: 'Todas as confirmações pendentes',
      icone: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
        </svg>
      ),
      cor: 'green',
      acao: () => {
        // Scroll para seção de confirmações
        const confirmacoesSection = document.getElementById('confirmacoes-pendentes')
        if (confirmacoesSection) {
          confirmacoesSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
      }
    },
    {
      titulo: 'Gestão de Profissionais',
      descricao: 'Ver estatísticas dos profissionais',
      icone: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      cor: 'purple',
      acao: () => {
        // Scroll para seção de profissionais
        const profissionaisSection = document.getElementById('profissionais-section')
        if (profissionaisSection) {
          profissionaisSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
      }
    },
    {
      titulo: 'Agenda Semanal',
      descricao: 'Ver agenda completa da semana',
      icone: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      cor: 'orange',
      acao: () => {
        // Scroll para agenda
        const agendaSection = document.getElementById('agenda-semana')
        if (agendaSection) {
          agendaSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
      }
    }
  ]

  const getCorClasses = (cor) => {
    const cores = {
      blue: 'bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200',
      green: 'bg-green-50 hover:bg-green-100 text-green-700 border-green-200',
      purple: 'bg-purple-50 hover:bg-purple-100 text-purple-700 border-purple-200',
      orange: 'bg-orange-50 hover:bg-orange-100 text-orange-700 border-orange-200'
    }
    return cores[cor] || cores.blue
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
          <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
          <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
        </svg>
        Ações Rápidas
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {acoes.map((acao, index) => (
          <button
            key={index}
            onClick={acao.acao}
            className={`border-2 rounded-lg p-4 text-left transition ${getCorClasses(acao.cor)}`}
          >
            <div className="mb-2">{acao.icone}</div>
            <h4 className="font-semibold text-sm mb-1">{acao.titulo}</h4>
            <p className="text-xs opacity-80">{acao.descricao}</p>
          </button>
        ))}
      </div>
    </div>
  )
}

export default AcoesRapidas
