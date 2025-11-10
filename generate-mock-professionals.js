/**
 * Script para gerar dados mock de profissionais de saúde
 * Médicos, Enfermeiras e Técnicos de Exames por UBS
 */

import fs from 'fs'

// UBS Aventureiro I - profissionais
const profissionais = [
  // Médicos
  {
    id: 1,
    nome: 'Dr. Carlos Eduardo Mendes',
    tipo: 'medico',
    especialidade: 'Clínico Geral',
    ubs: 'Aventureiro I',
    regiao: 'Centro',
    horarios: [
      { dia: 'Segunda', inicio: '08:00', fim: '12:00' },
      { dia: 'Quarta', inicio: '08:00', fim: '12:00' },
      { dia: 'Sexta', inicio: '08:00', fim: '12:00' }
    ],
    vagasPorHorario: 16, // 4 por hora
    ativo: true
  },
  {
    id: 2,
    nome: 'Dra. Ana Paula Silva',
    tipo: 'medico',
    especialidade: 'Pediatria',
    ubs: 'Aventureiro I',
    regiao: 'Centro',
    horarios: [
      { dia: 'Segunda', inicio: '14:00', fim: '18:00' },
      { dia: 'Terça', inicio: '14:00', fim: '18:00' },
      { dia: 'Quinta', inicio: '14:00', fim: '18:00' }
    ],
    vagasPorHorario: 12, // 3 por hora
    ativo: true
  },
  {
    id: 3,
    nome: 'Dr. Roberto Almeida Santos',
    tipo: 'medico',
    especialidade: 'Ginecologia',
    ubs: 'Aventureiro I',
    regiao: 'Centro',
    horarios: [
      { dia: 'Terça', inicio: '08:00', fim: '12:00' },
      { dia: 'Quinta', inicio: '08:00', fim: '12:00' }
    ],
    vagasPorHorario: 8, // 2 por hora
    ativo: true
  },
  {
    id: 4,
    nome: 'Dra. Mariana Costa Oliveira',
    tipo: 'medico',
    especialidade: 'Cardiologia',
    ubs: 'Aventureiro I',
    regiao: 'Centro',
    horarios: [
      { dia: 'Quarta', inicio: '14:00', fim: '17:00' },
      { dia: 'Sexta', inicio: '14:00', fim: '17:00' }
    ],
    vagasPorHorario: 6, // 2 por hora
    ativo: true
  },

  // Enfermeiras
  {
    id: 5,
    nome: 'Enf. Juliana Rodrigues',
    tipo: 'enfermeira',
    especialidade: 'Triagem e Curativos',
    ubs: 'Aventureiro I',
    regiao: 'Centro',
    horarios: [
      { dia: 'Segunda', inicio: '08:00', fim: '14:00' },
      { dia: 'Terça', inicio: '08:00', fim: '14:00' },
      { dia: 'Quarta', inicio: '08:00', fim: '14:00' },
      { dia: 'Quinta', inicio: '08:00', fim: '14:00' },
      { dia: 'Sexta', inicio: '08:00', fim: '14:00' }
    ],
    vagasPorHorario: 24, // 4 por hora
    ativo: true
  },
  {
    id: 6,
    nome: 'Enf. Patricia Fernandes',
    tipo: 'enfermeira',
    especialidade: 'Vacinação',
    ubs: 'Aventureiro I',
    regiao: 'Centro',
    horarios: [
      { dia: 'Segunda', inicio: '08:00', fim: '12:00' },
      { dia: 'Terça', inicio: '08:00', fim: '12:00' },
      { dia: 'Quarta', inicio: '08:00', fim: '12:00' },
      { dia: 'Quinta', inicio: '08:00', fim: '12:00' },
      { dia: 'Sexta', inicio: '08:00', fim: '12:00' }
    ],
    vagasPorHorario: 20, // 5 por hora
    ativo: true
  },
  {
    id: 7,
    nome: 'Enf. Renata Souza Lima',
    tipo: 'enfermeira',
    especialidade: 'Pré-Natal',
    ubs: 'Aventureiro I',
    regiao: 'Centro',
    horarios: [
      { dia: 'Segunda', inicio: '14:00', fim: '17:00' },
      { dia: 'Quarta', inicio: '14:00', fim: '17:00' },
      { dia: 'Sexta', inicio: '14:00', fim: '17:00' }
    ],
    vagasPorHorario: 9, // 3 por hora
    ativo: true
  },

  // Técnicos de Exames
  {
    id: 8,
    nome: 'Téc. João Pedro Santos',
    tipo: 'tecnico',
    especialidade: 'Ultrassom',
    ubs: 'Aventureiro I',
    regiao: 'Centro',
    horarios: [
      { dia: 'Segunda', inicio: '08:00', fim: '12:00' },
      { dia: 'Quarta', inicio: '08:00', fim: '12:00' },
      { dia: 'Sexta', inicio: '08:00', fim: '12:00' }
    ],
    vagasPorHorario: 8, // 2 por hora
    ativo: true
  },
  {
    id: 9,
    nome: 'Téc. Camila Pereira',
    tipo: 'tecnico',
    especialidade: 'Raio-X',
    ubs: 'Aventureiro I',
    regiao: 'Centro',
    horarios: [
      { dia: 'Terça', inicio: '08:00', fim: '17:00' },
      { dia: 'Quinta', inicio: '08:00', fim: '17:00' }
    ],
    vagasPorHorario: 18, // 2 por hora
    ativo: true
  },
  {
    id: 10,
    nome: 'Téc. Lucas Martins',
    tipo: 'tecnico',
    especialidade: 'Eletrocardiograma',
    ubs: 'Aventureiro I',
    regiao: 'Centro',
    horarios: [
      { dia: 'Segunda', inicio: '14:00', fim: '17:00' },
      { dia: 'Quarta', inicio: '14:00', fim: '17:00' },
      { dia: 'Sexta', inicio: '14:00', fim: '17:00' }
    ],
    vagasPorHorario: 9, // 3 por hora
    ativo: true
  }
]

// Salva em JSON
const outputPath = './src/data/mockProfessionals.json'
fs.writeFileSync(outputPath, JSON.stringify(profissionais, null, 2))

console.log(`✅ ${profissionais.length} profissionais gerados com sucesso!`)
console.log(`📁 Arquivo salvo em: ${outputPath}`)

// Estatísticas
const medicos = profissionais.filter(p => p.tipo === 'medico')
const enfermeiras = profissionais.filter(p => p.tipo === 'enfermeira')
const tecnicos = profissionais.filter(p => p.tipo === 'tecnico')

console.log('\n📊 Estatísticas:')
console.log(`   Médicos: ${medicos.length}`)
console.log(`   Enfermeiras: ${enfermeiras.length}`)
console.log(`   Técnicos de Exames: ${tecnicos.length}`)
console.log(`   Total de vagas semanais: ${profissionais.reduce((sum, p) => sum + (p.vagasPorHorario * p.horarios.length), 0)}`)
