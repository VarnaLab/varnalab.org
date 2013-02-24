var HttpServer = require("../../membrane/ExpressHttpServer");
var Plasma = require("organic").Plasma;
var request = require("request");
var path = require("path");
var fs = require("fs");
var _ = require("underscore");

describe("HttpServer", function(){
  
  var plasma = new Plasma();
  
  var httpServer;
  var serverConfig = {
    "port": 8090,
    "middleware": [
      "membrane/expressMiddleware/cookieParser",
      "membrane/expressMiddleware/allowCrossDomain",
      { "source": "membrane/expressMiddleware/handleMongoSession", "dbname": "test-webcell", "cookie_secret": "test" },
      { "source": "membrane/expressMiddleware/bodyParser", "uploadDir": "tests/data/" },
      { "source": "membrane/expressMiddleware/handleI18Next", "localesDir": "tests/data/" },
      { "source": "membrane/expressMiddleware/staticFolder", "staticDir": "tests/data/" }
    ],
    "routes": {
      "/upload": {
        type: "EchoIncomingHttpRequest"
      },
      "/post": {
        type: "EchoIncomingHttpRequest"
      }
    }
  };

  plasma.on("EchoIncomingHttpRequest", function(chemical, sender, callback){
    chemical.data = _.extend(chemical.data || {}, {
      body: chemical.req.body,
      params: chemical.req.params,
      files: chemical.req.files
    });
    callback(chemical);
  });

  plasma.on(Error, function(e){
    console.log(e);
  });

  it("should emit HttpServer chemical in plasma once ready", function(next){

    plasma.once("HttpServer", function(chemical){
      expect(chemical.data).toBe(httpServer);
      next();
    });

    httpServer = new HttpServer(plasma, serverConfig);
    expect(httpServer).toBeDefined();
  });

  it("should receive post requests", function(next){
    request.post("http://127.0.0.1:"+serverConfig.port+"/post", {form:{myData: "value"}}, function(err, res, body){
      expect(body).toBeDefined();
      body = JSON.parse(body);
      expect(body.body).toBeDefined();
      expect(body.body.myData).toBe("value");
      next();
    });
  });

  it("should serve files from public folder", function(next){
    request("http://127.0.0.1:"+serverConfig.port+"/api/MockHandler.js", function(err, res, body){
      expect(body).toContain("callback");
      request("http://127.0.0.1:"+serverConfig.port+"/file.txt", function(err, res, body){
        expect(body).toBe("content");
        next();
      });
    });
  });

  it("should handle uploading of files to public folder", function(next){
    var r = request.post('http://127.0.0.1:'+serverConfig.port+'/upload', function(err, res, body){
      expect(body).toBeDefined();
      body = JSON.parse(body);
      expect(body.body).toBeDefined();
      expect(body.body.my_field).toBeDefined();
      expect(body.body.my_buffer).toBeDefined();
      expect(body.files.my_file).toBeDefined();
      expect(body.files.my_file.path).toContain("tests/data/");
      fs.unlink(body.files.my_file.path);
      next();
    });
    var form = r.form()
    form.append('my_field', 'my_value')
    form.append('my_buffer', new Buffer([1, 2, 3]))
    form.append('my_file', fs.createReadStream(path.join(__dirname, '../data/file.txt')));
  });

  it("should kill", function(){
    plasma.emit("kill");
    expect(httpServer.closed).toBe(true);
  });

});