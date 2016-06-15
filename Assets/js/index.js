function getget(){
	var strUrl = location.search;
	var getPara, ParaVal;
	var aryPara = [];

	if (strUrl.indexOf("?") != -1) {
		var getSearch = strUrl.split("?");
	    getPara = getSearch[1].split("&");

	    for (i = 0; i < getPara.length; i++) {
	      ParaVal = getPara[i].split("=");
	      aryPara.push(ParaVal[0]);
	      aryPara[ParaVal[0]] = ParaVal[1];
	    }
	    return aryPara[0];
	}
}

function getjson(name,name2,type){
  $.getJSON(name, function(geodata){
	  getjson2(geodata,name2,type);
  });
}

function getjson2(geodata,name,type){
	$.getJSON(name, function(resdata){
		initialize(geodata,resdata,type);
	});
}

function getjson2Again(name,type){

	$.getJSON(name, function(resdata){
		if(name == "Assets/json/ragi/sum.json"){
			console.log('update limit to 2800000*46');
			updatemap(circles,resdata,type,gMap.getZoom(),scale=0.0001,limit=2800000*46);
		}
		else
			updatemap(circles,resdata,type,gMap.getZoom());
	});
}

function getpopulation(target,res,type,limit){
	//var limit = 2800000;
	if(type == "total"){
		for(a in res.STATION){
			if(res.STATION[a] == target.Orgname){
				if(res.ENTRIES[a] < 0 || res.ENTRIES[a] > limit){
					console.log('exceed ' + res.ENTRIES[a] + " > " + limit );
					res.ENTRIES[a] = 0;
				}
				if(res.EXITS[a] < 0 || res.EXITS[a] > limit) res.EXITS[a] = 0;
				break;
			}
		}
		if(res.STATION[a] != target.Orgname){
			console.log(target.Orgname + " Not Supported.");
			return -1;
		}
		return parseInt(res.EXITS[a]) + parseInt(res.ENTRIES[a]);
	}
	else if(type == "entries"){
		for(a in res.STATION){
			if(res.STATION[a] == target.Orgname){
				if(res.ENTRIES[a] < 0 || res.ENTRIES[a] > limit) res.ENTRIES[a] = 0;
				break;
			}
		}
		if(res.STATION[a] != target.Orgname){
			console.log(target.Orgname + " Not Supported.");
			return -1;
		}
		return parseInt(res.ENTRIES[a]);
	}
	else if(type == "exits"){
		for(a in res.STATION){
			if(res.STATION[a] == target.Orgname){
				if(res.EXITS[a] < 0 || res.EXITS[a] > limit) res.EXITS[a] = 0;
				break;
			}
		}
		if(res.STATION[a] != target.Orgname){
			console.log(target.Orgname + " Not Supported.");
			return -1;
		}
		return parseInt(res.EXITS[a]);
	}
	else{
		console.log('Err');
		return 0;
	}
}

function initialize(citymap,res,type) {
  //var scale = 0.001;

  var zoomScale = 11;

  var mapOptions = {
    center: { lat: 40.7531791, lng: -73.90907789999999},
    zoom: zoomScale
  };
  var map = new google.maps.Map(
      document.getElementById('map-canvas'),
      mapOptions);
  gMap = map;

  updatemap(citymap,res,"init",zoomScale);
} // end of function initialize()
function setInfo(a,info){
	gMarker[a].addListener('click', function() {
	   info.open(gMap, this);
	});
}
function updatemap(citymap,res,type,zoomScale,scale=0.001,limit=2800000*2){

	//var scale = 0.001;
	console.log("{ scale : " + scale + ", limit : " + limit + " }" );

	gValueMax = 0;
	var tmpTen = [0,0,0,0,0,0,0,0,0,0];
	var kolor;

	if(type == "init"){
		scale = 0.015;
		type = "total";
	}

	if(type == "total" )
		kolor = '#00FF00';
	else if(type == "entries")
		kolor = '#FF0000';
	else
		kolor = '#0000FF';

	gMap.setZoom(zoomScale);

	if(circles.length == 0){
		console.log('hello there, prepare to initialize.');
		for (var city in citymap) {
				// Add the circle for this city to the map.
				var geo = {'lat': parseFloat(citymap[city].lat),'lng':parseFloat(citymap[city].lng)};

				var rad = getpopulation(citymap[city],res,type,limit);
				if(rad == -1) continue;

				var cityCircle = new google.maps.Circle({
				  Orgname: citymap[city].Orgname,
				  strokeColor: '#000000',
				  strokeOpacity: 0.5,
				  strokeWeight: 2,
				  fillColor: kolor,//'#FF0000',
				  fillOpacity: 0.35,
				  map: gMap,
				  center: geo,
				  radius:  rad * scale, // to be determined
				  id: city
				});
				circles.push(cityCircle);

				if(rad > gValueMax){
					var i = 9;
					while(i >=0 && tmpTen[i] < rad)
						++i;
					for(var j=i+1;j < 9; ++j)
						tmpTen[j+1] = tmpTen[j] ;
					tmpTen[i+1] = rad;
					gValueMax = tmpTen[9];
				}

				var contentString =
					'<div style="width:200px;"><div>' + cityCircle.Orgname + '</div>' +
						'<div><br />' +
							'Latitude  : ' + geo.lat + '<br />' +
							'Longitude : ' + geo.lng + '<br />' +
							'Population: ' + cityCircle.getRadius() +
						'</div>'+
					'</div>';

				var infowindow = new google.maps.InfoWindow({
					content: contentString,
					'rad': rad
				});

				var marker = new google.maps.Marker({
					map: gMap,
					position: geo,
					content:city // for evaluatiing which InfoWindow to open
				});

				gMarker.push(marker);
				gInfoWindow.push(infowindow);

		} // end of for


		for(var a=0; a< gMarker.length; ++a){
			var info = gInfoWindow[a];
			setInfo(a,info);
			gMarker[a].setMap(null);
		}
  }
  else{

  	for (var city in circles) {
		var rad = getpopulation(citymap[city],res,type,limit);
		if(rad == -1) continue;

		circles[city].setRadius(rad * scale);
		circles[city].setOptions({fillColor : kolor});

		var contentString =
					'<div style="width:200px;"><div>' + citymap[city].Orgname + '</div>' +
						'<div><br />' +
							'Latitude  : ' + circles[city].getCenter().lat() + '<br />' +
							'Longitude : ' + circles[city].getCenter().lng() + '<br />' +
							'Population: ' + rad +
						'</div>'+
					'</div>';
		//console.log(contentString);
		if(typeof gMarker[city] != "undefined"){
			gInfoWindow[city].setContent(contentString);
			gInfoWindow[city].rad = rad;
		}


		if(rad > gValueMax){
			var i = 9;
			while(i >=0 && tmpTen[i] < rad)
				--i;
			for(var j=9;j > i + 1; --j)
				tmpTen[j] = tmpTen[j-1];
			tmpTen[i+1] = rad;

			gValueMax = tmpTen[9];
		}
  	}

	if($("#filterBox").prop("checked")){
		for(var a = 0; a < gMarker.length; ++a){
			if(typeof gInfoWindow[a] != "undefined"){
				if(gInfoWindow[a].rad >= gValueMax){
					gMarker[a].setMap(gMap);
				}
				else
					gMarker[a].setMap(null);
			}
			else
				gMarker[a].setMap(null);
		}
	}
	else{
		if($("#Iconbox").prop("checked")){
			for(a in gMarker)
				gMarker[a].setMap(gMap);
		}
		else{
			for( a in gMarker)
				gMarker[a].setMap(null);
		}
	}


  }
}

function init(name,name2){
	var type = getget();
	if(typeof type == "undefined") type="total";
	console.log('type = ' + type);
  gType = type;
	google.maps.event.addDomListener(window, 'load', function(){
		getjson(name,name2,type);
	});
}

var nowJson = 'Assets/json/Default.json';
var gType;
var gMap;
var gMarker = [];
var gInfoWindow = [];
var circles = [];
var gValueMax = 0;
init('Assets/json/geo.json',nowJson);

$(document).ready(function(){

		  $('#total').click(function(event){
			console.log("Change type to TOTAL");
			event.preventDefault();
			if(gType == "total") return;
			getjson2Again(nowJson,"total");
			gType = "total";
		  });

		  $('#entries').click(function(event){
			console.log("Change type to ENTRIES");
			event.preventDefault();
			if(gType == "entries") return;
			getjson2Again(nowJson,"entries");
			gType = "entries";
		  });

		  $('#exits').click(function(event){
			console.log("Change type to EXITS");
			event.preventDefault();
			if(gType == "exits") return;
			getjson2Again(nowJson,"exits");
			gType = "exits";
		  });

			$('.btn-ent').unbind('click');
			$('.btn-ent').click(function(event){
				var ans = $(this).val();
				nowJson = "Assets/json/anderson/ent/" + ans;
				console.log("Change file to " + nowJson);
				getjson2Again(nowJson,"total");

			});

			$('.btn-ext').unbind('click');
			$('.btn-ext').click(function(event){
				var ans = $(this).val();
				nowJson = "Assets/json/anderson/ext/" + ans;
				console.log("Change file to " + nowJson);
				getjson2Again(nowJson,"total");

			});

			$('.btn-sum').unbind('click');
			$('.btn-sum').click(function(event){
				var ans = $(this).val();
				nowJson = "Assets/json/ragi/" + ans;
				console.log("Change file to " + nowJson);
				getjson2Again(nowJson,"total");

			});
			$('#Iconbox').click(function(event){
				if($("#Iconbox").prop("checked")){

					for(a in gMarker)
						gMarker[a].setMap(gMap);
				}
				else{
					for(a in gMarker)
						gMarker[a].setMap(null);
				}
			});
			$('#filterBox').click(function(event){
				if($("#filterBox").prop("checked")){
					for(var a = 0; a < gMarker.length; ++a){
						if(typeof gInfoWindow[a] != "undefined"){
							if(gInfoWindow[a].rad >= gValueMax){
								gMarker[a].setMap(gMap);
							}
							else
								gMarker[a].setMap(null);
						}
						else
							gMarker[a].setMap(null);
					}
				}
				else{
					if($("#Iconbox").prop("checked")){
						for(a in gMarker)
							gMarker[a].setMap(gMap);
					}
					else{
						for( a in gMarker)
							gMarker[a].setMap(null);
					}
				}
			});
			$('#Circlebox').click(function(event){
				if($("#Circlebox").prop("checked")){

					for(a in circles)
						circles[a].setMap(gMap);
				}
				else{
					for(a in circles)
						circles[a].setMap(null);
				}
			});
});
