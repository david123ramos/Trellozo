//outras variáveis
const boardID = JSON.parse(sessionStorage.getItem("board")).id;
const boardColor = JSON.parse(sessionStorage.getItem("board")).color;
const boardName = JSON.parse(sessionStorage.getItem("board")).name;
const token = sessionStorage.getItem("token");
const data = dataAtualFormatada();

//flag que indica se a data do card foi alterada
var dateChange = false;

var firstChild = document.getElementById("firstChild");
var fatherRow = document.getElementById("fatherRow");
var acountButton = document.getElementsByClassName("spnRoundedButton").item(0);


//Forms e divs
var formCreateList = document.getElementById("formCreateList");
var divCreateList = document.getElementById("formList");
var spnListTitle = document.getElementById("spnList");
var listName = document.getElementById("listName");


document.getElementById("nav-header").style.backgroundColor = boardColor;
document.getElementsByTagName("body")[0].style.backgroundColor = boardColor;
var boardNameInput = document.getElementById("boardName");
boardNameInput.value = boardName;
boardNameInput.style.width = boardName.length + "rem"
document.getElementsByTagName("title")[0].innerHTML = boardName + " | Trellozo";
getUserName();
getLists();

window.onload = function () {
    let colorButtons = document.querySelectorAll(".btn-color");
    let tagButtons = Array.from(document.querySelectorAll(".tag"));
    let aux = Array.from(colorButtons);

    aux.map(function (colorButton) {
        let color = getComputedStyle(colorButton).getPropertyValue("background-color");
        colorButton.addEventListener("click", function () {
            document.getElementsByTagName("body")[0].style.backgroundColor = color;
            document.getElementById("nav-header").style.backgroundColor = color;
            let ax = JSON.parse(sessionStorage.getItem("board"));
            ax.color = color;
            sessionStorage.setItem("board", JSON.stringify(ax));
            changeBodyColor(color);
        });
    });

    //escutar a adição de tags
    tagButtons.map(function(tagButton){
        tagButton.addEventListener("click", function(e){
            e.preventDefault();
            addTag(this);
        });
    });
}


/*Classe que define uma lista */
class List {
    constructor(name, listId) {
        this.name = name;
        this.listId = listId;
    }

    //a lista é uma outra lista(de cards) dentro dentro da "lista Pai"
    init() {
        //Hierarquia: li->div->ul->li->div->span->->textNode
        let li = document.createElement("li");
        li.setAttribute("class", "col-12 col-sm-3 col-md-3 col-lg-2 col-xl-2 mb-3 p-0 mr-2 ml-0");



        var ul = document.createElement("ul");
        ul.setAttribute("class", "p-1 list defaultBgcolor");
        ul.setAttribute("id", this.listId)

        ul.ondrop = function () { drop(event) };

        ul.ondragover = function (event) { allowDrop(event); this.classList.add("dragOn") };

        ul.ondragleave = function () { this.classList.remove("dragOn"); }

        ul.ondragend = function () {
            this.classList.remove("dragOn");
            document.getElementsByClassName("spnDelete-ev")[0].classList.replace("spnDelete-ev", "spnDelete")
        }

        let divMain = document.createElement("div");
        divMain.setAttribute("class", " defaultBgcolor rounded pb-1");


        let firstChild = document.createElement("div");
        firstChild.appendChild(new BtnIsertCard().init());

        firstChild.addEventListener("click", function () {
            let newLi = document.createElement("li");
            newLi.setAttribute("draggable","false")

            let close = new CloseButton().init();
            let add = new AddButton().init();


            //o botao de fechar precisa remover o item(form) que foi appendado na lista
            close.addEventListener("click", () => {
                ul.removeChild(newLi);
                showAlert(firstChild);
            });


            //form -> textArea -> divWrapper -> botaoAdd -> botaoClose
            let form = new formCard().init();
            form.getElementsByTagName("textarea")[0].addEventListener("keypress", function (event) {
                if (event.keyCode == 13 && this.value != "") {
                    createCard(this.value, ul.id);
                    form.reset();
                    this.blur();
                } else if (event.keyCode == 13) {
                    event.preventDefault();
                }
            })

            form.addEventListener("submit", function (e) {
                e.preventDefault();
                if (this.getElementsByTagName("textarea")[0].value != "") {
                    createCard(this.getElementsByTagName("textarea")[0].value, ul.id);
                    this.reset();
                    this.getElementsByTagName("textarea")[0].focus();
                }
            });


            let divWrapper = new DivWrapper().init();
            divWrapper.appendChild(add);
            divWrapper.appendChild(close);
            form.appendChild(divWrapper);
            newLi.appendChild(form);
            ul.appendChild(newLi);
            closeAlert(firstChild);

        });


        let div = document.createElement("div");
        div.setAttribute("class", "title defaultBgcolor d-flex justify-content-between");

        //nome da lista
        let text = new NameList(this.name, this.listId).init();

        //icone "..." que aparece quando se coloca o mouse em cima da lista
        let buttonDelete = document.createElement("button");
        let iconDots = document.createElement("img");
        buttonDelete.setAttribute("class", "more-after btn p-0");
        buttonDelete.setAttribute("data-toggle", "modal");
        buttonDelete.setAttribute("data-target", "#modalExcluirLista");
        buttonDelete.onclick = () => {
            sessionStorage.setItem("list", this.listId);
        }

        iconDots.setAttribute("src", "img/deleteList.png");
        buttonDelete.appendChild(iconDots);
        divMain.onmouseover = function () {
            buttonDelete.classList.remove("more-after");
        }
        divMain.onmouseleave = function () {
            buttonDelete.classList.add("more-after");
        }

        div.appendChild(text);
        div.appendChild(buttonDelete);
        divMain.appendChild(div);
        divMain.appendChild(firstChild);
        divMain.insertBefore(ul, firstChild);

        li.appendChild(divMain);
        return li;
    }
}

/*Classe que define o input que recebe o nome da lista */
class NameList {
    constructor(listName, listId) {
        this.listName = listName;
        this.listId = listId;
    }
    init() {
        let text = document.createElement("input");
        text.setAttribute("maxlength", 15);
        text.setAttribute("autocomplete", "off");
        text.setAttribute("autocorrect", "off");
        text.setAttribute("class", "font-weight-bold mt-1 mr-1 list-name success mw-50");
        text.value = this.listName;

        text.addEventListener("keydown", (e) => {
            renameList(e, text, this.listId);
        });
        return text;
    }
}

/*Botão usado para inserir um novo card dentro de uma lista*/
class BtnIsertCard {
    init() {
        let div = document.createElement("a");
        div.setAttribute("class", "d-flex justify-content-center mw-100");
        let text = document.createTextNode("+ Add another card");
        div.classList.add("secondaryText");
        div.appendChild(text);
        return div;
    }
}

/*Classe que define um card */
class Card {
    constructor(cardName, cardId, date) {
        this.cardName = cardName;
        this.cardId = cardId;
        this.date = date;
    }

    init() {
        let div = document.createElement("div");
        div.setAttribute("class", "card p-2 textCardSubmited divTextArea");

        let ulTag = document.createElement("ul");
        ulTag.setAttribute("class","list-inline");
        div.appendChild(ulTag);
        
        let spnNome = document.createElement("span");
        spnNome.innerText = this.cardName;
        div.appendChild(spnNome);
        let liCard = document.createElement("li");
        liCard.setAttribute("id", this.cardId);

        liCard.setAttribute("data-toggle", "modal");
        liCard.setAttribute("data-target", "#cardModal");

        liCard.onclick = () => {
            var name = document.getElementById(this.cardId).firstElementChild.querySelector("span").innerText;
            let cardInfo = {
                "name": name,
                "id": this.cardId,
                "date": this.date
            }
            sessionStorage.setItem("card", JSON.stringify(cardInfo));
            //limpa o modal do card antes de ele ser aberto
            clearModalCard();
            openCard();
        }
        
        liCard.setAttribute("draggable", true);
        liCard.ondragstart = function () { this.classList.add("drag"); div.classList.add("noShadow"); drag(event) };
        liCard.ondragend = function () { this.classList.remove("drag"); div.classList.remove("noShadow") }
        let date = document.createElement("div");
        date.setAttribute("date", this.date);

        div.appendChild(date);
        liCard.appendChild(div);
        return liCard;
    }
}

/*Classe que define o form para a criação de um card */
class formCard {

    init() {
        let form = document.createElement("form");
        let div = document.createElement("div");
        div.setAttribute("class", "divTextArea ");

        let textArea = document.createElement("textarea");
        textArea.setAttribute("placeholder", "Enter a title for this card...")
        textArea.classList.add("textCard")
        div.appendChild(textArea);
        form.appendChild(div);

        return form;
    }
}


class DivWrapper {
    init() {
        let div = document.createElement('div');
        div.setAttribute("class", "d-flex justify-content-start p-1");
        return div;
    }
}

class AddButton {
    init() {

        let button = document.createElement("button");
        button.setAttribute("class", "btn btn-success btn-textArea");
        button.setAttribute("type", "submit");
        button.appendChild(document.createTextNode("Add card"));

        return button;
    }
}

class CloseButton {
    init() {

        let close = document.createElement("button");
        close.setAttribute("type", "button");
        close.classList.add("close");


        let spn = document.createElement("span");
        spn.appendChild(document.createTextNode("x"));
        close.appendChild(spn);


        return close;
    }
}

formCreateList.addEventListener("submit", function (e) {
    e.preventDefault();

    var board = {
        "name": listName.value,
        "token": token,
        "board_id": boardID
    }
    var url = "https://tads-trello.herokuapp.com/api/trello/lists/new";
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var obj = JSON.parse(this.responseText);
            //apendando a nova lista ao sessionStorage
            let arrList = JSON.parse(sessionStorage.getItem("lists"))
            arrList.push(obj);
            sessionStorage.setItem("lists", JSON.stringify(arrList));

            let newList = new List(obj.name, obj.id);
            fatherRow.insertBefore(newList.init(), firstChild);

            //limpa o form
            resetForm();

        } else if (this.readyState == 4 && this.status == 400) {

        }
    }


    xhttp.open("POST", url, true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(JSON.stringify(board));

});

//.collapse('toggle') alterna a vizualizção da classe collapse que está em uma div
//TODO : não usar jQuery
function resetForm() {
    formCreateList.reset();
    $('#formList').collapse('toggle')

    setTimeout(function () {
        spnListTitle.classList.remove("none");
        spnListTitle.classList.add("block");
    }, 350)
}

function changeBodyColor(color) {

    let board = {
        "board_id": boardID,
        "color": color,
        "token": token
    }
    var url = " https://tads-trello.herokuapp.com/api/trello/boards/newcolor";
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {

        }
    }
    xhttp.open("PATCH", url, true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(JSON.stringify(board));
}

//usada para mudar a letra que aparece no botão de perfil nas páginas
function getUserName() {
    var url = "https://tads-trello.herokuapp.com/api/trello/users/" + token;
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var obj = JSON.parse(this.responseText);
            acountButton.innerHTML = obj.name.charAt(0);
            document.getElementById("completeUserName").innerText = `(${obj.name})`

        }
    }
    xhttp.open("GET", url, true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(url);
}

function closeAlert(someElement) {
    if (someElement == 'string') {
        document.getElementById(someElement).classList.add("none");
    } else {
        someElement.classList.add("none");
    }
}
function showAlert(someElement) {
    someElement.classList.remove("none");
    someElement.classList.add("block");
}

function mainPage() {
    return window.location.href = "main.html";
}
function logout(){
    sessionStorage.clear();
    return window.location.href = "index.html";
}

function createCard(nameCard, listId) {
    var card = {
        "name": nameCard,
        "data": data,
        "token": token,
        "list_id": listId
    }
    var url = "https://tads-trello.herokuapp.com/api/trello/cards/new";
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var obj = JSON.parse(this.responseText);
            let card = new Card(obj.name, obj.id, obj.data).init();
            let l = document.getElementById(listId);
            //precisamos diferenciar os li's. Os li's que possuem id são os que queremos
            let sizeList = l.querySelectorAll("li[id]").length
            l.insertBefore(card, l.childNodes[sizeList]);

        } else if (this.readyState == 4 && this.status == 400) {

        }
    }

    xhttp.open("POST", url, true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(JSON.stringify(card));

}

function dataAtualFormatada() {
    var data = new Date(),
        dia = data.getDate().toString(),
        diaF = (dia.length == 1) ? '0' + dia : dia,
        mes = (data.getMonth() + 1).toString(), //+1 pois no getMonth Janeiro começa com zero.
        mesF = (mes.length == 1) ? '0' + mes : mes,
        anoF = data.getFullYear();
    return diaF + "/" + mesF + "/" + anoF;
}

//função usada para renomear limitar a quantidade de caracteres que o usuário pode colocar na renomeação do board
function renameBoard(e, input) {

    if (e.keyCode == 13 && input.value != "") {

        let board = {
            "board_id": boardID,
            "name": input.value,
            "token": token
        }

        var url = "https://tads-trello.herokuapp.com/api/trello/boards/rename"
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                let b = JSON.parse(sessionStorage.getItem("board"));
                b.name = input.value;
                input.classList.replace("success", "success-af");

                document.getElementsByTagName("title")[0].innerHTML = input.value + " | Trellozo";
                sessionStorage.setItem("board", JSON.stringify(b));

            } else if (this.readyState == 4 && this.status == 400) {

            }
        }

        xhttp.open("PATCH", url, true);
        xhttp.setRequestHeader("Content-type", "application/json");
        xhttp.send(JSON.stringify(board));

        setTimeout(function () {
            input.classList.replace("success-af", "success");
            input.blur();
        }, 1000)

    } else if (input.value == "") {
        input.classList.replace("success", "error-af");
        setTimeout(function () {
            input.classList.replace("error-af", "success");
        }, 1000)
    }
}

function renameList(event, input, listId) {
    if (event.keyCode == 13 && input.value != "") {

        let list = {
            "list_id": listId,
            "name": input.value,
            "token": token
        }

        var url = "https://tads-trello.herokuapp.com/api/trello/lists/rename"

        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                input.classList.replace("success", "success-af");

                //é necessário mudar o nome da lista também no sessionStorage
                var listsSession = JSON.parse(sessionStorage.getItem("lists"));
                listsSession.map(function (list){
                    if(list.id == listId){
                        list.name = input.value;
                    }
                });
                sessionStorage.setItem("lists", JSON.stringify(listsSession));

            } else if (this.readyState == 4 && this.status == 400) {

            }
        }

        xhttp.open("PATCH", url, true);
        xhttp.setRequestHeader("Content-type", "application/json");
        xhttp.send(JSON.stringify(list));

        setTimeout(function () {
            input.classList.replace("success-af", "success");
            input.blur();
        }, 1000)

    } else if (input.value == "") {
        input.classList.replace("success", "error-af");
        setTimeout(function () {
            input.classList.replace("error-af", "success");
        }, 1000)
    }
}
function renameCard(event, input) {

    if (event.keyCode == 13 && input.value != "") {
        event.preventDefault();
        var cardClicked = JSON.parse(sessionStorage.getItem("card"));

        let card = {
            "token": token,
            "card_id": cardClicked.id,
            "name": input.value
        }

        var url = "https://tads-trello.herokuapp.com/api/trello/cards/rename"

        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {

                input.classList.replace("success", "success-af");
                document.getElementById(cardClicked.id).querySelector("span").innerText = input.value;
                cardClicked.name = input.value;
                sessionStorage.setItem("card", JSON.stringify(cardClicked));


            } else if (this.readyState == 4 && this.status == 400) {

            }
        }

        xhttp.open("PATCH", url, true);
        xhttp.setRequestHeader("Content-type", "application/json");
        xhttp.send(JSON.stringify(card));

        setTimeout(function () {
            input.classList.replace("success-af", "success");
            input.blur();
        }, 500)

    } else if (input.value == "") {
        input.classList.replace("success", "error-af");
        setTimeout(function () {
            input.classList.replace("error-af", "success");
        }, 1000)
    }

}

function getLists() {

    var url = "https://tads-trello.herokuapp.com/api/trello/lists/" + token + "/board/" + boardID
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var obj = JSON.parse(this.responseText);
            obj.forEach(printLists);
            sessionStorage.setItem("lists", this.responseText);

        } else if (this.readyState == 4 && this.status == 400) {

        }
    }

    xhttp.open("GET", url, true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(JSON.stringify(url));
}

function printLists(someList) {
    let list = new List(someList.name, someList.id);
    getCards(someList.id);
    fatherRow.insertBefore(list.init(), firstChild);
}

function getCards(listId) {
    var url = " https://tads-trello.herokuapp.com/api/trello/cards/" + token + "/list/" + listId
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var obj = JSON.parse(this.responseText);
            let l = document.getElementById(listId);
            for (let i in obj) {
                l.appendChild(new Card(obj[i].name, obj[i].id, obj[i].data).init());
                cardTags(obj[i].id, addTagOnCard);
            }

        } else if (this.readyState == 4 && this.status == 400) {

        }
    }

    xhttp.open("GET", url, true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(JSON.stringify(url));
}

function excludeBoard() {

    let b = {
        "board_id": boardID,
        "token": token
    }

    var url = "https://tads-trello.herokuapp.com/api/trello/boards/delete"
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {

            window.location.href = "main.html"

        } else if (this.readyState == 4 && this.status == 400) {

        }
    }

    xhttp.open("DELETE", url, true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(JSON.stringify(b));

}
function excludeList() {


    var list = {
        "list_id": sessionStorage.getItem("list"),
        "token": token
    }

    var url = "https://tads-trello.herokuapp.com/api/trello/lists/delete"
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {


            let listRemoved = document.getElementById(sessionStorage.getItem("list"));
            let parentNode = listRemoved.parentNode.parentNode;
            fatherRow.removeChild(parentNode);
            document.getElementById("exitList").click();
            var index;
            //quando uma lista for removida preciso apagá-la do sessionStorage tbm
            var arrList = JSON.parse(sessionStorage.getItem("lists"));
            
            arrList.map(function(i){
                if(i.id == sessionStorage.getItem("list")){
                    index = arrList.indexOf(i);
                }
            });

            arrList.splice(index, 1);
            //setando o novo array ao sessionStorage
            sessionStorage.setItem("lists", JSON.stringify(arrList));

            //remove o id da ultima lista que foi clicada para a exclusão
            sessionStorage.removeItem("list")



        } else if (this.readyState == 4 && this.status == 400) {

        }
    }

    xhttp.open("DELETE", url, true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(JSON.stringify(list));

}

function allowDrop(e) {
    e.preventDefault();
    if (e.target.getAttribute("draggable") == "true")
        e.dataTransfer.dropEffect = "none";

}

function drag(e) {
    document.getElementsByClassName("spnDelete")[0].classList.replace("spnDelete", "spnDelete-ev");
    e.dataTransfer.setData("fatherElement", e.target.parentNode.id);
    e.dataTransfer.setData("element", e.target.id);
}

function drop(e) {
    e.preventDefault();
    let element = e.dataTransfer.getData("element");
    let dragged = document.getElementById(element);

    //removendo as classes ativadas no drag
    dragged.classList.remove("drag");
    dragged.getElementsByClassName("textCardSubmited")[0].classList.remove("noShadow");

    if (e.target.tagName == 'UL') {
        try {
            e.target.appendChild(dragged);
            changeCard(dragged.id, e.target.id);
        } catch (err) {
            console.log("Algo deu errado");
        }

    }

}

//Função que é chamada antes de um card ser aberto
function clearModalCard(){
    
    //remove os comentários
    var ul = document.getElementById("commentList")
    ul.innerHTML = "";


    //remove tags
    var tags = document.getElementById("tags");
    var childTag = tags.firstElementChild;
    
    while(childTag){
        if(childTag.getAttribute("id") != "firstChildTag" ){
            tags.removeChild(childTag);
            childTag = tags.firstElementChild;
        }else{
            break;
        }
    }

    //remove opcões da select tag
    var opts = document.getElementById("selectionChange");
    var childOpt = opts.lastElementChild;
    while(childOpt){
        if(childOpt.getAttribute("value") != "default"){
            opts.removeChild(childOpt);
            childOpt = opts.lastElementChild;
        }else{
            break;
        }
    }

}

var title = document.getElementById("cardModal").getElementsByTagName("textarea")[0];
var activeKeydown = false;
//Função que é chamada quando o card é clicado
function openCard() {

    var card = JSON.parse(sessionStorage.getItem("card"));
    getCardInfo(card.id)

    if (!activeKeydown) {
        activeKeydown = true;
        title.addEventListener("keydown", function (e) {
            renameCard(e, this);
        });
    }

    title.removeEventListener("keydown", function () { activeKeydown = false; });

    title.style.width = card.name.length + "rem";
    title.value = card.name;

    document.getElementById("cardModal").getElementsByTagName("textarea")[1].onkeydown = function (event) {
        if (event.keyCode == 13 && this.value != "") {
           addComment(this, this.value, card.id)
        } else if (event.keyCode == 13) {
            event.preventDefault();
        }
    }

} 

//appenda o comentário no modal
function appendComment(comment){

    let li = document.createElement("li");
    li.setAttribute("class", "list-group-item")
    let div = document.createElement("div");
    div.appendChild(document.createTextNode(comment));
    li.appendChild(div);
    document.getElementById("commentList").appendChild(li);

}
//apenda uma tag no modal
function appendTag(id, colorTag){

    let tagList = document.getElementById("tags");
    
    let li = document.createElement("li");
    li.setAttribute("class", "m-1")
    li.setAttribute("id", id);
    
    
    let tag = document.createElement("button");

    tag.setAttribute("class", "tag w-100 h-100 "+colorTag);
   
    tag.onclick = function(e){e.preventDefault()}
    
    li.appendChild(tag);
    tagList.insertBefore(li, document.getElementById("firstChildTag"));
}


function addComment(textarea, comment, card_id){
    
    appendComment(comment);   
    textarea.value = '';
    textarea.blur();

    //envia o comentário pro server
    let comment4Send = {
        "card_id":card_id,
        "comment": comment,
        "token": token
    }

    var url = "https://tads-trello.herokuapp.com/api/trello/cards/addcomment"
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
         
        } else if (this.readyState == 4 && this.status == 400) {

        }
    }

    xhttp.open("POST", url, true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(JSON.stringify(comment4Send));
}


//recupera os comentários de um card
function cardComments (card_id) {
    var url = "https://tads-trello.herokuapp.com/api/trello/cards/"+token+"/"+card_id+"/comments"
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
          
          (JSON.parse(this.responseText)).map(function(comment){
            appendComment(comment.comment)
          })

        } else if (this.readyState == 4 && this.status == 400) {

        }
    }

    xhttp.open("GET", url, true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(JSON.stringify(url));
}

//recupera as tags de um card. O parâmetro função indica qual função será executada quando ele retornar o array de tags
function cardTags (card_id, funcao) {
    var url = "https://tads-trello.herokuapp.com/api/trello/cards/"+token+"/"+card_id+"/tags"
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {

            if(JSON.parse(this.responseText).length != 0){
                
                (JSON.parse(this.responseText)).map(function(tag){
                    let colorTag = getColorFromId(tag.id);

                    if(funcao == addTagOnCard){
                        funcao(card_id, colorTag);                        
                    }else{
                        funcao(tag.id, colorTag);
                    }
                })
            }

        } else if (this.readyState == 4 && this.status == 400) {

        }
    }

    xhttp.open("GET", url, true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(JSON.stringify(url));
}
//Função que põe as listas na tag selection com execeção da lista do card que foi clicado
function getListsFromSession(card_clicked){
    //array de listas
    var lists = JSON.parse(sessionStorage.getItem("lists"));
    //lista que deve ser excluída do selection
    var listExc = card_clicked.parentNode
    var selectionTag = document.getElementById("selectionChange");
    
    lists.map(function (list){
        if(list.id != listExc.id){
            var opt =document.createElement("option");
            opt.innerText = list.name;
            opt.setAttribute("value" , list.id);
            selectionTag.appendChild(opt);
        }
    });


}

//função usada para recuperar todas as informações de um card quando o mesmo é aberto
function getCardInfo(card_id){
    cardComments(card_id);
    cardTags(card_id, appendTag);
    getListsFromSession(document.getElementById(card_id));
    var date  = document.getElementById(card_id).querySelector('div[date]').getAttribute("date");
    var dateInput =  document.querySelector('input[type="date"]')
    date = date.split("/").reverse().join().replace(/,/g, '-');
    dateInput.value = date;
}

function deleteCardFromModal(){

    let cardClicked = JSON.parse(sessionStorage.getItem("card"));

    let card = {
        "card_id":cardClicked.id,
        "token": token
    }
    let card2bDeleted = document.getElementById(cardClicked.id);
    var url = " https://tads-trello.herokuapp.com/api/trello/cards/delete"
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
         card2bDeleted.parentNode.removeChild(card2bDeleted);
         document.getElementById("cardModal").click();
         sessionStorage.removeItem("card");
        } else if (this.readyState == 4 && this.status == 400) {

        }
    }

    xhttp.open("DELETE", url, true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(JSON.stringify(card));
}


//função de deleção do card a partir do drag and drop
function deleteCard(e) {
    e.preventDefault();
    let element = e.dataTransfer.getData("element");
    let fatherElement = document.getElementById(e.dataTransfer.getData("fatherElement"))
    let dragged = document.getElementById(element);

    let card = {
        "card_id": dragged.id,
        "token": token,
    }

    var url = " https://tads-trello.herokuapp.com/api/trello/cards/delete"
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            fatherElement.removeChild(dragged)
        } else if (this.readyState == 4 && this.status == 400) {

        }
    }

    xhttp.open("DELETE", url, true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(JSON.stringify(card));


}

//função que altera a flag que indica que a data foi mudada
function dateChanged(){
    dateChange = true;
}

//form que é submetido quando as mudanças dentro do card são salvas
document.getElementById("changesOnCardForm").addEventListener("submit", function(e){
    e.preventDefault();
    var card = JSON.parse(sessionStorage.getItem("card"));
    card = document.getElementById(card.id);
    var list = (document.getElementById(card.id)).parentNode;
    var select = this.getElementsByTagName("select")[0];
    var date = this.getElementsByTagName("input")[0];


    if(select.options[select.selectedIndex].value != "default" ){
        changeCard(card.id, select.options[select.selectedIndex].value);
        list.removeChild(card);
        document.getElementById(select.options[select.selectedIndex].value).appendChild(card);
    }

    if(dateChange){
        let newDate = (date.value.split("-").reverse()).join().replace(/,/g , '/');
        changeDate(newDate, card.id);
        card.querySelector('div[date]').setAttribute("date", newDate);

    }
    document.getElementById("cardModal").click();

});

//função usada para requisitar a mudança da data
function changeDate(date, card_id){
    let newDate = {
        "token": token,
        "card_id": card_id,
        "data": date
    }

    var url =  "https://tads-trello.herokuapp.com/api/trello/cards/newdata"
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
        } else if (this.readyState == 4 && this.status == 400) {

        }
    }

    xhttp.open("PATCH", url, true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(JSON.stringify(newDate));
}


//função usada para mudar o card de lista
function changeCard(card_id, list_id) {
    let change = {
        "token": token,
        "card_id": card_id,
        "list_id": list_id
    }

    var url = "https://tads-trello.herokuapp.com/api/trello/cards/changelist"
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            console.log("sucesso");
        } else if (this.readyState == 4 && this.status == 400) {

        }
    }

    xhttp.open("PATCH", url, true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(JSON.stringify(change));
}


//retorna  a cor normalizada bootstrap dada o id da tag
function getColorFromId(button_id){
    var colorTag;

    if(button_id == 2){
        colorTag = "btn bg-primary";
    }else if(button_id == 12){
        colorTag = "btn bg-success";
    }else if(button_id == 32){
        colorTag = "btn bg-warning";
    }else{
        colorTag = "btn bg-danger";
    }
    return colorTag;
}


//adiciona as tags nos cards
function addTagOnCard(card_id, color){
    let div = document.createElement("div");
    div.setAttribute("class", "card border-0 "+color);
    let li = document.createElement("li");
    li.setAttribute("class", "tagMin list-inline-item");
    li.appendChild(div);
    document.getElementById(card_id).firstElementChild.firstElementChild.appendChild(li);
}

function addTag(button){

    var colorTag = getColorFromId(button.id);
    let cardID = JSON.parse(sessionStorage.getItem("card")).id;
    var cardTag = {
        "card_id": cardID,
        "tag_id": button.id,
        "token" : token,
    }

    var url = "https://tads-trello.herokuapp.com/api/trello/cards/addtag"

    var xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function () {

        if (this.readyState == 4 && this.status == 200) {
            appendTag(button.id, colorTag);
            addTagOnCard(cardID, colorTag);
        } else if (this.readyState == 4 && this.status == 400) {
            document.getElementById("cardModal").click();

            //mostra o alert de erro por 4 segundos
            document.getElementById("tagAlreadyIncluded").classList.add("show");
            document.getElementById("tagAlreadyIncluded").classList.remove("tagAlreadyIncluded");
            document.getElementById("tagAlreadyIncluded").classList.add("tagAlreadyIncludedAf");

            setTimeout(function(){
                document.getElementById("tagAlreadyIncluded").classList.remove("show");
                document.getElementById("tagAlreadyIncluded").classList.remove("tagAlreadyIncludedAf");
                document.getElementById("tagAlreadyIncluded").classList.add("tagAlreadyIncluded");
            }, 4000)
        }
    }

    xhttp.open("POST", url, true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(JSON.stringify(cardTag));   
}