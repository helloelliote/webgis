# Tasks

## Update changelog

* Inside the 'tasks' folder, run the following with bin/bash

* In the example below, Revision range is set from v0.9.0 to v1.0.0

    `$ sh ./changelog.sh v0.9.0..v1.0.0 > ../changelog/v1.0.0.md`

    ...or in Intellij IDEA, `Run(^R)` the `changelog.sh` configuration as defined in `./idea/runConfigurations/changelog_sh.xml`

* For more details, refer to the `./tasks/changelog.sh` script.
