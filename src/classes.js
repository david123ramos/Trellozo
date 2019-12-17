
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
        li.setAttribute("class", "col-12 col-sm-3 col-md-5 col-lg-2 col-xl-2 mb-3 p-0 mr-2 ml-0");



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
            /**o form pode ser submetido de duas maneiras: quando a tecla enter é pressionada
             * ou quando o form é submetido pelo botão.
             */
            let form = new formCard().init();
            form.getElementsByTagName("textarea")[0].addEventListener("keypress", function (event) {
                if (event.keyCode == 13 && this.value.trim() != "") {
                    createCard(this.value, ul.id);
                    form.reset();
                    this.blur();
                } else if (event.keyCode == 13) {
                    event.preventDefault();
                    if(this.value.trim() == "")
                        this.value ="";
                }
            })

            form.addEventListener("submit", function (e) {
                e.preventDefault();
                if (this.getElementsByTagName("textarea")[0].value.trim() != "") {
                    createCard(this.getElementsByTagName("textarea")[0].value, ul.id);
                    this.reset();
                    this.getElementsByTagName("textarea")[0].focus();
                }else{
                    this.reset();
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

        //icone "X" que aparece quando se coloca o mouse em cima da lista
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
        text.setAttribute("max", 15);
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

        let sp = document.createElement("span");
        sp.setAttribute("class", "fa fa-comments-o");
        sp.setAttribute("title", "comentários")
        let i = document.createElement("i");
        i.setAttribute("class", "ml-2");
        sp.appendChild(i);
        div.appendChild(sp);


        let liCard = document.createElement("li");
        liCard.setAttribute("id", this.cardId);

        liCard.setAttribute("data-toggle", "modal");
        liCard.setAttribute("data-target", "#cardModal");
        /**Quando o card é clicado é aberto um modal. Para usarmos as informações necessárias
         * sem precisar de fazer diversas requisições ao servidor, podemos guardar o que é pertinetente
         * no session storage.
         */
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