//Envio de formulario de cliente e empresa
function onSubmit(event, data){
    event.preventDefault();

    let ob = {};
    var dt = JSON.stringify( $(data).serializeArray() );
    (JSON.parse(dt)).forEach(element => {
            ob[element.name] = element.value;
    });
    
    //criando com fetch
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

    
    fetch(`http://localhost:3000/${url}`, options)
        .then(response => response.json())
        .then(jsonBody => mostrarResposta(jsonBody,url))
        .then(erro => mostrarErro(erro))
}

function mostrarResposta(body,url){
    if(body.id == undefined)
    return body
    $("div#msgStatus").html(`<div class="alert alert-success" role="alert">${url} inserido com sucesso</div>`)
    return true
}

function mostrarErro(erro){
    if(erro.mensagem != undefined)
    $("div#msgStatus").html(`<div class="alert alert-danger" role="alert">${erro.mensagem}</div>`)
}

// function mostrarResposta(usuario) {
//     const mensagem = `
//     Id: ${usuario.id}
//     nomeCompleto: ${usuario.nomeCompleto},
//     nomeSocial: ${usuario.nomeSocial},
//     email: ${usuario.email},
//     username: ${usuario.username},
//     senha ${usuario.senha},
//     `;
//     alert(mensagem);
// }
