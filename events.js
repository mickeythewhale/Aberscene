var lati, long;
var map;
var data = [];
var events;
var entries;
var marker;
var markers = [];
var today = moment();
var test;

var style = [
    {
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#f5f5f5"
            }
        ]
    },
    {
        "elementType": "labels.icon",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#616161"
            }
        ]
    },
    {
        "elementType": "labels.text.stroke",
        "stylers": [
            {
                "color": "#f5f5f5"
            }
        ]
    },
    {
        "featureType": "administrative.land_parcel",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#bdbdbd"
            }
        ]
    },
    {
        "featureType": "landscape.natural",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "color": "#e6f9e3"
            },
            {
                "saturation": -70
            },
            {
                "weight": 1.5
            }
        ]
    },
    {
        "featureType": "poi",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#eeeeee"
            }
        ]
    },
    {
        "featureType": "poi",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#757575"
            }
        ]
    },
    {
        "featureType": "poi.park",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#e5e5e5"
            }
        ]
    },
    {
        "featureType": "poi.park",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "color": "#e6f9e3"
            }
        ]
    },
    {
        "featureType": "poi.park",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#9e9e9e"
            }
        ]
    },
    {
        "featureType": "road",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#ffffff"
            }
        ]
    },
    {
        "featureType": "road.arterial",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#757575"
            }
        ]
    },
    {
        "featureType": "road.highway",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#dadada"
            }
        ]
    },
    {
        "featureType": "road.highway",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#616161"
            }
        ]
    },
    {
        "featureType": "road.local",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#9e9e9e"
            }
        ]
    },
    {
        "featureType": "transit.line",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#e5e5e5"
            }
        ]
    },
    {
        "featureType": "transit.station",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#eeeeee"
            }
        ]
    },
    {
        "featureType": "water",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#c9c9c9"
            }
        ]
    },
    {
        "featureType": "water",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "color": "#bcd6ff"
            }
        ]
    },
    {
        "featureType": "water",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#9e9e9e"
            }
        ]
    }
];

function main(){
    $.getJSON( "fb_events.json", function(d){
        data = d;
    });

    initMap();
    getData();
}

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 57.145, lng: -2.10},
        zoom: 13,
        styles: style
    });
}

function setMarker(title, cat, scat, website, events, location, fb, rating){
    var url = website;
    fb = "https://www.facebook.com" + fb.slice(0,-6);

    var mcolor = "white";
    var icon;
    if(cat === "Entertainment") {   mcolor = 'rgb(255, 91, 73)';    icon = "fas fa-music";}
    if(cat === "Dining") {          mcolor = 'rgb(214, 126, 252)';  icon = "fas fa-utensils";}
    if(cat === "Accommodation") {   mcolor = 'rgb(216, 198, 69)';   icon = "fas fa-bed";}
    if(cat === "Sports") {          mcolor = 'rgb(247, 134, 74)';   icon = "fas fa-basketball-ball";}
    if(cat === "Culture") {         mcolor = 'rgb(135, 209, 138)';  icon = "fas fa-university";}
    if(cat === "Professional") {    mcolor = 'rgb(149, 153, 150)';  icon = "fas fa-briefcase";}

    icon = "<i class='"+ icon + "'></i>&nbsp;&nbsp;&nbsp;";

    colorCat(cat,mcolor);

    lati = location.split(',')[0];
    long = location.split(',')[1];

    var marker1 = new google.maps.LatLng(lati, long);

    marker = new google.maps.Marker({
        position: marker1,
        title: title,
        map: map,
        icon: pinSymbol(mcolor, 0.6),
        opacity: 1
    });

    var stars="";
    if(rating==0){
        stars = '<i class="far fa-star"></i><i class="far fa-star"></i><i class="far fa-star"></i>';
    } else if(rating==1){
        stars = '<i class="far fa-star"></i><i class="far fa-star"></i><i class="fas fa-star"></i>';
    } else if(rating==2){
        stars = '<i class="far fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i>';
    } else {
        stars = '<i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i>';
    }

    stars = '<div class="stars" style="float:right;" onclick="' +
        '$(\'#add\').hide();' +
        '$(\'#rating\').show();' +
        '$(\'#rating_name\').html(\'' + title + '\');">'+ stars + '</div>';


    var close = '<a href="#" style="margin-top:-1em;color:black;padding:0 3px;' +
        'text-decoration:none;float:right;" onclick="$(\'#info\').hide();"><i class="fas fa-times"></i></a><br>';
    var header = close;
    header = header + "<div style='background:linear-gradient(to right, " + mcolor + "," + mcolor + ");'" + "><h5 style='font-weight:lighter;padding:0.5em;color:white;'>";
    header = header + icon + cat + " - " + scat + "</h5></div>";
    header = header + "<h4 style='padding-top: 0.4em;padding-left:0.3em; font-weight:normal;'>" + title + stars + "</h4></div>";
    header = header + "<hr class='style14'><div style='padding:0.5em;clear:both;'>";

    var address = "Google Maps";
    var surl = "https://www.google.com/maps/search/" + title + "+aberdeen+uk";

    website = "<div id='streetview' style='height: 150px'></div>";
    website = website + "<hr class='style14' style='margin-top:2em;'><p style='margin-top:2em;' align='center'><a target='_blank' href='" + url + "'><i class='fas fa-globe'></i>&nbsp;Website&nbsp;&nbsp;</a>";
    website = website + "<a target='_blank' href='"+ fb + "'><i class='fab fa-facebook-square'></i>&nbsp;Facebook&nbsp;&nbsp;</a>";
    website = website + "<a target='_blank' href='" + surl + "'><i class='fas fa-map-marker'></i>&nbsp;"+ address + "</p></div>";

    marker.addListener('click', function () {

        var e = [];
        $(events).each(function() {
            var event_link = "<a target='_blank' href='https://www.google.co.uk/search?q=" + this.n+"+" + title + "'>" + this.n + "</a>";
            var dt = "<div class='event_names'><i class=\"fas fa-caret-right\"></i> <font color='#565656'>" + moment(this.date).format("DD/MM/YYYY") + "</font><h6>" + event_link + "</h6></div>";
            e.push(dt);
        });
        e = "<div> " + e.join('<br>') + "</div>";

        $("#info").html('<div style="position:relative;" id="infobox_content">' + header + e + website).show();

        var isMobile = window.matchMedia("only screen and (max-width: 768px)");
        if (isMobile.matches) {
            var h = $(document).height() - $(".navi").height();
            $("#info").css("height", h);
            $("#info").css("width", "100%");
            $("#info").css("margin", 0);
        } else {
            var h = ($(document).height() - $(".navi").height())/100;
            h = h * 100;
            $("#info").css("height", h);
        }

        $("#info").ready(function () {

            $(".event_names > svg").css("color", mcolor);

            // streetview
            var map2 = new google.maps.Map(document.getElementById('streetview'), {
                center: marker1,
                zoom: 1,
                streetViewControl: true
            });
            try {
                var img = new google.maps.StreetViewPanorama(
                    document.getElementById('streetview'),
                    {
                        position: marker1,
                        zoom: 1,
                        motionTracking: false
                    });
                map2.setStreetView(img);
            } catch(error) {
                console.log(error);
            }
        });
    });

    if(events.length <1) {marker.opacity=0.3;}
    var test = new createMarkers(cat,scat,marker,events);
    markers.push(test);

}


function getData(){
    var spreadsheetID = "1laOX2_2aeSDz3H8lP7U8W_ohgeK39Ye1J3X-Q-_hsDU";
    var url = "https://spreadsheets.google.com/feeds/list/" + spreadsheetID + "/od6/public/values?alt=json";

    $.getJSON(url, function(data) {
        entries = data.feed.entry;
        entries = $.grep(entries, function(n) {
            var x = n.gsx$location.$t;
            var y = n.gsx$facebook.$t;
            return x.length > 0 && y.length > 0;
        });

        fillMap(entries);
    });
}

function fillMap(e){

    $(e).each(function(){
       var t = new URL(this.gsx$facebook.$t).pathname;
       this.gsx$facebook.$t = t + 'events';
       var fb = this.gsx$facebook.$t;

       var title = this.gsx$name.$t;
       var loc = this.gsx$location.$t;
       var cat = this.gsx$cat.$t;
       var scat = this.gsx$subcat.$t;
       var website = this.gsx$website.$t;
       var rating = this.gsx$rating.$t;

       $(data).each(function(){
            if(this.name===title){
                var events = [];
                $(this.events).each(function(){
                    var date = this.date;
                    var address = this.location;
                    var title = this.title;
                    var desc1 = "test test test test";

                    if(moment(date) < today){
                        // nothing
                    } else {
                        var test = new event(date, title, desc1, address);
                        events.push(test);
                    }
                });

                setMarker(title, cat, scat, website, events, loc, fb,rating);
            }
       });
    });
}

$(document).ready(function () {
    $(".gm-svpc").hide();
    $('#clear').hide();

    var p = $('#clear');
    p.css('position', 'absolute');
    var newCoords = {
        top: $('.navbar-brand').height() + 40,
        left: p.position().left
    };
    p.offset(newCoords);

    $(".navbar-brand").click(function() {
        var id = "clear";
        filterMap(id);
    });

    $(".nav-link").click(function() {
        $("#clear").show();
        var id = $.trim($(this).text());
        if($(this).find('div').attr("id") !== "reportrange"){
            filterMap(id);
        }
    });

    $(".dropdown-item").click(function() {
        var id = $(this).text();
        $("#clear").show();
        $('.navbar-collapse').collapse('hide');
        filterMap(id);
    });

    $("#search_form").submit(function(e) {
        e.preventDefault();
        $("#clear").show();
        $('.navbar-collapse').collapse('hide');
        mySearch();
    });

    $("#clear").click(function () {
        $(this).hide();
    });

    daterange();

    $("#cat").change(function () {
        var subcats = [];
        var str = $("#cat option:selected").text();

        $(markers).each(function () {
            if(str===this.category){
                subcats.push(this.subcategory);
            }
        });
        subcats = jQuery.unique(subcats);

        $('#subcat option').each(function() {
            $(this).remove();
        });

        subcats.forEach( function(s){
            $('#subcat').append($('<option>', {
                value: s,
                text: s
            }));
        });

    }).change();

});


function filterDates(start, end){

    $(".nav-link").each(function () {
        if($(this).css("font-weight") == 700){
            var f1 = $.trim($(this).text());
            filterMap(f1);
        }
    });

    for (var i = 0; i < markers.length; i++) {
        if(markers[i].events.length > 0 && checkFilter(i)){
            $(markers[i].events).each(function () {
                var d = moment(this.date);
                if(d >= start && d <= end){
                    markers[i].marker.setVisible(true);
                    $("#clear").show();
                    return false;
                } else {
                    markers[i].marker.setVisible(false);
                    return true;
                }
            });
        } else {
            markers[i].marker.setVisible(false);
        }
    }

    var keyword = document.getElementById('search_box').value.toLowerCase();
    if(keyword.length>0){
        mySearch();
    }

}

function filterMap(id) {

    $("#info").hide();

    $(".nav-link").each(function () {
        if($.trim($(this).text())===id){
            $(this).css("font-weight", 700);
        } else {
            $(this).css("font-weight", "normal");
        }
    });

    if (id === "clear") {
        $('#search_box').val("");
        $("#clear").hide();
        cb(moment(), moment().endOf('month'));
    }

    for (var i = 0; i < markers.length; i++) {

        var cf = checkFilter(i);
        var cat = markers[i].category;
        var subcat = markers[i].subcategory;

        if (id === "clear") {
            markers[i].marker.setVisible(true);
            continue;
        }

        if (( cat === id || subcat === id) && cf === true) {
            continue;
        }

        if (( cat === id || subcat === id) && cf === false) {
            markers[i].marker.setVisible(true);
            continue;
        }

        if ( cat !== id && cf === true) {
            markers[i].marker.setVisible(false);
        }

        if ( subcat !== id && cf === true) {
            markers[i].marker.setVisible(false);
        }
    }
}

function createMarkers(category, subcategory, marker, events) {
    this.category = category;
    this.subcategory = subcategory;
    this.marker = marker;
    this.events = events;
}

function event(date, n, desc, address){
    this.date = date;
    this.n = n;
    this.desc = desc;
    this.address = address;
}

function mySearch(){

    $("#info").hide();
    $("#clear").show();
    //$("a.nav-link.dropdown-toggle").css("font-weight", "normal");

    var keyword = document.getElementById('search_box').value.toLowerCase();

    if(keyword.length > 2){
        for (var i = 0; i < markers.length; i++) {
            if(markers[i].events.length > 0 && checkFilter(i)){
                $(markers[i].events).each(function(){
                    var test = this.n + markers[i].marker.title;
                    test = strip(test).toLowerCase().replace(/[^\w\s]/gi, '').trim();
                    if(test.indexOf(keyword) !== -1){
                        markers[i].marker.setVisible(true);
                        return false;
                    } else {
                        markers[i].marker.setVisible(false);
                        return true;
                    }
                });
            } else {
                var test = markers[i].marker.title;
                test = test.toLowerCase();
                if (test.indexOf(keyword) !== -1) {
                    continue;
                } else {
                    markers[i].marker.setVisible(false);
                }
            }
        }
    }
}

function checkFilter(x){
    return markers[x].marker.visible;
}

function strip(html) {
    var tmp = document.createElement("DIV");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
}

Array.prototype.unique = function() {
    return this.filter(function (value, index, self) {
        return self.indexOf(value) === index;
    });
};

function pinSymbol(color,size) {
    return {
        path: 'M0-48c-9.8 0-17.7 7.8-17.7 17.4 0 15.5 17.7 30.6 17.7 30.6s17.7-15.4 17.7-30.6c0-9.6-7.9-17.4-17.7-17.4z',
        fillColor: color,
        fillOpacity: 1,
        strokeColor: '',
        strokeWeight: 0,
        scale: size
    };
}

function colorCat(a,color){
    //$("#" + a).css("border-bottom", "solid " + color);
    $("#" + a + " > svg").css('color', color);
}

function daterange(){
    var start = moment();
    var end = moment().endOf('month');

    $('#reportrange').daterangepicker({
        startDate: start,
        endDate: end,
        locale: {
            "format": "DD/MM/YY",
            "separator": " - ",
            "applyLabel": "Apply",
            "cancelLabel": "Cancel",
            "fromLabel": "From",
            "toLabel": "To",
            "customRangeLabel": "Custom",
            "weekLabel": "W",
            "daysOfWeek": [
                "Mo",
                "Tu",
                "We",
                "Th",
                "Fr",
                "Sa",
                "Su"
            ],
            "firstDay": 0
        },
        ranges: {
            'Today': [moment(), moment()],
            'Tomorrow': [moment().add(1, 'days'), moment().add(1, 'days')],
            'This Week': [moment(), moment().endOf('week')],
            'Next Week': [moment().add(1,'week').startOf('week'), moment().add(1,'week').endOf('week')],
            'This Month': [moment(), moment().endOf('month')],
            'Next Month': [moment().add(1, 'month').startOf('month'), moment().add(1, 'month').endOf('month')]
        }
    }, cb);

    cb(start, end);
}

function cb(start, end) {
    $('#reportrange').find('span').html(start.format('D/M') + ' - ' + end.format('D/M/YYYY'));
    $("#info").hide();
    //alert(start+"-"+end);
    filterDates(start,end);

}

/*
function getPhotos(searchTerm, callback){
    var searchUrl = 'https://www.googleapis.com/customsearch/v1?' +
                    '&q=' + encodeURIComponent(searchTerm) +
                    '&cx=' + '013802545209530999668:9xg0q9hjask' +
                    '&imgSize=medium' +
                    '&num=3' +
                    '&key=AIzaSyApTvTwhzrDL5KuyNJAukTGCkDE6hOudVI';

    var x = new XMLHttpRequest();
    x.open('GET', searchUrl);
    x.responseType = 'json';
    x.onload = function() {
        var response = x.response;
        if (!response) {
            console.log( "loading error" )
            console.log(response)
        }
        callback(response);
    };

    x.onerror = function() {console.log("network error");};
    x.send();
}

function getAddress(location,callback) {
    // reverse geo coding
    var geocoder = new google.maps.Geocoder;
    var latlngStr = location.split(',', 2);
    var latlng = {lat: parseFloat(latlngStr[0]), lng: parseFloat(latlngStr[1])};
    geocoder.geocode({'location': latlng}, function(results, status) {
        if (status === 'OK') {
            callback(results[0].formatted_address);
        } else {
            callback(false);
        }
    });
}
*/

function calExport(name, loc, begin, end) {
    var cal = ics();
    cal.addEvent(name, "...", loc, begin, end);
    cal.download();
}

function clean(str) {
    return str.replace(/[^0-9a-z-A-Z ]/g, "").replace(/ +/, " ")
}