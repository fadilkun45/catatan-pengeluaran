import { expect, it } from 'vitest'
import { HelperFunction } from './HelperFunc'

it('textColorFor picks readable text color', () => {
    expect(HelperFunction.textColorFor('#ECC94B')).toBe('#1A202C') // kuning -> teks gelap
    expect(HelperFunction.textColorFor('#FFFFFF')).toBe('#1A202C')
    expect(HelperFunction.textColorFor('#4299E1')).toBe('#FFFFFF') // biru -> teks putih
    expect(HelperFunction.textColorFor('#000000')).toBe('#FFFFFF')
})
