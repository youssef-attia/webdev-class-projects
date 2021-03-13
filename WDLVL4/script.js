function initialize() {
	area = document.getElementById("playfield");
	gameRunning = true;
	bugObjs = [];
	for (let i = 0; i < Math.floor(area.offsetWidth / 80); i++) {
		createBug(
			Math.floor(Math.random() * 7) + 1,
			Math.floor(Math.random() * 100) + 60,
			Math.floor(Math.random() * 2) + 1,
			Math.floor(Math.random() * 5) + 1
		);
	}
	coins = setInterval(() => {
		createCoin(Math.floor(Math.random() * 10) + 5);
	}, 3000);
}
createCoin = speed => {
	var coin = document.createElement("img");
	coin.src = "images/coin.png";
	coin.style.width = "75px";
	coin.style.left = Math.floor(Math.random() * area.offsetWidth) + "px";
	coin.style.position = "absolute";
	area.appendChild(coin);
	movementy(coin, speed);
	coin.addEventListener("click", e => {
		document.getElementById("coinscore").innerHTML++;
		e.target.remove();
	});
};
function createBug(type, size, health, speed = 4) {
	var x = Math.floor(Math.random() * (area.offsetWidth - 200));
	var y = Math.floor(Math.random() * (area.offsetHeight - 100)) + 30;
	var z = Math.floor(Math.random() * 360) + 1;
	var idx = Math.floor(100000 + Math.random() * 900000);
	var over = document.createElement("div");
	var message = document.createElement("h3");
	var bugIMG = document.createElement("img");
	bugIMG.src = "images/bug-" + type + ".png";
	bugIMG.style.width = size + "px";
	over.appendChild(message);
	over.appendChild(bugIMG);
	over.id = idx;
	over.style.position = "absolute";
	over.style.left = x + "px";
	over.style.top = y + "px";
	over.style.transform = "rotate(" + z + "deg)";
	var bugOBJ = {
		id: idx,
		alive: true,
		type: type,
		health: health,
		size: size,
		speed: speed,
		x: x,
		y: y,
		z: z
	};
	bugObjs.push(bugOBJ);
	area.appendChild(over);
	movementx(bugOBJ);
	document.getElementById(idx).addEventListener(
		"click",
		(kill = e => {
			if (bugObjs.indexOf(bugOBJ) > -1) {
				meanMSG = [
					"AVENGE MEEEE",
					"ILL GET YOUUU",
					"NOOOOO >:(",
					"RUN, MY BROTHERS!!",
					"I HATE YOUUU",
					"THIS IS WAR",
					"THIS ISN'T OVER",
					"ARGHGG",
					"DAMN HUMAN",
					"YOU WILL DIE"
				];
				pleadMSG = [
					"PLEASE NOOOO",
					"HAVE MERCY",
					"DON'T KILL ME",
					"I BEG YOU",
					"NOOOO :(",
					"HEEEELP",
					"MOOOOOM",
					"HOW COULD YOU!!"
				];
				var actualBug;
				bugObjs.forEach(element => {
					if (element.id == idx) {
						actualBug = element;
					}
				});
				if (actualBug.health == 1) {
					bugObjs.forEach(element => {
						if (element.id == idx) {
							element.alive = false;
						}
					});

					el = document.getElementById(idx);
					el.children[1].src = "images/death.png";
					document.removeEventListener("click", kill);
					if (bugObjs.length >= 8) {
						el.children[0].innerHTML =
							meanMSG[Math.floor(Math.random() * meanMSG.length)];
					}
					if (bugObjs.length < 8) {
						el.children[0].innerHTML =
							pleadMSG[
								Math.floor(Math.random() * pleadMSG.length)
							];
					}
					document.getElementById("score").innerHTML++;
					if (document.getElementById("score").innerHTML % 6 == 0) {
						createBug(
							Math.floor(Math.random() * 7) + 1,
							190,
							3,
							Math.floor(Math.random() * 5) + 1
						);
					}

					// bugObjs.splice(bugObjs.indexOf(bugOBJ), 1);
					setTimeout(() => {
						bugObjs.forEach(e => {if(e.alive ==false && document.getElementById(e.id) != undefined){document.getElementById(e.id).remove();}});
						el.remove();
						randm = Math.random();
						if (randm > 0.8) {
							createBug(
								Math.floor(Math.random() * 7) + 1,
								Math.floor(Math.random() * 100) + 60,
								Math.floor(Math.random() * 2) + 1,
								Math.floor(Math.random() * 5) + 1
							);
						} else if (randm < 0.8 && bugObjs.length == 0) {
							area.offsetHeight - 100;
							var modal = document.getElementById("myModal");
							var span = document.getElementsByClassName(
								"close"
							)[0];
							document.getElementById(
								"iscore"
							).innerHTML = document.getElementById(
								"score"
							).innerHTML;
							document.getElementById(
								"coinss"
							).innerHTML = document.getElementById(
								"coinscore"
							).innerHTML;
							modal.style.display = "block";
							span.onclick = function() {
								modal.style.display = "none";
							};
						}
					}, 500);
				} else {
					bugObjs.forEach(element => {
						if (
							element.id == idx &&
							actualBug.health != 1 &&
							actualBug.health > 0
						) {
							document.getElementById(
								element.id
							).children[0].innerHTML = "ouch!";
							setTimeout(() => {
								document.getElementById(
									element.id
								).children[0].innerHTML = "";
							}, 300);
							element.health--;
						}
					});
				}
			}
		})
	);
}
function movementy(el, speed) {
	var y = 170;
	var fall = setInterval(() => {
		if (y > area.offsetHeight) {
			clearInterval(fall);
			el.remove();
		}
		y += speed;
		el.style.top = y + "px";
	}, 100);
}
function movementx(obj) {
	var varia = 0;
	var randomer = Math.floor(Math.random() * 4) + 1;
	var loop = setInterval(() => {
		if (obj.alive == false || document.getElementById(obj.id) == false) {
			clearInterval(loop);
		}
		if (varia % 40 == 0) {
			if (Math.random() > 0.5) {
				randomer = Math.floor(Math.random() * 4) + 1;
			}
		}

		if (obj.x > area.offsetWidth - 200) {
			document.getElementById(obj.id).style.left =
				(obj.x -= obj.speed + 20) + "px";
			randomer = 2;
		} else if (obj.x < 40) {
			document.getElementById(obj.id).style.left =
				(obj.x += obj.speed + 20) + "px";
			randomer = 1;
		} else if (obj.y > area.offsetHeight - 100) {
			document.getElementById(obj.id).style.top =
				(obj.y -= obj.speed + 20) + "px";
			randomer = 4;
		} else if (obj.y < 140) {
			document.getElementById(obj.id).style.top =
				(obj.y += obj.speed + 20) + "px";
			randomer = 3;
		} else {
			if (randomer == 1) {
				document.getElementById(obj.id).style.left =
					(obj.x += obj.speed) + "px";
				document.getElementById(obj.id).style.transform =
					"rotate(" + 90 + "deg)";
			}
			if (randomer == 2) {
				document.getElementById(obj.id).style.left =
					(obj.x -= obj.speed) + "px";
				document.getElementById(obj.id).style.transform =
					"rotate(" + 270 + "deg)";
			}
			if (randomer == 3) {
				document.getElementById(obj.id).style.top =
					(obj.y += obj.speed) + "px";
				document.getElementById(obj.id).style.transform =
					"rotate(" + 180 + "deg)";
			}
			if (randomer == 4) {
				document.getElementById(obj.id).style.top =
					(obj.y -= obj.speed) + "px";
				document.getElementById(obj.id).style.transform =
					"rotate(" + 0 + "deg)";
			}
		}
		varia++;
	}, 20);
}
restart = () => {
	document.getElementById("score").innerHTML = 0;
	document.getElementById("coinscore").innerHTML = 0;
	document.getElementById("myModal").style.display = "none";
	initialize();
};
