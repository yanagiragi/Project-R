var string = require('string-similarity');
var fs = require('fs');

function AllGreen(){
	var jsonData = [];
	for( a in levelset){
		if ( a == levelset.length - 1 ) continue;
		var mods = levelset[a].replace("-"," - ");
		var res = string.findBestMatch(mods,datasetS);
		var goal = dataset[res.bestMatch.target];
		var data = { 
			'Orgname' : levelset[a],
			'Modname' : res.bestMatch.target,
			'lat'	  : goal[4],
			'lng'	  : goal[5]
		}
		jsonData.push(data);
	}
	console.log(JSON.stringify(jsonData,null,4));
}

function myparse2(str){
	strs = str.split('\n')
	for( a in strs){
		if( a == 0) continue;
		levelset.push(strs[a]);
	}
	AllGreen();
}

function deal(){	
	fs.readFile(__dirname+'/modified',function(err, content){
		if(err)
			console.log(err);
		else
			myparse2(content.toString());
	});
}

function myparse(str){
	strs = str.split('\n')
	for( a in strs){
		if(a == 1483) break;
		keys = strs[a].split(',');
		dataset[keys[2]] = keys;
		//console.log(":" + keys[2]+"\n");
		datasetS.push(keys[2]);
	}
	deal();
}

var levelset = [];
var dataset = {};
var datasetS = new Array();

fs.readFile(__dirname+'/stops.txt',function(err, content){
	if(err)
		console.log(err);
	else
		myparse(content.toString());
});
