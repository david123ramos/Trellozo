//forms and buttons
var formCreateBoard =  document.getElementById("formCreateBoard");

formCreateBoard.addEventListener("submit", function(e){
    e.preventDefault();
    let boardName =  document.getElementById("boardName");
    let colorButton = document.getElementById("colorButton");

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
 
        }else if(this.readyState == 4 && this.status == 400){

        }
    }

    console.log(JSON.stringify(board));

    xhttp.open("POST", url, true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(JSON.stringify(board));

});