// let user_token = "";
let tree_view = [];
let count = 0;
  //初始化tree_view
function init_tree(){

  boardNames.forEach((board) => {
    //对于每一个板子，都建立一个json对象
    let new_tree_node =  {'text':board, "tags":[''], "nodes":[]};
    // console.log(JSON.stringify(new_tree_node));
    
    // //对于每个new_tree_node，为其添加子节点
    // showNodes(new_tree_node);

    tree_view.push(new_tree_node);
    ++count;
  });
  console.log(JSON.stringify(tree_view));
  
}

//添加子节点
function addChildren(){

  //然后开始添加子节点
  let i = 0;
  while(i < count){
    // console.log(i);
    // let node_to_access = ;
    // console.log(typeof(node_to_access));
    // console.log(node_to_access);
    generateTree($("#treeview").treeview("getNode", i));
  // $("#treeview").treeview("addNode", [i, { node: { text: devices_list[n].deviceid, tags:["free"]} }]);
    ++i;
  }
}

// let url_str = 'http://kubernetes.tinylink.cn/linklab/device-control-v2/user-service/api/device/list\?boardname=all';

/*根据所选的板子来显示设备列表*/
function generateTree(obj) {
    let boardname = obj.text;
    // let val = obj.options[obj.selectedIndex].innerText;
    // //console.log(val);
    // if (val != current.board) {
    //     current.board = val;
    //     deviceShow.value = '';
    //     add_dev_btn.disabled = true;
    // }
    
    url_str = 'http://kubernetes.tinylink.cn/linklab/device-control-v2/user-service/api/device/list\?boardname=' + boardname;
    sendShowDevicesRequest();
    //下面是我们返回的json对象
    //获取到的所有设备
    if(devices_json.data == null) {
      console.log("66666 " + boardname);
      return;
    }

    let devices_list = devices_json.data.devices;
    if(devices_list == null) return;
    if (boardname != null) {
        
        // device_id.length = 1; //清空之前的内容只留第一个默认选项
        let length = devices_list.length;
        //console.log(length);
        if(length == 0){
            // deviceShow.value = "";
            return;
        }
        // console.log(typeof(obj.nodes));
        // console.log(obj.nodes);
        // if(obj.nodes.length == 0){
        //     console.log("new!");
            
        // }
        for (let n = 0; n < length; n++) {
            //为每一个设备生成一个tree_node
            if(devices_list[n].busy == "true"){
              $("#treeview").treeview("addNode", [obj.nodeId, { node: { text: devices_list[n].deviceid, tags:["busy"]} }]);
            } else {
              $("#treeview").treeview("addNode", [obj.nodeId, { node: { text: devices_list[n].deviceid, tags:["free"]} }]);
            }
        }
        //console.log(length);
    }
}

// sendLoginRequest();
// sendShowBoradRequest();
init_tree();

// sendShowDevicesRequest();


