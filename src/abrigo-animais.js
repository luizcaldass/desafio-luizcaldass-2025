// CORREÇÃO: Importações ajustadas para o padrão ES Modules.
import {Animais} from './animais.js'; // <-- CORREÇÃO: Usando 'import' e adicionando a extensão '.js'

// 'json' não estava sendo usado, então foi removido.

class AbrigoAnimais {
  constructor(listaDeAnimais = Animais) {
    this.listaDeAnimais = listaDeAnimais;
  }

  // CORREÇÃO: Renomeei o método para ser consistente com a chamada.
  parseEntrada(entrada) {
    const partes = entrada.split(';').map(p => p.trim());
    if (partes.length < 2) {
      console.log("Entrada inválida. Formato esperado: 'brinquedo1, brinquedo2; animal1, animal2'");
      return null;
    }

    const nomes = partes.pop();
    const nomesAnimais = nomes.split(',').map(n => n.trim());

    // CORREÇÃO: Verificando o tamanho do array com .length
    if (nomesAnimais.length > 3) { 
      console.log("Você só pode tentar adotar 3 animais de uma vez");
      return null;
    }

    const listbrinquedos = partes.map(brinquedostr => brinquedostr.split(',').map(b => b.trim().toUpperCase()));

    return {
      animais: nomesAnimais, // <-- Note que a propriedade é 'animais' com 'a' minúsculo
      brinquedos: listbrinquedos
    };
  }

  encontraPessoas(brinquedos1, brinquedos2, nomes) {
    const dadospessoa1 = this.parseEntrada(`${brinquedos1};${nomes}`);
    const dadospessoa2 = this.parseEntrada(`${brinquedos2};${nomes}`);

    if (!dadospessoa1 || !dadospessoa2) {
      return { erro: 'Animal inválido', lista: false };
    }

    let adotadosP1 = 0;
    let adotadosP2 = 0;
    const animaisadotados = new Set();
    const lista = [];

    for (const animal of this.listaDeAnimais) {
      let adotante = null;

      // Pessoa 1
      const indexAnimalP1 = dadospessoa1.animais.findIndex(nome => nome.toUpperCase() === animal.nome.toUpperCase());
      if (indexAnimalP1 !== -1 && adotadosP1 < 3 && !animaisadotados.has(animal.nome)) {
        const brinquedosUsuario = dadospessoa1.brinquedos[indexAnimalP1];
        const seqbrinquedos = animal.brinquedos.map(b => b.toUpperCase());
        if (JSON.stringify(brinquedosUsuario) === JSON.stringify(seqbrinquedos)) {
          adotante = "pessoa 1";
          adotadosP1++;
          animaisadotados.add(animal.nome);
        }
      }

      // Pessoa 2
      const indexAnimalP2 = dadospessoa2.animais.findIndex(nome => nome.toUpperCase() === animal.nome.toUpperCase());
      if (indexAnimalP2 !== -1 && adotadosP2 < 3 && !animaisadotados.has(animal.nome)) {
        const brinquedosUsuario = dadospessoa2.brinquedos[indexAnimalP2];
        const seqbrinquedos = animal.brinquedos.map(b => b.toUpperCase());
        if (JSON.stringify(brinquedosUsuario) === JSON.stringify(seqbrinquedos)) {
          adotante = "pessoa 2";
          adotadosP2++;
          animaisadotados.add(animal.nome);
        }
      }

      if (adotante) {
        lista.push(`${animal.nome} - ${adotante}`);
      } else {
        lista.push(`${animal.nome} - abrigo`);
      }
    }

    // Animal inválido
    if (lista.every(item => item.endsWith('abrigo'))) {
      return { erro: 'Animal inválido', lista: false };
    }

    return { erro: null, lista };
  }
}

export { AbrigoAnimais };