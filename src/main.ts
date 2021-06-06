import * as core from '@actions/core';
import * as fs from 'fs';

process.on('unhandledRejection', handleError)
main().catch(handleError)

function getBooleanInput(inputName: string, defaultValue: boolean = false): boolean {
  return (core.getInput(inputName) || String(defaultValue)).toUpperCase() === 'TRUE';
}

function setEnvironmentVariable(key: string, value: string) {
  core.exportVariable(key, value);
};

function getVersionCode(content: string): any {
  let versionCode;
  const codeMatches = content.match(/(versionCode [\d]*)/is);
  if (codeMatches) {
    const codeParts = codeMatches[0].split(" ");
    versionCode = codeParts[codeParts.length - 1]
  }
  return versionCode;
}

function getVersionName(content: string): any {

  let versionName;
  const nameMatches = content.match(/(versionName "[\s\S]*?")/is);

  if (nameMatches) {
    const nameParts = nameMatches[0].split("\"");
    versionName = nameParts[1];
  }
  return versionName;
}

function failWithMessage(message: string) {
  core.setFailed(message);
  process.exit(1);
}

async function main(): Promise<void> {
  try {
    let buildGradlePath = core.getInput('path');
    let shouldExposeCode = getBooleanInput('expose-version-code');
    let shouldExposeName = getBooleanInput('expose-version-name');

    if (!fs.existsSync(buildGradlePath)) {
      failWithMessage(`The file path for the build.gradle does not exist or is not found: ${buildGradlePath}`);
    }

    let fileContent = fs.readFileSync(buildGradlePath).toString();
    fs.chmodSync(buildGradlePath, "600");

    if (shouldExposeCode) {
      let code = getVersionCode(fileContent);
      if (code != null) {
        setEnvironmentVariable('ANDROID_VERSION_CODE', code);
        core.info(`Exposing ANDROID_VERSION_CODE with this value: ${code}.`);
      } else {
        failWithMessage('Version code could not be found in the file');

      }
    }

    if (shouldExposeName) {
      let name = getVersionName(fileContent);
      if (name != null) {
        setEnvironmentVariable('ANDROID_VERSION_NAME', name);
        core.info(`Exposing ANDROID_VERSION_NAME with this value: ${name}.`);
      } else {
        failWithMessage('Version name could not be found in the file');
      }
    }

  } catch (error) {
    core.setFailed(error.message);
  }
}

function handleError(err: any): void {
  console.error(err)
  core.setFailed(`Unhandled error: ${err}`)
}
