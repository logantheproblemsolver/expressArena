const express = require('express');

const morgan = require('morgan');

const app = express();


app.use(morgan('dev'));

app.get('/', (req, res) => {
    res.send('Hello world!');
});

app.get('/burgers', (req, res) => {
    res.send('We got juicy burgers here');
});

app.get('/pizza/pepperoni', (req, res) => {
    res.send('Your pizza is on the way');
});

app.get('/echo', (req, res) => {
    const responseText = `Here are some details about your request!:
    Base URL: ${req.baseURL}
    Host: ${req.hostname}
    Path: ${req.path}
    Params: ${req.params}
    Cookies: ${req.cookies}
    IP: ${req.ip}
    `;
    res.send(responseText)
})


app.get('/queryViewer', (req, res) => {
    console.log(req.query);
    res.send(req.query);
    res.end();
})

app.get('/greetings', (req, res) => {
    const name = req.query.name;
    const race = req.query.race;

    if (!name) {
        return res.status(400).send('Please provide a name!');
    } 
    if (!race) {
        return res.status(400).send('Please provide a race!');
    }

    const greeting = `Greetings ${name} the ${race}, welcoe to our kingdom`;

    res.send(greeting);
})


app.get('./sum', (req, res) => {

    const {a, b} = req.query;

    if(!a) {
        return res
                .status(400)
                .send('a is required');
    }
    if(!b) {
        return res 
                .status(400)
                .send('b is required');
    }

    const numberA = Number(a);
    const numberB = Number(b);

    if(Number.isNaN(numberA)) {
        return res 
                .status(400)
                .send('a should be a number');
    }
    if(Number.isNaN(numberB)) {
        return res 
                .status(400)
                .send('b should be a number');
    }

    const c = numberA + numberB;
    const responseString = `The sum of ${numberA} and ${numberB} is ${c}`

    res 
        .status(200)
        .send(responseString)

})


app.get('/cipher', (req, res) => {
    const {text, shift} = req.query;

    if(!text) {
        return res 
                .status(400) 
                .send('text is required')
    }
    if(!shift) {
        return res 
                .status(400)
                .send('shift is required')
    }

    const numShift = parseFloat(shift)

    if(Number.isNaN(numShift)) {
        return res 
                .status(400)
                .send('shift must be a number')
    }

    const base = 'A'.charCodeAt(0);

    const cipher = text
        .toUpperCase()
        .split('')
        .map(char => {
            const code = char.charCodeAt(0);
            if(code < base || code > (base + 26)) {
                return char
            }

            let diff = code - base;
            diff = diff + numShift;

            diff = diff % 26;

            const shiftedChar = String.fromCharCode(base + diff);
            return shiftedChar;
        })
        .join('');


    res 
        .status(200)
        .send(cipher)
})


app.get('./lotto', (req, res) => {
    const {numbers} = req.query;

    if(!numbers) {
        return res 
                .status(400)
                .send('a number is required');
    }


    if(!Array.isArray(numbers)) {
        return res 
                .status(400)
                .send('numbers must be an array')
    }



    const guesses = numbers 
            .map(n => partseInt(n))
            .filter(n => numbers.isNaN(n) && (n >= 1 && n <= 20));

    if(guesses.length !=6) {
        return res
                .status(400)
                .send('numbers must contain an arrray of 6 integers between 1 and 20')
    }

    const stockNumbers = Array(20).fill(1).map((_, i) => i + 1)


    const winningNumbers = [];
    for(let i=0; i < 6; i++) {
        const ran = Math.floor(Math.random() * stockNumbers.length);
        winningNumbers.push(stockNumbers[ran]);
        stockNumbers.splice(ran,1)
    }


    let diff = winningNumbers.filter(n => !guesses.includes(n))


    let responseText;

    switch(diff.length){
        case 0: 
            responseText = 'Wow! Unbelievable! You can have won the mega millions!'
            break;
        case 1: 
            responseText = 'Congratulations! You won $100!'
            break;
        case 2: 
            responseText = 'Congratulations, you win a free ticket!'
            break;
        default:
            responseText = 'Sorry, you lose'
    }

    res.json({
        guesses, 
        winningNumbers, 
        diff,
        responseText
    })

    res.send(responseText)

})




app.listen(8000, () => {
    console.log('Express server is listening to port 8000!')
});


