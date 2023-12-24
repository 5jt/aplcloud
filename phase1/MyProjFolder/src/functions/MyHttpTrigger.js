const { app } = require('@azure/functions');

// https://stackoverflow.com/questions/12941083/execute-and-get-the-output-of-a-shell-command-in-node-js
const { promisify } = require('util');
const exec = promisify(require('child_process').exec);

app.http('MyHttpTrigger', {
    methods: ['GET', 'POST'],
    authLevel: 'anonymous',
    handler: async (request, context) => {
        const fs = require('node:fs');

        context.log(`Http function processed request for url "${request.url}"`);

        const name = request.query.get('name') || await request.text() || 'world';
        fs.writeFileSync( 'd:\\home\\input.txt', name );

        const aplOutput = await exec('aplwr.exe reverser.w3');

        if (aplOutput.error) {
            return { body: `error: ${aplOutput.error.message}`};
        } else if (aplOutput.stderr) {
            return { body: `stderr: ${aplOutput.stderr}`};
        } else {
            // read and return file written by APL
            const rslt = fs.readFileSync( 'd:\\home\\output.txt' );
            return { body: `Hello from APL, ${rslt}!` };
        }
    }
});
