/**
 * Created by 松松 on 13-10-23.
 */
define("sjplus/cms/stable/data/init-debug", [ "./edit-tpl-debug.tpl", "./edit-excel-debug.tpl", "./edit-excel-debug.css", "template-debug", "./edit-excel-debug", "./save-data-debug" ], function(require, exports, module) {
    var tpl = require("./edit-tpl-debug.tpl");
    var excelTpl = require("./edit-excel-debug.tpl");
    require("./edit-excel-debug.css");
    var S = KISSY;
    var template = require("template-debug");
    var tabArr = [];
    var $container = $("#editFormWrapper");
    var repeatIdArr = [];
    //filter repeat id
    cf.arr = S.filter(cf.arr, function(item) {
        if (S.indexOf(item.tab.id, repeatIdArr) > -1) {
            return false;
        } else {
            repeatIdArr.push(item.tab.id);
        }
        if (S.indexOf(item.tab.group, tabArr) < 0) {
            tabArr.push(item.tab.group);
        }
        return true;
    });
    $container.html(template.render(tpl, {
        tabArr: tabArr
    }));
    //切换tab，并构造表单
    function showExcel(ev) {
        var target = ev.currentTarget;
        $(target).addClass("active").siblings("li").removeClass("active");
        var group = $(target).attr("data-group-trigger");
        var fields = S.map(getFields(group), function(item) {
            return {
                id: item.tab.id,
                title: item.tab.title,
                row: item.tab.row,
                defaultRow: item.tab.defaultRow,
                fieldsSum: S.keys(item.fields).join(","),
                fields: S.map(S.keys(item.fields), function(key) {
                    return {
                        key: key,
                        type: item.fields[key].type,
                        tip: item.fields[key].tip
                    };
                })
            };
        });
        var $wrapper = $container.find("[data-group=" + group + "]");
        if ($wrapper.data("is-build") !== true) {
            $wrapper.html(template.render(excelTpl, {
                fields: fields
            })).data("is-build", true);
            //准备一些变量并绑定到data上，供其他脚本中使用
            $wrapper.find("div.excel").each(function(index, excel) {
                var $excel = $(excel);
                var $inputWrapper = $excel.find(".J-input");
                //保存所有行的引用
                $excel.data("allRow", $excel.find(".excel-container")[0].getElementsByTagName("div"));
                //输入框的包装容器
                $excel.data("inputFieldWrapper", $inputWrapper);
                //输入框
                $excel.data("inputField", $inputWrapper.find("textarea"));
                //保存字段引用
                $excel.data("excelFields", $excel.find("div.excel-field li.field"));
                $excel.data("inputField").on("blur", function() {
                    editExcel.updateData($excel);
                });
            });
        }
        //隐藏所有表格，显示当前表格
        $container.find("[data-group]").hide().filter("[data-group=" + group + "]").show();
        changeFieldsWidth();
        //将输入框和各种单元格，与字段对齐
        editExcel.alignment();
        //切换时将数据刷入
        editExcel.updateAll();
    }
    //传入group，返回包含该group的所有对象
    function getFields(group) {
        var fields = [];
        S.each(cf.arr, function(item) {
            if (item.tab.group === group) fields.push(item);
        });
        return fields;
    }
    //调整字段的宽度
    function changeFieldsWidth() {
        var $ul = $container.find(":visible[data-group] ul.field");
        $ul.each(function(index, item) {
            var $li = $(item).find("li");
            $li.width(parseInt(item.offsetWidth / $(item).find("li").size(), 10));
        });
    }
    $(window).on("resize", changeFieldsWidth);
    //处理具体的编辑业务
    var editExcel = require("./edit-excel-debug");
    //保存数据
    require("./save-data-debug");
    //当点击tab的时候，构造表单
    var $tab = $("#tab-area");
    $tab.on("click", "li[data-group-trigger]", showExcel);
    $tab.find("li[data-group-trigger]").eq(0).trigger("click", showExcel);
});

define("sjplus/cms/stable/data/edit-tpl-debug.tpl", [], '<ul id="tab-area">\n    #each(group in tabArr)<li data-group-trigger="#{group}">#{group}</li>#end\n</ul>\n<div id="main-container">\n    #each(group in tabArr)\n    <div data-group="#{group}">\n\n    </div>\n    #end\n</div>');

define("sjplus/cms/stable/data/edit-excel-debug.tpl", [], '#each(item in fields)\n<div class="unit">\n    <div class="title"><h2>#{item.title}</h2></div>\n    <div class="excel">\n        <div class="excel-field">\n            <ul class="field">\n                #each(field in item.fields)<li class="field" data-field="#{field.name}"><span>#{field.tip}</span><s></s></li>#end\n            </ul>\n        </div>\n        <div class="excel-wrapper">\n            <div class="J-input">\n                <textarea class="J-input-field"></textarea>\n\n                <p class="control" href="#"><a href="#" class="J-fill-excel-trigger">这是Excel数据</a></p>\n            </div>\n            <div class="J-add-delete-row"><span class="J-add">+</span><span class="J-delete">-</span></div>\n            <div class="excel-container" data-row="#{item.row}" data-field="#{item.fieldsSum}"\n                 data-cols="#{item.fields.length}" data-id="#{item.id}">\n                #if(cf[item.id] && window.cf[item.id].data)\n                    #each(val in window.cf[item.id].data)\n                        <div class="J-row">\n                            #each(_val,_index in val)\n                            #if(_index < item.fields.length )\n                            <textarea class="J-cell" data-col-index="#{_index}" readonly="">#{_val}</textarea>\n                            #end\n                            #end\n                        </div>\n                    #end\n                #else\n                    #js for(var __row=0;__row< item.defaultRow;__row++){ #end\n                    <div class="J-row"></div>\n                    #js } #end\n                #end\n            </div>\n            <div class="excel-trigger-area"></div>\n        </div>\n    </div>\n</div>\n#end\n');

define("sjplus/cms/stable/data/edit-excel-debug.css", [], function() {
    seajs.importStyle("h2,ul,li,p{margin:0;padding:0}#tab-area li{display:inline-block;padding:12px 24px;font-size:28px}#tab-area li.active{background:#cfc}.unit{border:solid 1px #000;border-radius:3px;padding:12px;margin:12px}.unit h2{font-size:16px;background:#cfc;padding:12px;font-weight:700}ul.field{white-space:nowrap;height:100%;overflow:hidden}ul.field li span{display:inline-block;line-height:38px;height:38px;width:100%;padding:0 2px;background:#eee}ul.field li s{position:absolute;right:0;top:0;height:100%;border-right:solid 1px #ccc}ul.field li:last-child s{display:none}ul.field li{display:inline-block;text-align:center;position:relative;height:100%}.J-row{height:30px;border-bottom:solid 1px #ccc;overflow:hidden;position:relative}.excel{position:relative;padding-top:38px;border:solid 1px #ccc;border-bottom:0;font-family:simsun,sans-serif}.excel-field{position:absolute;left:0;top:0;width:100%;height:100%}.excel-wrapper{position:relative;border-bottom:0}.excel-trigger-area{position:absolute;left:0;top:0;width:100%;height:100%;z-index:3;background:url(http://img01.taobaocdn.com/tps/i1/T1FeW3XXNfXXXXXXXX-36-36.gif) -99999em -99999em no-repeat}.J-input{position:absolute;left:-999em;top:-999em;border:solid 2px green;margin-left:-2px;margin-top:-2px;box-shadow:inset 0 0 3px #050;z-index:10;background:#fff}.J-input p{position:absolute;right:0;bottom:-20px;background:rgba(255,255,255,.9);color:#00f;padding:12px;font-size:12px;border:solid 1px #aaa;box-shadow:0 0 5px rgba(0,0,0,.5)}.J-input p a{color:#00f}.J-input textarea{display:block;width:100%;background:#fff;border:0;margin:0;outline:0;box-shadow:0 0 5px green;height:100%;resize:none}.J-cell{position:absolute;height:100%;resize:none;border:0;padding:3px 0 0 3px;background:transparent;white-space:nowrap;overflow:hidden;z-index:0;outline:0}.J-add-remove{position:absolute;width:40px}.J-add-delete-row{position:absolute;left:-30px;top:-99999em;width:30px;background:#080;text-align:center;z-index:9;border-radius:3px;overflow:hidden;cursor:default}.J-add-delete-row span{display:block;color:#fff;height:49%}.J-add-delete-row span:hover{background:#050}");
});

/**
 * Created by 松松 on 13-10-24.
 */
define("sjplus/cms/stable/data/edit-excel-debug", [], function(require, exports, module) {
    var $container = $("#main-container");
    $container.on("select", function(ev) {
        ev.preventDefault();
    });
    //插入新行
    $container.on("mousemove", "div.excel-trigger-area", function(ev) {
        var $currentTarget = $(ev.currentTarget);
        var $excel = $currentTarget.parents("div.excel");
        var allRow = $excel.data("allRow");
        var rowIndex = 0;
        for (var i = 0; i < allRow.length; i++) {
            if ($(allRow[i]).position().top + allRow[i].offsetHeight > ev.offsetY) {
                rowIndex = i;
                break;
            }
        }
        var control = $excel.find("div.J-add-delete-row");
        $(control).css({
            top: $(allRow[rowIndex]).position().top
        }).data("rowIndex", rowIndex);
    });
    $container.on("click", "div.J-add-delete-row", function(ev) {
        exports.updateAll();
        var $target = $(ev.target);
        var $currentTarget = $(ev.currentTarget);
        var $excel = $currentTarget.parents("div.excel");
        $excel.data("inputFieldWrapper").hide();
        if ($target.hasClass("J-add")) {
            $('<div class="J-row"></div>').insertBefore($excel.data("allRow")[$currentTarget.data("rowIndex")]);
        }
        if ($target.hasClass("J-delete")) {
            if ($excel.data("allRow").length === 1) {
                alert("最后一行不能删除");
                return;
            }
            $($excel.data("allRow")[$currentTarget.data("rowIndex")]).remove();
        }
    });
    //单击单元格
    $container.on("mousedown", "div.excel-trigger-area", function(ev) {
        var $currentTarget = $(ev.currentTarget);
        var $excel = $currentTarget.parents("div.excel");
        var allRow = $excel.data("allRow");
        //保存行数的引用
        var position = $currentTarget.position();
        var $fields = $excel.data("excelFields");
        var arr = [];
        $fields.each(function(index, item) {
            arr.push([ $(item).position().left, $(item).position().left + item.offsetWidth ]);
        });
        var index = 0;
        for (var i = 0; i < arr.length; i++) {
            if (arr[i][1] >= ev.offsetX) {
                index = i;
                break;
            }
        }
        //获取当前行号
        var rowIndex = 0;
        for (i = 0; i < allRow.length; i++) {
            if ($(allRow[i]).position().top + allRow[i].offsetHeight > ev.offsetY) {
                rowIndex = i;
                break;
            }
        }
        //首先将数据刷入textarea，才更新列的信息
        if ($excel.data("position")) {
            exports.updateData($excel);
        }
        //存储字段的坐标，当前列，行信息
        $excel.data("position", {
            fieldsPosition: arr,
            colIndex: index,
            //获取点击的是第几行
            rowIndex: rowIndex
        });
        //将单元格和字段对齐
        exports.alignment();
        setTimeout(function() {
            $excel.data("inputField").focus();
        }, 100);
    });
    //定位输入框
    exports.setInputFieldPosition = function($excel) {
        var $position = $excel.data("position");
        if (!$position) return;
        $excel.data("inputFieldWrapper").show();
        $excel.data("inputFieldWrapper").css($excel.data("inputFieldPosition"));
        //查看当前定位点，是否有数据，有则显示出来
        //获取当前的列索引
        var colIndex = $position.colIndex;
        //获取到当前的行
        var currentRow = $($excel.data("allRow")[$position.rowIndex]);
        var val = currentRow.find("textarea[data-col-index=" + colIndex + "]").val();
        if (val) {
            $excel.data("inputField").val(val);
        } else {
            $excel.data("inputField").val("");
        }
    };
    //将输入框的数据刷入行中
    exports.updateData = function($excel) {
        var $position = $excel.data("position");
        if (!$position) return;
        var inputFieldPosition = $excel.data("inputFieldPosition");
        var value = $excel.data("inputField").val();
        //获取当前的列索引
        var colIndex = $position.colIndex;
        var rowIndex = $position.rowIndex;
        //获取到当前的行
        var currentRow = $($excel.data("allRow")[rowIndex]);
        if (colIndex === undefined || currentRow === undefined) return;
        //检测是否已经有填充数据
        var $span = $('<textarea class="J-cell" data-col-index="' + colIndex + '" readonly>' + value + "</textarea>");
        if (currentRow.find("textarea[data-col-index=" + colIndex + "]").size() < 1) {
            delete inputFieldPosition.top;
            $span.appendTo($excel.data("allRow")[rowIndex]).css(inputFieldPosition);
        } else {
            currentRow.find("textarea[data-col-index=" + colIndex + "]").val(value);
        }
    };
    //将所有输入框中的数据刷入单元格
    //否则，要在各个excel中不同的单元格mousedown，会让用户很麻烦
    exports.updateAll = function() {
        $("div.excel-trigger-area").each(function(index, item) {
            var $excel = $(item).parents("div.excel");
            if ($excel.data("inputFieldPosition")) {
                exports.updateData($excel);
            }
            $excel.removeData("position");
        });
    };
    //将单元格与字段对齐，在调整窗口大小的时候
    exports.alignment = function() {
        $("div.excel-trigger-area:visible").each(function(index, item) {
            var $excel = $(item).parents("div.excel");
            var arr = [];
            $excel.data("excelFields").each(function(index, item) {
                arr.push([ $(item).position().left, $(item).position().left + item.offsetWidth ]);
            });
            var allRow = $excel.data("allRow");
            //将输入框定位到正确的单元格
            var $position = $excel.data("position");
            if ($position) {
                $excel.data("inputFieldPosition", {
                    left: arr[$position.colIndex][0],
                    top: $(allRow[$position.rowIndex]).position().top,
                    width: arr[index] !== undefined ? arr[index][1] - arr[index][0] : item.offsetWidth,
                    height: allRow[$position.rowIndex].offsetHeight
                });
            }
            //定位输入框到正确的位置
            exports.setInputFieldPosition($excel);
            //定位所有字段
            $(allRow).each(function(index, row) {
                for (var i = 0; i < arr.length; i++) {
                    $(row).find("textarea.J-cell[data-col-index=" + i + "]").css({
                        left: arr[i][0],
                        width: arr[i][1]
                    });
                }
            });
        });
    };
    $(window).on("resize", function() {
        exports.alignment();
    });
    //粘贴Excel数据
    $container.on("click", ".J-fill-excel-trigger", function(ev) {
        var $excel = $(ev.currentTarget).parents("div.excel");
        var $textarea = $excel.data("inputField");
        var value = $textarea.val();
        //分析Excel数据
        var reg = /[\n\t]"[^\t]*(\n+)[^\t]*"[\n\t]/g;
        value = value.replace(reg, function(re) {
            return re.replace(/["\n]/g, "");
        });
        value = value.replace(/\r/g, "");
        value = value.replace(/'/g, "’");
        var rowDataList = value.split("\n");
        var excelData = [];
        for (var i = 0; i < rowDataList.length; i++) {
            var row = rowDataList[i];
            if ($.trim(row).length < 1) continue;
            excelData.push(rowDataList[i].split("	"));
        }
        var colIndex = $excel.data("position").colIndex;
        var rowIndex = $excel.data("position").rowIndex;
        var str = "";
        for (var i = 0; i < excelData.length; i++) {
            str += '<div class="J-row">' + KISSY.map(excelData[i], function(val, col) {
                var _col = col + colIndex;
                //防止粘贴的字段超出excel所定义的字段范围
                if (_col > $excel.data("excelFields").size()) return "";
                return '<textarea class="J-cell" data-col-index="' + (col + colIndex) + '">' + val + "</textarea>";
            }).join("") + "</div>";
        }
        $(str).insertAfter($excel.data("allRow")[rowIndex]);
        $($excel.data("allRow")[rowIndex]).remove();
        exports.alignment();
    });
});

/**
 * Created by 松松 on 13-10-25.
 */
define("sjplus/cms/stable/data/save-data-debug", [ "sjplus/cms/stable/data/edit-excel-debug" ], function(require, exports, module) {
    var form = document.forms["excel"];
    var S = KISSY;
    KISSY.use("json", function() {
        var editExcel = require("sjplus/cms/stable/data/edit-excel-debug");
        $(form).on("submit", function(ev) {
            editExcel.updateAll();
            $.post("/save-data", {
                data: JSON.stringify(getFormData()),
                _csrf: window._csrf_token_
            }, function(result) {
                alert("保存完毕" + JSON.stringify(result));
            });
            ev.preventDefault();
        });
        function getFormData() {
            var result = {};
            $("div.excel-container").each(function(index, item) {
                var $item = $(item);
                var colNum = $item.data("cols");
                var $row = $item.find("div.J-row");
                result[$item.attr("data-id")] = {
                    colNum: colNum,
                    fields: $item.attr("data-field"),
                    data: []
                };
                //开始循环获取数据
                $row.each(function(i, row) {
                    var $row = $(row);
                    var _data = [];
                    for (var j = 0; j < colNum; j++) {
                        var val = $row.find("textarea[data-col-index=" + j + "]").val();
                        _data.push(val ? val : "");
                    }
                    //检查当前行是否有数据
                    for (j = 0; j < colNum; j++) {
                        if (_data[j] !== "") {
                            result[$item.attr("data-id")].data.push(_data);
                            break;
                        }
                    }
                });
            });
            return result;
        }
    });
});
