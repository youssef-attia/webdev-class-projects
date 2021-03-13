var numDie;
initialize = ()=>{
	putDie = document.getElementById("ptopdie")
	putTable = document.getElementById("ptopt")
	numDie = document.getElementById("numOdie").innerHTML
	totalStats = document.getElementById("totalStats")

	numBtn = ()=>{ 
		while (putDie.firstChild) {
			putDie.removeChild(putDie.firstChild);
		}		
		numDie = document.getElementById("numOdie").value
		for (let i = 0; i < numDie; i++) {
			var img = document.createElement("img")
			img.className = "die"
			img.src='images/dice-1.png'
			img.id = i;
			putDie.appendChild(img)
		}
		dice = document.querySelectorAll('.die')
	}
	startRoll = () =>{
		globalArr = []
			dice.forEach(e => {
				rollDie(e)
		});
	}
}
var globalArr = []
rollDie = (img)=>{
	while (putTable.firstChild) {
		putTable.removeChild(putTable.firstChild);
	}
	while (totalStats.firstChild) {
		totalStats.removeChild(totalStats.firstChild);
	}
	numTurns = document.getElementById("numOturns").value;
	for (let j = 0; j < numTurns; j++) {
		var indivArr = [];
		(function(j) {
			var timeToStart2 = (j * (500/numTurns) * 7);			
			setTimeout(function() {
				for (var i = 1; i < 7; i++) { 
					(function(i) {
						var timeToStart = 500/numTurns * i;
						setTimeout(function() {
							img.src = `images/dice-${i}.png`
						}, timeToStart);
					})(i)
				}
				setTimeout(() => {
					var rand = Math.floor(Math.random() * 6) + 1
					img.src = `images/dice-${rand}.png`
					console.log(`rand: ${rand}`);
					indivArr.push({num:j+1,val:rand})
					if (indivArr.length==numTurns) {
						globalArr.push(indivArr);
					}
					if (globalArr[numDie-1].length == numTurns) {
						showResults();
					}
				}, (500/numTurns)*7);
			}, timeToStart2);
		})(j)
	}



var groupBy = function(array, key) {
    var final = array.reduce(function(last, currentVal) {
    (last[currentVal[key]] = last[currentVal[key]] || []).push(currentVal);
    return last;
	}, {});
	finalArr = Object.values(final);
	return finalArr;
};
showResults = () =>{
	var tr = document.createElement('tr');
	var th_tn = document.createElement('th');
	var th_mode = document.createElement('th');
	var th_med = document.createElement('th');
	var th_freq = document.createElement('th');
	var th_avg = document.createElement('th');
	th_tn.innerHTML= 'Turn Number';
	th_mode.innerHTML= 'Mode';
	th_med.innerHTML= 'Median';
	th_freq.innerHTML= 'Frequency';
	th_avg.innerHTML= 'Average';
	tr.appendChild(th_tn);
	tr.appendChild(th_mode);
	tr.appendChild(th_med);
	tr.appendChild(th_freq);
	tr.appendChild(th_avg);
	ptopt.appendChild(tr);
	var o_dub = 0;
	var o_trip = 0;
	var globalFreq = [];
	resultsArr = []
	globalArr.forEach(e => {
		e.forEach(f =>{
			resultsArr.push({dieNum:globalArr.indexOf(e),turnNum:f.num,val:f.val})
		})
	});
	resultsArr.sort((a, b) => (a.turnNum > b.turnNum) ? 1 : -1)
	console.table(resultsArr)
	grouped = groupBy(resultsArr,'turnNum')
	grouped.forEach(element => {
		element.forEach(element2 => {			
			delete element2.dieNum
		});
	});
	console.table(grouped)
	grouped.forEach(ej => {
		freqArr = []
		var indivFreq = 0;
		ej.forEach(vals => {
			indivFreq += vals.val;
			freqArr.push(vals.val);
			globalFreq.push(vals.val)
		});
		console.log('====================================');
		console.log(`TURN NUMBER: ${grouped.indexOf(ej)+1}`);
		console.log('====================================');
		console.log(freqArr);
		if (freqArr.length == 2 && freqArr[0]==freqArr[1]) {
			o_dub+=1;
			console.log("DOUBLE RUN DIE")
		}
		if (freqArr.length == 3 && freqArr[0]==freqArr[1] &&freqArr[1]==freqArr[2]) {
			o_trip+=1;
			console.log("TRIPLE RUN DIE")
		}
		console.log(`mode: ${modeArr(freqArr)}`);
		console.log(`median: ${medArr(freqArr)}`);
		console.log(`frequency: ${indivFreq}`);
		console.log(`average: ${averageArr(freqArr)}`);
		createTableEl(grouped.indexOf(ej)+1,modeArr(freqArr),medArr(freqArr),indivFreq,averageArr(freqArr).toFixed(1));
	});
	rows = document.querySelectorAll('.tableRow');

	rows.forEach(e12 => {
		e12.addEventListener('mouseover',(e)=>{
			document.getElementById('turnNumber').innerHTML = e12.firstChild.innerHTML;
			const turnArr = grouped[e12.firstChild.innerHTML-1];
			for (let i = 0; i < turnArr.length; i++) {
				for (let i = 0; i < numDie; i++) {
					document.getElementById(i).src = `images/dice-${turnArr[i].val}.png`
				}
			}
		})
	});

	console.log('frequency');
	globalFreq.sort();
	globalAvg = averageArr(globalFreq);
	globalMed = medArr(globalFreq);
	globalMode = modeArr(globalFreq);
	console.log(globalFreq);
	console.log(globalAvg.toFixed(2));
	console.log(globalMed);
	console.log(globalMode);
	var dubCheck = false;
	var tripCheck = false;
	if(numDie==2) {console.log(`Double Dies: ${o_dub}`); dubCheck=true;}
	if(numDie==3) {console.log(`Triple Dies: ${o_trip}`); tripCheck=true;}
	var usedNum = 0;
	if (o_dub>o_trip) {
		usedNum = o_dub;
	} else {
		usedNum = o_trip;
	}
	var avgFreq = 0;
	for (let i = 1; i < putTable.children.length; i++) {
		const element = putTable.children[i];
		avgFreq+=parseInt(element.children[3].innerHTML)
	}

	createFinalTable(globalMode,globalMed,(avgFreq/putTable.children.length-1).toFixed(2),avgFreq,globalAvg.toFixed(2),dubCheck,tripCheck,usedNum)
}
averageArr = (arr) =>{
	var total = 0;
	arr.forEach(e => {
		total+=e;
	});
	return total/arr.length
}
medArr = (arr) =>{
	if(arr.length === 0) return 0;
	arr = arr.sort()
	var lng = Math.floor(arr.length/2)
	if(arr.length % 2){
		return arr[lng]
	}else{
		return (arr[lng - 1] + arr[lng]) / 2;
	}
}
modeArr = (arr) =>{
	var mode = 0;
	for(var i = 0; i < arr.length; i++){
		for(var j = 0; j < i; j++){
			if(arr[j] === arr[i]){
				mode = arr[j];
			}
		}
	}
	if(mode==0){
		mode = 'no mode'
	}
	return mode;
}
createTableEl = (tn,mode,med,freq,avg) =>{
	tr = document.createElement('tr')
	td_tn = document.createElement('td')
	td_mode = document.createElement('td')
	td_med = document.createElement('td')
	td_freq = document.createElement('td')
	td_avg = document.createElement('td')

	td_tn.innerHTML=tn
	td_mode.innerHTML=mode
	td_med.innerHTML=med
	td_freq.innerHTML=freq
	td_avg.innerHTML=avg
	
	tr.className = 'tableRow'
	
	tr.appendChild(td_tn)	
	tr.appendChild(td_mode)
	tr.appendChild(td_med)
	tr.appendChild(td_freq)
	tr.appendChild(td_avg)
	ptopt.appendChild(tr)
}
createFinalTable = (mode,med,freq,totalfreq,avg,numdub=false,numtrip=false,numGiven) =>{
	tr = document.createElement('tr')
	td_mode = document.createElement('td')
	td_med = document.createElement('td')
	td_freq = document.createElement('td')
	td_freq_total = document.createElement('td')
	td_avg = document.createElement('td')
	td_numdubtrip = document.createElement('td')

	td_mode.innerHTML= 'Average Mode: ' + mode;
	td_med.innerHTML='Average Median: ' + med
	td_freq.innerHTML='Average Frequency: ' + freq
	td_freq_total.innerHTML='Total Frequency: ' + totalfreq
	td_avg.innerHTML='Global Average: ' + avg
	
	if (numdub) {
		td_numdubtrip.innerHTML = '# of Doubles: ' + numGiven
	}
	if (numtrip) {
		td_numdubtrip.innerHTML = '# of Triples: ' + numGiven
	}
	
	tr.className = 'tableRowStats'
	tr.appendChild(td_avg)
	tr.appendChild(td_freq_total)
	tr.appendChild(td_freq)
	tr.appendChild(td_mode)
	tr.appendChild(td_med)
	if (td_numdubtrip.innerHTML) {
		tr.appendChild(td_numdubtrip)
	}
	totalStats.appendChild(tr)
}
}