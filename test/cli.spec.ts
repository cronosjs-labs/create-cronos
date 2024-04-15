import { execaCommandSync } from 'execa'
import { expect, test } from 'vitest'

import config from '../config/config'

const proyects = config.projects;

const { stdout } = execaCommandSync('create-cronos --- -l all')

test('check if the the proyects defined in the config are shown in the cli', () => {
    for (let i = 0; i < proyects.length; i++) {
        expect(stdout).toContain(proyects[i].name)
    }
}
)