#Build Pipeline
1. RawData -> text (process by R)
2. text -> modified (process_station_used.c)
3. stops.text + modified -> geo.json (main.js)
	# require: fs, string-similarity
4. geo.json + dataGenerated.json -> draw Circles (index.js)