## 基本配置示例

以下是 Docker 中 Nginx 默认配置文件`nginx.conf`的一个示例

```nginx
# 定义运行Nginx服务器的用户，这里设为nginx
user  nginx;

# 设置Nginx可以启动的工作进程数，auto表示自动根据可用CPU核数来决定
worker_processes  auto;

# 配置错误日志的路径和日志级别
error_log  /var/log/nginx/error.log notice;

# 设置Nginx服务的PID文件路径
pid        /var/run/nginx.pid;

# events块用于配置Nginx服务器如何处理网络连接
events {
    # 设置每个worker进程最大连接数，默认为1024
    worker_connections  1024;
}

# http块用于设置HTTP服务器的配置
http {
    # 引入MIME类型映射文件，定义服务器如何处理不同类型的文件
    include       /etc/nginx/mime.types;

    # 设置默认的MIME类型，如果请求的文件类型未定义则使用此类型
    default_type  application/octet-stream;

    # 定义日志格式，名为main，包括访问者IP，访问者用户，请求时间等信息
    log_format  main  '$remote_addr - $remote_user [$time_local] "$request" '
                      '$status $body_bytes_sent "$http_referer" '
                      '"$http_user_agent" "$http_x_forwarded_for"';

    # 设置访问日志的路径和使用的日志格式
    access_log  /var/log/nginx/access.log  main;

    # 启用高效文件传输模式，减少磁盘读写操作，提升性能
    sendfile        on;

    # 开启此选项可以减少网络包的数量，提升网络效率
    #tcp_nopush     on;

    # 设置长连接的超时时间，单位是秒
    keepalive_timeout  65;

    # 启用gzip压缩可以提高传输速度和节约带宽，这里默认关闭
    #gzip  on;

    # 包含其他配置文件，通常用于加载sites-available里的站点配置
    include /etc/nginx/conf.d/*.conf;
}
```

## include

Nginx 的`include`指令允许你将配置分散到多个文件中，这样可以更易于管理大型配置。这一指令可以引入其他文件或目录中的配置，常见的用法如下

1. **包含通用配置片段**：例如，可以将 SSL 配置、反向代理配置、安全头配置等分别保存在不同的文件中，并在需要时引入它们
2. **网站特定配置**：在`conf.d`目录或类似的目录中包含特定于单个站点的配置文件
3. **动态配置**：使用通配符(如`include /etc/nginx/sites-enabled/\*;`)动态包含一组配置文件，这在管理多个虚拟主机时特别有用

### 模块化的虚拟主机示例

假设你有一个虚拟主机配置文件`example.com.conf`，你可以使用`include`指令来引入 SSL 参数和其他配置，以保持主配置文件的整洁

```nginx
server {
    listen 80;
    server_name example.com www.example.com;
    # 重定向所有 HTTP 流量到 HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name example.com www.example.com;

    ssl_certificate /etc/ssl/certs/example.com.pem;
    ssl_certificate_key /etc/ssl/private/example.com.key;

    include /etc/nginx/snippets/ssl-params.conf;  # 包含 SSL 参数

    location / {
        root /var/www/example.com/html;
        index index.html;
    }

    access_log /var/log/nginx/example.com.access.log;
    error_log /var/log/nginx/example.com.error.log;
}
```

通过这种方式，你可以维护多个网站的配置文件，每个文件都仅包含特定于该站点的设置，而共用的配置（如 SSL 设置）则可以在需要时通过`include`指令引入，提高了配置的可管理性和可维护性。这种模块化方法在 Docker 环境中尤其有用，因为它允许你通过简单地映射卷或复制文件来动态更改和部署配置

## location

`location` 指令定义在 Nginx 配置文件的`server`块中，用于配置基于请求的 URI 如何被处理

### 基本语法

```
location [ = | ~ | ~* | ^~ ] uri { ... }
```

- **`location`**：这是指令的关键字
- **`[ = | ~ | ~* | ^~ ]`**：这是一个可选的修饰符，用于控制 URI 匹配的方式
  - **`=`**：进行精确匹配。当且仅当完全匹配指定的 URI 时，该配置才会被使用
  - **`~`**：进行区分大小写的正则表达式匹配
  - **`~*`**：进行不区分大小写的正则表达式匹配
  - **`^~`**：如果该前缀匹配成功，Nginx 将不再进行正则表达式匹配，而是立即使用此块处理请求
- `uri`：这是要匹配的 URI 或者正则表达式
- `{ ... }`：花括号内部包含了当匹配发生时应用的配置指令

使用`location`指令可以非常灵活地控制请求如何被处理，比如重定向、重写 URL、定义代理行为等。每个`location`块都可以包含独立的 Nginx 指令集，以适应特定的服务需求

### 上下文

在 Nginx 的配置中，`location`块是一个强大的指令用于定义如何处理特定的 URI 请求。`location`指令只能在`server`或`location`块内部使用，这意味着它们是嵌套的。每个`location`指令定义了一个上下文，该上下文具有特定的配置，用于处理匹配到的 URI。

以下是`location`上下文中一些关键的用法和信息

#### 基本结构

`location`指令通常位于`server`块中，形成了请求处理的基本逻辑

```nginx
server {
    listen 80;
    server_name localhost;

    location / {
        # 处理根URL的配置
    }
    location /images/ {
        # 处理图像文件的配置
    }
    location ~* \.(gif|jpg|jpeg)$ {
        # 用正则表达式处理图像文件扩展名的配置
    }
}
```

#### 嵌套location

`location`块可以嵌套在另一个`location`块内。这用于更细粒度的控制。例如，你可以在一个通用的路径内特别配置一小部分路径

```nginx
location /user/ {
    # 处理以 /user/ 开头的请求
    location ~ \.php$ {
        # 处理所有 PHP 文件的请求
    }
}
```

#### 特殊指令和上下文

在`location`块内部，可以使用各种指令来控制如何响应请求，例如`proxy_pass`用于代理请求，`rewrite`用于重写 URL，以及`return`用于直接返回特定的响应

```nginx
location /api {
    # 将 /api 开头的请求转发到后端服务器
    proxy_pass http://127.0.0.1:3001;
}

location = /maintenance.html {
    # 精确匹配 /maintenance.html 并定义其根目录
    root /usr/share/nginx/html;
}
```

### 使用场景

通过正确使用`location`指令，可以优化 Nginx 的性能和响应能力，更好地管理和分发网络资源

在 Nginx 配置中使用`location`指令来实现各种功能，例如缓存策略、SSL 配置、访问控制、日志记录和内容处理是很常见的

#### 定义特定URI的缓存策略

```nginx
# 静态内容缓存配置，加快网页加载速度
location /static/ {
    root /var/www/html;  # 指定静态文件的根目录
    expires 30d;         # 设置缓存过期时间为 30 天，提高重复访问的效率
    add_header Cache-Control "public";  # 向客户端发送缓存控制头，允许被公共缓存
}
```

#### 应用SSL策略

```nginx
server {
    listen 443 ssl;   # 在 443 端口上监听 SSL 连接
    server_name example.com;  # 指定服务器域名
    ssl_certificate /etc/nginx/ssl/example.com.crt;  # SSL 证书文件
    ssl_certificate_key /etc/nginx/ssl/example.com.key;  # SSL 证书密钥文件
    ssl_session_cache shared:SSL:1m;  # SSL 会话缓存配置，缓存大小为 1 MB
    ssl_session_timeout 10m;  # SSL 会话超时设置为 10 分钟

    location /secure/ {
        # 仅在此位置应用额外的 SSL 配置
        ssl_prefer_server_ciphers on;  # 启用服务器优选的加密套件
        ssl_protocols TLSv1.2 TLSv1.3;  # 启用 TLS 1.2 和 1.3 协议
    }
}
```

#### 配置特定路径的访问控制

```nginx
# 此位置被保护，访问需要通过用户名和密码验证
location /admin/ {
    auth_basic "Administrator's Area";  # 启用基本认证，提示文字为“Administrator's Area”
    auth_basic_user_file /etc/nginx/.htpasswd;  # 定义用户验证文件的位置
}
```

#### 定制特定请求的日志记录

```nginx
# API 请求的专用日志记录，方便追踪和问题定位
location /api/ {
    access_log /var/log/nginx/api_access.log;  # 指定访问日志文件路径
    error_log /var/log/nginx/api_error.log;    # 指定错误日志文件路径
}
```

#### 处理不同类型的内容

```nginx
# 静态文件处理，减少服务器负载和响应时间
location ~* \.(jpg|jpeg|png|gif|ico|css|js)$ {
    root /var/www/html;  # 指定静态文件的根目录
    expires 7d;          # 设置缓存过期时间为 7 天
    access_log off;      # 关闭此类型内容的访问日志，以提高性能
}

# PHP 动态内容处理，提高 PHP 页面的处理效率
location ~ \.php$ {
    fastcgi_pass unix:/var/run/php/php7.4-fpm.sock;  # 定向 PHP 请求到 FastCGI 进程管理器
    fastcgi_index index.php;  # 设置默认的 index 文件为 index.php
    fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;  # 设置脚本执行的绝对路径
    include fastcgi_params;  # 包含额外的 FastCGI 参数
}
```

#### 处理单页应用

```nginx
# 适用于单页应用（SPA），确保路由由前端 JavaScript 处理
location / {
    root /var/www/html;  # 指定项目的根目录
    try_files $uri $uri/ /index.html;  # 尝试直接访问文件，如果失败则重定向到 index.html
}
```

#### 配置SSR服务端渲染

```nginx
# 此代理配置确保 Nuxt.js/Next.js 应用可以正确处理请求和响应，支持复杂的服务端渲染场景
location / {
    proxy_pass http://localhost:3000;  # 将所有请求代理到本地的 3000 端口，Nuxt.js 或 Next.js 应用监听此端口
    proxy_http_version 1.1;  # 使用 HTTP/1.1 协议进行代理
    proxy_set_header Upgrade $http_upgrade;  # 设置 HTTP 升级头，用于支持 WebSocket
    proxy_set_header Connection "upgrade";  # 维持连接状态为 “upgrade”，用于 WebSocket
    proxy_set_header Host $host;  # 传递主机头信息，保持请求头部信息的一致性
    proxy_set_header X-Real-IP $remote_addr;  # 传递真实 IP 地址到后端应用
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;  # 传递所有的代理服务器 IP 地址链
    proxy_set_header X-Forwarded-Proto $scheme;  # 传递请求所使用的协议（如 http 或 https）
}
```

#### Node.js 应用配置

```nginx
# 此代理配置确保 Node.js 应用可以正确处理请求，适用于 API 服务和动态内容的处理
location / {
    proxy_pass http://localhost:4000;  # 代理所有请求到本地的 4000 端口，Node.js 应用监听此端口
    proxy_http_version 1.1;  # 使用 HTTP/1.1 协议进行代理
    proxy_set_header Upgrade $http_upgrade;  # 设置 HTTP 升级头，用于支持 WebSocket
    proxy_set_header Connection "upgrade";  # 维持连接状态为 “upgrade”，用于 WebSocket
    proxy_set_header Host $host;  # 传递主机头信息，保持请求头部信息的一致性
    proxy_set_header X-Real-IP $remote_addr;  # 传递真实 IP 地址到后端应用
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;  # 传递所有的代理服务器 IP 地址链
    proxy_set_header X-Forwarded-Proto $scheme;  # 传递请求所使用的协议（如 http 或 https）
}
```

## types

在 Nginx 的配置中，`types`块负责定义各种文件扩展名对应的 MIME 类型。这是 Web 服务器的一个核心功能，因为它指示浏览器如何处理或显示从服务器接收到的文件

### 默认MIME类型

在上述配置文件中，有这么一行

```nginx
default_type application/octet-stream;
```

这条指令设定了默认 MIME 类型为`application/octet-stream`。当 Nginx 在`mime.types`文件中无法找到特定文件扩展名的 MIME 类型时，它将使用此默认类型。`application/octet-stream`通常用来表示二进制数据或未知的文件类型

### MIME类型定义文件

在上述配置文件中，有这么一行

```nginx
include /etc/nginx/mime.types;
```

此指令命令 Nginx 加载名为`mime.types`的外部文件，该文件通常位于`/etc/nginx/`目录下。`mime.types`文件包括了大量的映射，这些映射将文件扩展名与相应的 MIME 类型关联起来。例如，该文件指定`.html`文件应使用`text/html`类型，而`.jpg`文件则应使用`image/jpeg`类型

### 功能作用

通过适当配置 MIME 类型，Nginx 可以确保以正确的格式将文件发送至客户端，使浏览器能够正确渲染和处理不同类型的文件。例如，将 CSS 文件标记为 `text/css` 类型，使浏览器知道这些文件包含样式信息，并能够相应地处理它们

## root和alias

在 Nginx 配置中，`root`和`alias`指令都用于定义资源文件的位置，但它们在处理请求时的行为有一些关键区别

### root

- `root`用于指定服务器上文件的根目录。Nginx 将请求的 URI 直接添加到这个根目录路径后面，来找到文件或目录的绝对路径。
- 例如，如果配置是`root /data/www;`，那么请求`/images/picture.jpg`会被解析为`/data/www/images/picture.jpg`

#### 示例

此示例中，所有的静态文件请求都将映射到`/data/www`目录下的相应路径

```nginx
server {
    listen 80;
    server_name www.example.com;

    location / {
        root /data/www;
        index index.html index.htm;
    }

    location /images/ {
        root /data/www;
        autoindex on;  # 启用目录列表显示
    }
}
```

在这个配置中：

- 访问`http://www.example.com/` 会解析为`/data/www/index.html`或`/data/www/index.htm`
- 访问`http://www.example.com/images/example.jpg`会解析为`/data/www/images/example.jpg`

### alias

- `alias`用于将特定的请求 URI 映射到服务器上的一个文件或目录，但它并不像`root`那样自动添加 URI。
- 当使用`alias`时，Nginx 会替换匹配的部分 URI，并用`alias`指定的路径代替。
- 例如，如果配置是`location /images/ { alias /data/photos/; }`，那么请求`/images/picture.jpg`会被解析为`/data/photos/picture.jpg`。注意，`alias`指令后面的路径不自动加上请求的 URI 剩余部分

#### 示例

此示例中，`/images/`路径下的请求被映射到`/data/photos`目录

```nginx
server {
    listen 80;
    server_name www.example.com;

    location / {
        root /data/www;
        index index.html index.htm;
    }

    location /images/ {
        alias /data/photos/;
        autoindex on;  # 启用目录列表显示
    }
}
```

在这个配置中：

- 访问`http://www.example.com/`依旧解析为`/data/www/index.html`或`/data/www/index.htm`
- 访问`http://www.example.com/images/example.jpg`则会解析为`/data/photos/example.jpg`

### 两者的区别

- `root`是添加 URI 到配置的目录路径后
- `alias`则是替换`location`匹配的部分 URI，使用`alias`指定的路径作为基础路径

在实际使用时，选择`root`还是`alias`取决于具体的目录结构和 URL 重写的需求。通常，如果需要保留 URL 的路径结构，使用`root`；如果需要重写 URL 路径，使用`alias`

理解这两个指令的区别非常重要，因为错误的配置可能导致文件路径解析错误，从而影响网站的功能

在配置时要特别注意，`alias`的路径结尾是否需要添加斜杠`/`，这取决于你的具体需求和目录结构

这两种配置虽然在表面上看起来类似，但实际上它们处理文件路径的方式有很大的区别，根据你的具体需求选择合适的指令是很重要的
