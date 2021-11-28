console.log("script connected.");

var heart_status = 0; // 0 is empty and 1 is filled
var date = new Date();
var year = date.getFullYear();
var month = date.getMonth();
var day = date.getDate();
var url = "";

const previousDate = (year, month, day) => {
  if (day - 1 < 1) {
    month -= 1;
  } else {
    day -= 1;
  }
  return [year, month, day];
};

const dateToString = (year, month, day) =>
  String(year) + "-" + String(month) + "-" + String(day);

document.getElementById("heart-button").addEventListener("click", () => {
  let heart = document.getElementById("heart-button");
  if (heart_status == 0) {
    heart.src = "static/heart-filled.png";
    heart_status = 1;
    // TODO: update the database and mark this image as a favorite image.
    console.log(dateToString(year, month, day));
    
    //fetch post request
    fetch("http://localhost:8080/api/add", {
      method: "POST",
      body: JSON.stringify({ 
        date: dateToString(year, month, day), 
        image_url: url,
      }),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      }
    });
  } else {
    heart_status = 0;
    heart.src = "static/heart.png";
    // TODO: update the database and un-mark this image as a favorite image.
    fetch("http://localhost:8080/api/delete", {
      method: "DELETE",
      body: JSON.stringify({ 
        date: dateToString(year, month, day), 
        image_url: url,
      }),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      }
    });
  }
});

document.getElementById("next-button").addEventListener("click", () => {
  document.getElementById("heart-button").src = "static/heart.png";
  heart_status = 0;
  [year, month, day] = previousDate(year, month, day);
  fetch(
    //"https://api.nasa.gov/planetary/apod?api_key=xRSoeMQHQJ5IiKwhHnOYfppEE05ADhjDFg18Qdwx&date="
    "https://api.nasa.gov/planetary/apod?api_key=beVFe401HH90nM6CH0Tv11UfkInzKqvBEOakK6Ws&date=" +
      dateToString(year, month, day)
  )
    .then((r) => r.json())
    .then((r) => {
      console.log("current APOD data:");
      console.log(r);
      console.log(r.url);
      document.getElementById("apod-date").innerHTML = r.date;
      document.getElementById("apod-image").src = r.url;
      document.getElementById("apod-title").innerHTML = r.title;
      document.getElementById("apod-p").innerHTML = r.explanation;
      url = r.url
    });
});
