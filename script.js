document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('formulario-receitas');
    const planoContainer = document.getElementById('plano-container');
    const pdfContainer = document.getElementById('pdf-container');
    const excelContainer = document.getElementById('excel-container');
    const novoPlanoContainer = document.getElementById('novo-plano-container');

    form.addEventListener('submit', function (event) {
        event.preventDefault();

        const nomeEscola = document.getElementById('nome_escola').value;
        const enderecoEscola = document.getElementById('endereco_escola').value;
        const cnpjEscola = document.getElementById('cnpj_escola').value;

        const receitaCapital = parseFloat(document.getElementById('receita_capital').value);
        const receitaCusteio = parseFloat(document.getElementById('receita_custeio').value);

        const planoData = gerarPlano(nomeEscola, enderecoEscola, cnpjEscola, receitaCapital, receitaCusteio);
        exibirPlano(planoData);
    });

    function gerarPlano(nomeEscola, enderecoEscola, cnpjEscola, receitaCapital, receitaCusteio) {
        // Itens de Capital (40%, 30% e 30% somam 100%)
        const capitalItems = [
            {
                "descricao": "Compra de computadores",
                "categoria": "Capital",
                "valor": receitaCapital * 0.4
            },
            {
                "descricao": "Aquisição de mobiliário",
                "categoria": "Capital",
                "valor": receitaCapital * 0.3
            },
             {
                "descricao": "Equipamentos eletrônicos",
                "categoria": "Capital",
                "valor": receitaCapital * 0.3 // 30% restante para alcançar 100%
            }
        ];

        // Itens de Custeio (30%, 40%, 10% e 20% somam 100%)
        const custeioItems = [
            {
                "descricao": "Compra de materiais de expediente",
                "categoria": "Custeio",
                "valor": receitaCusteio * 0.3
            },
            {
                "descricao": "Compra de material de limpeza",
                "categoria": "Custeio",
                "valor": receitaCusteio * 0.4
            },
            {
                 "descricao": "Estrutura ou manutenção de equipamentos",
                "categoria": "Custeio",
                "valor": receitaCusteio * 0.1 // 10% para manutenção
            },
            {
                "descricao": "Despesas administrativas",
                "categoria": "Custeio",
                "valor": receitaCusteio * 0.2 // 20% restante para alcançar 100%
            }
        ];

        const dataCriacao = new Date().toLocaleString();

        return {
            "nome_escola": nomeEscola,
            "endereco_escola": enderecoEscola,
            "cnpj_escola": cnpjEscola,
            "receita_capital": receitaCapital,
            "receita_custeio": receitaCusteio,
            "plano_aplicacao": [...capitalItems, ...custeioItems], // Combina capital e custeio
            "data_criacao": dataCriacao
        };
    }

    function exibirPlano(data) {
        planoContainer.innerHTML = '';
        const planoHtml = `
            <h2>Rede Municipal de Ensino de Cristino Castro-PI</h2>
            <p><strong>Escola:</strong> ${data.nome_escola}</p>
            <p><strong>Endereço:</strong> ${data.endereco_escola}</p>
            <p><strong>CNPJ:</strong> ${data.cnpj_escola}</p>
            <hr/>
            <p><strong>Data de Criação:</strong> ${data.data_criacao}</p>
            <h2>Receitas</h2>
            <p><strong>Capital:</strong> R$ ${data.receita_capital.toFixed(2)}</p>
            <p><strong>Custeio:</strong> R$ ${data.receita_custeio.toFixed(2)}</p>
            <h2>Plano de Aplicação</h2>
            <table>
                <thead>
                  <tr>
                       <th>Item</th>
                       <th>Categoria</th>
                        <th>Valor</th>
                  </tr>
                </thead>
                 <tbody>
                      ${data.plano_aplicacao.map(item =>`
                         <tr>
                           <td>${item.descricao}</td>
                           <td>${item.categoria}</td>
                            <td>R$ ${item.valor.toFixed(2)}</td>
                         </tr>
                      `).join('')}
                 </tbody>
            </table>
        `;
        planoContainer.innerHTML = planoHtml;

        pdfContainer.innerHTML = '<button id="exportar-pdf">Exportar para PDF</button>';
        const pdfButton = document.getElementById('exportar-pdf');
        pdfButton.addEventListener('click', function () {
            exportarPDF(data);
        });

        excelContainer.innerHTML = '<button id="exportar-excel">Exportar para Excel</button>';
        const excelButton = document.getElementById('exportar-excel');
        excelButton.addEventListener('click', function () {
            exportarExcel(data);
        });

        // Adiciona o botão "Novo Plano"
        novoPlanoContainer.innerHTML = '<button id="novo-plano">Novo Plano</button>';
        const novoPlanoButton = document.getElementById('novo-plano');
        novoPlanoButton.addEventListener('click', function () {
            reiniciarAplicativo();
        });
    }

    function reiniciarAplicativo() {
        // Limpa os campos do formulário
        document.getElementById('formulario-receitas').reset();

        // Limpa o plano exibido
        document.getElementById('plano-container').innerHTML = '';

        // Limpa os botões de exportação
        document.getElementById('pdf-container').innerHTML = '';
        document.getElementById('excel-container').innerHTML = '';

        // Limpa o botão "Novo Plano"
        document.getElementById('novo-plano-container').innerHTML = '';
    }

    function exportarPDF(planoData) {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        let yPos = 20;

        doc.setFontSize(16);
        doc.text("Rede Municipal de Ensino de Cristino Castro-PI", 15, yPos);
        yPos += 10;

        doc.setFontSize(14);
        doc.text(`Escola: ${planoData.nome_escola}`, 15, yPos);
        yPos += 10;
        doc.text(`Endereço: ${planoData.endereco_escola}`, 15, yPos);
        yPos += 10;
        doc.text(`CNPJ: ${planoData.cnpj_escola}`, 15, yPos);
        yPos += 10;

        doc.setFontSize(16);
        doc.text("Plano de Aplicação Financeira Escolar", 15, yPos);
        yPos += 10;

        doc.setFontSize(12);
        doc.text(`Data de Criação: ${planoData.data_criacao}`, 15, yPos);
        yPos += 10;

        doc.setFontSize(14);
        doc.text("Receitas", 15, yPos);
        yPos += 8;

        doc.setFontSize(12);
        doc.text(`Capital: R$ ${planoData.receita_capital.toFixed(2)}`, 15, yPos);
        yPos += 8;

        doc.setFontSize(12);
        doc.text(`Custeio: R$ ${planoData.receita_custeio.toFixed(2)}`, 15, yPos);
        yPos += 10;

        doc.setFontSize(14);
        doc.text("Plano de Aplicação", 15, yPos);
        yPos += 8;

        const headers = ['Item', 'Categoria', 'Valor'];
        const data = planoData.plano_aplicacao.map(item => [
            item.descricao,
            item.categoria,
            `R$ ${item.valor.toFixed(2)}`
        ]);

        doc.autoTable({
            head: [headers],
            body: data,
            startY: yPos + 10,
            theme: 'grid',
        });

        doc.save("plano_financeiro.pdf");
    }

    function exportarExcel(planoData) {
        const XLSX = window.XLSX;
        const wb = XLSX.utils.book_new();
        const wsData = [
            ["Rede Municipal de Ensino de Cristino Castro-PI"],
            [`Escola: ${planoData.nome_escola}`],
            [`Endereço: ${planoData.endereco_escola}`],
            [`CNPJ: ${planoData.cnpj_escola}`],
            [],
            ['Data de Criação', planoData.data_criacao],
            [],
            ["Receitas"],
            ["Capital", `R$ ${planoData.receita_capital.toFixed(2)}`],
            ["Custeio", `R$ ${planoData.receita_custeio.toFixed(2)}`],
            [],
            ["Plano de Aplicação"],
            ["Item", "Categoria", "Valor"],
            ...planoData.plano_aplicacao.map(item => [
                item.descricao,
                item.categoria,
                `R$ ${item.valor.toFixed(2)}`
            ])
        ];

        const ws = XLSX.utils.aoa_to_sheet(wsData);
        XLSX.utils.book_append_sheet(wb, ws, "Plano Financeiro");
        XLSX.writeFile(wb, "plano_financeiro.xlsx");
    }
});
