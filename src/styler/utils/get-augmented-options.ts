import { StylerOptions } from "../types";

import { colorSupport } from '../constants';

export const getAugmentendOptions = (options: StylerOptions = {} ): StylerOptions => {
  return {
    colorLevel: colorSupport.colorDepth.stdout,
    ...options
  }
}