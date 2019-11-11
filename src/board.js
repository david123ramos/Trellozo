//outras variáveis
const boardID = JSON.parse(sessionStorage.getItem("board")).id;
const boardColor = JSON.parse(sessionStorage.getItem("board")).color;
const boardName = JSON.parse(sessionStorage.getItem("board")).name;
const token = sessionStorage.getItem("token");

var firstChild = document.getElementById("firstChild");
var fatherRow =  document.getElementById("fatherRow");
var acountButton = document.getElementsByClassName("spnRoundedButton").item(0);
 

//Forms e divs
var formCreateList = document.getElementById("formCreateList");
var divCreateList =  document.getElementById("formList");
var spnListTitle = document.getElementById("spnList");
var listName = document.getElementById("listName");

window.onload = function(){
    document.getElementById("nav-header").style.backgroundColor = boardColor;
    document.getElementsByTagName("body")[0].style.backgroundColor = boardColor;
    document.getElementById("boardName").innerHTML = boardName;
    getUserName();

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
        li.setAttribute("id", this.listId)

        
        let ul = document.createElement("ul");
        ul.setAttribute("class", "p-0 list defaultBgcolor");

        
        let divMain = document.createElement("div");
        divMain.setAttribute("class", " defaultBgcolor rounded pb-1");
        
        let firstChild = document.createElement("div");
        firstChild.appendChild(new BtnIsertCard().init());

        firstChild.addEventListener("click", function(){
            let li = document.createElement("li");
            
            let close = new CloseButton().init();
            let add = new AddButton().init();
            
            //TODO: enviar o card para o servidor
            add.addEventListener("click", function(){
                keyEvent();
            });

            //o botao de fechar precisa remover o item que foi appendado na lista
            close.addEventListener("click", ()=>{
                ul.removeChild(li);
                showAlert(firstChild);

            });

            //card -> textArea -> divWrapper -> botaoAdd -> botaoClose
            let card = new Card().init();
            let divWrapper = new DivWrapper().init();
            divWrapper.appendChild(add);
            divWrapper.appendChild(close);
            card.appendChild(divWrapper);
            
            li.appendChild(card);
            ul.appendChild(li);
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

/*Classe que define o card */
class Card{
    
    init(){
        let div = document.createElement("div");
        div.setAttribute("class", "divTextArea ");
        
        let textArea = document.createElement("textarea");
        textArea.setAttribute("placeholder","Enter a title for this card...")
        textArea.setAttribute("onkeypress", "keyEvent()");
        textArea.classList.add("textCard")

        div.appendChild(textArea);


        return div;
    }

}


class DivWrapper{
    init(){
        let div =  document.createElement('div');
        div.setAttribute("class", "d-flex justify-content-start");
        return div;
    }
}

class AddButton{
    init(){
        
        let button = document.createElement("button");
        button.setAttribute("class", "btn btn-success btn-textArea");
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
        "board_id": "10742"
    }
    var url = "https://tads-trello.herokuapp.com/api/trello/lists/new";
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var obj = JSON.parse(this.responseText);
            console.log(obj);
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
        spnListTitle.style.display = "block";
    }, 350)
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