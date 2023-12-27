const btns = document.querySelectorAll('.lwrbtns , .uprbtns');
const sl = document.querySelector('#screenLeft');
    const sc = document.querySelector('#screenCenter');
    const sr = document.querySelector('#screenRgt');
    const sm = document.querySelector('#memIndicator');

let curval = ['+'];
let lastOperation = '+';
let curOperation = '';
let preval = 0;
let curLength = 0;
const maxLength = 9;
let lastInput = '';
let membuff = 0;
let isOff = false;



//flag:
let isDot = false; //signifies if dot is inputted
let err = false;


btns.forEach((btn) => {
    btn.addEventListener('click' , function() {
        clicked(btn.dataset.type , btn.value)
    }); //window[f](val) is used instead of f(val) so that function is not executed while assigning event listener
});

function clear() {
    curLength = 0;
    curOperation = '';
    curval = ['+'];
    isDot = false;
}

function allclear() {
    clear();
    err = false;
    lastOperation = '+';
    preval = 0;

}

function memop(value) {
    switch(value) {
        case 'clear':
            membuff = 0;
            break;

        case 'read': //read from buff
            curval = ['+' , `${membuff}`];
            break;

        case '-':
            operate();
            membuff -= preval;
            break;

        case '+':
            operate();
            membuff += preval;
            break;
    }
}


function operate() {
    const curvalstr = curval.join('');
    if(curvalstr.length != 1) {
        switch(lastOperation) {
            case '+':
                preval += parseFloat(curvalstr);
                break;

            case '-':
                preval -= parseFloat(curvalstr);
                break;

            case '*':
                preval *= parseFloat(curvalstr);
                break;

            case '/':
                if(parseFloat(curvalstr) == 0) err = true;
                else preval /= parseFloat(curvalstr);
                break;
        }
    }
    lastOperation = curOperation; //reset
    clear();
    
}

function clicked(type , value) {
    
    if(err) {
        if(type == 'clear') {
            allclear();
        }
    }
    else {
        switch(type) {
            case 'operation':
                curOperation = value;
                operate();
                break;

            case 'mem':
                memop(value);
                break;

            case 'digit':
                if(lastInput == 'equal') allclear();
                if(curLength < maxLength){ //curlength is incremented at disp
                    curval.push(value);
                }
                if(curval.length == 2) {
                    curval[0] = '+';
                }
                break;

            case 'unit': //%, behaves like = except it divides preval by 100
                operate();
                preval /= 100;
                break;

            case 'prefix': //+/_ 
                if(curval[0] == '+') curval[0] = '-';
                else curval[0] = '+';
                break;

            case 'root': //root, behaves like equal
                operate();
                preval = Math.sqrt(preval);
                break;

            case 'postfix': //dot
                if(!isDot)
                    curval.push('.');
                break;
            
            case 'equal':
                operate();
                break;
            
            case 'clear':
                if(value == 'allclear' || lastInput == 'equal') allclear();
                else {
                    clear();
                }

        }
        
    }
    disp(type , value); //displays cur buffer and operation
    lastInput = type;
}

function disp(type , value) { //displays preval, make sure to round ans to maxlength 

    if(err) {
        sm.textContent = '';

        sr.textContent = '';
        sc.textContent = 'ERR'
    }
    //display curval
    else {
        
        switch(type) {
            case 'operation':
                sr.textContent = value;
                break;

            case 'digit':
                if(curval.length == 2) { //if last input is a operation instead of buffer modifier
                    sc.textContent = ''; 
                    sr.textContent = ''; 
                }
                if(curLength < maxLength) {
                    sc.textContent += value;
                    curLength++;
                }
                break;

            case 'prefix':
                if(sc.textContent[0] != '-')
                    sc.textContent = '-' + sc.textContent;

                else 
                    sc.textContent = sc.textContent.slice(1);

                break;

            case 'root':
                sc.textContent = preval.toPrecision(9) / 1;
                break;
            
            case 'postfix': 
                if(!isDot)
                    sc.textContent += '.';
                isDot = true;
                break;

            case 'unit':
                sc.textContent = preval.toPrecision(9) / 1;
                break;

            case 'clear':
                sc.textContent = '0';
                sr.textContent = '';
                break;

            case 'equal':
                sr.textContent = '';
                sc.textContent = preval.toPrecision(9) / 1; //string divided by number yields number. the /1 is used to remove trailing 0;
                break;

            case 'mem':
                switch(value) {
                    case 'clear':
                        sm.textContent = '';
                        break;

                    case'+': case'-':
                        sm.textContent = 'm';


                    case 'read': 
                        sc.textContent = `${membuff}`;
                        break;

                }
                
        }
    }
}


