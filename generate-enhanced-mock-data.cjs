// Script para gerar dados mock enriquecidos para UBS
const fs = require('fs')

// Função para gerar CPF aleatório
function gerarCPF() {
  const n = () => Math.floor(Math.random() * 10)
  return `${n()}${n()}${n()}.${n()}${n()}${n()}.${n()}${n()}${n()}-${n()}${n()}`
}

// Função para gerar telefone
function gerarTelefone() {
  const ddd = Math.floor(Math.random() * 89) + 11 // DDDs de 11 a 99
  const num = Math.floor(Math.random() * 90000) + 10000
  const num2 = Math.floor(Math.random() * 9000) + 1000
  return `(${ddd}) 9${num}-${num2}`
}

// Função para gerar cartão SUS
function gerarCartaoSUS() {
  let num = ''
  for (let i = 0; i < 15; i++) {
    num += Math.floor(Math.random() * 10)
  }
  return num
}

// Função para obter data no formato YYYY-MM-DD
function getDataFormatada(offset = 0) {
  const hoje = new Date()
  hoje.setDate(hoje.getDate() + offset)
  return hoje.toISOString().split('T')[0]
}

// Nomes de pacientes
const nomesPacientes = [
  'Maria Silva Santos', 'João Pedro Oliveira', 'Ana Paula Costa', 'Carlos Eduardo Lima',
  'Fernanda Souza Alves', 'Roberto Carlos Mendes', 'Juliana Ferreira', 'Paulo Ricardo Santos',
  'Mariana Rodrigues', 'Lucas Gabriel Silva', 'Camila Vitória Souza', 'Rafael Henrique Costa',
  'Beatriz Cristina Lima', 'Bruno Alves Santos', 'Larissa Fernandes', 'Diego Martins Silva',
  'Amanda Carolina Souza', 'Thiago Henrique Oliveira', 'Gabriela Ribeiro', 'Leonardo Santos',
  'Vanessa Aparecida Silva', 'Rodrigo Almeida Costa', 'Patricia Santos Lima', 'Alexandre Pereira',
  'Renata Cristina Souza', 'Marcelo Augusto Silva', 'Tatiana Ferreira', 'Felipe Santos Costa',
  'Aline Cristina Oliveira', 'Vinicius Rodrigues', 'Bianca Silva Santos', 'Anderson Costa',
  'Sabrina Alves Souza', 'Guilherme Henrique Silva', 'Priscila Fernandes', 'Eduardo Santos',
  'Natália Cristina Lima', 'Henrique Alves Costa', 'Michele Silva Santos', 'Fabio Rodrigues'
]

// Especialidades
const especialidades = {
  'Consulta': ['Clínico Geral', 'Pediatria', 'Ginecologia', 'Cardiologia', 'Dermatologia'],
  'Exame': ['Hemograma', 'Raio-X', 'Ultrassom', 'Glicemia', 'Colesterol']
}

// Observações possíveis
const observacoes = [
  'Paciente com mobilidade reduzida',
  'Primeira consulta',
  'Retorno - trazer exames anteriores',
  'Jejum de 8 horas necessário',
  'Paciente gestante',
  'Trazer documentos e cartão SUS',
  'Consulta de rotina',
  'Paciente diabético',
  'Hipertenso - acompanhamento',
  null, null, null // Alguns sem observações
]

// Regiões e UBS
const regioes = ['Centro', 'Norte', 'Sul', 'Leste', 'Oeste']
const ubsPorRegiao = {
  'Centro': ['Aventureiro I', 'Aventureiro II', 'Centro'],
  'Norte': ['Adhemar Garcia', 'Boa Vista'],
  'Sul': ['Edla Jordan', 'Glória'],
  'Leste': ['Itaum', 'Comasa'],
  'Oeste': ['Vila Nova', 'Iririú']
}

// Status possíveis
const statusOpcoes = ['Pendente', 'Presente', 'Faltou', 'Cancelado']
const canaisAviso = ['WhatsApp', 'SMS', 'Ligação', 'E-mail']

// Ler dados existentes
let mockData = []
try {
  mockData = JSON.parse(fs.readFileSync('./src/data/mockData.json', 'utf8'))
} catch (err) {
  console.log('Criando novo arquivo de dados...')
}

// Gerar novos dados enriquecidos
const novosDados = []
let idInicial = mockData.length > 0 ? Math.max(...mockData.map(d => d.id)) + 1 : 1

// Gerar dados para a semana atual (-2 dias até +5 dias)
for (let dia = -2; dia <= 5; dia++) {
  const data = getDataFormatada(dia)
  const numAgendamentos = Math.floor(Math.random() * 15) + 10 // 10-25 agendamentos por dia

  for (let i = 0; i < numAgendamentos; i++) {
    const hora = `${String(7 + Math.floor(Math.random() * 10)).padStart(2, '0')}:${Math.random() > 0.5 ? '00' : '30'}`
    const regiao = regioes[Math.floor(Math.random() * regioes.length)]
    const ubs = ubsPorRegiao[regiao][Math.floor(Math.random() * ubsPorRegiao[regiao].length)]
    const tipo = Math.random() > 0.4 ? 'Consulta' : 'Exame'
    const especialidade = especialidades[tipo][Math.floor(Math.random() * especialidades[tipo].length)]

    // Determinar status baseado na data
    let status, confirmado, avisado
    if (dia < 0) {
      // Passado
      const rand = Math.random()
      if (rand > 0.7) status = 'Presente'
      else if (rand > 0.5) status = 'Faltou'
      else status = 'Cancelado'
      confirmado = status !== 'Faltou'
      avisado = true
    } else if (dia === 0) {
      // Hoje
      const rand = Math.random()
      if (rand > 0.6) {
        status = 'Pendente'
        confirmado = true
        avisado = true
      } else {
        status = 'Pendente'
        confirmado = false
        avisado = Math.random() > 0.3
      }
    } else {
      // Futuro
      status = 'Pendente'
      confirmado = Math.random() > 0.4
      avisado = Math.random() > 0.3
    }

    const paciente = nomesPacientes[Math.floor(Math.random() * nomesPacientes.length)]
    const canalAviso = canaisAviso[Math.floor(Math.random() * canaisAviso.length)]
    const obs = observacoes[Math.floor(Math.random() * observacoes.length)]

    novosDados.push({
      id: idInicial++,
      data: data,
      hora: hora,
      regiao: regiao,
      ubs: ubs,
      tipo: tipo,
      paciente: paciente,
      cpf: gerarCPF(),
      telefone: gerarTelefone(),
      cartao_sus: gerarCartaoSUS(),
      especialidade: especialidade,
      contato: gerarTelefone(),
      canal_aviso: canalAviso,
      avisado: avisado,
      confirmado: confirmado,
      status: status,
      observacoes: obs,
      data_criacao: getDataFormatada(dia - Math.floor(Math.random() * 10) - 5),
      data_confirmacao: confirmado ? getDataFormatada(dia - Math.floor(Math.random() * 3) - 1) : null,
      data_cancelamento: status === 'Cancelado' ? getDataFormatada(dia - 1) : null,
      tempo_reagendamento_dias: null,
      notificacoes: avisado ? [
        {
          tipo: 'D-3',
          data: getDataFormatada(dia - 3),
          hora: '10:00',
          canal: canalAviso,
          enviado: true,
          respondido: confirmado
        },
        {
          tipo: 'D-1',
          data: getDataFormatada(dia - 1),
          hora: '14:00',
          canal: canalAviso,
          enviado: true,
          respondido: confirmado
        }
      ] : [],
      origem: 'Agendamento direto',
      substituiu_agendamento_id: null,
      motivo_cancelamento: status === 'Cancelado' ? 'Solicitação do paciente' : null
    })
  }
}

// Combinar dados antigos com novos
const dadosCombinados = [...mockData, ...novosDados]

// Salvar
fs.writeFileSync('./src/data/mockData.json', JSON.stringify(dadosCombinados, null, 2))

console.log(`✅ Gerados ${novosDados.length} novos agendamentos enriquecidos!`)
console.log(`📊 Total de agendamentos no sistema: ${dadosCombinados.length}`)
console.log('\nResumo por UBS:')
const ubsCount = {}
novosDados.forEach(d => {
  ubsCount[d.ubs] = (ubsCount[d.ubs] || 0) + 1
})
Object.entries(ubsCount).sort((a, b) => b[1] - a[1]).forEach(([ubs, count]) => {
  console.log(`  ${ubs}: ${count} agendamentos`)
})
