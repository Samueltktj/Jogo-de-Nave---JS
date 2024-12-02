const spriteFundo = new Image();
spriteFundo.src = "./sprites/SpaceBackground.jpeg";

const spriteHudBomba = new Image();
spriteHudBomba.src = "./sprites/bomb_inventory_hud.png";

const spriteHudShield = new Image();
spriteHudShield.src = "./sprites/shield_inventory_hud.png";

const spriteBombaReload = new Image();
spriteBombaReload.src = "./sprites/bomb_reload.png";

const spriteNave = new Image();
spriteNave.src = "./sprites/SNES - Strike Gunner STG - Players Ship.png";

const spriteNaveCarga = new Image();
spriteNaveCarga.src = "./sprites/SNES - Strike Gunner STG - Cargo Ship and Dropship.png";

const spritePacoteAumentoPoder = new Image();
spritePacoteAumentoPoder.src = "./sprites/pacotes_poder.png"

const spriteTiro = new Image();
spriteTiro.src = "./sprites/SNES - Strike Gunner STG - Players Ship.png";

const spriteCorteAzulVerde = new Image();
spriteCorteAzulVerde.src = "./sprites/blaster.png"

const spriteTiroInimigo = new Image();
spriteTiroInimigo.src = "./sprites/SNES - Strike Gunner STG - Stage 6 Boss(1).png";

const spriteTiroEspecial = new Image();
spriteTiroEspecial.src = "./sprites/SNES - Strike Gunner STG - Weapon Icons.png";

const spriteInimigos = new Image();
spriteInimigos.src = "./sprites/SNES - Strike Gunner STG - Enemy Deep Space Force.png";

const spriteExplosao = new Image();
spriteExplosao.src = "./sprites/explosao_inimigos.png";

const spriteExplosaoNuclear = new Image();
spriteExplosaoNuclear.src = "./sprites/explosao_nuclear.png";

const spriteExplosaoInimigoVermelho = new Image();
spriteExplosaoInimigoVermelho.src = "./sprites/explosao_inimigo_vermelho.png";

const spriteEscudoCaixa = new Image();
spriteEscudoCaixa.src = "./sprites/escudo_caixa.png"

const spriteEscudo = new Image();
spriteEscudo.src = "./sprites/escudo_nave.png";

const spriteEscudoHud = new Image();
spriteEscudoHud.src = "./sprites/escudo_hud.png";

const somMorte = new Audio();
somMorte.src = "./audio/explosao_hit.mp3";
somMorte.volume = 0.2;

const somPegarPoder = new Audio();
somPegarPoder.src = "./audio/power_up.mp3";
somPegarPoder.volume = 0.2;

const somDeFundo = new Audio();
somDeFundo.src = "./audio/audio_Fundo4.mp3";
somDeFundo.volume = 1.0;

const somExplosaoTiro = new Audio();
somExplosaoTiro.src = "./audio/explosaoTiro.wav";
somExplosaoTiro.volume = 0.5;

const somExplosaoInimigo = new Audio();
somExplosaoInimigo.src = "./audio/explosaoInimigo.wav";
somExplosaoInimigo.volume = 0.5;

const somTiro = new Audio();
somTiro.src = "./audio/tiro.mp3"
somTiro.volume = 0.1;
somTiro.playbackRate = 4.0;

const somEscudo = new Audio();
somEscudo.src = "./audio/shield_sound.wav"
somEscudo.volume = 0.2;

const canvas = document.querySelector('canvas');
const contexto = canvas.getContext('2d');

class Score {
    score = 0;
    x = canvas.width / 2 - 55;
    y = 50;

    desenha() {
        contexto.font = "30px SegoeUI";
        contexto.fillStyle = "#00BFFF";
        
        contexto.fillText(`Score: ${this.score}`, this.x, this.y);    
    }

    atualiza(referenciaInimigo) {
        if(referenciaInimigo instanceof InimigoPadrao || referenciaInimigo instanceof InimigoVermelho) {
            this.score += referenciaInimigo.score;
        }
    }
}

const score = new Score()
let time = 0;
let estadoTecla = {};
let players = [];   
let inimigos = {};
let naveCarga = [];
let pacotesAumentaPoder = [];
let tiros = {};
let tirosEspeciais = [];
let tirosEspeciaisHud = [];
let tirosInimigo = {};
let tiroContador = 0;
let numeroInimigo = 0;
let escudos = [];
let escudoHud = [];
let ultimaAnimacaoHud = 0;
let tempoAnimacaoHud = 70;
let indiceAnimacaoHud = 0;

function gerarNumeroAleatorioInclusivo(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function colisao(x, y, largura, altura, objeto) {
    const colidiu = (
        x < objeto.x + objeto.largura 
        && x + largura > objeto.x 
        && y < objeto.y + objeto.altura 
        && y + altura > objeto.y
    )

    return colidiu;
}

class Nave {
    sprites = [
        {sx: 11, sy: 88, largura: 29, altura: 42},
        {sx: 345, sy: 86, largura: 21, altura: 41},
        {sx: 311,sy: 86,largura: 15,altura: 41},
        {sx: 70,sy: 87,largura: 21,altura: 41},
        {sx: 110,sy: 87,largura: 15,altura: 41}
    ];
    spritesTiro = [
        {sx: 176, sy: 74, largura: 10, altura: 10},
        {sx: 176, sy: 74, largura: 22, altura: 10},
        {sx: 232, sy: 63, largura: 28, altura: 20},
        {sx: 271, sy: 65, largura: 41, altura: 20}
    ];
    spriteCorteVerdeAzul = [
        {sx: 50, sy: 234, largura: 44, altura: 40},
        {sx: 50, sy: 188, largura: 43, altura: 42},
        {sx: 54, sy: 147, largura: 36, altura: 32},
        {sx: 50, sy: 104, largura: 43, altura: 40},
        {sx: 50, sy: 58, largura: 42, altura: 41},
        {sx: 54, sy: 17, largura: 36, altura: 33}
    ];
    trocaSpriteTiro = 0;
    trocaSpriteTiroFinal = 5;
    vida = 1;
    sprite = spriteNave;
    aceleracao = 0.5;
    velocidadeX = 0;
    velocidadeY = 0;
    velocidadeMax = 6;
    numeroTiros = 0;
    intervaloTiro = 600;
    intervaloTiroMax = 200; 
    intervaloTiroEspecial = 1600; //Em ms
    quantidadeTiroEspecialInicio = 3;
    quantidadeMaxTirosEspeciais = 5;
    tiroDisparado;
    escudo = [];

    constructor() {
        this.sx = this.sprites[0].sx;
        this.sy = this.sprites[0].sy;
        this.largura = this.sprites[0].largura;
        this.altura = this.sprites[0].altura;
        this.x = canvas.width/2 - this.largura / 2;
        this.y = canvas.height - this.altura * 3;
        this.tempoUltimoTiro = 0;
        this.tempoUltimoTiroEspecial = 0;
        this.destruido = new Explosao();

        let espacamento = 0;
        for(let i = 0; i < this.quantidadeTiroEspecialInicio; i++) {
            tirosEspeciais.push(new TiroEspecialNave());
            tirosEspeciaisHud.push(23 + espacamento);
            espacamento += 17;
        }
    }
    
    animacao({sx, sy, largura, altura}) {
        this.sx = sx;
        this.sy = sy;
        this.largura = largura;
        this.altura = altura;
    }

    desenha() {
        contexto.drawImage(
            this.sprite,
            this.sx, this.sy,
            this.largura, this.altura,
            this.x, this.y,
            this.largura, this.altura,
        );
    }

    movimento(fundo_largura, fundo_altura) {
        this.atingeInimigo();
        this.ativarEscudo();

        if(this.vida <= 0) {
            console.log("Game Over");
            window.close();
        }

        this.animacao(this.sprites[0]);

        if((estadoTecla["d"] || estadoTecla["D"]) 
            && (estadoTecla["a"] || estadoTecla["A"])) {
                this.velocidadeX = 0;
        }

        if(estadoTecla["d"] || estadoTecla["D"]) {
            if((this.x + this.largura) < fundo_largura) {
                this.velocidadeX += this.aceleracao;
                this.animacao(this.sprites[3]);

                if(this.velocidadeX > 5) {
                    this.animacao(this.sprites[4]);
                }
            } else {
                this.velocidadeX = 0;
                this.animacao(this.sprites[3]);
            }
        }

        if(estadoTecla["a"] || estadoTecla["A"]) {
            if(this.x > 0) {
                this.velocidadeX -= this.aceleracao;
                this.animacao(this.sprites[1]);
                if(this.velocidadeX < -5) {
                    this.animacao(this.sprites[2]);
                }
            } else {
                this.velocidadeX = 0;
                this.animacao(this.sprites[1]);
            }
        } 

        if(estadoTecla["w"] || estadoTecla["W"]) {
            if(this.y > 0) {
                this.velocidadeY -= this.aceleracao;
            } else {
                this.velocidadeY = 0;
            }
        }

        if(estadoTecla["s"] || estadoTecla["S"]) {
            if((this.y + this.altura) < fundo_altura) {
                this.velocidadeY += this.aceleracao;
            } else {
                this.velocidadeY = 0;
            }
        } 
         
        if(!((estadoTecla["d"] || estadoTecla["D"]) || (estadoTecla["a"] || estadoTecla["A"]))) {
            this.velocidadeX = 0;
        } 
        if(!((estadoTecla["w"] || estadoTecla["W"]) || (estadoTecla["s"] || estadoTecla["S"]))){
            this.velocidadeY = 0;
        }
        
        this.x += this.velocidadeX;
        this.y += this.velocidadeY;

        if(this.velocidadeX > this.velocidadeMax) {
            this.velocidadeX = this.velocidadeMax;
        }
        if(this.velocidadeX < -this.velocidadeMax) {
            this.velocidadeX = -this.velocidadeMax;
        }
        if(this.velocidadeY > this.velocidadeMax) {
            this.velocidadeY = this.velocidadeMax;
        }
        if(this.velocidadeY < -this.velocidadeMax) {
            this.velocidadeY = -this.velocidadeMax;
        }
    }
    
    atingeInimigo() {
        for (const chave in inimigos) {
            if(inimigos[chave].vida > 0 && this.vida > 0) {
                if(colisao(this.x, this.y, this.largura, this.altura, inimigos[chave])){  
                    this.vida -= 1;
                }
            }
        }
        if(this.vida <= 0) {
            this.explode();
        }
    }

    
    atirar() {
        if(estadoTecla[" "] && Date.now() - this.tempoUltimoTiro > this.intervaloTiro) {
            let spriteCoordenadas;
            if(this.trocaSpriteTiro < this.trocaSpriteTiroFinal - 1) {
                spriteCoordenadas = this.spritesTiro;
            } else {
                spriteCoordenadas = this.spriteCorteVerdeAzul;
            }

            somTiro.play();
            tiros[this.numeroTiros] = new TiroNave(
                (this.x + this.largura / 2) - (spriteCoordenadas[this.trocaSpriteTiro].largura / 2),
                this.y - spriteCoordenadas[this.trocaSpriteTiro].altura, 
                this.numeroTiros, 
                spriteCoordenadas,
                this.trocaSpriteTiro, 
                this.trocaSpriteTiroFinal
        );
            this.tempoUltimoTiro = Date.now();
            this.numeroTiros += 1;
        }

        for(let chave in tiros) {
            tiros[chave].movimento();
        }
    }

    atirarTiroEspecial() {
        if(tirosEspeciais.length > 0) {
            if((estadoTecla["e"] || estadoTecla["E"]) && Date.now() - this.tempoUltimoTiroEspecial > this.intervaloTiroEspecial) {
                this.tiroDisparado = tirosEspeciais.pop();
                tirosEspeciaisHud.pop();
                this.tiroDisparado.x = (this.x + this.largura / 2) - 6;
                this.tiroDisparado.y = this.y;
                this.tempoUltimoTiroEspecial = Date.now();
            }
        }

        if(this.tiroDisparado) {
            this.tiroDisparado.desenha();
            this.tiroDisparado.movimento();
        }
    }

    ativarEscudo() {
        this.pegaEscudo();

        if(this.escudo.length > 0) {
            this.escudo[0].ativaEscudo(this);
        }
    }

    pegaEscudo() {
        for(let i = 0; i < escudos.length; i++) {
            if(colisao(this.x, this.y, this.largura, this.altura, escudos[i])) {
                if(!escudoHud.length) {
                    somPegarPoder.play()
                    const escudoPego = escudos.pop();
                    escudoPego.desenhaSprite = spriteEscudo;
                    this.escudo.push(escudoPego);
                    escudoHud = escudoPego.hud; 
                }
            }
        }
    }

    explode() {
        this.destruido.explodiu(this);
    }
}

class TiroNave {
    velocidadeTiro = 7;
    ultimoTiroFinal = 0;
    tempoTiroFinal = 50;
    escolherTiroFinal = 0;
    
    constructor(x, y, numeroTiro, novoSpriteTiro, trocaSpriteTiro, trocaSpriteTiroFinal) {
        this.x = x;
        this.y = y;
        this.numeroTiro = numeroTiro;
        this.novoSpriteTiro = novoSpriteTiro;
        
        if(trocaSpriteTiro < trocaSpriteTiroFinal - 1) {
            this.spriteAtual = spriteTiro;
            this.sx = this.novoSpriteTiro[trocaSpriteTiro].sx;
            this.sy = this.novoSpriteTiro[trocaSpriteTiro].sy;
            this.largura = this.novoSpriteTiro[trocaSpriteTiro].largura;
            this.altura = this.novoSpriteTiro[trocaSpriteTiro].altura;
        } else {
            this.spriteAtual = spriteCorteAzulVerde;
        }
    }

    animacaoTiroFinal() {
        if(Date.now() - this.ultimoTiroFinal > this.tempoTiroFinal) {
            if(this.escolherTiroFinal < this.novoSpriteTiro.length) {
                this.sx = this.novoSpriteTiro[this.escolherTiroFinal].sx;
                this.sy = this.novoSpriteTiro[this.escolherTiroFinal].sy;
                this.largura = this.novoSpriteTiro[this.escolherTiroFinal].largura;
                this.altura = this.novoSpriteTiro[this.escolherTiroFinal].altura;
    
                this.escolherTiroFinal += 1;
                this.ultimoTiroFinal = Date.now();
            } else {
                this.escolherTiroFinal = 0;
            }
        }
    }

    desenha() {
        contexto.drawImage(
            this.spriteAtual,
            this.sx, this.sy,
            this.largura, this.altura,
            this.x, this.y,
            this.largura, this.altura,
        );
    }

    movimento() {
        if(this.spriteAtual == spriteCorteAzulVerde) {
            this.animacaoTiroFinal();
        }

        this.y -= this.velocidadeTiro;
        
        if(this.y < -5) {
            delete tiros[this.numeroTiro];
        }

        this.atingeInimigo();
    }

    atingeInimigo() {
        for(let chave in inimigos) {
            if(inimigos[chave].vida > 0) {
                if(colisao(this.x, this.y, this.largura, this.altura, inimigos[chave])) {
                    inimigos[chave].vida -= 1;
                    if(this.spriteAtual == spriteTiro) {
                        delete tiros[this.numeroTiro];
                    }
                }
            }
        }
    }
}

class TiroInimigo {
    velocidadeTiro = 1;
    spritesTiros = [
        {sx: 242, sy: 166, largura: 10,altura: 7},
        {sx: 265, sy: 166, largura: 7,altura: 7},
        {sx: 285, sy: 165, largura: 7,altura: 9}
    ];
    escolherSpriteTiro = 0;
    intervaloTiro = 0;
    tempoAnimacaoTiro = 100;

    constructor(x, y, numeroTiro) {
        this.x = x;
        this.y = y;
        this.sx = this.spritesTiros[this.escolherSpriteTiro].sx;
        this.sy = this.spritesTiros[this.escolherSpriteTiro].sy;
        this.largura = this.spritesTiros[this.escolherSpriteTiro].largura;
        this.altura = this.spritesTiros[this.escolherSpriteTiro].altura;
        this.deltaX = (players[0].x + players[0].largura / 2) - x;
        this.deltaY = (players[0].y + players[0].altura / 2) - y;
        this.numeroTiro = numeroTiro;
    }

    animacao() {
        if(Date.now() - this.intervaloTiro > this.tempoAnimacaoTiro) {
            if(this.escolherSpriteTiro >= this.spritesTiros.length) {
                this.escolherSpriteTiro = 0;
            }

            this.sx = this.spritesTiros[this.escolherSpriteTiro].sx;
            this.sy = this.spritesTiros[this.escolherSpriteTiro].sy;
            this.largura = this.spritesTiros[this.escolherSpriteTiro].largura;
            this.altura = this.spritesTiros[this.escolherSpriteTiro].altura;
            this.escolherSpriteTiro += 1;
            this.intervaloTiro = Date.now();
        }
    }

    desenha() {
        this.animacao();

        contexto.drawImage(
            spriteTiroInimigo,
            this.sx, this.sy,
            this.largura, this.altura,
            this.x, this.y,
            this.largura, this.altura,
        );
    }

    movimento() {
        this.atingeNave();

        if(this.x < 0 || this.x + this.largura > canvas.width || this.y < 0 || this.y + this.altura > canvas.height) {
            delete tirosInimigo[this.numeroTiro];
        }

        if(this.deltaX < 0) {
            this.velocidadeTiroX = -this.velocidadeTiro;
        } else {
            this.velocidadeTiroX = this.velocidadeTiro;
        }
        this.velocidadeTiroY = this.deltaY * this.velocidadeTiroX / this.deltaX;
        
        if(this.velocidadeTiroY > 4) {
            this.velocidadeTiroY = this.velocidadeTiro;
        }

        if(this.velocidadeTiroY < -4) {
            this.velocidadeTiroY = -this.velocidadeTiro;
        }
        
        this.x += this.velocidadeTiroX;
        this.y += this.velocidadeTiroY;        
    }

    atingeNave() {
        for(let i = 0; i < players.length; i++) {
            if(colisao(this.x, this.y, this.largura, this.altura, players[i])) {
                players[i].vida -= 1;
                delete tirosInimigo[this.numeroTiro];
            }
        }
    }
}

class TiroEspecialNave {
    bombaNuclearSprite = {sx: 95,sy: 252,largura: 11,altura: 27}
    sprite = spriteTiroEspecial
    velocidadeMaxTiro = 4.5;
    velocidadeTiro = 1;
    aceleracaoTiro = 0.05;
    desaceleracaoTiro = 0.5;
    atingiuVelocidadeMax = false;

    constructor() {
        this.sx = this.bombaNuclearSprite.sx;
        this.sy = this.bombaNuclearSprite.sy;
        this.largura = this.bombaNuclearSprite.largura;
        this.altura = this.bombaNuclearSprite.altura;
        this.explosaoNuclear = new Explosao();
    }

    desenha() {
        contexto.drawImage(
            this.sprite,
            this.sx, this.sy,
            this.largura, this.altura,
            this.x, this.y,
            this.largura, this.altura,
        );
    }
    
    movimento() {
        this.atingeInimigo();

        if(this.velocidadeTiro <= 0) {
            somExplosaoTiro.play();
            this.explosaoNuclear.explodiu(this);
        } else {
            if(this.atingiuVelocidadeMax) {
                if(this.velocidadeTiro > 0) {
                    this.velocidadeTiro -= this.desaceleracaoTiro;
                } else {
                    this.velocidadeTiro = 0;
                }
            } else {
                this.velocidadeTiro += this.aceleracaoTiro;
                if(this.velocidadeTiro >= this.velocidadeMaxTiro) {
                    this.atingiuVelocidadeMax = true;
                }
            }
            this.y -= this.velocidadeTiro;
        }
    }

    atingeInimigo() {
        for(let chave in inimigos) {
            if(inimigos[chave].vida > 0) {
                if(colisao(this.x, this.y, this.largura, this.altura, inimigos[chave])) {
                    inimigos[chave].vida = 0;
                    this.velocidadeTiro = 0;
                }
            }
        }
    }
    
}

class EscudoNave {
    spriteEscudoInimigo = [
        {sx: 2, sy: 2, largura: 23, altura: 22}
    ];
    spriteEscudoNave = [
        {sx: 12, sy: 12, largura: 72, altura: 66},
        {sx: 97, sy: 15, largura: 72, altura: 66},
        {sx: 182, sy: 18, largura: 72, altura: 66},
        {sx: 265, sy: 22, largura: 72, altura: 63},
        {sx: 15, sy: 97, largura: 70, altura: 66},
        {sx: 97, sy: 97, largura: 70, altura: 66},
        {sx: 175, sy: 99, largura: 72, altura: 63},
        {sx: 256, sy: 99, largura: 72, altura: 66}
    ];
    hud = [
        {sx: 2, sy: 1, largura: 31, altura: 31},
        {sx: 46, sy: 2, largura: 32, altura: 29},
        {sx: 88, sy: 2, largura: 30, altura: 30},
        {sx: 131, sy: 2, largura: 29, altura: 29},
        {sx: 3, sy: 50, largura: 30, altura: 30},
        {sx: 46, sy: 50, largura: 30, altura: 30},
        {sx: 88, sy: 49, largura: 30, altura: 33},
        {sx: 130, sy: 48, largura: 32, altura: 33}
    ];
    velocidade = 0.5;
    ultimaAnimacao = 0;
    tempoAnimacao = 100;
    escolherAnimacao = 0;
    escudoAtivado = false;
    contagemtempoEscudo = 0;
    tempoEscudo = 1000;

    constructor(x, y, desenhaSprite) {
        this.x = x;
        this.y = y;
        this.desenhaSprite = desenhaSprite;
    }

    animacao() {
        let spriteAtual;
        if(Date.now() - this.ultimaAnimacao > this.tempoAnimacao) {
            if(this.desenhaSprite == spriteEscudoCaixa) {
                spriteAtual = this.spriteEscudoInimigo;
            } else {
                spriteAtual = this.spriteEscudoNave;
            }

            if(this.escolherAnimacao == spriteAtual.length) {
                this.escolherAnimacao = 0;
            }

            this.sx = spriteAtual[this.escolherAnimacao].sx;
            this.sy = spriteAtual[this.escolherAnimacao].sy;
            this.largura = spriteAtual[this.escolherAnimacao].largura;
            this.altura = spriteAtual[this.escolherAnimacao].altura;
            this.escolherAnimacao += 1;
            this.ultimaAnimacao = Date.now();
        }
    }

    desenha() {
        this.animacao();

        contexto.drawImage(
            this.desenhaSprite,
            this.sx, this.sy,
            this.largura, this.altura,
            this.x, this.y,
            this.largura, this.altura,
        );
    }

    ativaEscudo(nave) {
        if((estadoTecla["q"] || estadoTecla["Q"])) {
            if(escudoHud.length > 0 && !this.escudoAtivado) {
                somEscudo.play();
                this.escudoAtivado = true;
                escudoHud = [];
            }
        }
        
        if(this.escudoAtivado) {
            this.x = nave.x - 21;
            this.y = nave.y - 7;
            this.desenha();
            this.defendeNave(nave);
            this.contagemtempoEscudo += 1;
        }

        if(this.contagemtempoEscudo >= this.tempoEscudo) {
            nave.escudo.pop();
            this.escudoAtivado = false;
            this.contagemtempoEscudo = 0;
        }
    }

    defendeNave(nave) {
        for(const inimigo in inimigos) {
            if(this.x < inimigos[inimigo].x + inimigos[inimigo].largura 
                && this.x + this.largura > inimigos[inimigo].x 
                && this.y < inimigos[inimigo].y + inimigos[inimigo].altura 
                && this.y + this.altura > inimigos[inimigo].y) {
                nave.escudo.pop();
                this.escudoAtivado = false;
                this.contagemtempoEscudo = 0;
            }
        }

        for(const tiroInimigo in tirosInimigo) {
            if(this.x < tirosInimigo[tiroInimigo].x + tirosInimigo[tiroInimigo].largura 
                && this.x + this.largura > tirosInimigo[tiroInimigo].x 
                && this.y < tirosInimigo[tiroInimigo].y + tirosInimigo[tiroInimigo].altura 
                && this.y + this.altura > tirosInimigo[tiroInimigo].y) {
                    delete tirosInimigo[tiroInimigo];
            }
        }
    }

    movimento() {
        this.y += this.velocidade;
    }
}

class InimigoPadrao {
    vida = 1;
    sprite = spriteInimigos;
    ultimaAnimacao = 0;
    tempoAnimacao = 100
    ultimoModoAtaque = 0;
    tempoModoAtaque = 500;
    escolherAnimacao = 0;
    spriteMovimentos = [
        {sx: 14, sy: 184, largura: 20,altura: 31},
        {sx: 48, sy: 184, largura: 24,altura: 32},
        {sx: 90, sy: 185, largura: 28,altura: 32},
        {sx: 134, sy: 186, largura: 30,altura: 31},
        {sx: 179, sy: 186, largura: 30,altura: 32}
    ];
    velocidadeAngular = 0;
    intervaloTiro = 0;
    score = 5;
    tempoTiro = 2000;
    podeAtirar = false;

    constructor(x, y, numeroInimigo) {
        this.sx = this.spriteMovimentos[0].sx;
        this.sy = this.spriteMovimentos[0].sy;
        this.largura = this.spriteMovimentos[0].largura;
        this.altura = this.spriteMovimentos[0].altura;
        this.x = x;
        this.y = y;
        this.centerX = x;
        this.centerY = y;
        this.radius = gerarNumeroAleatorioInclusivo(100, 200);
        this.numeroInimigo = numeroInimigo;
        this.destruido = new Explosao();
    }
    
    animacao() {
        if(Date.now() - this.ultimaAnimacao > this.tempoAnimacao) {
            if(this.escolherAnimacao == this.spriteMovimentos.length - 1) {
                this.podeAtirar = true;
            }
            if(this.escolherAnimacao == 0) {
                this.podeAtirar = false;
            }

            this.sx = this.spriteMovimentos[this.escolherAnimacao].sx;
            this.sy = this.spriteMovimentos[this.escolherAnimacao].sy;
            this.largura = this.spriteMovimentos[this.escolherAnimacao].largura;
            this.altura = this.spriteMovimentos[this.escolherAnimacao].altura;
            
            if(this.podeAtirar) {
                this.escolherAnimacao -= 1;
            } else {
                this.escolherAnimacao += 1;
            }
            this.ultimaAnimacao = Date.now();
        }
    }

    desenha() {
        contexto.drawImage(
            this.sprite,
            this.sx, this.sy,
            this.largura, this.altura,
            this.x, this.y,
            this.largura, this.altura,
        );
    }

    movimento() {
        if((this.x + this.largura < 0 
            || this.x > canvas.width 
            || this.y + this.altura < 0 
            || this.y > canvas.height)
            && this.podeAtirar) {
                delete inimigos[this.numeroInimigo];
        }

        if(this.vida <= 0) {
            somMorte.play();
            this.explode();
        } else {
            if(this.x > 0 && this.x + this.largura < canvas.width && this.y > 0 && this.y + this.altura < canvas.height) {
                this.animacao();

                if(this.podeAtirar) {
                    this.atirar();
                }
            }

            if(this.centerX > 0) {
                this.x = this.centerX + this.radius * Math.cos(this.velocidadeAngular);
                this.y = this.centerY + this.radius * Math.sin(this.velocidadeAngular);
                this.velocidadeAngular -= 0.01;
            } else {
                this.x = this.centerX - this.radius * Math.cos(this.velocidadeAngular);
                this.y = this.centerY - this.radius * Math.sin(this.velocidadeAngular);
                this.velocidadeAngular += 0.01;
            }
        }
    }

    atirar() {
        if(Date.now() - this.intervaloTiro > this.tempoTiro) {
            tirosInimigo[tiroContador] = new TiroInimigo(this.x + this.largura / 2, this.y + this.altura, tiroContador);
            tiroContador += 1;
            this.intervaloTiro = Date.now();
        }
    }

    explode() {
        this.destruido.explodiu(this);
    }
}

class InimigoVermelho {
    sprite = spriteInimigos;
    velocidade = 0.5;
    vida = 10;
    ultimaAnimacao = 0;
    tempoAnimacao = 500;
    escolherAnimacao = 0;
    loopAnimacao = false;
    possuiEscudo = true;
    score = 20;

    sprites = [
        {sx: 21, sy: 630, largura: 30,altura: 24},
        {sx: 68, sy: 631, largura: 31,altura: 25},
        {sx: 117, sy: 631, largura: 32,altura: 26},
        {sx: 167, sy: 630, largura: 32,altura: 27}
    ];

    constructor(x, y, numeroInimigo) {
        this.x = x;
        this.y = y;
        this.numeroInimigo = numeroInimigo;
        this.destruido = new Explosao();
    }

    atualiza() {
        if(Date.now() - this.ultimaAnimacao > this.tempoAnimacao) {
            if(this.escolherAnimacao == this.sprites.length - 1) {
                this.loopAnimacao = true;
            }
            if(this.escolherAnimacao == 0) {
                this.loopAnimacao = false;
            }

            this.sx = this.sprites[this.escolherAnimacao].sx;
            this.sy = this.sprites[this.escolherAnimacao].sy;
            this.largura = this.sprites[this.escolherAnimacao].largura;
            this.altura = this.sprites[this.escolherAnimacao].altura;
            
            if(this.loopAnimacao) {
                this.escolherAnimacao -= 1;
            } else {
                this.escolherAnimacao += 1;
            }
            this.ultimaAnimacao = Date.now();
        }
    }

    desenha() {
        contexto.drawImage(
            this.sprite,
            this.sx, this.sy,
            this.largura, this.altura,
            this.x, this.y,
            this.largura, this.altura,
        );
    }

    movimento() {;
        this.atingeInimigo();
        
        if(this.vida > 0) {
            this.atualiza();
        } else {
            somExplosaoInimigo.play();
            this.explode();
            if(this.possuiEscudo) {
                escudos.push(new EscudoNave(this.x + this.largura / 2, this.y + this.altura / 2, spriteEscudoCaixa));
                this.possuiEscudo = false;
            }
        }

        this.y += this.velocidade;
    }

    atingeInimigo() {
        if(this.sprite != spriteInimigos) {
            for(const chave in inimigos) {
                if(colisao(this.x, this.y, this.largura, this.altura, inimigos[chave])) {
                    inimigos[chave].vida = 0;
                }
            }
        }
    }

    explode() {
        this.destruido.explodiu(this);
    }
}

class NaveCarga {
    sprites = [
        {sx: 9,sy: 7,largura: 50,altura: 69},
        {sx: 65,sy: 7,largura: 50,altura: 69},
        {sx: 125,sy: 7,largura: 50,altura: 69},
        {sx: 185,sy: 7,largura: 50,altura: 69}
    ];
    aceleracao = 0.02;
    ultimaAnimacao = 0;
    tempoAnimacao = 200;
    escolherAnimacao = 0;
    abriuPortas = false;
    fechouPortas = false;
    ultimaPortaAberta = Date.now();
    tempoPortaAberta = 5000;

    constructor(x, velocidade) {
        this.x = x;
        this.y = canvas.height;
        this.velocidade = velocidade;
        this.sx = this.sprites[0].sx;
        this.sy = this.sprites[0].sy;
        this.largura = this.sprites[0].largura;
        this.altura = this.sprites[0].altura;
    }

    animacao() {
        if(Date.now() - this.ultimaAnimacao > this.tempoAnimacao){
            if(this.escolherAnimacao == this.sprites.length - 1) {
                if(Date.now() - this.ultimaPortaAberta > this.tempoPortaAberta) {
                    const pacoteAleatorio = gerarNumeroAleatorioInclusivo(0, 2);
                    pacotesAumentaPoder.push(new PacotesAumentaPoder(this.x + this.largura / 2, this.y + this.altura / 2, pacoteAleatorio));
                    this.abriuPortas = true;
                }
            }

            if(this.abriuPortas) {
                if(this.escolherAnimacao > 0) {
                    this.escolherAnimacao -= 1;
                } else {
                    this.fechouPortas = true;
                }
            } else {
                if(this.escolherAnimacao != this.sprites.length - 1) {
                    this.escolherAnimacao += 1;
                }
            }

            this.sx = this.sprites[this.escolherAnimacao].sx;
            this.sy = this.sprites[this.escolherAnimacao].sy;
            this.largura = this.sprites[this.escolherAnimacao].largura;
            this.altura = this.sprites[this.escolherAnimacao].altura;
            this.ultimaAnimacao = Date.now();
        }
    }

    desenha() {
        contexto.drawImage(
            spriteNaveCarga,
            this.sx, this.sy,
            this.largura, this.altura,
            this.x, this.y,
            this.largura, this.altura,
        );
    }
    
    movimento() {
        if(this.velocidade <= 0) {
            this.animacao();
            if(this.fechouPortas) {
                this.velocidade += this.aceleracao;
            }
        } else {
            if(this.fechouPortas) {
                this.velocidade += this.aceleracao;
            } else {
                this.velocidade -= this.aceleracao;
            }
            this.y -= this.velocidade;
        }

        if(this.y + this.altura < 0) {
            naveCarga.pop();
        }
    }
}

class PacotesAumentaPoder {
    spritesAumentaPoder = [
        {sx: 20, sy: 10, largura: 33, altura: 35},
        {sx: 20, sy: 65, largura: 33, altura: 35},
        {sx: 20, sy: 113, largura: 34, altura: 37}
    ];
    velocidade = 0.5;

    constructor(x, y, pacote) {
        this.x = x;
        this.y = y;
        this.pacote = pacote;
        this.sx = this.spritesAumentaPoder[pacote].sx;
        this.sy = this.spritesAumentaPoder[pacote].sy;
        this.largura = this.spritesAumentaPoder[pacote].largura;
        this.altura = this.spritesAumentaPoder[pacote].altura;
    }

    desenha() {
        contexto.drawImage(
            spritePacoteAumentoPoder,
            this.sx, this.sy,
            this.largura, this.altura,
            this.x, this.y,
            this.largura, this.altura,
        );
    }

    movimento() {
        for(let i = 0; i < players.length; i++) {
            if(colisao(this.x, this.y, this.largura, this.altura, players[i])) {
                if(this.pacote == 0) {
                    if(tirosEspeciais.length < players[i].quantidadeMaxTirosEspeciais) {
                        somPegarPoder.play();
                        tirosEspeciais.push(new TiroEspecialNave());
                        if(tirosEspeciaisHud.length > 0) {
                            tirosEspeciaisHud.push(tirosEspeciaisHud[tirosEspeciaisHud.length - 1] + 17);
                        } else {
                            tirosEspeciaisHud.push(23);
                        }
                        pacotesAumentaPoder.pop();
                    }
                }
                if(this.pacote == 1) {
                    if(players[i].trocaSpriteTiro < players[i].trocaSpriteTiroFinal) {
                        somPegarPoder.play();
                        players[i].trocaSpriteTiro += 1;
                        pacotesAumentaPoder.pop();
                    }
                }
                if(this.pacote == 2) {
                    if(players[i].intervaloTiro > players[i].intervaloTiroMax) {
                        somPegarPoder.play();
                        players[i].intervaloTiro -= 100;
                        pacotesAumentaPoder.pop();
                    }
                }   
            }
        }

        this.y += this.velocidade;

        if(this.y > canvas.height) {
            pacotesAumentaPoder.pop();
        }
    }
}

class Explosao {
    spriteExplosaoInimigoVermelho = [
        { sx: 68, sy: 51, largura: 60, altura: 53 },
        { sx: 262, sy: 39, largura: 96, altura: 77 },
        { sx: 455, sy: 18, largura: 134, altura: 119 },
        { sx: 15, sy: 200, largura: 166, altura: 151 },
        { sx: 211, sy: 184, largura: 198, altura: 183 },
        { sx: 418, sy: 178, largura: 209, altura: 195 },
    ];
    spriteExplosaoNuclear = [
        { sx: 138, sy: 166, largura: 74, altura: 70 },
        { sx: 293, sy: 136, largura: 149, altura: 121 },
        { sx: 510, sy: 112, largura: 165, altura: 147 },
        { sx: 761, sy: 86, largura: 181, altura: 186 },
        { sx: 1043, sy: 78, largura: 197, altura: 199 },
        { sx: 1342, sy: 101, largura: 174, altura: 159 },
        { sx: 1573, sy: 96, largura: 164, altura: 167 }
    ];
    spriteExplosoes = [
        { sx: 13, sy: 14, largura: 15, altura: 15 },
        { sx: 46, sy: 8, largura: 27, altura: 23 },
        { sx: 83, sy: 3, largura: 35, altura: 33 },
        { sx: 121, sy: 0, largura: 38, altura: 38 },
        { sx: 160, sy: 0, largura: 37, altura: 37 },
        { sx: 2, sy: 43, largura: 37, altura: 35 },
        { sx: 44, sy: 45, largura: 34, altura: 32 }
    ];
    tempoExplosao = 50;
    ultimaExplosao = 0;
    escolherExplosao = 0;
    xReferencia = [];
    yReferencia = [];
    atualizaScore = true;


    explodiu(instancia) {
        if(this.atualizaScore) {
            score.atualiza(instancia);
            this.atualizaScore = false;
        }
        instancia.sprite = spriteExplosao;
        let spriteExplosaoInfo = this.spriteExplosoes;
        if(instancia instanceof TiroEspecialNave) {
            instancia.sprite = spriteExplosaoNuclear;
            spriteExplosaoInfo = this.spriteExplosaoNuclear;
        } else if(instancia instanceof InimigoVermelho) {
            instancia.sprite = spriteExplosaoInimigoVermelho;
            spriteExplosaoInfo = this.spriteExplosaoInimigoVermelho;
        }

        if(Date.now() - this.ultimaExplosao > this.tempoExplosao) {                    
            if(this.escolherExplosao < spriteExplosaoInfo.length) {
                instancia.sx = spriteExplosaoInfo[this.escolherExplosao].sx;
                instancia.sy = spriteExplosaoInfo[this.escolherExplosao].sy;
                instancia.largura = spriteExplosaoInfo[this.escolherExplosao].largura;
                instancia.altura = spriteExplosaoInfo[this.escolherExplosao].altura;

                if(instancia instanceof TiroEspecialNave || instancia instanceof InimigoVermelho) {
                    this.tempoExplosao = 20;
                    this.xReferencia.push(instancia.x);
                    this.yReferencia.push(instancia.y);
                    instancia.x = this.xReferencia[0] - spriteExplosaoInfo[this.escolherExplosao].largura / 2;
                    instancia.y = this.yReferencia[0] - spriteExplosaoInfo[this.escolherExplosao].altura / 2;
                }

                this.escolherExplosao += 1;
                this.ultimaExplosao = Date.now();
            } else {
                if(instancia instanceof TiroEspecialNave) {
                    delete players[0].tiroDisparado;
                } else if(instancia instanceof InimigoPadrao || instancia instanceof InimigoVermelho) {
                    delete inimigos[instancia.numeroInimigo];
                }
            }
        }
    }
}
            
class PlanoFundo {
    x = 0;
    y = 0;
    largura = canvas.width;
    altura = canvas.height;
    velocidadeMovimento = 4;
    
    desenha() {
        contexto.drawImage(
            spriteFundo,
            this.x, (this.y - this.altura),
            this.largura, this.altura,
        );

        contexto.drawImage(
            spriteFundo,
            this.x, this.y,
            this.largura, this.altura,
        );
    }

    atualiza() {
        let movimentacao = this.y + this.velocidadeMovimento;
        this.y = movimentacao % this.altura;
    }
}

class Telas {
    constructor(tela) {
        this.tela = tela;

        if(tela == "JOGO") {
            this.fundo = new PlanoFundo();
            players.push(new Nave());
        }
    }
    
    desenha() {
        if(this.tela == "JOGO") {
            this.fundo.desenha();
            
            for(let i = 0; i < naveCarga.length; i++) {
                naveCarga[i].desenha();
            }
            
            for(let i = 0; i < players.length; i++) {
                players[i].desenha();
                
                if(players[i].tiroEspecial instanceof TiroEspecialNave) {
                    players[i].tiroEspecial.desenha();
                }
            }

            for(let i = 0; i < pacotesAumentaPoder.length; i++) {
                pacotesAumentaPoder[i].desenha();
            }
            
            for(let i = 0; i < escudos.length; i++) {
                escudos[i].desenha();
            }
            
            for(let chave in tiros) {
                tiros[chave].desenha();
            }
            
            for(let chave in inimigos) {
                inimigos[chave].desenha();
            }
            
            for(let chave in tirosInimigo) {
                tirosInimigo[chave].desenha();
            }

            score.desenha();

            contexto.drawImage(
                spriteHudBomba,
                51, 330,
                113, 35,
                7, canvas.height - 40,
                113, 35
            );

            for(let i = 0; i < tirosEspeciaisHud.length; i++) {
                contexto.drawImage(
                    spriteBombaReload,
                    10, 6,
                    12, 22,
                    tirosEspeciaisHud[i], canvas.height - 36,
                    12, 22
                );
            }

            contexto.drawImage(
                spriteHudShield,
                9, 8,
                60, 60,
                canvas.width - 70, canvas.height - 65,
                60, 60
            );
            
            if(escudoHud.length > 0) {
                contexto.drawImage(
                    spriteEscudoHud,
                    escudoHud[indiceAnimacaoHud].sx, escudoHud[indiceAnimacaoHud].sy,
                    escudoHud[indiceAnimacaoHud].largura, escudoHud[indiceAnimacaoHud].altura,
                    canvas.width - 54, canvas.height - 52,
                    escudoHud[indiceAnimacaoHud].largura, escudoHud[indiceAnimacaoHud].altura
                );

                if(Date.now() - ultimaAnimacaoHud > tempoAnimacaoHud) {
                    indiceAnimacaoHud += 1;
                    ultimaAnimacaoHud = Date.now();
                    
                    if(indiceAnimacaoHud == escudoHud.length) {
                        indiceAnimacaoHud = 0;
                    }
                }
            }
        }
    }
    
    atualiza() {
        if(this.tela == "JOGO") {
            this.fundo.atualiza();
            score.atualiza();
            
            for(let i = 0; i < players.length; i++) {
                players[i].movimento(this.fundo.largura, this.fundo.altura);
                players[i].atirar();
                players[i].atirarTiroEspecial();
            }

            for(let chave in inimigos) {
                inimigos[chave].movimento();
            }
            
            for(let chave in tirosInimigo) {
                tirosInimigo[chave].movimento();
            }
            
            for(let i = 0; i < naveCarga.length; i++) {
                naveCarga[i].movimento();
            }
            
            for(let i = 0; i < pacotesAumentaPoder.length; i++) {
                pacotesAumentaPoder[i].movimento();
            }

            for(let i = 0; i < escudos.length; i++) {
                escudos[i].movimento();
            }
        }
    }

    musicaDeFundo() {
        somDeFundo.play();
    }
}

telaAtiva = new Telas("JOGO");

window.addEventListener('keydown', (event) => {
    estadoTecla[event.key] = true;
});

window.addEventListener('keyup', (event) => {
    estadoTecla[event.key] = false;
});

let nivelDificuldade = 50;
let tempoInimigo = 400;
let tempoDificuldade = 100;
let tempoInimigoVermelho = 2000;

function geradorInimigos() {
    if(time % tempoInimigo == 0) {
        const xAleatorio = [-20, canvas.width];
        const escolherXAleatorio = gerarNumeroAleatorioInclusivo(0, 1);
        const yAleatorio = gerarNumeroAleatorioInclusivo(-10, canvas.height / 2);
        const inimigo = new InimigoPadrao(xAleatorio[escolherXAleatorio], yAleatorio, numeroInimigo);
        inimigos[numeroInimigo] = inimigo;
        numeroInimigo += 1;
    }

    if(time > tempoDificuldade) {
        if(tempoInimigo > nivelDificuldade) {
            tempoInimigo -= 50;
        }
        tempoDificuldade += tempoDificuldade;
    }
    
    if(time % tempoInimigoVermelho == 0) {
        numeroInimigo += 1;
        const xAleatorio = gerarNumeroAleatorioInclusivo(0, canvas.width - 32);
        const inimigo = new InimigoVermelho(xAleatorio, -27, numeroInimigo);
        inimigos[numeroInimigo] = inimigo;
        numeroInimigo += 1;
    }
}

let tempoNaveCarga = 1500;
function geradorNaveCarga() {
    if(time % tempoNaveCarga == 0) {
        const velocidadesAleatorias = [3, 3.3, 3.6, 4];
        const escolherVelocidadeAleatorio = gerarNumeroAleatorioInclusivo(0, 3);
        const xAleatorio = gerarNumeroAleatorioInclusivo(0, canvas.width - 50);
        naveCarga.push(new NaveCarga(xAleatorio, velocidadesAleatorias[escolherVelocidadeAleatorio]));
    }
}

function runGame() {
    geradorInimigos();
    geradorNaveCarga();
    
    telaAtiva.desenha();
    telaAtiva.atualiza();
    telaAtiva.musicaDeFundo();
    
    
    time += 1;
    
    requestAnimationFrame(runGame);
}

runGame();
