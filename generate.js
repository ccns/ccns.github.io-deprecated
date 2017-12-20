const ejs = require("ejs");
const fs  = require("fs");
const moment  = require("moment");
const request = require("request");
moment.locale("zh-tw");

// const events = require("./test/events.json");
const events_url = "https://ccns.kktix.cc/events.json";

const template_file = "./index.ejs";

request.get(events_url, (error, response, body) => {
  if (!error && response.statusCode == 200) {
    var events = JSON.parse(body);
    var entry = events.entry.map((e) => {
      var content = e.content;
      var spl = content.split('\n');
      var time_origin = spl[0].split('：')[1].split('~')[0];
      var place = spl[1].split('：')[1].split('/')[0];

      var time = moment(time_origin, "YYYY/MM/DD HH:mm(Z)").format("YYYY年M月D日 Ah點");

      e.time = time;
      e.place = place;
      return e;
    })

    ejs.renderFile(template_file, {entry: entry}, null, (err, html) => {
      // console.log(html);
      fs.writeFileSync("./index.html", html, 'utf8');
    });
  } else {
    console.log("Failed to fetch events.");
  }
});
