var addVm = new Vue({
    el: "#LAY-new-naire",
    data: {
        naire_id: '',
        write_type: '0',     //0:仅限注册用户，次数无限制 1:无需注册，可填写n次 2:无需注册，每天可填写n次
        //write_time: 1,      //填写次数
        question_ids: [],
        question_types: [],
        question_titles: [],
        question_options: [],
        question_required: [],
        relate_questions: []    //该问题指向的其他问题id
    },
    methods: {
        
    }
})

var form = layui.form;
form.render();
form.on('select(write-type)', function(data) {
    addVm.$data.write_type = data.value;
});
form.on('submit(addnaire)', function(obj) {
    var data = obj.field;
    var token = getCookie('token');
    if (token != "") {
        // console.log(data);
        // console.log(addVm.$data);
        var naire_status;
        var curTime = getTime(new Date());
        if (data.start_time >= data.end_time) {
            return layer.msg("结束时间必须晚于开始时间！");
        }
        if (data.end_time <= curTime) {
            return layer.msg("结束时间必须晚于当前时间！");
        }
        if (addVm.$data.write_type !== '0' && (Math.floor(Number(data.write_time)) !== Number(data.write_time) || Number(data.write_time) < 0)) {
            return layer.msg("填写次数必须为正整数！");
        }
        if (addVm.$data.question_ids.length === 0) {
            return layer.msg("至少需要设计一个问题！");
        }
        if (curTime < data.start_time)
            naire_status = -1;
        else if (curTime >= data.start_time && curTime < data.end_time)
            naire_status = 0;
        $.post('../../api/addNaire', {naire_id: addVm.$data.naire_id, naire_title: data.naire_title, naire_info: data.naire_info,
            naire_status: naire_status, create_time: curTime, start_time: data.start_time, end_time: data.end_time, 
            write_type: addVm.$data.write_type, write_time: data.write_time}, function(data, status) {
                if (!data.result) {
                    layer.open({
                        title: '操作结果', content: '添加失败，请重试！'
                    })
                }
            })
        var result = true;
        var failIndex = -1;
        var flag = true;
        console.log(addVm.$data.question_titles);
        for (var i = 0; i < addVm.$data.question_ids.length && flag; i++) {
            $.post('../../api/addQuestion', {question_id: addVm.$data.question_ids[i], naire_id: addVm.$data.naire_id, question_type: addVm.$data.question_types[i],
                question_title: addVm.$data.question_titles[i], question_option: addVm.$data.question_options[i], question_require: addVm.$data.question_required[i]},
                function (data, status) {
                    result = data.result;
                    if (!result) {
                        failIndex = i;
                        flag = false;   //等同break
                    }
                })
        }
        if (result) {
            layer.confirm('添加成功！', {
                title: '操作结果', btn: ['确定']
            }, function() {
                window.location = 'all';
            });
        } else {
            layer.open({
                title: '操作结果', content: '添加失败，请重试！'
            });
            for (var i = 0; i < failIndex; i++) {
                $.get('../../api/delQuestion', {question_id: addVm.$data.question_ids[i]});
            }
        }
    } else {
        layer.open({
            title: '操作结果', content: '请先登录！'
        })
    }
});

function showQuestion() {
    $('#toAdd').empty();
    for (var i = 0; i < addVm.$data.question_ids.length; i++) {
        var str = "";
        var id = i + 1;
        str += "<div class='layui-colla-item'><h2 class='layui-colla-title'>";
        str += "<b>问题" + id + ".</b> " + addVm.$data.question_titles[i];
        if (addVm.$data.question_types[i] === '3') {
            str += "（文本填写题）";
            if (addVm.$data.question_required[i] === true)
                str += "<b>必填</b>";
            str += "</h2>";
            str += "<div class='layui-colla-content'>";
            str += "<p>此题为文本填写题</p>";
            var index = addVm.$data.question_options[i].indexOf('<texttype>') - 1;
            if (addVm.$data.question_options[i][index] === '0')
                str += "<p><b>文本填写题类型：</b>单行</p>";
            else
                str += "<p><b>文本填写题类型：</b>多行</p>";
        } else if (addVm.$data.question_types[i] == '4') {
            str += "（数字填写题）";
            if (addVm.$data.question_required[i] === true)
                str += "<b>必填</b>";
            str += "</h2>";
            str += "<div class='layui-colla-content'>";
            str += "<p>此题为数字填写题</p>";
            var index = addVm.$data.question_options[i].indexOf('<numtype>') - 1;
            if (addVm.$data.question_options[i][index] === '0')
                str += "<p><b>数字填写题类型：</b>整数</p>";
            else
                str += "<p><b>数字填写题类型：</b>小数</p>";
        } else if (addVm.$data.question_types[i] == '2') {
            str += "（评分题）";
            if (addVm.$data.question_required[i] === true)
                str += "<b>必填</b>";
            str += "</h2>";
            str += "<div class='layui-colla-content'>";
            var floorStart = addVm.$data.question_options[i].indexOf('<floorrate>');
            var ceilStart = addVm.$data.question_options[i].indexOf('<ceilrate>');
            var rateStart = addVm.$data.question_options[i].indexOf('<ratetype>');
            var floorRate = addVm.$data.question_options[i].substr(0, floorStart);
            var ceilRate = addVm.$data.question_options[i].substr(floorStart + 11, ceilStart - floorStart - 11);
            var rateType = addVm.$data.question_options[i][rateStart - 1];
            str += "<p><b>最小分值：</b>" + floorRate + "</p>";
            str += "<p><b>最大分值：</b>" + ceilRate + "</p>";
            if (rateType === '0')
                str += "<p><b>评分题类型：</b>评分单选</p>";
            else
                str += "<p><b>评分题类型：</b>评分滑块</p>"; 
        } else {
            if (addVm.$data.question_types[i] == '0')
                str += "（单选题）";
            else
                str += "（多选题）";
            if (addVm.$data.question_required[i] === true)
                str += "<b>必填</b>";
            str += "</h2>";
            str += "<div class='layui-colla-content'>";
            var options = addVm.$data.question_options[i].split("<option>");
            for (var j = 0; j < options.length - 1; j++) {
                str += "<p><b>" + "选项" + parseInt(j + 1) + ".</b> " + options[j] + "</p>";
            }
        }
        //级联
        if (addVm.$data.question_options[i].indexOf('<relate>') !== -1) {
            var tmpStr = getTmpStr(i);
            var relateStart = tmpStr.indexOf('<relate>');
            var relateQuestionID = tmpStr.substr(0, relateStart);
            var relateQuestionIndex = addVm.$data.question_ids.indexOf(relateQuestionID);
            //console.log(addVm.$data.relate_questions);
            //addVm.$data.relate_questions[relateQuestionIndex].push(addVm.$data.question_ids[i]);
            var relateOptionIndex = tmpStr.substr(relateStart + 8).split('<relateoption>');
            str += "<b>关联问题：</b><p>问题" + parseInt(relateQuestionIndex + 1) + ". " + addVm.$data.question_titles[relateQuestionIndex] + "</p>";
            str += "<b>关联选项：</b>";
            var relateOptions = addVm.$data.question_options[relateQuestionIndex].split("<option>");
            for (var j = 0; j < relateOptionIndex.length - 1; j++) {
                str += "<p>选项" + parseInt(parseInt(relateOptionIndex[j]) + 1) + ". " + relateOptions[relateOptionIndex[j]] + "</p>";
            }
        }
        str += "<button class='layui-btn layui-btn-sm' type='button' onclick='editQuestion(" + i + ")'>编辑</button>";
        str += "<button class='layui-btn layui-btn-sm layui-btn-danger' type='button' onclick='delQuestion(" + i + ")'>删除</button>";
        str += "</div></div>";
        //console.log(str);
        $('#toAdd').append(str);
    }
    layui.element.render('collapse');
}

function addQuestion() {
    layer.open({
        type: 2,
        title: '添加问题',
        content: 'question',
        shadeClose: true,
        area: ['60%', '80%']
    })
}

function editQuestion(val) {
    var data = [];
    data.push(addVm.$data.question_ids[val]);
    data.push(addVm.$data.question_types[val]);
    data.push(addVm.$data.question_titles[val]);
    data.push(addVm.$data.question_options[val]);
    data.push(addVm.$data.question_required[val]);
    if (addVm.$data.question_options[val].indexOf('<relate>') !== -1) {
        var tmpStr = getTmpStr(val);
        var relateStart = tmpStr.indexOf('<relate>');
        var relateQuestionID = tmpStr.substr(0, relateStart);
        var relateQuestionIndex = addVm.$data.question_ids.indexOf(relateQuestionID);
        data.push(relateQuestionIndex);
    }
    if (addVm.$data.relate_questions[val].length !== 0) {
        layer.confirm("若编辑，该问题的所有后续关联问题都必须重新添加，是否继续？", {
            btn: ['确定', '取消']
        }, function (){
            layer.open({
                type: 2,
                title: '修改问题',
                content: 'question',
                shadeClose: true,
                area: ['60%', '80%'],
                success: function (layero, index) {
                    var iframe = window['layui-layer-iframe' + index];
                    iframe.child(data);
                }
            })
        })
    } else {
        layer.open({
            type: 2,
            title: '修改问题',
            content: 'question',
            shadeClose: true,
            area: ['60%', '80%'],
            success: function (layero, index) {
                var iframe = window['layui-layer-iframe' + index];
                iframe.child(data);
            }
        })
    }
}

function cascadeDel(val) {
    if (addVm.$data.relate_questions[val].length === 0)
        return;
    var toDel = new Array();
    for (var i = 0; i < addVm.$data.relate_questions[val].length; i++) {
        var index = addVm.$data.question_ids.indexOf(addVm.$data.relate_questions[val][i]);
        var id = addVm.$data.question_ids[index];
        cascadeDel(index);
        index = addVm.$data.question_ids.indexOf(id);
        //console.log('del: ' + addVm.$data.question_ids[index]);
        if (addVm.$data.question_options[index].indexOf('<relate>') !== -1) {
            //从关联的问题列表中删除自身
            // var tmpStr = getTmpStr(index);
            // var relateIndex = tmpStr.indexOf('<relate');
            // var relateQuestionID = tmpStr.substr(0, relateIndex);
            // var relateQuestionIndex = addVm.$data.question_ids.indexOf(relateQuestionID);
            // var thisIndex = addVm.$data.relate_questions[relateQuestionIndex].indexOf(id);
            // addVm.$data.relate_questions[relateQuestionIndex].splice(thisIndex, 1);
            toDel.push(id);
        } else {
            addVm.$data.question_ids.splice(index, 1);
            addVm.$data.question_types.splice(index, 1);
            addVm.$data.question_titles.splice(index, 1);
            addVm.$data.question_options.splice(index, 1);
            addVm.$data.question_required.splice(index, 1);
            addVm.$data.relate_questions.splice(index, 1);
        }
    }
    for (var i = 0; i < toDel.length; i++) {
        var index = addVm.$data.question_ids.indexOf(toDel[i]);
        var tmpStr = getTmpStr(index);
        var relateIndex = tmpStr.indexOf('<relate');
        var relateQuestionID = tmpStr.substr(0, relateIndex);
        var relateQuestionIndex = addVm.$data.question_ids.indexOf(relateQuestionID);
        var thisIndex = addVm.$data.relate_questions[relateQuestionIndex].indexOf(id);
        addVm.$data.relate_questions[relateQuestionIndex].splice(thisIndex, 1);
        addVm.$data.question_ids.splice(index, 1);
        addVm.$data.question_types.splice(index, 1);
        addVm.$data.question_titles.splice(index, 1);
        addVm.$data.question_options.splice(index, 1);
        addVm.$data.question_required.splice(index, 1);
        addVm.$data.relate_questions.splice(index, 1);
    }
}

function delQuestion(val) {
    if (addVm.$data.relate_questions[val].length !== 0) {
        layer.confirm("将同时删除此题的所有后续关联问题，是否继续？", {
            btn: ['确定', '取消']
        }, function() {
            var id = addVm.$data.question_ids[val];
            cascadeDel(val);
            val = addVm.$data.question_ids.indexOf(id);
            //console.log('del: ' + addVm.$data.question_ids[val]);
            if (addVm.$data.question_options[val].indexOf('<relate>') !== -1) {
                //从关联的问题列表中删除自身
                var tmpStr = getTmpStr(val);
                var relateIndex = tmpStr.indexOf('<relate');
                var relateQuestionID = tmpStr.substr(0, relateIndex);
                var relateQuestionIndex = addVm.$data.question_ids.indexOf(relateQuestionID);
                var thisIndex = addVm.$data.relate_questions[relateQuestionIndex].indexOf(addVm.$data.question_ids[val]);
                addVm.$data.relate_questions[relateQuestionIndex].splice(thisIndex, 1)
            }
            addVm.$data.question_ids.splice(val, 1);
            addVm.$data.question_types.splice(val, 1);
            addVm.$data.question_titles.splice(val, 1);
            addVm.$data.question_options.splice(val, 1);
            addVm.$data.question_required.splice(val, 1);
            addVm.$data.relate_questions.splice(val, 1);
            showQuestion();
            layer.close(layer.index);
        })
    } else {
        if (addVm.$data.question_options[val].indexOf('<relate>') !== -1) {
            //从关联的问题列表中删除自身
            var tmpStr = getTmpStr(val);
            var relateIndex = tmpStr.indexOf('<relate');
            var relateQuestionID = tmpStr.substr(0, relateIndex);
            var relateQuestionIndex = addVm.$data.question_ids.indexOf(relateQuestionID);
            var thisIndex = addVm.$data.relate_questions[relateQuestionIndex].indexOf(addVm.$data.question_ids[val]);
            addVm.$data.relate_questions[relateQuestionIndex].splice(thisIndex, 1)
        }
        addVm.$data.question_ids.splice(val, 1);
        addVm.$data.question_types.splice(val, 1);
        addVm.$data.question_titles.splice(val, 1);
        addVm.$data.question_options.splice(val, 1);
        addVm.$data.question_required.splice(val, 1);
        addVm.$data.relate_questions.splice(val, 1);
        showQuestion();
        layer.close(layer.index);
    }
}

function getTmpStr(val) {
    var tmpStr;
    if (addVm.$data.question_types[val] === '4')
        tmpStr = addVm.$data.question_options[val].substr(10);
    else if (addVm.$data.question_types[val] === '3')
        tmpStr = addVm.$data.question_options[val].substr(11);
    else if (addVm.$data.question_types[val] === '2') {
        var rateIndex = addVm.$data.question_options[val].indexOf('<ratetype>');
        tmpStr = addVm.$data.question_options[val].substr(rateIndex + 10);
    } else {
        var options = addVm.$data.question_options[val].split('<option>');
        tmpStr = options[options.length - 1];
    }
    return tmpStr;
}

function addZero(m) {
    return m < 10 ? '0' + m : m;
}

function getTime(date) {
    y = date.getFullYear();
    M = date.getMonth() + 1;
    d = date.getDate();
    h = date.getHours();
    m = date.getMinutes();
    s = date.getSeconds();
    return y + '-' + addZero(M) + '-' + addZero(d) + ' ' + addZero(h) + ':' + addZero(m) + ':' + addZero(s);
}
