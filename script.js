import lvl1 from './levels/lvl1.json' assert { type: 'json' };

const canvas = document.getElementById('tela');
const contexto = canvas.getContext('2d');

const gravidade = 0.4;
const pulo = -10;
const velocidadePixel = 3;
let distancia = 240;
let vitoria = 0;
let colisaoEsq = 0;
let colisaoDir = 0;
let ultimaPosY;
let ultimaTecla = 1;
let correndo = 0;
let jogando = 0;
let checkpoint = 0;
let delayAtaque = 0;
let cooldown = 0;
let delayFPS = Date.now()

const fundoMenu = new Image();
fundoMenu.src = './img/menu/fundo.png';

const chimarrao = new Image();
chimarrao.src = './img/menu/chimarrao.png';

const quest = new Image();
quest.src = './img/menu/quest.png';

const butiaHud = new Image();
butiaHud.src = './img/butia.png';

let musicaMenu = new Audio('./audio/musica-menu.mp3')
musicaMenu.loop = true;

let musicaJogo = new Audio('./audio/musica-jogo.mp3')
musicaJogo.loop = true;

//seleção de nível vai decidir esse valor futuramente
let nivel = lvl1

musicaMenu.play()

class Jogador {
    constructor(){
    
        this.pos = {
            x: 50,
            y: 250
        }

        this.spawn = true;

        this.vel = {
            x: 0,
            y: 0
        }

        this.largura = 40;
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
                esq: './img/jogador/correndo-esq.png',
                dir: './img/jogador/correndo-dir.png'
            },
            pulo:
            {
                esq: './img/jogador/pulo-esq.png',
                dir: './img/jogador/pulo-dir.png'
            },
            hit:'./img/jogador/hit.png'
        }

        this.imagem.src = this.sprites.parado.dir;

        this.frame = 0;

        this.tempo = Date.now();

        this.hit = false;
        this.vivo = true;

        this.butias = 0;
        this.deltaButias = this.butias;

        this.espeto = 
        {
            equip: false,
            atacando: false,
            sprites: 
            {
                parado:
                {
                    esq: './img/jogador/espeto-parado-esq.png',
                    dir: './img/jogador/espeto-parado-dir.png'
                },
                ataque:
                {
                    esq: './img/jogador/espeto-ataque-esq.png',
                    dir: './img/jogador/espeto-ataque-dir.png'
                }
            },
            imagem: new Image(),
            largura: 42,
            altura: 64,
            posX: 36,
            frame: 0,
            vari: 100
        }
        this.espeto.imagem.src = this.espeto.sprites.parado.dir;

    }

    desenhar(){
        contexto.drawImage(this.imagem, //elemento html
        0 + (100 * this.frame), 0, //posicao origem
        40, 64, //dimensoes origem
        this.pos.x, this.pos.y, //posicao destino
        this.largura, this.altura); //dimensoes destino

        if(this.espeto.equip)
        {
            contexto.drawImage(this.espeto.imagem, //elemento html
            0 + (this.espeto.frame * this.espeto.vari), 0, //posicao origem
            42, 64, //dimensoes origem
            this.pos.x + this.espeto.posX, this.pos.y, //posicao destino
            42, 64); //dimensoes destino
        }
    }

    atualizar(){
        
        if(Date.now() - this.tempo >= 200 && this.hit == false)
        {
            this.frame++;
            this.espeto.frame++;
           
            if(this.frame > 3)
            {
                this.frame = 0;
                this.espeto.frame = 0;
            }
            this.tempo = Date.now()
        }
        this.espeto.vari = 100;
        this.espeto.posX = 36
        if(ultimaTecla && this.vel.y < 0)
        {
            this.imagem.src = this.sprites.pulo.dir
            this.espeto.imagem.src = this.espeto.sprites.parado.dir;
            this.espeto.frame = 0;
        }
        else if(this.vel.y < 0)
        {
            this.imagem.src = this.sprites.pulo.esq
            this.espeto.imagem.src = this.espeto.sprites.parado.esq;
            this.espeto.frame = 0;
            this.espeto.posX = -34;
        }
        else if(correndo && teclas.direita)
        {
            this.imagem.src = this.sprites.correndo.dir
            if(this.frame==2)this.espeto.frame = 0;
            if (this.frame==3)this.espeto.frame = 1;
            this.espeto.vari = 200;
            this.espeto.imagem.src = this.espeto.sprites.parado.dir;
        }
        else if(correndo && teclas.esquerda)
        {
            this.imagem.src = this.sprites.correndo.esq
            if(this.frame==2)this.espeto.frame = 0;
            if (this.frame==3)this.espeto.frame = 1;
            this.espeto.vari = 200;
            this.espeto.posX = -34;

            this.espeto.imagem.src = this.espeto.sprites.parado.esq
            
        }
        else if(ultimaTecla)
        {
            this.imagem.src = this.sprites.parado.dir
            this.espeto.imagem.src = this.espeto.sprites.parado.dir
        }
        else
        {
            this.imagem.src = this.sprites.parado.esq
            this.espeto.imagem.src = this.espeto.sprites.parado.esq
            this.espeto.posX = -34;
        }
        
        if(this.espeto.atacando && delayAtaque <= 15)
        {
            if(ultimaTecla)
            {
                this.espeto.imagem.src = this.espeto.sprites.ataque.dir;
            }
            else
            {
                this.espeto.imagem.src = this.espeto.sprites.ataque.esq;
            }
            delayAtaque++;
        }
        else if(this.espeto.atacando)
        {
            cooldown = 0;
            delayAtaque = 0;
            this.espeto.atacando = false;
            
        }
        else
        {
            if(cooldown<=13) cooldown++;
        }

        if(teclas.acao && this.espeto.equip && cooldown>=13)
        {
            
            this.espeto.atacando = true;
        }

        if(this.butias<0)
        {
            iniciarJogo(); 
        }
        if(this.hit)
        {
            if(Date.now() - this.tempo <= 700)
            {
                this.frame = 0;
                this.imagem.src = this.sprites.hit;
            }
            else
            {
                this.butias-=1;
                this.tempo = Date.now();
                this.hit = false;
            }
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
            iniciarJogo(); 
        }
        
    }
}


class Inimigos {
    constructor(param=[]){
        this.pos = {
            x: param[0],
            y: param[1]
        }

        this.vel = {
            x: param[2],
            y: param[3]
        }

        this.largura = param[4];
        this.altura = param[5];

        //sprite

        this.imagem = new Image();

        this.sprites = 
        {
            dir: "./img/inimigos/" + param[6]+".png",
            esq: "./img/inimigos/" + param[7]+".png",
            hit:"./img/inimigos/" + param[8]+".png"
        }

        this.direcao = true;

        this.imagem.src = this.sprites.dir;

        this.frame = 0;

        this.tempo = Date.now()

        this.frameMax = param[9];

        this.larguraOrigem = param[10];
        this.alturaOrigem = param[11];

        this.vida = param[12];
        this.deltaVida = this.vida;
        this.vivo = true;
        this.hit = false;
        this.butia = true;
    }

    desenhar(){
        contexto.drawImage(this.imagem, //elemento html
        (100 * this.frame), 0, //posicao origem
        this.larguraOrigem, this.alturaOrigem, //dimensoes origem
        this.pos.x, this.pos.y, //posicao destino
        this.largura, this.altura); //dimensoes destino
    }

    atualizar(){
        
        

        if(Date.now() - this.tempo >= 200)
        {
            this.frame++;
            if(this.frame > this.frameMax)
            {
                this.frame = 0;
            }
            this.tempo = Date.now()
        }

        
        if(this.vida>0)
        {
            if(this.direcao)
            {
                this.imagem.src = this.sprites.dir
            }
            else
            {
                this.imagem.src = this.sprites.esq
            }
        }

        if(this.vida<this.deltaVida)
        {
            this.frame=0;
            this.imagem.src = this.sprites.hit;
            this.hit = true
        }
        else if(this.vida<0)
        {
            this.hit = false;
            this.vivo = false;
        }
        else
        {
            this.hit = false;
        }

        

        this.deltaVida = this.vida;

        if(this.vivo)
        this.desenhar();

        this.pos.y += this.vel.y;
        this.pos.x += this.vel.x;

        this.vel.y += gravidade;
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
class Butias{
    constructor(param=[]){
        this.pos = {
            x: param[0],
            y: param[1]
        }
        this.largura = 20;
        this.altura = 20;

        this.pego = false;
        this.t = true;

        this.sprites = 
        [
            './img/butia-sumindo.png',
            './img/butia.png'
        ]
        this.imagem = new Image();
        this.imagem.src = './img/butia.png';
        this.frames = 0;
        this.ativo = true;

    }
    desenhar(){
        if(this.pego)
        {
            contexto.drawImage(this.imagem, //elemento html
            6 + (14*this.frames), 2, 
            18, 16,
            this.pos.x, this.pos.y,
            18, 16)
        }
        else
        {
            contexto.drawImage(this.imagem, this.pos.x, this.pos.y)
        }
    }

    atualizar(){
        this.frames++;
        if(this.pego)
        {
            if(this.t)
            {
                this.frames = 0;
                this.t = false;
            }
            
            

            if(this.frames>5)
            {
                this.ativo = false;
            }
        }
        else if(this.ativo)
        {
            if(this.frames>50)
            {
                this.frames = 0;
            }
            else if(this.frames>25)
            {
                this.pos.y -= 0.2;
            }
            else
            {
                this.pos.y += 0.2;
            }
        }
        

        this.desenhar();
    }
}

class Itens{ //espeto e portal
    constructor(x,y,src,maxFrames){
        this.pos = {
            x: x,
            y: y
        }

        this.imagem = new Image();
        this.imagem.src = src
        this.frames = 0;
        this.ativo = true;
        this.maxFrames = maxFrames

    }
    desenhar(){
        if(this.maxFrames==0)
        contexto.drawImage(this.imagem, this.pos.x, this.pos.y)

        else
        {
            contexto.drawImage(this.imagem, //elemento html
            32*this.frames, 0, 
            32, 32,
            this.pos.x, this.pos.y,
            64, 64)
        }
        
    }

    atualizar(){
        
        if(this.ativo)
        {
            if(this.maxFrames==0)
            {
                this.frames++;
                if(this.frames>50)
                {
                    this.frames = 0;
                }
                else if(this.frames>25)
                {
                    this.pos.y -= 0.2;
                }
                else
                {
                    this.pos.y += 0.2;
                }
                this.desenhar();
            }
        }
        if(this.maxFrames!=0)
        {
            this.frames++;
            if(this.frames>this.maxFrames)
            this.frames=0;
            this.desenhar();
        }
            
    
    }
}



function construirObjetos(lvl, arr1,arr2,arr3, arr4, arr5,arr6)
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
    lvl.inimigos.forEach(info =>{

        const imagem = new Image()
        imagem.src = "./img/inimigos/" + info.sprites.dir + ".png";

        let param = 
        [
            info.pos.x, info.pos.y, 
            info.vel.x, info.vel.y,
            info.dimensoes.largura, info.dimensoes.altura, 
            info.sprites.dir,info.sprites.esq, info.sprites.hit,
            info.frameMax,
            info.origem.largura, info.origem.altura,
            info.vida
        ]
        let ini = new Inimigos(param)
        arr5.push(ini)
    })
    lvl.butias.forEach(info=>{
        let param =
        [
            info.pos.x, info.pos.y
        ]
        let but = new Butias(param)
        arr6.push(but)
    })
                    
}

let plataformas;
let cenarios;
let fundos;
let meios;
let jogador;
let inimigos;
let butias;
let espeto;
let portal;

function iniciarJogo()
{
    distancia = 240;
    vitoria = 0;
    butias = 0;
    jogador = new Jogador();
    espeto = new Itens(1930,300,'./img/espeto-item.png',0);
    portal = new Itens(4080,300,'./img/portal.png',11)
    plataformas = [];
    cenarios = [];
    fundos = [];
    meios = [];
    inimigos = [];
    butias = [];
    construirObjetos(nivel, plataformas, cenarios, fundos, meios, inimigos, butias)

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
            evento.preventDefault();
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

//variáveis menu

let larg;
let alt;
let xis;
let yps;
let i;
let half;
let opacidadeChi;
let opacidadeQue;
let chimas;

let botaoJogar = 
{
    x: 210,
    y: 500,
    largura: 180,
    altura:60,
    pronto:0,
    pressionado:0
}

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

    botaoJogar = 
    {
        x: 210,
        y: 500,
        largura: 180,
        altura:60,
        pronto:0,
        pressionado:0
    }
}

canvas.addEventListener("click", function(evento){
    if(botaoJogar.pronto)
    {
        
        let x = evento.offsetX;
        let y = evento.offsetY;
        
        if(x>canvas.offsetWidth * 0.35 &&
            x< canvas.offsetWidth * 0.35 + canvas.offsetWidth * 0.3 &&
            y>canvas.offsetHeight * 0.45 &&
            y<canvas.offsetHeight * 0.45 + canvas.offsetHeight * 0.15)
        {
            botaoJogar.pressionado = 1;
        }
    }
    
})

function animar()
{
    
    requestAnimationFrame(animar)
    if(Date.now() - delayFPS >10)
    {
        contexto.clearRect(0,0,canvas.width, canvas.height);
    
        if(jogando)
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
            
            butias.forEach(butia=>{
                if(butia.ativo)
                butia.atualizar();
            })
        
            inimigos.forEach(inimigo =>{
                inimigo.atualizar();
            });

            espeto.atualizar();
            portal.atualizar();
            jogador.atualizar();

            if(distancia>500)jogador.spawn = false;

            if(checkpoint == 1 && jogador.spawn)
            {
                jogador.pos.y = 250;
                
                distancia = 1896;
                plataformas.forEach(plataforma =>{
                    plataforma.pos.x -= 1656;
                });
                cenarios.forEach(cenario =>{
                    cenario.pos.x -= 1656;
                });
                meios.forEach(meio =>{
                    meio.pos.x -= 1656 / 3;
                });
                inimigos.forEach(inimigo =>{
                    inimigo.pos.x -= 1656;
                });
                butias.forEach(butia =>{
                    if(butia.ativo)
                    butia.pos.x -= 1656;
                });
                if(espeto.ativo)
                espeto.pos.x -=1656;
                
                portal.pos.x -=1656;


                jogador.spawn = false;
            }
            if(checkpoint == 2 && jogador.spawn)
            {
                jogador.pos.y = 300;
                
                distancia = 4079;
                plataformas.forEach(plataforma =>{
                    plataforma.pos.x -= 3839;
                });
                cenarios.forEach(cenario =>{
                    cenario.pos.x -= 3839;
                });
                meios.forEach(meio =>{
                    meio.pos.x -= 3839 / 3;
                });
                inimigos.forEach(inimigo =>{
                    inimigo.pos.x -= 3839;
                });
                butias.forEach(butia =>{
                    if(butia.ativo)
                    butia.pos.x -= 3839;
                });
                espeto.ativo = false;
                jogador.espeto.equip = true;
                portal.pos.x -=3839;

                jogador.spawn = false;
            }

            if(portal.ativo == false)
            {
                distancia += 430;
                plataformas.forEach(plataforma =>{
                    plataforma.pos.x -= 430;
                });
                cenarios.forEach(cenario =>{
                    cenario.pos.x -= 430;
                });
                meios.forEach(meio =>{
                    meio.pos.x -= 430 / 3;
                });
                inimigos.forEach(inimigo =>{
                    inimigo.pos.x -= 430;
                });
                butias.forEach(butia =>{
                    if(butia.ativo)
                    butia.pos.x -= 430;
                });
                portal.ativo = true;
            }
        
            if(teclas.direita && jogador.pos.x < canvas.width / 2.5 )
            {
                correndo = 1;
                jogador.vel.x = velocidadePixel;
            }
            else if(teclas.esquerda && jogador.pos.x > canvas.width / 3 || teclas.esquerda && distancia<=240 && jogador.pos.x>0)
            {
                correndo = 1;
                jogador.vel.x = -velocidadePixel;
            }
            else
            {
                jogador.vel.x = 0;
        
                if(teclas.direita && colisaoEsq ==0)
                {
                    correndo = 1;
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
                    inimigos.forEach(inimigo =>{
                        inimigo.pos.x -= velocidadePixel;
                    });
                    butias.forEach(butia =>{
                        if(butia.ativo)
                        butia.pos.x -= velocidadePixel;
                    });
                    if(espeto.ativo)
                    espeto.pos.x -=velocidadePixel;
                    portal.pos.x -=velocidadePixel;

                    if(inimigos[3].vivo == false && vitoria ==1)
                    chimas.pos.x-=velocidadePixel;
                }
                else if(teclas.esquerda && colisaoDir ==0 && jogador.pos.x>0)
                {
                    correndo = 1;
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
                    inimigos.forEach(inimigo =>{
                        inimigo.pos.x += velocidadePixel;
                    });
                    butias.forEach(butia =>{
                        butia.pos.x += velocidadePixel;
                    });
                    if(espeto.ativo)
                    espeto.pos.x +=velocidadePixel;
                    portal.pos.x +=velocidadePixel;

                    if(inimigos[3].vivo == false && vitoria ==1)
                    chimas.pos.x +=velocidadePixel;
                }
                else
                {
                    correndo = 0;
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

                //colisao inimigos
                inimigos.forEach(inimigo =>{

                    if(inimigo.vivo)
                    {
                        if( //cima pra baixo
                        inimigo.pos.y + inimigo.altura <= plataforma.pos.y && 
                        inimigo.pos.y + inimigo.altura + inimigo.vel.y >= plataforma.pos.y &&
                        inimigo.pos.x + inimigo.largura >= plataforma.pos.x &&
                        inimigo.pos.x <= plataforma.pos.x + plataforma.largura
                        )
                        {
                            inimigo.vel.y = 0;
                        }

                        if( //esquerda pra direita
                        inimigo.pos.x + inimigo.largura <= plataforma.pos.x + velocidadePixel&&
                        inimigo.pos.x + inimigo.largura + velocidadePixel >= plataforma.pos.x &&
                        inimigo.pos.y + inimigo.altura >= plataforma.pos.y &&
                        inimigo.pos.y <= plataforma.pos.y + plataforma.altura &&
                        inimigo.direcao
                        ||
                        inimigo.pos.y + inimigo.altura <= plataforma.pos.y && 
                        inimigo.pos.y + inimigo.altura + inimigo.altura >= plataforma.pos.y &&
                        inimigo.pos.x + inimigo.largura <= plataforma.pos.x &&
                        inimigo.pos.x + inimigo.largura + velocidadePixel>= plataforma.pos.x

                        )
                        {
                            inimigo.direcao = false;
                            inimigo.vel.x *= -1;
                        }

                        if( //direita pra esquerda
                        inimigo.pos.x >= plataforma.pos.x + plataforma.largura &&
                        inimigo.pos.x - velocidadePixel <= plataforma.pos.x + plataforma.largura &&
                        inimigo.pos.y + inimigo.altura >= plataforma.pos.y &&
                        inimigo.pos.y <= plataforma.pos.y + plataforma.altura &&
                        inimigo.direcao == false
                        ||
                        inimigo.pos.y + inimigo.altura <= plataforma.pos.y && 
                        inimigo.pos.y + inimigo.altura + inimigo.altura >= plataforma.pos.y &&
                        inimigo.pos.x + inimigo.largura >= plataforma.pos.x &&
                        inimigo.pos.x + inimigo.largura - velocidadePixel <= plataforma.pos.x
                        )
                        {
                            inimigo.direcao = true;
                            inimigo.vel.x *= -1;
                        }

                    }
                    
                });
                
                
            });
            butias.forEach(butia=>{
                if(butia.pego == false)
                {
                    if(
                        butia.pos.y + butia.altura >= jogador.pos.y && 
                        butia.pos.y <= jogador.pos.y + jogador.altura &&
                        butia.pos.x + butia.largura >= jogador.pos.x &&
                        butia.pos.x <= jogador.pos.x + jogador.largura
                    )
                    {
                        jogador.butias +=1;
                        butia.imagem.src = butia.sprites[0];
                        butia.pego = true;
                    }
                }
                
            });

            if(inimigos[3].vivo == false && vitoria ==1) 
            {
                if(
                    chimas.ativo&&
                    chimas.pos.y + 20 >= jogador.pos.y && 
                    chimas.pos.y <= jogador.pos.y + jogador.altura &&
                    chimas.pos.x + 20 >= jogador.pos.x &&
                    chimas.pos.x <= jogador.pos.x + jogador.largura
                )
                {
                    chimas.ativo = false
                }
            }
                
          
            inimigos.forEach(inimigo=>{
                if(inimigo.vivo)
                {
                    if(
                        inimigo.pos.y + inimigo.altura >= jogador.pos.y && 
                        inimigo.pos.y <= jogador.pos.y + jogador.altura &&
                        inimigo.pos.x + inimigo.largura >= jogador.pos.x + jogador.espeto.posX &&
                        inimigo.pos.x <= jogador.pos.x + jogador.espeto.posX + jogador.espeto.largura &&
                        jogador.espeto.atacando
                    )
                    {
                        inimigo.vida -=1;
                    }
                    if(
                        inimigo.pos.y + inimigo.altura >= jogador.pos.y && 
                        inimigo.pos.y <= jogador.pos.y + jogador.altura &&
                        inimigo.pos.x + inimigo.largura >= jogador.pos.x &&
                        inimigo.pos.x <= jogador.pos.x + jogador.largura &&
                        jogador.hit == false && inimigo.hit == false
                    )
                    {
                        jogador.hit = true;
                    }

                }
                else if(inimigo.butia)
                {
                    jogador.butias +=1;
                    inimigo.butia = false;
                }
                
            })

            //HUD
            //butias
            contexto.beginPath();
            contexto.drawImage(butiaHud, 520, 15)
            contexto.font = '35px pixelada'
            contexto.fillStyle = '#E0F2F1';
            contexto.fillText('x'+jogador.butias, 550, 32)


            //dicas
            if(distancia<390)
            {
                contexto.rect(6,6,370,30)
                contexto.fillStyle = '#000000';
                contexto.fill()

                contexto.lineWidth = 2.5;
                contexto.strokeStyle = '#FFF546';
                contexto.stroke();

                contexto.fillStyle = '#E0F2F1';
                contexto.fillText('Use A e D para andar', 12, 29)
            }

            if(distancia > 620 && distancia <840)
            {
                contexto.rect(6,6,370,30)
                contexto.fillStyle = '#000000';
                contexto.fill()

                contexto.lineWidth = 2.5;
                contexto.strokeStyle = '#FFF546';
                contexto.stroke();

                contexto.fillStyle = '#E0F2F1';
                contexto.fillText('Use W ou Espaço para pular', 12, 29)
            }

            if(distancia > 1080 && distancia <1460)
            {
                contexto.rect(6,6,370,55)
                contexto.fillStyle = '#000000';
                contexto.fill()

                contexto.lineWidth = 2.5;
                contexto.strokeStyle = '#FFF546';
                contexto.stroke();

                contexto.fillStyle = '#E0F2F1';
                contexto.fillText('Colete butiás para sobreviver', 12, 29)
                contexto.fillText('a ataques', 12, 50)
            }

            if(distancia > 1640 && distancia <1780)
            {
                checkpoint = 1;
                contexto.rect(6,6,370,30)
                contexto.fillStyle = '#000000';
                contexto.fill()

                contexto.lineWidth = 2.5;
                contexto.strokeStyle = '#FFF546';
                contexto.stroke();

                contexto.fillStyle = '#E0F2F1';
                contexto.fillText('Progresso salvo!', 12, 29)
            }

            if(distancia > 1900 && distancia <2100)
            {
                espeto.ativo = false;
                jogador.espeto.equip = true;
                contexto.rect(6,6,370,30)
                contexto.fillStyle = '#000000';
                contexto.fill()

                contexto.lineWidth = 2.5;
                contexto.strokeStyle = '#FFF546';
                contexto.stroke();

                contexto.fillStyle = '#E0F2F1';
                contexto.fillText('Use S para atacar', 12, 29)
            }
            if(distancia > 3839 && distancia < 4000)
            {
                checkpoint = 2;
                contexto.rect(6,6,370,30)
                contexto.fillStyle = '#000000';
                contexto.fill()

                contexto.lineWidth = 2.5;
                contexto.strokeStyle = '#FFF546';
                contexto.stroke();

                contexto.fillStyle = '#E0F2F1';
                contexto.fillText('Progresso salvo!', 12, 29)
            }

            if(distancia > 4090 && distancia <4100)
            {
                portal.ativo = false;
            }


            if(inimigos[3].vivo == false)
            {
                if(vitoria==0)
                {
                    chimas = new Itens((inimigos[3].pos.x + inimigos[3].largura / 2), 250,'./img/chimas.png',0);
                    vitoria=1;
                }
                else
                {
                    chimas.atualizar();
                    if(chimas.ativo == false)
                    {
                        contexto.rect(6,6,370,30)
                    contexto.fillStyle = '#000000';
                    contexto.fill()

                    contexto.lineWidth = 2.5;
                    contexto.strokeStyle = '#FFF546';
                    contexto.stroke();

                    contexto.fillStyle = '#E0F2F1';
                    contexto.fillText('Você venceu!', 12, 29)
                    }
                }
                
            }
        }
        else //menu
        {
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

        
        if(i>540)
        {
            if(botaoJogar.y > 180)
            {
                botaoJogar.y = botaoJogar.y - 10;
            } 
            else
            {
                botaoJogar.pronto = 1;
            }

            contexto.beginPath();
            contexto.roundRect(botaoJogar.x,botaoJogar.y,botaoJogar.largura,botaoJogar.altura, 40);
            if(botaoJogar.pressionado)
            {
                contexto.fillStyle = '#796100';
            }
            else
            {
                contexto.fillStyle = '#00796B';
            }
            
            contexto.fill();

            contexto.lineWidth = 4;
            contexto.strokeStyle = '#E0F2F1';
            contexto.stroke();
            
            contexto.font = '50px pixelada'
            contexto.fillStyle = '#E0F2F1';
            contexto.fillText('Jogar', botaoJogar.x + botaoJogar.largura / 4 + 9, botaoJogar.y + botaoJogar.altura * 0.66)
        }
        if(botaoJogar.pressionado)
        {
            musicaMenu.pause()
            musicaJogo.play()
            jogando = 1
        }
        i++;
        }

        delayFPS = Date.now()
    }
}

iniciarMenu();
iniciarJogo();

animar();
