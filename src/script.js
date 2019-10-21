var divSuccess = document.getElementById("divSuccess");
var divWrong = document.getElementById("divWrong");
var divL = document.getElementById("divLogin");
var divC = document.getElementById("divCadastro");  

/*Escuta evento do click para mudar a vizualização da das divs de cadastro/login*/
function swapDiv(div){

    if(div == 0){
        divL.style.display = "none";
        divC.style.display = "block";
    }else{
        divL.style.display = "block";
        divC.style.display = "none";    
    }
}

/*Aqui defininimos o eventListner que escutará os submits do form de cadastro */
var formCadastrar = document.getElementById("cadastrar");
formCadastrar.addEventListener("submit", function (e) {
    e.preventDefault();

    let dados = {
        "name": document.getElementById("name").value,
        "username": document.getElementById("username").value,
        "password": document.getElementById("password").value
    }

    var url = "http://tads-trello.herokuapp.com/api/trello/users/new";
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var obj = JSON.parse(this.responseText);
            console.log(obj);
            divSuccess.style.display = "block";
            divC.style.display = "none";
            divL.style.display = "block";
        }else if(this.readyState == 4 && this.status == 400){
            divWrong.style.display="block";
            formCadastrar.reset();
        }
    }

    console.log(JSON.stringify(dados));

    xhttp.open("POST", url, true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(JSON.stringify(dados));

});


/*Aqui defininimos o eventListner que escutará os submits do form de Login*/
var formLogin = document.getElementById("login");
formLogin.addEventListener("submit", function (e) {
    e.preventDefault();

    let dados = {
        "username": document.getElementById("username").value,
        "password": document.getElementById("password").value
    }

    var url = "https://tads-trello.herokuapp.com/api/trello/login";
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var obj = JSON.parse(this.responseText);
            console.log(obj)
        }else if(this.readyState == 4 && this.status == 400){

        }
    }

    console.log(JSON.stringify(dados));

    xhttp.open("POST", url, true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(JSON.stringify(dados));

});
