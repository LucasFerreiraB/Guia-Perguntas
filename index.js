const express = require('express'); //Importando    
const app = express(); //Instanciando
const bodyParser = require('body-parser');
const connection = require('./database/database');
const Pergunta = require('./database/Pergunta'); //Pegando o Model
const Resposta = require('./database/Resposta');

//Database
connection
    .authenticate()
    .then(() => {
        console.log('Conexão feita com sucesso!')
    })
    .catch((msgErro) => {
        console.log(msgErro);
    });

app.set('view engine', 'ejs'); //Estou dizendo para o Express usar o EJS como View Engine
app.use(express.static('public')); //Aceitando arquivos staticos

//Body Parser
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
/*app.get('/:name/:lang', (req, res) => { 
    var name = req.params.name;
    var lang = req.params.lang;
    var exibirMsg = true;

    var produtos = [
        {nome: 'Doritos', preco: 3.14},
        {nome: 'Coca', preco:5},
        {nome: 'Leite', preco: 1.45}
    ];

    res.render('index', { //Quando o usuário acessar a rota, o express vai renderizar o arquivo HTML na tela para o usuário.
        name: name,
        lang: lang,
        empresa: 'PURP',
        integrantes: 6,
        msg: exibirMsg,
        produtos: produtos
    });    
});*/

//Rotas
app.get('/', (req, res) => {
    Pergunta.findAll({raw: true, order: [  //Equivalente = SELECT * ALL FROM pergunta
        ['id', 'DESC'] // ASC = Crescente - DESC = Decrescente
    ]}).then(pergunta => { 
        res.render('index', {
            pergunta: pergunta
        });
    });  
});

app.get('/perguntar', (req, res) => {
    res.render('perguntar');
})

app.post('/salvarpergunta', (req, res) => {
    var titulo = req.body.titulo;
    var descricao = req.body.descricao;
    Pergunta.create({       //Equivalente ao INSERT INTO
        titulo: titulo,
        descricao: descricao
    }).then(() => {
        res.redirect('/');
    });
});


app.get('/pergunta/:id', (req, res) => {
    var id = req.params.id;
    Pergunta.findOne({  //Pesquisa uma pergunta no banco de dados
        where: {id: id}
    }).then(pergunta => {
        if(pergunta != undefined){ //Pergunta encontrada
            Resposta.findAll({
                where: {perguntaId: pergunta.id},
                order: [['id', 'DESC']]
            }).then(respostas => {
                res.render('pergunta', {
                    pergunta: pergunta,
                    respostas: respostas
                }); 
            })

            
        }else{ //Não encontrada
            res.redirect('/');
        }
    });
});

app.post('/responder', (req, res) => {
    var corpo = req.body.corpo;
    var perguntaId = req.body.pergunta;
    Resposta.create({
        corpo: corpo,
        perguntaId: perguntaId
    }).then(() => {
        res.redirect('/pergunta/'+perguntaId);
    });
});

app.listen(3000, () => { //Rodando o app
    console.log('App rodando!');
});