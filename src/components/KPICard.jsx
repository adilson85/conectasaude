/**
 * Componente KPICard - Card de indicador com valor, percentual e tendência
 */

export default function KPICard({
  titulo,
  valor,
  percentual = null,
  tendencia = null, // { trend: 'up'|'down'|'stable', percentage: número }
  cor = 'blue',
  icone = null,
  subtitulo = null
}) {
  // Mapeamento de cores
  const coresConfig = {
    blue: {
      bg: 'bg-blue-50',
      text: 'text-blue-700',
      border: 'border-blue-200',
      icon: 'text-blue-500'
    },
    green: {
      bg: 'bg-green-50',
      text: 'text-green-700',
      border: 'border-green-200',
      icon: 'text-green-500'
    },
    red: {
      bg: 'bg-red-50',
      text: 'text-red-700',
      border: 'border-red-200',
      icon: 'text-red-500'
    },
    yellow: {
      bg: 'bg-yellow-50',
      text: 'text-yellow-700',
      border: 'border-yellow-200',
      icon: 'text-yellow-500'
    },
    purple: {
      bg: 'bg-purple-50',
      text: 'text-purple-700',
      border: 'border-purple-200',
      icon: 'text-purple-500'
    },
    gray: {
      bg: 'bg-gray-50',
      text: 'text-gray-700',
      border: 'border-gray-200',
      icon: 'text-gray-500'
    }
  };

  const cores = coresConfig[cor] || coresConfig.blue;

  // Ícone de tendência
  const renderTendencia = () => {
    if (!tendencia) return null;

    if (tendencia.trend === 'up') {
      return (
        <div className="flex items-center text-green-600 text-sm font-medium">
          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z"
              clipRule="evenodd"
            />
          </svg>
          <span>+{tendencia.percentage.toFixed(1)}%</span>
        </div>
      );
    }

    if (tendencia.trend === 'down') {
      return (
        <div className="flex items-center text-red-600 text-sm font-medium">
          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
          <span>-{tendencia.percentage.toFixed(1)}%</span>
        </div>
      );
    }

    return (
      <div className="flex items-center text-gray-500 text-sm font-medium">
        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
            clipRule="evenodd"
          />
        </svg>
        <span>Estável</span>
      </div>
    );
  };

  return (
    <div className={`${cores.bg} ${cores.border} border-2 rounded-lg p-5 transition-all hover:shadow-lg`}>
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium text-gray-600 uppercase tracking-wide">{titulo}</h3>
        {icone && <div className={`${cores.icon} text-2xl`}>{icone}</div>}
      </div>

      <div className="flex items-end justify-between">
        <div>
          <div className="flex items-baseline">
            <p className={`text-4xl font-bold ${cores.text}`}>{valor}</p>
            {percentual !== null && (
              <span className={`ml-2 text-xl font-semibold ${cores.text}`}>
                ({percentual.toFixed(1)}%)
              </span>
            )}
          </div>

          {subtitulo && <p className="text-sm text-gray-500 mt-1">{subtitulo}</p>}
        </div>

        {tendencia && <div className="ml-4">{renderTendencia()}</div>}
      </div>
    </div>
  );
}

