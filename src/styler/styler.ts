import { StylerOptions } from './types'
import { stylerFactory } from './utils';
import { getAugmentendOptions } from './utils';

export class Styler {
  static create(options?: StylerOptions) {
    return stylerFactory(getAugmentendOptions(options));
  }
}

export const styler = Styler.create();
