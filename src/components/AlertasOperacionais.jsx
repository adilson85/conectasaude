function AlertasOperacionais({ dados, profissionais }) {
  // Calcular alertas
  const hoje = new Date().toISOString().split('T')[0]
  const amanha = new Date(Date.now() + 86400000).toISOString().split('T')[0]

  // Confirmações pendentes urgentes (hoje e amanhã)
  const confirmacoesUrgentes = dados.filter(a =>
    !a.confirmado && (a.data === hoje || a.data === amanha)
  )

  // Calcular ocupação média
  const ocupacaoMedia = profissionais.length > 0
    ? profissionais.reduce((sum, p) => sum + parseFloat(p.ocupacao), 0) / profissionais.length
    : 0

  // Profissionais com alta ocupação
  const profissionaisSobrecarga = profissionais.filter(p => parseFloat(p.ocupacao) > 85)

  // Gerar alertas
  const alertas = []

  // Alerta crítico: Confirmações urgentes
  if (confirmacoesUrgentes.length > 0) {
    alertas.push({
      tipo: 'critico',
      icone: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
      ),
      titulo: 'Confirmações Urgentes',
      mensagem: `${confirmacoesUrgentes.length} agendamento(s) sem confirmação para hoje/amanhã`,
      cor: 'red',
      acao: 'Ver confirmações'
    })
  }

  // Alerta info: Alta ocupação
  if (profissionaisSobrecarga.length > 0) {
    alertas.push({
      tipo: 'info',
      icone: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
        </svg>
      ),
      titulo: 'Alta Ocupação',
      mensagem: `${profissionaisSobrecarga.length} profissional(is) com ocupação > 85%`,
      cor: 'blue',
      acao: 'Ver profissionais'
    })
  }

  // Alerta atenção: Baixa ocupação
  if (ocupacaoMedia > 0 && ocupacaoMedia < 60) {
    alertas.push({
      tipo: 'atencao',
      icone: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
      ),
      titulo: 'Baixa Ocupação',
      mensagem: `Ocupação média da UBS em ${ocupacaoMedia.toFixed(1)}% - vagas disponíveis`,
      cor: 'yellow',
      acao: 'Ofertar vagas'
    })
  }

  if (alertas.length === 0) {
    return (
      <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4">
        <div className="flex items-center">
          <svg className="w-6 h-6 text-green-600 mr-3" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <div>
            <h3 className="text-sm font-semibold text-green-900">Tudo Certo!</h3>
            <p className="text-sm text-green-700">Nenhum alerta operacional no momento</p>
          </div>
        </div>
      </div>
    )
  }

  const getCorClasses = (cor) => {
    const cores = {
      red: 'bg-red-50 border-red-200 text-red-900',
      yellow: 'bg-yellow-50 border-yellow-200 text-yellow-900',
      blue: 'bg-blue-50 border-blue-200 text-blue-900'
    }
    return cores[cor] || cores.blue
  }

  const getIconColor = (cor) => {
    const cores = {
      red: 'text-red-600',
      yellow: 'text-yellow-600',
      blue: 'text-blue-600'
    }
    return cores[cor] || cores.blue
  }

  const getTextColor = (cor) => {
    const cores = {
      red: 'text-red-700',
      yellow: 'text-yellow-700',
      blue: 'text-blue-700'
    }
    return cores[cor] || cores.blue
  }

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
        <svg className="w-5 h-5 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
          <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
        </svg>
        Alertas Operacionais
      </h3>
      {alertas.map((alerta, index) => (
        <div key={index} className={`border-2 rounded-lg p-4 ${getCorClasses(alerta.cor)}`}>
          <div className="flex items-start justify-between">
            <div className="flex items-start">
              <div className={`flex-shrink-0 ${getIconColor(alerta.cor)}`}>
                {alerta.icone}
              </div>
              <div className="ml-3">
                <h4 className="text-sm font-semibold">{alerta.titulo}</h4>
                <p className={`text-sm mt-1 ${getTextColor(alerta.cor)}`}>{alerta.mensagem}</p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default AlertasOperacionais
