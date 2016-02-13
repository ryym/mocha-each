
/**
 * Defines Mocha test cases for each given parameter.
 * @param {Array} parameters
 * @param {function} it - The 'it' function used in this function.
 *     If omitted, 'it' in global name space is used.
 * @return {Object} The object which has a method to define test cases.
 */
export default function forEach(parameters, it = global.it) {
  return {
    it(title, test) {
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
    }
  };
}
