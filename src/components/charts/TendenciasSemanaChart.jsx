import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

function TendenciasSemanaChart({ dados }) {
  // Preparar dados para o gráfico
  const chartData = dados.map(dia => ({
    dia: new Date(dia.data + 'T00:00:00').toLocaleDateString('pt-BR', { weekday: 'short' }),
    agendados: dia.agendados,
    confirmados: dia.confirmados,
    presencas: dia.presencas,
    faltas: dia.faltas
  }))

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Tendências da Semana</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="dia"
            style={{ fontSize: '12px' }}
          />
          <YAxis style={{ fontSize: '12px' }} />
          <Tooltip
            contentStyle={{
              backgroundColor: '#fff',
              border: '1px solid #e5e7eb',
              borderRadius: '0.375rem'
            }}
          />
          <Legend wrapperStyle={{ fontSize: '12px' }} />
          <Line
            type="monotone"
            dataKey="agendados"
            stroke="#3b82f6"
            strokeWidth={2}
            name="Agendados"
            dot={{ fill: '#3b82f6', r: 4 }}
          />
          <Line
            type="monotone"
            dataKey="confirmados"
            stroke="#10b981"
            strokeWidth={2}
            name="Confirmados"
            dot={{ fill: '#10b981', r: 4 }}
          />
          <Line
            type="monotone"
            dataKey="presencas"
            stroke="#8b5cf6"
            strokeWidth={2}
            name="Presenças"
            dot={{ fill: '#8b5cf6', r: 4 }}
          />
          <Line
            type="monotone"
            dataKey="faltas"
            stroke="#ef4444"
            strokeWidth={2}
            name="Faltas"
            dot={{ fill: '#ef4444', r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
      <p className="text-sm text-gray-600 mt-4">
        Visualização da evolução de agendamentos, confirmações, presenças e faltas ao longo da semana
      </p>
    </div>
  )
}

export default TendenciasSemanaChart
