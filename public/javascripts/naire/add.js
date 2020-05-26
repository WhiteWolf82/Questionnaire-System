var addVm = new Vue({
    el: "#LAY-questions",
    data: {
        naire_id: '',
        question_ids: [],
        question_types: [],
        question_titles: [],
        question_options: [],
        relate_questions: []
    },
    methods: {
        
    }
})

function showQuestion() {
    $('#toAdd').empty();
    for (var i = 0; i < addVm.$data.question_ids.length; i++) {
        var str = "";
        var id = i + 1;
        str += "<div class='layui-colla-item'><h2 class='layui-colla-title'>";
        str += "问题" + id + ". " + addVm.$data.question_titles[i];
        if (addVm.$data.question_types[i] == '4') {
            str += "（文本填写题）</h2>";
            str += "<div class='layui-colla-content'>";
            str += "<p>此题为文本填写题</p>"
        } else if (addVm.$data.question_types[i] == '5') {
            str += "（数字填写题）</h2>";
            str += "<div class='layui-colla-content'>";
            str += "<p>此题为数字填写题</p>"
        } else if (addVm.$data.question_types[i] == '2') {
            str += "（评分题）</h2>";
            str += "<div class='layui-colla-content'>";
            var floorStart = addVm.$data.question_options[i].indexOf('<floorrate>');
            var ceilStart = addVm.$data.question_options[i].indexOf('<ceilrate>');
            var rateStart = addVm.$data.question_options[i].indexOf('<ratetype>');
            var floorRate = addVm.$data.question_options[i].substr(0, floorStart);
            var ceilRate = addVm.$data.question_options[i].substr(floorStart + 11, ceilStart - 12);
            var rateType = addVm.$data.question_options[i][rateStart - 1];
            str += "<p>最小分值：" + floorRate + "</p>";
            str += "<p>最大分值：" + ceilRate + "</p>";
            if (rateType === '0')
                str += "<p>评分题类型：评分单选</p>";
            else
                str += "<p>评分题类型：评分滑块</p>"; 
        } else if (addVm.$data.question_types[i] == '3') {
            str += "（级联选择题）</h2>";
            str += "<div class='layui-colla-content'>";
            var options = addVm.$data.question_options[i].split("<option>");
            var relateQuestionIndex = addVm.$data.question_ids.indexOf(options[options.length - 1].substr(0, options[options.length - 1].indexOf("<relate>")));
            addVm.$data.relate_questions[relateQuestionIndex].push(addVm.$data.question_ids[addVm.$data.question_ids.length - 1]);
            var relateOptionIndex = options[options.length - 1].substr(options[options.length - 1].indexOf("<relate>") + 8).split("<relateoption>");
            str += "<b>关联问题：</b><p>问题" + parseInt(relateQuestionIndex + 1) + ". " + addVm.$data.question_titles[relateQuestionIndex] + "</p>";
            str += "<b>关联选项：</b>";
            var relateOptions = addVm.$data.question_options[relateQuestionIndex].split("<option>");
            for (var j = 0; j < relateOptionIndex.length - 1; j++) {
                str += "<p>选项" + parseInt(parseInt(relateOptionIndex[j]) + 1) + ". " + relateOptions[relateOptionIndex[j]] + "</p>";
            }
            str += "<b>此题选项：</b>";
            for (var j = 0; j < options.length - 1; j++) {
                str += "<p>" + "选项" + parseInt(j + 1) + ". " + options[j] + "</p>";
            }
        } else {
            if (addVm.$data.question_types[i] == '0')
                str += "（单选题）</h2>";
            else
                str += "（多选题）</h2>";
            str += "<div class='layui-colla-content'>";
            var options = addVm.$data.question_options[i].split("<option>");
            for (var j = 0; j < options.length - 1; j++) {
                str += "<p>" + "选项" + parseInt(j + 1) + ". " + options[j] + "</p>";
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

}

function delQuestion(val) {
    if (addVm.$data.relate_questions[val].length !== 0) {
        layer.confirm("将同时删除此题的所有关联问题，是否继续？", {
            btn: ['确定', '取消']
        }, function() {
            for (var i = 0; i < addVm.$data.relate_questions[val].length; i++) {
                var index = addVm.$data.question_ids.indexOf(addVm.$data.relate_questions[val][i]);
                addVm.$data.question_ids.splice(index, 1);
                addVm.$data.question_types.splice(index, 1);
                addVm.$data.question_titles.splice(index, 1);
                addVm.$data.question_options.splice(index, 1);
                addVm.$data.relate_questions.splice(index, 1);
            }
            addVm.$data.question_ids.splice(val, 1);
            addVm.$data.question_types.splice(val, 1);
            addVm.$data.question_titles.splice(val, 1);
            addVm.$data.question_options.splice(val, 1);
            addVm.$data.relate_questions.splice(val, 1);
            showQuestion();
            layer.close(layer.index);
        })
    } else {
        addVm.$data.question_ids.splice(val, 1);
        addVm.$data.question_types.splice(val, 1);
        addVm.$data.question_titles.splice(val, 1);
        addVm.$data.question_options.splice(val, 1);
        addVm.$data.relate_questions.splice(val, 1);
        showQuestion();
    }
}