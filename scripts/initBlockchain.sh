#!/bin/sh

#geth --dev --mine --minerthreads 1 --unlock 0 --password "ps" --exec 'loadScript("DeployGreeter.js")' console #

geth --dev --mine --minerthreads 1 --unlock 0 --password "ps"

geth attach ipc:/var/folders/s_/sc8s9f7j00z15tg80r7n3k900000gp/T/ethereum_dev_mode/geth.ipc