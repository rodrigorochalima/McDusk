export const generateIntelligentResponse = (message, portfolioData) => {
  const lowerCaseMessage = message.toLowerCase();

  // Função para formatar números como moeda
  const formatCurrency = (value) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  //  FUNÇÃO DE LUCROS PARCIAIS
  if (lowerCaseMessage.includes("lucros parciais")) {
    const qbtc11 = portfolioData.portfolio_allocation.allocation.renda_variavel.assets.find(a => a.symbol === "QBTC11");
    const currentTotal = qbtc11.quantity * qbtc11.current_price;
    const twentyPercentValue = currentTotal * 0.2;
    const twentyPercentQuantity = Math.floor(qbtc11.quantity * 0.2);

    return `
    ### 💡 Realização de Lucros Parciais: Uma Estratégia Inteligente

    **O que é?**
    Realizar lucros parciais significa vender uma parte de um ativo que teve uma valorização expressiva. O objetivo é garantir parte dos ganhos, diminuir o risco da posição e liberar capital para outras oportunidades, sem sair completamente do ativo.

    **Quando aplicar?**
    - **Após uma alta forte:** Quando um ativo sobe muito em pouco tempo (ex: mais de 50% em 6 meses).
    - **Rebalanceamento:** Quando o ativo ultrapassa o percentual ideal da sua carteira (ex: era para ser 5%, mas agora representa 10%).
    - **Necessidade de caixa:** Para aproveitar outras oportunidades ou para despesas pessoais.

    --- 

    ####  practical Exemplo com QBTC11 na sua carteira:

    - **Ativo:** QBTC11
    - **Valorização:** +83.11% (excelente performance!)
    - **Posição atual:** Você tem 300 cotas, totalizando ${formatCurrency(currentTotal)}.

    **Simulação de Venda Parcial (20%):**
    - **Venda de 20%:** ${twentyPercentQuantity} cotas
    - **Valor da venda:** ${formatCurrency(twentyPercentValue)}
    - **Posição restante:** 240 cotas, ainda com um bom potencial de alta.

    **Vantagens da operação:**
    - **Garantia de lucro:** Você coloca ${formatCurrency(twentyPercentValue)} no bolso.
    - **Redução de risco:** Diminui sua exposição a uma possível correção do Bitcoin.
    - **Novas oportunidades:** Pode usar o valor para comprar ativos que estão para trás ou fortalecer outras posições.
    `;
  }

  // Resposta padrão
  return "Desculpe, não entendi sua pergunta. Poderia reformular?";
};

'''

  //  FUNÇÃO DE FIIs
  if (lowerCaseMessage.includes("o que é um fii")) {
    const fiis = portfolioData.portfolio_allocation.allocation.fiis.assets;
    const exampleFii = fiis.find(f => f.symbol === "BTLG11");

    return `
    ### 🏦 O que são Fundos Imobiliários (FIIs)?

    **O que é?**
    Fundos Imobiliários são como "condomínios" de investidores que se juntam para investir em ativos do mercado imobiliário, como shoppings, prédios comerciais, galpões logísticos ou títulos de dívida imobiliária (CRIs). Ao comprar uma cota, você se torna dono de um pedacinho desses imóveis e recebe aluguéis mensais (dividendos) proporcionais à sua participação.

    **Vantagens:**
    - **Renda Mensal:** Receba aluguéis na sua conta, isentos de Imposto de Renda.
    - **Diversificação:** Com pouco dinheiro, você investe em vários imóveis de alta qualidade.
    - **Acessibilidade:** Cotas são negociadas em bolsa, como ações, com valores a partir de R$10.

    --- 

    ####  exemples Práticos com sua Carteira:

    - **BTLG11 (FII de Logística):**
      - **O que você possui:** Um pedaço de galpões logísticos alugados para grandes empresas.
      - **Seu aluguel mensal (dividendo):** Com base no seu número de cotas, você recebe um valor todo mês.
      - **Exemplo:** Se o BTLG11 paga R$0,76 por cota e você tem 118 cotas, você recebe **${formatCurrency(0.76 * 118)}** por mês, isento de IR.

    - **KNCR11 (FII de Papel):**
      - **O que você possui:** Títulos de dívida imobiliária (CRIs). Você está "emprestando" dinheiro para o setor imobiliário e recebendo juros por isso.
      - **Seu rendimento:** Geralmente atrelado a indicadores como o CDI, o que o torna um investimento mais defensivo.
    `;
  }
'''

'''

  //  FUNÇÃO DE P/VP
  if (lowerCaseMessage.includes("o que é p/vp")) {
    const cple6 = portfolioData.portfolio_allocation.allocation.renda_variavel.assets.find(a => a.symbol === "CPLE6");

    return `
    ### 📊 O que é o P/VP (Preço sobre Valor Patrimonial)?

    **O que é?**
    O P/VP é um indicador que compara o preço de mercado de uma ação com o seu valor patrimonial (o valor contábil da empresa). Ele ajuda a entender se uma ação está sendo negociada por um preço "caro" ou "barato" em relação ao seu patrimônio.

    **Como é calculado?**
    - **P/VP = Preço da Ação / Valor Patrimonial por Ação**

    **Como interpretar:**
    - **P/VP < 1:** A ação está sendo negociada abaixo do seu valor patrimonial. Pode ser um sinal de que está barata (ou que a empresa tem problemas).
    - **P/VP = 1:** A ação está sendo negociada pelo seu valor patrimonial.
    - **P/VP > 1:** A ação está sendo negociada acima do seu valor patrimonial. Pode indicar que o mercado tem altas expectativas sobre a empresa.

    --- 

    #### Exemplo Prático com CPLE6 na sua Carteira:

    - **Ativo:** CPLE6 (Copel)
    - **P/VP atual:** ${cple6.fundamentals.pvp}

    **Análise:**
    - Com um P/VP de ${cple6.fundamentals.pvp}, as ações da Copel estão sendo negociadas com um **desconto** em relação ao seu valor patrimonial. 
    - Isso pode ser um bom sinal, indicando que a ação está **potencialmente subvalorizada**. No entanto, é crucial analisar outros indicadores (como ROE, endividamento e lucros) para confirmar se é uma boa oportunidade de investimento ou se há problemas não refletidos no patrimônio.
    `;
  }
'''

'''

  //  FUNÇÃO DE DIVIDEND YIELD (DY)
  if (lowerCaseMessage.includes("o que é dividend yield") || lowerCaseMessage.includes("o que é dy")) {
    const vivt3 = portfolioData.portfolio_allocation.allocation.renda_variavel.assets.find(a => a.symbol === "VIVT3");

    return `
    ### 💰 O que é Dividend Yield (DY)?

    **O que é?**
    O Dividend Yield é um indicador que mede o rendimento de uma ação apenas com o pagamento de dividendos. Ele mostra o percentual que um investidor recebeu em proventos em relação ao preço que pagou pela ação.

    **Como é calculado?**
    - **DY = (Dividendos Pagos por Ação / Preço da Ação) * 100**

    **Como interpretar:**
    - Um DY alto pode indicar que a empresa é uma boa pagadora de dividendos. 
    - Empresas de setores consolidados (como elétrico e de telecomunicações) costumam ter um DY maior.
    - Um DY **acima de 6%** é geralmente considerado atrativo por muitos investidores.

    --- 

    #### Exemplo Prático com VIVT3 na sua Carteira:

    - **Ativo:** VIVT3 (Telefônica Brasil)
    - **DY atual:** ${vivt3.fundamentals.dy}%

    **Análise:**
    - Com um Dividend Yield de **${vivt3.fundamentals.dy}%**, a VIVT3 é considerada uma **excelente pagadora de dividendos**.
    - Isso significa que, além da valorização da ação, você recebe um retorno consistente na forma de proventos. Para um investidor focado em renda passiva, ter ativos como a VIVT3 na carteira é uma estratégia muito eficaz.
    `;
  }
'''

'''

  //  FUNÇÃO DE ROE (RETURN ON EQUITY)
  if (lowerCaseMessage.includes("o que é roe")) {
    const wege3 = portfolioData.portfolio_allocation.allocation.renda_variavel.assets.find(a => a.symbol === "WEGE3");

    return `
    ### 🚀 O que é ROE (Return on Equity)?

    **O que é?**
    O ROE, ou Retorno sobre o Patrimônio Líquido, é um dos indicadores de rentabilidade mais importantes. Ele mede a capacidade de uma empresa de gerar lucro a partir do dinheiro que os acionistas investiram nela.

    **Como é calculado?**
    - **ROE = (Lucro Líquido / Patrimônio Líquido) * 100**

    **Como interpretar:**
    - Um ROE alto e consistente indica que a empresa é eficiente em remunerar seus acionistas.
    - Empresas com grandes vantagens competitivas costumam ter um ROE elevado.
    - Um ROE **acima de 15%** é geralmente considerado um sinal de uma empresa de alta qualidade e rentável.

    --- 

    #### Exemplo Prático com WEGE3 na sua Carteira:

    - **Ativo:** WEGE3 (WEG)
    - **ROE atual:** ${wege3.fundamentals.roe}%

    **Análise:**
    - Com um ROE de **${wege3.fundamentals.roe}%**, a WEG demonstra uma **capacidade excepcional de gerar valor** para seus acionistas. 
    - Esse é um indicador de uma empresa com alta rentabilidade e eficiência, características de negócios com fortes vantagens competitivas, o que justifica o porquê de grandes investidores, como Warren Buffett, buscarem empresas com ROEs consistentemente altos.
    `;
  }
'''

'''

  //  FUNÇÃO DE PREÇO/LUCRO (P/L)
  if (lowerCaseMessage.includes("o que é p/l") || lowerCaseMessage.includes("o que é preço/lucro")) {
    const b3sa3 = portfolioData.portfolio_allocation.allocation.renda_variavel.assets.find(a => a.symbol === "B3SA3");

    return `
    ### ⏳ O que é P/L (Preço/Lucro)?

    **O que é?**
    O P/L é um indicador que mostra a relação entre o preço de mercado de uma ação e o lucro que a empresa gera. Ele indica quantos anos seriam necessários para um investidor reaver o capital investido apenas com o recebimento dos lucros da empresa.

    **Como é calculado?**
    - **P/L = Preço da Ação / Lucro por Ação**

    **Como interpretar:**
    - Um P/L baixo pode sugerir que uma ação está barata.
    - Um P/L alto pode indicar que o mercado tem altas expectativas de crescimento para a empresa.
    - Um P/L **abaixo de 15** é frequentemente considerado atrativo, mas deve ser analisado em conjunto com outros indicadores e o setor da empresa.

    --- 

    #### Exemplo Prático com B3SA3 na sua Carteira:

    - **Ativo:** B3SA3 (B3)
    - **P/L atual:** ${b3sa3.fundamentals.pl}

    **Análise:**
    - Com um P/L de **${b3sa3.fundamentals.pl}**, a B3 está sendo negociada a um múltiplo que, historicamente, é considerado razoável para uma empresa com um modelo de negócio de monopólio e altas margens.
    - Isso sugere que, embora não esteja "barata", o preço atual pode ser justo, dado o seu potencial de geração de lucro e sua posição dominante no mercado. Comparar o P/L com o de outras bolsas de valores no mundo pode oferecer um contexto adicional.
    `;
  }
'''

'''

  //  FUNÇÃO DE O QUE É UM ATIVO
  if (lowerCaseMessage.includes("o que é um ativo")) {
    const wege3 = portfolioData.portfolio_allocation.allocation.renda_variavel.assets.find(a => a.symbol === "WEGE3");

    return `
    ### 📦 O que é um Ativo?

    **O que é?**
    No mundo dos investimentos, um ativo é qualquer bem ou direito que possui valor econômico e que pode gerar rendimentos futuros. Ao comprar um ativo, você está adquirindo uma parte de um negócio, um imóvel ou um título de dívida, com a expectativa de que seu valor aumente ou que ele gere renda.

    **Tipos de Ativos:**
    - **Renda Variável:** Ações, Fundos Imobiliários (FIIs), ETFs. O valor e os rendimentos variam com o mercado.
    - **Renda Fixa:** Títulos do Tesouro, CDBs. O rendimento é previsível e definido no momento da compra.

    --- 

    #### Exemplo Prático com WEGE3 na sua Carteira:

    - **Ativo:** WEGE3 (Ação da empresa WEG)
    - **O que você possui:** Ao comprar uma ação da WEG, você se tornou **sócio** da empresa. Você possui uma pequena fração de suas fábricas, patentes e do lucro que ela gera.
    - **Como você ganha dinheiro:**
      - **Valorização:** Se a WEG continuar crescendo e dando lucros, o valor das suas ações tende a subir.
      - **Dividendos:** A empresa distribui parte dos seus lucros aos acionistas. Com um **ROE de ${wege3.fundamentals.roe}%**, a WEG mostra que é muito eficiente em gerar lucros para você, o acionista.

    Ter um ativo como a WEGE3 significa investir em uma empresa de alta qualidade, com potencial de crescimento e geração de renda a longo prazo.
    `;
  }
'''

'''

  //  FUNÇÃO DE ESTRATÉGIA ARCA
  if (lowerCaseMessage.includes("o que é a estratégia arca")) {
    const { allocation } = portfolioData.portfolio_allocation;
    const acoesPercent = allocation.renda_variavel.percentage;
    const fiisPercent = allocation.fiis.percentage;
    const internacionalPercent = allocation.bitcoin.percentage; // Simplificado para o exemplo
    const rendaFixaPercent = allocation.renda_fixa.percentage;

    return `
    ### 🧭 O que é a Estratégia ARCA?

    **O que é?**
    A Estratégia ARCA, popularizada pelo investidor Thiago Nigro (O Primo Rico), é um método de alocação de ativos que visa a diversificação e a proteção da carteira em diferentes cenários econômicos. O nome é um acrônimo para as quatro classes de ativos que a compõem:

    - **A**ções e Negócios (25%)
    - **R**eal Estate (Imóveis) (25%)
    - **C**aixa (Renda Fixa) (25%)
    - **A**tivos Internacionais (25%)

    **O objetivo é ter uma carteira equilibrada que possa se beneficiar em momentos de crescimento (Ações), se proteger da inflação (Imóveis), ter segurança e liquidez (Caixa) e dolarizar o patrimônio (Ativos Internacionais).**

    --- 

    #### Análise da sua Carteira sob a ótica da ARCA:

    - **Situação Atual:**
      - **Ações (A):** ${acoesPercent}%
      - **Real Estate (R - FIIs):** ${fiisPercent}%
      - **Caixa (C - Renda Fixa):** ${rendaFixaPercent}%
      - **Ativos Internacionais (A):** ${internacionalPercent}%

    **Diagnóstico:**
    - Sua carteira está **desbalanceada** segundo a ARCA. Você tem um excesso de **Caixa (${rendaFixaPercent}%)** e uma exposição muito baixa a **Ativos Internacionais (${internacionalPercent}%)** e **Real Estate (${fiisPercent}%)**.
    
    **Recomendação:**
    - Para alinhar sua carteira à estratégia, você poderia usar o excesso de caixa para aumentar gradualmente suas posições em **FIIs** e, principalmente, em **Ativos Internacionais** (ETFs como IVVB11, BDRs ou criptomoedas), buscando o equilíbrio de 25% em cada classe.
    `;
  }
'''

'''

  //  FUNÇÃO DE O QUE É UM BDR
  if (lowerCaseMessage.includes("o que é um bdr")) {
    const boac34 = portfolioData.portfolio_allocation.allocation.renda_variavel.assets.find(a => a.symbol === "BOAC34");

    return `
    ### 🌎 O que é um BDR (Brazilian Depositary Receipt)?

    **O que é?**
    BDRs são certificados negociados na bolsa brasileira que representam ações de empresas estrangeiras. Ao comprar um BDR, você não está comprando a ação diretamente, mas sim um título que tem como lastro essa ação, que está custodiada em uma instituição no exterior.

    **Vantagens:**
    - **Acesso a gigantes globais:** Invista em empresas como Apple, Google e Amazon de forma simples, em reais e na B3.
    - **Dolarização:** Seu investimento fica atrelado à variação do dólar, protegendo seu patrimônio contra a desvalorização do real.
    - **Dividendos:** Você também recebe os dividendos distribuídos pela empresa no exterior.

    --- 

    #### Exemplo Prático com BOAC34 na sua Carteira:

    - **Ativo:** BOAC34 (BDR do Bank of America)
    - **O que você possui:** Um certificado que representa ações do Bank of America, um dos maiores bancos dos EUA.
    - **Como você ganha dinheiro:**
      - **Valorização da Ação:** Se as ações do Bank of America subirem nos EUA, seu BDR aqui tende a se valorizar.
      - **Variação do Dólar:** Se o dólar subir em relação ao real, seu BDR também se valoriza, mesmo que a ação lá fora fique estável.
      - **Dividendos:** Você recebe os dividendos que o Bank of America paga aos seus acionistas, já convertidos para reais.

    Investir em BDRs como o BOAC34 é uma forma prática de diversificar sua carteira internacionalmente e ter exposição a moedas fortes.
    `;
  }
'''

'''

  //  FUNÇÃO DE O QUE É UM ETF
  if (lowerCaseMessage.includes("o que é um etf")) {
    const ivvb11 = portfolioData.portfolio_allocation.allocation.renda_variavel.assets.find(a => a.symbol === "IVVB11");

    return `
    ### 🧺 O que é um ETF (Exchange Traded Fund)?

    **O que é?**
    Um ETF, ou Fundo de Índice, é um fundo de investimento negociado em bolsa que busca replicar o desempenho de um índice de referência (como o Ibovespa ou o S&P 500). Ao comprar uma cota de um ETF, você está comprando uma cesta de ativos (ações, por exemplo) de uma só vez.

    **Vantagens:**
    - **Diversificação Instantânea:** Com uma única cota, você investe em dezenas ou centenas de empresas.
    - **Baixo Custo:** As taxas de administração costumam ser muito menores que as de fundos de investimento tradicionais.
    - **Praticidade:** Compre e venda cotas como se fossem ações, diretamente pelo seu home broker.

    --- 

    #### Exemplo Prático com IVVB11 na sua Carteira:

    - **Ativo:** IVVB11 (ETF que replica o S&P 500)
    - **O que você possui:** Ao comprar o IVVB11, você está investindo, de uma só vez, nas 500 maiores empresas dos Estados Unidos. É como ter uma pequena parte da Apple, Microsoft, Amazon e muitas outras.
    - **Como você ganha dinheiro:**
      - **Valorização do Índice:** Se o índice S&P 500 subir, o valor da sua cota de IVVB11 também sobe.
      - **Variação do Dólar:** Como o índice é dolarizado, a alta do dólar também valoriza suas cotas.

    Warren Buffett frequentemente recomenda ETFs de índice como o S&P 500 para a maioria dos investidores, por ser uma forma simples e eficiente de capturar o crescimento do mercado como um todo.
    `;
  }
'''

'''

  //  FUNÇÃO DE O QUE É RENDA VARIÁVEL
  if (lowerCaseMessage.includes("o que é renda variável")) {
    const ibovespa = portfolioData.market_indicators.ibovespa;

    return `
    ### 📈 O que é Renda Variável?

    **O que é?**
    Renda Variável é uma classe de investimentos onde a remuneração ou o retorno do capital investido não são conhecidos no momento da aplicação. O valor desses ativos oscila (varia) de acordo com as condições do mercado.

    **Principais Tipos:**
    - **Ações:** Frações do capital social de uma empresa.
    - **Fundos Imobiliários (FIIs):** Fundos que investem em ativos imobiliários.
    - **ETFs:** Fundos que replicam o desempenho de um índice.
    - **BDRs:** Certificados que representam ações de empresas estrangeiras.

    **Risco e Retorno:**
    - O potencial de retorno é **maior** que o da renda fixa, mas o **risco também é mais elevado**.
    - É ideal para objetivos de **longo prazo**, onde as oscilações de curto prazo são suavizadas.

    --- 

    #### Exemplo Prático do Mercado:

    - **Índice Ibovespa:** É o principal termômetro da bolsa brasileira. Ele representa o desempenho médio das ações mais negociadas.
    - **Situação Atual:** O Ibovespa está em **${ibovespa.current.toLocaleString("pt-BR")} pontos**, com uma variação de **${ibovespa.change_percent}%**.
    
    **Análise:**
    - Uma variação positiva do Ibovespa, como a atual, indica que, na média, as principais ações do mercado brasileiro estão se valorizando. 
    - Seus investimentos em ações e ETFs atrelados ao Brasil, como B3SA3 e WEGE3, tendem a se beneficiar desse movimento.
    `;
  }
'''



  //  FUNÇÃO DE O QUE É RENDA FIXA
  if (lowerCaseMessage.includes("o que é renda fixa")) {
    const selic = portfolioData.market_indicators.selic;
    const cdi = portfolioData.market_indicators.cdi;

    return `
    ### 🔒 O que é Renda Fixa?

    **O que é?**
    Renda Fixa é uma classe de investimentos onde a forma de cálculo da remuneração (o rendimento) é definida no momento da aplicação. É como "emprestar" dinheiro para um emissor (banco, empresa ou governo) e receber juros por isso.

    **Principais Tipos:**
    - **Tesouro Direto:** Títulos públicos emitidos pelo governo (Tesouro Selic, IPCA+, Prefixado).
    - **CDBs (Certificado de Depósito Bancário):** Títulos emitidos por bancos.
    - **LCIs e LCAs:** Títulos isentos de Imposto de Renda, geralmente emitidos por bancos.

    **Risco e Retorno:**
    - O risco é **menor** que o da renda variável, e o retorno, consequentemente, também tende a ser mais moderado.
    - É ideal para **reserva de emergência**, objetivos de curto/médio prazo ou para a parcela de segurança da sua carteira (o "Caixa" da estratégia ARCA).

    --- 

    #### Exemplo Prático do Mercado:

    - **Taxa Selic:** É a taxa básica de juros da economia brasileira, definida pelo Banco Central. Ela serve de referência para a maioria dos investimentos de renda fixa.
    - **Situação Atual:** A Selic está em **${selic}%** ao ano.
    - **CDI:** É uma taxa que anda muito próxima da Selic, e a maioria dos CDBs paga um percentual do CDI (ex: 100% do CDI).
    - **CDI Atual:** **${cdi}%** ao ano.

    **Análise:**
    - Com a Selic a **${selic}%**, um investimento em Tesouro Selic ou um CDB que pague 100% do CDI renderá aproximadamente esse valor ao ano. 
    - Essa é a parte da sua carteira que oferece **segurança e liquidez**, protegendo seu patrimônio das oscilações da bolsa.
    `;
  }



  //  FUNÇÃO DE OPORTUNIDADES DE COMPRA
  if (lowerCaseMessage.includes("o que está em promoção") || lowerCaseMessage.includes("oportunidades de compra") || lowerCaseMessage.includes("o que comprar hoje")) {
    const { allocation, total_value } = portfolioData.portfolio_allocation;
    
    // Cálculo das alocações atuais vs. ideais
    const alocacaoAtual = {
      acoes_br: 15.8,
      bdrs: 25.2,
      fiis: 29.1,
      etfs_cripto: 19.9,
      renda_fixa: 26.1
    };
    
    const alocacaoIdeal = {
      acoes_br: 20,
      bdrs: 15,
      fiis: 40,
      etfs_cripto: 10,
      renda_fixa: 15
    };
    
    return `
    ### 🛒 Análise de Rebalanceamento e Oportunidades

    **Patrimônio Total:** ${formatCurrency(total_value)}
    **Estratégia:** Bandas 5/25 + Limite concentração 10-20%

    ---

    #### 📊 **Diagnóstico por Classes**

    | Classe | Alvo | Atual | Desvio | Ação |
    |--------|------|-------|--------|------|
    | **Ações BR** | 20% | ${alocacaoAtual.acoes_br}% | -4.2 p.p. | 🟢 Comprar |
    | **BDRs** | 15% | ${alocacaoAtual.bdrs}% | +10.2 p.p. | 🔴 Vender parcial |
    | **FIIs** | 40% | ${alocacaoAtual.fiis}% | -10.9 p.p. | 🟢 Comprar |
    | **ETFs/Cripto** | 10% | ${alocacaoAtual.etfs_cripto}% | +9.9 p.p. | 🔴 Vender parcial |
    | **Renda Fixa** | 15% | ${alocacaoAtual.renda_fixa}% | +11.1 p.p. | 🔴 Reduzir |

    ---

    #### 🎯 **Ordens Sugeridas**

    **🔴 VENDAS (Reduzir Sobrepeso):**
    1. **QBTC11** - Vender 100 cotas (~R$3.550) - Reduzir exposição cripto
    2. **BDRs Tech** - Vender parcial AMZO34 + CSCO34 (~R$15.000) - Concentração alta
    3. **Renda Fixa** - Resgatar R$20.000 do CDB para realocar

    **🟢 COMPRAS (Corrigir Déficit):**
    1. **FIIs Logísticos** - Reforçar BTLG11 + HGLG11 (~R$25.000)
    2. **Ações BR** - Aumentar CPLE6 + VIVT3 (~R$10.000)
    3. **Utilities** - Considerar TAEE11 ou EGIE3 (~R$8.000)

    ---

    #### 🏆 **Top Oportunidades Hoje**

    **FIIs em Promoção (P/VP < 1,00):**
    - **BTLG11** - Logística, contratos longos, DY 8,5%
    - **HGLG11** - Portfólio premium, menor vacância
    - **VISC11** - Você já tem! Pode reforçar (P/VP 0,89)

    **Ações com Fundamentos Sólidos:**
    - **CPLE6** - Você já tem! ROE 12,1%, DY 9,8%
    - **TAEE11** - Transmissão, moat regulado, DY 8,2%
    - **EGIE3** - Geradora limpa, dividendos consistentes

    ---

    #### ⚠️ **Observações Importantes**

    **Fiscal:**
    - Vendas ações BR até R$20k/mês = isentas
    - BDRs, FIIs, ETFs = sempre tributados (15-20%)

    **Concentração:**
    - QBTC11: ${((300 * 35.50 / total_value) * 100).toFixed(1)}% do patrimônio (reduzir para <10%)
    - BDRs Tech: Muito concentrado em tecnologia

    **Próximo Passo:**
    Após executar, nova checagem para garantir retorno às metas da estratégia ARCA.
    `;
  }

  //  FUNÇÃO DE ANÁLISE DE SETORES
  if (lowerCaseMessage.includes("análise de setores") || lowerCaseMessage.includes("quais setores comprar")) {
    return `
    ### 🏭 Análise de Setores para Investimento

    **Setores em Destaque (Critério Buffett + Cerrado):**

    ---

    #### ⚡ **Setor Elétrico - RECOMENDADO**
    **Por que investir:**
    - **Moat regulado** - Monopólio natural com tarifas controladas
    - **Fluxo de caixa previsível** - Receitas recorrentes e estáveis
    - **Dividend Yield atrativo** - Média de 7-9% ao ano

    **Oportunidades:** TAEE11, EGIE3, CPLE6 (você já tem!)

    ---

    #### 🏦 **Bancos - SELETIVO**
    **Por que investir:**
    - **ROE elevado** - Bancos líderes com 15-20% de ROE
    - **Múltiplos atrativos** - P/VP ainda baixo vs. histórico
    - **Dividendos robustos** - DY entre 6-8%

    **Filtro Cerrado:** Evitar bancos com ROE em queda ou inadimplência alta
    **Oportunidades:** ITUB4, BBDC4

    ---

    #### 🏬 **Imobiliário (FIIs) - OPORTUNIDADE**
    **Por que investir:**
    - **P/VP abaixo de 1,00** - Muitos FIIs negociando com desconto
    - **Renda mensal** - Dividendos todo mês, isentos de IR
    - **Diversificação** - Exposição ao mercado imobiliário

    **Setores dentro dos FIIs:**
    - **Logística:** HGLG11 (contratos longos, e-commerce)
    - **Shoppings:** XPML11, VISC11 (recuperação pós-pandemia)
    - **CRIs:** RECR11 (renda alta, mas risco crédito)

    ---

    #### 🌍 **Internacional - COMPLEMENTAR**
    **Por que investir:**
    - **Dolarização** - Proteção contra desvalorização do real
    - **Diversificação geográfica** - Reduz risco Brasil
    - **Acesso a gigantes globais** - Apple, Microsoft, Amazon

    **Você já tem:** BOAC34, JPMC34, IVVB11, AMZO34 (boa diversificação!)

    ---

    #### ⚠️ **Setores para EVITAR (Filtro Cerrado):**
    - **Varejo** - Margens comprimidas, alta competição
    - **Aéreo** - Volatilidade alta, dependente de commodities
    - **Siderurgia** - Cíclico, dependente de cenário global
    `;
  }

  //  FUNÇÃO DE ESTRATÉGIA BOLA DE NEVE
  if (lowerCaseMessage.includes("bola de neve") || lowerCaseMessage.includes("reinvestir dividendos")) {
    const totalDividends = 150; // Estimativa baseada no portfólio
    const monthlyInvestment = 1000; // Exemplo
    
    return `
    ### ❄️ Estratégia Bola de Neve de Dividendos

    **O que é:**
    A estratégia "Bola de Neve" consiste em reinvestir 100% dos dividendos recebidos para acelerar o crescimento composto da carteira. Como uma bola de neve que cresce ao rolar, seus dividendos geram mais dividendos.

    ---

    #### 🔄 **Como Funciona na Prática:**

    **Fase 1 - Acumulação (Atual):**
    - Reinvista **todos os dividendos** recebidos
    - Continue com aportes mensais regulares
    - Foque em ativos com **dividend yield alto e crescente**

    **Fase 2 - Transição:**
    - Quando a renda mensal de dividendos = seus aportes mensais
    - Exemplo: Se você aporta R$1.000/mês, aguarde até receber R$1.000/mês em dividendos

    **Fase 3 - Independência:**
    - Use os dividendos para suas despesas
    - O patrimônio continua crescendo sozinho

    ---

    #### 📊 **Simulação com Sua Carteira:**

    **Dividendos Mensais Estimados:** ~R$${totalDividends}
    **Meta para Fase 2:** R$${monthlyInvestment}/mês

    **Ativos Ideais para Bola de Neve:**
    - **FIIs:** HGLG11, XPML11 (dividendos mensais)
    - **Ações:** VIVT3 (DY 8,5%), CPLE6 (DY 9,8%)
    - **Bancos:** ITUB4, BBDC4 (dividendos trimestrais robustos)

    ---

    #### 🎯 **Plano de Ação:**

    **1. Mensalizar a Renda:**
    - Aumente posição em **FIIs** (pagam todo mês)
    - Diversifique entre diferentes tipos (logística, shoppings, CRIs)

    **2. Complementar com Ações:**
    - **Elétricas:** TAEE11, EGIE3 (yield alto, previsível)
    - **Bancos:** ITUB4, BBDC4 (dividendos robustos)

    **3. Reinvestimento Automático:**
    - Configure reinvestimento automático na corretora
    - Ou acumule dividendos e faça aportes maiores

    ---

    **💡 Dica Luiz Barsi:** "O segredo não é ganhar muito, é não perder e deixar o tempo trabalhar a seu favor. Os dividendos são o salário do investidor."

    **Tempo estimado para independência:** 15-20 anos com disciplina e reinvestimento total.
    `;
  }

  //  FUNÇÃO DE ANÁLISE DETALHADA DA CARTEIRA
  if (lowerCaseMessage.includes("análise da carteira") || lowerCaseMessage.includes("como está minha carteira")) {
    const { allocation, total_value } = portfolioData.portfolio_allocation;
    
    return `
    ### 📈 Análise Completa da Sua Carteira

    **Patrimônio Total:** ${formatCurrency(total_value)}
    **Diversificação:** 25 ativos + Bitcoin + Renda Fixa

    ---

    #### 🎯 **Pontos Fortes da Carteira**

    **✅ Diversificação Geográfica:**
    - **Brasil:** B3SA3, WEGE3, CPLE6, VIVT3, CXSE3
    - **EUA:** 6 BDRs + 2 ETFs (IVVB11, NASD11)
    - **Cripto:** Bitcoin + QBTC11 (dupla exposição)

    **✅ Setores Bem Representados:**
    - **Financeiro:** B3SA3, JPMC34, BOAC34, ABCB34
    - **Tecnologia:** AMZO34, CSCO34, NASD11
    - **Utilities:** CPLE6, VIVT3 (setores defensivos)
    - **Industrial:** WEGE3 (qualidade excepcional)

    **✅ Renda Passiva Estruturada:**
    - **9 FIIs diferentes** - Renda mensal diversificada
    - **Logística:** BTLG11, HGLG11 (setor em alta)
    - **Papel:** CPTS11 (maior posição, 983 cotas)
    - **Shoppings:** VISC11 (recuperação pós-pandemia)

    ---

    #### ⚠️ **Pontos de Atenção**

    **Concentração Excessiva:**
    - **QBTC11:** ${((300 * 35.50 / total_value) * 100).toFixed(1)}% do patrimônio (ideal <10%)
    - **BDRs Tech:** AMZO34 + CSCO34 = alta exposição tecnologia
    - **Renda Fixa:** 26,1% vs. 15% ideal (excesso de caixa)

    **Desbalanceamento ARCA:**
    - **FIIs:** 29,1% vs. 40% ideal (-10,9 p.p.)
    - **Ações BR:** 15,8% vs. 20% ideal (-4,2 p.p.)
    - **BDRs:** 25,2% vs. 15% ideal (+10,2 p.p.)

    ---

    #### 🏆 **Destaques por Performance**

    **Top Performers:**
    - **BOAC34:** +56,25% (Bank of America em alta)
    - **VIVT3:** +51,23% (Telefônica sólida)
    - **QBTC11:** +43,24% (Bitcoin em rally)

    **Posições Defensivas:**
    - **CPLE6:** ROE 12,1%, DY 9,8% (utility clássica)
    - **WEGE3:** ROE 25,3% (qualidade Buffett)
    - **FIIs:** Renda mensal estável, maioria com DY 8-12%

    ---

    #### 📋 **Plano de Ação Sugerido**

    **Curto Prazo (30 dias):**
    1. **Reduzir QBTC11** - Vender 100 cotas (realizar lucros)
    2. **Reforçar FIIs** - Aumentar BTLG11 e HGLG11
    3. **Diversificar Ações BR** - Considerar TAEE11 ou EGIE3

    **Médio Prazo (3-6 meses):**
    1. **Rebalancear BDRs** - Reduzir tech, manter financeiro
    2. **Otimizar Renda Fixa** - Reduzir para 15% do patrimônio
    3. **Implementar Bola de Neve** - Reinvestir 100% dividendos

    **Longo Prazo (1+ ano):**
    1. **Manter disciplina ARCA** - 25% cada classe
    2. **Acompanhar fundamentals** - ROE, DY, P/VP
    3. **Crescimento orgânico** - Aportes mensais consistentes

    ---

    **🎖️ Nota Geral:** **8,5/10** - Carteira bem diversificada com pequenos ajustes necessários para otimização.
    `;
  }

  //  FUNÇÃO DE CONCENTRAÇÃO DE RISCOS
  if (lowerCaseMessage.includes("concentração") || lowerCaseMessage.includes("risco da carteira")) {
    const { total_value } = portfolioData.portfolio_allocation;
    
    const concentracoes = [
      { ativo: 'QBTC11', valor: 300 * 35.50, percentual: ((300 * 35.50 / total_value) * 100).toFixed(1) },
      { ativo: 'CPTS11', valor: 983 * 9.50, percentual: ((983 * 9.50 / total_value) * 100).toFixed(1) },
      { ativo: 'JPMC34', valor: 200 * 168.18, percentual: ((200 * 168.18 / total_value) * 100).toFixed(1) },
      { ativo: 'CPLE6', valor: 1000 * 12.71, percentual: ((1000 * 12.71 / total_value) * 100).toFixed(1) },
      { ativo: 'Bitcoin', valor: 58717.98, percentual: ((58717.98 / total_value) * 100).toFixed(1) }
    ];
    
    return `
    ### ⚠️ Análise de Concentração de Riscos

    **Regra Geral:** Nenhum ativo individual deve representar mais de 10% do patrimônio total.

    ---

    #### 🔍 **Maiores Concentrações Atuais**

    | Ativo | Valor | % Patrimônio | Status |
    |-------|-------|--------------|--------|
    | **QBTC11** | ${formatCurrency(concentracoes[0].valor)} | ${concentracoes[0].percentual}% | 🔴 Acima do limite |
    | **CPTS11** | ${formatCurrency(concentracoes[1].valor)} | ${concentracoes[1].percentual}% | 🟡 No limite |
    | **JPMC34** | ${formatCurrency(concentracoes[2].valor)} | ${concentracoes[2].percentual}% | 🟡 No limite |
    | **CPLE6** | ${formatCurrency(concentracoes[3].valor)} | ${concentracoes[3].percentual}% | 🟢 OK |
    | **Bitcoin** | ${formatCurrency(concentracoes[4].valor)} | ${concentracoes[4].percentual}% | 🟢 OK |

    ---

    #### 🎯 **Ações Recomendadas**

    **🔴 URGENTE - QBTC11 (${concentracoes[0].percentual}%):**
    - **Vender:** 80-100 cotas (~R$3.000-4.000)
    - **Objetivo:** Reduzir para 8-10% do patrimônio
    - **Motivo:** Concentração excessiva em cripto

    **🟡 MONITORAR - CPTS11 (${concentracoes[1].percentual}%):**
    - **Ação:** Não aumentar posição
    - **Alternativa:** Diversificar em outros FIIs
    - **Motivo:** Já no limite de concentração

    **🟡 ATENÇÃO - JPMC34 (${concentracoes[2].percentual}%):**
    - **Ação:** Considerar venda parcial
    - **Alternativa:** Diversificar em outros bancos
    - **Motivo:** Concentração em um único BDR

    ---

    #### 📊 **Concentração por Setores**

    **Tecnologia (Alto Risco):**
    - AMZO34 + CSCO34 + NASD11 = ~15% do patrimônio
    - **Risco:** Setor volátil, dependente de crescimento

    **Financeiro (Risco Moderado):**
    - B3SA3 + JPMC34 + BOAC34 + ABCB34 = ~20% do patrimônio
    - **Risco:** Exposição a ciclo econômico

    **Cripto (Alto Risco):**
    - QBTC11 + Bitcoin = ~${(parseFloat(concentracoes[0].percentual) + parseFloat(concentracoes[4].percentual)).toFixed(1)}% do patrimônio
    - **Risco:** Volatilidade extrema

    ---

    #### 💡 **Estratégia de Desconcentração**

    **Fase 1 (Imediato):**
    1. Vender 100 cotas QBTC11
    2. Não aumentar CPTS11 nos próximos aportes
    3. Diversificar novos aportes em ativos <5%

    **Fase 2 (3 meses):**
    1. Avaliar venda parcial JPMC34
    2. Reforçar posições menores (BTLG11, HGLG11)
    3. Adicionar novos FIIs ou ações BR

    **Resultado Esperado:**
    - Nenhum ativo >10% do patrimônio
    - Melhor distribuição de riscos
    - Manutenção da rentabilidade
    `;
  }

  //  FUNÇÃO DE ANÁLISE FISCAL
  if (lowerCaseMessage.includes("imposto") || lowerCaseMessage.includes("tributação") || lowerCaseMessage.includes("ir")) {
    return `
    ### 💰 Análise Fiscal da Sua Carteira

    **Entenda a tributação de cada classe de ativo para otimizar suas operações.**

    ---

    #### 🇧🇷 **Ações Brasileiras (B3SA3, WEGE3, CPLE6, VIVT3, CXSE3)**

    **Ganho de Capital:**
    - **Isenção:** Vendas até R$20.000/mês
    - **Tributação:** 15% sobre o lucro (vendas >R$20k/mês)
    - **Day Trade:** 20% sobre o lucro

    **Dividendos:**
    - **Isenção total** para pessoa física
    - Recebimento líquido na conta

    **Estratégia Fiscal:**
    - Realize lucros até R$20k/mês (isento)
    - Exemplo: Vender VIVT3 ou WEGE3 gradualmente

    ---

    #### 🌍 **BDRs (PGCO34, AMZO34, CSCO34, ABCB34, JPMC34, BOAC34)**

    **Ganho de Capital:**
    - **15%** sobre o lucro (sem isenção)
    - **20%** para day trade

    **Dividendos:**
    - **Tributação na fonte** nos EUA (30%)
    - **Compensação** via acordo Brasil-EUA
    - **Resultado:** ~27,5% de tributação efetiva

    **Estratégia Fiscal:**
    - Priorize vendas de ações BR antes de BDRs
    - Mantenha BDRs para longo prazo

    ---

    #### 🏢 **FIIs (Todos os 9 fundos)**

    **Ganho de Capital:**
    - **20%** sobre o lucro (sempre tributado)
    - Não há isenção para vendas

    **Dividendos:**
    - **Isenção total** para pessoa física
    - Recebimento mensal líquido

    **Estratégia Fiscal:**
    - Foque na renda (dividendos) vs. ganho de capital
    - Evite trading frequente em FIIs

    ---

    #### 🌐 **ETFs Internacionais (NASD11, IVVB11)**

    **Ganho de Capital:**
    - **15%** sobre o lucro
    - Mesma regra dos BDRs

    **Dividendos:**
    - Tributação similar aos BDRs
    - ~27,5% efetivo

    ---

    #### ₿ **Criptomoedas (QBTC11 + Bitcoin)**

    **QBTC11 (ETF):**
    - **15%** sobre ganho de capital
    - Sem isenção

    **Bitcoin Direto:**
    - **15%** sobre ganho de capital
    - **Isenção:** Vendas até R$35.000/mês
    - Declaração obrigatória se patrimônio >R$5.000

    **Estratégia Fiscal:**
    - Bitcoin direto: Use isenção de R$35k/mês
    - QBTC11: Sempre tributado

    ---

    #### 💳 **Renda Fixa (CDB 101% CDI)**

    **Tributação:**
    - **Tabela regressiva** do IR
    - Até 180 dias: 22,5%
    - 181-360 dias: 20%
    - 361-720 dias: 17,5%
    - Acima 720 dias: 15%

    **IOF:**
    - Primeiros 30 dias: IOF regressivo
    - Após 30 dias: Isento

    ---

    #### 🎯 **Plano de Otimização Fiscal**

    **Prioridade de Vendas (menor para maior tributação):**
    1. **Ações BR** - Até R$20k/mês (isento)
    2. **Bitcoin** - Até R$35k/mês (isento)
    3. **BDRs/ETFs** - 15% sempre
    4. **FIIs** - 20% sempre

    **Cronograma Sugerido:**
    - **Janeiro:** Vender VIVT3 (R$15k) + WEGE3 (R$5k) = Isento
    - **Fevereiro:** Vender Bitcoin (R$30k) = Isento
    - **Março:** Vender QBTC11 (R$10k) = 15% IR

    **Economia Estimada:** R$3.000-5.000 em impostos/ano com planejamento adequado.
    `;
  }

  //  FUNÇÃO ULTRA-INTELIGENTE DE REALIZAÇÃO DE LUCROS
  if (lowerCaseMessage.includes("quero realizar lucro") || lowerCaseMessage.includes("realizar lucro") || lowerCaseMessage.includes("sugestão de venda")) {
    
    // Dados atualizados da carteira (simulando banco de dados)
    const portfolioAssets = {
      // Ativos com +50% de lucro (candidatos à realização)
      profitCandidates: [
        { 
          symbol: 'VIVT3', quantity: 160, current_price: 33.15, purchase_price: 21.90,
          profit_percent: 51.37, class: 'Ações BR', sector: 'Telecomunicações'
        },
        { 
          symbol: 'BOAC34', quantity: 100, current_price: 69.40, purchase_price: 44.30,
          profit_percent: 56.66, class: 'BDRs', sector: 'Financeiro'
        },
        { 
          symbol: 'QBTC11', quantity: 300, current_price: 35.40, purchase_price: 19.35,
          profit_percent: 83.11, class: 'ETFs', sector: 'Cripto'
        },
        { 
          symbol: 'BTC', quantity: 0.099912, current_price: 587179.80, purchase_price: 350000.00,
          profit_percent: 67.77, class: 'Cripto', value: 58717.98
        }
      ],
      
      // Melhores oportunidades de compra (descontados)
      buyOpportunities: [
        { symbol: 'PVBI11', current_price: 9.85, p_vp: 0.88, dy: 10.2, sector: 'Papel', quantity: 132, profit_percent: -12.05 },
        { symbol: 'HGCR11', current_price: 8.90, p_vp: 0.84, dy: 11.5, sector: 'Híbrido', quantity: 176, profit_percent: -16.04 },
        { symbol: 'RZTR11', current_price: 10.20, p_vp: 0.86, dy: 9.8, sector: 'Logística', quantity: 69, profit_percent: -13.56 },
        { symbol: 'VISC11', current_price: 9.15, p_vp: 0.89, dy: 8.8, sector: 'Shoppings', quantity: 40, profit_percent: -11.17 },
        { symbol: 'AREA11', current_price: 8.90, p_vp: 0.89, dy: 11.8, sector: 'Híbrido', quantity: 10, profit_percent: -5.32 },
        { symbol: 'KDIF11', current_price: 9.20, p_vp: 0.92, dy: 10.5, sector: 'Híbrido', quantity: 1, profit_percent: 3.37 }
      ]
    };
    
    const { profitCandidates, buyOpportunities } = portfolioAssets;
    
    if (profitCandidates.length === 0) {
      return `## 📊 **Análise de Realização de Lucros**\n\n**Nenhum ativo com +50% de lucro encontrado hoje.**\n\nSeus ativos estão dentro da faixa de manutenção.`;
    }
    
    // Calcular valores totais
    let totalValueToRealize = 0;
    let totalProfitToRealize = 0;
    
    profitCandidates.forEach(asset => {
      const sellQuantity = asset.symbol === 'BTC' ? asset.quantity * 0.5 : Math.floor(asset.quantity * 0.5);
      const sellValue = asset.symbol === 'BTC' ? asset.value * 0.5 : sellQuantity * asset.current_price;
      totalValueToRealize += sellValue;
      
      if (asset.symbol === 'BTC') {
        totalProfitToRealize += sellValue - (sellValue / (1 + asset.profit_percent/100));
      } else {
        totalProfitToRealize += sellQuantity * (asset.current_price - asset.purchase_price);
      }
    });
    
    return `
## 💰 **O que é "realizar lucros parciais"?**

💡 É vender parte de uma posição que já se valorizou (+50%), garantindo lucro no bolso e mantendo participação no ativo.

⚖️ **Quando fazer?**
- Ativo valorizou +50% ou mais 📈
- Posição virou "grande demais" (>5% da carteira) 📊
- Fundamentos começam a piorar 📉
- Já atingiu objetivo de preço 🎯

🧮 **Fórmula prática (a mais consagrada):**
➡️ Quando o ativo subir +50%, venda 50% da posição.
➡️ Exemplo: comprei 100 cotas → subiu 60% → vendo 50 cotas e deixo 50 rodando.

📍 **Resultado:** você protege o capital e continua exposto com o lucro.
📍 Isso é "dinheiro da casa" → só cresce a bola de neve de dividendos. ❄️💰

---

## 🎯 **ANÁLISE COMPLETA DA SUA CARTEIRA HOJE**

### **Ativos Candidatos à Realização (+50% de lucro):**

${profitCandidates.map((asset, index) => {
  const sellQuantity = asset.symbol === 'BTC' ? asset.quantity * 0.5 : Math.floor(asset.quantity * 0.5);
  const currentValue = asset.symbol === 'BTC' ? asset.value : asset.quantity * asset.current_price;
  const sellValue = asset.symbol === 'BTC' ? asset.value * 0.5 : sellQuantity * asset.current_price;
  const profitRealized = asset.symbol === 'BTC' ? 
    sellValue - (sellValue / (1 + asset.profit_percent/100)) :
    sellQuantity * (asset.current_price - asset.purchase_price);
  
  return `
**${index + 1}. ${asset.symbol} (${asset.class}) - +${asset.profit_percent.toFixed(1)}%**
- **Posição atual:** ${asset.symbol === 'BTC' ? asset.quantity.toFixed(6) + ' BTC' : asset.quantity + ' cotas'} = ${formatCurrency(currentValue)}
- **Lucro acumulado:** +${asset.profit_percent.toFixed(1)}%
- **SUGESTÃO:** Vender ${asset.symbol === 'BTC' ? (sellQuantity).toFixed(6) + ' BTC' : sellQuantity + ' cotas'} (50%)
- **Valor a realizar:** ${formatCurrency(sellValue)}
- **Lucro cristalizado:** ${formatCurrency(profitRealized)}
- **Posição remanescente:** ${asset.symbol === 'BTC' ? (asset.quantity - sellQuantity).toFixed(6) + ' BTC' : (asset.quantity - sellQuantity) + ' cotas'}
`;
}).join('')}

---

## 💼 **RESUMO DA OPERAÇÃO SUGERIDA**

**🔴 VENDAS TOTAIS:**
${profitCandidates.map(asset => {
  const sellQuantity = asset.symbol === 'BTC' ? asset.quantity * 0.5 : Math.floor(asset.quantity * 0.5);
  const sellValue = asset.symbol === 'BTC' ? asset.value * 0.5 : sellQuantity * asset.current_price;
  return `- ${asset.symbol}: ${asset.symbol === 'BTC' ? sellQuantity.toFixed(6) + ' BTC' : sellQuantity + ' cotas'} = ${formatCurrency(sellValue)}`;
}).join('\n')}

**💰 TOTAIS:**
- **Valor bruto a realizar:** ${formatCurrency(totalValueToRealize)}
- **Lucro total cristalizado:** ${formatCurrency(totalProfitToRealize)}
- **IR (15% sobre lucro):** ${formatCurrency(totalProfitToRealize * 0.15)}
- **Valor líquido disponível:** ${formatCurrency(totalValueToRealize - (totalProfitToRealize * 0.15))}

---

## 🛒 **MELHORES OPORTUNIDADES DE COMPRA HOJE**

**Ativos com maior desconto/oportunidade:**

${buyOpportunities.slice(0, 6).map((asset, index) => {
  const isDiscount = asset.p_vp < 1.00;
  const metric = isDiscount ? `P/VP ${asset.p_vp.toFixed(2)}` : `${asset.profit_percent.toFixed(1)}%`;
  
  return `
**${index + 1}. ${asset.symbol} (${asset.sector})**
- **Preço atual:** R$ ${asset.current_price.toFixed(2)}
- **Situação:** ${isDiscount ? 'Desconto ao VP' : 'Prejuízo temporário'} (${metric})
- **Dividend Yield:** ${asset.dy}%
- **Posição atual:** ${asset.quantity} cotas
- **Oportunidade:** ${isDiscount ? 'Comprar abaixo do valor patrimonial' : 'Preço de oportunidade'}
`;
}).join('')}

---

## 📊 **SUGESTÃO DE REALOCAÇÃO INTELIGENTE**

**Distribuição do valor líquido (${formatCurrency(totalValueToRealize - (totalProfitToRealize * 0.15))}):**

${buyOpportunities.slice(0, 6).map((asset, index) => {
  const percentage = [30, 25, 20, 15, 7, 3][index] || 0;
  const value = (totalValueToRealize - (totalProfitToRealize * 0.15)) * (percentage / 100);
  const cotas = Math.floor(value / asset.current_price);
  
  return `
**${asset.symbol}** (${percentage}%) - ${formatCurrency(value)}
- Comprar ≈ ${cotas} cotas
- Justificativa: ${asset.p_vp < 1.00 ? `P/VP ${asset.p_vp.toFixed(2)} (desconto)` : `Oportunidade ${asset.profit_percent.toFixed(1)}%`}
- DY esperado: ${asset.dy}%
`;
}).join('')}

---

## 📅 **CRONOGRAMA DE EXECUÇÃO**

**Semana 1 - Vendas:**
${profitCandidates.map((asset, index) => {
  const sellQuantity = asset.symbol === 'BTC' ? asset.quantity * 0.5 : Math.floor(asset.quantity * 0.5);
  const day = ['Segunda', 'Terça', 'Quarta', 'Quinta'][index] || 'Sexta';
  return `- **${day}:** Vender ${asset.symbol === 'BTC' ? sellQuantity.toFixed(6) + ' BTC' : sellQuantity + ' cotas'} de ${asset.symbol}`;
}).join('\n')}

**Semana 2 - Compras:**
${buyOpportunities.slice(0, 6).map((asset, index) => {
  const day = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'][index];
  const percentage = [30, 25, 20, 15, 7, 3][index] || 0;
  const value = (totalValueToRealize - (totalProfitToRealize * 0.15)) * (percentage / 100);
  return `- **${day}:** Comprar ${asset.symbol} (${formatCurrency(value)})`;
}).join('\n')}

---

## 🎯 **BENEFÍCIOS DA ESTRATÉGIA**

✅ **Lucro cristalizado:** ${formatCurrency(totalProfitToRealize)}
✅ **Diversificação:** Redução de concentração em ativos valorizados
✅ **Oportunidades:** Compra de ativos descontados/baratos
✅ **Renda passiva:** Aumento do DY médio da carteira
✅ **Proteção:** Capital preservado + exposição mantida
✅ **Estratégia ARCA:** Rebalanceamento automático

**💡 Próximo passo:** Executar as ordens conforme cronograma para otimizar preços.
    `;
  }
