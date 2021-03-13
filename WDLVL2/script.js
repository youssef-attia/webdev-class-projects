function initialize() {
    var arrayRevealed = [{id:1,dsc:'bag', counter : 0},{id:2,dsc:'basketball', counter : 0},{id:3,dsc:'candy', counter : 0},{id:4,dsc:'clock', counter : 0},{id:5,dsc:'pencil', counter : 0},{id:6,dsc:'pokeball', counter : 0},{id:7,dsc:'ufo', counter : 0},{id:8,dsc:'umbrella', counter : 0}]
    var restarter = document.getElementById("restart")
    var config = []
    var flipped = 0
    var flippedCards = []
    var foundCards = []
    var cards = document.querySelectorAll('.cards')
    var cardsArray = Array.from(cards);
    var whatToClear
    var score = 0
    var leaderboard = JSON.parse(localStorage.getItem("leaderboard")) || [{name:"Master Of Cards",score:35},{name:"Average Joe",score:28},{name:"This Guy Sucks",score:20},];
    leaderboard = leaderboard.sort((a, b) => (a.score < b.score) ? 1 : -1) || []
    var hallOfFame = document.getElementById("leaderboard")
    document.getElementById('score').innerHTML = score;

    console.log(leaderboard)

    // Shuffles an array randomly
    function shuffle(a) {
        for (let i = a.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [a[i], a[j]] = [a[j], a[i]];
        }
        return a;
    }
    var shuffledRevealed = shuffle(arrayRevealed);
    //set img src of each img to card
    cards.forEach((e)=>{
        e.src = 'Images/card.png'
    })
    
    //on hover change the card to a lit up card
    cards.forEach(element21 => {
        element21.onmouseover = () =>{
            if (element21.src=='https://yattiax.github.io/WDLVL2/Images/card.png') {
                element21.src = 'Images/card2.png'
            }
        }
        element21.onmouseout = () =>{
            if (element21.src=='https://yattiax.github.io/WDLVL2/Images/card2.png') {
                element21.src = 'Images/card.png'
            }
        }
    });
    
    //makes sure that each configuration is random
    function shuffleAndConfig() {
        cards.forEach(element => {
            shuffledRevealed = shuffle(arrayRevealed);
            //sorts counter from small to large
            shuffledRevealed.sort((a, b) => (a.counter > b.counter) ? 1 : -1)
            shuffledRevealed.filter((element)=>{return element.counter!=2})
            if (shuffledRevealed[0].counter !=2) {
                var eID = element.id
                config.push({id : eID, atc : shuffledRevealed[0].dsc})
                shuffledRevealed[0].counter++
            }
        });
    }
    shuffleAndConfig();
    // console.log(config)
    //restart button (there is some recursiveness here)
    restarter.onclick = () =>{
        initialize();
    }
    //This is the main brain of the code
    //runs a for each on each img element
    cards.forEach(element => {
        var fID = element.id
        //on click takes the underimg from the config array and applies it
        element.onclick = e =>{
            if (flipped<2) {
                e.target.src = `Images/${config[fID-1].atc}.png`
                //pushes the flipped card to an array for later checking
                flippedCards.push({id:fID,dsc:config[fID-1].atc})
                flipped++
            }
            //When 2 cards are flipped check if theyre equal
            if(flipped == 2) {
                score--
                //If the card is equal to but not the same card
                if(flippedCards[0].dsc===flippedCards[1].dsc && flippedCards[0].id!=flippedCards[1].id){
                    score+=6
                    //clear flipped cards
                    flippedCards = []
                    console.log("Found A Card")
                    //find the element in config by its id
                    otherone = config.find( ({ id }) => id === element.id );
                    //gives a config where the matched cards are excluded
                    otherones = config.filter( ({ atc }) => atc === otherone.atc );
                    console.log(otherones)
                    //otherones is the cards that are already matches and in foundCards array
                    otherones.forEach(element3 => {foundCards.push(document.getElementById(element3.id))});
                    console.log("Cards Found : ")
                    console.log(foundCards);
                    
                    flipped = 0
                    //Everything that isnt in foundcards is reset back to card
                    whatToClear = cardsArray.filter(x => foundCards.includes(x));
                    console.log(whatToClear)
                } else {
                    flippedCards = []
                    //waits .5 seconds then clears the cards that are not in found cards
                    setTimeout(() => {
                        whatToClear = cardsArray.filter(x => !foundCards.includes(x));
                        console.log(whatToClear)
                        whatToClear.forEach((element2)=>{element2.src = `Images/card.png`}) 
                        flipped = 0
                    }, 500);
                }
            }
            //Winning condition: when all cards are found
            if(foundCards.length == 16){
                var usrnm = prompt("You WONNNNN Please Enter Your Name To Go Down In History")
                leaderboard.push({name:usrnm,score:score})
                console.log(leaderboard);
                localStorage.setItem('leaderboard',JSON.stringify(leaderboard));
                addEntry();
            }
            document.getElementById('score').innerHTML = score;
        }
    });
    //Creates li element and sets up leaderboard
    function addEntry() {
        leaderboard.sort((a, b) => (a.score < b.score) ? 1 : -1)
        while (hallOfFame.firstChild){
            hallOfFame.removeChild(hallOfFame.firstChild);
        }
        leaderboard.forEach(element => {
            var li = document.createElement("li");
            liElement = hallOfFame.appendChild(li)
            li.appendChild(document.createTextNode(element.name + ' : ' + element.score));
        });
    }
    addEntry();
}
