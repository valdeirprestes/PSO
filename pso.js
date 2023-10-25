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



const PSO = class {
	constructor( caminhos, populacao ,  ninteracoes){
		this.populacao = populacao;
		this.caminhos = caminhos 
		this.ninteracoes = ninteracoes;
		this.x = [] // posicao de cada particula 
		this.v = [] // velocidade de cada particula
		this.p = [] // melhor posição encontrada pela particula
		this.g = [] // melhor posição encontrada por todas particulas
		this.c1 = 0.35 // taxa de aprendizado
		this.c2 = 0.70 // taxa de aprendizado
		this.w = null // pondenração inerciai

		this.r1 = Math.random() * (0.99-0.01) + 0.01 // numeros aleatorios entre 0 e 1
		this.r2 = Math.random() * (0.99-0.01) + 0.01 // numeros aleatorios entre 0 e 1

		for(let i = 0; i< populacao; i++){
			this.x.push(parseInt(Math.random() * (this.caminhos.length-0) + 0)); // limites de x
			this.p.push(parseInt(Math.random() * (this.caminhos.length - 0)+ 0));
		}
		this.vertices = []
		for(let i = 0; i < this.caminhos.length; i++)
			this.vertices.push(this.caminhos[i].nome);
		this.fitness();
	}

	distanciaAparaB(a, b){ //se não estiver no caminho retorna infinito
		let distancia = 0.00;
		let index = this.caminhos.findIndex( ( elemento ) => elemento.nome == a );
		let acho = false;

		if (index >= 0 ){
			for(let i = 0; i < this.caminhos[index].ligacoes.length; i++)
			{
				if(this.caminhos[index].ligacoes[i] == b){
					distancia = this.caminhos[index].ligacoes_distancias[i];
					acho = true;
					break;
				}
			}
		}
		if(acho ==false)
			return Number.POSITIVE_INFINITY;
		return distancia;
	}

	caminhoAleatorio(vetor, pos){
		let distribuicao = [];
		let i;
		let copia = vetor.map((elementos)=> elementos);
		let distancia;
		let anterior, atual;
		if(pos >= copia.length)
			i = parseInt(pos % vetor.length);
		else
		i = pos ;//parseInt(copia.length - (pos+1));
		anterior = copia[i]
		distribuicao.push(anterior);
		copia.splice(i,1)
		distancia = 0.00;
		while(copia.length > 0){
			i = Math.floor(Math.random() * ((copia.length-1) - 0) + 0 );
			distancia += this.distanciaAparaB(anterior, copia[i]);
			if(distancia ==  Number.POSITIVE_INFINITY)
				return [distribuicao, distancia];
			atual = copia[i];
			distribuicao.push(atual);
			copia.splice(i,1);
			anterior=atual;
		}
		distancia += this.distanciaAparaB(anterior, distribuicao[0]);
		distribuicao.push(distribuicao[0]);
		return [distribuicao, distancia];

	}

	atualizaVelocidade(){
		let parte1;
		let parte2;
		let parte3;
		for(let i = 0; i < this.populacao.lenght ; i++)
		{
			//this.c1 = Math.random() * (0.99-0.01) + 0.01;
			//this.c2 = Math.random() * (0.99-0.01) + 0.01;
			this.w = Math.random() * (1 - 0) + (0.1); 
			parte1 = this.w * this.v[this.v[i]];
			parte2 = this.c1 * this.r1  * ( this.p[i][0] - this.x[i] );
			parte3 =  this.c2 * this.r2 * (this.g[0].posicao - this.x[i]);

			this.v[i] = parte1 + parte2 + parte3; 
		}
	}

	atualizaPosicao(){
		for(let i = 0 ; i<this.populacao.lenght ; i++)
			this.x[i] = parseInt(x[i-1] + v[i-1]);
	}

	fitness(){ // melhor posicao da particula
		let menor;
		let i_menor;
		let menor_caminho;
		let caminho;
		let distancia;
		let caminho_distancia;
		menor = Number.POSITIVE_INFINITY;
		menor_caminho = ""
		for(let i = 0 ; i < this.populacao ; i++)
		{
			caminho_distancia = this.caminhoAleatorio(this.vertices, this.x[i]);
			caminho = caminho_distancia[0]
			distancia = caminho_distancia[1]
			if(menor > distancia && caminho.length == this.vertices.length+1){
				menor = distancia;
				i_menor = i;
				menor_caminho = caminho;
				this.p[i] = [i_menor, caminho];
			}
		}
		let duplicado = this.g.findIndex( (objeto) => objeto.caminho.toString() == menor_caminho.toString() );
		if(menor < Number.POSITIVE_INFINITY &&  duplicado == -1 ){
			this.g.push({menor:menor, posicao:i_menor, caminho:menor_caminho});
			this.g.sort(function (a,b)	{return a.menor - b.menor;	});
		}
	}

	processar(){
		this.vertices = []
		for(let i = 0; i <this.caminhos.length; i++)
			this.vertices.push(this.caminhos[i].nome);
			this.atualizaVelocidade();
			this.atualizaPosicao();
			this.fitness();
	}

	solucionar(){
		let contagem = 0;
		while(this.ninteracoes > contagem){
			this.processar();
			contagem++;
		}
	}
}

