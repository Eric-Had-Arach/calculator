//---------------------------------------OBJECTS THAT CONTAIN VARIABLES-----------------------------------

const buttons = {
  buttonsNumbers: Array.from(document.body.querySelectorAll('.number')),
  buttonsOperators: Array.from(document.body.querySelectorAll('.operator')),
  otherButtons: Array.from(document.body.querySelectorAll('.other-button')),
};

const texts = {
  textNumbers: buttons.buttonsNumbers.map(function(element) { return element.dataset.button; }),
  textOperators: buttons.buttonsOperators.map(function(element) { return element.dataset.button; }),
  textOtherButtons: buttons.otherButtons.map(function(element) { return element.dataset.button; }),
};

const flags = {
  previousTextButton: null,
  currentTextButton: null,
  number1: null,
  number2: null,
  decimalNumber1: false,
  decimalNumber2: false,
  operator: null,
  thereIsOperator: false,
};

const display = {
  reference: document.body.querySelector('.display'), 
};
display.reference.textContent = '';


//------------------------------------------------------FUNCTIONS------------------------------------------------------
function add(a, b) { return a+b; } 

function subtract(a, b) { return a-b; }

function multiply(a, b) { return a*b; } 

function divide(a, b) { return a/b; }

function operate(operator, number1, number2) {
  return (operator==='+') ? add(number1, number2) :
         (operator==='-') ? subtract(number1, number2) :
         (operator==='*') ? multiply(number1, number2) :
                            divide(number1, number2);
}

function clearDisplay(flags, display) {
  display.reference.textContent = '';
  flags.number1 = null;
  flags.number2 = null;
  flags.decimalNumber1 = false;
  flags.decimalNumber2 = false;
  flags.previousTextButton = null;
  flags.currentTextButton = null;
  flags.operator = null;
  flags.thereIsOperator = false;
}

function setResult(flags, display) {
  if (flags.operator==='/' && flags.number2==='0') {
    alert('Math error');
    clearDisplay(flags, display);
  }
  else {
    if (flags.number2!==null) {
      flags.number1 = (operate(flags.operator, parseFloat(flags.number1), parseFloat(flags.number2))).toFixed(2);
      flags.decimalNumber1 = false;
    }
    flags.number2 = null;
    flags.decimalNumber2 = false;
    //the result is calculated by pressing '='
    if (flags.currentTextButton==='Enter') {
      flags.operator = null;
      flags.previousTextButton = null;
    }
    //the result is calculated as a result of pressing an operator
    else {
      flags.operator = flags.currentTextButton;
      flags.previousTextButton = flags.currentTextButton;
    }
    display.reference.textContent = flags.number1;
  }
}

function setFirstNumber(flags, display) {
  //calculator just started or the last one was a deletion
  if (flags.number1===null) {
    flags.number1 = flags.currentTextButton;
    flags.previousTextButton = flags.number1;
    display.reference.textContent = flags.number1;
  }
  //the first number is being formed (already has at least one digit)
  else {
    flags.number1 += flags.currentTextButton;
    flags.previousTextButton = flags.currentTextButton;
    display.reference.textContent = flags.number1;
  }
}

function setFirstOperator(flags) {
  flags.thereIsOperator = true;
  flags.operator = flags.currentTextButton;
  flags.previousTextButton = flags.currentTextButton;
}

function setSecondNumber(flags, display) {
  if (flags.number2===null) {
    flags.number2 = flags.currentTextButton;
    flags.previousTextButton = flags.currentTextButton;
    display.reference.textContent = flags.number2;
  }
  else {
    flags.number2 += flags.currentTextButton;
    flags.previousTextButton = flags.currentTextButton;
    display.reference.textContent = flags.number2;
  }
}

function setDecimal(flags) {
  //decimal point to number1
  if (flags.number2===null) {
    if (flags.decimalNumber1===false) {
      flags.number1 += '.';
      flags.decimalNumber1 = true;
    }
  }
  //decimal point to number2
  else {
    if(flags.decimalNumber2===false) {
      flags.number2 += '.';
      flags.decimalNumber2 = true;
    }
  }
}

function setDisplay(texts, flags, display, textButton) {
  flags.currentTextButton = textButton;
  //'AC' was pressed
  if (flags.currentTextButton==='Backspace') {
    clearDisplay(flags, display);
  }
  //'=' was pressed
  else if (textButton==='Enter' && flags.number1!==null && flags.number2!==null) {
    setResult(flags, display);
  }
  //'.' was pressed
  else if (textButton==='.') {
    setDecimal(flags);
  }
  //initial screen empty (due to calculator startup or deletion)
  else if (flags.number1===null) { 
    //ahora se presionó un número
    if (!isNaN(flags.currentTextButton)) {  
      setFirstNumber(flags, display);
    }
  }
  //screen already started but no operator has been pressed up to now
  //then only numbers were pressed before
  else if (flags.thereIsOperator===false) {
    //ahora se presionó un número
    if (!isNaN(flags.currentTextButton)) {
      setFirstNumber(flags, display)
    }
    //now an operator was pressed
    else if (texts.textOperators.indexOf(flags.currentTextButton) !== -1) {
      setFirstOperator(flags);
    }
  }
  //immediately before an operator (one operator only) was pressed.
  else if (texts.textOperators.indexOf(flags.previousTextButton)!==-1) {
    //now a number has been pressed
    if (!isNaN(flags.currentTextButton)) {
      setSecondNumber(flags, display);
    }
    //an operator was pressed again (change the old operator to the new one)
    else if (texts.textOperators.indexOf(flags.currentTextButton)!==-1) {
      flags.operator = flags.currentTextButton;
    }
  }
  //immediately before a number was pressed (there was only one operator)
  else if (flags.thereIsOperator===true && !isNaN(flags.previousTextButton)) {
    //ahora se apretó un número
    if (!isNaN(flags.currentTextButton)) {
      setSecondNumber(flags, display);
    }
    //now an operator was pressed
    else if (texts.textOperators.indexOf(flags.currentTextButton)!==-1) {
      setResult(flags, display);
    }
  } 
}

//---------------------------------------------------------EVENTS-----------------------------------------------------

//***CLICKS***

//Number buttons
for (let i=0; i<buttons.buttonsNumbers.length; i++) {
  buttons.buttonsNumbers[i].addEventListener('click', function() {
    setDisplay(texts, flags, display, texts.textNumbers[i]);
  });
}

//Operator buttons
for (let i=0; i<buttons.buttonsOperators.length; i++) {
  buttons.buttonsOperators[i].addEventListener('click', function() {
    setDisplay(texts, flags, display, texts.textOperators[i]);
  });
}

//'AC' button
buttons.otherButtons[0].addEventListener('click', function() {
    setDisplay(texts, flags, display, texts.textOtherButtons[0]);
});

//'=' button
buttons.otherButtons[1].addEventListener('click', function() {
  setDisplay(texts, flags, display, texts.textOtherButtons[1]);
});


//***KEYBOARD***

document.body.addEventListener('keydown', function(e) {
  setDisplay(texts, flags, display, e.key);
});
