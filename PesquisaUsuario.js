var usuarios = new Array()

fetch("http://localhost:3000/usuario")
.then(response => response.json())
.then(jsonBody => {
    jsonBody.forEach( a => {
        var i = 0;
        do {
            if (a.perfis.length == 0){
                a.perfis.push({"nome":"Não cadastrado", "empresa":{"empresa":"Não cadastrada"}})
            }
            // console.log(a.id)

            $("tbody#listagem").append(`<tr>
            <td>
            <div class="checkbox">
            <input type="checkbox">
            </div>
            </td>
            <td>${a.perfis[i].empresa.empresa}</td>
            <td>${a.perfis[i].nome}</td>
            <td>${a.nomeCompleto}</td>
            <td>${a.email}</td>
            <td>
            <button class="btn btn-primary ml-1">
            <i class="fa fa-eye" aria-hidden="true"></i>
            </button>
            
            <button class="btn btn-success ml-1">
            <i class="fa fa-edit"></i>
            </button>
            
            <button type="button" class="btn btn-danger ml-1" data-toggle="modal" data-target="#confirm${a.id}">
            <i class="fa fa-trash"></i>
            </button>

            <div class="modal fade" id="confirm${a.id}" role="dialog">
                <div class="modal-dialog modal-md">

                    <div class="modal-content">
                    <div class="modal-body">
                            <p><b>Deseja realmente excluir o usuário e todos os seus perfis?</b></p>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-danger" id="delete" onclick="deletar(${a.id})">Deletar Registo</a>
                        <button type="button" data-dismiss="modal" class="btn btn-secondary">Cancelar</button>
                    </div>
                    </div>

                </div>
            </div>
            </td>
            </tr>`)
            i += 1;
        } while (i < a.perfis.length);
    })
    usuarios = [...jsonBody]
})

//Envio de formulario de cliente e empresa
function deletar(data){
    // event.preventDefault();

    // let ob = {};
    // var dt = JSON.stringify( $(data).serializeArray() );
    // (JSON.parse(dt)).forEach(element => {
    //         ob[element.name] = element.value;
    // });
    
    //criando com fetch
    const options = {
        method: 'DELETE',
        headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*"
        },
        mode: 'cors',
        cache: 'default'
    }
    var url = data
    console.log(data)
    fetch(`http://localhost:3000/usuario/${url}`, options)
        .then(response => response.json())
        .then(jsonBody => mostrarResposta(jsonBody))
        .then(erro => mostrarErro(erro))

        window.location.reload(true)
}

function mostrarResposta(body){
    if(body.id == undefined)
    return body
    $("div#msgStatus").html(`<div class="alert alert-success" role="alert">${url} inserido com sucesso</div>`)
    return true
}

function mostrarErro(erro){
    if(erro.mensagem != undefined)
    $("div#msgStatus").html(`<div class="alert alert-danger" role="alert">${erro.mensagem}</div>`)
}

//Pesquisa de Usuarios, pois o parametro de envio requer o Array de usuarios