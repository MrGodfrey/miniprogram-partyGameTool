# 聚会游戏工具

常见的聚会游戏的辅助工具，用微信小程序作为载体，已实现的有

- 小游戏积分榜

# Todo

1. 开发云端存储积分榜的功能，并可以输入房号在其他手机上查询当前积分榜



## 开发云端存储积分榜

### 积分榜页面

页面： 实现想法，在当前页面添加是否上传到云选项，switch， 然后在左边显示当前唯一的房间号

逻辑： 若上传到云选项打开，基于当前_openid 创建数据，包括唯一的房间ID

已经实现创建数据文件

需要更新数据库逻辑，只需要更新store函数即可. checked

需要删除条目逻辑. checked

Todo

1. 需要随机生成不一样的房间号

**Done**

1. 每次页面加载的时候，不应当从本地缓存读取云状态，而应当由云函数读取

唯一性需要用云函数保证，但是可以放在之后开发

Todo

1. 样式进行修改

### 查看积分榜页面

页面： 

1. 若已有房间ID，显示当前房间内的积分数据
2. 若无房间ID，询问房间ID并设置

逻辑： 调用云函数，从ID号获取房间数据，并下拉

Todo 

实现这里的功能

