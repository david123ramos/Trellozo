//outras variáveis
const boardID = JSON.parse(sessionStorage.getItem("board")).id;
const boardColor = JSON.parse(sessionStorage.getItem("board")).color;
const boardName = JSON.parse(sessionStorage.getItem("board")).name;
const token = sessionStorage.getItem("token");

var firstChild = document.getElementById("firstChild");
var fatherRow =  document.getElementById("fatherRow");

//Forms e divs
var formCreateList = document.getElementById("formCreateList");
var divCreateList =  document.getElementById("formList");
var spnListTitle = document.getElementById("spnList");
var listName = document.getElementById("listName");

window.onload = function(){
    document.getElementById("nav-header").style.backgroundColor = boardColor;
    document.getElementsByTagName("body")[0].style.backgroundColor = boardColor;
    document.getElementById("boardName").innerHTML = boardName;
}

class List{
    constructor(name, listId){
        this.name = name;
        this.listId =  listId;
    }   

    //a lista é uma outra lista dentro dentro da "lista Pai"
    init(){ 
        //Hierarquia: li->ul->li->div->span->->textNode
        let li = document.createElement("li");
        li.setAttribute("class", "col-12 col-sm-3 col-md-3 col-lg-2 col-xl-2 mb-3 p-0 mr-2 ml-0");
        li.setAttribute("id", this.listId)
        let ul = document.createElement("ul");
        ul.setAttribute("class", "p-0");
        ul.setAttribute("class", "list")
        ul.style.backgroundColor = "#ebecf0";
        

        let title = document.createElement("li");
        let firstChild = document.createElement("li");
        firstChild.appendChild(new BtnIsertCard().init());


        let div = document.createElement("div");
        div.setAttribute("class", " card title");
        
        
        let spn = document.createElement("span");

        
        let p = document.createElement("p");
        let text = document.createTextNode(this.name);
        
        p.appendChild(text);
        spn.appendChild(p);
        div.appendChild(spn);
        title.appendChild(div);
        ul.appendChild(title);
        ul.appendChild(firstChild);
        li.appendChild(ul);
        return li;
    }
}
class BtnIsertCard{
    init(){
        let div = document.createElement("link");
        div.setAttribute("class", "d-flex justify-content-center mw-100");
        let text = document.createTextNode("+ Add another card");
        div.appendChild(text);
        return div;
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



function closeAlert(someElement){      
    if(someElement == 'string'){
        document.getElementById(someElement).style.display = "none";
    }else{
        someElement.style.display = "none";
    }
}

//.collapse('toggle') alterna a vizualizção da classe collapse que está em uma div
function resetForm(){
    formCreateList.reset();
    $('#formList').collapse('toggle')
    
    setTimeout(function(){
        spnListTitle.style.display = "block";
    }, 350)
}