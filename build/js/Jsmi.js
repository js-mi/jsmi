//修复IE，增加方法getComputedStyle为对象的窗口和getPropertyValue方法的对象，它返回的getComputedStyle
if (window&&!window.getComputedStyle) {
    window.getComputedStyle = function(el, pseudo) {
        this.el = el;
        this.getPropertyValue = function(prop) {
            var re = /(\-([a-z]){1})/g;
            if (prop == 'float') prop = 'styleFloat';
            if (re.test(prop)) {
                prop = prop.replace(re, function () {
                    return arguments[2].toUpperCase();
                });
            }
            return el.currentStyle[prop] ? el.currentStyle[prop] : null;
        }
        return this;
    }
}
//IE浏览器对filter方法的支持 
if (!Array.prototype.filter){
    Array.prototype.filter = function(fun /*, thisArg */){
        "use strict";
        if (this === void 0 || this === null)
            throw new TypeError();
        var t = Object(this);
        var len = t.length >>> 0;
        if (typeof fun !== "function")
            throw new TypeError();
        var res = [];
        var thisArg = arguments.length >= 2 ? arguments[1] : void 0;
        for (var i = 0; i < len; i++){
            if (i in t){
                var val = t[i];
                if (fun.call(thisArg, val, i, t))
                res.push(val);
            }
        }
        return res;
    };
}
//IE对indexOf方法的支持
if(!Array.indexOf){
    Array.prototype.indexOf = function(obj){
        for(var i=0; i<this.length; i++){
            if(this[i]==obj) return i;
        }
        return -1;
    }
}
//IE对forEach方法的支持
if (!Array.prototype.forEach) {
    Array.prototype.forEach = function(fun /*, thisp*/){
        var len = this.length;
        if (typeof fun != "function")
            throw new TypeError();
        var thisp = arguments[1];
        for (var i = 0; i < len; i++){
            if (i in this)
                fun.call(thisp, this[i], i, this);
        }
    }
}
//删除数组 元素
if (!Array.prototype.remove){
    Array.prototype.remove = function(val) {
        var index = this.indexOf(val);
        return index > -1 && this.splice(index, 1), this;
    }
}

;(function(window, undefined) {
    "use strict";
    var emptyArray = [],slice = emptyArray.slice,filter = emptyArray.filter,some = emptyArray.some,elementTypes = [1, 9, 11],P={},
    propMap = {
      'tabindex': 'tabIndex',
      'readonly': 'readOnly',
      'for': 'htmlFor',
      'class': 'className',
      'maxlength': 'maxLength',
      'cellspacing': 'cellSpacing',
      'cellpadding': 'cellPadding',
      'rowspan': 'rowSpan',
      'colspan': 'colSpan',
      'usemap': 'useMap',
      'frameborder': 'frameBorder',
      'contenteditable': 'contentEditable'
    },
    JSMi = (function(){
        var JSMi = function( selector ) {
            return new JSMi.fn.init(selector);
        };
        JSMi.fn = JSMi.prototype = {
            init:function( selector ){
                var dom ;
                if (!selector)
                    dom = emptyArray,dom.selector = selector || '',dom.__proto__ = JSMi.fn.init.prototype;
                else if (typeof selector == 'string' && (selector = selector.trim()) && selector[0] == '<'  && /^\s*<(\w+|!)[^>]*>/.test(selector))
                    dom = fragment(selector),selector=null;
                else if (isFunction(selector)) return JSMi(document).ready(selector)
                else {
                    if (isArray(selector))
                        dom = selector;
                    else if (isObject(selector))
                        dom = [selector], selector = null
                    else if (elementTypes.indexOf(selector.nodeType) >= 0 || selector === window)
                        dom = [selector], selector = null;
                    else dom = (function(){
                        var found;
                        return (document && /^#([\w-]+)$/.test(selector))?
                        ((found = document.getElementById(RegExp.$1)) ? [found] : [] ):
                        slice.call(
                            /^\.([\w-]+)$/.test(selector) ? document.getElementsByClassName(RegExp.$1) :
                            /^[\w-]+$/.test(selector) ? document.getElementsByTagName(selector) :
                            document.querySelectorAll(selector)
                        );
                    })();
                }
                dom = dom || emptyArray;
                JSMi.extend(dom, JSMi.fn);
                dom.selector = selector || '';
                return dom;
            },
            size:function(){return this.length;}
        }
        JSMi.fn.init.prototype = JSMi.fn;
        JSMi.extend = JSMi.fn.extend = function () {
            var options, name, src, copy,
            target = arguments[0],i = 1,
            length = arguments.length,
            deep = false;
            //处理深拷贝的情况
            if (typeof (target) === "boolean")
                deep = target,target = arguments[1] || {},i = 2;
            //处理时，目标是一个字符串或（深拷贝可能的情况下）的东西
            if (typeof (target) !== "object" && !isFunction(target))
                target = {};
            //扩展JSMi的本身，如果只有一个参数传递
            if (length === i) target = this,--i;
            for (; i < length; i++) {
                if ((options = arguments[i]) != null) {
                    for (name in options) {
                        src = target[name],copy = options[name];
                        if (target === copy) continue;
                        if (copy !== undefined) target[name] = copy;
                    }
                }
            }
            return target;
        };
        return JSMi;
    })();

    JSMi.fn.extend({
        forEach: emptyArray.forEach,
        concat: emptyArray.concat,
        indexOf: emptyArray.indexOf,
        ready: function(callback){
            if (/complete|loaded|interactive/.test(document.readyState) && document.body) callback(JSMi)
            else document.addEventListener('DOMContentLoaded', function(){callback(JSMi) }, false)
            return this
        },
        each: function(callback){
            return JSMi.each(this,callback);
        },
        map: function(fn){
            return JSMi(JSMi.map(this, function(el, i){ return fn.call(el, i, el) }));
        },
        get: function(index){
            return index === undefined ? slice.call(this) : this[index >= 0 ? index : index + this.length];
        },
        index: function(element){
            return element ? this.indexOf(JSMi(element)[0]) : this.parent().children().indexOf(this[0])
        },
        empty: function(){ return this.each(function(){ this.innerHTML = '' }) },
        detach: function(){return this.remove();},
        remove: function(){
            return this.each(function(){
                if (this.parentNode != null) this.parentNode.removeChild(this)
            })
        },
        replaceWith: function(newContent){
            return this.before(newContent).remove()
        },
        unwrap: function(){
            this.parent().each(function(){
                JSMi(this).replaceWith(JSMi(this).children())
            })
            return this
        },
        text: function(text){
            return text === undefined ?
                (this.length > 0 ? this[0].textContent : null) :
                this.each(function(){this.textContent = funcArg(this, text)});
        },
        html:function(html){
            return 0 in arguments ? this.each(function(idx){
                JSMi(this).empty().append(funcArg(this, html))
            }) : (0 in this ? this[0].innerHTML : null)
        },
        val:function(value){
            return 0 in arguments ?
            this.each(function(idx){this.value = funcArg(this, value, idx, this.value)}) :
            (this[0] && (this[0].multiple ?
                JSMi(this[0]).find('option').filter(function(){ return this.selected }).pluck('value') :
                this[0].value))
        },
        data: function(name, value){
            var attrName = 'data-' + name,data,a
            if(!name) return this[0].dataset;
            if(name&&isJson(name)){
                for(a in name) this.attr('data-' + a, name[a])
                return this
            }
            if(value&&(isArray(value) || isJson(value))) value = JSON.stringify(value);

            data = (1 in arguments) ? this.attr(attrName, value) : this.attr(attrName);
            try{data = JSON.parse(data);}catch(e){}
            return data;
        },
        css:function(property, value){
            if (!this[0]) return [];
            var computedStyle = getComputedStyle(this[0], '')
            if(value === undefined && typeof property == 'string') return computedStyle.getPropertyValue(property);
            var css="",k;
            for(k in property) css += k+':'+property[k]+';';
            if(typeof property == 'string') css = property+":"+value;
            return this.each(function(el){
                css ? this.style.cssText += ';' + css :"";
            });
        },
        hide:function(){ return this.css("display", "none")},
        show:function(){
            return this.each(function(){
                this.style.display == "none" && (this.style.display = '');
                var CurrentStyle = function(e){
                    return e.currentStyle || document.defaultView.getComputedStyle(e, null);
                }
                function defaultDisplay(nodeName) {
                    var elm=document.createElement(nodeName),display
                    JSMi('body').append(JSMi(elm));
                    display = CurrentStyle(elm)['display'];
                    elm.parentNode.removeChild(elm)
                    return display
                }
                if (CurrentStyle(this)['display']=='none') {
                    this.style.display = defaultDisplay(this.nodeName)
                }
            })
        },
        toggle:function(setting){
            return this.each(function(){
                var el = JSMi(this);(setting === undefined ? el.css("display") == "none" : setting) ? el.show() : el.hide()
            })
        },
        offset:function(){
            if(this.length==0) return null;
            var obj = this[0].getBoundingClientRect();
            return {
                left: obj.left + window.pageXOffset,
                top: obj.top + window.pageYOffset,
                width: obj.width,
                height: obj.height
            };
        },
        prop: function(name, value){
            name = propMap[name] || name
            return (1 in arguments) ? this.each(function(idx){
              this[name] = funcArg(this, value, idx, this[name])
            }) :(this[0] && this[0][name])
        },
        removeProp: function(name) {
            name = propMap[name] || name;
            return this.each(function() {
                // 在IE中处理window属性可能报错
                try {
                    this[name] = undefined;
                    delete this[name];
                } catch(e) {}
            });
        },
        attr: function(name,value){
            var result,k;
            return (typeof name == 'string' && !(1 in arguments)) ?
                (!this.length || this[0].nodeType !== 1 ? undefined :
                    (!(result = this[0].getAttribute(name)) && name in this[0]) ? this[0][name] : result
                ) : this.each(function(n){
                    if (isObject(name)) for(k in name) this.setAttribute(k, name[k]);
                    else this.setAttribute(name,funcArg(this, value));
                });
        },
        removeAttr:function(name){
            return this.each(function(){ this.nodeType === 1 && this.removeAttribute(name)});
        },
        hasClass:function(name){
            if (!name) return false
            return emptyArray.some.call(this, function(el){
                return this.test(el.className)
            }, new RegExp('(^|\\s)' + name + '(\\s|$)'));
        },
        addClass:function(name){
            if (!name) return this;
            var classList,cls,newName;
            return this.each(function(idx){
                classList=[],cls = this.className,newName=funcArg(this, name).trim();
                newName.split(/\s+/).forEach(function(k){
                    if (!JSMi(this).hasClass(k)) classList.push(k);
                },this);
                if (!newName) return this;
                classList.length ? this.className = cls + (cls ? " " : "") + classList.join(" "):null;
            })
        },
        removeClass:function(name){
            var cls;
            if (name === undefined) return this.removeAttr('class');
            return this.each(function(idx){
                cls = this.className;
                funcArg(this, name, idx, cls).split(/\s+/).forEach(function(k){
                    cls=cls.replace(new RegExp('(^|\\s)'+k+'(\\s|$)')," ").trim();
                },this);
                cls?this.className = cls:this.className = "";
            })
        },
        toggleClass:function(name){
            if(!name) return this;
            return this.each(function(idx){
                var w=JSMi(this),names=funcArg(this, name);
                names.split(/\s+/g).forEach(function(cls){
                    w.hasClass(cls)?w.removeClass(cls):w.addClass(cls);
                })
            })
        },
        filter:function(selector){
            if (isFunction(selector)) return this.not(this.not(selector))
            return JSMi(filter.call(this, function(element){
                return JSMi.matches(element, selector)
            }))
        },
        is: function(selector){
            if (this.length > 0 && isObject(selector)) return this.indexOf(selector)>-1?true:false;
            return this.length > 0 && JSMi.matches(this[0], selector);
        },
        not:function(selector){
            var nodes = [];
            if (isFunction(selector)&& selector.call !== undefined){
                this.each(function(idx){
                    if (!selector.call(this,idx)) nodes.push(this);
                });
            }else {
                var excludes = typeof selector == 'string' ? this.filter(selector):
                (likeArray(selector) && isFunction(selector.item)) ? slice.call(selector) : JSMi(selector)
                this.forEach(function(el){
                    if (excludes.indexOf(el) < 0) nodes.push(el)
                })
            }
            return JSMi(nodes)
        },
        pluck: function(property){ return JSMi.map(this, function(el){ return el[property] })},
        find: function(selector){
            var nodes = this.children(),ancestors=[];
            while (nodes.length > 0)
            nodes=JSMi.map(nodes, function(node,inx){
                if (ancestors.indexOf(node)<0) ancestors.push(node);
                if ((nodes = JSMi(node).children())&&nodes.length>0 ) return nodes;
            });
            return JSMi(ancestors).filter(selector || '*');
        },
        clone: function(){return this.map(function(){ return this.cloneNode(true)})},
        add: function(selector){return JSMi.unique(this.concat(JSMi(selector)));},
        eq: function(idx){return idx === -1 ? JSMi(this.slice(idx)) : JSMi(this.slice(idx, + idx + 1))},
        first: function(){
            var el = this[0]
            return el && !isObject(el) ? el : JSMi(el)
        },
        children:function(selector){
            var e=[];
            filter.call(this.pluck('children'), function(item, idx){
                JSMi.map(item,function(els){ if (els&&els.nodeType == 1) e.push(els) })
            });
            return JSMi(e).filter(selector || '*');
        },
        contents: function() {
            return this.map(function() { return this.contentDocument || slice.call(this.childNodes) })
        },
        parent: function(selector){return JSMi(JSMi.unique(this.pluck('parentNode'))).filter(selector||'*')},
        parents: function(selector){
            var ancestors=JSMi.sibling(this,'parentNode');
            return selector == null ? JSMi(ancestors) : JSMi(ancestors).filter(selector);
        },
        closest: function(selector, context){
            var node = this[0], collection = false
            if (typeof selector == 'object') collection = JSMi(selector)
            while (node && !(collection ? collection.indexOf(node) >= 0 : JSMi.matches(node, selector)))
                node = node !== context && !isDocument(node) && node.parentNode
            return JSMi(node)
        },
        slice:function(argument) { return JSMi(slice.apply(this, arguments))},
        prev: function(selector){
            return JSMi(this.pluck('previousElementSibling')).filter(selector || '*')
        },
        next: function(selector){
            return JSMi(this.pluck('nextElementSibling')).filter(selector || '*')
        },
        nextAll: function (selector) {
            return JSMi(JSMi.sibling(this,'nextElementSibling')).filter(selector || '*');
        },
        prevAll: function (selector) {
            return JSMi(JSMi.sibling(this,'previousElementSibling')).filter(selector || '*');
        },
        siblings: function(selector){
            var n=[];this.map(function(i,el){
                filter.call(el.parentNode.children, function(els, idx){
                     if (els&&els.nodeType == 1&&els!=el) n.push(els)
                });
            })
            return JSMi(n).filter(selector || '*');
        },
        scrollTop: function(value){
            if (!this.length) return;
            var hasScrollTop = 'scrollTop' in this[0];
            if (value === undefined){
                return hasScrollTop ? this[0].scrollTop : this[0].pageYOffset;
            };
            return this.each(hasScrollTop ? function(){
                this.scrollTop = value;
            } : function(){
                this.scrollTo(this.scrollX, value);
            })
        },
        scrollLeft: function(value){
            if (!this.length) return;
            var hasScrollLeft = 'scrollLeft' in this[0];
            if (value === undefined){
                return hasScrollLeft ? this[0].scrollLeft : this[0].pageXOffset;
            };
            return this.each(hasScrollLeft ?function(){
                this.scrollLeft = value;
            } : function(){
                this.scrollTo(value, this.scrollY);
            })
        }
    });

    JSMi.extend({
        isDocument:isDocument,
        isFunction:isFunction,
        isObject:isObject,
        isArray:isArray,
        isString:isString,
        isWindow:isWindow,
        isPlainObject:isPlainObject,
        isJson:isJson,
        parseJSON:JSON.parse,
        type:type,
        likeArray:likeArray,
        trim:function(str){if(str) return str.trim();},
        intersect:function(a,b){
            var array=[];
            a.forEach(function(item){
                if(b.indexOf(item)>-1) array.push(item);
            })
            return array;
        },
        error:function(msg) {throw msg;},
        getUrlParam:function (name) {
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i"),
            r = window.location.search.substr(1).match(reg);
            if (r != null) return unescape(r[2]); return null;
        },
        each:function(elements, callback){
            var i, key
            if (likeArray(elements)) {
                for (i = 0; i < elements.length; i++)
                    if (callback.call(elements[i], i, elements[i]) === false) return elements
                } else {
                for (key in elements)
                    if (callback.call(elements[key], key, elements[key]) === false) return elements
            }
            return elements
        },
        map:function(elements, callback){
            var value, values = [], i, key
            if (likeArray(elements)) for (i = 0; i < elements.length; i++) {
                value = callback(elements[i], i)
                if (value != null) values.push(value)
            }
            else for (key in elements) {
                value = callback(elements[key], key)
                if (value != null) values.push(value)
             }
            return values.length > 0 ? JSMi.fn.concat.apply([], values) : values;
        },
        grep:function(elements, callback){
            return filter.call(elements, callback)
        },
        matches:function(element, selector){
            if (!selector || !element || element.nodeType !== 1) return false;
            var matchesSelector = element.webkitMatchesSelector || element.mozMatchesSelector ||
                                element.oMatchesSelector || element.msMatchesSelector || element.matchesSelector;
            if (matchesSelector) return matchesSelector.call(element, selector);
        },
        unique:function(array){return filter.call(array, function(item, idx){ return array.indexOf(item) == idx })},
        inArray:function(elem, array, i){
            return emptyArray.indexOf.call(array, elem, i)
        },
        sibling:function(nodes,ty){
            var ancestors = [];
            while (nodes.length > 0)
            nodes = JSMi.map(nodes, function(node){
                if ((node = node[ty]) && !isDocument(node) && ancestors.indexOf(node) < 0)
                    ancestors.push(node)
                    return node
            });
            return ancestors;
        },
        contains:function(parent, node){
            if(parent&&!node) return document.documentElement.contains(parent)
            return parent !== node && parent.contains(node)
        }
    });

    function isDocument(obj) { return obj = obj ? obj != null && obj.nodeType ? obj.nodeType == obj.DOCUMENT_NODE : false : undefined;}
    function isFunction(value) { return ({}).toString.call(value) == "[object Function]" }
    function isObject(value) { return value instanceof Object }
    function isArray(value) { return value instanceof Array }
    function isString(obj){ return typeof obj == 'string' }
    function isWindow(obj){ return obj != null && obj == obj.window }
    function isPlainObject(obj){
        return isObject(obj) && !isWindow(obj) && Object.getPrototypeOf(obj) == Object.prototype
    }
    function isJson(obj) {
        var isjson = typeof(obj) == "object" &&
        Object.prototype.toString.call(obj).toLowerCase() == "[object object]" && !obj.length;
        return isjson;
    }
    function type(obj) {
        if(!obj) return undefined;
        var type="";
        JSMi.each("Boolean Number HTMLDivElement String Function Array Date RegExp Object Error".split(" "), function(i, name) {
            if(Object.prototype.toString.call(obj).indexOf(name) > -1) type = name == "HTMLDivElement"?"Object":name;
        })
        return type;
    }
    function likeArray(obj) {return obj? typeof obj.length == 'number' :null }

    P = {
        singleTagRE:/^<(\w+)\s*\/?>(?:<\/\1>|)$/,
        fragmentRE:/^\s*<(\w+|!)[^>]*>/,
        tagExpanderRE:/<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/ig,
        table: document.createElement('table'),
        tableRow: document.createElement('tr'),
        containers:{
            '*': document.createElement('div'),
            'tr': document.createElement('tbody'),
            'tbody': P.table,'thead': P.table,'tfoot': P.table,
            'td': P.tableRow,'th': P.tableRow
        }
    };

    /**
     * fragment
     * 需要一个HTML字符串和一个可选的标签名
     * 生成DOM节点从给定的HTML字符串节点。
     * 生成的DOM节点作为一个数组返回。
     */
    function fragment(html,name){
        var dom, container
        if (P.singleTagRE.test(html)) dom = JSMi(document.createElement(RegExp.$1));
        if (!dom) {
            if (html.replace) html = html.replace(P.tagExpanderRE, "<$1></$2>")
            if (name === undefined) name = P.fragmentRE.test(html) && RegExp.$1
            if (!(name in P.containers)) name = '*'
            container = P.containers[name]
            container.innerHTML = '' + html
            dom = JSMi.each(slice.call(container.childNodes), function(){
                container.removeChild(this)
            });
        }
        return dom;
    }
    ;['width', 'height'].forEach(function(dimension){
        var dimensionProperty = dimension.replace(/./,dimension[0].toUpperCase())
        JSMi.fn[dimension]=function(value){
            var offset, el = this[0]
            if (value === undefined) return isWindow(el) ? el['inner' + dimensionProperty] :
            isDocument(el) ? el.documentElement['scroll' + dimensionProperty] :
            (offset = this.offset()) && offset[dimension]
            else return this.each(function(idx){
                el = $(this)
                el.css(dimension, funcArg(this, value, idx, el[dimension]()))
            })
        }
    })
    ;['after','prepend','before','append'].forEach(function(operator, operatorIndex) {
        var inside = operatorIndex % 2;
        JSMi.fn[operator] = function(){
            var argType, nodes = JSMi.map(arguments, function(arg) {
                    argType = type(arg)
                    if(argType=="Function") arg = funcArg(this, arg)
                    return argType == "Object" || argType == "Array" || arg == null ? arg : fragment(arg)
                }),parent,script,copyByClone = this.length > 1
            if (nodes.length < 1) return this
            return this.each(function(_, target){
                parent = inside ? target : target.parentNode
                target = operatorIndex == 0 ? target.nextSibling :
                        operatorIndex == 1 ? target.firstChild :
                        operatorIndex == 2 ? target :
                        null;

                var parentInDocument = JSMi.contains(document.documentElement, parent)

                nodes.forEach(function(node){
                    var txt
                    if (copyByClone) node = node.cloneNode(true)
                    parent.insertBefore(node, target);
                    if(parentInDocument && node.nodeName != null && node.nodeName.toUpperCase() === 'SCRIPT' &&
                        (!node.type || node.type === 'text/javascript') && !node.src) txt=node.innerHTML;
                    else if(parentInDocument &&node.children && node.children.length>0&&JSMi(node)&&(script=JSMi(node).find("script")))
                        if(script.length>0) script.each(function(_,item){
                            txt=item.innerHTML
                        });
                        txt?window['eval'].call(window, txt):undefined;
                });
            })
        }
        JSMi.fn[inside ? operator+'To' : 'insert'+(operatorIndex ? 'Before' : 'After')] = function(html){
            JSMi(html)[operator](this)
            return this
        }
    });

    function funcArg(context, arg, idx, payload) {
        return isFunction(arg) ? arg.call(context, idx, payload) : arg;
    }
    //字符串处理
    JSMi.extend(String.prototype,{
        trim: function () {return this.replace(/(^\s*)|(\s*$)/g, "");},
        leftTrim: function () {return this.replace(/(^\s*)/g, "");}
    });

    var _JSMi = window.JSMi;
    var _$ = window.$;
    JSMi.noConflict = function(deep) {
        if (deep && window.JSMi === JSMi) {
            window.JSMi = _JSMi;
        }
        if (window.$ === JSMi) window.$ = _$;
        return JSMi;
    };
    window.JSMi = window.$ = JSMi;
})(window);

;(function($){
    $.fn.extend({
        serializeArray:function(){
            var result = [], el,type,elm=this.get(0);
            if(!elm || ! elm.elements) return result
            $([].slice.call(this.get(0).elements)).each(function(){
                el = $(this),type = el.attr('type')
                if (this.nodeName.toLowerCase() != 'fieldset' && !this.disabled && type != 'submit' && type != 'reset' && type != 'button' && ((type != 'radio' && type != 'checkbox') || this.checked)) {
                    result.push({name: el.attr('name'), value: el.val() })
                }
            });
            return result
        },
        serialize:function(result){
            result = [],this.serializeArray().forEach(function(elm){
              result.push(encodeURIComponent(elm.name) + '=' + encodeURIComponent(elm.value))
            })
            return result.join('&')
        }
    });
})(JSMi);

;(function($){
    var handlers = {},_jid = 1
    /* 绑定事件 start  */
    $.fn.extend({
        bind: function(event, func) {return this.each(function(){add(this, event, func)})},
        unbind:function(event, func) {return this.each(function(){remove(this, event, func)})},
        on:function(event, selector, data, callback){
            var self = this
            if (event && !$.isString(event)) {
                $.each(event, function(type, fn){
                    self.on(type, selector, data, fn)
                })
                return self
            }
            if (!$.isString(selector) && !$.isFunction(callback) && callback !== false)
                callback = data, data = selector, selector = undefined
            if ($.isFunction(data) || data === false)
                callback = data, data = undefined
            if (callback === false) callback = function(){return false;}
            return this.each(function(){
                add(this, event, callback, data, selector)
            })
        },
        off:function(event, selector, callback){
            var self = this
            if (event && !$.isString(event)) {
                $.each(event, function(type, fn){
                    self.off(type, selector, fn)
                })
                return self
            }
            if (!$.isString(selector) && !$.isFunction(callback) && callback !== false)
                callback = selector, selector = undefined
            if (callback === false) callback =  function(){return false;}
            return self.each(function(){
                remove(this, event, callback, selector)
            })
        },
        delegate: function(selector, event, callback){
            return this.on(event, selector, callback)
        },
        trigger:function(event, data){
            var type = event,specialEvents={}
            specialEvents.click = specialEvents.mousedown = specialEvents.mouseup = specialEvents.mousemove = 'MouseEvents';
            if (typeof type == 'string') {
                event = document.createEvent(specialEvents[type] || 'Events');
                event.initEvent(type,true, true);
            }else return;
            event._data = data;
            return this.each(function(){
                if('dispatchEvent' in this) this.dispatchEvent(event);
            });
        }
    });
    $.event={add:add,remove:remove};
    function add(element, events, func, data, selector){
        var self=this,id=jid(element),set=(handlers[id] || (handlers[id] = []));
        events.split(/\s/).forEach(function(event){
            var handler = $.extend(parse(event), {fn: func,sel: selector, i: set.length});
            var proxyfn = handler.proxy = function (e) {
                //处理事件代理
                if (selector) {
                    var $temp = $(element).find(selector);
                    var res = [].some.call($temp, function(val) {
                        return val === e.target || $.contains(val, e.target);
                    });
                    //不包含
                    if (!res) {
                        return false;
                    }
                }
                e.data = data;
                var result = func.apply(element,e._data == undefined ? [e] : [e].concat(e._data));
                if (result === false) e.preventDefault(), e.stopPropagation();
                return result;
            };
            set.push(handler)
            if (element.addEventListener) element.addEventListener(handler.e,proxyfn, false);
        })
    }
    function remove(element, events, func, selector){
        ;(events || '').split(/\s/).forEach(function(event){
            $.event = parse(event)
            findHandlers(element, event, func, selector).forEach(function(handler){
                delete handlers[jid(element)][handler.i]
                if (element.removeEventListener) element.removeEventListener(handler.e, handler.proxy, false);
            })
        })
    }
    function jid(element) {return element._jid || (element._jid = _jid++)}
    function parse(event) {
        var parts = ('' + event).split('.');
        return {e: parts[0], ns: parts.slice(1).sort().join(' ')};
    }
    function findHandlers(element, event, func, selector){
        var self=this,id = jid(element);event = parse(event)
        return (handlers[jid(element)] || []).filter(function(handler) {
            return handler
            && (!event.e  || handler.e == event.e)
            && (!func || handler.fn.toString()===func.toString())
            && (!selector || handler.sel == selector);
        })
    }
    ;("blur focus focusin focusout load resize scroll unload click dblclick " +
    "mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave " +
    "change select submit keydown keypress keyup error paste drop dragstart dragover " +
    "beforeunload").split(' ').forEach(function(event) {
        $.fn[event] = function(callback) {
            return callback ? this.bind(event, callback) : this.trigger(event);
        }
    });
    /* 绑定事件 end */
})(JSMi);

;(function($){
    var jsonpID = 0
    function parseArguments(url, data, success, dataType){
        $.isFunction(data) && (dataType = success, success = data, data = undefined),
        $.isFunction(success) || (dataType = success, success = undefined)
        return {
            url: url,
            data: data,
            success: success,
            dataType: dataType
        }
    }
    $.extend({
        ajaxSettings:{
            // 默认请求类型
            type:'GET',
            // 如果请求成功时执行回调
            success:function(){},
            // 如果请求失败时执行回调
            error:function(){},
            xhr:function () {
              return new window.XMLHttpRequest();
            },
            processData:true,
            async:true,
            complete:function(){},//要求执行回调完整（包括：错误和成功）
            // MIME类型的映射
            accepts:{
                script:'text/javascript, application/javascript',
                json:  'application/json',
                xml:   'application/xml, text/xml',
                html:  'text/html',
                text:  'text/plain'
            },
            // 应该被允许缓存GET响应
            cache: true
        },
        param:function(obj,traditional,scope){
            if($.type(obj) == "String") return obj;
            var params = [],str='';
            params.add=function(key, value){
                this.push(encodeURIComponent(key) + '=' + encodeURIComponent(value== null?"":value))
            };
            if(scope==true&&$.type(obj)=='Object') params.add(traditional,obj)
            else {
                for(var p in obj) {
                    var v = obj[p],str='',
                        k = (function(){
                            if (traditional) {
                                if (traditional==true) return p;
                                else{
                                    if(scope&&$.type(obj)=='Array'){
                                        return traditional
                                    }
                                    return traditional + "[" + ($.type(obj)=='Array'?"":p) + "]";
                                };
                            };
                            return p
                        })();
                    if (typeof v=="object") {
                        str=this.param(v, k ,traditional);
                    }else str=params.add(k,v);

                    if (str) params.push(str);
                };
            }
            return params.join('&');
        },
        get:function(url, success){return $.ajax(parseArguments.apply(null, arguments))},
        post:function(url, data, success, dataType){
            var options = parseArguments.apply(null, arguments);
            return options.type = "POST", $.ajax(options);
        },
        getJSON:function(/* url, data, success */){
            var options = parseArguments.apply(null, arguments),
                url = arguments[0];
            if(url&&url == document.location.host) options.dataType = 'json';
            else options.dataType = 'jsonp';
            return this.ajax(options);
        },
        ajaxJSONP:function (options) {
            var _callbackName = options.jsonpCallback,
            callbackName = ($.isFunction(_callbackName) ? _callbackName() : _callbackName) || ('jsonp' + (++jsonpID)),
            script = document.createElement('script'),
            originalCallback = window[callbackName],
            responseData,xhr={};

            $(script).on('load error', function(e, errorType){
                $(script).off().remove()
                if (e.type == 'error' || !responseData) {
                    options.error(e, errorType || 'error',options)
                } else {
                    options.success(responseData[0], xhr, options)
                }
                window[callbackName] = originalCallback
                if (responseData && $.isFunction(originalCallback))
                originalCallback(responseData[0])
                originalCallback = responseData = undefined
            })

            //插入script 获取返回的数据
            window[callbackName] = function(){responseData = arguments}
            script.src = options.url.replace(/\?(.+)=\?/, '?$1=' + callbackName)
            document.head.appendChild(script)
            return options.xhr()
        },
        ajax:function(options){
            var key,settings,
                setHeader = function(name, value) { headers[name.toLowerCase()] = [name, value] },
                appendQuery = function(url, query) {
                    if (query == '') return url
                    return (url + '&' + query).replace(/[&?]{1,2}/, '?')
                },
                serializeData = function(options){
                    if (options.processData && options.data && $.type(options.data) != "string")
                        options.data = $.param(options.data, options.traditional)
                    if (options.data && (!options.type || options.type.toUpperCase() == 'GET'))
                        options.url = appendQuery(options.url, options.data), options.data = undefined
                };
                options = options || {};
                if ($.isString(options)) {
                    if (arguments[0]=="GET") {
                        var  urls=arguments[1];
                        if (arguments[2]&&$.isFunction(arguments[2])) {
                            $.get(urls,arguments[2])
                        }else if(arguments[2]&&$.isJson(arguments[2])){
                            $.get(urls.indexOf('?')>-1?urls+'&'+this.param(arguments[2]):urls+'?'+this.param(arguments[2]),arguments[3])
                        };
                    }else if(arguments[0]=="POST"){
                        $.post(arguments[1],arguments[2],arguments[3],arguments[4])
                    };
                    return;
                };
                settings=$.extend({}, options || {});
                for (key in $.ajaxSettings) if (settings[key] === undefined) settings[key] = $.ajaxSettings[key];
                //{ type, url, data, success, dataType, contentType }
            serializeData(settings)

            //jsonp
            var dataType = settings.dataType, hasPlaceholder = /\?.+=\?/.test(settings.url)
            if (hasPlaceholder) dataType = 'jsonp';
            //给URL后面加上时间戳
            if (settings.cache === false || (
                (!options || options.cache !== true) &&
                ('script' == dataType || 'jsonp' == dataType)
            )) {
                settings.url = appendQuery(settings.url, '_=' + Date.now())
            }
            //判断是否为jsonp
            if ('jsonp' == dataType) {
                if (!hasPlaceholder) settings.url = appendQuery(settings.url,settings.jsonp ? (settings.jsonp + '=?') : settings.jsonp === false ? '' : 'callback=?')
                return $.ajaxJSONP(settings)
            }

            var data = settings.data,
                callback = settings.success || function(){},
                errback = settings.error || function(){},
                mime = $.ajaxSettings.accepts[settings.dataType],
                content = settings.contentType,
                xhr = new XMLHttpRequest(),
                nativeSetHeader = xhr.setRequestHeader,
                headers={};
                if (!settings.crossDomain) setHeader('X-Requested-With', 'XMLHttpRequest'),setHeader('Accept', mime || '*/*');
                if (settings.headers) for (name in settings.headers) setHeader(name, settings.headers[name]);
                if (settings.contentType || (settings.contentType !== false && settings.data && settings.type.toUpperCase() != 'GET'))
                    setHeader('Content-Type', settings.contentType || 'application/x-www-form-urlencoded');
            xhr.onreadystatechange = function(){
                if (xhr.readyState == 4) {
                    if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 0) {
                        if (mime == 'application/json'&&!(/^\s*$/.test(xhr.responseText))) {
                            var result, error = false;
                                result = xhr.responseText
                            try {
                                if (settings.dataType == 'script')    (1,eval)(result)
                                else if (settings.dataType == 'xml')  result = xhr.responseXML
                                else if (settings.dataType == 'json') result = /^\s*$/.test(result) ? null : JSON.parse(result)
                            } catch (e) { error = e }

                            if (error) errback(error, 'parsererror', xhr, settings);
                            else callback(result, 'success', xhr);
                        } else {
                            callback(xhr.responseText, 'success', xhr)
                        };
                    } else {
                        settings.complete(xhr, error ? 'error' : 'success')
                    }
                }
            };
            if (data&&data instanceof Object&&settings.type=='GET'){
                data?settings.url =(settings.url.indexOf('?')>-1?settings.url +'&'+ data:settings.url +'?'+ data) :null;
            }
            xhr.open(settings.type, settings.url, true);
            if (mime) xhr.setRequestHeader('Accept', mime);
            if (data instanceof Object && mime == 'application/json' ) data = JSON.stringify(data), content = content || 'application/json';
            for (name in headers) nativeSetHeader.apply(xhr, headers[name]);

            xhr.send(data?data:null);
        }
    });
    $.fn.extend({
        load:function (/*url, data, success*/) {
            if (!this.length || arguments.length === 0) return this
            var self = this, parts = arguments[0].split(/\s/), selector,
                options = parseArguments.apply(null, arguments)
                callback = options.success
            if (parts.length > 1){
                options.url = parts[0], selector = parts[1]
            }
            options.success = function(response){
                response = response.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,'')
                self.html(selector ? $('<div>').html(response).find(selector) : response)
                callback && callback.apply(self, arguments)
            }
            $.ajax(options)
            return this
        }
    });
})(JSMi);

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
    };

    'function' === typeof define ? define(function() {
        return Pan;
    }) : win.Pan = Pan;

}(window);
