var self = require("sdk/self");
var tabs = require("sdk/tabs");
var cm = require("sdk/context-menu");
var prefs = require("sdk/simple-prefs").prefs;

if(typeof prefs.searchList === "undefined")
	prefs.searchList = "Youtube|https://www.youtube.com/results?search_query=";

var menu = cm.Menu({
	label: "Search Anything...",
	context: cm.SelectionContext(),
	contentScript:	'self.on("context", function(){' +
					'  var text = window.getSelection().toString().trim();' +
					'  if (text.length > 15){ text = text.substr(0, 15) + "..."; }' +
					'  return \'Search Anything for "\' + text + \'"\';' +
					'});' +
					'self.on("click", function(node, data){' +
					'  self.postMessage(data + window.getSelection().toString());' +
					'});',
	onMessage: function(url){
		tabs.open(url);
	}
});

var loadURLs = function(){
	menu.items = [];
	var lines = prefs.searchList.split("\n");
	lines.forEach(function(line, i){
		var pos = line.indexOf("|");
		var title = line.substring(0, pos);
		var url = line.substring(pos+1);
		if(url.search(/^https?:\/\/.*/) === -1)
			url = "http://" + url;
		if(title === "")
			title = url;

		menu.addItem(cm.Item({
			label: title,
			data: url
		}));
	});
}

require("sdk/simple-prefs").on("searchList", loadURLs);
loadURLs();