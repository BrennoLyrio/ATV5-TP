import { Router } from 'express';
import {
  createConsumo,
  getConsumos,
  updateConsumo,
  deleteConsumo,
} from '../controllers/consumoController';

const router = Router();

router.post('/', createConsumo); // Criar um novo consumo
router.get('/', getConsumos); // Buscar todos os consumos
router.put('/:id', updateConsumo); // Atualizar um consumo
router.delete('/:id', deleteConsumo); // Deletar um consumo

export default router;
