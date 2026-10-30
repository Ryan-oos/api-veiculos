-- Criação dos tipos enumerados (ENUM)
CREATE TYPE tipo_propulsao_enum AS ENUM ('eletrico', 'hibrido');
CREATE TYPE status_producao_enum AS ENUM ('em_producao', 'descontinuado');

-- Criação da tabela veiculos conforme especificação
CREATE TABLE veiculos (
  id SERIAL PRIMARY KEY,
  modelo VARCHAR(100) NOT NULL,
  tipo_propulsao tipo_propulsao_enum NOT NULL,
  ano_modelo SMALLINT NOT NULL,
  autonomia_km INT,
  capacidade_bateria_kwh DECIMAL(6,2),
  preco_base DECIMAL(10,2) NOT NULL,
  status_producao status_producao_enum NOT NULL DEFAULT 'em_producao'
);

-- Registros de exemplo para testes
INSERT INTO veiculos (modelo, tipo_propulsao, ano_modelo, autonomia_km, capacidade_bateria_kwh, preco_base, status_producao) VALUES
('Fiat Pulse Audace Hybrid', 'hibrido', 2026, 680, NULL, 125990.00, 'em_producao'),
('Peugeot e-2008 GT', 'eletrico', 2026, 406, 54.00, 199990.00, 'em_producao'),
('BYD Dolphin Mini', 'eletrico', 2025, 280, 38.00, 115800.00, 'em_producao');

