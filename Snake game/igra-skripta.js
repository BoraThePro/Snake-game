$(document).ready(function() {
    let zmija=[];
    let velicina;
    let vreme;
    let intervalId;
    let superHranaIntervalId;
    let smer;
    let rezultat=0;
    let hrana;
    let superHrana;

    let specifikacije = {
        tabla : "10",
        tezina : "srednje"
    }

    inicijalizujPodatke();
    napraviTabelu();

    function inicijalizujPodatke() {
        
        let tmp = localStorage.getItem("postavka");
        if( tmp != null) {
            specifikacije = JSON.parse(tmp);
        } else {
            localStorage.setItem("postavka", JSON.stringify(specifikacije));
        }
        tmp = localStorage.getItem("rezultati");
        if(tmp != null){
            let nizRezultata = JSON.parse(tmp);
            $("#najbolji").text("Najbolji: " + nizRezultata[0].rez);
        } else{
            $("#najbolji").text("Najbolji: " + 0);
        }
        postaviTezinu();
        velicina = parseInt(specifikacije.tabla);

    }


    function napraviTabelu() {
        let cnt = 0;
        let celija;
        for(let i = 0; i < velicina; i++){
            let red = $("<tr></tr>");
            for(let j=0; j<velicina;j++){
                if(velicina == 10) {
                    celija = $("<td></td>").attr("id", cnt);
                } else if(velicina == 15){
                    celija = $("<td></td>").attr("id", cnt).css("height", "40px").css("width", "40px");
                    $("td").css("font-size", "120%");
                } else if(velicina == 20) {
                    celija = $("<td></td>").attr("id", cnt).css("height", "30px").css("width", "30px");
                    $("td").css("font-size", "100%");
                }
                cnt++;
                red.append(celija);
            }
            $("#tabela").append(red);
        }
        if(velicina == 10) {
            $("td").css("font-size", "200%");
        } else if(velicina == 15){
            $("td").css("font-size", "120%");
        } else if(velicina == 20) {
            $("td").css("font-size", "100%");
        }
        stvoriZmiju();
        postaviHranu();
    }

    function stvoriZmiju() {
        let glava = Math.floor(Math.random() * velicina * velicina);
        zmija.push(glava);
        $("#"+glava).css("background-color", "yellow");
        
    }

    function postaviTezinu() {
        if(specifikacije.tezina == "lako"){
            vreme = 200;
        } else if(specifikacije.tezina == "srednje"){
            vreme = 150;
        } else if(specifikacije.tezina == "tesko"){
            vreme = 100;
        }
    }

    function postaviHranu() {
        hrana = null;
        while(hrana == null){
            hrana = Math.floor(Math.random() * velicina  * velicina);
            for(let i=0; i < zmija.length; i++) {
                if(zmija.includes(hrana)){
                    hrana = null;
                }
            }
        }
        $("#" + hrana).text("🥚");
    }

    function postaviSuperHranu() {
        superHrana = null;
        while(superHrana == null){
            superHrana = Math.floor(Math.random() * velicina  * velicina);
            for(let i=0; i < zmija.length; i++) {
                if(zmija.includes(superHrana) || superHrana == hrana){
                    superHrana = null;
                }
            }
        }
        $("#" + superHrana).text("⭐");
        let vremeSuperHrane = Math.floor(2000 + Math.random() * 2000);
        setTimeout(function() {
            $("#" + superHrana).text("");
            superHrana = null;
        },vremeSuperHrane);
    }

    function proveraHrane(glava) {
        if(glava == hrana){
            $("#" + hrana).text("");
            rezultat++;
            zmija.unshift(glava);
            $("#"+glava).css("background-color", "yellow");
            $("#trenutni").text("Trenutni: " + rezultat);
            postaviHranu();
            return true;
        } else if(glava == superHrana){
            $("#" + superHrana).text("");
            superHrana = null;
            rezultat += 10;
            zmija.unshift(glava);
            $("#"+glava).css("background-color", "yellow");
            $("#trenutni").text("Trenutni: " + rezultat);
            return true;
        }
        return false;

    }

    function proveriKraj() {
        for(let i = 0; i < velicina * velicina; i = i + velicina) { //provera za levu ivicu
            if(zmija[0] == i && smer == -1){
                return true;
            }
        }

        for(let i = velicina - 1; i < velicina * velicina; i = i + velicina) { //provera za desnu ivicu
            if(zmija[0] == i && smer == 1){
                return true;
            }
        }

        for(let i = 0; i < velicina; i++) { //provera za gornju ivicu
            if(zmija[0] == i && smer == 2){
                return true;
            }
        }

        for(let i = velicina * velicina - velicina; i < velicina * velicina; i++) { //provera za donju ivicu
            if(zmija[0] == i && smer == -2){
                return true;
            }
        }

        //provera za telo
        switch(smer) {
            case -1: //kad ide u levo
                if(zmija.includes(zmija[0] - 1)){
                    return true;
                }
                break;
            case 1: //kad ide u desno
                if(zmija.includes(zmija[0] + 1)){
                    return true;
                }
                break;
            case -2: //kad na dole
                if(zmija.includes(zmija[0] + velicina)){
                    return true;
                }
                break;
            case 2: //kad ide na gore
                if(zmija.includes(zmija[0] - velicina)){
                    return true;
                }
                break;
            
        }
        return false;
    }

    function upisRezultata(i) {
        let partija = {
            ime : i,
            rez : rezultat
        };

        let tmp = localStorage.getItem("poslednja");
        if( tmp!= null) {
            partija = JSON.parse(tmp);
            partija.ime = i;
            partija.rez = rezultat;
        } else {
            localStorage.setItem("poslednja", JSON.stringify(partija));
        }
    }

    function pomeriZmiju() {
        let old;
        let next;
        let ime;
        switch(smer){
            case -1: //u levo
                old = zmija[zmija.length-1];
                next = zmija[0] - 1;
                //proveri dal je kraj
                if(proveriKraj() == true){
                    clearInterval(intervalId);
                    clearInterval(superHranaIntervalId);
                    ime = prompt("Unesite Vase ime");
                    upisRezultata(ime);
                    window.location.href = "zmijica-rezultati.html";
                    break;
                }
                if(proveraHrane(next) == true){
                    break;
                }

                //crtanje zmije
                $("#"+old).css("background-color", "blue");
                for(let i=zmija.length-1;i>0;i--){
                    zmija[i] = zmija[i-1];
                    $("#"+zmija[i]).css("background-color", "yellow");
                }
                zmija[0] = next;
                $("#"+zmija[0]).css("background-color", "yellow");          
                break;

            case 1: //u desno
                old = zmija[zmija.length-1];
                next = zmija[0] + 1;
                //proveri dal je kraj
                if(proveriKraj() == true){
                    clearInterval(intervalId);
                    clearInterval(superHranaIntervalId);
                    ime = prompt("Unesite Vase ime");
                    upisRezultata(ime);
                    window.location.href = "zmijica-rezultati.html";
                    break;
                }
                if(proveraHrane(next) == true){
                    break;
                }

                //crtanje zmije
                $("#"+old).css("background-color", "blue");
                for(let i=zmija.length-1;i>0;i--){
                    zmija[i] = zmija[i-1];
                    $("#"+zmija[i]).css("background-color", "yellow");
                }
                zmija[0] = next;
                $("#"+zmija[0]).css("background-color", "yellow");          
                break;

            case -2: //na dole
                old = zmija[zmija.length-1];
                next = zmija[0] + velicina;

                //proveri dal je kraj
                if(proveriKraj() == true){
                    clearInterval(intervalId);
                    clearInterval(superHranaIntervalId);
                    ime = prompt("Unesite Vase ime");
                    upisRezultata(ime);
                    window.location.href = "zmijica-rezultati.html";
                    break;
                }
                if(proveraHrane(next) == true){
                    break;
                }

                //crtanje zmije
                $("#"+old).css("background-color", "blue");
                for(let i=zmija.length-1;i>0;i--){
                    zmija[i] = zmija[i-1];
                    $("#"+zmija[i]).css("background-color", "yellow");
                }
                zmija[0] = next;
                $("#"+zmija[0]).css("background-color", "yellow");          
                break;

            case 2: //na gore
                old = zmija[zmija.length-1];
                next = zmija[0] - velicina;

                //proveri dal je kraj
                if(proveriKraj() == true){
                    clearInterval(intervalId);
                    clearInterval(superHranaIntervalId);
                    ime = prompt("Unesite Vase ime");
                    upisRezultata(ime);
                    window.location.href = "zmijica-rezultati.html";
                    break;
                }
                if(proveraHrane(next) == true){
                    break;
                }

                //crtanje zmije
                $("#"+old).css("background-color", "blue");
                for(let i=zmija.length-1;i>0;i--){
                    zmija[i] = zmija[i-1];
                    $("#"+zmija[i]).css("background-color", "yellow");
                }
                zmija[0] = next;
                $("#"+zmija[0]).css("background-color", "yellow");          
                break;
        }
    }



    $(document).keydown(function(event) {
        switch (event.which) {
          case 37: // Levo
            if(smer==1) return;
            smer = -1;
            if(intervalId == null){
                intervalId = setInterval(pomeriZmiju,vreme);
                superHranaIntervalId = setInterval(postaviSuperHranu,10000);
            }
            break;
          case 38: // Gore
            if(smer==-2) return;
            smer = 2;
            if(intervalId == null){
                intervalId = setInterval(pomeriZmiju,vreme);
                superHranaIntervalId = setInterval(postaviSuperHranu,10000);
            }
            break;
          case 39: // Desno
            if(smer== -1) return;
            smer = 1;
            if(intervalId == null){
                intervalId = setInterval(pomeriZmiju,vreme);
                superHranaIntervalId = setInterval(postaviSuperHranu,10000);
            }
            break;
          case 40: // Dole
            if(smer==2) return;
            smer = -2;
            if(intervalId == null){
                intervalId = setInterval(pomeriZmiju,vreme);
                superHranaIntervalId = setInterval(postaviSuperHranu,10000);
            }
            break;
        }
      });
});