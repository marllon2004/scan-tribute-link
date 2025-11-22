# Scan Tribute Link

**Leitor de tributos automatizado** — projeto desenvolvido como parte de um trabalho acadêmico para explorar a inovação, utilizando de IA.  
O sistema permite **ler QR Codes ou códigos de barras de produtos** e exibir, em um **modal interativo**, as informações de tributos relacionadas ao item escaneado.

---

## Sobre o projeto

Este projeto foi **gerado inicialmente com auxílio da IA [Lovable.dev](https://lovable.dev/)**, como uma forma de **acelerar o desenvolvimento do front-end** e **explorar o uso de inteligência artificial em geração de código**.

A interface foi criada utilizando:
- **Vite** (ambiente de build)
- **Tailwind CSS** (estilização)
- **TypeScript** e **HTML/CSS**
- **IA Lovable.dev** para scaffolding inicial

O objetivo é desenvolver um **leitor simples de código de barras e QR Code**, que exibe dados de tributos do produto em uma interface moderna e intuitiva.

---

## Funcionalidades

- Leitura de código de barras e QR Codes (via câmera ou leitor físico)
- Exibição de informações em modal
- Front-end responsivo e rápido (Vite + Tailwind)

---

## Banco de Dados

O banco de dados é o PostgreSQL.

Conecte no PostgreSQL:

```
docker exec -it tributos-db psql -U admin -d tributos
```

Crie a tabela:

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

Copie o arquivo CSV para dentro do container:
```
docker cp produtos.csv tributos-db:/produtos.csv
```

Importe no PostgreSQL:
```
docker exec -it tributos-db psql -U admin -d tributos -c "\COPY produtos FROM '/produtos.csv' CSV HEADER ENCODING 'UTF8';"
```
## Execução com Docker

Para rodar o projeto localmente via Docker:

```

docker compose up --build


http://localhost:8080
