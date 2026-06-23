const search = document.getElementById("search");

search.addEventListener("input", () => {

const filtre = search.value.toLowerCase();

const cartes = document.querySelectorAll(".anime-card");

cartes.forEach(carte => {

const titre = carte.querySelector("h2").textContent.toLowerCase();

if(titre.includes(filtre)){
carte.style.display = "block";
}else{
carte.style.display = "none";
}

});

});
