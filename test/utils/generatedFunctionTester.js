class GeneratedFunctionTester {
  constructor(func) {
    this.func = func
    this.lambdaInstances = []
    this.aws = {
      config: {},
      Lambda: jest.fn().mockImplementation(() => {
        const invoke = jest.fn().mockReturnValue(Promise.resolve())
        this.lambdaInstances.push(invoke)
        return { invoke }
      })
    }
  }

  generatedWarmupFunction() {
    return new Function('dependencies', `
      console = {
        log: () => {}
      };
      const require = (dep) => {
        if (!dependencies[dep]) {
          throw new Error(\`Unknow dependency (\${dep})\`);
        }

        return dependencies[dep];
      };
      const module = { exports: {} };
      ${this.func}
      module.exports.warmUp();
    `)
  }

  executeWarmupFunction() {
    this.generatedWarmupFunction()({ 'aws-sdk': this.aws })
  }
} 

module.exports = { GeneratedFunctionTester };