import { Router } from 'express';
import {getProdutos,createProduto,updateProduto,deleteProduto} from '../controllers/produtoController';

const router = Router();

// Rota para listar todos os produtos
router.get('/', getProdutos);

// Rota para criar um novo produto
router.post('/', createProduto);

// Rota para atualizar um produto por ID
router.put('/:id', updateProduto);

// Rota para deletar um produto por ID
router.delete('/:id', deleteProduto);

export default router;
