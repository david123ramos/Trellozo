//Outras variaveis
const token = sessionStorage.getItem("token");

//divs
var boardGroupRegister = document.getElementById("boardGroupRegister");
var divRegisterBoard = document.getElementById("divRegisterBoard");

//forms and buttons
var formCreateBoard =  document.getElementById("formCreateBoard");
var colorButton = document.getElementById("colorButton");
var boardName =  document.getElementById("boardName");
var acountButton = document.getElementsByClassName("spnRoundedButton").item(0);
var boardClickedName = document.getElementById("boardID");
var boardClickedColor = document.getElementById("boardColor");
var formEnterBoard = document.getElementById("formEnterBoard");

//html objects
var fatherRow =  document.getElementById("fatherRow");
var firstChild = document.getElementById("firstChild");



getUserName();
getBoards();


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

//usada no forEach. Instancia o board e o imprime na tela 
function printBoards(element){
    let board = new Board(element.name, element.color, element.id).init();
    fatherRow.insertBefore(board, firstChild);
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


//adciona um eventListener a cada um dos botões de cor
//quando o botão muda de cor, o fundo da div também é mudado
var colorButtons = document.getElementsByClassName("btn-color");
for(let button of  colorButtons){
    let color =  getComputedStyle(button).getPropertyValue("background-color");
    
    button.addEventListener("click", function(){
        boardGroupRegister.style.backgroundImage ="none";
        boardGroupRegister.style.backgroundColor = color;
        colorButton.value = color;
    })
}

/*Classe que representa cada objeto board */
class Board {
    constructor(name, color, id){
        this.name = name;
        this.color = color;
        this.id = id;
        
    }
    init(){
        /*Método que inicia um novo objeto do tipo Board */
        //Hierarquia: li-> divCard -> Span -> paragrafo -> texto
        let listItem = document.createElement("li");
        listItem.setAttribute("class", "col-12 col-sm-3 col-md-3 col-lg-2 col-xl-2 mb-3 ");
        listItem.setAttribute("id", this.id);

        let divCard = document.createElement("div");
        divCard.setAttribute("class", "card border-light h-100 board");
        divCard.setAttribute("id", "newBoard");
        divCard.style.backgroundColor = this.color;

        let spn = document.createElement("span");
        spn.setAttribute("id", "spnNovoBoard");
        
        let paragrafo = document.createElement("p");
        
        let tituloBoard = document.createTextNode(this.name);

        paragrafo.appendChild(tituloBoard);
        spn.appendChild(paragrafo);
        divCard.appendChild(spn);
        listItem.appendChild(divCard);
        
        listItem.addEventListener("click", ()=>{
            
            let boardInfo = {
                "id": this.id,
                "color": this.color,
                "name": this.name
            }
            sessionStorage.setItem("board", JSON.stringify(boardInfo));
            window.location.href ="board.html";
            
        });
        
        
        return listItem;
    }
}


formCreateBoard.addEventListener("submit", function(e){
    e.preventDefault();
    
    var board ={
        "name" : boardName.value,
        "color": colorButton.value,
        "token": token
    }

    var url = "https://tads-trello.herokuapp.com/api/trello/boards/new";
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var obj = JSON.parse(this.responseText);
            console.log(obj);
            let newBoard = new Board(obj.name, obj.color, obj.id);
            console.log(newBoard)
            fatherRow.insertBefore(newBoard.init(), firstChild);
            
            //limpa o form
            closeBoardRegister();
            closeAlert(divRegisterBoard);

        }else if(this.readyState == 4 && this.status == 400){

        }
    }


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
    closeAlert(divRegisterBoard);
}

function showAlert(someElement){
    document.getElementById(someElement).style.display ="block";
}