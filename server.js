const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
var exec = require("child_process").exec;
const os = require("os");
const { createProxyMiddleware } = require("http-proxy-middleware");
var request = require("request");
const fetch = require("node-fetch");
const render_app_url = "https://clever-mite-sneakers.cyclic.app";

app.get("/", (req, res) => {
res.send("hello world");
});

app.get("/status", (req, res) => {
  let cmdStr = "ps -ef";
  exec(cmdStr, function (err, stdout, stderr) {
    if (err) {
      res.type("html").send("<pre>命令行执行出错：\n" + err + "</pre>");
    } else {
      res.type("html").send("<pre>命令行执行结果：\n" + stdout + "</pre>");
    }
  });
});

app.get("/start", (req, res) => {
  let cmdStr = "./web.js -c ./config.json >/dev/null 2>&1 &";
  exec(cmdStr, function (err, stdout, stderr) {
    if (err) {
      res.send("命令行执行错误：" + err);
    } else {
      res.send("命令行执行结果:web.js启动成功!");
    }
  });
});

app.get("/nezha", (req, res) => {
  let cmdStr = "/bin/bash nezha.sh server.abc.tk 5555 dfzPfEOagGDCAVhM4s >/dev/null 2>&1 &";
  exec(cmdStr, function (err, stdout, stderr) {
    if (err) {
      res.send("哪吒客户端部署错误：" + err);
    } else {
      res.send("哪吒客户端执行结果：" + "启动成功!");
    }
  });
});

app.get("/info", (req, res) => {
  let cmdStr = "cat /etc/*release | grep -E ^NAME";
  exec(cmdStr, function (err, stdout, stderr) {
    if (err) {
      res.send("命令行执行错误：" + err);
    } else {
      res.send(
        "命令行执行结果：\n" +
          "Linux System:" +
          stdout +
          "\nRAM:" +
          os.totalmem() / 1000 / 1000 +
          "MB"
      );
    }
  });
});

app.use(
  "/",
  createProxyMiddleware({
    target: "http://127.0.0.1:8080/", // 需要跨域处理的请求地址
    changeOrigin: true, // 默认false，是否需要改变原始主机头为目标URL
    ws: true, // 是否代理websockets
    pathRewrite: {
      "^/": "/", // 重写路径
    },
    onProxyReq: (proxyReq, req, res) => {
      // 可选：设置自定义请求头
      proxyReq.setHeader("X-Special-Proxy-Header", "foobar");
    },
  })
);

setInterval(() => {
  request.get("http://localhost:" + port + "/", (error, response, body) => {
    if (!error && response.statusCode === 200) {
      console.log(new Date() + " 保持应用在线状态成功");
    } else {
      console.log(new Date() + " 保持应用在线状态失败");
    }
  });
}, 1000 * 60 * 5);

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
