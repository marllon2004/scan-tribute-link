# Scan Tribute Link

Sistema automatizado de leitura e consulta tributária de produtos, desenvolvido como parte de um trabalho acadêmico de Gestão da Inovação utilizando Inteligência Artificial.
O projeto permite ler códigos de barras (EAN) ou QR Codes e, imediatamente, exibir um modal interativo com todas as informações tributárias do produto, facilitando o cadastro fiscal, a conferência de dados e a tomada de decisões dentro de comércios e empresas.

---

## Sobre o projeto

O Scan Tribute Link foi inicialmente gerado com auxília da IA [Lovable.dev](https://lovable.dev/), como uma experimentação de ferramentas que utilizam IA para:
- gerar scaffolding inicial do front-end
- acelerar entregas
- automatizar estruturas de código
- explorar novos fluxos de desenvolvimento orientados por IA

O projeto foi evoluído posteriormente de forma manual, refinando componentes, organizando o backend e conectando o sistema a um banco de dados real.

---

# Tecnologias utilizadas

- Vite - ambiente de build rápido
- Tailwind CSS - estilização eficiente e responsiva
- TypeScript
- HTML/CSS
- Lovable.dev - geração inicial da interface

---

# Objetivo principal

Criar um leito simples e eficiente de EAN/QR Code que exiba automaticamente os tributos e dados fiscais do produto, de forma visual, rápida e acessível.

## Funcionalidades

- Leitura via câmera (webRTC)
- Leitura via leitor físico de código de barras
- Consulta automática das informações finais no banco
- Exibição em modal moderno e intuitivo
- Interface responsiva
- Integração completa com API Node.js/Express
- Banco PostgreSQL populado com planilha de produtos tributários

---

## Fluxo de funcionamento

1. Usuário escaneia um código de barras (EAN)
2. O front-end envia requisição
3. O backend consulta o PostgreSQL
4. Caso o produto exista: retorna todos os dados fiscais
5. O front-end exibe um modal com:
    - descrição
    - NCM
    - CEST
    - CFOP
    - CST
    - ICMS
    - ICMS PDV

Esses dados permitem:
- cadastro fiscal correto
- emissão de NF-e sem rejeições
- redução de erros tributários
- automação de processos contábeis

## Banco de Dados (PostgreSQL)

Conectar no container:

```
docker exec -it tributos-db psql -U admin -d tributos
```

Criação da tabela:

```
CREATE TABLE produtos (
  ean VARCHAR(20) PRIMARY KEY,
  descricao TEXT NOT NULL,
  ncm VARCHAR(20),
  cest VARCHAR(20),
  cfop_venda VARCHAR(10),
  cst VARCHAR(10),
  icms NUMERIC(10,2),
  icms_pdv NUMERIC(10,2),
  red_bc_icms NUMERIC(10,2),
  nat_rec_isenta VARCHAR(100)
);
```

Importação dos dados da planilha

Copie o CSV para dentro do container:
```
docker cp produtos.csv tributos-db:/produtos.csv
```

Depois importe:
```
docker exec -it tributos-db psql -U admin -d tributos -c "\COPY produtos FROM '/produtos.csv' CSV HEADER ENCODING 'UTF8';"
```
## Execução com Docker

Para rodar o projeto localmente via Docker:

```
docker compose up --build
```

Front-end
```
http://localhost:8080
```

API
```
http://localhost:3001
```