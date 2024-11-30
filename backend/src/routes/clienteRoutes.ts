import { Router } from "express";
import { createCliente, deleteCliente, getClientes, updateCliente, getClienteById } from "../controllers/clienteController";

const router = Router();

router.get('/', getClientes); //Rota para listar clientes

router.post('/', createCliente); //Rota para criar cliente

router.get('/:id', getClienteById); // Busca cliente por ID

// Rota para atualizar um cliente por ID
router.put('/:id', updateCliente);

// Rota para deletar um cliente por ID
router.delete('/:id', deleteCliente);

export default router