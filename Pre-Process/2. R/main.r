library(rjson)
insertRow <- function(existingDF, newrow, r) {
  existingDF[seq(r+1,nrow(existingDF)+1),] <- existingDF[seq(r,nrow(existingDF)),]
  existingDF[r,] <- newrow
  existingDF
}
processing <- function(dataname,outputname){

	# if error due to delimiter differs, change nnext line to "mydata = read.csv(dataname,sep="\t");"
	mydata = read.csv(dataname);

	# defines constants at first
	index = 1
	timeend = strptime('23:59:59','%H:%M:%S')
	data = data.frame(ENTRIES=integer(),EXITS=integer(),C.A=character(),UNIT=character(),STATION=character(),SCP=character(),LINENAME=character(),DIVISION=character(),DATE=character(),TIME=character(),stringsAsFactors=FALSE)

	cCA = c(levels(mydata$C.A));
	for(i in seq_along(cCA)){
	  mydataCA = mydata[mydata$C.A == cCA[i],];
	  mydataCA$UNIT = factor(mydataCA$UNIT)
	  cUNIT = c(levels(mydataCA$UNIT))

	  for(j in seq_along(cUNIT)){
	    mydataUNIT = mydataCA[mydataCA$UNIT == cUNIT[j],];
	    mydataUNIT$SCP = factor(mydataUNIT$SCP)
	    cSCP = c(levels(mydataUNIT$SCP))

	    for(k in seq_along(cSCP)){
	    #if(cSCP[k] != '00-00-04') next
	      mydataSCP = mydataUNIT[mydataUNIT$SCP == cSCP[k],];
	      mydataSCP$STATION = factor(mydataSCP$STATION)
	      cSTATION = c(levels(mydataSCP$STATION))

	      for(l in seq_along(cSTATION)){
	        mydataSTATION = mydataSCP[mydataSCP$STATION == cSTATION[l],];
	        mydataSTATION$LINENAME = factor(mydataSTATION$LINENAME)
	        cLINENAME = c(levels(mydataSTATION$LINENAME))
	        
	        for(m in seq_along(cLINENAME)){
	          #if(cLINENAME[m] != 'ACENQRS1237') next
	          mydataLINENAME = mydataSTATION[mydataSTATION$LINENAME == cLINENAME[m],];
	          mydataLINENAME$DIVISION = factor(mydataLINENAME$DIVISION)
	          cDIVISION = c(levels(mydataLINENAME$DIVISION))

	          for(o in seq_along(cDIVISION)){
	            mydataDIVISION = mydataLINENAME[mydataLINENAME$DIVISION == cDIVISION[o],];
	            mydataDIVISION$DATE = factor(mydataDIVISION$DATE)
	            cDATE = c(levels(mydataDIVISION$DATE))

	            for(p in seq_along(cDATE)){
	              mydataDATE = mydataDIVISION[mydataDIVISION$DATE == cDATE[p],];
	              mydataDATE$TIME = factor(mydataDATE$TIME)
	              cTIME = c(levels(mydataDATE$TIME))

	              df = mydataDATE
	              j1 = 1
	              timestart = strptime(df[j1,]$TIME,'%H:%M:%S')

	              while(j1 < nrow(df)){

	                incre = 1
	                time1 = strptime(df[j1+incre,]$TIME,'%H:%M:%S')
	                while(time1 != timestart){
	                  incre = incre + 1
	                  time1 = strptime(df[j1+incre,]$TIME,'%H:%M:%S')
	                  if(is.na(time1))
	                    break;
	                }

	                tmps = incre + j1 - 1 
	                newk = df[j1:tmps,] # j:j+5 causes err!

	                minent = df[j1,];
	                for(k1 in seq(incre-1,incre,1)){
	                    newk[k1,]$ENTRIES = newk[k1,]$ENTRIES- minent$ENTRIES;
	                    newk[k1,]$EXITS = newk[k1,]$EXITS- minent$EXITS;
	                }

	                ent = newk[incre,]$ENTRIES
	                exit = newk[incre,]$EXITS

	                tmpC = c(ent,exit,as.character(minent$C.A),as.character(minent$UNIT),as.character(minent$STATION),as.character(minent$SCP),as.character(minent$LINENAME),as.character(minent$DIVISION),as.character(minent$DATE),as.character(minent$TIME))
	                data = insertRow(data,tmpC,index)
	                index  = index + 1

	                j1 = j1 + incre
	              }
	            }
	          }
	        }
	      }
	    }
	  }
	}

	data = data[1:nrow(data)-1,]
	index = 1
	DStation = data.frame(ENTRIES=integer(),EXITS=integer(),STATION=character(),stringsAsFactors=FALSE)
	cData = levels(factor(data$STATION))

	for( i in seq_along(cData)){
	  cTmpData = data[data$STATION == cData[i],]
	  ent = sum(as.numeric(cTmpData$ENTRIES))
	  exit = sum(as.numeric(cTmpData$EXITS))
	  DStation = insertRow(DStation,c(ent,exit,cData[i]),index)
	  index = index + 1
	}

	z = toJSON(DStation[1:nrow(DStation)-1,])

	sink(outputname)
	cat(z) # use cat instead of print
	sink()
}
