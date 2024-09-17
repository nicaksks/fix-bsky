export default class Exception extends Error {
  constructor(public readonly message: string) {
    super();
    this.message = message;
  }
}
