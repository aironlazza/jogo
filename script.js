import lvl1 from './levels/lvl1.json' assert { type: 'json' };

const canvas = document.getElementById('tela');
const contexto = canvas.getContext('2d');

const gravidade = 0.4;
const pulo = -11;
const velocidadePixel = 3;
let distancia = 0;
let vitoria = 0;
let colisaoEsq = 0;
let colisaoDir = 0;
let ultimaPosY;
let tempo = Date.now()
let delay = 200;
let ultimaTecla = 1;
let jogando = 0;



const fundoMenu = new Image()
fundoMenu.src = './img/menu/fundo.png'

const chimarrao = new Image()
chimarrao.src = './img/menu/chimarrao.png'

const quest = new Image()
quest.src = './img/menu/quest.png'

//seleção de nível vai decidir esse valor futuramente
let nivel = lvl1



class Jogador {
    constructor(){
        this.pos = {
            x: 50,
            y: 250
        }

        this.vel = {
            x: 0,
            y: 0
        }

        this.largura = 32;
        this.altura = 64;

        //sprite

        this.imagem = new Image();

        this.sprites = 
        {
            parado: 
            {
                esq: './img/jogador/parado-esq.png',
                dir: './img/jogador/parado-dir.png'
            },
                
            correndo:
            {
                esq: 0,
                dir: './img/jogador/correndo-dir.png'
            }
        }

        this.imagem.src = this.sprites.parado.dir

        this.frame = 0;

    }

    desenhar(){
        contexto.drawImage(this.imagem, //elemento html
        34 + (100 * this.frame), 0, //posicao origem
        32, 64, //dimensoes origem
        this.pos.x, this.pos.y, //posicao destino
        this.largura, this.altura); //dimensoes destino
    }

    atualizar(){
        
        if(Date.now() - tempo >= delay)
        {
            this.frame++;
            if(this.frame > 3)
            {
                this.frame = 0;
            }
            tempo = Date.now()
        }
        
        if(ultimaTecla)
        {
            this.imagem.src = this.sprites.parado.dir
        }
        else
        {
            this.imagem.src = this.sprites.parado.esq
        }

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

let plataformas;
let cenarios;
let fundos;
let meios;
let jogador;

function iniciarJogo()
{
    distancia = 0;
    vitoria = 0;
    jogador = new Jogador();
    plataformas = [];
    cenarios = [];
    fundos = [];
    meios = [];
    construirObjetos(nivel, plataformas, cenarios, fundos, meios)

    jogando = 1;
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
            ultimaTecla = 0;
        break;
        
        case 68: //D
            // console.log('right press');
            teclas.direita = true;
            ultimaTecla = 1;
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



let larg;
let alt;
let xis;
let yps;
let i;
let half;
let opacidadeChi;
let opacidadeQue;

function iniciarMenu()
{

     larg = 600;
     alt = 400;
     xis=0;
     yps = 0;
     i = 0;
     half = 0.005;
     opacidadeChi = 0.05;
     opacidadeQue = 0.05;
}

iniciarMenu()

function animar()
{
    
    requestAnimationFrame(animar)
    contexto.clearRect(0,0,canvas.width, canvas.height);
    
    if(jogando==1)
    {
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
            else if (
                jogador.pos.y >= ultimaPosY +32 ||
                jogador.pos.y <= ultimaPosY -32)
            {
                colisaoEsq = 0;
            }
    
            if( //direita pra esquerda
                jogador.pos.x >= plataforma.pos.x + plataforma.largura &&
                jogador.pos.x - velocidadePixel <= plataforma.pos.x + plataforma.largura &&
                jogador.pos.y + jogador.altura >= plataforma.pos.y &&
                jogador.pos.y <= plataforma.pos.y + plataforma.altura &&
                teclas.esquerda
            )
            {
                ultimaPosY = jogador.pos.y;
                colisaoDir = 1;
                jogador.vel.x = 0;
            }
            else if (
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
            iniciarJogo()
        }
    }
    if(i<120)
    {
        yps = yps - (half*4)
        xis= xis - (half*6)
        larg= larg + (half*12)
        alt= alt + (half*8)

        half = half +0.002
    }
    else if (i<123) half = 0.1;
    else if(i<220)
    {
        
        yps = yps + (half*4)
        xis= xis + (half*6)
        larg= larg - (half*12)
        alt= alt - (half*8)

        half = half - 0.001
    }
    else if(i<350)
    {
        yps = yps + half
        alt= alt + half

        half = half + 0.002
    }
    else if(half>0)
    {
        yps = yps + half
        alt= alt + half

        half = half - 0.002
    }
    contexto.drawImage(fundoMenu, xis, yps, larg, alt)

    
    if(i>335)
    {
        contexto.globalAlpha = opacidadeChi;
        contexto.drawImage(chimarrao,0,0)
        contexto.globalAlpha = 1;
        if(opacidadeChi<1) opacidadeChi += 0.01;
    }
    if(i>435)
    {
        contexto.globalAlpha = opacidadeQue;
        contexto.drawImage(quest,0,0)
        contexto.globalAlpha = 1;
        if(opacidadeQue<1) opacidadeQue += 0.01;
    }

    i++;
    
}

animar();

