/**
 * Script para gerar dados mock de filas de espera
 * Gera dados realistas para o dashboard de filas consolidado
 */

import fs from 'fs'

// Regiões e UBS de Joinville
const regioes = ['Centro', 'Norte', 'Sul']
const ubs = {
  Centro: [
    'Aventureiro I',
    'Aventureiro II',
    'Bakhita',
    'Bucarein',
    'CAIC Vila Paranaense',
    'Comasa',
    'Cubatão',
    'Itaum',
    'Parque Joinville',
    'Saguaçu'
  ],
  Norte: [
    'Bom Retiro',
    'Canela',
    'Costa e Silva',
    'Glória',
    'Jardim Paraíso',
    'Jardim Sofia',
    'Morro do Meio',
    'Nova Brasília',
    'Pirabeiraba',
    'Rio Bonito',
    'São Marcos',
    'Vila Nova',
    'Vila Nova I'
  ],
  Sul: [
    'Adhemar Garcia',
    'Boehmerwald',
    'Edla Jordan',
    'Estevão de Matos',
    'Fátima',
    'Floresta',
    'Itinga',
    'Jardim Edilene',
    'Jarivatuba',
    'Ulysses Guimarães'
  ]
}

// Tipos de atendimento e especialidades
const tiposAtendimento = [
  { tipo: 'Consulta', especialidades: ['Clínica Geral', 'Pediatria', 'Ginecologia', 'Cardiologia', 'Dermatologia'] },
  { tipo: 'Exame', especialidades: ['Ultrassom', 'Raio-X', 'Mamografia', 'Endoscopia', 'Eletrocardiograma'] },
  { tipo: 'Procedimento', especialidades: ['Pequena Cirurgia', 'Curativo', 'Cauterização', 'Drenagem', 'Biópsia'] }
]

// Função para gerar data aleatória dentro de um intervalo
function randomDate(start, end) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))
}

// Função para calcular dias de espera
function calcularDiasEspera(dataEntrada) {
  const hoje = new Date('2025-01-10') // Data de referência
  const entrada = new Date(dataEntrada)
  const diffTime = Math.abs(hoje - entrada)
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays
}

// Gera registros de filas
function gerarFilas() {
  const filas = []
  let id = 1

  // Para cada região
  regioes.forEach(regiao => {
    const ubsRegiao = ubs[regiao]

    // Para cada UBS
    ubsRegiao.forEach(nomeUBS => {
      // Para cada tipo de atendimento
      tiposAtendimento.forEach(tipoAtend => {
        tipoAtend.especialidades.forEach(especialidade => {
          // Gera quantidade aleatória de pacientes na fila (0-50)
          const qtdPacientes = Math.floor(Math.random() * 51)

          if (qtdPacientes > 0) {
            // Data de entrada na fila (últimos 120 dias)
            const dataInicio = new Date('2024-09-10')
            const dataFim = new Date('2025-01-08')
            const dataEntrada = randomDate(dataInicio, dataFim).toISOString().split('T')[0]

            // Calcula dias de espera
            const diasEspera = calcularDiasEspera(dataEntrada)

            // Define status da fila
            let status = 'Normal'
            let prioridade = 'Média'

            if (diasEspera > 90) {
              status = 'Crítica'
              prioridade = 'Alta'
            } else if (diasEspera > 60) {
              status = 'Alerta'
              prioridade = 'Alta'
            } else if (diasEspera > 30) {
              status = 'Atenção'
              prioridade = 'Média'
            }

            // Vagas disponíveis (0-10)
            const vagasDisponiveis = Math.floor(Math.random() * 11)

            // Tempo médio de espera (dias)
            const tempoMedioEspera = Math.floor(diasEspera * (0.8 + Math.random() * 0.4))

            // Taxa de reaproveitamento (50-95%)
            const taxaReaproveitamento = 50 + Math.floor(Math.random() * 46)

            filas.push({
              id: id++,
              regiao,
              ubs: nomeUBS,
              tipo: tipoAtend.tipo,
              especialidade,
              pacientesNaFila: qtdPacientes,
              vagasDisponiveis,
              tempoMedioEspera,
              maiorTempoEspera: diasEspera,
              dataUltimaAtualizacao: new Date().toISOString().split('T')[0],
              status,
              prioridade,
              taxaReaproveitamento,
              vagasPerdidas: Math.floor(qtdPacientes * (100 - taxaReaproveitamento) / 100)
            })
          }
        })
      })
    })
  })

  return filas
}

// Gera dados
console.log('🏥 Gerando dados mock de filas...')
const filas = gerarFilas()

// Salva em JSON
const outputPath = './src/data/mockQueues.json'
fs.writeFileSync(outputPath, JSON.stringify(filas, null, 2))

console.log(`✅ ${filas.length} registros de filas gerados com sucesso!`)
console.log(`📁 Arquivo salvo em: ${outputPath}`)

// Estatísticas
const totalPacientes = filas.reduce((sum, fila) => sum + fila.pacientesNaFila, 0)
const totalVagas = filas.reduce((sum, fila) => sum + fila.vagasDisponiveis, 0)
const filasCriticas = filas.filter(f => f.status === 'Crítica').length
const filasAlerta = filas.filter(f => f.status === 'Alerta').length

console.log('\n📊 Estatísticas:')
console.log(`   Total de pacientes em filas: ${totalPacientes}`)
console.log(`   Total de vagas disponíveis: ${totalVagas}`)
console.log(`   Filas críticas (>90 dias): ${filasCriticas}`)
console.log(`   Filas em alerta (>60 dias): ${filasAlerta}`)
console.log(`   Tempo médio de espera geral: ${Math.floor(filas.reduce((sum, f) => sum + f.tempoMedioEspera, 0) / filas.length)} dias`)
