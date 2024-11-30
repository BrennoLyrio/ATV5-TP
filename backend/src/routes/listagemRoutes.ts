import { Router } from 'express';
import {
  clientesMaisConsumiramProdutos,
  clientesMaisConsumiramServicos,
  produtosMaisConsumidos,
  servicosMaisConsumidos,
  produtosPorPet,
  servicosPorPet,
  clientesMaisConsumiramEmValor,
} from '../controllers/listagemController';

const router = Router();

router.get('/clientes-mais-consumiram-produtos', clientesMaisConsumiramProdutos);
router.get('/clientes-mais-consumiram-servicos', clientesMaisConsumiramServicos);
router.get('/produtos-mais-consumidos', produtosMaisConsumidos);
router.get('/servicos-mais-consumidos', servicosMaisConsumidos);
router.get('/produtos-por-pet', produtosPorPet);
router.get('/servicos-por-pet', servicosPorPet);
router.get('/clientes-mais-consumiram-valor', clientesMaisConsumiramEmValor);

export default router;
