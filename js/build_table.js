//这个脚本文件是为了建表

let devices = {
        "BoardName": "esp32",
        "Device_id": "esp32-1.1",
        "Status": "busy",
        "Client_id": "iot_node",
        "FirmWare_list": ""
    };
  
function generateTableHead(table, data) {
    let thead = table.createTHead();
    let row = thead.insertRow();
    for (let key of data) {
        let th = document.createElement("th");
        let text = document.createTextNode(key);
        th.appendChild(text);
        row.appendChild(th);
    }
}
  
function generateTable(table, device) {
    let row = table.insertRow();
    for (key in device) {
        let cell = row.insertCell();
        let text = document.createTextNode(device[key]);
        cell.appendChild(text);
    }
}

//点击设备之后，添加其到input中，并判断length,如果大于0就把按钮设为可点击
function update_input_box(e) {
   // console.log(e.target.tagName);
    if(e.target.tagName == "SELECT") {
        return;
    }
    let tag = e.target.parentNode.children[1].innerText;
//    console.log(tag);
    $('#nodes-show').tagsinput('add', tag);
    $del_btn[0].disabled = false;
    $reset_btn[0].disabled = false;
    if($('#files-show').val() != ""){
        $add_firmware_btn[0].disabled = false;
    }
    
}

//插入一个新行
function insertNewRow(type, device_id, status, group, firmware) {
    let tmp_text_node;
    let row = table.insertRow();

    let cell_type = row.insertCell();
    tmp_text_node = document.createTextNode(type);
    cell_type.appendChild(tmp_text_node);
    cell_type.addEventListener("click", update_input_box);

    let cell_device_id = row.insertCell();
    tmp_text_node = document.createTextNode(device_id);
    cell_device_id.appendChild(tmp_text_node);
    cell_device_id.addEventListener("click", update_input_box);

    let cell_status = row.insertCell();
    tmp_text_node = document.createTextNode(status);
    cell_status.appendChild(tmp_text_node);
    cell_status.addEventListener("click", update_input_box);

    let cell_group = row.insertCell();
    tmp_text_node = document.createTextNode(group);
    cell_group.appendChild(tmp_text_node);
    cell_group.addEventListener("click", update_input_box);

    let cell_firmware = row.insertCell();
};

//删除选中的设备
function deleteDevices() {
   let all_devices = $('#nodes-show').val();  
    $("tbody").find("tr").each(function() {
        n = $(this).index(); 
        let name = $(this).find("td:eq(1)").text();
        if(all_devices.indexOf(name) !== -1) {
            // do stuff with the string
            mySet.delete(name);
            $("tbody").find("tr:eq("+n+")").remove();
        }
    });
    $('#nodes-show').tagsinput('removeAll');
    // $add_btn[0].disabled = true;
    $del_btn[0].disabled = true;
    $reset_btn[0].disabled = true;
    $add_firmware_btn[0].disabled = true;
    //如果全部删光了，就把表清了
    if(mySet.size == 0){
        $("table").find("tr").remove();
    }
};

//为选中的设备添加文件
function addFirmware() {
   let all_devices = $('#nodes-show').val();  
   let all_files = $('#files-show').val();
   if(all_files.length == 0) return;
   let files_name = all_files.split(",");
    $("tbody").find("tr").each(function() {
        n = $(this).index();
        let name = $(this).find("td:eq(1)").text();
        let select_td = $(this).find("td:eq(4)")[0];
        if(all_devices.indexOf(name) !== -1) {
            // do stuff with the string
            let cnt = 0;
            if(select_td.children.length != 0){   
                for (let item of files_name) {
                    let opt = document.createElement('option');
                    opt.innerText = item;
                    opt.value = cnt;
                    select_td.children[0].appendChild(opt);
                    cnt++;
                }
            } else {
                let new_select = document.createElement('select');
                for (let item of files_name) {
                    let opt = document.createElement('option');
                    opt.innerText = item;
                    opt.value = cnt;
                    new_select.appendChild(opt);
                    cnt++;
                }
                select_td.appendChild(new_select);
            }
        }
    });
    $('#files-show').tagsinput('removeAll');
};

let tmp = "";           //实时记录烧写队列中的设备

let $del_btn = $('#delete_device');
let $reset_btn = $('#reset');
let $add_firmware_btn = $('#add_firmware');

$del_btn[0].disabled = true;
$reset_btn[0].disabled = true;
$add_firmware_btn[0].disabled = true;
let table = document.querySelector("table");
let data = Object.keys(devices);

$del_btn.on("click", deleteDevices);
$reset_btn.on("click", function(){
    $('#nodes-show').tagsinput('removeAll');
    $del_btn[0].disabled = true;
    $reset_btn[0].disabled = true;
    $add_firmware_btn[0].disabled = true;
});
let devices_set = new Set();

$add_firmware_btn.on("click", addFirmware);

let new_device_boardName;
let new_device_status;
let new_device_id;
let new_device_clientId;

