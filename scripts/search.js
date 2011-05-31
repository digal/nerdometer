/* This program is free software. It comes without any warranty, to
 * the extent permitted by applicable law. You can redistribute it
 * and/or modify it under the terms of the Do What The Fuck You Want
 * To Public License, Version 2, as published by Sam Hocevar. See
 * http://sam.zoy.org/wtfpl/COPYING for more details. */

google.load('visualization', '1', {'packages':['corechart']});
var queryType="search";

var onYarr = function(type){
    return function() {
        var searchTerm = $('#term')[0].value.trim();
        if (!searchTerm) {
            return;
        }
        if (history && 'pushState' in history) {
            window.location.hash = ['/'+type+'/', searchTerm].join('');
        }
    };
};

var types = {
    "search" : {
        "title" : "twitter search query",
        "icon" : "url(images/search.png) no-repeat 5px 5px",
        "handler" : onYarr("search")
    },
    "user" : {
        "title" : "user's tweets",
        "icon" : "url(images/@.png) no-repeat 5px 5px",
        "handler" : onYarr("user")
    }
};

//extract source
var resMap = function(item) {
    return item.source;
};

//reduce to map of counts
var resReduce = function(counts, source) {
    counts[source] = (counts[source] || 0) + 1;
    return counts;
};

var unescapeHTML = function(html) {
   var htmlNode = document.createElement("DIV");
   htmlNode.innerHTML = html;
   if(htmlNode.innerText !== undefined)
      return htmlNode.innerText; // IE
   return htmlNode.textContent; // FF
};

var cleanStr = function(html) {
    return unescapeHTML(html).replace(/<.*?>/, "").replace(/<.*?>/, "");
};


var doUser = function(username) {
    $('#term').attr('value', username);

    //do nothin'
};

var doSearch = function(searchTerm) {
    $('#term').attr('value', searchTerm);
    $('#btnSearch').attr('disabled', 'disabled');
    $('#chartInner').hide();
    $('#loader').show();

    var searchURL = "http://search.twitter.com/search.json?q="+encodeURIComponent(searchTerm)+"&rpp=100&callback=?";
    $.getJSON(searchURL, function(json) {
        $('#btnSearch')[0].removeAttribute('disabled');

        var title = "Client stats for \""+searchTerm+"\"";

        var countMap = _(json.results)
            .chain()
            .map(resMap)
            .reduce(resReduce, {})
            .value();

        var array = _(countMap)
            .chain()
            .keys()
            .map(function(key) { return [cleanStr(key), countMap[key]]; })
            .toArray()
            .value();

        draw(array, title);
    });
};

var draw = function(array, title) {
    // Create our data table.
    var data = new google.visualization.DataTable();
    data.addColumn('string', 'Client');
    data.addColumn('number', 'Number');
    data.addRows(array);

    // Instantiate and draw our chart, passing in some options.
    $('#loader').hide();
    $('#chartInner').show();
    var chart = new google.visualization.PieChart($('#chartInner')[0]);
    chart.draw(data, {width: 800, height: 450, title: title, is3D: true});
};

var clear = function() {
    $('#loader').hide();
    $('#chartInner').hide();
};


var swapType = function() {
    if (queryType == "search") {
        setType("user")
    } else {
        setType("search")
    }
};

var setType = function(type) {
    queryType = type;
    $('#type').text(types[queryType].title);
    $('#term').css("background", types[queryType].icon);
    $('#btnSearch').unbind('click');
    $('#btnSearch').bind('click', types[queryType].handler);
};
