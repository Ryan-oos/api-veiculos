/**
 * ============================================================================
 * Projeto: API REST de Gerenciamento de Veículos
 * Autor: Ryan da Silva Benedito
 * Disciplina: Programação cliente/servidor - FAETERJ
 * Professor: Henrique Barbosa
 *
 * Descrição:
 * Camada de Controladores (Controller). Responsável por receber as requisições
 * HTTP, validar detalhadamente os dados de entrada (tipos de dados, enums,
 * campos obrigatórios e opcionais), orquestrar as chamadas para a camada de
 * persistência (Model) e retornar os códigos de status HTTP apropriados
 * (200, 201, 400, 404, 500).
 * ============================================================================
 */

const VeiculoModel = require('../models/veiculoModel');

const TIPOS_PROPULSAO_VALIDOS = ['eletrico', 'hibrido'];
const STATUS_PRODUCAO_VALIDOS = ['em_producao', 'descontinuado'];

const veiculosController = {
  /**
   * GET /veiculos
   * Lista todos os veículos cadastrados no sistema.
   * Retorna status 200 com array de veículos (ou array vazio se não houver).
   */
  async listar(req, res) {
    try {
      const veiculos = await VeiculoModel.findAll();
      return res.status(200).json(veiculos);
    } catch (error) {
      console.error('Erro ao listar veículos:', error);
      return res.status(500).json({
        mensagem: 'Erro interno no servidor ao consultar veículos.'
      });
    }
  },

  /**
   * GET /veiculos/:id
   * Retorna os dados de um veículo específico identificado pelo ID.
   * Retorna status 200 com os dados ou 404 se não for encontrado.
   */
  async buscarPorId(req, res) {
    try {
      const { id } = req.params;
      const parsedId = Number(id);

      if (!Number.isInteger(parsedId) || parsedId <= 0) {
        return res.status(400).json({
          mensagem: 'O parâmetro ID deve ser um número inteiro positivo.'
        });
      }

      const veiculo = await VeiculoModel.findById(parsedId);

      if (!veiculo) {
        return res.status(404).json({
          mensagem: 'Veículo não encontrado.'
        });
      }

      return res.status(200).json(veiculo);
    } catch (error) {
      console.error('Erro ao buscar veículo por ID:', error);
      return res.status(500).json({
        mensagem: 'Erro interno no servidor ao buscar veículo.'
      });
    }
  },

  /**
   * POST /veiculos
   * Cadastra um novo veículo no banco de dados.
   * Valida obrigatoriedade de campos, valores de ENUM e números positivos.
   * Define 'em_producao' caso 'status_producao' seja omitido.
   * Retorna status 201 com o objeto criado e seu ID gerado.
   */
  async criar(req, res) {
    try {
      const {
        modelo,
        tipo_propulsao,
        ano_modelo,
        autonomia_km,
        capacidade_bateria_kwh,
        preco_base,
        status_producao
      } = req.body;

      // Validação de campos obrigatórios
      if (!modelo || typeof modelo !== 'string' || modelo.trim() === '') {
        return res.status(400).json({
          mensagem: 'O campo "modelo" é obrigatório e deve ser um texto válido (máximo 100 caracteres).'
        });
      }

      if (modelo.trim().length > 100) {
        return res.status(400).json({
          mensagem: 'O campo "modelo" não pode ter mais de 100 caracteres.'
        });
      }

      if (!tipo_propulsao || !TIPOS_PROPULSAO_VALIDOS.includes(tipo_propulsao)) {
        return res.status(400).json({
          mensagem: `O campo "tipo_propulsao" é obrigatório. Valores permitidos: ${TIPOS_PROPULSAO_VALIDOS.join(', ')}.`
        });
      }

      const parsedAno = Number(ano_modelo);
      if (ano_modelo === undefined || !Number.isInteger(parsedAno) || parsedAno < 1900 || parsedAno > 2100) {
        return res.status(400).json({
          mensagem: 'O campo "ano_modelo" é obrigatório e deve ser um ano válido (entre 1900 e 2100).'
        });
      }

      const parsedPreco = Number(preco_base);
      if (preco_base === undefined || isNaN(parsedPreco) || parsedPreco < 0) {
        return res.status(400).json({
          mensagem: 'O campo "preco_base" é obrigatório e deve ser um número decimal positivo.'
        });
      }

      // Validação de campos opcionais
      let parsedAutonomia = null;
      if (autonomia_km !== undefined && autonomia_km !== null) {
        parsedAutonomia = Number(autonomia_km);
        if (!Number.isInteger(parsedAutonomia) || parsedAutonomia < 0) {
          return res.status(400).json({
            mensagem: 'O campo "autonomia_km" deve ser um número inteiro maior ou igual a zero.'
          });
        }
      }

      let parsedCapacidade = null;
      if (capacidade_bateria_kwh !== undefined && capacidade_bateria_kwh !== null) {
        parsedCapacidade = Number(capacidade_bateria_kwh);
        if (isNaN(parsedCapacidade) || parsedCapacidade < 0) {
          return res.status(400).json({
            mensagem: 'O campo "capacidade_bateria_kwh" deve ser um número decimal maior ou igual a zero.'
          });
        }
      }

      // Se status_producao não for informado, assume 'em_producao' conforme especificação
      let statusFinal = 'em_producao';
      if (status_producao !== undefined && status_producao !== null && status_producao !== '') {
        if (!STATUS_PRODUCAO_VALIDOS.includes(status_producao)) {
          return res.status(400).json({
            mensagem: `Valor inválido para "status_producao". Valores permitidos: ${STATUS_PRODUCAO_VALIDOS.join(', ')}.`
          });
        }
        statusFinal = status_producao;
      }

      const novoVeiculo = {
        modelo: modelo.trim(),
        tipo_propulsao,
        ano_modelo: parsedAno,
        autonomia_km: parsedAutonomia,
        capacidade_bateria_kwh: parsedCapacidade,
        preco_base: parsedPreco,
        status_producao: statusFinal
      };

      const veiculoCriado = await VeiculoModel.create(novoVeiculo);
      return res.status(201).json(veiculoCriado);
    } catch (error) {
      console.error('Erro ao cadastrar veículo:', error);
      return res.status(500).json({
        mensagem: 'Erro interno no servidor ao cadastrar veículo.'
      });
    }
  },

  /**
   * PUT /veiculos/:id
   * Atualiza os dados de um veículo existente.
   * Valida se o registro existe (404 caso contrário) e valida os novos dados.
   * Retorna status 200 com os dados atualizados.
   */
  async atualizar(req, res) {
    try {
      const { id } = req.params;
      const parsedId = Number(id);

      if (!Number.isInteger(parsedId) || parsedId <= 0) {
        return res.status(400).json({
          mensagem: 'O parâmetro ID deve ser um número inteiro positivo.'
        });
      }

      // Verifica se o veículo existe antes de atualizar
      const veiculoExistente = await VeiculoModel.findById(parsedId);
      if (!veiculoExistente) {
        return res.status(404).json({
          mensagem: 'Veículo não encontrado.'
        });
      }

      const {
        modelo,
        tipo_propulsao,
        ano_modelo,
        autonomia_km,
        capacidade_bateria_kwh,
        preco_base,
        status_producao
      } = req.body;

      const dadosAtualizacao = {};

      if (modelo !== undefined) {
        if (typeof modelo !== 'string' || modelo.trim() === '') {
          return res.status(400).json({
            mensagem: 'O campo "modelo" deve ser um texto não vazio.'
          });
        }
        if (modelo.trim().length > 100) {
          return res.status(400).json({
            mensagem: 'O campo "modelo" não pode ter mais de 100 caracteres.'
          });
        }
        dadosAtualizacao.modelo = modelo.trim();
      }

      if (tipo_propulsao !== undefined) {
        if (!TIPOS_PROPULSAO_VALIDOS.includes(tipo_propulsao)) {
          return res.status(400).json({
            mensagem: `Valor inválido para "tipo_propulsao". Permitidos: ${TIPOS_PROPULSAO_VALIDOS.join(', ')}.`
          });
        }
        dadosAtualizacao.tipo_propulsao = tipo_propulsao;
      }

      if (ano_modelo !== undefined) {
        const parsedAno = Number(ano_modelo);
        if (!Number.isInteger(parsedAno) || parsedAno < 1900 || parsedAno > 2100) {
          return res.status(400).json({
            mensagem: 'O campo "ano_modelo" deve ser um ano válido entre 1900 e 2100.'
          });
        }
        dadosAtualizacao.ano_modelo = parsedAno;
      }

      if (preco_base !== undefined) {
        const parsedPreco = Number(preco_base);
        if (isNaN(parsedPreco) || parsedPreco < 0) {
          return res.status(400).json({
            mensagem: 'O campo "preco_base" deve ser um número decimal positivo.'
          });
        }
        dadosAtualizacao.preco_base = parsedPreco;
      }

      if (autonomia_km !== undefined) {
        if (autonomia_km === null) {
          dadosAtualizacao.autonomia_km = null;
        } else {
          const parsedAutonomia = Number(autonomia_km);
          if (!Number.isInteger(parsedAutonomia) || parsedAutonomia < 0) {
            return res.status(400).json({
              mensagem: 'O campo "autonomia_km" deve ser um número inteiro maior ou igual a zero ou nulo.'
            });
          }
          dadosAtualizacao.autonomia_km = parsedAutonomia;
        }
      }

      if (capacidade_bateria_kwh !== undefined) {
        if (capacidade_bateria_kwh === null) {
          dadosAtualizacao.capacidade_bateria_kwh = null;
        } else {
          const parsedCapacidade = Number(capacidade_bateria_kwh);
          if (isNaN(parsedCapacidade) || parsedCapacidade < 0) {
            return res.status(400).json({
              mensagem: 'O campo "capacidade_bateria_kwh" deve ser um número decimal maior ou igual a zero ou nulo.'
            });
          }
          dadosAtualizacao.capacidade_bateria_kwh = parsedCapacidade;
        }
      }

      if (status_producao !== undefined) {
        if (!STATUS_PRODUCAO_VALIDOS.includes(status_producao)) {
          return res.status(400).json({
            mensagem: `Valor inválido para "status_producao". Permitidos: ${STATUS_PRODUCAO_VALIDOS.join(', ')}.`
          });
        }
        dadosAtualizacao.status_producao = status_producao;
      }

      if (Object.keys(dadosAtualizacao).length === 0) {
        return res.status(400).json({
          mensagem: 'Nenhum campo válido fornecido para atualização.'
        });
      }

      const veiculoAtualizado = await VeiculoModel.update(parsedId, dadosAtualizacao);
      return res.status(200).json(veiculoAtualizado);
    } catch (error) {
      console.error('Erro ao atualizar veículo:', error);
      return res.status(500).json({
        mensagem: 'Erro interno no servidor ao atualizar veículo.'
      });
    }
  },

  /**
   * DELETE /veiculos/:id
   * Remove um veículo existente pelo ID.
   * Retorna status 200 com mensagem de confirmação ou status 404 se não encontrado.
   */
  async deletar(req, res) {
    try {
      const { id } = req.params;
      const parsedId = Number(id);

      if (!Number.isInteger(parsedId) || parsedId <= 0) {
        return res.status(400).json({
          mensagem: 'O parâmetro ID deve ser um número inteiro positivo.'
        });
      }

      const totalAfetados = await VeiculoModel.delete(parsedId);

      if (totalAfetados === 0) {
        return res.status(404).json({
          mensagem: 'Veículo não encontrado.'
        });
      }

      return res.status(200).json({
        mensagem: 'Veículo removido com sucesso.'
      });
    } catch (error) {
      console.error('Erro ao remover veículo:', error);
      return res.status(500).json({
        mensagem: 'Erro interno no servidor ao remover veículo.'
      });
    }
  }
};

module.exports = veiculosController;
