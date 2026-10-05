const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

// Permite que o Site A envie dados para este servidor (mecanismo CORS)
app.use(cors());
app.use(express.json());

// Banco de dados temporário na memória do servidor
let listaDeIps = [];

// Rota que o Site A vai acessar para enviar o IP
app.post('/registrar-ip', (req, res) => {
    const { ip } = req.body;
    
    if (ip) {
        const novoRegistro = {
            ip: ip,
            horario: new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })
        };
        listaDeIps.unshift(novoRegistro); // Adiciona no início da lista
        console.log(`[NOVO ACESSO] IP capturado: ${ip}`);
        return res.status(200).json({ status: 'Sucesso' });
    }
    
    return res.status(400).json({ error: 'IP não fornecido' });
});

// Rota que exibe o painel HTML com os IPs capturados
app.get('/', (req, res) => {
    let linhasTabela = listaDeIps.map(item => `
        <tr>
            <td>${item.ip}</td>
            <td>${item.horario}</td>
        </tr>
    `).join('');

    const htmlCompleto = `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
        <meta charset="UTF-8">
        <title>Painel de Controle - Logs de IP</title>
        <style>
            body { font-family: sans-serif; background: #f4f6f9; padding: 30px; color: #333; }
            .panel { max-width: 800px; margin: 0 auto; background: white; padding: 20px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
            h1 { color: #2c3e50; border-bottom: 2px solid #ecf0f1; padding-bottom: 10px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { padding: 12px; text-align: left; border-bottom: 1px solid #ddd; }
            th { background-color: #34495e; color: white; }
            tr:nth-child(even) { background-color: #f9f9f9; }
        </style>
        <meta http-equiv="refresh" content="5"> <!-- Atualiza o painel a cada 5 segundos -->
    </head>
    <body>
        <div class="panel">
            <h1>IPs Capturados Recentemente</h1>
            <table>
                <thead>
                    <tr>
                        <th>Endereço IP</th>
                        <th>Data / Hora do Acesso</th>
                    </tr>
                </thead>
                <tbody>
                    ${linhasTabela || '<tr><td colspan="2" style="text-align:center;">Nenhum acesso registrado ainda.</td></tr>'}
                </tbody>
            </table>
        </div>
    </body>
    </html>
    `;
    res.send(htmlCompleto);
});

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
