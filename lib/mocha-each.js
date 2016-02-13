
/**
 * Create a function which defines test cases for
 * each given parameter.
 * @private
 */
function makeTestCaseDefiner(parameters, it) {
  return function defineTestCases(title, test) {
    const makeTitle = (typeof title === 'function')
      ? title
      : (...args) => `${title} (case ${args.pop() + 1})`;

    parameters.forEach((param, index) => {
      const args = Array.isArray(param) ? param : [param];
      it(
        makeTitle(...[...args, index]),
        () => test(...args)
      );
    });
  };
}

/**
 * Defines Mocha test cases for each given parameter.
 * @param {Array} parameters
 * @param {function} it - The 'it' function used in this function.
 *     If omitted, 'it' in global name space is used.
 * @return {Object} The object which has a method to define test cases.
 */
export default function forEach(parameters, defaultIt = global.it) {
  const it = makeTestCaseDefiner(parameters, defaultIt);

  it.skip = makeTestCaseDefiner(
    parameters,
    defaultIt ? defaultIt.skip : undefined
  );

  it.only = function(title, test) {
    const only = makeTestCaseDefiner(parameters, defaultIt);
    global.describe.only('', () => {
      only(title, test);
    });
  };
  return { it };
}
