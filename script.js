let places = JSON.parse(localStorage.getItem("places")) || [];
let currentIndex = Number(localStorage.getItem("currentIndex")) || 0;

function addPlace() {
  const input = document.getElementById("placeInput");
  const place = input.value;

  if (place === "") return;

  places.push(place);

  const li = document.createElement("li");
  li.textContent = place;
  document.getElementById("placeList").appendChild(li);

  input.value = "";
  localStorage.setItem("places", JSON.stringify(places));
  updateTime();
}

function openMap(place) {
  const url = "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(place);
  window.location.href = url;
}

function startJourney() {
  if (places.length === 0) {
    alert("Add places first!");
    return;
  }
  currentIndex = 0;
  localStorage.setItem("currentIndex", currentIndex);
  document.getElementById("progress").textContent = `Visiting: ${currentIndex + 1} / ${places.length}`;

  openMap(places[currentIndex]);
}

function updateTime() {

const totalPlaces = places.length;
const totalTime = totalPlaces * 1;

  document.getElementById("timeInfo").textContent = `Total places: ${totalPlaces}, Estimated time: ${totalTime} hours`;
}

function nextPlace() {

  if (currentIndex < places.length - 1) {

    const goNext = confirm("You reached this place 🎉\nGo to next place?");

    if(goNext) {
        currentIndex++;

    localStorage.setItem("currentIndex", currentIndex);
    openMap(places[currentIndex]);

console.log(currentIndex);

  document.getElementById("progress").textContent =  `Visiting: ${currentIndex + 1} / ${places.length}`;
    }else {
        alert("Journey paused. You can resume later.");
    }       
} else {
    const done = confirm("Journey completed!)\nDo you want to save this journey history?");
  if(done){
    saveHistory();
  }
}
}

function loadplaces() {
    const list = document.getElementById("placeList");
    list.innerHTML = "";

    for(let i = 0; i < places.length; i++) {
        const li = document.createElement("li");
        li.textContent = places[i];
        li.onclick = function() {
            const confirmDelete = confirm("Do you want to delete this place?");
            if(confirmDelete) {
                removePlace(i);
            }
        };
        list.appendChild(li);
    }
}

function removePlace(index) {

    places.splice(index, 1);
    localStorage.setItem("places", JSON.stringify(places));
    loadplaces();
}

function saveHistory() {
    const history = JSON.parse(localStorage.getItem("history")) || [];

    const entry = {
    places: [...places], 
    date: new Date().toLocaleString()
};

    history.push(entry);
    localStorage.setItem("history", JSON.stringify(history));

    localStorage.removeItem("places");
    localStorage.removeItem("currentIndex");
    places = [];
    currentIndex = 0;

    loadplaces();
    updateTime();

    document.getElementById("progress").textContent = "";
    alert("Journey history saved!");
}

function loadHistory() {

    const history = JSON.parse(localStorage.getItem("history")) || [];

    const list = document.getElementById("historyList");
    list.innerHTML += "";

    history.forEach((item,index) => {

        const li = document.createElement("li");
        li.textContent = `${item.date} - Visited: ${(item.places || []).join(", ")}`;

        li.onclick = function() {
            loadJourneyFromHistory(item);
        }
        list.appendChild(li);   
    });
}
window.onload = function(){
    loadplaces();
    loadHistory();
    updateTime();
}