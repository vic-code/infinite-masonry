$(function(){
    (function($,window){
        "use strict";
        window.FallScrollObj={
            pageNum:5,         // ÿ�μ�������
            currentPage:1,    // ��ǰpage
            sortByData:{    //����
                1:'test-new.json',
                2:'test-hot.json'
            },
            firstLoadData:{
                1:'test-new-first.json',
                2:'test-hot-first.json'
            },
            $pageNav:$("#page-nav"), //��ҳjquery����

            //ҳ���ʼ��
            init:function($fallScrollWarp, masonryBlock){
                var self=this;

                self.$fallScrollWarp=$fallScrollWarp;
                self.masonryBlock=masonryBlock;

                self.createMasonry();
                self.createInfinitescroll();
                self.bindEvent();
            },

            createMasonry:function(){
                // ʵ���ٲ����Ű�
                this.$fallScrollWarp.masonry({
                    itemSelector: this.masonryBlock,
                    animate: true,
                    isFitWidth: true,
                    gutter: 0,
                    singleMode: true
                });
            },
            destroyMasonry:function(){
                // ����
                this.$fallScrollWarp.masonry("destroy");
                this.$fallScrollWarp.empty();
            },
            renderData:function(result){
                // ��Ⱦ����
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
            appendMasonry:function(newElements){  //���
                var self=this;

                var $newElems = $(newElements);
                self.$fallScrollWarp.masonry('appended', $newElems);
                $newElems.addClass("css3-show");

                if (newElements.length < self.pageNum) {
                    // �������
                    self.destroyInfinitescroll();
                    self.showLoadComplete();
                }
            },
            // ��̬���� page nav,�����л�����
            createPageNav : function () {
                var self = this,
                    category = $("#js_sortBy").val();
                self.$pageNav.html('<a href="' +self.sortByData[category]+'"></a>');
            },
            createInfinitescroll:function(){
                // ʵ�ֹ�������
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
                        // ��������Ϊ��
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
                // ���ٹ�������
                this.$fallScrollWarp.infinitescroll('destroy');
                this.$pageNav.children().remove();
            },
            getFirstPage : function (call) {
                // ��һҳ�ֶ�����
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
                // �ؽ�
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
                // ���¼�
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

// �ٲ���
    FallScrollObj.init($("#grid"), ".grid-item");
});
