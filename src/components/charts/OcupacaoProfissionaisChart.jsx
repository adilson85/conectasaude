import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts'

function OcupacaoProfissionaisChart({ profissionais }) {
  // Preparar dados para o gráfico
  const chartData = profissionais.map(prof => ({
    nome: prof.nome.split(' ')[0] + ' ' + prof.nome.split(' ')[prof.nome.split(' ').length - 1], // Primeiro + Último nome
    ocupacao: parseFloat(prof.ocupacao),
    tipo: prof.tipo
  }))

  // Função para determinar a cor baseada na ocupação
  const getBarColor = (ocupacao) => {
    if (ocupacao > 80) return '#ef4444' // Vermelho - sobrecarga
    if (ocupacao > 60) return '#f59e0b' // Amarelo - moderado
    return '#10b981' // Verde - baixa ocupação
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Taxa de Ocupação por Profissional</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="nome"
            style={{ fontSize: '11px' }}
            angle={-45}
            textAnchor="end"
            height={80}
          />
          <YAxis
            label={{ value: 'Ocupação (%)', angle: -90, position: 'insideLeft', style: { fontSize: '12px' } }}
            style={{ fontSize: '12px' }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#fff',
              border: '1px solid #e5e7eb',
              borderRadius: '0.375rem'
            }}
            formatter={(value) => `${value}%`}
          />
          <Legend wrapperStyle={{ fontSize: '12px' }} />
          <Bar dataKey="ocupacao" name="Taxa de Ocupação" radius={[8, 8, 0, 0]}>
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={getBarColor(entry.ocupacao)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <div className="flex items-center justify-center gap-6 mt-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded" style={{ backgroundColor: '#10b981' }}></div>
          <span className="text-gray-600">&lt; 60% (Disponível)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded" style={{ backgroundColor: '#f59e0b' }}></div>
          <span className="text-gray-600">60-80% (Moderado)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded" style={{ backgroundColor: '#ef4444' }}></div>
          <span className="text-gray-600">&gt; 80% (Sobrecarga)</span>
        </div>
      </div>
    </div>
  )
}

export default OcupacaoProfissionaisChart
