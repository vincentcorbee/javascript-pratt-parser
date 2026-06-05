import { createSequences } from "./create-sequences";
import { regExpStyle, SRGParameters } from "../constants";
import { StylerInstance, SRGParameter, StylerOptions } from "../types";

export function stylerFactory(options: StylerOptions, styles?: Array<string | number>, parent?: StylerInstance) {
  function instance(this: StylerInstance, ...input: unknown[]): string {
    const [sequences, resetSequences] = createSequences(this.styles);

    const styledInput = input.join('').replace(regExpStyle, (...args) => `${args[1]}${args[2]}${sequences}`);

    return `${sequences}${styledInput}${resetSequences}`;
  }

  Object.defineProperties(instance, {
    styles: {
      value: (parent?.styles ?? []).concat(styles ?? []),
      writable: false
    },
    colorLevel: {
      value: options.colorLevel,
      writable: false
    }
  })

  const handler: ProxyHandler<StylerInstance> = {
    apply(target, _thisArg, args) {
      return target.call(target, ...args);
    },
    get(target, prop) {
      if (prop === 'rgb') {
        return function (r: number, g: number, b: number) {
          return stylerFactory(options, [`38;2;${r};${g};${b}`], target);
        }
      }

      if (prop === 'bgRgb') {
        return function (r: number, g: number, b: number) {
          return stylerFactory(options, [`48;2;${r};${g};${b}`], target);
        }
      }

      if (prop === 'fg256') {
        return function (color: number) {
          return stylerFactory(options, [`38;5;${color}`], target);
        }
      }

      if (prop === 'bg256') {
        return function (color: number) {
          return stylerFactory(options, [`48;5;${color}`], target);
        }
      }

      if (prop === 'orange') {
        return stylerFactory(options, [`38;2;255;165;0`], target);
      }

      const code = SRGParameters[prop as SRGParameter];

      if (code !== undefined) return stylerFactory(options, [code], target);

      return target[prop as keyof StylerInstance];
    },
  };

  return new Proxy(instance as StylerInstance, handler);
}