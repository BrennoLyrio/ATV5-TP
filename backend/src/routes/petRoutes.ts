import { Router } from 'express';
import {
  createPet,
  getPets,
  updatePet,
  deletePet,
} from '../controllers/petController';

const router = Router();

router.post('/', createPet); // Criar um novo pet
router.get('/', getPets); // Buscar todos os pets
router.put('/:id', updatePet); // Atualizar um pet
router.delete('/:id', deletePet); // Deletar um pet

export default router;
