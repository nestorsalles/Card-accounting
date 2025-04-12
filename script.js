document.addEventListener('DOMContentLoaded', () => {
    const formCartao = document.getElementById('formCartao');
    const formCompra = document.getElementById('formCompra');
    const nomeCartao = document.getElementById('nomeCartao');
    const cartaoAtual = document.getElementById('cartaoAtual');
    const nomeCompra = document.getElementById('nomeCompra');
    const tipoCompra = document.getElementById('tipoCompra');
    const totalParcelas = document.getElementById('totalParcelas');
    const parcelaAtual = document.getElementById('parcelaAtual');
    const valorParcela = document.getElementById('valorParcela');
    const btnFinalizarCartao = document.getElementById('btnFinalizarCartao');
    const resumoCartoes = document.getElementById('resumoCartoes');
    const totalGeralDiv = document.getElementById('totalGeral');
  
    const comprasAtuaisResumo = document.getElementById('comprasAtuaisResumo');
    const listaComprasAtuais = document.getElementById('listaComprasAtuais');
    const totalComprasAtuais = document.getElementById('totalComprasAtuais');
  
    let cartoes = JSON.parse(localStorage.getItem('cartoes')) || [];
    let comprasAtuais = [];
    let nomeCartaoAtual = '';
  
    exibirResumo();
  
    formCartao.addEventListener('submit', (e) => {
      e.preventDefault();
      nomeCartaoAtual = nomeCartao.value.trim();
      if (!nomeCartaoAtual) return;
  
      cartaoAtual.textContent = `💳 Cartão: ${nomeCartaoAtual}`;
      formCartao.classList.add('hidden');
      formCompra.classList.remove('hidden');
      formCartao.reset();
    });
  
    tipoCompra.addEventListener('change', () => {
      const unica = tipoCompra.value === 'única';
      totalParcelas.style.display = unica ? 'none' : 'block';
      parcelaAtual.style.display = unica ? 'none' : 'block';
    });
  
    formCompra.addEventListener('submit', (e) => {
      e.preventDefault();
      const nome = nomeCompra.value.trim();
      const tipo = tipoCompra.value;
      const valor = parseFloat(valorParcela.value.replace(',', '.'));
      const atual = parseInt(parcelaAtual.value) || 1;
      const total = parseInt(totalParcelas.value) || 1;
  
      if (!nome || isNaN(valor)) return alert('Preencha todos os campos corretamente');
  
      let texto = '';
      let totalCompra = 0;
  
      if (tipo === 'única') {
        texto = `${nome} - ${formatar(valor)} (compra única)`;
        totalCompra = valor;
      } else {
        const restante = (total - atual) * valor;
        totalCompra = valor + restante;
        texto = `${nome} - ${formatar(valor)} (parcela atual: ${atual}) → valor restante: ${formatar(restante)} → Total: ${formatar(totalCompra)}`;
      }
  
      comprasAtuais.push({ texto, valor: totalCompra });
      formCompra.reset();
      tipoCompra.dispatchEvent(new Event('change'));
      atualizarComprasAtuais();
    });
  
    btnFinalizarCartao.addEventListener('click', () => {
      if (!comprasAtuais.length) return;
  
      cartoes.push({
        nome: nomeCartaoAtual,
        compras: [...comprasAtuais]
      });
  
      localStorage.setItem('cartoes', JSON.stringify(cartoes));
      comprasAtuais = [];
      nomeCartaoAtual = '';
      cartaoAtual.textContent = '';
      formCompra.classList.add('hidden');
      formCartao.classList.remove('hidden');
      atualizarComprasAtuais();
      exibirResumo();
    });
  
    function atualizarComprasAtuais() {
      listaComprasAtuais.innerHTML = '';
      let total = 0;
  
      comprasAtuais.forEach((compra, index) => {
        total += compra.valor;
  
        const div = document.createElement('div');
        div.className = 'compra-item';
        div.innerHTML = `
          <span>${compra.texto}</span>
          <button onclick="removerCompraAtual(${index})">❌</button>
        `;
        listaComprasAtuais.appendChild(div);
      });
  
      totalComprasAtuais.textContent = `Total parcial: ${formatar(total)}`;
      comprasAtuaisResumo.classList.toggle('hidden', comprasAtuais.length === 0);
    }
  
    window.removerCompraAtual = (index) => {
      comprasAtuais.splice(index, 1);
      atualizarComprasAtuais();
    };
  
    function exibirResumo() {
      resumoCartoes.innerHTML = '';
      let totalGeral = 0;
  
      cartoes.forEach((cartao, index) => {
        const div = document.createElement('div');
        div.className = 'cartao-resumo';
        div.innerHTML = `<h4>💳 ${cartao.nome}</h4>`;
  
        cartao.compras.forEach((compra, i) => {
          const compraEl = document.createElement('div');
          compraEl.className = 'compra-item';
          compraEl.innerHTML = `
            <span>${compra.texto}</span>
            <button onclick="removerCompra(${index}, ${i})">❌</button>
          `;
          div.appendChild(compraEl);
          totalGeral += compra.valor;
        });
  
        resumoCartoes.appendChild(div);
      });
  
      totalGeralDiv.innerHTML = `<h3>Total Geral: ${formatar(totalGeral)}</h3>`;
    }
  
    window.removerCompra = (cartaoIndex, compraIndex) => {
      cartoes[cartaoIndex].compras.splice(compraIndex, 1);
      if (cartoes[cartaoIndex].compras.length === 0) {
        cartoes.splice(cartaoIndex, 1);
      }
      localStorage.setItem('cartoes', JSON.stringify(cartoes));
      exibirResumo();
    };
  
    function formatar(valor) {
      return valor.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      });
    }
  });
  