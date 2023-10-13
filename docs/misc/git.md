---
title: git的常用命令
---

## 全局配置

- `git config --global user.name <name>` 设置用户名
- `git config --global user.email <email>` 设置邮箱
- `git config --global core.autocrlf <option>`
  - `input` 提交代码时自动将行尾转换为`LF`，检出代码时不转换
  - `true` 在检出代码时自动将行尾转换为`CRLF`，在提交代码时自动将行尾转换为`LF`
  - `false` 在检出和提交代码时都不自动转换行尾
- `git config --global core.eol <option>`
  - `lf` UNIX 行结束符，即`\n`
  - `crlf` Windows 行结束符，即`\r\n`

## 创建仓库

- `git init` 初始化仓库
- `git clone` 克隆仓库

## 提交和修改

- `git add`
  - `git add <file>` 添加一个或多个文件到暂存区
  - `git add <dir>` 添加指定目录到暂存区，包括子目录
  - `git add .` 添加当前目录下的所有文件到暂存区
- `git commit`
  - `git commit -m <message>` 提交暂存区到本地仓库中，`<message>` 可以是一些备注信息
  - `git commit <file> -m <message>` 提交暂存区的指定文件到仓库区
  - `git commit -a` 直接提交，不需要执行`git add`命令
- `git status` 查看仓库的状态，显示有变更的文件
- `git diff`
  - `git diff <file>` 查看指定文件暂存区和工作区的差异
- `git reset` 回退版本
- `git rm`
  - `git rm <file>` 将文件从暂存区和工作区中删除
  - `git rm -r <dir>` 递归删除指定目录下的所有内容
- `git mv`
  - `git mv <file> <new_file>` 移动或重命名工作区文件
- `git checkout`
  - `git checkout -- <file>` 将指定文件恢复到最新的提交状态，丢弃所有未提交的更改，常用于撤销文件的修改
- `git restore`
  - `git restore <file>` 撤销指定文件的修改
  - `git restore .` 撤销所有文件的修改

## 日志

- `git log` 查看历史提交记录
  - `git log --oneline` 精简提交历史
- `git blame <file>` 以列表形式查看指定文件的历史修改记录

## 远程操作

- `git remote` 列出当前仓库中已配置的远程仓库
  - `git remote -v` 列出当前仓库中已配置的远程仓库，并显示它们的 URL
  - `git remote add <remote_name> <remote_url>` 添加一个新的远程仓库
  - `git remote rename <old_name> <new_name>` 将已配置的远程仓库重命名
  - `git remote remove <remote_name>` 从当前仓库中删除指定的远程仓库
  - `git remote set-url <remote_name> <new_url>` 修改指定远程仓库的 URL
  - `git remote show <remote_name>` 显示指定远程仓库的详细信息
- `get fetch` 用于从远程仓库拉取代码
  - `git merge <branch_name>` 将指定分支合并到当前分支
- `git pull` 从远程仓库拉取代码并合并本地的版本
- `git push`
  - `git push <remote_name> <branch_name>` 推送本地分支到远程仓库
  - `git push <remote_name> -d <branch_name>` 删除远程仓库的指定分支

## 分支管理

- `git branch` 列出所有本地分支
  - `git branch -r` 查看远程分支
  - `git branch -a` 查看所有分支
  - `git branch <branch_name>` 创建本地分支
  - `git branch -d <branch_name>` 删除本地分支
  - `git branch -D <branch_name>` 强制删除本地分支
  - `git branch -m <old_branch_name> <new_branch_name>` 重命名本地分支
- `git checkout`
  - `git checkout <branch_name>` 切换到指定分支
  - `git checkout -` 切换到前一个分支
  - `git checkout -b <branch_name>` 基于当前分支创建并切换到指定分支
  - `git checkout -b <branch_name> <local_branch_name>` 基于本地分支创建并切换到指定分支
  - `git checkout -b <branch_name> <remote_name>/<branch_name>` 基于远程分支创建并切换到指定分支
  - `git checkout tags/<tag_name>` 切换到标签
  - `git checkout <commit_hash>` 切换到指定的提交状态
- `git stash` 暂存当前修改
  - `git stash save "message"` 暂存当前修改，并添加备注
  - `git stash list` 列出所有暂存
  - `git stash pop` 恢复最近一次暂存
  - `git stash apply` 恢复最近一次暂存
  - `git stash drop` 删除最近一次暂存
  - `git stash clear` 删除所有暂存
- `git tag`
  - `git tag <tag_name>` 基于当前分支创建一个标签
  - `git tag <tag_name> <commit_id>` 基于指定提交创建一个标签
  - `git tag -a <tag_name> -m <message>` 基于当前分支创建一个带注释的标签
  - `git tag -a <tag_name> <commit_id> -m <message>` 基于指定提交创建一个带注释的标签
  - `git tag -d <tag-name>` 删除指定标签
  - `git push <remote_name> <tag_name>` 推送一个本地标签
  - `git push <remote_name> :refs/tags/<tag_name>` 删除一个远程标签
  - `git push <remote_name> --tags` 推送所有本地标签
- `git rebase` 变基
  - `git rebase <base-branch>` 将当前分支变基到指定分支
  - `git rebase -i <base-branch>` 将当前分支变基到指定分支，并进入交互模式
  - `git rebase --abort` 终止变基
  - `git rebase --continue` 继续变基
