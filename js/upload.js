let fileShow = document.getElementById('file-show');
let tinysimFileShow = document.getElementById('tinysim-file-show');//记录tinysim上传文件
let upload_burn_button = document.getElementById('upload_burn');//上传要烧写的文件
let upload_compile_button = document.getElementById('upload_compile');//上传要编译的文件
let confirm_button = document.getElementsByClassName('add')[1];
let compile_button = document.getElementById('compile_btn');
let upload_list = document.getElementById('upload_list');
let download_button = document.getElementById('download_btn');
confirm_button.disabled = true;
compile_button.disabled = true;
download_button.disabled = true;
//let file_set = new Set();

//上传文件
function easyUpload(){
    sendUploadRequest();  
    // var input = document.createElement("input");
    // input.type = "file";
    // input.click();
    // input.onchange = function(){
    //   var file = input.files[0];
    //   var form = new FormData();
    //  form.append("file", file); //第一个参数是后台读取的请求key值
    //  form.append("fileName", file.name);
    //  form.append("other", "666666"); //实际业务的其他请求参数
   // fileShow.value = file.name;
      //console.log(file.size);
     // var xhr = new XMLHttpRequest();
      //var action = "http://localhost:8080/upload.do"; //上传服务的接口地址
      // xhr.open("POST", action);
      // xhr.send(form); //发送表单数据
      // xhr.onreadystatechange = function(){
      //   if(xhr.readyState==4 && xhr.status==200){
      //     var resultObj = JSON.parse(xhr.responseText);
      //     //处理返回的数据......
      //   }
      // }
      confirm_button.disabled = false;
    // }
  };

//删除文件操作
function deleteFile(e) {
  //e.target.innerHTML = "666";
  let box = e.target.parentNode;
 // console.log(box.parentNode);
  box.innerHTML = "";
  box.parentNode.removeChild(box);
};

//开始烧写操作
function startBurn() {
  if(tmp.length == 0){
    alert("烧写队列中没有设备!");
  }
  else {
    //alert(tmp);
    sendBurnRequest();
  }  
  tmp = "";
}

function update_file_box(e) {
  let tag = e.target.parentNode.children[0].innerText;
//    console.log(tag);
  $('#files-show').tagsinput('add', tag);
  if($('#nodes-show').val() != ""){
    $add_firmware_btn[0].disabled = false;
  } else {
    $add_firmware_btn[0].disabled = true;
  }
}


// 确认添加文件
function addNewFile(){
  filename = fileShow.value;
 // sendUploadRequest();
  let new_file_object = document.createElement('div');
  let new_file_name = document.createElement('span');
  let delete_button = document.createElement('button');
  let add_file_button = document.createElement('button');
  //console.log(fileShow.value);
  new_file_name.innerHTML = fileShow.value;
  new_file_object.setAttribute("class", "file");
  delete_button.setAttribute("class", "btn delete");
  delete_button.addEventListener("click", deleteFile);
  add_file_button.setAttribute("class", "btn burn");
  add_file_button.addEventListener("click", update_file_box);
  delete_button.innerHTML = "删除文件";
  add_file_button.innerHTML = "选择文件";
  new_file_object.appendChild(new_file_name);
  new_file_object.appendChild(delete_button);
  new_file_object.appendChild(add_file_button);
  upload_list.appendChild(new_file_object);
  fileShow.value = "";
  confirm_button.disabled = true;
};

let sha1_txt = "";
let file_to_compile;

//上传源码zip文件进行编译
function uploadToCompile(){
    var input = document.createElement("input");
    input.type = "file";
    input.click();
    input.onchange = function(){
      file_to_compile = input.files[0];
      tinysimFileShow.value = file_to_compile.name;
      //进行SHA1加密计算
      var fr = new FileReader;
      fr.onload = function(){
        var data = new Uint8Array(fr.result);
        var result = sha1(data);
        var hex = Array.prototype.map.call(result,function(e){
          return (e<16?"0":"")+e.toString(16);
        }).join("");
        //document.body.insertAdjacentHTML("beforeend","<p>"+hex+"</p>");
      //  alert(hex);
        sha1_txt = hex;
        console.log(sha1_txt);
    };//end of onload function
    fr.readAsArrayBuffer(this.files[0]);
  };
// document.querySelector("input").onchange=function(){
// };
  compile_button.disabled = false;
  download_button.disabled = true;
};


function compileFile(){
  let form = new FormData();
  let obj =  $("#board-select")[1];
  //let val = obj.options[obj.selectedIndex].innerText;
  let board_type = "linuxhost";
  let compile_type = "tinysim";
  console.log(board_type);
  let str = '{"filehash":"' + sha1_txt + '", "boardType":"'+ board_type + '", "compileType":"' + compile_type + '"}';
  console.log(str);
  form.append('parameters', str);
  form.append("type", "application/json");
  form.append("file", file_to_compile); //第一个参数是后台读取的请求key值
  form.append("type", "application/octet-stream"); //实际业务的其他请求参数
  $.ajax({
    url: "http://kubernetes.tinylink.cn/linklab/compilev2/api/compile",
  //  async: false,
    method: 'POST',
    dataType: 'json',
    // data: obj, 
    data: form,
    processData: false,
    contentType: false,
    success: function (data) {
      alert(JSON.stringify(data));
      //alert(data);
      //let filehash = data.data.filehash;
    //   filemap[file.name] = data.data.filehash;
  //    console.log(filemap[file.name]);
    },
    error: function(data, status){
      alert(status);
    }
  });//end of ajax
  download_button.disabled = false;
};

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

//下载文件到本地
function downloadZip(){

  //http://kubernetes.tinylink.cn/linklab/compilev2/api/compile/block\?filehash\=
  let download_url_str = 'http://kubernetes.tinylink.cn/linklab/compilev2/api/compile/nonblock\?filehash\='
                       + sha1_txt 
                       + '\&boardtype\=linuxhost'
                       + '\&compiletype\=tinysim';
  console.log(download_url_str);
  submitFile(download_url_str, "", "TinySimObj.zip");
  $.ajax({
    url: download_url_str,
    //async: true,
    method: 'GET',
   // dataType: 'binary',
    processData: false,
    contentType: false,
    success: function (data) {
      //alert(JSON.stringify(data));
      //alert(data);
    },
    error: function(data, status){
      alert(status);
    }
  });//end of ajax
};

upload_burn_button.addEventListener("click", easyUpload);
upload_compile_button.addEventListener("click", uploadToCompile);
confirm_button.addEventListener("click", addNewFile);
compile_button.addEventListener("click", compileFile);
download_button.addEventListener("click", downloadZip);

// confirm_button.on('click', function() {
//   $(this).text("文字改变了");
// });

// $(function(){
//   $("#test").click(function(){
//     $(this).text("666");
//   });
// }); 