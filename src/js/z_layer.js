;!function(win){
    "use strict";

    var path = ''; //所在路径，如果非模块加载不用配置
    path = path ? path : document.scripts[document.scripts.length-1].src.match(/[\s\S]*\//)[0];

    var doc = document, query = 'querySelectorAll', claname = 'getElementsByClassName', S = function(s){
        return doc[query](s);
    };

//插入css
    document.head.appendChild((function(){
        var link = doc.createElement('link');
        link.href = path + 'tpl/main.min.css';
        link.type = 'text/css';
        link.rel = 'styleSheet'
        link.id = 'layermcss';
        return link;
    }()));

//默认配置
    var config = {
        type: 0,
        shade: true,
        shadeClose: true,
        fixed: true,
        anim: true
    };

    win.ready = {
        extend: function(obj){
            var newobj = JSON.parse(JSON.stringify(config));
            for(var i in obj){
                newobj[i] = obj[i];
            }
            return newobj;
        },
        timer: {},
        end: {}
    };

//点触事件
    ready.touch = function(elem, fn){
        var move;
        elem.addEventListener('touchmove', function(){
            move = true;
        }, false);
        elem.addEventListener('touchend', function(e){
            e.preventDefault();
            move || fn.call(this, e);
            move = false;
        }, false);
    };

    var index = 0, classs = ['layermbox'], Layer = function(options){
        var that = this;
        that.config = ready.extend(options);
        that.view();
    };

    Layer.prototype.view = function(){
        var that = this, config = that.config, layerbox = doc.createElement('div');

        that.id = layerbox.id = classs[0] + index;
        layerbox.setAttribute('class', classs[0] + ' ' + classs[0]+(config.type || 0));
        layerbox.setAttribute('index', index);

        var title = (function(){
            var titype = typeof config.title === 'object';
            return config.title
                ? '<h3 style="'+ (titype ? config.title[1] : '') +'">'+ (titype ? config.title[0] : config.title)  +'</h3><button class="layermend"></button>'
                : '';
        }());

        var button = (function(){
            var btns = (config.btn || []).length, btndom;
            if(btns === 0 || !config.btn){
                return '';
            }
            btndom = '<span type="1">'+ config.btn[0] +'</span>'
            if(btns === 2){
                btndom = '<span type="0">'+ config.btn[1] +'</span>' + btndom;
            }
            return '<div class="layermbtn">'+ btndom + '</div>';
        }());

        if(!config.fixed){
            config.top = config.hasOwnProperty('top') ?  config.top : 100;
            config.style = config.style || '';
            config.style += ' top:'+ ( doc.body.scrollTop + config.top) + 'px';
        }

        if(config.type === 2){
            config.content = '<i></i><i class="laymloadtwo"></i><i></i><div>' + (config.content||'') + '</div>';
        }

        layerbox.innerHTML = (config.shade ? '<div '+ (typeof config.shade === 'string' ? 'style="'+ config.shade +'"' : '') +' class="laymshade"></div>' : '')
            +'<div class="layermmain" '+ (!config.fixed ? 'style="position:static;"' : '') +'>'
            +'<div class="section">'
            +'<div class="layermchild '+ (config.className ? config.className : '') +' '+ ((!config.type && !config.shade) ? 'layermborder ' : '') + (config.anim ? 'layermanim' : '') +'" ' + ( config.style ? 'style="'+config.style+'"' : '' ) +'>'
            + title
            +'<div class="layermcont">'+ config.content +'</div>'
            + button
            +'</div>'
            +'</div>'
            +'</div>';

        if(!config.type || config.type === 2){
            var dialogs = doc[claname](classs[0] + config.type), dialen = dialogs.length;
            if(dialen >= 1){
                layer.close(dialogs[0].getAttribute('index'))
            }
        }

        document.body.appendChild(layerbox);
        var elem = that.elem = S('#'+that.id)[0];
        config.success && config.success(elem);

        that.index = index++;
        that.action(config, elem);
    };

    Layer.prototype.action = function(config, elem){
        var that = this;

        //自动关闭
        if(config.time){
            ready.timer[that.index] = setTimeout(function(){
                layer.close(that.index);
            }, config.time*1000);
        }

        //关闭按钮
        if(config.title){
            var end = elem[claname]('layermend')[0], endfn = function(){
                config.cancel && config.cancel();
                layer.close(that.index);
            };
            ready.touch(end, endfn);
            end.onclick = endfn;
        }

        //确认取消
        var btn = function(){
            var type = this.getAttribute('type');
            if(type == 0){
                config.no && config.no();
                layer.close(that.index);
            } else {
                config.yes ? config.yes(that.index) : layer.close(that.index);
            }
        };
        if(config.btn){
            var btns = elem[claname]('layermbtn')[0].children, btnlen = btns.length;
            for(var ii = 0; ii < btnlen; ii++){
                ready.touch(btns[ii], btn);
                btns[ii].onclick = btn;
            }
        }

        //点遮罩关闭
        if(config.shade && config.shadeClose){
            var shade = elem[claname]('laymshade')[0];
            ready.touch(shade, function(){
                layer.close(that.index, config.end);
            });
            shade.onclick = function(){
                layer.close(that.index, config.end);
            };
        }

        config.end && (ready.end[that.index] = config.end);
    };

    var Pan = {
        v: '0.0.3',
        name:'panli',
        urlHost:'',
        help:'',
        index: index,

        //核心方法
        open: function(options){
            var o = new Layer(options || {});
            return o.index;
        },

        close: function(index){
            var ibox = S('#'+classs[0]+index)[0];
            if(!ibox) return;
            ibox.innerHTML = '';
            doc.body.removeChild(ibox);
            clearTimeout(ready.timer[index]);
            delete ready.timer[index];
            typeof ready.end[index] === 'function' && ready.end[index]();
            delete ready.end[index];
        },

        //关闭所有layer层
        closeAll: function(){
            var boxs = doc[claname](classs[0]);
            for(var i = 0, len = boxs.length; i < len; i++){
                layer.close((boxs[0].getAttribute('index')|0));
            }
        },
        /* 谷歌统计代码 */
        googleCount:function(){
            (function (i, s, o, g, r, a, m) {
                i['GoogleAnalyticsObject'] = r; i[r] = i[r] || function () {
                        (i[r].q = i[r].q || []).push(arguments)
                    }, i[r].l = 1 * new Date(); a = s.createElement(o),
                    m = s.getElementsByTagName(o)[0]; a.async = 1; a.src = g; m.parentNode.insertBefore(a, m)
            })(window, document, 'script', '//www.google-analytics.com/analytics.js', 'ga');

            ga('create', 'UA-436090-2', 'auto');ga('require', 'displayfeatures');
            ga('send', 'pageview');
        },
        /* rem 字体转换 */
        remFontSize:function(){
            var fontsize = function () {
                var W = document.body.getBoundingClientRect().width, defaultW = 720, defaultSize = 40;
                W = W > defaultW ? defaultW : W < 320 ? 320 : W;
                window.W = W; document.documentElement.style.fontSize = (W / defaultW * defaultSize).toFixed(2) + 'px';
            };
            var fontset = setTimeout(fontsize, 300);
            window.addEventListener('resize', function () { clearTimeout(fontset); fontset = setTimeout(fontsize, 300) });
            window.addEventListener("DOMContentLoaded", fontsize);
            setTimeout(fontsize, 300);

        },
        ViewSize:function(){
          ;(function(win, lib) {
              var doc = win.document;
              var docEl = doc.documentElement;
              var metaEl = doc.querySelector('meta[name="viewport"]');
              var flexibleEl = doc.querySelector('meta[name="flexible"]');
              var dpr = 0;
              var scale = 0;
              var tid;
              var flexible = lib.flexible || (lib.flexible = {});

              if (metaEl) {
                  console.warn('将根据已有的meta标签来设置缩放比例');
                  var match = metaEl.getAttribute('content').match(/initial\-scale=([\d\.]+)/);
                  if (match) {
                      scale = parseFloat(match[1]);
                      dpr = parseInt(1 / scale);
                  }
              } else if (flexibleEl) {
                  var content = flexibleEl.getAttribute('content');
                  if (content) {
                      var initialDpr = content.match(/initial\-dpr=([\d\.]+)/);
                      var maximumDpr = content.match(/maximum\-dpr=([\d\.]+)/);
                      if (initialDpr) {
                          dpr = parseFloat(initialDpr[1]);
                          scale = parseFloat((1 / dpr).toFixed(2));
                      }
                      if (maximumDpr) {
                          dpr = parseFloat(maximumDpr[1]);
                          scale = parseFloat((1 / dpr).toFixed(2));
                      }
                  }
              }

              if (!dpr && !scale) {
                  var isAndroid = win.navigator.appVersion.match(/android/gi);
                  var isIPhone = win.navigator.appVersion.match(/iphone/gi);
                  var devicePixelRatio = win.devicePixelRatio;
                  if (isIPhone) {
                      // iOS下，对于2和3的屏，用2倍的方案，其余的用1倍方案
                      if (devicePixelRatio >= 3 && (!dpr || dpr >= 3)) {
                          dpr = 3;
                      } else if (devicePixelRatio >= 2 && (!dpr || dpr >= 2)){
                          dpr = 2;
                      } else {
                          dpr = 1;
                      }
                  } else {
                      // 其他设备下，仍旧使用1倍的方案
                      dpr = 1;
                  }
                  scale = 1 / dpr;
              }

              docEl.setAttribute('data-dpr', dpr);
              if (!metaEl) {
                  metaEl = doc.createElement('meta');
                  metaEl.setAttribute('name', 'viewport');
                  metaEl.setAttribute('content', 'initial-scale=' + scale + ', maximum-scale=' + scale + ', minimum-scale=' + scale + ', user-scalable=no');
                  if (docEl.firstElementChild) {
                      docEl.firstElementChild.appendChild(metaEl);
                  } else {
                      var wrap = doc.createElement('div');
                      wrap.appendChild(metaEl);
                      doc.write(wrap.innerHTML);
                  }
              }

              function refreshRem(){
                  var width = docEl.getBoundingClientRect().width;
                  if (width / dpr > 540) {
                      width = 540 * dpr;
                  }
                  var rem = width / 10;
                  docEl.style.fontSize = rem + 'px';
                  flexible.rem = win.rem = rem;
              }

              win.addEventListener('resize', function() {
                  clearTimeout(tid);
                  tid = setTimeout(refreshRem, 300);
              }, false);
              win.addEventListener('pageshow', function(e) {
                  if (e.persisted) {
                      clearTimeout(tid);
                      tid = setTimeout(refreshRem, 300);
                  }
              }, false);

              if (doc.readyState === 'complete') {
                  doc.body.style.fontSize = 12 * dpr + 'px';
              } else {
                  doc.addEventListener('DOMContentLoaded', function(e) {
                      doc.body.style.fontSize = 12 * dpr + 'px';
                  }, false);
              }


              refreshRem();

              flexible.dpr = win.dpr = dpr;
              flexible.refreshRem = refreshRem;
              flexible.rem2px = function(d) {
                  var val = parseFloat(d) * this.rem;
                  if (typeof d === 'string' && d.match(/rem$/)) {
                      val += 'px';
                  }
                  return val;
              }
              flexible.px2rem = function(d) {
                  var val = parseFloat(d) / this.rem;
                  if (typeof d === 'string' && d.match(/px$/)) {
                      val += 'rem';
                  }
                  return val;
              }

          })(window, window['lib'] || (window['lib'] = {}));
        },
    };

    'function' === typeof define ? define(function() {
        return Pan;
    }) : win.Pan = Pan;

}(window);
