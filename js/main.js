//主逻辑

// let addrShow = document.getElementById('addr-show');
let deviceShow = document.getElementById('device-show');
let add_dev_btn = document.getElementsByClassName('add')[0];
let site = document.getElementById('site');
let board = document.getElementById('board');
let device_id = document.getElementById('device_id');

// let log_area = document.getElementsByClassName('test_box')[0];
// log_area.attr("readonly", "readonly");

/*用于保存当前所选的各个状态*/
let current = {
    site: '',
    board: '',
    device_id: ''
};

/*自动加载地区列表*/
function showSites() {
    add_dev_btn.disabled = true;
    let len = sitesName.length;
    for (let i = 0; i < len; i++) {
        let siteOpt = document.createElement('option');
        siteOpt.innerText = sitesName[i];
        siteOpt.value = i;
        site.appendChild(siteOpt);
    }
};


/*根据所选城市加载板子列表*/
function showBoard(obj) {
    let val = obj.options[obj.selectedIndex].value;
    if (val != current.site) {
        current.site = val;
        deviceShow.value = '';
        add_dev_btn.disabled = true;
    }
   // add_dev_btn.disabled = true;

    if (val != null) {
        board.length = 1;
        let len = boardNames.length;
        for (let i = 0; i < len; i++) {
            let boardOpt = document.createElement('option');
            boardOpt.innerText = boardNames[i];
            boardOpt.value = i;
            board.appendChild(boardOpt);
        }
    }
};

//显示所有的板子类型
function showBoardAll() {
    let len = boardNames.length;
    for (let i = 0; i < len; i++) {
        let boardOpt = document.createElement('option');
        boardOpt.innerText = boardNames[i];
        boardOpt.value = i;
        board.appendChild(boardOpt);
    }

    for (let i = 0; i < len; i++) {
        let boardOpt = document.createElement('option');
        boardOpt.innerText = boardNames[i];
        boardOpt.value = i;
        $("#board-select")[0].appendChild(boardOpt);
    }


    let count = 0;
    deviceMap.forEach((element, key) =>{
        //console.log(key + " " + element);
        let boardOpt = document.createElement('option');
        boardOpt.innerText = key;
        boardOpt.value = count;
        ++count;
        $("#board-select2")[0].appendChild(boardOpt);
    });
    // let len2 =  deviceMap.length;
    // for (let i = 0; i < len2; i++) {
    //     let boardOpt = document.createElement('option');
    //     boardOpt.innerText = boardNames[i];
    //     boardOpt.value = i;
    //     $("#board-select2")[0].appendChild(boardOpt);
    // }
};

//实时记录选中的设备序号
// let selected_device = "";
let order;

/*根据所选的板子来显示设备列表*/
function showNodes(obj) {
    let val = obj.options[obj.selectedIndex].innerText;
    //console.log(val);
    if (val != current.board) {
        current.board = val;
        deviceShow.value = '';
        add_dev_btn.disabled = true;
    }
    
    url_str = 'http://kubernetes.tinylink.cn/linklab/device-control-v2/user-service/api/device/list\?boardname=' + val;
    sendShowDevicesRequest();
    //下面是我们返回的json对象
    //获取到的所有设备
    let devices_list = devices_json.data.devices;
    if (val != null) {
        device_id.length = 1; //清空之前的内容只留第一个默认选项
        let length = devices_list.length;
        //console.log(length);
        if(length == 0){
            deviceShow.value = "";
            return;
        }
        for (let n = 0; n < length; n++) {
            let device_idOpt = document.createElement('option');
            device_idOpt.innerText = devices_list[n].deviceid;
            device_idOpt.value = n;
            device_id.appendChild(device_idOpt);
        }
    }
}
//建立websocket链接

//var ws = new WebSocket("ws://kubernetes.tinylink.cn/linklab/device-control-v2/user-service/api/ws");

//sendWebSocketRequest();

//sendShowDevicesRequest();
//显示所有的设备节点
//如果没有选择板子类型，应当显示所有的设备
function showNodesAll()
{
    url_str = 'http://kubernetes.tinylink.cn/linklab/device-control-v2/user-service/api/device/list\?boardname=all';
    sendShowDevicesRequest();
    //下面是我们返回的json对象
    //获取到的所有设备
    let devices_list = devices_json.data.devices;
    let length = devices_list.length;
    //console.log(length);
    if(length == 0){
        deviceShow.value = "";
        return;
    }
    for (let n = 0; n < length; n++) {
        let device_idOpt = document.createElement('option');
        device_idOpt.innerText = devices_list[n].deviceid;
        device_idOpt.value = n;
        device_id.appendChild(device_idOpt);
    }
};

showSites();
sendLoginRequest();
//获取boardname
sendShowBoradRequest();
showBoardAll();
showNodesAll();

/*选择节点之后的处理函数*/
function selectNodes(obj) {
    current.device_id = obj.options[obj.selectedIndex].innerText;
    order =  obj.options[obj.selectedIndex].value;              //选中的设备序号
   // console.log(current.device_id);
    if (order != null) {
        add_dev_btn.disabled = false;
    }
}

let mySet = new Set();//记录当前的设备id
/*点击确定按钮显示用户所选的设备*/
//并将其添加到设备列表中去
function showDevice() {
    deviceShow.value = current.device_id; 
    new_device_boardName = devices_json.data.devices[order].boardname;
    new_device_id = devices_json.data.devices[order].deviceid;
    if(devices_json.data.devices[order].busy)
    {
        new_device_status = "busy";
    } else {
        new_device_status = "idle";
    }
    new_device_clientId = devices_json.data.devices[order].clientid;
    //如果表是空的，我们应当从头建表
    if(mySet.size == 0){
        //let new_device =  devices_obj.data.devices[order];
       // console.log(new_device);
        // data = Object.keys(new_device);
        // console.log(data);
        generateTable(table, devices);
        generateTableHead(table, data);
        insertNewRow(new_device_boardName,  new_device_id, new_device_status, new_device_clientId, "");
        mySet.add(new_device_id);
        table.deleteRow(1);//把一开始用于建表的那一行删掉
        // insertNewRow
        // mySet.add(new_device_id);
    } else if(mySet.has(new_device_id)){
        //不可以重复添加设备
        alert("不可以重复添加!");
        return;
    } else {
        insertNewRow(new_device_boardName,  new_device_id, new_device_status, new_device_clientId, "");
        mySet.add(new_device_id);
    }
}

