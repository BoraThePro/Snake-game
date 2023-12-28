$(document).ready(function() {

    let nizRezultata=[
        {
            ime : "pc",
            rez : "0"
        },
        {
            ime : "pc",
            rez : "0"
        },
        {
            ime : "pc",
            rez : "0"
        },
        {
            ime : "pc",
            rez : "0"
        },
        {
            ime : "pc",
            rez : "0"
        },
    ];

    let poslednja = {
        ime : "",
        rez : ""
    }
    
    inicijalizujPodatke();
    ubaciNovRezultat();
    ispisiRezultate();

    function inicijalizujPodatke() {
        let item = localStorage.getItem("rezultati");
        if( item!= null) {
            nizRezultata = JSON.parse(item);
        } else {
            localStorage.setItem("rezultati", JSON.stringify(nizRezultata));
        }
        item = localStorage.getItem("poslednja");
        if( item!= null) {
            poslednja = JSON.parse(item);
        } else {
            poslednja = item;
        }
    }

    function sortirajRezultate(a ,b) {
        let numberA = parseInt(a.rez);
        let numberB = parseInt(b.rez);
        return numberB - numberA;   
    }

    function ubaciNovRezultat() {
        if(poslednja != null) {
            nizRezultata.push(poslednja);
            nizRezultata.sort(sortirajRezultate);
            if(nizRezultata.length > 5) {
                nizRezultata.pop();
            }
        }
        nizRezultata.sort(sortirajRezultate);
        localStorage.setItem("rezultati", JSON.stringify(nizRezultata));
    }

    function ispisiRezultate() {
        let red;
        for( let i = 0; i < nizRezultata.length && i < 5; i++){
            red = $("<div></div>").text( (i+1) + ". " + nizRezultata[i].ime + "\t - \t" + nizRezultata[i].rez);
            $(".top5").append(red);
        }
        if(poslednja != null) {
            let linija = $("<hr>");
            $(".top5").append(linija);
            red = $("<div></div>").text("Poslednji partija: " + poslednja.ime + "\t - \t" + poslednja.rez);
            $(".top5").append(red);
        }
    }

    $("#uputstva").click(function () {
        localStorage.removeItem("poslednja");
        window.location.href = "zmijica-uputstvo.html";
    })
      
});