import { describe, it, expect } from 'vitest'
import { mapStatusToCategory, aggregateByDay, calculateWeekTotals } from './dataAggregation.js'

describe('mapStatusToCategory', () => {
  const cases = [
    { status: 'Confirmado', confirmado: false, expected: 'confirmado' },
    { status: 'Confirmado', confirmado: true, expected: 'confirmado' },
    { status: 'confirmado', confirmado: false, expected: 'confirmado' },
    { status: 'Presente', confirmado: false, expected: 'presenca' },
    { status: 'Compareceu', confirmado: false, expected: 'presenca' },
    { status: 'Faltou', confirmado: false, expected: 'falta' },
    { status: 'No-show', confirmado: false, expected: 'falta' },
    { status: 'Cancelado', confirmado: false, expected: 'cancelado' },
    { status: 'Pendente', confirmado: false, expected: null },
    { status: 'Reagendado', confirmado: false, expected: null }
  ]

  cases.forEach(({ status, confirmado, expected }) => {
    it(`mapeia "${status}" corretamente`, () => {
      expect(mapStatusToCategory(status, confirmado)).toBe(expected)
    })
  })
})

describe('aggregateByDay e calculateWeekTotals', () => {
  const mockData = [
    { data: '2025-11-04', status: 'Confirmado', confirmado: true },
    { data: '2025-11-04', status: 'Presente', confirmado: false },
    { data: '2025-11-04', status: 'Cancelado', confirmado: false },
    { data: '2025-11-05', status: 'Faltou', confirmado: false },
    { data: '2025-11-05', status: 'Confirmado', confirmado: true }
  ]

  const weekDays = [
    '2025-11-04',
    '2025-11-05',
    '2025-11-06',
    '2025-11-07',
    '2025-11-08',
    '2025-11-09',
    '2025-11-10'
  ]

  it('inclui todos os 7 dias da semana', () => {
    const aggregated = aggregateByDay(mockData, weekDays)
    expect(aggregated).toHaveLength(7)
  })

  it('agrega corretamente e calcula totais', () => {
    const aggregated = aggregateByDay(mockData, weekDays)
    const day1 = aggregated.find(d => d.data === '2025-11-04')
    expect(day1).toBeTruthy()
    expect(day1.agendados).toBe(3)
    expect(day1.confirmados).toBe(1)
    expect(day1.presencas).toBe(1)
    expect(day1.cancelados).toBe(1)

    const totals = calculateWeekTotals(aggregated)
    expect(totals).toEqual({
      agendados: 5,
      confirmados: 2,
      presencas: 1,
      faltas: 1,
      cancelados: 1
    })
  })
})

