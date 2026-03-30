let places = JSON.parse(localStorage.getItem("places")) || [];
let currentIndex = Number(localStorage.getItem("currentIndex")) || 0;

async function addPlace() {
  const input = document.getElementById("placeInput");
  const place = input.value;

  if (place === "") return;

  const suggestions = getSmartPlaces(place);

  alert("Suggestions:\n" + suggestions.join("\n"));

  places.push(place);
  localStorage.setItem("places", JSON.stringify(places));

  input.value = "";
  loadplaces();
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

let selectIndex = i;

function loadplaces() {
    const list = document.getElementById("placeList");
    list.innerHTML = "";

    places.forEach((place, i) => {
        const li = document.createElement("li");
        li.innerHTML = `<i class="fa-solid fa-location-dot"></i> ${place}`;

        li.ondblclick = function () {
            selectedIndex = i;
            document.getElementById("popupText").textContent = place;
            document.getElementById("popup").style.display = "block";
        };

        list.appendChild(li);
    });
}

function closePopup() {
    document.getElementById("popup").style.display = "none";
}

function editPlace() {
    const newPlace = prompt("Edit place:", places[selectIndex]);
    if (newPlace) {
        places[selectIndex] = newPlace;
        localStorage.setItem("places", JSON.stringify(places));
        loadplaces();
    }
    closePopup();
}

function deletePlace() {
    const confirmDelete = confirm("Delete this place?" + places[selectIndex]);
    if (confirmDelete) {
        removePlace(selectIndex);
    }
    closePopup();
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

        console.log(places);
        li.onclick = function() {
            alert("History Clicked");
        }
        list.appendChild(li);   
    });
}
window.onload = function(){
    loadplaces();
    loadHistory();
    updateTime();
}
if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("service-worker.js")
    .then(() => console.log("Service Worker Registered"));
}

async function getAIPlaces(place) {
  try {
    const res = await fetch("http://localhost:5000/ai-places", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ place })
    });

    const data = await res.json();

    console.log("AI RESPONSE:", data); 

    return data.result;

  } catch (error) {
    console.error("AI Error:", error);
    return "Failed to get AI suggestions";
  }
}

function getSmartPlaces(place) {
  const data = {
    bangalore: [
      "Lalbagh Botanical Garden",
      "Cubbon Park",
      "Bangalore Palace",
      "ISKCON Temple",
      "Nandi Hills"
    ],
    chennai: [
      "Marina Beach",
      "Kapaleeshwarar Temple",
      "Mahabalipuram",
      "Fort St. George",
      "Elliot’s Beach"
    ],
    ambur: [
      "Ambur Star Biryani",
      "Yelagiri Hills",
      "Jalakandeswarar Temple",
      "Vellore Fort"
    ]
  };

  return data[place.toLowerCase()] || ["No suggestions found"];
}