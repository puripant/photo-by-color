const access_token = "";

let error_margin = 0.05;

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

    var rgb = Vibrant.Util.hexToRgb(color);
    var hue = Vibrant.Util.rgbToHsl(rgb[0], rgb[1], rgb[2])[0];

    d3.json("https://api.instagram.com/v1/users/" + userjson.user.id + "/media/recent?access_token=" + access_token, function(error, photos) {
      for (var i = 0; i < photos.data.length; i++) {
        var url = photos.data[i].images.thumbnail.url;

        var v = new Vibrant(url);
        (function(url) {
          v.getPalette(function(err, palette) {
            for(var p in palette) {
              var h = palette[p].getHsl()[0];
              if (p !== "Vibrant" && h > hue - error_margin && h < hue + error_margin) {
                var div = document.createElement("div");
                div.className = "tile";
                div.id = "tile" + i;
                div.style["background-image"] = "url(" + url + ")"
                tiles.appendChild(div);
                break;
              }
            }
          });
        })(url);
      }
      // console.log(photos.pagination.next_url);
    });
  });
}
