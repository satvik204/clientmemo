const socket = io('https://memoryserver-i8o6nmm6.b4a.run/');

socket.on("updatePlayers",(totalPlayers) =>{
    document.querySelector('.tp').innerHTML = totalPlayers;
})


let mins,hrs;
let gameEnded = false;
let id1 = "";
let id2 = "";
socket.on("Match_Made",({socketid1,socketid2}) => {
    if (socketid1 === socket.id || socketid2 === socket.id) {
        
    id1 = socketid1;
    id2 = socketid2;
    document.querySelector('.wait-Area').style.display = "none";
    document.querySelector('.game-Area').style.display = "block";


    setInterval(() => {
        if (gameEnded === false) {
            
        
    const hr = document.querySelector('.hrs');
    const min = document.querySelector('.min');
    
    
    if (hr.textContent === "1") {
        hrs = 0;
        mins = 60;
    }
    mins--;
    
    hr.innerHTML = hrs;
    min.innerHTML = mins;
    }
    },1000)
    
    setTimeout(() => {
        if (gameEnded === false) {
            
        socket.emit('timeover',{socketid: socket.id,ysscore: score})
        gameEnded = true;
        const elemental = document.createElement('p');
        document.querySelector('.box').innerHTML = "";
        elemental.innerHTML  = "You Lose!😑";
      elemental.classList.add("timnasa");
         document.querySelector('.box').appendChild(elemental);
         setTimeout(() => {location.reload()},3000)
        }
    },60000)

    }
})

socket.on("playerDisconnect",(socketid) => {
    console.log(socketid,id1,id2);
    
    if (socketid === id1 || socketid === id2) {
        alert("Opponent Disconnected. Closing Match.");
      location.reload();
    }
})

function start() {
    document.querySelector('.start').style.display = "none";
    document.querySelector('.wait-Area').style.display = "block";
    socket.emit("playRequest",socket.id)
}




var picArr = [];
let isProcessing = false;
let flips = 0;
let score = 0;
var bothFlipsClass = [];
let oscore = 0;
if (localStorage.getItem('scorememory') === null) {
    localStorage.setItem('scorememory',0)
}


let clicks = 0;
for (let i = 1; i <9;   i++) {
  for (let j = 0; j < 2; j++) {
  picArr.push(`icon_${i}.png`)

    
  }
}




function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        // Generate a random index between 0 and i
        const j = Math.floor(Math.random() * (i + 1));
        // Swap elements at i and j
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

shuffleArray(picArr);

console.log(picArr);


const allSquares = document.querySelectorAll('.sq')

allSquares.forEach((element,index) => {

    element.onclick = () => {
        if (isProcessing) return;

        let startTime = performance.now(); // Records the high-resolution time
        clicks++;
     let endTime = performance.now(); // Records the time again

        const style = window.getComputedStyle(element);

        // Get the background property (background, background-color, etc.)
        const background = style.background;
        
      console.log(element.style.background );
      
        if (element.style.background !== ''  && element.style.background !== 'white') {
            return
        }else if ( element.style.background !== 'none') {
            console.log(background.substring(0,25),element.style.background);
            
         if (background.substring(0,18) === 'rgb(255, 255, 255)' ||element.style.background === 'white' || background.substring(0,19) === 'rgba(255, 255, 255)') {
            bothFlipsClass.push(element.className[0]);            
         }
         if (bothFlipsClass.length <= 2) {
          
        element.style.background = `url(./memory_game_icons/${picArr[index]})`;
        element.style.backgroundSize = `100%`;
        element.style.transform = ` rotateY(180deg)`;
  
         }


flips++;

console.log(flips,bothFlipsClass.length,bothFlipsClass);
            
        if (flips >= 2 && bothFlipsClass.length >= 1 && bothFlipsClass.length <=2) {
            isProcessing = true;
            flips = 0;
            
            if (document.querySelector(`.${bothFlipsClass[0]}`).style.background === document.querySelector(`.${bothFlipsClass[1]}`).style.background && bothFlipsClass[0] !== bothFlipsClass[1]) {
            
            document.querySelector(`.${bothFlipsClass[0]}`).style.background = "black";
            document.querySelector(`.${bothFlipsClass[1]}`).style.background = "black";
             score++;    
     
             document.querySelector('.score').innerHTML = score;
             bothFlipsClass = []
 
             if (score === 8) {
                score = score+mins;
            socket.emit('finished',{socketid: socket.id,score})
                document.querySelector('.score').innerHTML = score;
                gameEnded = true;
            
             }

             isProcessing = false;
        }else{
            console.log(bothFlipsClass[0]);
            setTimeout(() => { 
                console.log(bothFlipsClass[0]);
                
            document.querySelector(`.${bothFlipsClass[0]}`).style.transform = ` rotateY(0deg)`;
            document.querySelector(`.${bothFlipsClass[1]}`).style.transform = ` rotateY(0deg)`;
            document.querySelector(`.${bothFlipsClass[0]}`).style.background = "white";
            document.querySelector(`.${bothFlipsClass[1]}`).style.background = "white";
            bothFlipsClass = []

            isProcessing = false; 
            },1000)
               
            }
          
         
        }   
        }
    }
})

socket.on("finished",({socketid,yscore}) => {
    if (socketid === id1||socketid === id2) {
        if (socketid !== socket.id) {
            console.log(yscore);
        
            oscore = yscore;
            document.querySelector('.oppscore').innerHTML = oscore;
            const elemental = document.createElement('p');
            document.querySelector('.box').innerHTML = "";
            elemental.innerHTML  = "You Lose!😑";
          elemental.classList.add("timnasa");
             document.querySelector('.box').appendChild(elemental);
         
             setTimeout(() => {location.reload()},3000)

        }else{
            const elemental = document.createElement('p');
            document.querySelector('.box').innerHTML = "";
            elemental.innerHTML  = "You Win!🎉";
          elemental.classList.add("timnasa");
             document.querySelector('.box').appendChild(elemental);
         
             setTimeout(() => {location.reload()},3000)

        }
    }
})

socket.on("timeover",({socketid,ysscore}) => {
    if (socketid === id1||socketid === id2) {
        if (socketid !== socket.id) {
       
            oscore = ysscore;
            document.querySelector('.oppscore').innerHTML = oscore;
            
            const elemental = document.createElement('p');

            document.querySelector('.box').innerHTML = "";
            if (oscore > score) {
                elemental.innerHTML  = "You Lose!😑";
                
            }else if (oscore< score) {
                elemental.innerHTML  = "You Win!🎉";

            }else{
                elemental.innerHTML  = "Draw!";

            }
          elemental.classList.add("timnasa");
             document.querySelector('.box').appendChild(elemental);
         
             setTimeout(() => {location.reload()},3000)

        }else{
            const elemental = document.createElement('p');
            document.querySelector('.box').innerHTML = "";
            
            if (oscore > score) {
                elemental.innerHTML  = "You Lose!😑";
                
            }else if (oscore< score) {
                elemental.innerHTML  = "You Win!🎉";

            }else{
                elemental.innerHTML  = "Draw!";

            }
          elemental.classList.add("timnasa");
             document.querySelector('.box').appendChild(elemental);
         
             setTimeout(() => {location.reload()},3000)

        }
    }
})