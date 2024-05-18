import { ParseRules, PrattParser } from "./types"
import {
  identifier,
} from "./parse-functions"

export const STD = {

} as unknown as ParseRules

export const NUD = {
  "eof": {},
  "colon": {
    nud: function(parser: PrattParser) {

    }
  },

  "identifier": {
    nud: function(parser: PrattParser) {
      console.log(parser.symbol, 'foo')

      parser.setState('initial')


    }
  },
  "assign": {
    nud: function(parser: PrattParser) {
      console.log('foo')

    }
  }
} as unknown as ParseRules

export const LED = {
} as unknown as ParseRules