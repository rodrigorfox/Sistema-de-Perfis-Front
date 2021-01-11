//Envio de formulario de cliente e empresa
function onSubmit(event, data){
    event.preventDefault();

    let ob = {};
    var dt = JSON.stringify( $(data).serializeArray() );
    (JSON.parse(dt)).forEach(element => {
            ob[element.name] = element.value;
    });
    
    //Opções que serão passadas por parametro
    const options = {
        method: 'POST',
        body: JSON.stringify(ob),
        headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*"
        },
        mode: 'cors',
        cache: 'default'
    }
    var url = ""

    if (ob.empresa == undefined && ob.nomeCompleto !=null)
    url = "usuario"
    
    if (ob.nomeCompleto == undefined && ob.empresa !=null)
    url = "empresa"

    //requisição POST
    fetch(`http://localhost:3000/${url}`, options)
        .then(response => response.json())
        .then(jsonBody => mostrarResposta(jsonBody,url))
        .then(erro => mostrarErro(erro))
}

//APESAR DA PAGINA DE PERFIL TER UM SCRIPT PROPRIO PARA ENVIAR OS SEUS DADOS,
//OS MÉTODOS A SEGUIR RETORNAM AS MENSAGENS DE SUCESSO E ERRO CONTIDAS NAS PAGINAS DE USUARIO, EMPRESA E PERFIL

//Exibe a resposta no lugar do objeto retornado passando o tipo no texto
//Caso o objeto não tenha nenhum id registrado, ele pula essa etapa e retorna a resposta para o metodo erro
function mostrarResposta(body,url){
    if(body.id == undefined)
    return body
    $("div#msgStatus").html(`<div class="alert alert-success" role="alert">${url} inserido com sucesso</div>`)
    // confirm(`${url} inserido com sucesso`)
    return true
}

//Testa se a resposta recebida tem uma mensagem de erro, se sim, insere no html msgStatus um alert com a resposta
//Se a etapa anterior tiver retornado um objeto, a mensagem exibida foi de sucesso, então, não terá um erro.msg
function mostrarErro(erro){
    if(erro.mensagem != undefined)
    $("div#msgStatus").html(`<div class="alert alert-danger" role="alert">${erro.mensagem}</div>`)
}