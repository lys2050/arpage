/*
 *  sdlbase Ver(0.1) 
 */
(function () {
    //keep ref window
    var root = this;
    //class initializing state
    var _initializing = false;
    //short ref
    var ArrayProto = Array.prototype, ObjProto = Object.prototype, FuncProto = Function.prototype;
    //short ref type
    var
      push = ArrayProto.push,
      slice = ArrayProto.slice,
      toString = ObjProto.toString,
      nativeIsArray = ArrayProto.IsArray,
      hasOwnProperty = ObjProto.hasOwnProperty;
    //cotr
    var sdlbase = function (obj) {
        if (obj instanceof sdlbase) return obj;
        if (!(this instanceof sdlbase)) return new sdlbase(obj);
    };
    if (typeof exports !== 'undefined') {
        if (typeof module !== 'undefined' && module.exports) {
            exports = module.exports = sdlbase;
        }
        exports.sdlbase = sdlbase;
    } else {
        root.sdlbase = sdlbase;
    }
    // cur version
    sdlbase.Version = 0.1;
    //type judge
    var types = ['Arguments', 'Function', 'String', 'Number', 'Date', 'RegExp', 'Error', 'Array'];
    for (var i in types) {
        sdlbase['is' + types[i]] = function (obj) {
            return toString.call(obj) === '[object ' + types[i] + ']';
        };
    }
    if (!sdlbase.isArguments(arguments)) {
        sdlbase.isArguments = function (obj) {
            return sdlbase.has(obj, 'callee');
        };
    }
    sdlbase.isNaN = function (obj) {
        if (!sdlbase.isUndef(obj)) {
            if (obj != "") {
                return isNaN(obj);
            } else {
                return true;
            }
        } else {
            return false;
        }
    };
    sdlbase.isBoolean = function (obj) {
        return obj === true || obj === false || toString.call(obj) === '[object Boolean]';
    };
    sdlbase.has = function (obj, key) {
        return obj != null && hasOwnProperty.call(obj, key);
    };
    sdlbase.isEmpty = function (obj) {
        if (obj == null) return true;
        if (sdlbase.isArray(obj) || sdlbase.isString(obj) || sdlbase.isArguments(obj)) return obj.length === 0;
        for (var key in obj) if (sdlbase.has(obj, key)) return false;
        return true;
    };
    sdlbase.isUndef = function (obj) {
        return typeof obj === "undefined " || obj === undefined;
    };
    //Class for inherit
    sdlbase.Class = function () { };
    sdlbase.Class.extend = function (prop) {
        var fnTest = /xyz/.test(function () { xyz; }) ? /\b_super\b/ : /.*/;
        var _super = this.prototype;
        _initializing = true;
        var prototype = new this();
        _initializing = false;
        for (var name in prop) {
            prototype[name] = typeof prop[name] == "function" &&
              typeof _super[name] == "function" && fnTest.test(prop[name]) ?
              (function (name, fn) {
                  return function () {
                      var tmp = this._super;
                      this._super = _super[name];
                      var ret = fn.apply(this, arguments);
                      this._super = tmp;
                      return ret;
                  };
              })(name, prop[name]) :
              prop[name];
        }
        function Class() {
            if (!_initializing && this.init)
                this.init.apply(this, arguments);
        }
        Class.prototype = prototype;
        Class.prototype.constructor = Class;
        Class.extend = arguments.callee;
        return Class;
    };
    //Dom
    sdlbase.Dom = {
        isElement: function (obj) { return !!(obj && obj.nodeType === 1); }
    };
    //Array
    sdlbase.Array = {
        get: function (idx) {
            return idx === undefined ? Array.slice.call(this) : this[idx >= 0 ? idx : idx + this.length]
        },
        indexOf: function (o) {
            for (var i = 0; i < this.length; i++) {
                if (o === this[i]) {
                    return i;
                }
            }
            return -1
        },
        toArray: function (arg) {
            return slice.call(this);
        },
        objectToArray: function (data) {
            var result = { Columns: [], Rows: [] };
            if (data != null && data.length > 0) {
                $.each(data[0], function (key, val) { result.Columns.push(key); });
                $.each(data, function (ridx, val) {
                    var row = [];
                    $.each(result.Columns, function (cidx, name) {
                        row.push(val[name] == null ? "" : val[name]);
                    });
                    result.Rows.push(row);
                });
            };
            return result;
        }
    };
    //Object
    sdlbase.Object = {
        isObject: function (obj) {
            var type = typeof obj;
            return type === 'function' || type === 'object' && !!obj;
        }
    }
    //Type
    sdlbase.Type = {
        decType: function (t) {
            return Object.prototype.toString.call(t) === '[object ' + e + ']'
        }
    }
    //Reg
    sdlbase.Reg = {
        match: function r(e) {
            return e.match(Z)[0]
        }
    }
    //format
    sdlbase.Format =
    {
        numFormat: function (number, decimals, decPoint, thousandsSep) {
            if (number === "-") {
                return '-';
            }
            if (!isNaN(number)) {
                if (parseFloat(number) == 0) return parseFloat(number);
            }
            var lang = {
                decimalPoint: '.',
                thousandsSep: ','
            }, mathAbs = Math.abs,
            n = +number || 0,
            c = decimals === -1 ?
                (n.toString().split('.')[1] || '').length : // preserve decimals
                (isNaN(decimals = mathAbs(decimals)) ? 0 : decimals),
            d = decPoint === undefined ? lang.decimalPoint : decPoint,
            t = thousandsSep === undefined ? lang.thousandsSep : thousandsSep,
            s = n < 0 ? "-" : "",
            i = String(parseInt(n = mathAbs(n).toFixed(c), 10)),
            j = i.length > 3 ? i.length % 3 : 0;

            return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) +
            (c ? d + mathAbs(n - i).toFixed(c).slice(2) : "");
        },
        timeFormat: function (arg, fmt) {
            var o = {
                "M+": arg.getMonth() + 1, //月份 
                "d+": arg.getDate(), //日 
                "h+": arg.getHours(), //小时 
                "m+": arg.getMinutes(), //分 
                "s+": arg.getSeconds(), //秒 
                "q+": Math.floor((arg.getMonth() + 3) / 3), //季度 
                "S": arg.getMilliseconds() //毫秒 
            };
            if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (arg.getFullYear() + "").substr(4 - RegExp.$1.length));
            for (var k in o)
                if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
            return fmt;
        }
    };
    var _invoke = function (evt, status, result, callback) {
        callback == null ? function () { } : callback(evt, status, result);
    };
    sdlbase.getdata = function (opt) {
        opt.async || (opt.async = false);
        opt.queryjson || (opt.queryjson = {});
        opt.url || (opt.url = "../Data/DataAccess.ashx");
        var that = this;
        $.ajax({
            type: "POST" || opt.type,
            url: opt.url,
            timeout: 100000,
            data: opt.queryjson,
            cache: false,
            dataType: "json",
            beforeSend: function (xhr) {
                // $.loading.show();
                Metronic.startPageLoading();
            },
            error: function (request, status, error) {
                // _invoke(that, status.error, error, opt.callback);
                opt.callback.call(opt.evt, status);
                Metronic.stopPageLoading();
            },
            async: opt.async,
            complete: function (XHR, TS) {
                Metronic.stopPageLoading();
            },
            success: function (data, status) {
                if (data.Status == "Timeout") {
                    alert("登录超时或未登录！请重新登录！");
                    // window.location.href = "login.html";
                    Metronic.stopPageLoading();
                    return;
                }
                //缓存数据
                if (!that.isUndef(opt.evt))
                    opt.evt.cacheData.call(opt.evt, data);
                //回调函数
                opt.callback.call(opt.evt, status, data);
                Metronic.stopPageLoading();
            }
        });
    }
    //json
    sdlbase.Json =
        {
            formatResult: function (data) {
                var result = [];
                if (data != null && 'object') {
                    var t = [], t1 = data, col = t1.Columns, rows = t1.Rows;
                    for (var i in rows) {
                        if (sdlbase.has(rows, i)) {
                            var row = rows[i], d = {};
                            for (var j in col) {
                                if (sdlbase.has(col, j)) {
                                    d[col[j]] = row[j];
                                }
                            }
                            t.push(d);
                        }
                    }
                    result.push(t);
                    return result;
                }
            },
            //功能：获取返回结果中的数组数据
            //参数：返回结果|存储过程名称
            //返回：[]
            GetdsFmRst: function (rlt, procname) {
                if (rlt != null && rlt != undefined && rlt.Status == "Success") {
                    for (var i in rlt.Data[0].DataSets) {
                        if (rlt.Data[0].DataSets[i].Name == procname) {
                            return rlt.Data[0].DataSets[i].Tables[0];
                        }
                    }
                }
                return [];
            },
            GetdsFmRstExt: function (rlt, procname, num) {
                if (rlt != null && rlt != undefined) {
                    for (var i in rlt.Data[0].DataSets) {
                        if (rlt.Data[0].DataSets[i].Name == procname) {
                            return rlt.Data[0].DataSets[i].Tables[num];
                        }
                    }
                }
                return [];
            }
        };
    sdlbase.verify = {
        phone: function (arg) {
            var reg = /1\d{10}$/;
            return reg.test(arg);
        }
    }
    //guid generate
    sdlbase.Guid = function () {
        var S4 = function () {
            return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
        };
        return (S4() + S4() + S4() + S4() + S4() + S4() + S4() + S4()).toUpperCase();
    }
    sdlbase.getPK = function (tp) {
        var time = (new Date()).getTime();
        var rand = Math.ceil(Math.random() * 10);
        return tp + "_" + time + "_" + rand;
    }
    sdlbase.html_encode = function (str) {
        var s = "";
        if (str.length == 0) return "";
        s = str.replace(/&/g, "&amp;");  //1
        s = s.replace(/</g, "&lt;");
        s = s.replace(/>/g, "&gt;");
        s = s.replace(/ /g, "&nbsp;");
        s = s.replace(/\'/g, "&#39;");
        s = s.replace(/\"/g, "&quot;");
        s = s.replace(/\n/g, "<br>");
        return s;
    };
    sdlbase.html_decode = function (str) {
        var s = "";
        if (str.length == 0) return "";
        s = str.replace(/&amp;/g, "&");   //2 
        s = s.replace(/&lt;/g, "<");
        s = s.replace(/&gt;/g, ">");
        s = s.replace(/&nbsp;/g, " ");
        s = s.replace(/&#39;/g, "\'");
        s = s.replace(/&quot;/g, "\"");
        s = s.replace(/<br>/g, "\n");
        return s;
    }

    sdlbase.goBack = function () {
        if ((navigator.userAgent.indexOf('MSIE') >= 0) && (navigator.userAgent.indexOf('Opera') < 0)) { // IE  
            if (history.length > 0) {
                window.history.go(-1);
            } else {
                window.opener = null; window.close();
            }
        } else { //非IE浏览器  
            if (navigator.userAgent.indexOf('Firefox') >= 0 ||
                navigator.userAgent.indexOf('Opera') >= 0 ||
                navigator.userAgent.indexOf('Safari') >= 0 ||
                navigator.userAgent.indexOf('Chrome') >= 0 ||
                navigator.userAgent.indexOf('WebKit') >= 0) {

                if (window.history.length > 1) {
                    window.history.go(-1);
                } else {
                    window.opener = null; window.close();
                }
            } else { //未知的浏览器  
                window.history.go(-1);
            }
        }
    }
    //log
    sdlbase.log = {
        error: function (tar, emsg) {
            console.log(tar + ":" + emsg + "/n");
        }
    }

    //cmd support
    if (typeof define === 'function' && define.amd) {
        define('sdlbase', [], function () {
            return sdlbase;
        });
    }
}).call(this);
