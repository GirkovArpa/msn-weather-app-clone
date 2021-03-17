'use strict';

globalThis.API_KEY = '';
globalThis.WHERE = 'Moscow';

onecall().then(update);

function update() {
  const date = new Date();
  const month = new Intl.DateTimeFormat('en', { month: 'long' }).format(date);
  const day = new Intl.DateTimeFormat('en', { day: 'numeric' }).format(date);
  const time = date.toLocaleString('en', { hour: 'numeric', minute: '2-digit', hourCycle: 'h12' });
  const output = `Updated ${month} ${formatOrdinal(day)}, ${time}`;
  $('.updated').textContent = output;
}

function capitalize(string) {
  return string.toLowerCase().replace(/\b(.)/g, (c) => c.toUpperCase());
}

async function get_location(location) {
  const url = `https://api.openweathermap.org/data/2.5/forecast?units=imperial&q=${location}&appid=${API_KEY}`;
  const resp = await fetch(url);
  const json = await resp.json();
  const { city: { id, name: city, country, coord: { lat, lon } } } = json;
  return { city, country, lat, lon };
}

async function onecall() {
  const data = await get_location(WHERE);
  const { city, country, lat, lon, id } = data;
  $('.location').textContent = `${city}, ${country}`;
  const url = `https://api.openweathermap.org/data/2.5/onecall?units=imperial&lat=${lat}&lon=${lon}&appid=${API_KEY}`;
  const resp = await fetch(url);
  const json = await resp.json();
  const { current, daily, timezone_offset } = json;
  const { temp } = current;
  const panels = $$('.panel');
  daily.forEach((day, i) => {
    const {
      dt: unix_timestamp,
      weather: [{ main: short_description, description, icon }],
      humidity,
      temp: { max: high, min: low },
      wind_speed: wind,
      pop: precipitation
    } = day;
    if (i === 0) {
      const long_date = current_datetime();
      $('.description > span:last-child').textContent = long_date;
      $('.icon-today > img').src = `img/icons/${icon}.png`;
      $('.temp-today').textContent = Math.round(temp);
      $('.description > span').textContent = capitalize(description);
      $('.precipitation').textContent = `Precipitation: ${Math.round(precipitation * 100)}%`;
      $('.wind').textContent = `Wind: ${Math.round(wind)} MPH`;
      $('.humidity').textContent = `Humidity: ${Math.round(humidity)}%`;
      displayStormEffects(id, short_description, icon);
    }
    const panel = panels[i];
    if (!panel) return;
    panel.querySelector('img').src = `img/icons/${icon}.png`;
    const spans = panel.querySelectorAll('span');
    spans[1].textContent = Math.round(high);
    spans[2].textContent = Math.round(low);
    spans[3].textContent = Math.round(precipitation * 100);
    const { short_date } = formateDate(unix_timestamp, timezone_offset);
    spans[0].textContent = short_date;
  });
}

function current_datetime() {
  return new Date()
    .toLocaleString('en-US', {
      weekday: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hourCycle: 'h12'
    });
}

function formateDate(unix_timestamp, timezone_offset) {
  const long_date = new Date((unix_timestamp) * 1000)
    .toLocaleString('en-US', {
      weekday: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hourCycle: 'h12'
    });
  const short_date = new Date((unix_timestamp) * 1000)
    .toLocaleString('en-US', {
      weekday: 'short',
      day: 'numeric',
    });
  return { long_date, short_date };
}

const pr = new Intl.PluralRules('en-US', {
  type: 'ordinal'
});
const suffixes = new Map([
  ['one', 'st'],
  ['two', 'nd'],
  ['few', 'rd'],
  ['other', 'th'],
]);
function formatOrdinal(n) {
  const rule = pr.select(n);
  const suffix = suffixes.get(rule);
  return `${n}${suffix}`;
};