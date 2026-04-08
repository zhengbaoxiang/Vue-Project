/*
 * @Date: 2022-04-20 14:17:13
 * @LastEditors: zbx
 * @LastEditTime: 2022-04-26 10:59:51
 * @descript: 文件描述
 */

const net = require('net')

const server = net.createServer(function(socket){
    socket.on('data',function(data){
        console.log('->','on on ion  ojn','<');
        console.log('->',data,'<');
        console.log('->',data.toString(),'<');
        socket.write('socket write nihao')
    })

    socket.on('end',function(){
        console.log('->','socket disconnented','<');
    })
    socket.write('哈哈哈哈哈\n')
})

server.listen(8124,function(){
    console.log('->','server bound','<');
    
})