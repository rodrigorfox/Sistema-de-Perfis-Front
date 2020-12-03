var empresas = new Array()
var usuarios = new Array()
//Realizando a requisição GET do servidor e resgatando a resposta
fetch("http://localhost:3000/usuario")
.then(response => response.json())
.then(jsonBody => {
    jsonBody.forEach( a => $("select#usuario").append(`<option>${a.nomeCompleto}</option>`))
    usuarios = [...jsonBody]
})
//Realizando a requisição GET do servidor e resgatando a resposta
fetch("http://localhost:3000/empresa")
.then(response => response.json())
.then(jsonBody => {
    jsonBody.forEach( a => $("select#empresa").append(`<option>${a.empresa}</option>`))
    empresas = [...jsonBody]
})

//A PAGINA DE PERFIS POSSUI UM METODO DE ENVIO PROPRIO POIS OS PARAMETROS SÃO ESPECÍFICOS
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
    var url = "perfil"
    //requisição POST
    fetch(`http://localhost:3000/${url}`, options)
        .then(response => response.json())
        //os metodos de resposta já estão escritos no JS da pagina de usuarios e empresas
        .then(jsonBody => mostrarResposta(jsonBody,url))
        .then(erro => mostrarErro(erro))
}