#!/bin/bash

curl -v --request POST --form 'parameters={"filehash":"ab1ee5d986a218aca341cdd56d13d6bc194f6752", "boardType":"srf06-cc26xx", "compileType":"contiki"};type=application/json' --form "file=@cc2650.zip;type=application/octet-stream"  http://kubernetes.tinylink.cn/linklab/compilev2/api/compile

curl -v --request POST --form 'parameters={"filehash":"ad90cd3553cfdaf1e6433e35b75f8ba45be525e3", "boardType":"raspberrypi3", "compileType":"raspbian"};type=application/json' --form "file=@raspbian.zip;type=application/octet-stream"  http://kubernetes.tinylink.cn/linklab/compilev2/api/compile

curl -v --request POST --form 'parameters={"filehash":"f5ee43dc8b8d44356d45c20a7f5c4696aca35d63", "boardType":"sky", "compileType":"contiki-ng"};type=application/json' --form "file=@sky.zip;type=application/octet-stream"  http://kubernetes.tinylink.cn/linklab/compilev2/api/compile

curl -v --request POST --form 'parameters={"filehash":"98bca5e26f43055315c81dc79cda22d29950f3d2", "boardType":"esp32devkitc", "compileType":"alios"};type=application/json' --form "file=@alios.zip;type=application/octet-stream"  http://kubernetes.tinylink.cn/linklab/compilev2/api/compile

curl -v --request POST --form 'parameters={"filehash":"98bca5e26f43055315c81dc79cda22d29950f3d2", "boardType":"developerkit", "compileType":"alios"};type=application/json' --form "file=@alios.zip;type=application/octet-stream"  http://kubernetes.tinylink.cn/linklab/compilev2/api/compile

curl -v --request POST --form 'parameters={"filehash":"c6f5073b870aa8ba0e359b74de0df761079599e5", "boardType":"arduino:avr:mega:cpu=atmega2560", "compileType":"arduino"};type=application/json' --form "file=@arduino.zip;type=application/octet-stream"  http://kubernetes.tinylink.cn/linklab/compilev2/api/compile

curl -v --request POST --form 'parameters={"filehash":"c6f5073b870aa8ba0e359b74de0df761079599e5", "boardType":"arduino:avr:uno", "compileType":"arduino"};type=application/json' --form "file=@arduino.zip;type=application/octet-stream"  http://kubernetes.tinylink.cn/linklab/compilev2/api/compile

curl -v --request POST --form 'parameters={"filehash":"3a5c3a869d89f1b913c513b26377d6f771325f22", "boardType":"stm32f103", "compileType":"stm32"};type=application/json' --form "file=@stm32f103.zip;type=application/octet-stream"  http://kubernetes.tinylink.cn/linklab/compilev2/api/compile

