/**
 *
 * jquery.binarytransport.js
 *
 * @description. jQuery ajax transport for making binary data type requests.
 * @version 1.0 
 * @author Henry Algus <henryalgus@gmail.com>
 *
 */

// use this transport for "binary" data type
$.ajaxTransport("+binary", function(options, originalOptions, jqXHR){
    // check for conditions and support for blob / arraybuffer response type
    if (window.FormData && ((options.dataType && (options.dataType == 'binary')) 
        || (options.data 
        && ((window.ArrayBuffer && options.data instanceof ArrayBuffer) 
        || (window.Blob && options.data instanceof Blob))))
       )
    {
        return {
            // create new XMLHttpRequest
            send: function(headers, callback){
        // setup all variables
                var xhr = new XMLHttpRequest(),
        url = options.url,
        type = options.type,
        async = options.async || true,
        // blob or arraybuffer. Default is blob
        dataType = options.responseType || "blob",
        data = options.data || null,
        username = options.username || null,
        password = options.password || null;

                xhr.addEventListener('load', function(){
            var data = {};
            data[options.dataType] = xhr.response;
            // make callback and send data
            callback(xhr.status
                    , xhr.statusText
                    , data
                    , xhr.getAllResponseHeaders());
                });

                xhr.open(type, url, async, username, password);

        // setup custom headers
        for (var i in headers ) {
            xhr.setRequestHeader(i, headers[i] );
        }

                xhr.responseType = dataType;
                xhr.send(data);
            },
            abort: function(){
                jqXHR.abort();
            }
        };
    }
});

//不下载文件，而是将文件直接传给接口
function submitFile(url, headers, boradname) {
return $.ajax({
  url:url,
  dataType:"binary",
  processData: false,
  headers:headers
})
.then(function handleFile(data) {
    //console.log(this.response || data);
    //console.log(typeof(data));
    let filename = boradname + "Obj.zip";
    let myfile = new File([data], filename, {type: 'application/octet-stream'});
    console.log(typeof(this.response));
    //let binary_file = data;
    var file = URL.createObjectURL(this.response || data);
    let form = new FormData();
    //let str = '{"boardname":"DeveloperKit"}';
    
    let str = '{"boardname":"' + boradname + '"}';
    console.log(str);
    form.append('parameters', str);
    form.append("type", "application/json");
    fileShow.value = myfile.name;
    form.append("file", myfile); //第一个参数是后台读取的请求key值
    form.append("type", "application/octet-stream"); //实际业务的其他请求参数
    //console.log(form.get("type"));

    //let obj = {form1, form2};
    //为每一个设备进行一次文件的上传
   $.ajax({
     url: "http://kubernetes.tinylink.cn/linklab/device-control-v2/file-cache/api/file",
     async: false,
     method: 'POST',
     headers: {
       "Authorization": user_token
     },
     dataType: 'json',
 //     data: obj, 
     data: form,
     processData: false,
     contentType: false,
     success: function (data) {
     //   alert(JSON.stringify(data));
    //    let filehash = data.data.filehash;
       filemap[myfile.name] = data.data.filehash;
       console.log(filemap[myfile.name]);
       confirm_button.disabled = false;
     },
     error: function(data, status){
       alert(status);
     }
   });// end of ajax
  })// end of then
}

//下载文件
function downloadFile(url, headers, filename) {
  return $.ajax({
    url:url,
    dataType:"binary",
    processData: false,
    headers:headers
  })
  .then(function handleFile(data) {
      console.log(this.response || data);
      var file = URL.createObjectURL(this.response || data);  
      filename = filename || url.split("/").pop();//如果未指定，则...
      var a = document.createElement("a");
      // if `a` element has `download` property
      if ("download" in a) {
        a.href = file;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      } else {
        // use `window.open()` if `download` not defined at `a` element
        window.open(file)
      }
    })
  }