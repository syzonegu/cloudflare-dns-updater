var request = require('request');
var cron = require('node-cron');

var oldIp = '';

cron.schedule("*/5 * * * * *", function() {
  request({
    url: 'https://api.ipify.org?format=json',
  }, function callback(error, response, body) {
    if (!error && response.statusCode == 200) {
        var ip = JSON.parse(body).ip;
        if(ip!==oldIp){

          var headers = {
            'X-Auth-Email': 'username@hostmail.ltd',
            'X-Auth-Key'  : '54f6fcbcbc3b83c67120353cccfed8fbd6611',
            'Content-Type': 'application/json'
          };

          var dataString = '{"type":"A","name":"domain.tld","content":"'+ip+'","ttl":1,"proxied":true}';

            var options = {
              url: 'https://api.cloudflare.com/client/v4/zones/fdd0f316a7382cab3a50ef179645c145/dns_records/dc7592ac9b5c437fae6010bb8067016d',
              method: 'PUT',
              headers: headers,
              body: dataString
            };

            function callback(error, response, body) {
              if (!error && response.statusCode == 200) {
                  console.log(body);
                  oldIp=ip;
              }
            }

            request(options, callback);

        }
    }
  });
});