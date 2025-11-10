# Conecta Saúde - Dashboard MVP

Dashboard web em React + Tailwind CSS (Vite) para gerenciamento de agendamentos de saúde.

## Tecnologias

- React 18 — Biblioteca JavaScript para interfaces
- Vite — Build tool e dev server
- Tailwind CSS — Framework CSS utilitário
- Recharts — Biblioteca de gráficos para React

## Instalação

```bash
npm install
```

## Executar

```bash
npm run dev
```

O projeto estará disponível em `http://localhost:3001`.

## Funcionalidades

### Dashboard
- KPIs em cards: Agendados, Confirmados, Presenças, Faltas, Cancelados
- Gráfico de pizza: distribuição semanal
- Gráfico de linha: progressão diária (semana/período)
- Filtros: Região, UBS, Tipo, Data, Canal de Aviso, Status
- Modos de visualização: Hoje, Semana Atual, Semana Passada, Período Personalizado

### Agendamentos
- Tabela ordenada: hoje e próximos dias
- Filtros (Região, UBS, Tipo, Data, Canal de aviso, Status)
- Busca por nome do paciente
- Exportar CSV da tabela filtrada
- Resetar filtros

## Estrutura do Projeto

```
conecta-saude/
  .github/
    workflows/           # GitHub Actions
    ISSUE_TEMPLATE/      # Templates de issues
    dependabot.yml       # Atualizações automáticas
  src/
    components/
      KPICard.jsx        # Componente de card de KPI
    data/
      mockData.json      # Dados mockados
    pages/
      Dashboard.jsx      # Página do dashboard
      Agendamentos.jsx   # Página de agendamentos
      Relatorios.jsx     # Página de relatórios
    utils/
      dataAggregation.js # Funções de agregação
      dateUtils.js       # Utilitários de data
      kpiCalculations.js # Cálculos de KPIs
    App.jsx              # Componente principal com rotas
    main.jsx             # Entry point
    index.css            # Estilos globais
  index.html
  package.json
  vite.config.js
  tailwind.config.js
  postcss.config.js
```

## Próximos Passos (API real)

1. Substituir import do `mockData.json` por chamadas de API
2. Criar serviço de API (ex: `src/services/api.js`)
3. Buscar dados via hooks (`useEffect`) e tratar loading/erros
4. Adicionar cache e revalidação

## Notas

- KPIs calculados em tempo real a partir do mockdata
- "Hoje" baseado na data local do navegador
- CSV exportado inclui BOM para compatibilidade com Excel
- Timezone: America/Sao_Paulo (UTC-3)

## Contribuindo

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## Licença

Este projeto está sob a licença MIT.
