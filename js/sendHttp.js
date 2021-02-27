let user_token = "";
//map

//发送登陆请求————已测试
function sendLoginRequest(){
    let payload =  {
      "id":"UserTest",
      "password":"6b51d431df5d7f141cbececcf79edf3dd861c3b4069f0b11661a3eefacbba918"
    };
    $.ajax({
        url: "http://kubernetes.tinylink.cn/linklab/device-control-v2/login-authentication/user/login",
        async: false,
        method: 'POST',
        dataType: 'json',
        data: JSON.stringify(payload),
        processData: false,
        headers: { "Content-Type": "application/json" },
        success: function (data) {
      //    alert(JSON.stringify(data));
          user_token = data.data.token;
          //console.log(data.data.token);
          //这里的token是string类型的
          console.log(user_token);
        },
        error: function(data, status){
          alert(status);
        }
    });
};

let filemap = {};//用于存储文件名和hash值的对应关系
//发送烧写文件上传请求——已完成
function sendUploadRequest() {
    var input = document.createElement("input");
    input.type = "file";
    input.click();
    input.onchange = function(){

      // let form1 = new FormData();
      // form1.append('parameters', '{"boardname":"ESP32DevKitC"}');
      // form1.append("type", "application/json");
      // let form2 = new FormData();
      // let file = input.files[0];
      // fileShow.value = file.name;
      // form2.append("file", file); //第一个参数是后台读取的请求key值
      // form2.append("type", "application/octet-stream"); //实际业务的其他请求参数

      let form = new FormData();
      let obj =  $("#board-select")[0];
      let val = obj.options[obj.selectedIndex].innerText;
      console.log(val);
      let str = '{"boardname":"'+ val +'"}';
      console.log(str);
      form.append('parameters', str);
      form.append("type", "application/json");
      let file = input.files[0];
      fileShow.value = file.name;
      form.append("file", file); //第一个参数是后台读取的请求key值
      form.append("type", "application/octet-stream"); //实际业务的其他请求参数
     // console.log(form.get("type"));

      //let obj = {form1, form2};
      //为每一个设备进行一次文件的上传
      $.ajax({
        url: "http://kubernetes.tinylink.cn/linklab/device-control-v2/file-cache/api/file",
      //  async: false,
        method: 'POST',
        headers: {
          "Authorization": user_token
        },
        dataType: 'json',
        // data: obj, 
        data: form,
        processData: false,
        contentType: false,
        success: function (data) {
       //   alert(JSON.stringify(data));
          //let filehash = data.data.filehash;
          filemap[file.name] = data.data.filehash;
          console.log(filemap[file.name]);
        },
        error: function(data, status){
          alert(status);
        }
    });
  }
};

//查看日志请求
function viewLogs(){
  let log_url = "logs.html?" + user_token;
  window.open(log_url, "_blank");
  
}

//发送烧写任务提交请求————已测试
function sendBurnRequest(){

    let tasks = [];
    let cnt = 0;

    $("tbody").find("tr").each(function() {
      n = $(this).index(); 
      let new_task = new Object();//每个元素都是一个json对象
      new_task.boardname = $(this).find("td:eq(0)").text();
      new_task.deviceid = $(this).find("td:eq(1)").text();
      new_task.runtime = 30;
      new_task.clientid = $(this).find("td:eq(3)").text();
      //console.log($(this).find("td:eq(3)")[0]);
      let firmware_list = $(this).find("td:eq(4)");
      //console.log(firmware_list[0].children[0].length);
      for(let i = 0; i < firmware_list[0].children[0].length; i++){
        let filename = firmware_list[0].children[0].children[i].textContent;
        console.log(filename);
        new_task.filehash = filemap[filename];
        cnt++;
        new_task.taskindex = cnt;
        tasks.push(new_task);
      }
    //  console.log(n);
    });

    //封装task的数据结构
    console.log(tasks);
    let burn_obj = {};//最后要发送的是burn_obj的json字符串
    burn_obj.tasks = tasks;
    $.ajax({
        url: "http://kubernetes.tinylink.cn/linklab/device-control-v2/user-service/api/device/burn",
        method: 'POST',
        headers: {
            "Authorization": user_token
        },
        //contentType: 'application/json',
        dataType: 'json',
        data: JSON.stringify(burn_obj),
        processData: false,
        success: function (data) {
          alert(JSON.stringify(data));
        },
        error: function(data, status){
          alert(status);
          //alert("successfully entered the waiting queue!");
        }
    });
};

let boardNames = [];
//显示系统支持的设备种类————已测试
function sendShowBoradRequest() {
    $.ajax({
        url: "http://kubernetes.tinylink.cn/linklab/device-control-v2/user-service/api/board/list",
        async: false,
        method: 'GET',
        headers: {
            "Authorization": user_token
        },
        //contentType: 'application/json',
        dataType: 'json',
        processData: false,
        success: function (data) {
          let device_types = data.data.boards;
        //  alert(JSON.stringify(data));
       //   console.log(device_types);
          for(let i = 0; i < device_types.length; i++)
          {
            boardNames.push(device_types[i].boardname);
          }
          //alert(data.data.devices);
        },
        error: function(data, status){
          alert(status);
        }
    });
};

let url_str = 'http://kubernetes.tinylink.cn/linklab/device-control-v2/user-service/api/device/list\?boardname=all';
//console.log(str);

//记录收到的设备json数组
let devices_json;
//显示设备列表————已测试
function sendShowDevicesRequest() {
    $.ajax({
        url: url_str,
        async: false,
        method: 'GET',
        headers: {
            "Authorization": user_token
        },
        //contentType: 'application/json',
        dataType: 'json',
        processData: false,
        success: function (data) {
          devices_json = data;
       //   alert(JSON.stringify(devices_json));
        },
        error: function(data, status){
          alert(status);
        }
    });
}
//sendShowDevicesRequest();
let ws_url = "ws://kubernetes.tinylink.cn/linklab/device-control-v2/user-service/api/ws";


// function sendWebSocketRequest() {
//   $.ajax({
//       url: "http://kubernetes.tinylink.cn/linklab/device-control-v2/user-service/api/ws",
//       async: false,
//       method: 'GET',
//       headers: {
//           "Authorization": user_token
//       },
//       //contentType: 'application/json',
//       dataType: 'json',
//       processData: false,
//       success: function (data) {
//         devices_json = data;
//         alert(JSON.stringify(devices_json));
//       },
//       error: function(data, status){
//         alert(status);
//       }
//   });
// }

function sendWebSocketRequest() {
  let ws = new WebSocket(ws_url, user_token);
  ws.onopen=function(evt){
    ws.send(user_token);
  };
  ws.onmessage = function(evt) {
    console.log( "Received Message: " + evt.data);
    //ws.close();
  };
}

// var ws = new WebSocket(ws_url + user_token);

// ws.onopen=function(evt){
//   ws.send(user_token);
// };

// ws.onmessage = function(evt) {
//   console.log( "Received Message: " + evt.data);
//   //ws.close();
// };


//let val = obj.options[obj.selectedIndex].innerText;