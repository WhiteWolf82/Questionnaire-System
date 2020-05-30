var vm = new Vue({
    el: "#LAY-edit-naire",
    data: {
        naire_id: '',
        naire_title: '',
        naire_info: '',
        start_time: '',
        end_time: '',
        write_type: '0',
        write_time: 0,
        question_ids: [],
        question_types: [],
        question_titles: [],
        question_options: [],
        question_required: [],
        relate_questions: [],    //该问题指向的其他问题id
        change_question_ids: [],
        del_question_ids: []
    },
    methods: {

    }
})

var form = layui.form;
form.render();
form.on('select(write-type)', function(data) {
    vm.$data.write_type = data.value;
});
form.on('submit(editnaire)', function(obj) {
    var data = obj.field;
    var token = getCookie('token');
    if (token != "") {
        if (vm.$data.write_type !== '0' && (Math.floor(Number(data.write_time)) !== Number(data.write_time) || Number(data.write_time) < 0)) {
            return layer.msg("填写次数必须为正整数！");
        }
        var result = true;
        $.post('/api/updateNaire', {naire_title: data.naire_title, naire_info: data.naire_info, write_type: vm.$data.write_type, 
            write_time: vm.$data.write_time, naire_id: vm.$data.naire_id}, function(data, status) {
                if (!data.result)
                    result = false;
        });
        for (var i = 0; i < vm.$data.change_question_ids.length; i++) {
            var index = vm.$data.question_ids.indexOf(vm.$data.change_question_ids[i]);
            var isRequire = (vm.$data.question_required[index] == '1') ? true : false;
            $.post('/api/updateQuestion', {question_title: vm.$data.question_titles[index], is_require: isRequire, 
                question_id: vm.$data.change_question_ids[i]}, function(data, status) {
                    if (!data.result)
                        result = false;
            });
        }
        if (!result) {
            layer.open({
                title: '操作结果', content: '修改失败，请重试！'
            })
        } else {
            layer.open({
                title: '操作结果', content: '修改成功！',
                yes: function(index, layero) {
                    window.location.href = 'all';
                    layer.close(index);
                }
            })
        }
    } else {
        layer.open({
            title: '操作结果', content: '请先登录！'
        })
    }
});

function showQuestion() {
    $('#toAdd').empty();
    for (var i = 0; i < vm.$data.question_ids.length; i++) {
        var str = "";
        var id = i + 1;
        str += "<div class='layui-colla-item'><h2 class='layui-colla-title'>";
        str += "<b>问题" + id + ".</b> " + vm.$data.question_titles[i];
        if (vm.$data.question_types[i] === '3') {
            str += "（文本填写题）";
            if (vm.$data.question_required[i] === '1')
                str += "<b>必填</b>";
            str += "</h2>";
            str += "<div class='layui-colla-content'>";
            str += "<p>此题为文本填写题</p>";
            var index = vm.$data.question_options[i].indexOf('<texttype>') - 1;
            if (vm.$data.question_options[i][index] === '0')
                str += "<p><b>文本填写题类型：</b>单行</p>";
            else
                str += "<p><b>文本填写题类型：</b>多行</p>";
        } else if (vm.$data.question_types[i] == '4') {
            str += "（数字填写题）";
            if (vm.$data.question_required[i] === '1')
                str += "<b>必填</b>";
            str += "</h2>";
            str += "<div class='layui-colla-content'>";
            str += "<p>此题为数字填写题</p>";
            var index = vm.$data.question_options[i].indexOf('<numtype>') - 1;
            if (vm.$data.question_options[i][index] === '0')
                str += "<p><b>数字填写题类型：</b>整数</p>";
            else
                str += "<p><b>数字填写题类型：</b>小数</p>";
        } else if (vm.$data.question_types[i] == '2') {
            str += "（评分题）";
            if (vm.$data.question_required[i] === '1')
                str += "<b>必填</b>";
            str += "</h2>";
            str += "<div class='layui-colla-content'>";
            var floorStart = vm.$data.question_options[i].indexOf('<floorrate>');
            var ceilStart = vm.$data.question_options[i].indexOf('<ceilrate>');
            var rateStart = vm.$data.question_options[i].indexOf('<ratetype>');
            var floorRate = vm.$data.question_options[i].substr(0, floorStart);
            var ceilRate = vm.$data.question_options[i].substr(floorStart + 11, ceilStart - floorStart - 11);
            var rateType = vm.$data.question_options[i][rateStart - 1];
            str += "<p><b>最小分值：</b>" + floorRate + "</p>";
            str += "<p><b>最大分值：</b>" + ceilRate + "</p>";
            if (rateType === '0')
                str += "<p><b>评分题类型：</b>评分单选</p>";
            else
                str += "<p><b>评分题类型：</b>评分滑块</p>"; 
        } else {
            if (vm.$data.question_types[i] == '0')
                str += "（单选题）";
            else
                str += "（多选题）";
            if (vm.$data.question_required[i] === '1')
                str += "<b>必填</b>";
            str += "</h2>";
            str += "<div class='layui-colla-content'>";
            var options = vm.$data.question_options[i].split("<option>");
            for (var j = 0; j < options.length - 1; j++) {
                str += "<p><b>" + "选项" + parseInt(j + 1) + ".</b> " + options[j] + "</p>";
            }
        }
        //级联
        if (vm.$data.question_options[i].indexOf('<relate>') !== -1) {
            var tmpStr = getTmpStr(i);
            var relateStart = tmpStr.indexOf('<relate>');
            var relateQuestionID = tmpStr.substr(0, relateStart);
            var relateQuestionIndex = vm.$data.question_ids.indexOf(relateQuestionID);
            //console.log(vm.$data.relate_questions);
            //vm.$data.relate_questions[relateQuestionIndex].push(vm.$data.question_ids[i]);
            var relateOptionIndex = tmpStr.substr(relateStart + 8).split('<relateoption>');
            str += "<b>关联问题：</b><p>问题" + parseInt(relateQuestionIndex + 1) + ". " + vm.$data.question_titles[relateQuestionIndex] + "</p>";
            str += "<b>关联选项：</b>";
            var relateOptions = vm.$data.question_options[relateQuestionIndex].split("<option>");
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

function editQuestion(val) {
    var data = [];
    data.push(vm.$data.question_ids[val]);
    data.push(vm.$data.question_types[val]);
    data.push(vm.$data.question_titles[val]);
    data.push(vm.$data.question_options[val]);
    data.push(vm.$data.question_required[val]);
    if (vm.$data.question_options[val].indexOf('<relate>') !== -1) {
        var tmpStr = getTmpStr(val);
        var relateStart = tmpStr.indexOf('<relate>');
        var relateQuestionID = tmpStr.substr(0, relateStart);
        var relateQuestionIndex = vm.$data.question_ids.indexOf(relateQuestionID);
        data.push(relateQuestionIndex);
    }
    layer.open({
        type: 2,
        title: '修改问题',
        content: 'editquestion',
        shadeClose: true,
        area: ['60%', '80%'],
        success: function (layero, index) {
            var iframe = window['layui-layer-iframe' + index];
            iframe.child(data);
        }
    })
}

function cascadeDel(val) {
    if (vm.$data.relate_questions[val].length === 0)
        return;
    for (var i = 0; i < vm.$data.relate_questions[val].length; i++) {
        var index = vm.$data.question_ids.indexOf(vm.$data.relate_questions[val][i]);
        var id = vm.$data.question_ids[index];
        cascadeDel(index);
        index = vm.$data.question_ids.indexOf(id);
        //console.log('del: ' + vm.$data.question_ids[index]);
        vm.$data.del_question_ids.push(id);
        if (vm.$data.question_options[index].indexOf('<relate>') !== -1) {
            //从关联的问题列表中删除自身
            var tmpStr = getTmpStr(index);
            var relateIndex = tmpStr.indexOf('<relate');
            var relateQuestionID = tmpStr.substr(0, relateIndex);
            var relateQuestionIndex = vm.$data.question_ids.indexOf(relateQuestionID);
            var thisIndex = vm.$data.relate_questions[relateQuestionIndex].indexOf(id);
            vm.$data.relate_questions[relateQuestionIndex].splice(thisIndex, 1)
        }
        vm.$data.question_ids.splice(index, 1);
        vm.$data.question_types.splice(index, 1);
        vm.$data.question_titles.splice(index, 1);
        vm.$data.question_options.splice(index, 1);
        vm.$data.question_required.splice(index, 1);
        vm.$data.relate_questions.splice(index, 1);
    }
}

function delQuestion(val) {
    layer.confirm("将同时删除该问题的所有答案，是否继续？", {
        btn: ['确定', '取消']
    }, function() {
        if (vm.$data.relate_questions[val].length !== 0) {
            layer.confirm("将同时删除此题的所有后续关联问题及其答案，是否继续？", {
                btn: ['确定', '取消']
            }, function() {
                var id = vm.$data.question_ids[val];
                cascadeDel(val);
                val = vm.$data.question_ids.indexOf(id);
                //console.log('del: ' + vm.$data.question_ids[val]);
                vm.$data.del_question_ids.push(id);
                if (vm.$data.question_options[val].indexOf('<relate>') !== -1) {
                    //从关联的问题列表中删除自身
                    var tmpStr = getTmpStr(val);
                    var relateIndex = tmpStr.indexOf('<relate');
                    var relateQuestionID = tmpStr.substr(0, relateIndex);
                    var relateQuestionIndex = vm.$data.question_ids.indexOf(relateQuestionID);
                    var thisIndex = vm.$data.relate_questions[relateQuestionIndex].indexOf(vm.$data.question_ids[val]);
                    vm.$data.relate_questions[relateQuestionIndex].splice(thisIndex, 1)
                }
                vm.$data.question_ids.splice(val, 1);
                vm.$data.question_types.splice(val, 1);
                vm.$data.question_titles.splice(val, 1);
                vm.$data.question_options.splice(val, 1);
                vm.$data.question_required.splice(val, 1);
                vm.$data.relate_questions.splice(val, 1);
                showQuestion();
                layer.close(layer.index);
            })
        } else {
            vm.$data.del_question_ids.push(vm.$data.question_ids[val]);
            if (vm.$data.question_options[val].indexOf('<relate>') !== -1) {
                //从关联的问题列表中删除自身
                var tmpStr = getTmpStr(val);
                var relateIndex = tmpStr.indexOf('<relate');
                var relateQuestionID = tmpStr.substr(0, relateIndex);
                var relateQuestionIndex = vm.$data.question_ids.indexOf(relateQuestionID);
                var thisIndex = vm.$data.relate_questions[relateQuestionIndex].indexOf(vm.$data.question_ids[val]);
                vm.$data.relate_questions[relateQuestionIndex].splice(thisIndex, 1)
            }
            vm.$data.question_ids.splice(val, 1);
            vm.$data.question_types.splice(val, 1);
            vm.$data.question_titles.splice(val, 1);
            vm.$data.question_options.splice(val, 1);
            vm.$data.question_required.splice(val, 1);
            vm.$data.relate_questions.splice(val, 1);
            showQuestion();
            layer.close(layer.index);
        }
    })
}

function getTmpStr(val) {
    var tmpStr;
    if (vm.$data.question_types[val] === '4')
        tmpStr = vm.$data.question_options[val].substr(10);
    else if (vm.$data.question_types[val] === '3')
        tmpStr = vm.$data.question_options[val].substr(11);
    else if (vm.$data.question_types[val] === '2') {
        var rateIndex = vm.$data.question_options[val].indexOf('<ratetype>');
        tmpStr = vm.$data.question_options[val].substr(rateIndex + 10);
    } else {
        var options = vm.$data.question_options[val].split('<option>');
        tmpStr = options[options.length - 1];
    }
    return tmpStr;
}