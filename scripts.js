
		function statusMouse(){
				let rect = canvas.getBoundingClientRect();
				posicaoMouseStatus.x = event.clientX - rect.left ; //- event.offsetX ; //event.pageX;
				posicaoMouseStatus.y = event.clientY - rect.top; //- event.offsetY;
				mouse_element.innerHTML = "Mouse: " + posicaoMouseStatus.x + "x" + posicaoMouseStatus.y;
		}
		function mudarMapa(){
					
					if(selecionado.value == "mapa1")
						facaMapa1();
					else if(selecionado.value == "mapa2")
						facaMapa2();
					else
						facaMapa3();
					caminhoSelecionado = [];
					selectAresta = [];
					tam_selecionado.value = "";
					div_resolucao.innerHTML	= "";
					atualizarCanvas();

	}
	function SelecionarSolucao(path){
		selectAresta =[];
		caminhoSelecionado = Solucao(path);
		tam_selecionado.value = tamDistanciaSelecionados2(caminhoSelecionado);
		atualizarCanvas();
	}
	function Solucao(path){
		let caminho_retornar;
		let token = path.split(",")
		let inicio, fim;
		caminho_retornar = [];
		inicio = token[0];
		for(let i=1; i< token.length; i++){
			fim = token[i]
			caminho_retornar.push([inicio,fim]);
			inicio = fim;
		}
		return caminho_retornar;
	}


	function verificar_rotulos_vertices(){
					let rvertice = document.getElementById("ver_rotulo_vertices");
					if(rvertice.checked == true)
								rotulo_vertice = true;
					else
								rotulo_vertice = false;
					atualizarCanvas();
	}
	function verificar_rotulos_arestas(){
					let rvertice = document.getElementById("ver_rotulo_arestas");
					if(rvertice.checked == true)
								rotulo_aresta = true;
							
					else
								rotulo_aresta = false;
					atualizarCanvas();
	}

	function	removePorNome(nome){
					let index = this.busca(nome);
					if(nome!= null){
								mapa.splice(index,1);
								for(let i = 0; i < mapa.length; i++)// retirar todas as ligações
								{
											index = mapa[i].ligacoes.indexOf(nome);
											if(index >= 0) mapa[i].ligacoes.splice(index,1);
										}
							}
	}

		function setDistancia(){
						let copia;
						let index;
						let index2;
						if(selectAresta.length == 1){
							copia = selectAresta[0];
							//console.log("copia", copia);
							index = mapa.findIndex((obj)=> obj.nome.toString() == copia[0].toString());
							index2 = mapa[index].ligacoes.findIndex((obj2)=> obj2 == copia[1]);
							if(index2 > -1){
								mapa[index].ligacoes_distancias[index2]= parseFloat(tam_selecionado.value);
								copia = [copia[1],copia[0]];
								index = mapa.findIndex((obj)=> obj.nome.toString() == copia[0].toString());
								index2 = mapa[index].ligacoes.findIndex((obj2)=> obj2 == copia[1]);
								if(index2 > -1){
									mapa[index].ligacoes_distancias[index2]= parseFloat(tam_selecionado.value);
								}
							}
							tam_selecionado.value = "";
							atualizarCanvas();
						}
						else{
							msg_erro.innerHTML = "Ajusta o tamanho de apenas uma  aresta selecionada";
						}
	}
	function clickRemover(){
					let nome = document.getElementById("nomeselecionado");
					if (selectAresta.length > 0){
						let copia;
						let index;
						let index2;
						//console.log("selectAresta", selectAresta);
						//console.log("mapa", mapa);	
							while (  selectAresta.length > 0){
							copia = selectAresta[0];
							//console.log("copia", copia);
							index = mapa.findIndex((obj)=> obj.nome.toString() == copia[0].toString());
							index2 = mapa[index].ligacoes.findIndex((obj2)=> obj2 == copia[1]);
							//console.log("index", index,"index2", index2);
							if(index2 > -1){
								mapa[index].ligacoes.splice(index2,1);
								mapa[index].ligacoes_distancias.splice(index2,1);
								copia = [copia[1],copia[0]];
								index = mapa.findIndex((obj)=> obj.nome.toString() == copia[0].toString());
								index2 = mapa[index].ligacoes.findIndex((obj2)=> obj2 == copia[1]);
								if(index2 > -1){
									mapa[index].ligacoes.splice(index2,1);
									mapa[index].ligacoes_distancias.splice(index2,1);
								}
							}
							selectAresta.splice(0,1);
						}
						tam_selecionado.value="";
					}
					else if(selectVertice.length > 0){
								let index = busca(nome.value);
								if(index >= 0){
											removePorNome(nome.value);	
										}
							}else if(selectAresta > 0){
									}
					nome_selecionado.value = ""
					atualizarCanvas();
	}

	function setMapa(string_json){
					mapa = [];
					const json = JSON.parse(string_json);
					mapa_nome.value = json.nome_mapa;
					for( let i = 0; i < json.caminhos.length; i++)
					{
								mapa.push(new Caminho( json.caminhos[i].nome,
											json.caminhos[i].x, json.caminhos[i].y,
											json.caminhos[i].ligacoes,
											json.caminhos[i].ligacoes_distancias));
							}	
					caminhoSelecionado = [];
					selectAresta = [];
					div_resolucao.innerHTML	= "";
					atualizarCanvas();

	}

	function direcionarDados(e){
					let arquivo = e.target.files[0];
					let string_json;
					if(!arquivo)
						return;
					let dados = new FileReader();
					dados.onload = function(e){
								string_json = e.target.result;
								setMapa(e.target.result);

							}
					dados.readAsText(arquivo);
	}

	function salvarMapa(){
		if(mapa_nome.value.length < 1){
					alert("Colocar o nome do mapa");
					return;
			}
		let stringGravar = "{\"nome_mapa\" : \"" + mapa_nome.value + "\",\n";
		if(mapa.length > 0 ){
			stringGravar = stringGravar + "\t\"caminhos\":[";
			for(let i = 0 ; i < mapa.length; i++)
			{
				if(i > 0 ) stringGravar = stringGravar + ",";
					stringGravar = stringGravar + "\t\n{"
					stringGravar = stringGravar + "\t\t\"nome\":\"" + mapa[i].nome + "\",\n";
					stringGravar = stringGravar + "\t\t\"x\":"+ mapa[i].x + ",\n";
					stringGravar = stringGravar + "\t\t\"y\":"+ mapa[i].y + ",\n";
					stringGravar = stringGravar + "\t\t\"ligacoes\":[" ;
					for(let x = 0; x < mapa[i].ligacoes.length; x++)
					{	if(x > 0) stringGravar= stringGravar + ",";
								stringGravar = stringGravar + "\"" + mapa[i].ligacoes[x] + "\"";
							}
					stringGravar = stringGravar + "],\n";
					stringGravar = stringGravar + "\t\t\"ligacoes_distancias\":[";
					for(let x = 0; x < mapa[i].ligacoes.length; x++)
					{	
						if(x > 0) stringGravar= stringGravar + ",";
							stringGravar = stringGravar +  mapa[i].ligacoes_distancias[x] ;
					}
					stringGravar = stringGravar + "]\n"
					stringGravar = stringGravar + "\t}";

			}
			stringGravar = stringGravar + "\n\t]"
		}

			stringGravar = stringGravar+ "\n}";
			const file = new Blob([stringGravar], { type: 'text/plain' });
			const link = document.createElement("a");
			link.href = URL.createObjectURL(file);
			link.download = "Mapa.json";
			link.click();
			return URL.revokeObjectURL(link.href);
		}


	function CarregarMapa(){
		let inputfile = document.getElementById("abrir-arquivo");
		let strFile ;
		inputfile.click();
		if(inputfile.files > 0){
			strFile = inputfile.files[0].nome;
			let leitor = new FileReader();
		}
	}
	function distanciaEuclidianaAparaB(a, b){ //distancia entre dois caminhos conectados
				let distancia = Math.sqrt(Math.pow((b.x - a.x),2) + Math.pow((b.y - a.y),2) ); 
				return parseFloat(distancia);		//}else{
	}
	function coeficienteAngular(a,b){
		let angulo = (b.y - a.y) / (b.x - a.x);
		if (angulo == Number.POSITIVE_INFINITY)
			angulo =0;
		return angulo;
	}
	function coeficienteLinear(a,b){
		let ca = coeficienteAngular(a,b);
		return a.y - (ca * a.x);
	}
	function yfuncaoXAB(a, b, x){
		return (x * coeficienteAngular(a, b)) + coeficienteLinear(a, b);
	}
	function xfuncaoXAB(a, b, y){
		let resultado = (y - coeficienteLinear(a,b)) / coeficienteAngular(a,b);
		if(resultado == Number.POSITIVE_INFINITY)
				resultado = 0;
		return resultado; 
	}

	function desenhaLinha( coordenada1, coordenada2){
		if(coordenada1.localizado == false || coordenada2.localizado == false)
			return;
		let x_r, y_r, distancia;
		let index;
		let selection;
		let selection2;
		let cordsel;
		let cordsel2;
		cordsel = [coordenada1.nome, coordenada2.nome];
		cordsel2 = [coordenada2.nome, coordenada1.nome];
		selection = caminhoSelecionado.findIndex((obj)=> obj.toString() == cordsel.toString());
		selection1 = selectAresta.findIndex((obj)=> obj.toString() == cordsel.toString());
		if(selection1 == -1)
			selection1 = selectAresta.findIndex((obj)=> obj.toString() == cordsel2.toString());
		if(selection == -1)
			selection = caminhoSelecionado.findIndex((obj)=> obj.toString() == cordsel2.toString());
			
		if(rotulo_aresta ){
			index = coordenada1.ligacoes.indexOf(coordenada2.nome);
			distancia = coordenada1.ligacoes_distancias[index];
			x_r = (coordenada2.x + coordenada1.x) /2;
			y_r= x_r * coeficienteAngular(coordenada1, coordenada2) + coeficienteLinear(coordenada1,coordenada2); 
			contexto.font = "18px Arial";
			contexto.fillStyle = "black";
			contexto.fillText(distancia, x_r, y_r);
		}
		contexto.beginPath();
		contexto.moveTo(coordenada1.x, coordenada1.y);

		contexto.lineTo(coordenada2.x, coordenada2.y);
		if(selection >= 0 ){
			contexto.strokeStyle = "green";
			contexto.lineWidth = 3;
		}
		else if (selection1 >= 0){
			contexto.strokeStyle = "yellow";
			contexto.lineWidth = 2;
		}
		else{
			contexto.lineWidth = 0.1;
			contexto.strokeStyle = "gray";
		}

		contexto.closePath();
		contexto.fill();

		contexto.stroke();
	}


	function desenhaCirculo(caminho, cor){
		if(caminho.localizado == false)
			return;
		let x_r, y_r;
		if(rotulo_vertice ){
			contexto.font = "20px Arial";
			contexto.fillStyle = "black";
			contexto.fillText(caminho.nome, caminho.x, caminho.y-10);
		}

		if(selectVertice.indexOf(caminho.nome) >= 0){
			contexto.beginPath();
			contexto.arc(caminho.x, caminho.y, 8, 0 , 2 * Math.PI);
			contexto.closePath();
			contexto.fillStyle = "black";
			contexto.fill();
			contexto.stroke();
		}

		contexto.beginPath();
		contexto.arc(caminho.x , caminho.y , 5, 0, 2 * Math.PI);
		contexto.closePath();
		contexto.fillStyle = cor;
		contexto.strokeStyle = "black";
		contexto.fill();
		contexto.stroke();
	}
	function espera(tempo){
		let inicio = new Date().getTime();
		let fim = inicio;
		while(fim < inicio + tempo) {
			fim = new Date().getTime();
		}
	}

	function desenhaCirculo2(caminho, cor){
		contexto.beginPath();
		contexto.arc(caminho.x , caminho.y , 5, 0, 2 * Math.PI);
		contexto.closePath();
		contexto.fillStyle = cor;
		contexto.fill();
		contexto.stroke();
	}
	function addPosicao(){
		let nome = document.getElementById("nomeselecionado").value;
		let teste = busca(nome);
		if(  teste == null )
			mapa.push(new Caminho(nome, posicaoMouse.x, posicaoMouse.y, [],[]));
		atualizarCanvas();

	}
	function cliqueNaReta(a , b , c){
		let  teste1, teste2, teste3;
		let y  = yfuncaoXAB(a, b,c.x);
		let x1, x2, y1,y2;
		let folga = 15;
		if(a.x >= b.x){
			x2 = a.x;
			x1 = b.x;
		}else{
			x2 = b.x;
			x1 = a.x;
		}

		if(a.y >= b.y){
			y2 = a.y;
			y1 = b.y;
		}else{
			y2 = b.y;
			y1 = a.y;
		}
		if(coeficienteAngular(a,b) == 0)
			teste1 = true;
		else
			teste1 = Math.abs(c.y - y) <= folga;

		teste2 = c.x >= x1-folga && c.x <= x2+folga;
		teste3 = c.y >= y1-folga && c.y <= y2+folga;
		if ( teste1 && teste2 && teste3 )
			return true;
		return false;		
	}

	function pegarPosicaoMouse(){
		let rect = canvas.getBoundingClientRect();
		posicaoMouse.x = event.clientX - rect.left ; //- event.offsetX ; //event.pageX;
		posicaoMouse.y = event.clientY - rect.top; //- event.offsetY;
		let testevertice = false;
		let testearesta = false;
		let vertice = "";
		let aresta = [];
		let distancia;
		let coordenadaAresta = [];
		let pos;
		let teste_reta;
		for(let i = 0; i< mapa.length; i++)
		{
			distancia = distanciaEuclidianaAparaB(posicaoMouse, mapa[i]);
			if( distancia <= 5 ){
				vertice = mapa[i].nome;
				testevertice = true;
				break;
			}

		}
		if( testevertice == false ){
			pontonareta = new Caminho();
			for(let i = 0; i<mapa.length ; i++)
			{
				for(let j = 0; j < mapa[i].ligacoes.length ; j++)
				{
					pos = mapa.findIndex((obj) => obj.nome == mapa[i].ligacoes[j]);
					teste_reta = cliqueNaReta(mapa[i],mapa[pos], posicaoMouse);
					if(teste_reta ){
						testearesta = true;
						coordenadaAresta = [ mapa[i].nome, mapa[pos].nome];
						caminhoSelecionado = [];
						break;
				  }
				}
				if(testearesta == true)
							break;
			}
			
		}


		if(testevertice){
			selectVertice.push(vertice);
			selectAresta = [];
			nome_selecionado.value = vertice; 
			if(selectVertice.length > 1){
				let caminho1 = busca(selectVertice[0]);
				let caminho2 = busca(selectVertice[1]);
				if( caminho1 != null && caminho2 !=null)
					distancia = distanciaEuclidianaAparaB(mapa[caminho1],mapa[caminho2]);
				if( mapa[caminho1].ligacoes.indexOf(selectVertice[0]) < 0){
					mapa[caminho1].ligacoes.push(selectVertice[1]);
					mapa[caminho1].ligacoes_distancias.push(parseFloat(distancia.toFixed(2)));

				}
				if( mapa[caminho2].ligacoes.indexOf(selectVertice[1]) < 0){
					mapa[caminho2].ligacoes.push(selectVertice[0]);
					mapa[caminho2].ligacoes_distancias.push(parseFloat(distancia.toFixed(2)));
				}

				selectVertice = [];
				nome_selecionado.value = "";
			}
			atualizarCanvas();
		}
		else if(testearesta){
				let teste_selection = selectAresta.findIndex((obj)=>
										  obj.toString() == coordenadaAresta.toString());

				if(teste_selection == -1)
					selectAresta.push(coordenadaAresta);
				else
					selectAresta.splice(teste_selection,1);
			if(selectAresta.length > 0){
				tam_selecionado.value = tamDistanciaSelecionados();
				nome_selecionado.value="Arestas(s)";
				atualizarCanvas();
			}
		}
		if(testevertice == false && testearesta == false){
					selectVertice = [];
					selectAresta = [];
			tam_selecionado.value = "";
			nome_selecionado.value = "";
			atualizarCanvas();
			desenhaCirculo(posicaoMouse , "black");
		}
					}
			function busca(nome){
						for(let i = 0; i < mapa.length; i++){
									if(mapa[i].nome == nome)
										return i;
								}
						return null;
					}
		   function distanciaArestas(a, b){
				let distancia = 0.00;

				let index = mapa.findIndex( ( elemento ) => elemento.nome == a );
				let acho = false;

				if (index >= 0 ){
					for(let i = 0; i < mapa[index].ligacoes.length; i++)
					{
						if(mapa[index].ligacoes[i] == b){
							distancia = mapa[index].ligacoes_distancias[i];
							acho = true;
							break;
						}
					}
				}
				if(acho ==false)
					return Number.POSITIVE_INFINITY;
				return distancia;
			}
			
			function tamDistanciaSelecionados(){
				let distancia = 0.00;
				let ligacao;
				for(let i = 0 ; i < selectAresta.length ; i++){
					ligacao = selectAresta[i];

					distancia += distanciaArestas(ligacao[0], ligacao[1]);
				}
				return distancia.toFixed(2);
			}
			function tamDistanciaSelecionados2(caminhoSel){
				let distancia = 0.00;
				let ligacao;
				for(let i = 0 ; i < caminhoSel.length ; i++){
					ligacao = caminhoSel[i];

					distancia += distanciaArestas(ligacao[0], ligacao[1]);
				}
				return distancia.toFixed(2);
			}
			function atualizarCaminhosNoCanvas(){
						for(let i = 0 ; i < mapa.length ; i++)
						{
									desenhaCirculo(mapa[i], "orange");
									let index;
									for( let l = 0; l < mapa[i].ligacoes.length; l++)
									{
											index = busca( mapa[i].ligacoes[l] );
											if(index != null  )
													desenhaLinha(mapa[i], mapa[index] );			
											}
								}
			}
			function atualizarCanvas(){
						contexto.clearRect(0,0, canvas.width, canvas.height);
						atualizarCaminhosNoCanvas();
						msg_erro.innerHTML = "";
			}




	function facaMapa1(){
				mapa = [];
				caminho = new Caminho("a",65,98,["c","b","d"],[77.52,303.92,74.43]);
				mapa.push(caminho);

				caminho = new Caminho("b",366,140,["a","d"],[303.92,237.03]);
				mapa.push(caminho);

				caminho = new Caminho("c",74,175,["a","d"],[77.52,67.42]);	
				mapa.push(caminho);

				caminho = new Caminho("d",129,136,["a","c","b"],[74.43,67.42,237.03]);
				mapa.push(caminho);

				mapa_nome.value = "Mapa 1";

				atualizarCanvas();
	}
	function facaMapa2(){
			mapa = [];
			caminho = new Caminho("a",105, 78,  ["c","e","f","b","d"],[123.11,237.47,321.50,183.00,291.62]);
			mapa.push(caminho);
			caminho = new Caminho("b", 288, 78, ["c","a","e","f","d"],[281.76,183.00,290.50,247.17,125.25]);
			mapa.push(caminho);
			caminho = new Caminho("e", 120, 315,["c","a","b","d","f"],[177.23,237.47,290.50,309.90,192.21]);
			mapa.push(caminho);
			caminho = new Caminho("f", 312, 324, ["c","a","b","d","e"], [330.18,321.50,247.17,183.58,192.21]);
			mapa.push(caminho);
			caminho = new Caminho("c", 21, 168, ["a","b","d","f","e"], [123.11,281.76,365.20,330.18,177.23]);
			mapa.push(caminho);
			caminho = new Caminho("d", 386, 156, ["c","a","b","e","f"],[365.20,291.62,125.25,309.90,183.58]);
			mapa.push(caminho);

			mapa_nome.value = "Mapa 2";

			atualizarCanvas();
	}

	function facaMapa3(){
			mapa = [];
			caminho = new Caminho("1", 40, 188, ["2","4","5"], [105.48, 146.93, 270.20]);
			mapa.push(caminho);
			caminho = new Caminho("3", 328, 193,["5","2","4"], [152.32, 206.89, 264.20]);
			mapa.push(caminho);
			caminho = new Caminho("4", 98, 323, ["1","5","3"], [146.93,170.29, 264.20]);
			mapa.push(caminho);
			caminho = new Caminho("5", 268, 333,["4","3","1"], [170.29,152.32, 270.20]);
			mapa.push(caminho);
			caminho = new Caminho("2", 130,133, ["1","3"], [105.48,206.89]);
			mapa.push(caminho);

			mapa_nome.value = "Mapa 3";

			atualizarCanvas();
	}



	function executarPSO(){
		num_populacao = document.getElementById ("num_populacao").value;
		num_interacoes = document.getElementById("num_interacoes").value;
		let div_resolucao = document.getElementById("resolucao");
		const exp_num = /[0-9]/;
		atualizarCanvas();	
		if( mapa.length < 1){
			msg_erro.innerHTML += "Você tem que carregar ou criar um mapa para rodar o PSO";
			return;
		}
		if( !exp_num.test(num_populacao) && num_populacao.length < 1){
			msg_erro.innerHTML += "Preencha o campo população com número;";
			return;
		}
		if( !exp_num.test(num_interacoes) && num_interacoes.length < 1){
			msg_erro.innerHTML += "Preencha o campo interações com número;";
			return;
		}

		caminhoselecionado = [];
		selectaresta = [];
		pso = new PSO(mapa, num_populacao , num_interacoes );
		pso.solucionar();
		let strhtml;
		if(pso.g.length < 1){
			strhtml = "<h2>Não foi localizada uma solução para o problema do caixo viajante (PCV)";
			strhtml += " usando o algoritmo PSO com uma população de " +  num_populacao + " individuos(s) e ";
			strhtml += num_interacoes +" loop(s) </h2>";
			div_resolucao.innerHTML = strhtml;
		}else{	
			selectAresta =[];
			caminhostr=[]
			let strhtml = "<table>";
			strhtml += "<tr><th>Distancia</th><th>X</th><th>Caminho</th></tr>"
			for(let i= 0 ; i < pso.g.length ; i++){
				caminhostr.push(pso.g[i].caminho.toString()); 
				strhtml += "<tr>";
				strhtml += "<td>" + parseFloat(pso.g[i].menor).toFixed(2) + "</td>";
				strhtml += "<td>" + pso.g[i].posicao+ "</td>";
				strhtml += "<td><a href=\"javascript:SelecionarSolucao(caminhostr["+i+"]);\">";
				strhtml += caminhostr[i] +  "</a></td>";
				strhtml += "</tr>";
			}
			strhtml += "</table>";
			div_resolucao.innerHTML = strhtml;
		}
	}

		let div_resolucao;
		let caminhostr = []; 	
		let num_interacoes;
		let num_populacao;
		let canvas;
		let contexto;
		let mapa = [];
		let posicaoMouse = new Caminho( 0, 0,[], []);
		let selectVertice;
		let selectAresta;
		let selectArestatam;
		let arestasDesenhadas;
		let caminhoSelecionado;
		let campo_remover;
		let nome_selecionado;
		let mapa_nome;
		let rotulo_aresta;
		let rotulo_vertice;
		let selecionado; //para mudar o mapa
		let mouse_element;
		let posicaoMouseStatus = new Caminho( 0, 0,[], []);
		let msg_erro;

		window.onload = function(){
					canvas = document.getElementById("meucanvas");
					contexto = canvas.getContext("2d");
					canvas.width = canvas.offsetWidth;
					canvas.height = canvas.offsetHeight;
					selectVertice = [];
					selectAresta = [];
					selectArestatam=0.00;
					arestasDesenhadas = [];
					caminhoSelecionado = []
					caminhostr = []
					tam_selecionado = document.getElementById("tamselecionado");
					nome_selecionado = document.getElementById("nomeselecionado");
					mapa_nome = document.getElementById("mapa_nome");
					selecionado = document.getElementById("mapas");
					num_populacao = document.getElementById("num_populacao").value;
					num_interacoes = document.getElementById("num_interacoes").value;
					mouse_element = document.getElementById("status_mouse");
				   canvas = document.getElementById("meucanvas");
					div_resolucao = document.getElementById("resolucao");
					msg_erro =  document.getElementById("erro");
					selecionado.value = "";
					tam_selecionado.value = "";
					nome_selecionado.value = "";
					mapa_nome.value="";
					rotulo_aresta = true;
					rotulo_vertice = true;
					selecionado.value = "mapa2";
					mudarMapa();
		}
