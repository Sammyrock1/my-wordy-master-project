const letters = document.querySelectorAll(".scoreboard-letter");
const loadingDiv = document.querySelector(".info-bar");
const ANSWER_LENGTH = 5;
const ROUND = 6;


async function init() {
    let currentGuess = "";
    let currentRow = 0;
    let isLoading = true;
    console.log(currentGuess);

    const res = await fetch("https://words.dev-apis.com/word-of-the-day?random=1");
    const resObj = await res.json();
    const words = resObj.word.toUpperCase();
    const wordPart = words.split("");
    let done = false;
    isLoading = false;
    setLoading(false);
    console.log(words);

    function addLetter(letter) {
        if(currentGuess.length < ANSWER_LENGTH) {
            //add letter to the end
            currentGuess += letter;
        }else{
            //replace the last letter
            currentGuess = currentGuess.substring(0, currentGuess.length -1) + letter;
        }
        
        letters[ANSWER_LENGTH * currentRow + currentGuess.length - 1].innerText = letter;
    console.log(letter)
    }
    async function commit() {
        if(currentGuess ===! ANSWER_LENGTH){
            //do nothing
            return;
        }
//  TODO validate the word

//TODO do all the marking as 'correct" "close" or "wrong"
const guessPart = currentGuess.split("");
const map = makeMap(wordPart);
console.log(map);

for(let i=0; i< ANSWER_LENGTH; i++){
    //mark as correct
    if(guessPart[i]===wordPart[i]) {
        letters[currentRow * ANSWER_LENGTH + i].classList.add("correct");
        map[guessPart[i]]--;
    }
}
for(let i=0; i< ANSWER_LENGTH; i++){
    if(guessPart[i]===wordPart[i]){
        //do noting,we already did it
    }else if(wordPart.includes(guessPart[i]) && map[guessPart[i]] > 0){
        //mark as close
        letters[currentRow * ANSWER_LENGTH + i].classList.add("close");
        map[guessPart[i]]--;
    }else{
        letters[currentRow * ANSWER_LENGTH + i].classList.add("wrong");
    }
}

//TODO did they win or lose?
if(currentGuess=== words) {
    //win
    alert("you win");
    done = true;
   return;
}else if(currentRow=== ROUND){
    alert(`you lose,the wors was ${word}`);
    done = true;
}
    }
    function backSpace() {
        currentGuess = currentGuess.substring(0, currentGuess.length -1);
        letters[ANSWER_LENGTH * currentRow + currentGuess.length].innerText = "";
    }


    document.addEventListener("keydown", function handleKeyPress(event) {
        if(done || isLoading){
            //do nothing 
            return;
        }



        const action = event.key;
        if (action === 'Enter'){
            commit();
        }else if (action.toLowerCase() === "BackSpace".toLowerCase()){
            backSpace();
        }else if (isLetter(action)){
            addLetter(action.toUpperCase())
        }else{
            //do nothing
        }
    });
}
function isLetter(letter){
        return /^[a-zA-Z]$/.test(letter)
}

function setLoading(isLoading) {
    console.log(isLoading)
  loadingDiv.classList.toggle("show", isLoading);
}

function makeMap(array) {
const obj = {};
for(let i=0; i< array.length; i++){
    const letter = array[i];
    if(obj[letter]) {
        obj[letter]++;
    }else{
        obj[letter] =  1;
    }
}
return obj;

}

init();