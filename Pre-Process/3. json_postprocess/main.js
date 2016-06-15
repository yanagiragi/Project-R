var fs = require('fs');

var time = 0;
var FinalData = {"ENTRIES":[],"EXITS":[],"STATION":[]};

start();

function sumUp(jsondata,limit){
	for(a in jsondata){
		if(a == 0){
			for(b in jsondata[a]['STATION']){
				var increEN = parseInt(jsondata[a]['ENTRIES'][b]);
				var increEX = parseInt(jsondata[a]['EXITS'][b]);

				if(increEN >= 0 && increEN < limit)
					FinalData.ENTRIES.push(parseInt(jsondata[a]['ENTRIES'][b]));
				else
					FinalData.ENTRIES.push(0);

				if(increEX >= 0 && increEX < limit)
					FinalData.EXITS.push(parseInt(jsondata[a]['EXITS'][b]));
				else
					FinalData.EXITS.push(0);

				FinalData.STATION.push(jsondata[a]['STATION'][b]);
			}
		}
		else{
			for(b in jsondata[a]['STATION']){
				if(FinalData.STATION.indexOf(jsondata[a]['STATION'][b]) <= -1){
					var increEN = parseInt(jsondata[a]['ENTRIES'][b]);
					var increEX = parseInt(jsondata[a]['EXITS'][b]);

					if(increEN >= 0 && increEN < limit)
						FinalData.ENTRIES.push(parseInt(jsondata[a]['ENTRIES'][b]));
					else
						FinalData.ENTRIES.push(0);

					if(increEX >= 0 && increEX < limit)
						FinalData.EXITS.push(parseInt(jsondata[a]['EXITS'][b]));
					else
						FinalData.EXITS.push(0);
				}
				else{
					var index = FinalData.STATION.indexOf(jsondata[a]['STATION'][b]);
					var increEN = parseInt(jsondata[a]['ENTRIES'][b]);
					var increEX = parseInt(jsondata[a]['EXITS'][b]);
					if(increEN > 0 && increEN < limit)
						FinalData.ENTRIES[index] += increEN;
					if(increEX >= 0 && increEX < limit)
						FinalData.EXITS[index] += increEX;
				}
			}
		}
	}
	console.log(JSON.stringify(FinalData,null,4));
}
function start(){
	var rdList = fs.readdirSync('./Storage');
	var jsondata = new Array();
	for(a in rdList){
		fs.readFile('./Storage/' + rdList[a],'utf8',function(err,data){
				jsondata.push(JSON.parse(data));
				time ++;
				if(time == rdList.length)
				sumUp(jsondata,2800000*2);
				});
	}
}
