import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts'

function DistribuicaoTiposChart({ dados }) {
  // Contar agendamentos por tipo
  const tiposCount = dados.reduce((acc, item) => {
    acc[item.tipo] = (acc[item.tipo] || 0) + 1
    return acc
  }, {})

  // Preparar dados para o gráfico
  const chartData = Object.entries(tiposCount).map(([tipo, quantidade]) => ({
    name: tipo,
    value: quantidade
  }))

  // Cores por tipo
  const COLORS = {
    'Consulta': '#3b82f6',  // Azul
    'Exame': '#8b5cf6',     // Roxo
    'Procedimento': '#10b981'  // Verde
  }

  // Função personalizada para o label
  const renderLabel = (entry) => {
    const percent = ((entry.value / dados.length) * 100).toFixed(1)
    return `${entry.name}: ${percent}%`
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Distribuição por Tipo de Atendimento</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={true}
            label={renderLabel}
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[entry.name] || '#6b7280'} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: '#fff',
              border: '1px solid #e5e7eb',
              borderRadius: '0.375rem'
            }}
            formatter={(value) => `${value} agendamentos`}
          />
          <Legend wrapperStyle={{ fontSize: '12px' }} />
        </PieChart>
      </ResponsiveContainer>
      <div className="mt-4 grid grid-cols-3 gap-4 text-center">
        {chartData.map((item) => {
          const percent = ((item.value / dados.length) * 100).toFixed(1)
          return (
            <div key={item.name} className="text-sm">
              <div className="font-semibold text-gray-900">{item.value}</div>
              <div className="text-gray-600">{item.name}</div>
              <div className="text-gray-500">{percent}%</div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default DistribuicaoTiposChart
