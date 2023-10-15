const Caminho = class{
	constructor(nome, x,y, ligacoes,distancias){
		this.nome = nome
		this.x = x;
		this.y = y;
		this.ligacoes = ligacoes;
		this.ligacoes_distancias = distancias;
		this.localizado = true;
	}
}


const Espaco = class{
	constructor(largura, altura){
		this.largura = largura;
		this.altura  = altura;
		this.caminhos = [] //cordenadas dos caminhos
		this.particulas = []
	}

	ligacaoAeB(a,b){
		for(let i=0 ; i < a.ligacoes.lenght ; i++)
		{
			if(a.ligacoes[i].x == b.x && a.ligacoes[i].y == b.y)
				return true;
		}
		return false;
	}

	distanciaEuclidianaAparaB(a, b){ //distancia entre dois caminhos conectados
		//if(this.ligacaoAeB(a,b)){ // posso ir de A para B ? sim
		//console.log("a", a, "b",b);
		let distancia = Math.sqrt(Math.pow((b.x - a.x),2) + Math.pow((b.y - a.y),2) ); 
		//console.log("distanciaAparaB",distancia);
		return distancia;		//}else{
		//	return Number.POSITIVE_INFINITY;
		//}
	}
	distanciaCaminhoAparaB(a, b){ //se não estiver no caminho retorna infinito
		let distancia = 0.00;
		let index = this.busca(a);
		let acho = false;
		//console.log("a", a, "this.caminhos[index]", this.caminhos[index].nome);
		//console.log("distanciaCaminhoAparaB a", a, "b", b);
		if (index != null){
			for(let i = 0; i < this.caminhos[index].ligacoes.length; i++)
			{
				if(this.caminhos[index].ligacoes[i] == b){
					//console.log("teste ",this.caminhos[index].ligacoes[i],"=",b);
					distancia = this.caminhos[index].ligacoes_distancias[i];
					//console.log(distancia);
					acho = true;
					break;
				}
			}
		}
		if(acho ==false)
			return Number.POSITIVE_INFINITY;
		return distancia;
	}
	coeficienteAngular(a,b){
		return (b.y - a.y) / (b.x - a.x);
	}
	coeficienteLinear(a,b){
		let ca = this.coeficienteAngular(a,b);
		return a.y - (ca * a.x);
	}
	addCaminho( caminho ){
		this.caminhos.push( caminho );
	}
	removeCaminho ( caminho ) {
		for( let i = 0; i < this.caminhos.lenght; i++)
		{
			if( this.caminhos[i].x == caminho.x && this.caminhos[i].y == caminho.y){
				this.caminhos.splice(i,1);
				return true;
			}
		}
		return false;
	}
	busca(caminho_nome){
		for(let i = 0; i < this.caminhos.length; i++){
			if(this.caminhos[i].nome == caminho_nome)
				return i;
		}
		return null;
	}
	removePorNome(nome){
		let index = this.busca(nome);
		if(nome!= null){
			this.caminhos.splice(index,1);
			for(let i = 0; i < this.caminhos.length; i++)// retirar todas as ligações
			{
				index = this.caminhos[i].ligacoes.indexOf(nome);
				if(index >= 0) this.caminhos[i].ligacoes.splice(index,1);
			}
		}

	}
} 

const PSO = class {
	constructor( populacao , espaco, ninteracoes){
		this.populacao = populacao;
		this.espaco = espaco;
		this.ninteracoes = ninteracoes;
		this.x = [] // posicao de cada particula 
		this.v = [] // velocidade de cada particula
		this.p = [] // melhor posição encontrada pela particula
		this.g = [] // melhor posição encontrada por todas particulas
		this.c1 = [] // taxa de aprendizado
		this.c2 = [] // taxa de aprendizado
		this.w = null // pondenração inerciai

		this.r1 = Math.random() * (0.99-0.01) + 0.01 // numeros aleatorios entre 0 e 1
		this.r2 = Math.random() * (0.99-0.01) + 0.01 // numeros aleatorios entre 0 e 1

		for(let i = 0; i< populacao; i++){
			this.x.push(parseInt(Math.random() * (500-0) + 0)); // limites de x
		}
		this.vertices = []
		for(let i = 0; i < this.espaco.caminhos.length; i++)
			this.vertices.push(this.espaco.caminhos[i].nome);
		this.fitness();

	}
	atualizaVelocidade(){
		let parte1;
		let parte2;
		let parte3;
		for(let i = 0; i < this.populacao.lenght ; i++)
		{
			this.w = Math.random() * (1 - 0) + (0.1); 
			parte1 = this.w * this.v[this.v[i-1]];
			parte2 = this.c1 * this.r1 ( this.p[1] - this.x[i] );
			parte3 =  this.c2 * this.r2 (this.g[0].posicao - this.x[i]);

			this.v[i] = parte1 + parte2 + parte3; 
		}
	}
	atualizaPosicao(){
		for(let i = 0 ; i<this.populacao.lenght ; i++)
			this.x[i] = parseInt(x[i-1] + v[i+1]);
	}
	fitness(){ // melhor posicao da particula
		let menor;
		let i_menor;
		let menor_caminho;
		let caminho;
		let distancia;
		menor = Number.POSITIVE_INFINITY;
		for(let i = 0 ; i < this.populacao ; i++)
		{
			//console.log("this.x[i]", this.x[i], "\nthis.vertices", this.vertices);
			caminho = this.distruicaoAleatoria(this.x[i],this.vertices);
			distancia = this.calcularRota(caminho);
			//console.log("distancia", distancia);
			//console.log("caminho",caminho);
			if(menor > distancia){
//				console.log("entrou i",i,"caminho", caminho);
				menor = distancia;
				i_menor = i;
				menor_caminho = caminho;
				this.p = [i_menor, caminho];
			}
		}
		if(menor < Number.POSITIVE_INFINITY){
			console.log("ADICIONOU ", menor, i_menor, menor_caminho);
			this.g.push({menor:menor, posicao:i_menor, caminho:menor_caminho});
			//console.log("Ordenando G");
			this.g.sort(function (a,b)	{return a.menor - b.menor;	});
		}
	}
	processar(){
		this.vertices = []
		for(let i = 0; i <this.espaco.caminhos.length; i++)
			this.vertices.push(this.espaco.caminhos[i].nome);
		while(this.ninteracoes>0){
			console.log("Falta ", this.ninteracoes);
			this.atualizaVelocidade();
			this.atualizaPosicao();
			this.fitness();

			this.ninteracoes -= 1
		}
	}
	calcularRota(rota){
		let distancia = 0.00;
		let atual, anterior;
		let index;
		let valor= 0.00;
		anterior = rota[0];
		for(let i = 1 ; i <rota.length ; i++){
			atual = rota[i];
			//console.log("anterior", anterior, "atual", atual);
			valor = this.espaco.distanciaCaminhoAparaB(anterior, atual);
			//console.log("valor", valor);
			anterior = atual;
			distancia += valor;
		} 
		//console.log("calculo rota", rota,distancia);
		return distancia;
	}
	clonarArray( amostra){
		let novo_array = []
		for (let i= 0 ; i < amostra.length; i++){
			novo_array.push(amostra[i])
		}
		return novo_array;
	}

	distruicaoAleatoria(pos, vetor){
		let distribuicao = [];
		let i;
		let copia = this.clonarArray(vetor);
		if(pos >= copia.length)
			i = parseInt(pos % vetor.length);
		else
			i = parseInt(copia.length - (pos+1));
		//console.log("pos",pos,"i", i);
		distribuicao.push(copia[i]);
		copia.splice(i,1);
		while(copia.length > 1){
			i = parseInt(Math.random() * ((copia.length-1) + 1)  );
			//console.log("loop distribuicaoAleatoria i",i, "copia", copia.length, copia[i]);
			distribuicao.push(copia[i]);
			copia.splice(i,1);
		}
		distribuicao.push(copia[0]);
		distribuicao.push(distribuicao[0]);
		//console.log("distribuicao", distribuicao);
		return distribuicao;

	}
}

