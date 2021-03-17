function displayStormEffects(id, desc, icon) {
  hide_effects();
  if (desc === "Rain") {
    if (/light/i.test(weatherDescriptions[id])) {
      show_rain(50);
    } else if (/heavy/i.test(weatherDescriptions[id])) {
      show_rain(200);
    } else {
      show_rain(100);
    }
  }

  if (desc === "Snow") {
    show_snow();
  }

  if (icon === "11d" || icon === "11n") {
    show_lightning();
  }
}

const weatherDescriptions = {
  200: "thunderstorm with light rain",
  202: "thunderstorm with heavy rain",
  211: "thunderstorm",
  221: "ragged thunderstorm",
  231: "thunderstorm with drizzle",
  300: "light intensity drizzle",
  302: "heavy intensity drizzle",
  311: "drizzle rain",
  313: "shower rain and drizzle",
  321: "shower drizzle",
  500: "light rain",
  502: "heavy intensity rain",
  504: "extreme rain",
  520: "light intensity shower rain",
  522: "heavy intensity shower rain",
  600: "light snow",
  602: "Heavy snow",
  612: "Light shower sleet",
  615: "Light rain and snow",
  620: "Light shower snow",
  622: "Heavy shower snow",
  701: "mist",
  721: "Haze",
  741: "fog",
  761: "dust",
  771: "squalls",
  800: "clear sky",
  801: "few clouds",
  802: "scattered clouds",
  803: "broken clouds",
  804: "overcast clouds"
};

function randRange(minNum, maxNum) {
  return (~~(Math.random() * (maxNum - minNum + 1)) + minNum);
}

function show_snow() {
  $('.app').innerHTML += '<div class="snow"></div>';
  show_rain();
  show_lightning();

}

function hide_snow() {
  $('.snow') && $('.snow').remove();
}

function show_rain(nbDrop = 100) {
  for (let i = 1; i < nbDrop; i++) {
    const dropLeft = randRange(0, 530) + 'px';
    const dropTop = randRange(-1000, 1400) + 'px';
    $('.app').innerHTML += '<div class="drop" id="drop' + i + '"></div>';
    const drop = $('#drop' + i);
    drop.style.left = dropLeft;
    drop.style.top = dropTop;
  }
}

function hide_rain() {
  $$('.drop').forEach((drop) => drop.remove());
}

function show_lightning() {
  $('.app').classList.add('lightning');
}

function hide_lightning() {
  $('.app').classList.remove('lightning');
}

function hide_effects() {
  hide_rain();
  hide_snow();
  hide_lightning();
}

