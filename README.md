curl -v --request POST --form 'parameters={"filehash":"a653d89d3e679d1f73605af7f2c9dee3e0b70d27", "boardType":"linuxhost", "compileType":"tinysim"};type=application/json' --form "file=@bin/tinysim.zip;type=application/octet-stream"  http://kubernetes.tinylink.cn/linklab/compilev2/api/compile

curl -v -o bin/result.zip http://kubernetes.tinylink.cn/linklab/compilev2/api/compile/block\?filehash\="a653d89d3e679d1f73605af7f2c9dee3e0b70d27"\&boardtype\="linuxhost"\&compiletype\="tinysim"

现阶段问题：
1.对各类开发板提供两种方式上传文件
2.对每个设备能够单独保存日志
3.浏览器兼容