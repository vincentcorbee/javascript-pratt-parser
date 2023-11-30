import { styler } from "@digitalbranch/styler"
import { TokenLocation } from "./types"
import { Token } from "./lexer/types"

export function highlightErrorToken(col: number, line: number)
{
    return function ({ value }: Token, loc: TokenLocation): string | null
    {
        if (loc.column - value.length === col && loc.line === line) return styler.red.brightRed.bold(value)

        return null
    }
}