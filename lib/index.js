
/**
 * Defines Mocha test cases for each given parameter.
 */
export default function itEach(
  testName, parameters, testBody, it = global.it
) {
  if (typeof it !== 'function') {
    throw new Error('itEach: Mocha is not found');
  }

  // When the testName is omitted.
  if (typeof parameters === 'function') {
    it = testBody || it;
    testBody = parameters;
    parameters = testName;
    testName = `handles`;
  }

  const makeTestName = (typeof testName === 'function')
    ? testName
    : param => `${testName} ${JSON.stringify(param)}`;

  parameters.forEach(param => {
    const args = Array.isArray(param) ? param : [param];
    it(makeTestName(...args), () => testBody(...args));
  });
}

