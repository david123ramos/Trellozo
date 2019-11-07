//outras variáveis
const token = "8Go3a5bh1necoWraX1DVhz";
var firstChild = document.getElementById("firstChild");
var fatherRow =  document.getElementById("fatherRow");

//Forms e divs
var formCreateList = document.getElementById("formCreateList");
var divCreateList =  document.getElementById("formList");
var spnListTitle = document.getElementById("spnList");
var listName = document.getElementById("listName");

class List{
    constructor(name, listId){
        this.name = name;
        this.listId =  listId;
    }   

    //a lista é um item dentro da "lista Pai"
    init(){ 
        
        let li = document.createElement("li");
        li.setAttribute("class", "col-12 col-sm-3 col-md-3 col-lg-2 col-xl-2 mb-3 mx-2");
        li.setAttribute("id", this.listId)
        
        let div = document.createElement("div");
        div.setAttribute("class", " card list");
        div.style.backgroundColor = "#ebecf0";
        
        let spn = document.createElement("span");
        spn.setAttribute("class" , "spnList d-flex justify-content-center");
        
        let p = document.createElement("p");
        let text = document.createTextNode(this.name);
        
        p.appendChild(text);
        spn.appendChild(p);
        div.appendChild(spn);
        li.appendChild(div);
        return li;
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