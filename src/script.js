//divs que precisam ser manipuladas em algum momento
var divSuccess = document.getElementById("divSuccess");
var divWrong = document.getElementById("divWrong");
var divFailLogin =  document.getElementById("divWrongLogin");
var divL = document.getElementById("divLogin");
var divC = document.getElementById("divRegister"); 

//botoes, forms
var keepConnected = document.getElementById("keepConnected");
var formLogin = document.getElementById("login");
var formCadastrar = document.getElementById("cadastrar");


if(localStorage.getItem("token")){
    formLogin.submit();
}else if(sessionStorage.getItem("token")){
    formLogin.submit();
}

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
formCadastrar.addEventListener("submit", function (e) {
    e.preventDefault();
    if(document.getElementById("name").value.trim() != "" &&  document.getElementById("password").value.trim() != ""){
        let dados = {
            "name": document.getElementById("name").value,
            "username": document.getElementById("username").value,
            "password": document.getElementById("password").value
        }
    
        var url = "https://tads-trello.herokuapp.com/api/trello/users/new";
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
    }else{
        document.getElementById("name").value = ""
        document.getElementById("username").value = ""
        document.getElementById("password").value = ""

    }

});


/*Aqui defininimos o eventListner que escutará os submits do form de Login*/
formLogin.addEventListener("submit", function (e) {
    e.preventDefault();

    let dados = {
        "username": document.getElementById("nameLogin").value,
        "password": document.getElementById("passwordLogin").value
    }

    var url = "https://tads-trello.herokuapp.com/api/trello/login";
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var obj = JSON.parse(this.responseText);
            console.log(obj.token);
            
           if (keepConnected.checked){
               localStorage.setItem("token", JSON.stringify(obj.token));
               sessionStorage.setItem("token", JSON.stringify(obj.token));
            }else{
                sessionStorage.setItem("token", obj.token);
            }
            formLogin.reset();
            formLogin.submit();

        }else if(this.readyState == 4 && this.status == 400){
            divFailLogin.style.display = "block";
            formLogin.reset();
        }
    }

    console.log(JSON.stringify(dados));

    xhttp.open("POST", url, true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(JSON.stringify(dados));

});

/*Função usada em alerts de sucesso/erro unicamente recebe um objeto e o torna oculto */
function closeAlert(someAlert){
    someAlert.style.display = "none";
}