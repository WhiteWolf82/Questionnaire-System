var vm = new Vue({
    el: '#LAY-answer',
    data: {
        naire_id: '',
        naire_title: '',
        naire_info: '',
        write_type: 0,
        write_time: -1,
        question_ids: [],
        question_titles: [],
        question_types: [],
        question_options: [],
        question_required: [],
        needLogin: false,
        isLogin: false,
        ip_addr: '',
        checkboxFilters: [],
        radioFilters: [],
        answers: [],
        relate_questions: [],
        relate_options: [],
        need_answer: []
    },
    methods: {

    }
})

var form = layui.form;
form.render();
form.on('submit(answernaire)', function() {
    var answer_ids = [];
    var answer_question_ids = [];
    var answer_question_types = [];
    var answer_question_options = [];
    for (var i = 0; i < vm.$data.need_answer.length; i++) {
        var questionIndex = vm.$data.need_answer[i];
        var questionID = vm.$data.question_ids[questionIndex];
        if (vm.$data.question_types[questionIndex] === '3')
            vm.$data.answers[questionIndex][0] = $('#' + questionID + 'text').val();
        else if (vm.$data.question_types[questionIndex] === '4')
            vm.$data.answers[questionIndex][0] = $('#' + questionID + 'num').val();
        if (vm.$data.question_required[questionIndex] === '1' && 
            (typeof(vm.$data.answers[questionIndex][0]) === 'undefined' || vm.$data.answers[questionIndex].length === 0 || vm.$data.answers[questionIndex][0] === ''))
            return layer.msg("必填项不能为空！");
        if (vm.$data.question_types[questionIndex] === '4') {
            var index = vm.$data.question_options[questionIndex].indexOf('<numtype>');
            if (vm.$data.question_options[questionIndex][index - 1] === '0' && 
                Math.floor(Number(vm.$data.answers[questionIndex][0])) !== Number(vm.$data.answers[questionIndex][0]))
                return layer.msg("第" + parseInt(questionIndex + 1) + "题请填写整数！");
        }
    }
    // console.log(vm.$data.need_answer);
    // console.log(vm.$data.answers);
    for (var i = 0; i < vm.$data.need_answer.length; i++) {
        answer_ids.push(generateID());
        var questionIndex = vm.$data.need_answer[i];
        answer_question_ids.push(vm.$data.question_ids[questionIndex]);
        answer_question_types.push(vm.$data.question_types[questionIndex]);
        var answer_question_option = "";
        if (answer_question_types[i] === '0' || answer_question_types[i] === '1') {
            for (var j = 0; j < vm.$data.answers[questionIndex].length; j++) {
                answer_question_option += vm.$data.answers[questionIndex][j] + "<option>";
            }
        } else {
            answer_question_option += vm.$data.answers[questionIndex][0];
        }
        answer_question_options.push(answer_question_option);
    }
    var result = true;
    var failIndex;
    for (var i = 0; i < answer_ids.length && result; i++) {
        $.post('../../api/addAnswer', {naire_id: vm.$data.naire_id, answer_id: answer_ids[i], question_id: answer_question_ids[i],
            answer_type: answer_question_types[i], answer_option: answer_question_options[i]}, function(data, status) {
            if (!data.result) {
                result = false;
                failIndex = i;
            }
        })
    }
    //回滚 todo

    if (result) {
        $.post('../../api/updateAnswerInfo', {naire_id: vm.$data.naire_id, ip_addr: vm.$data.ip_addr, write_type: vm.$data.write_type}, 
            function(data, status) {
                if (!data.result)
                    result = false;
        })
    }
    if (result) {
        layer.open({
            title: '操作结果', content: '提交成功！',
            yes: function (index, layero) {
                window.location.href = "/";
                layer.close(index);
            }
        })
    } else {
        layer.open({
            title: '操作结果', content: '提交失败，请重试！'
        })
    }
});

function addFormOn() {
    var script = $('#addScript').html();
    for (var i = 0; i < vm.$data.checkboxFilters.length; i++) {
        script += "<script>layui.form.on('checkbox(" + vm.$data.checkboxFilters[i] + ")', function(data) { \
            var index = vm.$data.question_ids.indexOf('" + vm.$data.checkboxFilters[i] + "'); \
            if (data.elem.checked === true) \
                vm.$data.answers[index].push(data.elem.name + ''); \
            else \
                vm.$data.answers[index].splice(vm.$data.answers[index].indexOf(data.elem.name + ''), 1); \
            if (vm.$data.relate_questions[index].length !== 0) { \
                for (var j = 0; j < vm.$data.relate_questions[index].length; j++) { \
                    var flag = false; \
                    for (var k = 0; k < vm.$data.relate_options[vm.$data.relate_questions[index][j]].length; k++) { \
                        if (vm.$data.answers[index].indexOf(vm.$data.relate_options[vm.$data.relate_questions[index][j]][k]) !== -1) { \
                            flag = true; \
                            break; \
                        } \
                    } \
                    if (flag) \
                    {$('#' + vm.$data.question_ids[vm.$data.relate_questions[index][j]]).show(); vm.$data.need_answer.push(vm.$data.relate_questions[index][j]);}\
                    else \
                    {$('#' + vm.$data.question_ids[vm.$data.relate_questions[index][j]]).hide(); \
                    if (vm.$data.need_answer.indexOf(vm.$data.relate_questions[index][j]) !== -1) \
                        vm.$data.need_answer.splice(vm.$data.need_answer.indexOf(vm.$data.relate_questions[index][j]), 1)}\
                } \
            } layui.form.render(); \
        })</script>";
    }
    for (var i = 0; i < vm.$data.radioFilters.length; i++) {
        script += "<script>layui.form.on('radio(" + vm.$data.radioFilters[i] + ")', function(data) { \
            var index = vm.$data.question_ids.indexOf('" + vm.$data.radioFilters[i] + "'); \
            if (vm.$data.answers[index].length === 0) \
                vm.$data.answers[index].push(data.value + ''); \
            else \
                vm.$data.answers[index][0] = data.value + ''; \
            if (vm.$data.relate_questions[index].length !== 0) { \
                for (var j = 0; j < vm.$data.relate_questions[index].length; j++) { \
                    var flag = false; \
                    for (var k = 0; k < vm.$data.relate_options[vm.$data.relate_questions[index][j]].length; k++) { \
                        if (vm.$data.answers[index][0] === vm.$data.relate_options[vm.$data.relate_questions[index][j]][k]) { \
                            flag = true; \
                            break; \
                        } \
                    } \
                    if (flag) \
                    {$('#' + vm.$data.question_ids[vm.$data.relate_questions[index][j]]).show(); vm.$data.need_answer.push(vm.$data.relate_questions[index][j]);}\
                    else \
                    {$('#' + vm.$data.question_ids[vm.$data.relate_questions[index][j]]).hide(); \
                    if (vm.$data.need_answer.indexOf(vm.$data.relate_questions[index][j]) !== -1) \
                        vm.$data.need_answer.splice(vm.$data.need_answer.indexOf(vm.$data.relate_questions[index][j]), 1)}\
                } \
            } layui.form.render(); \
        })</script>";
    }
    $('#addScript').html(script);
}

function showQuestions() {
    $('#toAdd').empty();
    //console.log(vm.$data.question_ids);
    var slider_ids = new Array();
    var slider_floor = new Array();
    var slider_ceil = new Array();
    for (var i = 0; i < vm.$data.question_ids.length; i++) {
        var id = i + 1;
        vm.$data.answers.push(new Array());
        if (vm.$data.question_types[i] === '3' || vm.$data.question_types[i] === '4')
            vm.$data.answers[i].push('');
        vm.$data.relate_questions.push(new Array());
        vm.$data.relate_options.push(new Array());
        var tmpStr = "";
        if (vm.$data.question_options[i].indexOf('<relate>') !== -1) {
            tmpStr += "<div style='display: none' class='layui-form-item' id=" + vm.$data.question_ids[i] + ">";
            var tmp;
            if (vm.$data.question_types[i] === '4')
                tmp = vm.$data.question_options[i].substr(10);
            else if (vm.$data.question_types[i] === '3')
                tmp = vm.$data.question_options[i].substr(11);
            else if (vm.$data.question_types[i] === '2') {
                var rateIndex = vm.$data.question_options[i].indexOf('<ratetype>');
                tmp = vm.$data.question_options[i].substr(rateIndex + 10);
            } else {
                var options = vm.$data.question_options[i].split('<option>');
                tmp = options[options.length - 1];
            }
            var relateStart = tmp.indexOf('<relate>');
            var relateQuestionID = tmp.substr(0, relateStart);
            var relateQuestionIndex = vm.$data.question_ids.indexOf(relateQuestionID);
            var relateQuestionOptions = tmp.substr(relateStart + 8).split('<relateoption>');
            vm.$data.relate_questions[relateQuestionIndex].push(i);
            for (var j = 0; j < relateQuestionOptions.length - 1; j++) {
                vm.$data.relate_options[i].push(relateQuestionOptions[j]);
            }
        } else {
            if (vm.$data.question_required[i] === '1')
                vm.$data.need_answer.push(i);
            tmpStr += "<div class='layui-form-item' id=" + vm.$data.question_ids[i] + ">";
        }
        tmpStr += "<h3>" + id + ". ";
        if (vm.$data.question_types[i] === '4')
            tmpStr += "[数字填写题]";
        else if (vm.$data.question_types[i] === '3')
            tmpStr += "[文本填写题]";
        else if (vm.$data.question_types[i] === '2')
            tmpStr += "[评分题]";
        else if (vm.$data.question_types[i] === '1')
            tmpStr += "[多选题]";
        else
            tmpStr += "[单选题]";
        tmpStr += vm.$data.question_titles[i];
        if (vm.$data.question_required[i] === '1')
            tmpStr += "<span style='color: red'>（必填）</span>";
        tmpStr += "</h3>";
        if (vm.$data.question_types[i] === '3')
            tmpStr += "<textarea id=" + vm.$data.question_ids[i] + 'text' + " class='layui-textarea' style='margin-top: 15px'></textarea>";
        else if (vm.$data.question_types[i] === '4') {
            tmpStr += "<input id=" + vm.$data.question_ids[i] + 'num' + " class='layui-input' style='margin-top: 15px' placeholder='";
            var index = vm.$data.question_options[i].indexOf('<numtype>');
            if (vm.$data.question_options[i][index - 1] === '0')
                tmpStr += "请填写整数'>";
            else
                tmpStr += "请填写小数'>";
        }
        else if (vm.$data.question_types[i] === '2') {
            var floorStart = vm.$data.question_options[i].indexOf('<floorrate>');
            var ceilStart = vm.$data.question_options[i].indexOf('<ceilrate>');
            var rateStart = vm.$data.question_options[i].indexOf('<ratetype>');
            var floorRate = vm.$data.question_options[i].substr(0, floorStart) * 1;
            var ceilRate = vm.$data.question_options[i].substr(floorStart + 11, ceilStart - floorStart - 11) * 1;
            var rateType = vm.$data.question_options[i][rateStart - 1];
            if (rateType === '0') {
                for (var j = 0; j < ceilRate - floorRate + 1; j++) {
                    tmpStr += "<input type='radio' lay-filter=" + vm.$data.question_ids[i] + " name=" + vm.$data.question_ids[i] + " value='" + j + "' title='" + parseInt(j + floorRate) + "'>";
                    vm.$data.radioFilters.push(vm.$data.question_ids[i]);
                }
            } else {
                tmpStr += "<div style='margin-top: 15px; width: 25%' id='" + vm.$data.question_ids[i] + 'rate' + "' name=" + vm.$data.question_ids[i] + "></div>";
                slider_ids.push(vm.$data.question_ids[i] + 'rate');
                slider_floor.push(floorRate);
                slider_ceil.push(ceilRate);
            }
        }
        else if (vm.$data.question_types[i] === '1') {
            var options = vm.$data.question_options[i].split('<option>');
            for (var j = 0; j < options.length - 1; j++) {
                tmpStr += "<input type='checkbox' lay-filter=" + vm.$data.question_ids[i] + " name='" + j + "' title='" + options[j] + "' lay-skin='primary'><br>";
            }
            vm.$data.checkboxFilters.push(vm.$data.question_ids[i]);
        }
        else {
            var options = vm.$data.question_options[i].split('<option>');
            for (var j = 0; j < options.length - 1; j++) {
                tmpStr += "<input type='radio' lay-filter=" + vm.$data.question_ids[i] + " name='" + vm.$data.question_ids[i] + "' value='" + j + "' title='" + options[j] + "'><br>";
            }
            vm.$data.radioFilters.push(vm.$data.question_ids[i]);
        }
        tmpStr += "</div>";
        //console.log(tmpStr);
        $('#toAdd').append(tmpStr);
    }
    $('#toAdd').append('<button class="layui-btn" lay-submit lay-filter="answernaire">立即提交</button>');
    var script = "";
    for (var i = 0; i < slider_ids.length; i++) {
        script += "<script>layui.use('slider', function() { \
            var slider = layui.slider; \
            slider.render({ \
                elem: '#" + slider_ids[i] + "', \
                min: " + slider_floor[i] + ", \
                max: " + slider_ceil[i] + ", \
                step: 1, \
                change: function(value) { \
                    var questionID = '" + slider_ids[i].substr(0, slider_ids[i].length - 4) + "'; \
                    var index = vm.$data.question_ids.indexOf(questionID); \
                    if (vm.$data.answers[index].length === 0) \
                        vm.$data.answers[index].push(value); \
                    else \
                        vm.$data.answers[index][0] = value; \
                } \
            }); \
        })</script>";
    }
    $('#addScript').html(script);
    form.render();
    addFormOn();
}

function checkLogin() {
    var token = getCookie('token');
    if (token != "") {
        vm.$data.isLogin = true;
        return true;
    } else {
        vm.$data.isLogin = false;
        return false;
    }
}

function generateID() {
    return Number(Math.random().toString().substr(3, 3) + Date.now()).toString(36);
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