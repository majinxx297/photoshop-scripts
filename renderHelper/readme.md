# photoshop阴影助手
自动合并阴影到多个图层的photoshop script小工具。

*选择语言: [~~English~~](readme.en.md), [简体中文](readme.md), [~~日本語~~](readme.jp.md)*

## 目录
- [简介](#简介)
- [安装](#安装)
- [使用方法](#使用方法)

## 简介
数码绘中有这样一种常用上色法：
1. 给各部分分层并填上底色/固有色。
2. 在所有底色层上叠一层，加上阴影、高光等特效并进行调整，直至整体效果确定。
3. 将阴影层与每个底色层分别合并。
4. 对每个图层进一步细化。

photoshop阴影助手是为了将上述过程中的__步骤3__完全自动化而制作的小工具。

简单来说，这个工具可以将`单个图层a`或`图层组A中的每一层`分别合并到`图层组B的每一层`上，并保持B组图层透明部分不变。
虽然叫阴影助手，但是不管阴影、高光、普通加笔还是其他特效都可以用此工具处理。

目前只在photoshopCC上测试过，其他版本的运行效果和bug反馈请到[issue](https://github.com/majinxx297/render-helper/issues)发帖或直接联系[@芋魔人X](https://weibo.com/1462684514)。

## 安装
1. [下载](https://github.com/majinxx297/render-helper/archive/master.zip)并解压。
    * 如不想安装只想试用，直接双击运行解压得到的RenderHelper.jsx文件即可。
2. 将RenderHelper.jsx复制到photoshop安装目录下`Presets\Scripts`文件夹。
3. 重启photoshop后可在在`文件>脚本`里找到RenderHelper。

## 使用方法
准备一张分好图层、加好阴影高光等特效的半成品，图层结构如下（左）。

<a href="docs\layers.jpg" title="图层结构"><img src="docs\layers.jpg" width="10%"></a>
<a href="docs\RenderHelper-sample.jpg" title="合成效果"><img src="docs\RenderHelper-sample.jpg" width="80%" style="max-width:1072px"></a>

该文件包含cleanup、render和base三个图层组。
cleanup是线稿，base是按照部件分层的固有色图层，render是阴影、高光以及其他特效。

- 只显示固有色图层（base）。

![固有色](docs/RenderHelper-sample-base.jpg?raw=true "固有色")

- 只显示阴影（render）。

![阴影](docs/RenderHelper-sample-render.jpg?raw=true "阴影")

准备完毕后点击`文件>脚本>RenderHelper`运行阴影助手，弹出如下窗口。

![运行](docs/dlg.jpg?raw=true "运行")

在From栏里填入阴影图层组的组名或阴影图层名，To栏填入固有色图层组的组名，然后点击Exec运行。
接下来只要一边喝茶一边等待运行结束就可以了。
- 运行结束后阴影助手会自动把阴影层/阴影组设为不可见。

合并后的效果如下。
~~之后细化还不是美滋滋的？~~

<a href="docs\result.jpg" title="图层结构"><img src="docs\result.jpg" width="30%" style="max-width:613px"></a>
