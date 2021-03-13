addChart = () =>{
	var input = document.getElementById("cinput").value;
	if (document.body.contains(document.getElementById(input))) {
		return;
	}
	var crDiv = document.createElement("div")
	crDiv.className = "contC"
	var chart = document.createElement("div")
	chart.className = "chart"
	chart.id = input
	crDiv.appendChild(chart)

	del = document.createElement('button')
	del.className = "delete"
	del.innerHTML = "X"
	del.onclick = (e) =>{
		e.target.parentNode.remove()
		console.log(e.target)
	}

	crDiv.appendChild(del)
	document.getElementById("charts").appendChild(crDiv)
	fetch('https://min-api.cryptocompare.com/data/v2/histoday?fsym='+input+'&tsym=USD&limit=21')
	.then((response) => {
		return response.json();
	})
	.then((myJson) => {
		dataP = [];
		if (myJson.Data.Data == undefined) {
			document.getElementById(input).parentNode.remove();
		}
		for (let i = 0; i < myJson.Data.Data.length; i++) {
			dataP.push({x:new Date(myJson.Data.Data[i].time * 1000),y:myJson.Data.Data[i].close})

		}
		let result = dataP.map(a => a.y);
		result.sort();

		console.log(dataP);

		var chart = new CanvasJS.Chart(input,
		{
			title: {
				fontFamily:"sans-serif",
				text:input.toUpperCase(),
				fontWeight:"600",
				fontColor:"rgba(12,205,32,.6)",
			},
			axisX: {
				interval: 10,
			},
			axisY: {
				minimum:result[0]
			},
			data: [
			{
				type: "splineArea",
				color: "rgba(12,255,32,.3)",
				dataPoints:dataP
			},
			]
		});
	chart.render();
	});
}
document.getElementById("cinput").onkeydown = function(e){
	if(e.keyCode == 13){
		console.log(document.getElementById("cinput").value)
		addChart();
		document.getElementById('cinput').value = ''
		}
}
