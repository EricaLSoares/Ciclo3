const express = require('express');
const cors = require('cors');
const {Sequelize} = require('./models'); 

const models=require('./models');
const {response, raw} = require ('express'); 

const app=express();
app.use(cors());
app.use(express.json());

let cliente = models.Cliente; 
let pedido = models.Pedido;
let itempedido = models.ItemPedido; 
let servico = models.Servico;

let compra = models.Compra;
let produto = models.Produto;
let itemcompra = models.ItemCompra; 

app.get('/', function(req,res){
    res.send('Seja bem vindo(a) a Services TI.')
});

// inserir nova compra 
app.post('/compras', async(req, res)=>{
    await compra.create(
        req.body
    ).then(function(){
        return res.json({
            error: false,
            message: "Compra criada com sucesso!"
        })
    }).catch(function(erro){
        return res.status(400).json({
            error: true,
            message: "Foi impossivel se conectar."
        })
    });
});

//inserir novo item compra
app.post('/itenscompra', async(req, res)=>{
    await itemcompra.create(
        req.body
    ).then(function(){
        return res.json({
            error: false,
            message: "Item compra criado com sucesso!"
        })
    }).catch(function(erro){
        return res.status(400).json({
            error: true,
            message: "Foi impossível se conectar."
        })
    });
}); 

// Inserir um novo produtos
app.post('/produtos', async(req, res)=>{
    await produto.create(
        req.body
    ).then(function(){
        return res.json({
            error: false,
            message: "Produto criado com sucesso!"
        })
    }).catch(function(erro){
        return res.status(400).json({
            error: true,
            message: "Foi impossivel se conectar."
        })
    });
});

// verificar lista de produtos
app.get('/listaprodutos', async(req, res)=>{
    await produto.findAll({
        raw: true
    }).then(function(produtos){
        res.json({produtos})
    });
});

//consultar item compra
app.get('/compras/:id', async(req, res)=>{
    await compra.findByPk(req.params.id,{include:[{all: true}]})
    .then(comp=>{
        return res.json({comp});
    })
}); 

//atualizar e editar produto
app.put('/atualizaproduto', async(req, res)=>{
    await produto.update(req.body,{
        where: {id: req.body.id}
    }).then(function(){
        return res.json({
            error: false,
            message: "Serviços foi alterado com sucesso!"
        });
    }).catch(function(erro){
        return res.status(400).json({
            error: true,
            message: "Erro na alteração do serviço."
        });
    });
});

//excluir alguma coisa 
app.get('/excluirprodutos/:id', async(req, res)=>{
    await produto.destroy({
        where: {id: req.params.id}
    }).then(function(){
        return res.json({
            error: false, 
            message: "Produto foi excluido com sucesso!"
        });
    }).catch(function(erro){
        return res.status(400).json({
            error: true,
            message: "Erro ao excluir o produto."
        });
    });
});

//Inserir um novo cliente
app.post('/Cliente', async(req, res)=>{
    await cliente.create(
        req.body
    ).then(function() {
        return res.json({
            error: false,
            message: "Cliente foi inserido com sucesso.", 
        })
    }).catch(function (erro){
        return res.status(400).json({
            error: true, 
            message: "Foi impossível se conectar."
        })
    });
});

//Inserir um novo serviço 
app.post('/servicos', async(req, res)=>{
    await servico.create(
        req.body
    ).then(function(){
        return res.json({
            error: false,
            message: "Serviço criado com sucesso!"
        })
    }).catch(function(erro){
        return res.status(400).json({
            error: true,
            message: "Foi impossivel se conectar."
        })
    });
});

//inserir novo pedido para um cliente existente
app.post('/Cliente/:id/pedido', async(req, res)=>{
    const ped = {
        data: req.body.data,
        ClienteId: req.params.id
    };

    if(! await cliente.findByPk(req.params.id)){
        return res.status(400).json({
            error: true, 
            message: "Clientes não existe."
        });
    };

    await pedido.create(ped)
       .then(pedcli =>{
           return res.json({
               error: false,
               message: "Pedido inserido com sucesso.",
               pedcli
           });
       }).catch(erro =>{
           return res.status(400).json({
               error: true, 
               message: "Não foi possivel inserir o pedido"
           });
       });
});

//exibir todos os clientes
app.get('/clientes', async(req, res)=>{
    await cliente.findAll()
    .then(cli =>{
        return res.json({
            error: false, 
            cli
        });
    }).catch((erro)=>{
        return res.status(400).json({
            error: true, 
            message: "Erro Conexão."
        });
    });
});

//Exibir todos os pedidos de um cliente
app.get('/cliente/:id/pedidos', async(req, res)=>{
    await pedido.findAll({
        where: {ClienteId: req.params.id}
    }).then(pedidos=>{
        return res.json({
            error: false,
            pedidos
        });
    }).catch(erro => {
       return res.status(400).json({
           error: true,
           message: "Não foi possível se conectar."
       });
    });
});

//Obter um pedido
app.get('/pedido/:id', async(req, res)=>{
    await pedido.findByPk(req.params.id)
    .then(ped=>{
        return res.json({
            error: false,
            ped
        });
    }).catch(erro=>{
        return res.status(400).json({
            error: true, 
            message: "Não foi possível se conectar."
        });
    });
}); 

//Alterar o pedido com base no id do pedido
app.put('/pedido/:id', async(req, res)=>{
    const ped = {
        id: req.params.id,
        ClienteId: req.body.ClienteId,
        data: req.body.data
    };

    if (! await cliente.findByPk(req.body.ClienteId)){
        return res.status(400).json({
            error: true,
            message: "Cliente não existe"
        });
    };
    await pedido.update(ped, {
        where: Sequelize.and({ClienteId: req.body.ClienteId},
            {id: req.params.id})
    }).then(pedido=>{
        return res.json({
            error: false, 
            message: "Pedido alterado com sucesso.", 
            pedido
        }); 
    }).catch(erro =>{
        return res.status(400).json({
            error: true, 
            message: "Não foi possível alterar."
        });
    });
});

//Inserir item Pedido
app.post('/itenspedido', async(req, res)=>{
    await itempedido.create(
        req.body
    ).then(function(){
        return res.json({
            error: false, 
            message: "Item criado com Sucesso!"
        })
    }).catch(function(erro){
        return res.status(400).json({
            error: true, 
            message: "Foi impossivel se conectar."
        })
    });
});

 app.get('/listaservicos', async(req, res)=>{
    await servico.findAll({
        raw: true
        //order: [['nome', 'ASC']]
    }).then(function(servicos){
        res.json({servicos})
    });
});

// ver todos os clientes
app.get('/listaclientes', async(req, res)=>{
    await cliente.findAll({
        raw: true
    }).then(function(clientes){
        res.json({clientes})
    });
});

//ver todos os pedidos 
app.get('/listapedidos', async(req, res)=>{
    await pedido.findAll({
        raw: true
    }).then(function(pedidos){
        res.json({pedidos})
    });   
});

//ver todos os serviços 
app.get('/ofertaservicos', async(req, res)=>{
    await servico.count('id').then(function(servicos){
        res.json({servicos});
    });
});

//consultar servico por cliente 
app.get('/servico/:id', async(req, res)=>{
    await servico.findByPk(req.params.id)
    .then(serv => {
        return res.json({
            error: false, 
            serv
        });
    }).catch(function(erro){
        return res.status(400).json({
            error: true, 
            message: "Erro: Não possível conectar!"
        });
    });
});

//atualizar e editar serviços
app.put('/atualizaservico', async(req, res)=>{
    await servico.update(req.body,{
        where: {id: req.body.id}
    }).then(function(){
        return res.json({
            error: false,
            message: "Serviços foi alterado com sucesso!"
        });
    }).catch(function(erro){
        return res.status(400).json({
            error: true,
            message: "Erro na alteração do serviço."
        });
    });
});

//verifica todos os dados dos pedidos 
app.get('/pedidos/:id', async(req, res)=>{
    await pedido.findByPk(req.params.id,{include:[{all: true}]})
    .then(ped=>{
        return res.json({ped});
    })
}); 

//editar itens 
app.put('/pedidos/:id/editaritem', async(req, res)=>{
    const item={
        quantidade: req.body.quantidade,
        valor: req.body.valor
    };

    if (!await pedido.findByPk(req.params.id)){
        return res.status(400).json({
            error: true,
            message: 'Pedido não foi encontrado.'
        });
    };

    if(!await servico.findByPk(req.body.ServicoId)){
        return res.status(400).json({
            error: true, 
            message: 'Serviço não foi encontrado.'
        });
    };
    
    await itempedido.update(item, {
        where: Sequelize.and({ServicoId: req.body.ServicoId},
            {PedidoId: req.params.id})
    }).then(function(itens){
        return res.json({
            error: false, 
            message: "Pedido foi alterado com sucesso!",
            itens
        });
    }).catch(function(erro){
        return res.status(400).json({
            error: true, 
            message: "Erro: não foi possível alterar."
        });
    });
});

//excluir sistema interno
app.get('/excluircliente/:id', async(req, res)=>{
    await cliente.destroy({
        where: {id: req.params.id}
    }).then(function(){
        return res.json({
            error: false, 
            message: "Cliente foi excluido com sucesso!"
        });
    }).catch(function(erro){
        return res.status(400).json({
            error: true,
            message: "Erro ao excluir o cliente."
        });
    });
});
   
let port = process.env.PORT || 3200;

app.listen(port, (req,res)=>{
    console.log('Servidor ativo: http://localhost:3200');
}); 

