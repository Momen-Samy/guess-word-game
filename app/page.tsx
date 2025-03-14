'use client'
import React, { useEffect, useRef, useState } from "react";

export default function Home() {

  type LetterObject = {
    value: string;
    classname: string;
  };

  type inputsParams = {
    state: string;
    inputvals: LetterObject[];
  };

  const [inputs, setInputs] = useState<inputsParams[]>([]);

  const numbersOfTries = 6;
  // const numbersOfLettters = 6;

  const [numberOFHints ,setnumberOFHints] = useState(2);

  const [currentTry,setCurrentTry] = useState(1);

  const [showmessage, setShowMessgae] = useState("")

  const [refresh, setrefresh] = useState(true);

  const inputsRefs  = useRef<Array<Array<HTMLInputElement | null>>>([]);

  const checkButton = useRef<HTMLButtonElement | null>(null);
  const hintButton  = useRef<HTMLButtonElement | null>(null);

  const [wordToGuess, setWordToGuess] = useState({
    wordToGuess: "",
    theMeaningOfWord: "",
  });

  useEffect(() => {
    const inputColumn: inputsParams[] = [];
    for (let i = 0; i < numbersOfTries; i++) {
      inputColumn.push({
        state: i === 0 ? "not-disable" : "disable",
        inputvals: Array(wordToGuess.wordToGuess.length).fill(null).map(() => ({
          value: "",
          classname: "",
        })),
      });
    }
    setInputs(inputColumn);
  }, [refresh, wordToGuess]);

useEffect(() => {
  setTimeout(() => {
    if (inputsRefs.current[currentTry - 1] && inputsRefs.current[currentTry - 1][0]) {
      inputsRefs.current[currentTry - 1][0]?.focus();
    }
  }, 0);
}, [currentTry]);
  

  useEffect(() => {
    const words = [
      "programming", "update", "delete", "master", "branch", "mainly", "circle", "school"
    ];
    const meaningOfWords = [
      "برمجة", "تحديث", "يمسح", "يتقن", "فرع", "أساسي", "دائرة", "مدرسة"
    ];
    const randomNumber = Math.floor(Math.random() * words.length);
    setWordToGuess({
      wordToGuess: words[randomNumber].toUpperCase(),
      theMeaningOfWord: meaningOfWords[randomNumber]
    });
  }, [refresh]); 
  
  const handleRefresh = () => {
    if(hintButton.current && checkButton.current) {
      checkButton.current.disabled = false;
      hintButton.current.disabled = false;
    }
    setCurrentTry(1)
    setrefresh(!refresh)
    setShowMessgae("")
    setnumberOFHints(2);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>, letterIndex: number, tryIndex: number) => {
    const inputsClone = [...inputs];
    const letter = event.target.value.toUpperCase().replace(/[^A-Z]/g, "");
    inputsClone[tryIndex].inputvals[letterIndex].value = letter;
    inputsRefs.current[tryIndex][letterIndex + 1]?.focus();
    setInputs(inputsClone);
  };
  
  const handleHint = () => {
    const inputsClone = [...inputs];
    const NotDissabledInputs = inputsClone[currentTry - 1];

    const allFielsAreFull =
      NotDissabledInputs.inputvals.every(({value}) => value !== "")
      if(allFielsAreFull) {
        return ;
      } 

    while(true) {
      const randomNum = Math.floor(Math.random() * wordToGuess.wordToGuess.length)
      const randomLetter = wordToGuess.wordToGuess[randomNum]
        if(NotDissabledInputs.inputvals[randomNum].value === "") {
          NotDissabledInputs.inputvals[randomNum].value = randomLetter;
          break;
        }
    }

    setInputs(inputsClone)
    setnumberOFHints(numberOFHints - 1)
    if(numberOFHints === 1) {
      if(hintButton.current) {
        hintButton.current.disabled = true;
      }
    }
  }

  const GameLogic = () => {
    const inputsClone = [...inputs];
    const NotDissabledInputs = inputsClone[currentTry - 1];
  
    let isWordCorrect = true; 
  
    NotDissabledInputs.inputvals.forEach(({ value: letter }, index) => { 
      if (letter === wordToGuess.wordToGuess[index]) {
        inputsClone[currentTry - 1].inputvals[index].classname = "in-place";
      } else if (letter !== "" && wordToGuess.wordToGuess.includes(letter)) {
        inputsClone[currentTry - 1].inputvals[index].classname = "not-in-place";
        isWordCorrect = false; 
      } else {
        inputsClone[currentTry - 1].inputvals[index].classname = "wrong";
        isWordCorrect = false; 
      }
    });
  
    if (isWordCorrect) {
      if(hintButton.current && checkButton.current) {
        checkButton.current.disabled = true;
        hintButton.current.disabled = true;
        NotDissabledInputs.state = "disable";
      }
    } else {
      NotDissabledInputs.state = "disable";
      const nextInputs = inputsClone[currentTry]
      if(nextInputs) {
        nextInputs.state = "not-disable"
      } else {
        if(hintButton.current && checkButton.current) {
          checkButton.current.disabled = true;
          hintButton.current.disabled = true;
        }
        setShowMessgae(wordToGuess.wordToGuess.toLowerCase());
      }
      setCurrentTry(currentTry + 1)
    }
      setInputs(inputsClone);
  };
  

  const handleKeyDown = (
    tryIndex: number, 
    letterIndex: number, 
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    const inputsClone = [...inputs];
    if (event.key === "ArrowRight") {
      inputsRefs.current[tryIndex][letterIndex + 1]?.focus();
    } else if (event.key === "ArrowLeft") {
      inputsRefs.current[tryIndex][letterIndex - 1]?.focus();
    } else if (event.key === "Backspace") {
      if(letterIndex > 0) {
        if(inputsClone[tryIndex].inputvals[letterIndex].value === "") {
          inputsClone[tryIndex].inputvals[letterIndex - 1].value = "";
          inputsRefs.current[tryIndex][letterIndex - 1]?.focus();
          inputsClone[tryIndex].inputvals[letterIndex - 1].classname = ""
          setInputs(inputsClone)
        }
      } else {
        inputsClone[tryIndex].inputvals[letterIndex].value = "";
        setInputs(inputsClone)
      }
      inputsClone[tryIndex].inputvals[letterIndex].classname = ""
    } else if(event.key === "Enter") {
      GameLogic();
    }
  };

  return (
    <>
      <h1>Guess The Word Game</h1>
      <div className="guess-game">
        <div className="guess-area">
          {inputs.map((row, tryIndex) => (
            <div key={tryIndex} className={`try-${tryIndex + 1}`}>
              <span>try {tryIndex + 1} </span>
              {row.inputvals.map(({value, classname}, letterIndex) => (
                <input
                  key={letterIndex}
                  type="text"
                  maxLength={1}
                  value={value}
                  className={classname}
                  onChange={(event) => handleChange(event, letterIndex, tryIndex)}
                  onKeyDown={(event) => handleKeyDown(tryIndex, letterIndex, event)}
                  ref={(el) => {
                    if (!inputsRefs.current[tryIndex]) {
                      inputsRefs.current[tryIndex] = [];
                    }
                    inputsRefs.current[tryIndex][letterIndex] = el;
                  }}
                  disabled={row.state === "disable"}
                />
              ))}
            </div>
          ))}
          <div className="controls">
            <button 
              onClick={GameLogic}
              ref = {checkButton}
            >Check Word</button>
            <button ref={hintButton} onClick={handleHint}>
              {numberOFHints} Hints
            </button>
            <button onClick={handleRefresh}>regenerate word</button>
          </div>
        </div>
        <div className="key-colors">
          <h2>Key Colors</h2>
          <div className="key">
            <div className="key-color in-place"></div>
            <div className="key-text">Letter is correct and in place</div>
          </div>
          <div className="key">
            <div className="key-color not-in-place"></div>
            <div className="key-text">Letter is correct but not in place</div>
          </div>
          <div className="key">
            <div className="key-color wrong"></div>
            <div className="key-text">Letter is wrong</div>
            <br />
          </div>
          <div className="message">
              <span>
                { showmessage 
                  ? `sorry the word is`
                  : `الكلمة هي`
                }
                <span className="submsg">
                  {showmessage ? showmessage : ` ${wordToGuess.theMeaningOfWord}`}
                </span>
              </span>
            </div>
        </div>
      </div>

      <footer>Guess The Word Game created by React</footer>
    </>
  );
}

