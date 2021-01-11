//Criando as variaveis que vão receber os dados que serão manipulados
var usuarios = new Array()
var pagina = new Array()
var exibicao = new Array()

//Classe Registro onde armazenará cada entrada por perfil separadamente em vez de um usuario com varios perfis
class Registro {
    empresa = null
    perfil = null
    usuario = null
    email = null
    id_usuario = null
    id_perfil = null
    username = null
    senha = null

    constructor (empresa, perfil, usuario, email, id_usuario, id_perfil,username, senha){
        this.empresa = empresa
        this.perfil = perfil
        this.usuario = usuario
        this.email = email
        this.id_usuario = id_usuario
        this.id_perfil = id_perfil
        this.username = username
        this.senha = senha
    }
}

//Realizando a requisição GET do servidor e resgatando a resposta
fetch("http://localhost:3000/usuario")
.then(response => {return response.json()})
.then(jsonBody => {
    jsonBody.forEach( a => {
    var i = 0;
        do {

            //esse if verifica se o usuario tem um perfil, se não tiver, adiciona um não cadastrado a tag nome e a empresa para exibição na lista
            if (a.perfis.length == 0)
            a.perfis.push({"nome":"Não cadastrado", "empresa":{"empresa":"Não cadastrada"}})

            //para cada item da resposta, cria-se um objeto Registro por perfil do usuario e adiciona em usuarios
            const registro = new Registro(a.perfis[i].empresa.empresa,a.perfis[i].nome,a.nomeCompleto,a.email,a.id,a.perfis[i].id, a.username, a.senha)
            usuarios.push(registro)
            i += 1;
        } while (i < a.perfis.length);
    })

    //O array exibição recebe um map que retorna para cada objeto, uma copia, fazendo uma compia completa do array de objetos
    exibicao = usuarios.map((user) => {return {...user}})

    //lista os usuarios a partir da copia atualizada e ativa a pagina 1 na exibição
    listarUsuarios(exibicao,0)
    ativar(1)
})

//função para quando pesquisar a partir do formulario
function pesquisarUsuarios(event, data){
    //O metodo preventDefault() impede que a pagina atualize, assim a manipulação do html é exibida sem recarregar a pagina
    event.preventDefault();
    
    //resgatando os dados do formulario e colocando no padrão que o servidor precisa receber. ("nome" : "Yasmin")
    let ob = {};
    var dt = JSON.stringify( $(data).serializeArray() );
    (JSON.parse(dt)).forEach(element => {
        ob[element.name] = element.value;
    });

    //inicialmente atualiza a lista cópia com os dados contidos na lista completa de usuarios
    exibicao = usuarios.map((user) => {return {...user}})

    //Verifica se os campos do formularios estão preenchidos, se estiverem, ele filtra pela igualdade entre o campo escrito e o campo do registro
    //Fazendo um filtro sobre o outro, consegue-se chegar a um filtro completo onde os 4 campos se coincidem
    //Se nenhum campo for preenchido, ele naturalmente pulará todos e exibirá a lista completa
    //Todo o resultado dos filtros será atribuido a cópia criada la em cima, atualizando a lista de registros sem alterar a retirada do servidor
    if(ob.empresa != "")
    exibicao = exibicao.filter(a => a.empresa.toUpperCase().includes(ob.empresa.toUpperCase()))

    if(ob.perfil != "")
    exibicao = exibicao.filter(a => a.perfil.toUpperCase().includes(ob.perfil.toUpperCase()))

    if(ob.nomeCompleto != "")
    exibicao = exibicao.filter(a => a.usuario.toUpperCase().includes(ob.nomeCompleto.toUpperCase()))
    
    if(ob.email != "")
    exibicao = exibicao.filter(a => a.email.toUpperCase().includes(ob.email.toUpperCase()))

    //A lista exibida será a resultante do filtro e ativa a pagina 1 na exibição
    listarUsuarios(exibicao,0)
    ativar(1)
}

//metodo para listar os usuarios que cria um elemento tr com os dados de cada registro passado para o metodo

function listarUsuarios(lista,pag){

    //O metodo separador() separa a lista recebida por parametros em paginas de 10 unidades 
    pagina = separador(lista, 10)

    //remove todas as linhas da tabela em exibição
    $("#listagem tr").remove();

    //Retorna cada elemento na pagina selecionada
    pagina[pag].forEach( a => {
        //padrão opção de usuario
        var opcao = 1
        var id = a.id_usuario
        //se o usuario listado tiver algum perfil ele terá mais de um registro, logo, a deleção será do perfil e não do usuario completo
        if(a.id_perfil != undefined){
            opcao = 2
            id = a.id_perfil
        }
        
        //cria o botão que vai chamar o modal de confirmação passando por parameto o id e o tipo
        //Se o usuario não tiver perfil algum, o tipo de deleção apagará o registro do usuario
        $("tbody#listagem").append(`<tr>
                <td class="text-center">
                    <div class="checkbox">
                        <input type="checkbox">
                    </div>
                </td>
                <td>${a.empresa}</td>
                <td>${a.perfil}</td>
                <td>${a.usuario}</td>
                <td>${a.email}</td>
                <td class="text-center">
                    <i type="button" onClick="abreModal(1,${a.id_usuario},${a.id_perfil})" class="fa fa-eye" style="color: darkblue"></i>
                    <i type="button" onClick="abreModal(2,${a.id_usuario},${a.id_perfil})" class="fa fa-edit" style="color: green"></i>
                    <i type="button" onClick="abreModalDelecao(${opcao},${id})" class="fa fa-trash" style="color: darkred"></i>
                </td>
        </tr>`)
        
    })

    //Limpa os botões de navegação pois irá gerar uma quantidade nova
    $("#navegacao button").remove();

    //Cria os botões de primeira e ultima pagina, atribuindo a listagem para a primeira e ultima pagina
    //Alem de ativar a pagina em questão
    $("div#navegacao").append(`
        <button type="button" class="btn btn-info btn-sm" id="primeira" onclick="listarUsuarios(exibicao, ${0}), ativar(${0+1})"><b><<</b></button>
        <button type="button" class="btn btn-info btn-sm" id="ultima" onclick="listarUsuarios(exibicao, ${pagina.length-1}), ativar(${pagina.length})"><b>>></b></button>
    `)

    //Para cada item no array de paginas, ele cria um botão que chama o metodo exibir a pagina e o nomeia com o numero da pagina (i+1)
    //Alem de ativar a pagina em questão
    for(var i =0; i<pagina.length;i++){
        $("button#ultima").before(`<button type="button" class="btn btn-info btn-sm" id="btn${i+1}" onclick="listarUsuarios(exibicao, ${i}), ativar(${i+1})">${i+1}</button>`)
    }
}
    
//Função para abrir o modal de visualização e Edição
function abreModal(opcao, id, perfil) {
    usuario = exibicao.filter(a=> a.id_usuario == id && a.id_perfil === perfil)
    if (usuario[0].id_perfil == undefined){
        $("div.modal-body input#perfil").attr("disabled","true")
    } else {
        $("div.modal-body input#perfil").removeAttr("disabled")
    }
    
    if(opcao == 1){
    $("fieldset#modalExibir").attr("disabled","true")
    $("div.modal-body input#alterar").attr("disabled","true")
    }

    if(opcao == 2){
    $("fieldset#modalExibir").removeAttr("disabled")
    $("div.modal-body input#alterar").removeAttr("disabled")
    }

    $("div.modal-body input#nomeCompleto").removeAttr("value")
    $("div.modal-body input#nomeCompleto").attr("value",`${usuario[0].usuario}`)

    $("div.modal-body input#email").removeAttr("value")
    $("div.modal-body input#email").attr("value",`${usuario[0].email}`)

    $("div.modal-body input#username").removeAttr("value")
    $("div.modal-body input#username").attr("value",`${usuario[0].username}`)

    $("div.modal-body input#senha").removeAttr("value")

    $("div.modal-body input#perfil").removeAttr("value")
    $("div.modal-body input#perfil").attr("value",`${usuario[0].perfil}`)
    
    $("div.modal-body input#empresa").removeAttr("value")
    $("div.modal-body input#empresa").attr("value",`${usuario[0].empresa}`)
    
    $("div.modal-body form").removeAttr("onsubmit")
    $("div.modal-body form").attr("onsubmit",`alterarDados(event, this,${usuario[0].id_usuario},${usuario[0].id_perfil})`)

    //exibe o modal completo criado
    $("#visualizar").modal({
        show: true
    });
}

function alterarDados(event, data,id_usuario,id_perfil){
    event.preventDefault();

    let ob = {};
    var dt = JSON.stringify( $(data).serializeArray() );
    (JSON.parse(dt)).forEach(element => {
        ob[element.name] = element.value;
    });

    //Opções que serão passadas por parametro
    const options = {
        method: 'PATCH',
        body: JSON.stringify(ob),
        headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*"
        },
        mode: 'cors',
        cache: 'default'
    }
    
    //requisição PATCH
    fetch(`http://localhost:3000/usuario/${id_usuario}`, options)
        .then(response => response.json())
        .then(window.location.reload(true))

    if (ob.nome != undefined){
        let pfl = {}
        pfl["nome"] = ob.nome

        const options = {
            method: 'PATCH',
            body: JSON.stringify(pfl),
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*"
            },
            mode: 'cors',
            cache: 'default'
        }
        
        //requisição PATCH
        fetch(`http://localhost:3000/perfil/${id_perfil}`, options)
            .then(response => response.json())
    }
}

//Função para abrir o modal de confirmação de exclusão
function abreModalDelecao(opcao, id) {
    $("button#delete").removeAttr("onclick")
    $("button#delete").attr("onclick",`deletar(${opcao},${id})`)

    //exibe o modal completo criado
    $("#confirmar").modal({
        show: true
    });
}
    
//Envio de formulario de cliente ou perfil para o servidor com a requisição DELETE
function deletar(opcao, id){
    var url = null

    //Identifica qual tipo de url será enviada, seguindo o parametro recebido
    switch (opcao) {
        case 1:
            url = "usuario";
            break;
        case 2:
            url = "perfil";
            break;
        default:
            url = "empresa";
    }

    //Opções que serão passadas por parametro
    const options = {
        method: 'DELETE',
        headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*"
        },
        mode: 'cors',
        cache: 'default'
    }

    //requisição DELETE
    fetch(`http://localhost:3000/${url}/${id}`, options)
    .then(response => response.json())
    .then(window.location.reload(true))
}

//Metodo responsável por separar a lista em páginas
function separador(usuarios, maximo) {
    var lista = [[]];
    var indice = 0;
  
    for (var i = 0; i < usuarios.length; i++) {
      if (lista[indice] === undefined) {
        lista[indice] = [];
      }

      //adiciona cada usuario vindo do for a lista no indice atual
      lista[indice].push(usuarios[i]);

      //aumenta o indice da pagina quando chega ao limite especificado por parametro
      if ((i + 1) % maximo === 0) {
        indice = indice + 1;
      }
    }
    return lista;
}

//Função que remove o atributo class do botão de navegação e insere um novo atributo class igual porém com a adição do active
//tentei apenas inserir o active, mas ele remove sozinho todos os outros atributos
function ativar(id){
    $("#btn" + id).removeAttr("class")
    $("#btn" + id).attr("class","btn btn-info btn-sm active")
}

//metodo para selecionar todos os checkbox quando seleciona o checkbox do titulo e desmarca da mesma maneira
function toggleChecked(){
    var inputs = listagem.getElementsByTagName("input");
    var input = document.getElementById("toggle");

    if(input.checked == true){
        $.each(inputs, function(i,value){
            inputs[i].checked = true
        })
    }

    if(input.checked == false){
        $.each(inputs, function(i,value){
            inputs[i].checked = false
        })
    }
}