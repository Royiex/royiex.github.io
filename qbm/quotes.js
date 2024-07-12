const csvFilePath = 'other/quote.csv';

const getRandomInt = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

const readFile = async (filePath) => {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.onload = () => {
            if (xhr.status === 200) {
                resolve(xhr.responseText);
            } else {
                reject(new Error(`Failed to fetch file (status ${xhr.status})`));
            }
        };
        xhr.onerror = () => {
            reject(new Error('Failed to fetch file'));
        };
        xhr.open('GET', filePath);
        xhr.send();
    });
};

const getLineCount = async (contents) => {
    const lines = contents.split('\n');
    return lines.length;
};

const getLine = async (contents, lineNumber) => {
    const lines = contents.split('\n');
    if (lineNumber >= 0 && lineNumber < lines.length) {
        return lines[lineNumber];
    } else {
        throw new Error(`Line number ${lineNumber} not found in file`);
    }
};

const history = [];
let ci = -1;

const processCsv = async () => {
    try {
        const contents = await readFile(csvFilePath);
        const lineCount = await getLineCount(contents);
        const randomLineNumber = getRandomInt(0, lineCount - 1);

        history.push(randomLineNumber);
        ci++;

        const line = await getLine(contents, randomLineNumber);
        const [quote, name] = line.split(';');

        console.log(`Random line number: ${randomLineNumber}`);
        console.log(`Variable 1: ${quote}`);
        console.log(`Variable 2: ${name}`);

        document.getElementById("q1").textContent = quote;
        document.getElementById("n1").textContent = name;

    } catch (error) {
        console.error('Error:', error.message);
    }
};

const goBack = async () => {
    if (ci > 0) {
        ci--;
        const previousLineNumber = history[ci];

        try {
            const contents = await readFile(csvFilePath);
            const line = await getLine(contents, previousLineNumber);
            const [quote, name] = line.split(';');

            console.log(`Previous line number: ${previousLineNumber}`);
            console.log(`Variable 1: ${quote}`);
            console.log(`Variable 2: ${name}`);

            document.getElementById("q1").textContent = quote;
            document.getElementById("n1").textContent = name;
        } catch (error) {
            console.error('Error:', error.message);
        }
    } else {
        console.log('No previous lines to go back to.');
    }
};