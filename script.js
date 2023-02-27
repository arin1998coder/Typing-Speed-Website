//random quotes api
const quoteApiUrl = "https://api.quotable.io/random?minLength=80&maxLength=100";
const quoteArea = document.querySelector(".quote");
const userInput = document.getElementById("user-input");
const startTestButton = document.getElementById("start-test");
const stopTestButton = document.getElementById("stop-test");
const resultDiv = document.querySelector(".result");
let wpm = document.getElementById("wpm");
let accuracy = document.getElementById("accuracy");

let quote="";
let time = 60;
let timer = "";
let mistakes = 0;

//fetches a random quote from the api and store it in data and initialise that quote into the quoteArea
 let randomQuote= async() =>{
    quoteArea.innerHTML="";
    
    const response = await fetch(quoteApiUrl);

    //store response
    let data = await response.json();

    console.log(data);
    //acess quote
    quote=data.content;

    //spilit the quotes by characters and wrap each char in a span tag and form a array of characters wrapped around spans
    let arr = quote.split("").map((value) =>{
        //wrap the characters in a span tag
        return "<span class ='quote-chars'>"+ value + "</span>";
    })
    quoteArea.innerHTML+=arr.join(""); //display in the quote area
    
};

//Logic for comparing user ip words with quote
userInput.addEventListener("input",() =>{

    let quoteChars=document.querySelectorAll(".quote-chars");
    //create an array from recieved span tags
    quoteChars = Array.from(quoteChars);
    //array of user input characters
    let userInputChars = userInput.value.split("");

    //loop through each char in quote
    quoteChars.forEach((char,index) =>{

        //check if curr quote char == userInputChar[index](i.e user entered input char at the same index)
        if(char.innerText == userInputChars[index]){
            //mark it with success class tag
            char.classList.add("success");
        }

        //if user has not entered anything or backspaced
        else if(userInputChars[index]==null){
            //remove class if any
            if(char.classList.contains("success")){
                char.classList.remove("success");
            }
            //if user has backspaced the curr user ip char is erased so it should not be tagged wiht fail or success , its like user have never entered that char
            else if(char.classList.contains("fail")){
                char.classList.remove("fail");
                --mistakes; //as it was marked fail so mistake count is decremented as its not considered fail anymore
                document.getElementById("mistakes").innerText = mistakes;
            }
        }
        //if user enter wrong character
        else{
            //if the current quote char is not tagged fail and curr user i/p char is not matching with the quote char at the same pos
            if(!char.classList.contains("fail") && !(userInputChars[index]===char.innerText)){
                //increment and display mistakes
                ++mistakes;
                char.classList.add("fail");
            }
            document.getElementById("mistakes").innerText=mistakes;
        }
        //returns true if all the characters are entered correctly
        let check = quoteChars.every((element) =>{
            return element.classList.contains("success");
        });
        //ends test if all characters are correct
        if(check){
            displayResult(); //displays the result
        }
    });

});

//update timer on screen
function updateTimer(){
    //End test if timer reaches 0
    if(time==0){
        displayResult();
    }
    else{
        //else reduce time by 1
        document.getElementById("timer").innerText= --time+"s";
    }
}

//sets off the timer
//reduces time by 1 s each sec
const timeReduce = ()=>{
    timer = setInterval(updateTimer,1000);
}

//End Test
const displayResult = () => {
    resultDiv.style.display="block"; //make the result block visible
    clearInterval(timer);
    stopTestButton.style.display="none";
    startTestButton.style.display="block";
    userInput.disabled=true; //disable the text area
    let timeTaken =1; //if time taken is 60 sec's
    //if time taken <60
    if(time!=0){
        timeTaken = (60 - time)/60;
    }
    //wpm calculation forumula
    wpm.innerText = (userInput.value.length/ 5 /timeTaken ).toFixed(2) + " wpm";
    //accuracy calculation formula
    accuracy.innerText =  Math.round(
        ((userInput.value.length - mistakes) / userInput.value.length) * 100
      ) + " %";

};
//function invoked on start test click
const startTest = () => {
    mistakes=0;
    document.getElementById("mistakes").innerText = mistakes;
    userInput.value="";
    timer="";
    time=60;
    userInput.disabled=false; //text area becomes enabled
    timeReduce(); //start the timer
    startTestButton.style.display="none"; //hide start test button
    stopTestButton.style.display="block";  //enable stop test button
    resultDiv.style.display="none";
    randomQuote(); //generates a random quote
    
}

randomQuote(); //generates a random quote






