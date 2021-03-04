//这个文件要在main.js之前加载
let sitesName = ["北京", "杭州", "南京"];


//记录boardType与compileType的对应关系

let deviceMap = new Map();
deviceMap.set("esp32devkitc", "alios");
deviceMap.set("developerkit", "alios");
deviceMap.set("sky", "contiki-ng");
deviceMap.set("stm32f103ve", "keil5");
deviceMap.set("linuxhost", "tinysim");
deviceMap.set("haas100", "alios-haas");

//记录boardType与boardName的对应关系
let deviceMap2 = new Map();
deviceMap2.set("esp32devkitc", "ESP32DevKitC");
deviceMap2.set("developerkit", "DeveloperKit");
deviceMap2.set("sky", "TelosB");
deviceMap2.set("stm32f103ve", "远程不支持");
deviceMap2.set("linuxhost", "TinySim");
deviceMap2.set("haas100", "Haas100");

// deviceMap.forEach((element, key) =>{
//     console.log(key + " " + element);
// });