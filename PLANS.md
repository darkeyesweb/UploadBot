
# Roadmap
## -= 0.9.0 =-

### AWS SDKs and JavaScript Node.JS vs PHP
---
  Move away from relying on AJAX calls to php and convert over to 100% 
## -= 1.0.0 =-

### Attachments: 
---
  Any attachments sent natively (through discord) will be instantly cloned to the local server using the ```request()``` module from NPM
  ```javascript
    var url = attachment.url;
    request(url).pipe(fs.createWriteStream('<Directory>')); // Pipes the input stream into a file skipping the memory cache
  ```
  The bot will then delete the message on the discord channel (Possibly notifying the user of the actions taken). 
  The bot script will then use the ```request()``` function (from the request-json module) to send a query to ask the php script to take the file saved locally and upload it to the Amazon S3 bucket.
  ```javascript
    var requestjson = require('request-json');
    var client = requestjson.createClient('http://localhost/');
    
    var msg = attachment.message; // Grabs Message object of the attachment for shorthand
    
    // Request Parameters
    var query_data = {
      uid: msg.author.id, // The user id of the user who sent the attachment
      username: msg.author.username, // The username of the user who sent the attachment
      content: msg.content, // Gets the message attached to the file when sent, will be used as a description
      filename: attachment.name, // Filename of the attachment
      filesize: attachment.size // Filesize of the attachment
    }
    
    client.post('bot/attachments.php', query_data, (error, response, body) { // Send request to the php script
      if (res.statusCode != '200') { // Was the request sucessful
        // Send user message describing error and create applicable logs 
      } else {
        // Send user message and send an embed message to the appropiate channel
      }
    });
  ```
  
  ##### Reasoning:
  
  When all files are uploaded scripts can be more thorough with search functions and statical analysis
