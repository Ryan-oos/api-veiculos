const db = require('../database/db');

/**
 * Camada de Acesso a Dados (Model) para Veículos
 * Utiliza o Knex para executar as operações no banco PostgreSQL
 */
const VeiculoModel = {
  /**
   * Busca todos os veículos cadastrados
   * @returns {Promise<Array>} Lista de veículos ordenados por ID
   */
  async findAll() {
    return await db('veiculos').select('*').orderBy('id', 'asc');
  },

  /**
   * Busca um veículo específico pelo ID
   * @param {number} id Identificador do veículo
   * @returns {Promise<Object|undefined>} Veículo encontrado ou undefined
   */
  async findById(id) {
    return await db('veiculos').where({ id }).first();
  },

  /**
   * Cadastra um novo veículo
   * @param {Object} dadosVeiculo Dados validados do veículo a ser inserido
   * @returns {Promise<Object>} Veículo recém-criado com seu ID gerado
   */
  async create(dadosVeiculo) {
    const [veiculoCriado] = await db('veiculos')
      .insert(dadosVeiculo)
      .returning('*');
    return veiculoCriado;
  },

  /**
   * Atualiza os dados de um veículo existente
   * @param {number} id Identificador do veículo
   * @param {Object} dadosAtualizacao Dados para atualização
   * @returns {Promise<Object>} Veículo com dados atualizados
   */
  async update(id, dadosAtualizacao) {
    const [veiculoAtualizado] = await db('veiculos')
      .where({ id })
      .update(dadosAtualizacao)
      .returning('*');
    return veiculoAtualizado;
  },

  /**
   * Remove um veículo pelo ID
   * @param {number} id Identificador do veículo
   * @returns {Promise<number>} Quantidade de linhas afetadas (0 se não encontrado, 1 se removido)
   */
  async delete(id) {
    return await db('veiculos').where({ id }).del();
  }
};

module.exports = VeiculoModel;
