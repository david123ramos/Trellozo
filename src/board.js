//outras variáveis
const boardID = JSON.parse(sessionStorage.getItem("board")).id;
const boardColor = JSON.parse(sessionStorage.getItem("board")).color;
const boardName = JSON.parse(sessionStorage.getItem("board")).name;
const token = sessionStorage.getItem("token");
const data =  dataAtualFormatada();

var firstChild = document.getElementById("firstChild");
var fatherRow =  document.getElementById("fatherRow");
var acountButton = document.getElementsByClassName("spnRoundedButton").item(0);

 

//Forms e divs
var formCreateList = document.getElementById("formCreateList");
var divCreateList =  document.getElementById("formList");
var spnListTitle = document.getElementById("spnList");
var listName = document.getElementById("listName");


document.getElementById("nav-header").style.backgroundColor = boardColor;
document.getElementsByTagName("body")[0].style.backgroundColor = boardColor;
document.getElementById("boardName").classList.add("overflowHidden");
document.getElementById("boardName").innerHTML = boardName;
document.getElementsByTagName("title")[0].innerHTML = boardName + " | Trellozo";
getUserName();
getLists();

window.onload = function(){
    let colorButtons = document.querySelectorAll(".btn-color");
    let aux = Array.from(colorButtons);

        aux.map(function(colorButton){
            let color = getComputedStyle(colorButton).getPropertyValue("background-color");
            colorButton.addEventListener("click", function(){
                document.getElementsByTagName("body")[0].style.backgroundColor = color;
                document.getElementById("nav-header").style.backgroundColor = color;
                let ax = JSON.parse(sessionStorage.getItem("board"));
                ax.color = color;
                sessionStorage.setItem("board", JSON.stringify(ax));
                changeBodyColor(color);
            });
    });

}


/*Classe que define uma lista */
class List{
    constructor(name, listId){
        this.name = name;
        this.listId =  listId;
    }   

    //a lista é uma outra lista dentro dentro da "lista Pai"
    init(){ 
        //Hierarquia: li->div->ul->li->div->span->->textNode
        let li = document.createElement("li");
        li.setAttribute("class", "col-12 col-sm-3 col-md-3 col-lg-2 col-xl-2 mb-3 p-0 mr-2 ml-0");
       

        
        var ul = document.createElement("ul");
        ul.setAttribute("class", "p-1 list defaultBgcolor"); 
        ul.setAttribute("id", this.listId)
        
        ul.ondrop = function(){drop(event)};
        
        ul.ondragover = function(event){ allowDrop(event); this.classList.add("dragOn")};
        
        ul.ondragleave=  function(){
          
            this.classList.remove("dragOn");
        }
        ul.ondragend = function(){  
            this.classList.remove("dragOn");
            document.getElementsByClassName("spnDelete-ev")[0].classList.replace("spnDelete-ev", "spnDelete")
        }
        let divMain = document.createElement("div");
        divMain.setAttribute("class", " defaultBgcolor rounded pb-1");
        
        let firstChild = document.createElement("div");
        firstChild.appendChild(new BtnIsertCard().init());

        firstChild.addEventListener("click", function(){
            let newLi = document.createElement("li");
            
            let close = new CloseButton().init();
            let add = new AddButton().init();
            
            
            //o botao de fechar precisa remover o item que foi appendado na lista
            close.addEventListener("click", ()=>{
                ul.removeChild(newLi);
                showAlert(firstChild);
            });
            
            //form -> textArea -> divWrapper -> botaoAdd -> botaoClose
            let form = new formCard().init();
            form.getElementsByTagName("textarea")[0].focus();

            form.addEventListener("submit", function(e){
                e.preventDefault();
                if(this.getElementsByTagName("textarea")[0].value != ""){
                    createCard(this.getElementsByTagName("textarea")[0].value, ul.id);
                    this.reset();
                    this.getElementsByTagName("textarea")[0].focus();
                }
            });
            

            let divWrapper = new DivWrapper().init();
            divWrapper.appendChild(add);
            divWrapper.appendChild(close);
            form.appendChild(divWrapper);
            form.focus();
            newLi.appendChild(form);
            ul.appendChild(newLi);
            closeAlert(firstChild);

        });


        let div = document.createElement("div");
        div.setAttribute("class", " card title defaultBgcolor");

        let spn = document.createElement("span");
        
        let p = document.createElement("p");
        let text = document.createTextNode(this.name);
        
        p.appendChild(text);
        spn.appendChild(p);
        div.appendChild(spn);
        divMain.appendChild(div);
        divMain.appendChild(firstChild);
        divMain.insertBefore(ul, firstChild);

        li.appendChild(divMain);
        return li;
    }
}

/*Botão usado para inserir um novo card dentro de uma lista*/
class BtnIsertCard{
    init(){
        let div = document.createElement("a");
        div.setAttribute("class", "d-flex justify-content-center mw-100");
        let text = document.createTextNode("+ Add another card");
        div.classList.add("secondaryText");
        div.appendChild(text);
        return div;
    }
}

/*Classe que define um card */
class Card{
    constructor(cardName, cardId){
        this.cardName = cardName;
        this.cardId = cardId;
    }
    
    init(){
        let div =  document.createElement("div");
        div.setAttribute("class", "card p-2 textCardSubmited")
        div.appendChild(document.createTextNode(this.cardName));
        let liCard = document.createElement("li");
        div.classList.add("divTextArea");
        liCard.setAttribute("id", this.cardId)
        liCard.setAttribute("draggable", true);
        liCard.ondragstart = function(){liCard.classList.add("drag"); div.classList.add("noShadow");  drag(event)};
        liCard.appendChild(div);
        return liCard;
    }
}

/*Classe que define o form para a criação de um card */
class formCard{

    init(){
        let form = document.createElement("form");
        let div = document.createElement("div");
        div.setAttribute("class", "divTextArea ");
        
        let textArea = document.createElement("textarea");
        textArea.setAttribute("placeholder","Enter a title for this card...")
        textArea.classList.add("textCard")

        div.appendChild(textArea);
        form.appendChild(div);

        return form;
    }
}


class DivWrapper{
    init(){
        let div =  document.createElement('div');
        div.setAttribute("class", "d-flex justify-content-start p-1");
        return div;
    }
}

class AddButton{
    init(){
        
        let button = document.createElement("button");
        button.setAttribute("class", "btn btn-success btn-textArea");
        button.setAttribute("type", "submit");
        button.appendChild(document.createTextNode("Add card"));
        
        return button;
    }
}

class CloseButton{
    init(){

        let close = document.createElement("button");
        close.classList.add("close");
               
        let spn = document.createElement("span");
        spn.appendChild(document.createTextNode("x"));
        close.appendChild(spn);

        
        return close;
    }
}

formCreateList.addEventListener("submit", function(e){
    e.preventDefault();

    var board ={
        "name" : listName.value,
        "token": token,
        "board_id": boardID
    }
    var url = "https://tads-trello.herokuapp.com/api/trello/lists/new";
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var obj = JSON.parse(this.responseText);
            let newList = new List(obj.name, obj.id);
            fatherRow.insertBefore(newList.init(), firstChild);
            
            //limpa o form
            resetForm();

        }else if(this.readyState == 4 && this.status == 400){

        }
    }

    console.log(JSON.stringify(board));

    xhttp.open("POST", url, true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(JSON.stringify(board));

});




//.collapse('toggle') alterna a vizualizção da classe collapse que está em uma div
//TODO : não usar jQuery
function resetForm(){
    formCreateList.reset();
    $('#formList').collapse('toggle')
    
    setTimeout(function(){
        spnListTitle.classList.remove("none");
        spnListTitle.classList.add("block");
    }, 350)
}

function changeBodyColor(color){

    let board = {
        "board_id": boardID,
        "color": color,
        "token": token
    }
    var url = " https://tads-trello.herokuapp.com/api/trello/boards/newcolor";
    console.log(url);
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
function getUserName(){
    var url = "https://tads-trello.herokuapp.com/api/trello/users/"+token;
    console.log(url);
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var obj = JSON.parse(this.responseText);
            console.log(obj.name);
            acountButton.innerHTML = obj.name.charAt(0);
            
        }
    }
    xhttp.open("GET", url, true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(url);
}

function closeAlert(someElement){      
    if(someElement == 'string'){
        document.getElementById(someElement).classList.add("none");
    }else{
        someElement.classList.add("none");
    }
}
function showAlert(someElement){
    someElement.classList.remove("none");
    someElement.classList.add("block");
}

//função que vai ser executada quando for detectada o evento da tecla "ENTER" dentro da textarea do card
function keyEvent(){
    let key = window.event.keyCode;

    if(key == 13){
        let div = document.createElement("div");
        div.setAttribute("class", "textCard");
        return div;
    }
}

function mainPage(){
   return window.location.href ="main.html"
}

function createCard(nameCard, listId){
    var card ={
        "name" : nameCard,
        "data" : data,
        "token": token,
        "list_id": listId
    }
    var url = "https://tads-trello.herokuapp.com/api/trello/cards/new";
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var obj = JSON.parse(this.responseText);
            let card =  new Card(obj.name, obj.id).init();
            let l = document.getElementById(listId);
            let sizeList = l.querySelectorAll("li").length
            l.insertBefore(card, l.childNodes[sizeList -1]);

        }else if(this.readyState == 4 && this.status == 400){

        }
    }

    xhttp.open("POST", url, true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(JSON.stringify(card));  

}

function dataAtualFormatada(){
    var data = new Date(),
        dia  = data.getDate().toString(),
        diaF = (dia.length == 1) ? '0'+dia : dia,
        mes  = (data.getMonth()+1).toString(), //+1 pois no getMonth Janeiro começa com zero.
        mesF = (mes.length == 1) ? '0'+mes : mes,
        anoF = data.getFullYear();
    return diaF+"/"+mesF+"/"+anoF;
}

//função usada para renomear limitar a quantidade de caracteres que o usuário pode colocar na renomeação do board
function renameBoard(){

}

function getLists(){

    var url = "https://tads-trello.herokuapp.com/api/trello/lists/"+token+"/board/"+boardID
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var obj = JSON.parse(this.responseText);
            obj.forEach(printLists);

        }else if(this.readyState == 4 && this.status == 400){

        }
    }

    xhttp.open("GET", url, true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(JSON.stringify(url));  
}

function printLists(someList){
    let list = new List(someList.name, someList.id);
    getCards(someList.id);
    fatherRow.insertBefore(list.init(), firstChild);
}

function getCards(listId){
    var url = " https://tads-trello.herokuapp.com/api/trello/cards/"+token+"/list/"+listId
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var obj = JSON.parse(this.responseText);
            let l = document.getElementById(listId);
            for(let i in obj){
                l.appendChild(new Card(obj[i].name, obj[i].id).init());
            }

        }else if(this.readyState == 4 && this.status == 400){

        }
    }

    xhttp.open("GET", url, true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(JSON.stringify(url));  
}

function excludeBoard(){

    let b = {
        "board_id": boardID,
        "token": token
    }

    var url = "https://tads-trello.herokuapp.com/api/trello/boards/delete"
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {

            window.location.href ="main.html"

        }else if(this.readyState == 4 && this.status == 400){

        }
    }

    xhttp.open("DELETE", url, true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(JSON.stringify(b));  
    
}

function allowDrop(e){
    e.preventDefault();
    if (e.target.getAttribute("draggable") == "true")
        e.dataTransfer.dropEffect = "none"; // dropping is not allowed
    else
        e.dataTransfer.dropEffect = "all"; // drop it like it's hot
}

function drag(e){
    document.getElementsByClassName("spnDelete")[0].classList.replace("spnDelete", "spnDelete-ev");
    e.dataTransfer.setData("fatherElement", e.target.parentNode.id);
    e.dataTransfer.setData("element", e.target.id);
}

function drop(e){
    e.preventDefault();
    let element = e.dataTransfer.getData("element");
    let dragged = document.getElementById(element);
    
    //removendo as classes ativadas no drag
    dragged.classList.remove("drag");
    dragged.getElementsByClassName("textCardSubmited")[0].classList.remove("noShadow");
        
       if(e.target.tagName == 'UL'){
           try{
               e.target.appendChild(dragged);

               changeCard(dragged.id, e.target.id);
           }catch(err){
               console.log("Algo deu errado");
           }

       }
    
}

function deleteCard(e){
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
        }else if(this.readyState == 4 && this.status == 400){

        }
    }

    xhttp.open("DELETE", url, true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(JSON.stringify(card));  
    

}

function changeCard(card_id, list_id){
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
        }else if(this.readyState == 4 && this.status == 400){

        }
    }

    xhttp.open("PATCH", url, true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(JSON.stringify(change));  
    
}