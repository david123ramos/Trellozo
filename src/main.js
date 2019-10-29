//Outras variaveis
const token = sessionStorage.getItem("token");

//divs
var boardGroupRegister = document.getElementById("boardGroupRegister");
var divRegisterBoard = document.getElementById("divRegisterBoard");

//forms and buttons
var formCreateBoard =  document.getElementById("formCreateBoard");
var colorButton = document.getElementById("colorButton");
var boardName =  document.getElementById("boardName");

//html objects
var fatherRow =  document.getElementById("fatherRow")


//Funcao que recebe os  boards na entrada do sistema e os coloca na tela
function printBoards(element){
    let board = new Board(element.name, element.color).init();
    fatherRow.appendChild(board);
}

function getBoards(){
    var url = "https://tads-trello.herokuapp.com/api/trello/boards/"+token;
    console.log(url);
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var obj = JSON.parse(this.responseText);
            console.log(obj);
            obj.forEach(printBoards);
            
        }
    }
    xhttp.open("GET", url, true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(url);
}

getBoards();

var colorButtons = document.getElementsByClassName("btn-color");
//adciona um eventListener a cada um dos botões
//quando o botão muda de cor, o fundo da div também é mudado
for(var button of  colorButtons){
    let color =  getComputedStyle(button).getPropertyValue("background-color");
    
    button.addEventListener("click", function(){
        boardGroupRegister.style.backgroundImage ="none";
        boardGroupRegister.style.backgroundColor = color;
        colorButton.value = color;
    })
}


class Board {
    constructor(name, color){
        this.name = name;
        this.color = color;
        
    }
    init(){
        /*Método que inicia um novo objeto do tipo Board */
        //Hierarquia: divPrincipal -> divCard -> Span -> paragrafo -> texto
        let listItem = document.createElement("li");
        listItem.setAttribute("class", "col-12 col-sm-3 col-md-3 col-lg-2 col-xl-2 mb-3 ");

        let div1 = document.createElement("div");
        div1.setAttribute("class", "card border-light h-100");
        div1.setAttribute("id", "newBoard");
        div1.style.backgroundColor = this.color;
        //TODO: o onclick desses boards deve abrir as listas do trello

        let spn = document.createElement("span");
        spn.setAttribute("id", "spnNovoBoard");
        
        let paragrafo = document.createElement("p");
        
        let tituloBoard = document.createTextNode(this.name);

        paragrafo.appendChild(tituloBoard);
        spn.appendChild(paragrafo);
        div1.appendChild(spn);
        listItem.appendChild(div1);

        return listItem;
    }
}


formCreateBoard.addEventListener("submit", function(e){
    e.preventDefault();
    console.log(colorButton.value)
    var board ={
        "name" : boardName.value,
        "color": colorButton.value,
        "token": sessionStorage.getItem("token")
    }
    var url = "https://tads-trello.herokuapp.com/api/trello/boards/new";
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var obj = JSON.parse(this.responseText);
            console.log(obj);
            let newBoard = new Board(obj.name, obj.color);
            fatherRow.appendChild(newBoard.init());
            
            //limpa o form
            closeBoardRegister();
            closeAlert(divRegisterBoard);

        }else if(this.readyState == 4 && this.status == 400){

        }
    }

    console.log(JSON.stringify(board));

    xhttp.open("POST", url, true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(JSON.stringify(board));

});

/*Muita repetição de código */

//Recebe qualquer elemento e oculta sua vizualização
//Se o argumento passado for uma string quer dizer que estou passando um id para a função
function closeAlert(someElement){      
    if(someElement == 'string'){
        document.getElementById(someElement).style.display = "none";
    }else{
        someElement.style.display = "none";
    }
}

//retoma o estado inicial do form de registrar um novo board
function closeBoardRegister(){
    formCreateBoard.reset();
    boardGroupRegister.style.backgroundImage =  "url(img/bgboard.jpg)";
    divRegisterBoard.style.display = "none";
}

function showAlert(someElement){
    document.getElementById(someElement).style.display ="block";
}