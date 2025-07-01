// Importa o SDK oficial da hubspot, que facilita chamadas à API
const hubspot = require('@hubspot/api-client');

// Função principal executada pelo HubSpot quando o workflow aciona esse código, é assícrona porque faz chamadas externas (API)
exports.main = async (event) => {
  const hubspotClient = new hubspot.Client({ //Cria uma instância do cliente da HubSpot usando um token de autenticação salvo como segredo
    accessToken: process.env.HUBSPOT_API_KEY
  });

  const dealId = event.object.objectId; // Pega o ID do negócio (deal) que disparou o workflow.

  const novaPipeline = 't_d11ad527b4842006425da73744b44025'; // Define os IDs do novo pipeline e novo estágio para onde o negócio será movido
  const novoEstagio = '1077847703';

  // Cria o corpo da requisição que vai ser enviado para a API da HubSpot com as propriedades que queremos atualizar no negócio.
  try {
    const updatePayload = {
      properties: {
        pipeline: novaPipeline,
        dealstage: novoEstagio
      }
    };
    // Faz a chamada para a API da HubSpot para atualizar o negócio com o novo pipeline e estágio
    //
    await hubspotClient.crm.deals.basicApi.update(dealId, updatePayload);

// Retorna o resultado da ação para o workflow:
// * resultado: mensagem de sucesso;
// * erro: vazio (nenhum erro ocorreu); <---- Manter vazio 
// * novoPipeline e novoEstagio: IDs que foram aplicados;
// * hs_execution_state: obrigatório no HubSpot, indica que a execução foi bem-sucedida.

    return {
      outputFields: {
        resultado: 'Movido com sucesso',
        erro: '', // <- mantém o campo presente, mesmo vazio
        novoPipeline: novaPipeline,
        novoEstagio: novoEstagio,
        hs_execution_state: 'Succeeded'
      }
    };
    
    // Se algo der errado (ex: ID inválido, token incorreto), o erro é capturado aqui.
  } catch (error) {
    console.error('Erro ao mover o card:', error.message);

    // Retorna para o workflow que falhou, mas permite que o workflow continue. Também preenche o campo erro com a mensagem do erro real.
    return {
      outputFields: {
        resultado: '',
        erro: error.message,
        novoPipeline: '',
        novoEstagio: '',
        hs_execution_state: 'Failed, object continue...'
      }
    };
  }
};
