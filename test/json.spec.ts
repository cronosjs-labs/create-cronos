import { execaCommandSync } from 'execa'
import { expect, test } from 'vitest'

import { checkLocalInstall } from '../ci/checkLocalInstall';

test('check if local templates do not have local packages in package.json', () => {
    const check = checkLocalInstall("templates")
    expect(check).toBe(false)
}
)

test('check if the root package.json does not have local packages', () => {
    const check = checkLocalInstall()
    expect(check).toBe(false)
})