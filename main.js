const access_token = "";

var account = document.querySelector("input.input-account");
var color = document.querySelector("input.input-color");
var tiles = document.querySelector("#tiles");

window.onload = function() { generate(account.value, color.value); };

var verifyAndGenerate = function() {
  if (RegExp("^#[a-fA-F0-9]{6}$").test(color.value.trim())) {
    generate(account.value, color.value);
  }
};
account.onkeyup = verifyAndGenerate;
color.onkeyup = verifyAndGenerate;

function generate(account, color) {
  d3.json("https://www.instagram.com/" + account + "/?__a=1", function(error, userjson) {
    if (error) { return console.log(error); }

    d3.json("https://api.instagram.com/v1/users/" + userjson.user.id + "/media/recent?access_token=" + access_token, function(error, photos) {
      for (var i = 0; i < photos.data.length; i++) {
        var div = document.createElement("div");
        div.className = "tile";
        console.log(photos.data[i].images);
        div.style["background-image"] = "url(" + photos.data[i].images.thumbnail.url + ")"
        tiles.appendChild(div);
      }
      // console.log(photos.pagination.next_url);
    });
  });
}
