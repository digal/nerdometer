google.load('visualization', '1', {'packages':['corechart']});

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

var doSearch = function() {
    $('#btnSearch').attr('disabled', 'disabled');
    $('#chartInner').hide();
    $('#loader').show();
    var searchTerm = $('#term')[0].value;
    var searchURL = "http://search.twitter.com/search.json?q="+encodeURIComponent(searchTerm)+"&rpp=100&callback=?";
    $.getJSON(searchURL, function(json) {
        $('#btnSearch')[0].removeAttribute('disabled');

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

        draw(array);
    });
};

var draw = function(array) {
    // Create our data table.
    var data = new google.visualization.DataTable();
    data.addColumn('string', 'Client');
    data.addColumn('number', 'Number');
    data.addRows(array);

    // Instantiate and draw our chart, passing in some options.
    $('#loader').hide();
    $('#chartInner').show();
    var chart = new google.visualization.PieChart($('#chartInner')[0]);
    chart.draw(data, {width: 800, height: 450});
};