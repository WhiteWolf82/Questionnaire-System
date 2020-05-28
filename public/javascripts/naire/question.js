var vm = new Vue({
    // el：提供一个在页面上已存在的 DOM 元素作为 Vue 实例的挂载目标
    el: '#LAY-add-question',
    // Vue 实例的数据对象，用于给 View 提供数据
    data: {
        isRequired: false,
        selectedType: '0',
        rateType: '0',
        isRelate: false,
        relateQuestion: '',
        relateOption: [],
        optionNum: 2,
        naire_id: '',
        question_id: '',
        option_id: [1, 2],
        numType: '0',    //0表示整数，1表示小数
        textType: '0'   //0表示单行，1表示多行
    },
    methods: {

    }
});

var form = layui.form;
form.render();
form.on('select(select-type)', function(data) {
    vm.$data.selectedType = data.value;
});
form.on('radio(rate-type)', function(data) {
    vm.$data.rateType = data.value;
});
form.on('radio(text-type)', function(data) {
    vm.$data.textType = data.value;
});
form.on('radio(num-type)', function(data) {
    vm.$data.numType = data.value;
});
form.on('switch(is-relate)', function(data) {
    vm.$data.isRelate = data.elem.checked;
});
form.on('switch(is-require)', function(data) {
    vm.$data.isRequired = data.elem.checked;
});
form.on('select(relate-question)', function(data) {
    vm.$data.relateQuestion = data.value;
    addCheckbox(parseInt(data.value));
    form.render('checkbox');
});
form.on('checkbox(check)', function(data) {
    if (data.elem.checked === true)
        vm.$data.relateOption.push(parseInt(data.elem.name));
    else
        vm.$data.relateOption.splice(vm.$data.relateOption.indexOf(parseInt(data.elem.name)), 1);
    //console.log(vm.$data.relateOption);
});
form.on('submit(addquestion)', function(obj) {
    var data = obj.field;
    if (vm.$data.isRelate === true) {
        if (vm.$data.relateQuestion.length === 0)
            return parent.layer.msg("请选择关联问题！");
        if (vm.$data.relateOption.length === 0)
            return parent.layer.msg("请选择关联问题的选项！");
    }
    if (vm.$data.selectedType === '0' || vm.$data.selectedType === '1') {
        if (data.question_option1.length === 0 || data.question_option2.length === 0)
            return parent.layer.msg("至少需要有两个选项！");
    } else if (vm.$data.selectedType === '2') {
        if (data.floor_rate.length === 0 || data.ceil_rate.length === 0)
            return parent.layer.msg("最小分值或最大分值不能为空！");
        if (Math.floor(Number(data.floor_rate)) !== Number(data.floor_rate) || 
            Math.floor(Number(data.ceil_rate)) !== Number(data.ceil_rate))
            return parent.layer.msg("最小分值与最大分值必须为整数！");
        if (Number(data.floor_rate) < 0)
            return parent.layer.msg("最小分值不能小于0！");
        if (Number(data.ceil_rate > 10))
            return parent.layer.msg("最大分值不能超过10！");
    }
    if (parent.addVm.$data.naire_id.length === 0)
        parent.addVm.$data.naire_id = generateID();
    if (parent.addVm.$data.question_ids.indexOf(vm.$data.question_id) !== -1) {
        //若编辑问题，则删除原问题后覆盖
        var index = parent.addVm.$data.question_ids.indexOf(vm.$data.question_id);
        window.parent.delQuestion(index);
        if (vm.$data.isRelate === true) {
            //暂时从关联到的那个问题列表中删除
            var thisIndex = parent.addVm.$data.relate_questions[vm.$data.relateQuestion].indexOf(vm.$data.question_id);
            parent.addVm.$data.relate_questions[vm.$data.relateQuestion].splice(thisIndex, 1);
        }
    }
    vm.$data.naire_id = parent.addVm.$data.naire_id;
    vm.$data.question_id = generateID();
    parent.addVm.$data.question_ids.push(vm.$data.question_id);
    parent.addVm.$data.question_types.push(vm.$data.selectedType);
    parent.addVm.$data.question_titles.push(data.question_title);
    parent.addVm.$data.question_required.push(vm.$data.isRequired);
    parent.addVm.$data.relate_questions.push(new Array());
    var str = "";
    if (vm.$data.selectedType === '2') {
        str += data.floor_rate + "<floorrate>";
        str += data.ceil_rate + "<ceilrate>";
        str += vm.$data.rateType + "<ratetype>";
    } else if (vm.$data.selectedType === '3') {
        str += vm.$data.textType + "<texttype>";
    } else if (vm.$data.selectedType === '4') {
        str += vm.$data.numType + "<numtype>";
    } else if (vm.$data.selectedType === '0' || vm.$data.selectedType === '1') {
        for (var i = 0; i < vm.$data.option_id.length; i++) {
            str += data['question_option' + vm.$data.option_id[i]] + "<option>";
        }
    }
    if (vm.$data.isRelate === true) {
        str += parent.addVm.$data.question_ids[vm.$data.relateQuestion] + "<relate>";
        parent.addVm.$data.relate_questions[vm.$data.relateQuestion].push(vm.$data.question_id);
        vm.$data.relateOption.sort();
        for (var i = 0; i < vm.$data.relateOption.length; i++) {
            str += vm.$data.relateOption[i] + "<relateoption>";
        }
    }
    //console.log(str);
    parent.addVm.$data.question_options.push(str);
    window.parent.showQuestion();
    parent.layer.close(parent.layer.getFrameIndex(window.name));
});

function child(data) {
    vm.$data.question_id = data[0];
    vm.$data.selectedType = data[1];
    $('#selectedType').val(data[1]);
    vm.$data.question_title = data[2];
    $('#question_title').val(data[2]);
    vm.$data.isRequired = data[4];
    if (data[4] === true)
        $('#isRequired').prop('checked', true);
    var optionStr = data[3];
    console.log(data);
    if (data.length === 6) {
        //此题关联到其他问题
        vm.$data.isRelate = true;
        $('#isRelate').prop('checked', true);
        vm.$data.relateQuestion = data[5];
        $('#relateSelect').val(data[5]);
        addCheckbox(parseInt(data[5]));
        var relateIndex = optionStr.indexOf('<relate>');
        var tmpStr = optionStr.substr(relateIndex + 8);
        var rOptions = tmpStr.split('<relateoption>');
        for (var i = 0; i < rOptions.length - 1; i++) {
            vm.$data.relateOption.push(parseInt(rOptions[i]));
            $('#checkbox' + rOptions[i]).prop('checked', true);
        }
        console.log(vm.$data.relateOption);
    }
    if (data[1] === '4') {
        vm.$data.numType = optionStr[0];
        if (optionStr[0] === '0')
            $('#numType0').prop('checked', true);
        else
            $('#numType1').prop('checked', true);
    }
    else if (data[1] === '3') {
        vm.$data.textType = optionStr[0];
        if (optionStr[0] === '0')
            $('#textType0').prop('checked', true);
        else
            $('#textType1').prop('checked', true);
    }
    else if (data[1] === '2') {
        var floorStart = optionStr.indexOf('<floorrate>');
        var ceilStart = optionStr.indexOf('<ceilrate>');
        var rateStart = optionStr.indexOf('<ratetype>');
        $('#floor_rate').val(optionStr.substr(0, floorStart));
        $('#ceil_rate').val(optionStr.substr(floorStart + 11, ceilStart - floorStart - 11));
        vm.$data.rateType = optionStr[rateStart - 1];
        if (optionStr[rateStart - 1] === '0')
            $('#rateType0').prop('checked', true);
        else
            $('#rateType1').prop('checked', true);
    } else {
        var options = optionStr.split('<option>');
        for (var i = 0; i < options.length - 3; i++) {
            addOption();
        }
        for (var i = 0; i < options.length - 1; i++) {
            var id = '#question_option' + parseInt(i + 1);
            $(id).val(options[i]);
        }
    }
    form.render();
}

function addCheckbox(val) {
    var options = parent.addVm.$data.question_options[parseInt(val)].split("<option>");
    var str = "";
    for (var i = 0; i < options.length - 1; i++) {
        str += "<input type='checkbox' lay-filter='check' id='checkbox" + i + "' name='" + i + "' title='" + options[i] + "' lay-skin='primary'><br>";
    }
    $('#relateAdd').append(str);
}

function addOption() {
    var id = $('div.option:last').attr('data-id');
    var v = parseInt(id) + 1;
    var str = "";
    str += "<div v-show='selectedType==\"0\"||selectedType==\"1\"||selectedType==\"3\"' class='layui-form-item option opt" + v + "' data-id='" + v + "'> ";
    str += "<div class='layui-inline'>";
    str += "<label class='layui-form-label'>选项" + v + "</label>";
    str += "<div class='layui-input-inline'>";
    str += "<input type='text' id='question_option" + v +"' name='question_option" + v + "' lay-verify='required' autocomplete='off' class='layui-input'>";
    str += "</div>";
    str += "<button class='layui-btn layui-btn-small' type='button' onclick='addOption()'>添加</button>";
    str += "<button class='layui-btn layui-btn-small layui-btn-danger' type='button' onclick='delOption(" + v + ")'>删除</button>";
    str += "</div>";
    str += "</div>";
    vm.$data.optionNum = parseInt(vm.$data.optionNum) + 1;
    //console.log(vm.$data.option_id);
    vm.$data.option_id.push(v);
    $(".opt" + id).after(str);
}

function delOption(val) {
    $(".opt" + val).remove();
    vm.$data.optionNum = parseInt(vm.$data.optionNum) - 1;
    vm.$data.option_id.splice(vm.$data.option_id.indexOf(val), 1);
    //console.log(vm.$data.option_id);
}

function generateID() {
    return Number(Math.random().toString().substr(3, 3) + Date.now()).toString(36);
}