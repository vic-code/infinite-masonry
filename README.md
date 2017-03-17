# infinite-masonry<br>
原理:页面刚载入的时候，会出现固定十几个元素，然后滚动到距离底部150px的时候，会触发加载函数，ajax载入json数据，然后用laytpl模板引擎把json数据解析成配置好的dom结构插入masonry中<br>
1:  基于`jquery.infinitescroll`的无限瀑布流效果<br>
2:  可以按照最新和最热分类排序<br>
3： 下载下来后直接运行index.html看效果，由于chrome浏览器限制了本地ajax请求，会提示跨域错误，最好用火狐浏览器打开，硬要用chrome的话需要设置：<br>
    给浏览器传入启动参数（allow-file-access-from-files），允许跨域访问<br>
    控制台下：`"C:\Program Files (x86)\Google\Chrome\Application\chrome.exe" --allow-file-access-from-files`
