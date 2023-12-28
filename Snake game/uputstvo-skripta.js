$(document).ready(function() {

    $("#igraj").click(function () {
      tab = $("input[name='tabla']:checked").val();
      tez = $("input[name='tezina']:checked").val();
      specifikacije={
        tabla : tab,
        tezina : tez
      }
      localStorage.setItem("postavka",JSON.stringify(specifikacije));
      window.location.href = "zmijica-igra.html";
    })

    $("#rezultati").click(function () {
      localStorage.removeItem("poslednja");
      window.location.href = "zmijica-rezultati.html";
    })
  });
  