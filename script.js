let places = JSON.parse(localStorage.getItem("places")) || [];
let currentIndex = Number(localStorage.getItem("currentIndex")) || 0;

function showSuggestions() {
  const input = document.getElementById("placeInput").value.trim();
  const list = document.getElementById("suggestionList");

  list.innerHTML = "";

  if (input === "") return;

  const suggestions = getSmartPlaces(input);

  suggestions.forEach(place => {
    const li = document.createElement("li");
    li.textContent = place;

    li.onclick = function () {
      document.getElementById("placeInput").value = place;
      list.innerHTML = "";
    };

    list.appendChild(li);
  });
}

async function addPlace() {
  const input = document.getElementById("placeInput");
  const place = input.value.trim();

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

    const goNext = confirm("You reached this place 🎉\n Go to next place?");

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

let selectIndex = null;

function loadplaces() {
    const list = document.getElementById("placeList");
    list.innerHTML = "";

    places.forEach((place, i) => {
        const li = document.createElement("li");
        li.innerHTML = `<i class="fa-solid fa-location-dot"></i> ${place}`;

        li.ondblclick = function () {
            selectIndex = i;
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
    updateHistoryUI();
    alert("Journey history saved!");
}

// function loadHistory() {

//     const history = JSON.parse(localStorage.getItem("history")) || [];

//     const list = document.getElementById("historyList");
//     list.innerHTML = "";

//     history.forEach((item,index) => {

//         const li = document.createElement("li");
//         li.textContent = `${item.date} - Visited: ${(item.places || []).join(", ")}`;

//         console.log(places);
//         li.onclick = function() {
//             alert("History Clicked");
//         }
//         list.appendChild(li);   
//     });
// }

window.onload = function(){
    document
    .getElementById("placeInput")
    .addEventListener("input", showSuggestions);

    loadplaces();
    // loadHistory();
    updateTime();
    updateHistoryUI();
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
    "Nandi Hills",
    "Wonderla Amusement Park",
    "UB City Mall"
  ],

  chennai: [
    "Marina Beach",
    "Kapaleeshwarar Temple",
    "Mahabalipuram",
    "Fort St. George",
    "Elliot’s Beach",
    "VGP Marine Kingdom",
    "Phoenix Marketcity"
  ],

  ambur: [
    "Ambur Star Biryani",
    "Yelagiri Hills",
    "Jalakandeswarar Temple",
    "Vellore Fort",
    "Government Museum Vellore"
  ],

  vaniyambadi: [
    "Yelagiri Hills",
    "Javadi Hills",
    "Vaniyambadi Masjid",
    "Local Leather Market"
  ],

  vellore: [
    "Vellore Fort",
    "Jalakandeswarar Temple",
    "Golden Temple Sripuram",
    "Yelagiri Hills",
    "Vellore Institute of Technology"
  ],

  hyderabad: [
    "Charminar",
    "Golconda Fort",
    "Ramoji Film City",
    "Hussain Sagar Lake",
    "Birla Mandir"
  ],

  mumbai: [
    "Gateway of India",
    "Marine Drive",
    "Elephanta Caves",
    "Juhu Beach",
    "Bandra-Worli Sea Link"
  ],

  delhi: [
    "Red Fort",
    "India Gate",
    "Qutub Minar",
    "Lotus Temple",
    "Akshardham Temple"
  ],

  mysore: [
    "Mysore Palace",
    "Chamundi Hills",
    "Brindavan Gardens",
    "Mysore Zoo"
  ],

  goa: [
    "Baga Beach",
    "Calangute Beach",
    "Fort Aguada",
    "Dudhsagar Waterfalls",
    "Anjuna Beach"
  ],

  pondicherry: [
    "Rock Beach",
    "Paradise Beach",
    "Auroville",
    "Sri Aurobindo Ashram",
    "Promenade Beach",
    "French Colony Streets"
  ],

  munnar: [
    "Tea Gardens",
    "Eravikulam National Park",
    "Mattupetty Dam",
    "Top Station",
    "Attukal Waterfalls",
    "Echo Point"
  ],

  kerala: [
    "Alleppey Backwaters",
    "Munnar Hills",
    "Wayanad",
    "Kochi Fort",
    "Varkala Beach",
    "Thekkady Wildlife Sanctuary"
  ],

  coimbatore: [
    "Marudamalai Temple",
    "coimbatore Isha Yoga Center",
    "Siruvani Waterfalls",
    "VOC Park",
    "Black Thunder Theme Park"
  ],

  madurai: [
    "Meenakshi Amman Temple",
    "Thirumalai Nayakkar Palace",
    "Gandhi Museum",
    "Alagar Kovil",
    "Vaigai Dam"
  ],

  tirunelveli: [
    "Nellaiappar Temple",
    "Papanasam Falls",
    "Manimuthar Dam",
    "Agasthiyar Falls",
    "Courtallam Waterfalls"
  ]
};
  const input = place.trim().toLowerCase();

  console.log("INPUT:", input);


  if (data[input]) {
    return data[input];
  }


  for (let key in data) {
    if (key.includes(input)) {
      return data[key];
    }
  }

  return [];
}

function updateUI() {
  const list = document.getElementById("placeList");
  list.innerHTML = "";

  places.forEach((place, index) => {
    const div = document.createElement("div");
    div.className = "card";
    div.textContent = place;

    div.onclick = () => showPopup(index);

    list.appendChild(div);
  });
}

let journeyHistory = JSON.parse(localStorage.getItem("history")) || [];


function updateHistoryUI() {
  const historyContainer = document.getElementById("historyList");
  historyContainer.innerHTML = "";

  journeyHistory = JSON.parse(localStorage.getItem("history")) || [];

  journeyHistory.forEach(item => {

    const div = document.createElement("div");
    div.className = "history-card";

    
    const place = item.places && item.places.length > 0 ? item.places[0] : "travel";

    const imageUrl = `https://loremflickr.com/400/300/${encodeURIComponent(place)},landmark`;

    div.style.backgroundImage = `url("${imageUrl}")`;

    const text = document.createElement("span");
    text.textContent = item.places.join(", ") + " • " + item.date;

    div.appendChild(text);
    historyContainer.appendChild(div);
  });
}

