fetch("https://www.prevision-meteo.ch/services/json/lat=46.259lng=5.235")
  .then(function (res) {
    if (res.ok) {
      return res.json();
    }
  })
  .then(function (value) {
    console.log(value);
  })
  .catch(function (err) {
    alert("une erreur est survenu!");
  });