function setting(defaultValue: string): any {
  function settingExperimental(target: unknown, property: string | symbol) {
    console.log('settingExperimental', { defaultValue, target, property });
    target[property] = process.env[String(property)] || defaultValue;
  }
  function settingTC39(_target: unknown, context: ClassFieldDecoratorContext) {
    return function () {
      console.log('settingTC39', { defaultValue, target: this, context });
      return process.env[String(context.name)] || defaultValue;
    };
  }
  return function (
    target: unknown,
    context: string | symbol | ClassFieldDecoratorContext
  ) {
    if (typeof context !== 'object') {
      settingExperimental(target, context);
    } else {
      settingTC39(target, context);
    }
  };
}

console.log('CLASS DECLARATION.');
class Config1 {
  @setting('default_1') SETTING_ONE: string;
}
class Config2 extends Config1 {
  @setting('default_2') SETTING_TWO: string;
}

console.log('OBJECT INSTANTIATION.');
const configInstance = new Config2();
console.log({
  prototype1: Config1.prototype,
  prototype2: Config2.prototype,
  SETTING_ONE: configInstance.SETTING_ONE,
  SETTING_TWO: configInstance.SETTING_TWO,
});

console.log('DONE.');
