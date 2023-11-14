import lvl1 from './levels/lvl1.json' assert { type: 'json' };

const canvas = document.getElementById('tela');
const contexto = canvas.getContext('2d');

const gravidade = 0.4;
const pulo = -11;
let velocidadePixel = 3;
let distancia = 0;
let vitoria = 0;
let colisaoEsq = 0;
let colisaoDir = 0;
let ultimaPosY;


//seleção de nível pode mudar esse valor
let nivel = lvl1



class Jogador {
    constructor(){
        this.pos = {
            x: 280,
            y: canvas.height - 200
        }

        this.vel = {
            x: 0,
            y: 0
        }

        this.largura = 16;
        this.altura = 32;
    }

    desenhar(){
        contexto.fillRect(this.pos.x, this.pos.y, this.largura, this.altura);
    }

    atualizar(){
        this.desenhar();

        this.pos.y += this.vel.y;
        this.pos.x += this.vel.x;

        if(this.pos.y + this.altura + this.vel.y <= canvas.height)
        {
            this.vel.y += gravidade;
        }
        else
        {
            this.vel.y = 0;
        }
        
    }
}

class Fundos{
    constructor(param=[]){
        this.pos = {
            x: param[0],
            y: param[1]
        }

        this.largura = param[2];
        this.altura = param[3];

        this.imagem = param[4];

        //dimensões e posições de origem
        // this.xOrigem = param[5];
        // this.yOrigem = param[6];

        // this.larguraOrigem = param[7];
        // this.alturaOrigem = param[8];
    }

    desenhar(){

        contexto.drawImage(this.imagem, //elemento html
        // this.xOrigem, this.yOrigem, 
        // this.larguraOrigem, this.alturaOrigem,
        this.pos.x, this.pos.y,
        this.largura, this.altura)
    }
}

class Meios{
    constructor(param=[]){
        this.pos = {
            x: param[0],
            y: param[1]
        }

        this.largura = param[2];
        this.altura = param[3];

        this.imagem = param[4];

        //dimensões e posições de origem
        // this.xOrigem = param[5];
        // this.yOrigem = param[6];

        // this.larguraOrigem = param[7];
        // this.alturaOrigem = param[8];
    }

    desenhar(){

        contexto.drawImage(this.imagem, //elemento html
        // this.xOrigem, this.yOrigem, 
        // this.larguraOrigem, this.alturaOrigem,
        this.pos.x, this.pos.y,
        this.largura, this.altura)
    }
}

class Plataforma{
    constructor(param=[]){
        this.pos = {
            x: param[0],
            y: param[1]
        }

        this.largura = param[2];
        this.altura = param[3];

        this.imagem = param[4];

        //dimensões e posições de origem
        this.xOrigem = param[5];
        this.yOrigem = param[6];

        this.larguraOrigem = param[7];
        this.alturaOrigem = param[8];
    }

    desenhar(){

        contexto.drawImage(this.imagem, //elemento html
        this.xOrigem, this.yOrigem, 
        this.larguraOrigem, this.alturaOrigem,
        this.pos.x, this.pos.y,
        this.largura, this.altura)
    }
}

class Cenarios{
    constructor(param=[]){
        this.pos = {
            x: param[0],
            y: param[1]
        }

        this.largura = param[2];
        this.altura = param[3];

        this.imagem = param[4];

        //dimensões e posições de origem
        this.xOrigem = param[5];
        this.yOrigem = param[6];

        this.larguraOrigem = param[7];
        this.alturaOrigem = param[8];
    }

    desenhar(){

        contexto.drawImage(this.imagem, //elemento html
        this.xOrigem, this.yOrigem, 
        this.larguraOrigem, this.alturaOrigem,
        this.pos.x, this.pos.y,
        this.largura, this.altura)
    }
}



function construirObjetos(lvl, arr1,arr2,arr3, arr4)
{
    lvl.plataformas.forEach(info =>{

        const imagem = new Image()
        imagem.src = "./img/" + info.textura + ".png";

        let param = 
        [
            info.pos.x, info.pos.y, 
            info.dimensoes.largura, info.dimensoes.altura, 
            imagem,
            info.origem.x, info.origem.y,
            info.origem.largura, info.origem.altura
        ]
        let plat = new Plataforma(param)
        arr1.push(plat)
    })

    lvl.cenarios.forEach(info =>{

        const imagem = new Image()
        imagem.src = "./img/" + info.textura + ".png";

        let param = 
        [
            info.pos.x, info.pos.y, 
            info.dimensoes.largura, info.dimensoes.altura, 
            imagem,
            info.origem.x, info.origem.y,
            info.origem.largura, info.origem.altura
        ]
        let cen = new Cenarios(param)
        arr2.push(cen)
    })
    lvl.fundos.forEach(info =>{

        const imagem = new Image()
        imagem.src = "./img/" + info.textura + ".png";

        let param = 
        [
            info.pos.x, info.pos.y, 
            info.dimensoes.largura, info.dimensoes.altura, 
            imagem,
            info.origem.x, info.origem.y,
            info.origem.largura, info.origem.altura
        ]
        let fun = new Fundos(param)
        arr3.push(fun)
    })
    lvl.meios.forEach(info =>{

        const imagem = new Image()
        imagem.src = "./img/" + info.textura + ".png";

        let param = 
        [
            info.pos.x, info.pos.y, 
            info.dimensoes.largura, info.dimensoes.altura, 
            imagem,
            info.origem.x, info.origem.y,
            info.origem.largura, info.origem.altura
        ]
        let mei = new Fundos(param)
        arr4.push(mei)
    })
}

let plataformas = [];
let cenarios = [];
let fundos = [];
let meios = [];

construirObjetos(nivel, plataformas, cenarios, fundos, meios)

let jogador = new Jogador();

function iniciar()
{
    jogador = new Jogador();
    plataformas = [];
    cenarios = [];
    fundos = [];
    meios = [];
    construirObjetos(nivel, plataformas, cenarios, fundos, meios)

}

const teclas = {
    esquerda: false,
    direita: false,
    pulo: false,
    acao: false
}


//pressionar tecla
window.addEventListener('keydown',evento=>{
    // console.log(evento.keyCode)
    switch(evento.keyCode)
    {
        case 32: //espaço
        case 87: // W
            // console.log("jump press");
            if(jogador.vel.y == 0)
            {
                jogador.vel.y += pulo;
            }
            
        break;

        case 65: //A
            // console.log("left press");
            teclas.esquerda = true;
        break;
        
        case 68: //D
            // console.log('right press');
            teclas.direita = true;
        break;

        case 83: //S
            // console.log('action press');
            teclas.acao = true;
        break;
    }   
});
//soltar tecla
window.addEventListener('keyup',evento=>{
    switch(evento.keyCode)
    {
        case 32: //espaço
        case 87: // W
            // console.log("jump rel");
        break;

        case 65: //A
            // console.log("left rel");
            teclas.esquerda = false;
        break;
        
        case 68: //D
            // console.log('right rel');
            teclas.direita = false;
        break;

        case 83: //S
            // console.log('action rel');
            teclas.acao = false;
        break;
    }   
});

function animar()
{
    
    requestAnimationFrame(animar)
    contexto.clearRect(0,0,canvas.clientWidth, canvas.height);
    fundos.forEach(fundo =>{
        fundo.desenhar();
    });
    meios.forEach(meio =>{
        meio.desenhar();
    });
    cenarios.forEach(cenario =>{
        cenario.desenhar();
    });
    plataformas.forEach(plataforma =>{
        plataforma.desenhar();
    });
    
    jogador.atualizar();

    if(teclas.direita && jogador.pos.x < canvas.width / 2.5)
    {
        jogador.vel.x = velocidadePixel;
    }
    else if(teclas.esquerda && jogador.pos.x > canvas.width / 3)
    {
        jogador.vel.x = -velocidadePixel;
    }
    else
    {
        jogador.vel.x = 0;

        if(teclas.direita && colisaoEsq ==0)
        {
            distancia += velocidadePixel;
            plataformas.forEach(plataforma =>{
                plataforma.pos.x -= velocidadePixel;
            });
            cenarios.forEach(cenario =>{
                cenario.pos.x -= velocidadePixel;
            });
            meios.forEach(meio =>{
                meio.pos.x -= velocidadePixel / 3;
            });
        }
        else if(teclas.esquerda && colisaoDir ==0)
        {
            distancia -= velocidadePixel;
            plataformas.forEach(plataforma =>{
                plataforma.pos.x += velocidadePixel;
            });
            cenarios.forEach(cenario =>{
                cenario.pos.x += velocidadePixel;
            });
            meios.forEach(meio =>{
                meio.pos.x += velocidadePixel / 3;
            });
        }
    }

    //colisão das plataformas
    plataformas.forEach(plataforma =>{
        if( //cima pra baixo
            jogador.pos.y + jogador.altura <= plataforma.pos.y && 
            jogador.pos.y + jogador.altura + jogador.vel.y >= plataforma.pos.y &&
            jogador.pos.x + jogador.largura >= plataforma.pos.x &&
            jogador.pos.x <= plataforma.pos.x + plataforma.largura
        )
        {
            jogador.vel.y = 0;
        }

        else if( // baixo pra cima
        jogador.pos.y >= plataforma.pos.y + plataforma.altura && 
        jogador.pos.y + jogador.vel.y <= plataforma.pos.y + plataforma.altura &&
        jogador.pos.x + jogador.largura >= plataforma.pos.x &&
        jogador.pos.x <= plataforma.pos.x + plataforma.largura
        )
        {
            jogador.vel.y = 0;
        }

        if( //esquerda pra direita
            jogador.pos.x + jogador.largura <= plataforma.pos.x + velocidadePixel&&
            jogador.pos.x + jogador.largura + velocidadePixel >= plataforma.pos.x &&
            jogador.pos.y + jogador.altura >= plataforma.pos.y &&
            jogador.pos.y <= plataforma.pos.y + plataforma.altura &&
            teclas.direita
        )
        {
            ultimaPosY = jogador.pos.y;
            colisaoEsq = 1;
            jogador.vel.x = 0;
        }
        else if (teclas.esquerda || 
            jogador.pos.y >= ultimaPosY +32 ||
            jogador.pos.y <= ultimaPosY -32)
        {
            colisaoEsq = 0;
        }

        if( //direita pra esquerda
            jogador.pos.x >= plataforma.pos.x + plataforma.largura &&
            jogador.pos.x + jogador.vel.x + jogador.largura <= plataforma.pos.x &&
            jogador.pos.y + jogador.altura >= plataforma.pos.y &&
            jogador.pos.y <= plataforma.pos.y + plataforma.altura
        )
        {
            ultimaPosY = jogador.pos.y;
            colisaoDir = 1;
            jogador.vel.x = 0;
        }
        else if (teclas.direita || 
            jogador.pos.y >= ultimaPosY +32 ||
            jogador.pos.y <= ultimaPosY -32)
        {
            colisaoDir = 0;
        }
        
    });

    if(distancia > nivel.fim && vitoria == 0)
    {
        console.log('vitoria')
        vitoria = 1
    }
    if(teclas.acao)
    {
        iniciar()
    }
    if(colisaoDir)
    {
        console.log(colisaoDir)
    }
}
animar();
