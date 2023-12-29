// const command = 'aplwr.exe reverser.w3';
// const message = "Hello from APL+Win";
const command = 'dyalogrt.exe reverser.dws';
const message = "Hello from Dyalog APL";

const { app } = require('@azure/functions');

// https://stackoverflow.com/questions/12941083/execute-and-get-the-output-of-a-shell-command-in-node-js
const { promisify } = require('util');
const exec = promisify(require('child_process').exec);

// filesystem root
const fsroot = 'D:\\home\\';

app.http('MyHttpTrigger', {
    methods: ['GET', 'POST'],
    authLevel: 'anonymous',
    handler: async (request, context) => {
        const fs = require('node:fs');
        let rslt = '(processing failed)';

        context.log(`Http function processed request for url "${request.url}"`);

        const name = request.query.get('name') || await request.text() || 'world';
        fs.writeFileSync( `${fsroot}input.txt`, name );

        const aplOutput = await exec(command);

        if (aplOutput.error) {
            rslt = `error: ${aplOutput.error.message}`;
        } else if (aplOutput.stderr) {
            rslt = `stderr: ${aplOutput.stderr}`;
        } else {
            // read and return file written by APL
            const eman = fs.readFileSync( `${fsroot}output.txt` );
            rslt = `${message}, ${eman}!` ;
        }
        context.log(rslt);
        return { body: rslt };
    }
});
