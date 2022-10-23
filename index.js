const letters = document.querySelectorAll(".scoreboard-letter");
const loadingDiv = document.querySelector(".info-bar");
const ANSWER_LENGTH = 5;
const ROUNDS = 6;


async function init() {
    let currentGuess = "";
    let currentRow = 0;
    let done = false;
    let isLoading = true;

    const res = await fetch("https://words.dev-apis.com/word-of-the-day");
    const resObj = await res.json();
    const words = resObj.word.toUpperCase();
    const wordPart = words.split("");
    isLoading = false;
    setLoading(false);
    console.log(wordPart);

    function addLetter(letter) {
        if(currentGuess.length < ANSWER_LENGTH) {
            //add letter to the end
            currentGuess += letter;
        }else{
            //replace the last letter
            currentGuess = currentGuess.substring(0, currentGuess.length -1) + letter;
        }
        
        letters[ANSWER_LENGTH * currentRow + currentGuess.length -1].innerText = letter;
        
    }
    
    
     async function commit() {
        if(currentGuess.length ===! ANSWER_LENGTH) {
            //do nothing
    return;
        }
        
        //  TODO validate the word
        
isLoading = true;
setLoading(true);

const res = await fetch("https://words.dev-apis.com/validate-word", {
    method: "POST",
    body: JSON.stringify({word: currentGuess})
});

const resObj = await res.json();
const validword = resObj.validWord;
//const {validword} = resObj;
isLoading = false;
setLoading(false);

if(!validword) {
    markInvalidWord();
   return; 
}

//TODO do all the marking as 'correct" "close" or "wrong"
const guessPart = currentGuess.split("");
const map = makeMap(wordPart);
let allRight = true; 
    for (let i = 0; i < ANSWER_LENGTH; i++){
        //mark as correct
        if(guessPart[i] === wordPart[i]) {
            letters[currentRow * ANSWER_LENGTH + i].classList.add("correct");
            map[guessPart[i]]--;
        }
    }

 for (let i=0; i< ANSWER_LENGTH; i++){
     if (guessPart[i] === wordPart[i]){
         //do noting,we already did it
     }else if(map[guessPart[i]] && map[guessPart[i]] > 0){
         //mark as close
         allRight = false;
         letters[currentRow * ANSWER_LENGTH + i].classList.add("close");
         map[guessPart[i]]--;
     }else{
         allRight = false;
         letters[currentRow * ANSWER_LENGTH + i].classList.add("wrong");
     }
 }

//TODO did they win or lose?
currentGuess = "";
currentRow++;
//if(currentGuess=== words) 
 if(allRight) {
     //win
     alert("you win");
     document.querySelector(".brand").classList.add("winner");
     done = true;
    return;
 }else if(currentRow === ROUNDS){
     alert(`you lose,the word was ${words}`);
     done = true;
 }
 
    }
    function backSpace() {
        currentGuess = currentGuess.substring(0, currentGuess.length -1);
        letters[ANSWER_LENGTH * currentRow + currentGuess.length].innerText = "";
    }
     function markInvalidWord() {
         alert("not a valid word");
         for (let i = 0; i <ANSWER_LENGTH; i++) {
         letters[currentRow * ANSWER_LENGTH + i].classList.remove("invalid");

             setTimeout( () =>
                 letters[currentRow * ANSWER_LENGTH + i].classList.add("invalid"),10 );
         }
     };


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