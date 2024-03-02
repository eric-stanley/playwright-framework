import {
  FullConfig,
  FullResult,
  Reporter,
  Suite,
  TestCase,
  TestError,
  TestResult,
  TestStep,
} from "@playwright/test/reporter";
import colors from "colors";

colors.setTheme({
  silly: 'rainbow',
  input: 'grey',
  verbose: 'cyan',
  prompt: 'grey',
  info: 'green',
  data: 'grey',
  help: 'cyan',
  warn: 'yellow',
  debug: 'blue',
  error: 'red'
});

process.env.FORCE_COLOR = "true";

let totalTests = 0;
let i = 1;

const ansiRegex = new RegExp(
  "[\\u001B\\u009B][[\\]()#;?]*(?:(?:(?:[a-zA-Z\\d]*(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]*)*)?\\u0007)|(?:(?:\\d{1,4}(?:;\\d{0,4})*)?[\\dA-PR-TZcf-ntqry=><~]))",
  "g"
);
const stripAnsi = (str: string): string => str.replace(ansiRegex, "");

const getFormattedTime = () => `${new Date().toISOString()}`;

const roundSeconds = (seconds: number) =>
  Math.round((Math.abs(seconds) + Number.EPSILON) * 1000) / 1000;

const getDuration = (startTime: string, endTime: string) => {
  const firstDateInSeconds = new Date(startTime).getTime() / 1000;
  const secondDateInSeconds = new Date(endTime).getTime() / 1000;
  const difference = roundSeconds(firstDateInSeconds - secondDateInSeconds);
  if (difference < 60) {
    return `${difference} ${difference > 1 ? "seconds" : "second"}`;
  } else if (difference < 3600) {
    const minutes = Math.floor(difference / 60);
    let seconds = difference - minutes * 60;
    seconds = roundSeconds(seconds);
    return `${minutes} ${minutes > 1 ? "minutes" : "minute"} ${seconds} ${
      difference > 1 ? "seconds" : "second"
    }`;
  } else {
    const hours = Math.floor(difference / 3600);
    let seconds = difference - hours * 3600;
    const minutes = Math.floor(seconds / 60);
    seconds = seconds - minutes * 60;
    seconds = roundSeconds(seconds);
    return `${hours} ${hours > 1 ? "hours" : "hour"} ${minutes} ${
      minutes > 1 ? "minutes" : "minute"
    } ${seconds} ${difference > 1 ? "seconds" : "second"}`;
  }
};

let suiteStartTime: string, suiteEndTime: string;
let testStartTime: string, testEndTime: string;

export default class CustomReporter implements Reporter {
  onBegin = (config: FullConfig, suite: Suite): void => {
    suiteStartTime = getFormattedTime();
    totalTests = suite.allTests().length;
    console.log(
      colors.help(`${getFormattedTime()}:`,
      ``,
      colors.info(`Starting the run with ${suite.allTests().length} tests`),
      "\n")
    );
  };

  onEnd = (result: FullResult): void | Promise<void> => {
    suiteEndTime = getFormattedTime();
    console.log(
      colors.verbose(`${getFormattedTime()}:`,
      ``,
      colors.debug(`Finished the run with status`),
      result.status === "passed"
        ? colors.info(`${result.status}`)
        : colors.error(`${result.status}`),
      colors.warn(`\n\nOverall run duration: ${getDuration(suiteStartTime, suiteEndTime)}`)
      )
    );
  };

  onError = (error: TestError): void => console.error(colors.error(error));

  onStdErr = (
    chunk: string | Buffer,
    test: void | TestCase,
    result: void | TestResult
  ): void =>
    typeof chunk === "string"
      ? console.log(colors.error(chunk))
      : console.log(colors.error(chunk.toString()));

  onStdOut = (
    chunk: string | Buffer,
    test: void | TestCase,
    result: void | TestResult
  ): void =>
    typeof chunk === "string"
      ? console.log(colors.data(chunk))
      : console.log(colors.data(chunk.toString()));

  onStepBegin = (test: TestCase, result: TestResult, step: TestStep): void =>
    step.category === "test.step" &&
    console.log(
      colors.verbose(`${getFormattedTime()}:`,
      colors.info(` Started step: ${step.title}`))
    );

  onStepEnd = (test: TestCase, result: TestResult, step: TestStep): void =>
    step.category === "test.step" &&
    console.log(
      colors.verbose(`${getFormattedTime()}:`,
      colors.info(` Finished step: ${step.title}`))
    );

  onTestBegin = (test: TestCase, result: TestResult): void => {
    testStartTime = getFormattedTime();
    console.log(
      colors.warn(`Test ${i} of ${totalTests} - ${test.parent.title}`)
    );
    result.retry === 0
      ? console.log(
          colors.verbose(`${getFormattedTime()}:`,
          ` Started test`,
          colors.warn(`${test.title}`))
        )
      : console.log(
          colors.verbose(`${getFormattedTime()}:`,
          ` Retrying test... (attempt ${result.retry} of ${test.retries})`,
          colors.warn(`${test.title}`))
        );
  };

  onTestEnd = (test: TestCase, result: TestResult): void => {
    testEndTime = getFormattedTime();
    console.log(
      colors.verbose(`${getFormattedTime()}:`,
      ` Finished test`,
      colors.warn(`${test.title}`),
      `with status`,
      result.status === "passed"
        ? colors.info(`${result.status}`)
        : colors.error(`${result.status}`),
      `\n\nTest duration: ${getDuration(testStartTime, testEndTime)}\n`)
    );
    if (result.status === "failed") {
      console.log(stripAnsi(colors.error(result.error?.message) ?? ""));
      console.log(stripAnsi(colors.error(result.error?.stack) ?? ""));
    }
    if (result.status === "passed" || result.retry === 3) i++;
  };

  printsToStdio = (): boolean => true;
}
