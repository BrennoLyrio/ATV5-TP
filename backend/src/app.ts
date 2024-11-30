
import bodyParser from "body-parser";
import sequelize from "./config/connection";
import clienteRoutes from "./routes/clienteRoutes";
import produtoRoutes from "./routes/produtoRoutes";
import petRoutes from "./routes/petRoutes";
import servicoRoutes from "./routes/servicoRoutes";
import consumoRoutes from "./routes/consumoRoutes";
import listagemRoutes from "./routes/listagemRoutes";
import express from 'express';
const app = express()
const cors = require('cors')
// const bodyParser = require('body-parser')

app.use(cors())
// app.use(bodyParser.json());
app.use(express.urlencoded({extended: true}))
app.use(bodyParser.json())

const PORT = process.env.PORT || 5000;


//Rotas
app.use('/clientes', clienteRoutes)
app.use('/produtos', produtoRoutes);
app.use('/pets', petRoutes)
app.use('/servicos', servicoRoutes);
app.use('/consumos', consumoRoutes);
app.use('/listagem', listagemRoutes)


// Sync database and then start the server
sequelize.sync({ force: false })  // Altere para `true` se quiser recriar as tabelas durante o desenvolvimento
  .then(() => {
    console.log('Database synchronized');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Error syncing the database:', error);
  });