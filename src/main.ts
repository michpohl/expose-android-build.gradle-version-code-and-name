import * as core from '@actions/core';
// import * as exec from '@actions/exec';
import * as fs from 'fs';

process.on('unhandledRejection', handleError)
main().catch(handleError)

async function main(): Promise<void> {
    try {
        // let printFile = getBooleanInput('print-file');
        let buildGradlePath = core.getInput('path');

        if (!fs.existsSync(buildGradlePath)) {
            core.setFailed(`The file path for the build.gradle does not exist or is not found: ${buildGradlePath}`);
            process.exit(1);
        }

        // if (printFile) {
        //     core.info('Before update:');
        //     await exec.exec('cat', [buildGradlePath]);
        // }

        let filecontent = fs.readFileSync(buildGradlePath).toString();
        fs.chmodSync(buildGradlePath, "600");

        const matches = filecontent.match(/versionCode\s*(\d+(?:\.\d)*)/mg);
        let code = "fail";
        if (matches) {
          code = matches[1];
        }
        console.log(code);
        setEnvironmentVariable('VERSION_CODE', code);
       
        // core.info(`build.gradle updated successfully with versionCode: ${versionCode} and versionName: ${versionName}.`);
    } catch (error) {
        core.setFailed(error.message);
    }
}

function handleError(err: any): void {
    console.error(err)
    core.setFailed(`Unhandled error: ${err}`)
}

const setEnvironmentVariable = (key: string, value: string) => {
  core.exportVariable(key, value);
};

// function getBooleanInput(inputName: string, defaultValue: boolean = false): boolean {
//     return (core.getInput(inputName) || String(defaultValue)).toUpperCase() === 'TRUE';
// }
