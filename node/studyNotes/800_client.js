const net = require('net')

const client = net.connect({port:8124},function(){
    console.log('-10>','client connected','<');
    client.write('client msg \n')
    
})
client.on('data',function(data){
    console.log('-15>',data.toString(),'<');
})
client.on('end',function(){
    console.log('->','client disconnented','<');
})