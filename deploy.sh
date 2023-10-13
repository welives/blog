#!/usr/sh

# 忽略错误
set -e  #有错误抛出错误

# 构建
npm run build

# 进入待发布的目录
cd docs/.vitepress/dist
touch .nojekyll

# 如果是发布到自定义域名
# echo 'www.example.com' > CNAME

#执行这些git命令
git init
git add -A
git commit -m 'deploy'

# 如果部署到 https://<USERNAME>.github.io
# git push -f git@github.com:welives/welives.github.io.git master

# 如果是部署到 https://<USERNAME>.github.io/<REPO>
git push -f git@github.com:welives/blog.git master:gh-pages  #提交到这个分支

cd -

rm -rf docs/.vitepress/dist  #删除dist文件夹
