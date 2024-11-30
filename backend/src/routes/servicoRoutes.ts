import { Router } from 'express';
import {
  createServico,
  getServicos,
  updateServico,
  deleteServico,
} from '../controllers/servicoController';

const router = Router();

router.post('/', createServico); // Criar um novo serviço
router.get('/', getServicos); // Buscar todos os serviços
router.put('/:id', updateServico); // Atualizar um serviço
router.delete('/:id', deleteServico); // Deletar um serviço

export default router;
