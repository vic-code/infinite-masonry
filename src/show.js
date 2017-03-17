$(function(){
    (function($,window){
        "use strict";
        window.FallScrollObj={
            pageNum:5,         // 每次加载条数
            currentPage:1,    // 当前page
            sortByData:{    //排序
                1:'test-new.json',
                2:'test-hot.json'
            },
            firstLoadData:{
                1:'test-new-first.json',
                2:'test-hot-first.json'
            },
            $pageNav:$("#page-nav"), //分页jquery对象

            //页面初始化
            init:function($fallScrollWarp, masonryBlock){
                var self=this;

                self.$fallScrollWarp=$fallScrollWarp;
                self.masonryBlock=masonryBlock;

                self.createMasonry();
                self.createInfinitescroll();
                self.bindEvent();
            },

            createMasonry:function(){
                // 实现瀑布流排版
                this.$fallScrollWarp.masonry({
                    itemSelector: this.masonryBlock,
                    animate: true,
                    isFitWidth: true,
                    gutter: 0,
                    singleMode: true
                });
            },
            destroyMasonry:function(){
                // 销毁
                this.$fallScrollWarp.masonry("destroy");
                this.$fallScrollWarp.empty();
            },
            renderData:function(result){
                // 渲染数据
                var gettpl = document.getElementById('gridTmp').innerHTML,
                    renderHtml;
                laytpl(gettpl).render(result, function(html){
                    renderHtml = html;
                });
                return renderHtml;
            },
            showLoadComplete:function(){
                $("#js_noMore").show();
            },
            hideLoadComplete:function(){
                $("#js_noMore").hide();
            },
            appendMasonry:function(newElements){  //添加
                var self=this;

                var $newElems = $(newElements);
                self.$fallScrollWarp.masonry('appended', $newElems);
                $newElems.addClass("css3-show");

                if (newElements.length < self.pageNum) {
                    // 加载完成
                    self.destroyInfinitescroll();
                    self.showLoadComplete();
                }
            },
            // 动态创建 page nav,用于切换分类
            createPageNav : function () {
                var self = this,
                    category = $("#js_sortBy").val();
                self.$pageNav.html('<a href="' +self.sortByData[category]+'"></a>');
            },
            createInfinitescroll:function(){
                // 实现滚动加载
                var self = this;
                self.createPageNav();

                self.$fallScrollWarp.infinitescroll({
                    navSelector: "#page-nav",
                    nextSelector: "#page-nav a",
                    itemSelector: self.masonryBlock,
                    animate: false,
                    dataType: "json",
                    template : self.renderData,
                    bufferPx : 40,
                    pathParse: function (path, currentPage) {
                        return [path + "?page=",""];
                    },
                    errorCallback: function () {
                        // 返回数据为空
                        self.destroyInfinitescroll();
                        self.showLoadComplete();
                    },
                    extraScrollPx: 150,
                    loading: {
                        finishedMsg: 'Fnished',
                        img: 'img/6RMhx.gif',
                        msgText: 'Loading...',
                        speed:'slow',
                        finished: function () {
                            self.currentPage ++;
                            $("#infscr-loading").hide();
                        }
                    },
                    state: {
                        currPage: self.currentPage
                    }
                }, function (newElements) {
                    self.appendMasonry(newElements);
                });
            },
            destroyInfinitescroll:  function () {
                // 销毁滚动加载
                this.$fallScrollWarp.infinitescroll('destroy');
                this.$pageNav.children().remove();
            },
            getFirstPage : function (call) {
                // 第一页手动请求
                var self = this,
                    category = $("#js_sortBy").val();
                call = call || $.noop;

                $.ajax({
                    url : self.firstLoadData[category],
                    type : "GET",
                    dataType : "json"
                }).done(function (result) {
                    var html = self.renderData(result);
                    self.$fallScrollWarp.html(html);

                    self.createMasonry();
                    self.$fallScrollWarp.find(".grid-item").addClass("css3-show");
                    call();
                });
            },
            rebuilding: function () {
                // 重建
                var self = this;
                self.destroyInfinitescroll();
                self.destroyMasonry();
                self.hideLoadComplete();

                $.removeData(self.$fallScrollWarp[0]);

                self.getFirstPage(function () {
                    self.currentPage = 1;
                    self.createInfinitescroll();
                    self.$fallScrollWarp.infinitescroll("bind");
                });
            },
            bindEvent: function(){
                // 绑定事件
                var self = this;
                self.$fallScrollWarp.find(".grid-item").addClass("css3-show");

                // change short by
                $("#js_sortBy").on("change", function (event) {
                    self.currentSort = $(this).val();
                    self.rebuilding();
                });
            }
        };
    })(jQuery,window);

// 瀑布流
    FallScrollObj.init($("#grid"), ".grid-item");
});
