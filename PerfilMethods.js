var empresas = new Array()
var usuarios = new Array()

fetch("http://localhost:3000/empresa")
.then(response => response.json())
.then(jsonBody => {
    jsonBody.forEach( a => $("select#empresa").append(`<option>${a.empresa}</option>`))
    empresas = [...jsonBody]
})

fetch("http://localhost:3000/usuario")
.then(response => response.json())
.then(jsonBody => {
    jsonBody.forEach( a => $("select#usuario").append(`<option>${a.nomeCompleto}</option>`))
    usuarios = [...jsonBody]
})

//Envio de formulário de Perfis, pois o parametro de envio requer a busca das empresas e usuarios
function onSubmitPerfil(event, data){
    event.preventDefault();
    
    let ob = {};
    var dt = JSON.stringify( $(data).serializeArray() );
    (JSON.parse(dt)).forEach(element => {
        ob[element.name] = element.value;
    });
    const usuario = usuarios.filter( usuario => usuario.nomeCompleto == ob.id_usuario )
    ob.id_usuario = usuario[0].id
    const empresa = empresas.filter( empresa => empresa.empresa == ob.id_empresa )
    ob.id_empresa = empresa[0].id

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
    var url = "perfil"
    
    fetch(`http://localhost:3000/${url}`, options)
        .then(response => response.json())
        .then(jsonBody => mostrarResposta(jsonBody,url))
        .then(erro => mostrarErro(erro))
}