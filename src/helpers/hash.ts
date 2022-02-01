// eslint-disable-next-line @typescript-eslint/no-var-requires
const sha512 = require('js-sha512');

export default (s) => sha512(s);
