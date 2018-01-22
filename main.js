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

    var count = 0;
    var times = 0;
    var callback = function(error, photos) {
      for (var i = 0; i < photos.data.length; i++) {
        var url = photos.data[i].images.thumbnail.url;

        (function(url) { RGBaster.colors(url, {
          success: function(payload) {
            var rgb = payload.dominant.match(/\d+/g);
            var hex = Vibrant.Util.rgbToHex(+rgb[0], +rgb[1], +rgb[2]);
            var diff = Vibrant.Util.hexDiff(color, hex); //CIE delta E 1994 diff: <= 10 is good

            if (diff <= 15) {
              var div = document.createElement("div");
              div.className = "tile";
              div.id = "tile" + i;
              div.style["background-image"] = "url(" + url + ")"
              tiles.appendChild(div);

              count++;
            }
          }
        }) })(url);
      }
      if (count < 15 && times < 10) {
        d3.json(photos.pagination.next_url, callback);
      }
      times++;
    };
    d3.json("https://api.instagram.com/v1/users/" + userjson.user.id + "/media/recent?access_token=" + access_token, callback);
  });
}
