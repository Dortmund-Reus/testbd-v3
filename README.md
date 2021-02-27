curl -v --request POST --form 'parameters={"filehash":"a653d89d3e679d1f73605af7f2c9dee3e0b70d27", "boardType":"linuxhost", "compileType":"tinysim"};type=application/json' --form "file=@bin/tinysim.zip;type=application/octet-stream"  http://kubernetes.tinylink.cn/linklab/compilev2/api/compile

curl -v -o bin/result.zip http://kubernetes.tinylink.cn/linklab/compilev2/api/compile/block\?filehash\="a653d89d3e679d1f73605af7f2c9dee3e0b70d27"\&boardtype\="linuxhost"\&compiletype\="tinysim"

