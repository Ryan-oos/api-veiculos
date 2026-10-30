# 🚗 API REST de Gerenciamento de Veículos

Backend robusto e completo desenvolvido em **Node.js**, **Express** e **Knex** para o gerenciamento de veículos de uma montadora automotiva, com persistência em banco de dados relacional **PostgreSQL** hospedado em nuvem no **Neon**.

---

### 👨‍💻 Identificação do Projeto
- **Desenvolvedor:** Ryan da Silva Benedito
- **Instituição:** FAETERJ
- **Disciplina:** Programação cliente/servidor
- **Professor:** Henrique Barbosa
- **Tipo de Trabalho:** Trabalho Individual de Avaliação

---

### 🎯 O que o código faz?
Este backend expõe uma **API RESTful** padronizada para o recurso `/veiculos`, permitindo a gestão do ciclo de vida dos veículos produzidos por uma montadora. As principais funcionalidades incluem:
- **Listagem Geral (GET /veiculos):** Consulta e retorna todos os veículos cadastrados no banco de dados com ordenação por ID.
- **Consulta Específica (GET /veiculos/:id):** Busca os detalhes completos de um veículo pelo seu identificador primário, retornando status `200` em caso de sucesso ou `404 Not Found` caso não exista.
- **Cadastro (POST /veiculos):** Insere um novo veículo validando campos obrigatórios, tipos numéricos e ENUMs específicos (`tipo_propulsao` e `status_producao`), atribuindo automaticamente o valor padrão `'em_producao'` caso o status não seja informado. Retorna status `201 Created` com o ID autoincrementado gerado pelo banco.
- **Atualização (PUT /veiculos/:id):** Modifica os dados de um veículo já existente no banco, validando se o registro existe previamente e aplicando validações estritas aos campos enviados.
- **Exclusão (DELETE /veiculos/:id):** Remove o veículo do banco de dados relacional pelo ID, retornando mensagem de confirmação ou status `404` se o registro não for encontrado.
- **Proteção e Integridade:** Todas as operações utilizam o query builder **Knex** com consultas parametrizadas, prevenindo falhas de injeção de SQL (SQL Injection), além de conexão segura com criptografia **SSL**.

---

## 📌 Sumário
- [Tecnologias Utilizadas](#-tecnologias-utilizadas)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Banco de Dados e Modelo Relacional](#-banco-de-dados-e-modelo-relacional)
- [Instalação e Execução](#-instalação-e-execução)
- [Endpoints da API](#-endpoints-da-api)
  - [1. Listar todos os veículos (GET /veiculos)](#1-listar-todos-os-veículos-get-veiculos)
  - [2. Buscar veículo por ID (GET /veiculos/:id)](#2-buscar-veículo-por-id-get-veiculosid)
  - [3. Cadastrar veículo (POST /veiculos)](#3-cadastrar-veículo-post-veiculos)
  - [4. Atualizar veículo (PUT /veiculos/:id)](#4-atualizar-veículo-put-veiculosid)
  - [5. Remover veículo (DELETE /veiculos/:id)](#5-remover-veículo-delete-veiculosid)
- [Validações e Tratamento de Erros](#-validações-e-tratamento-de-erros)
- [Documentação e Execução dos Testes](#-documentação-e-execução-dos-testes)
  - [Testes Automatizados (npm test)](#testes-automatizados-npm-test)
  - [Testes via Thunder Client / Postman](#testes-via-thunder-client--postman)

---

## 🛠 Tecnologias Utilizadas

| Tecnologia | Finalidade |
| :--- | :--- |
| **Node.js** | Ambiente de execução JavaScript no servidor |
| **Express** | Framework web para criação das rotas e do servidor HTTP |
| **Knex.js** | Query builder para comunicação segura e eficiente com o banco de dados |
| **PostgreSQL** | Sistema Gerenciador de Banco de Dados Relacional (hospedado no Neon) |
| **pg** | Driver nativo do PostgreSQL para Node.js |
| **dotenv** | Carregamento de variáveis de ambiente a partir do arquivo `.env` |
| **cors** | Middleware para habilitar o compartilhamento de recursos entre origens diferentes |
| **nodemon** | Utilitário para reinicialização automática do servidor durante o desenvolvimento |

---

## 📂 Estrutura do Projeto

O projeto foi estruturado seguindo o padrão de **arquitetura em camadas**, separando responsabilidades entre rotas, controladores e acesso a dados:

```text
api-veiculos/
├── database/
│   └── schema.sql                  # Script DDL com a criação da tabela e dos enums
├── node_modules/                   # Dependências do Node.js
├── src/
│   ├── controllers/
│   │   └── veiculosController.js   # Regras de negócio, validações e respostas HTTP
│   ├── database/
│   │   └── db.js                   # Instância de conexão do Knex
│   ├── models/
│   │   └── veiculoModel.js         # Camada de persistência e queries Knex
│   └── routes.js                   # Mapeamento de rotas e métodos HTTP
├── tests/
│   └── test_api.js                 # Suíte de testes automatizados ponta a ponta
├── .env                            # Variáveis de ambiente com credenciais reais (ignorado no git)
├── .env.example                    # Exemplo de configuração de variáveis de ambiente
├── .gitignore                      # Arquivos e pastas excluídos do versionamento Git
├── knexfile.js                     # Configuração da conexão do Knex com SSL
├── package.json                    # Metadados e dependências do projeto
├── postman_collection.json         # Coleção exportada para Postman
├── thunder-collection_api-veiculos.json # Coleção exportada para Thunder Client
├── README.md                       # Documentação completa do projeto
└── server.js                       # Inicialização do servidor Express
```

---

## 🗄 Banco de Dados e Modelo Relacional

A tabela `veiculos` possui o seguinte esquema:

| Coluna | Tipo | Restrições | Descrição |
| :--- | :--- | :--- | :--- |
| `id` | SERIAL | PRIMARY KEY | Identificador único autoincrementado |
| `modelo` | VARCHAR(100) | NOT NULL | Modelo do veículo |
| `tipo_propulsao` | `tipo_propulsao_enum` | NOT NULL | `'eletrico'` ou `'hibrido'` |
| `ano_modelo` | SMALLINT | NOT NULL | Ano do modelo (ex: 2026) |
| `autonomia_km` | INT | Opcional (aceita nulo) | Autonomia estimada em km |
| `capacidade_bateria_kwh` | DECIMAL(6,2) | Opcional (aceita nulo) | Capacidade da bateria em kWh |
| `preco_base` | DECIMAL(10,2) | NOT NULL | Preço base de tabela |
| `status_producao` | `status_producao_enum` | NOT NULL, DEFAULT `'em_producao'` | `'em_producao'` ou `'descontinuado'` |

---

## 🚀 Instalação e Execução

### Pré-requisitos
- [Node.js](https://nodejs.org/) (versão 18 ou superior)
- [npm](https://www.npmjs.com/)

### 1. Clonar o repositório
```bash
git clone <URL_DO_REPOSITORIO>
cd "API Reset"
```

### 2. Instalar as dependências
```bash
npm install
```

### 3. Configurar as variáveis de ambiente
Crie um arquivo `.env` na raiz do projeto (ou copie a partir de `.env.example`):
```bash
cp .env.example .env
```

Preencha com a string de conexão do Neon:
```env
PORT=3000
DATABASE_URL=postgresql://neondb_owner:tEgdK7s0NzmC@ep-small-scene-a5vgf7jk-pooler.us-east-2.aws.neon.tech/banco?sslmode=require&channel_binding=require
```

### 4. Iniciar o servidor

**Modo de Desenvolvimento (com recarregamento automático):**
```bash
npm run dev
```

**Modo de Produção:**
```bash
npm start
```

O servidor estará acessível em: `http://localhost:3000`

---

## 📡 Endpoints da API

URL Base: `http://localhost:3000/veiculos`

### 1. Listar todos os veículos (GET /veiculos)
- **Método:** `GET`
- **Rota:** `/veiculos`
- **Descrição:** Retorna todos os veículos cadastrados no banco de dados.
- **Resposta de Sucesso (200 OK):**
```json
[
  {
    "id": 6,
    "modelo": "Fiat Pulse Audace Hybrid",
    "tipo_propulsao": "hibrido",
    "ano_modelo": 2026,
    "autonomia_km": 680,
    "capacidade_bateria_kwh": null,
    "preco_base": "125990.00",
    "status_producao": "em_producao"
  }
]
```

---

### 2. Buscar veículo por ID (GET /veiculos/:id)
- **Método:** `GET`
- **Rota:** `/veiculos/:id`
- **Descrição:** Busca os dados de um veículo específico pelo ID.
- **Resposta de Sucesso (200 OK):**
```json
{
  "id": 6,
  "modelo": "Fiat Pulse Audace Hybrid",
  "tipo_propulsao": "hibrido",
  "ano_modelo": 2026,
  "autonomia_km": 680,
  "capacidade_bateria_kwh": null,
  "preco_base": "125990.00",
  "status_producao": "em_producao"
}
```
- **Resposta de Erro (404 Not Found):**
```json
{
  "mensagem": "Veículo não encontrado."
}
```

---

### 3. Cadastrar veículo (POST /veiculos)
- **Método:** `POST`
- **Rota:** `/veiculos`
- **Descrição:** Cadastra um novo registro no banco. Se `status_producao` não for informado, assume o padrão `'em_producao'`.
- **Corpo da Requisição (JSON):**
```json
{
  "modelo": "Volvo EX30 Ultra",
  "tipo_propulsao": "eletrico",
  "ano_modelo": 2026,
  "autonomia_km": 476,
  "capacidade_bateria_kwh": 69.00,
  "preco_base": 269950.00,
  "status_producao": "em_producao"
}
```
- **Resposta de Sucesso (201 Created):**
```json
{
  "id": 16,
  "modelo": "Volvo EX30 Ultra",
  "tipo_propulsao": "eletrico",
  "ano_modelo": 2026,
  "autonomia_km": 476,
  "capacidade_bateria_kwh": "69.00",
  "preco_base": "269950.00",
  "status_producao": "em_producao"
}
```
- **Resposta de Erro (400 Bad Request):**
```json
{
  "mensagem": "O campo \"tipo_propulsao\" é obrigatório. Valores permitidos: eletrico, hibrido."
}
```

---

### 4. Atualizar veículo (PUT /veiculos/:id)
- **Método:** `PUT`
- **Rota:** `/veiculos/:id`
- **Descrição:** Atualiza os dados de um veículo existente.
- **Corpo da Requisição (JSON):**
```json
{
  "modelo": "Volvo EX30 Ultra Performance",
  "preco_base": 259900.00,
  "status_producao": "descontinuado"
}
```
- **Resposta de Sucesso (200 OK):**
```json
{
  "id": 16,
  "modelo": "Volvo EX30 Ultra Performance",
  "tipo_propulsao": "eletrico",
  "ano_modelo": 2026,
  "autonomia_km": 476,
  "capacidade_bateria_kwh": "69.00",
  "preco_base": "259900.00",
  "status_producao": "descontinuado"
}
```
- **Resposta de Erro (404 Not Found):**
```json
{
  "mensagem": "Veículo não encontrado."
}
```

---

### 5. Remover veículo (DELETE /veiculos/:id)
- **Método:** `DELETE`
- **Rota:** `/veiculos/:id`
- **Descrição:** Remove o veículo cadastrado pelo ID.
- **Resposta de Sucesso (200 OK):**
```json
{
  "mensagem": "Veículo removido com sucesso."
}
```
- **Resposta de Erro (404 Not Found):**
```json
{
  "mensagem": "Veículo não encontrado."
}
```

---

## 🛡 Validações e Tratamento de Erros

A API implementa validações em todas as entradas de dados:

1. **Parâmetros de Rota (`:id`):**
   - Deve ser um número inteiro estritamente positivo (`> 0`). Caso contrário, retorna `400 Bad Request`.
2. **Campos Obrigatórios no Cadastro (`POST`):**
   - `modelo`: String não vazia, máximo 100 caracteres.
   - `tipo_propulsao`: Obrigatório pertencer ao ENUM (`'eletrico'` ou `'hibrido'`).
   - `ano_modelo`: Inteiro válido entre 1900 e 2100.
   - `preco_base`: Número decimal maior ou igual a zero.
3. **Campos Opcionais (`autonomia_km`, `capacidade_bateria_kwh`):**
   - Se fornecidos, devem ser numéricos não negativos ou `null`.
4. **Campo `status_producao`:**
   - Se omitido no `POST`, é atribuído automaticamente o valor padrão `'em_producao'`.
   - Se informado, deve ser `'em_producao'` ou `'descontinuado'`.
5. **IDs Inexistentes:**
   - Retornam status `404 Not Found` em buscas, atualizações ou exclusões.

---

## 🧪 Documentação e Execução dos Testes

### Testes Automatizados (npm test)
O projeto conta com uma suíte de testes ponta a ponta que valida automaticamente todos os cenários de sucesso e cenários de erro para cada uma das rotas:

```bash
npm test
```

Cenários cobertos pelos testes automatizados:
- `GET /veiculos`: valida retorno `200` e estrutura em array.
- `POST /veiculos` (Sucesso): valida inserção, geração de ID e valor default de `status_producao` (`201`).
- `POST /veiculos` (Erro): valida rejeição de ENUM inválido e campos obrigatórios ausentes (`400`).
- `GET /veiculos/:id` (Sucesso): valida busca de registro existente (`200`).
- `GET /veiculos/:id` (Erro): valida IDs não encontrados (`404`) e IDs com formato inválido (`400`).
- `PUT /veiculos/:id` (Sucesso): valida alteração de campos e persistência (`200`).
- `PUT /veiculos/:id` (Erro): valida tentativa de atualização em ID inexistente (`404`).
- `DELETE /veiculos/:id` (Sucesso): valida remoção e mensagem de sucesso (`200`).
- `DELETE /veiculos/:id` (Erro): valida tentativa de exclusão de ID inexistente/já removido (`404`).

---

### Testes via Thunder Client / Postman

Para testar visualmente com ferramentas HTTP:

#### No VS Code (Thunder Client):
1. Instale a extensão **Thunder Client**.
2. Abra a aba do Thunder Client na barra lateral.
3. Clique em **Collections** > **Menu (...)** > **Import**.
4. Selecione o arquivo `thunder-collection_api-veiculos.json` localizado na raiz do projeto.
5. Todas as requisições (sucessos e erros) já estarão prontas para execução!

#### No Postman:
1. Abra o **Postman**.
2. Clique em **Import** no canto superior esquerdo.
3. Arraste ou selecione o arquivo `postman_collection.json`.
4. Execute as requisições configuradas.

---

## 🔒 Segurança e Entrega

- O arquivo `.env` está devidamente listado no `.gitignore` para impedir que senhas ou URLs de conexão vazem em repositórios públicos.
- É fornecido o arquivo `.env.example` com placeholders para orientar a configuração por outros desenvolvedores e avaliadores.
- O Knex utiliza consultas parametrizadas, prevenindo ataques de **SQL Injection**.

