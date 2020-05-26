var vm = new Vue({
    // el：提供一个在页面上已存在的 DOM 元素作为 Vue 实例的挂载目标
    el: '#LAY-add-question',
    // Vue 实例的数据对象，用于给 View 提供数据
    data: {
        selectedType: '0',
        rateType: '0',
        relateQuestion: '',
        relateOption: [],
        optionNum: 2,
        naire_id: '',
        question_id: '',
        option_id: [1, 2]
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
form.on('select(relate-question)', function(data) {
    vm.$data.relateQuestion = data.value;
    var options = parent.addVm.$data.question_options[parseInt(data.value)].split("<option>");
    var str = "";
    for (var i = 0; i < options.length - 1; i++) {
        str += "<input type='checkbox' lay-filter='check' name='" + i + "' title='" + options[i] + "' lay-skin='primary'><br>";
    }
    $('#relateAdd').append(str);
    form.render('checkbox');
});
form.on('checkbox(check)', function(data) {
    if (data.elem.checked === true)
        vm.$data.relateOption.push(parseInt(data.elem.name));
    else
        vm.$data.relateOption.splice(vm.$data.relateOption.indexOf(parseInt(data.elem.name)), 1);
    //console.log(vm.$data.relateOption);
})
form.on('submit(addquestion)', function(obj) {
    var data = obj.field;
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
    } else if (vm.$data.selectedType === '3') {
        if (vm.$data.relateQuestion.length === 0)
            return parent.layer.msg("请选择关联问题！");
        if (vm.$data.relateOption.length === 0)
            return parent.layer.msg("请选择关联问题的选项！");
        if (data.question_option1.length === 0 || data.question_option2.length === 0)
            return parent.layer.msg("至少需要有两个选项！");
    }
    //console.log(data);
    if (parent.addVm.$data.naire_id.length === 0)
        parent.addVm.$data.naire_id = generateID();
    vm.$data.naire_id = parent.addVm.$data.naire_id;
    vm.$data.question_id = generateID();
    // console.log(vm.$data.question_id);
    // console.log(vm.$data.selectedType);
    // console.log(data.question_title);
    parent.addVm.$data.question_ids.push(vm.$data.question_id);
    parent.addVm.$data.question_types.push(vm.$data.selectedType);
    parent.addVm.$data.question_titles.push(data.question_title);
    parent.addVm.$data.relate_questions.push(new Array());
    if (vm.$data.selectedType === '4' || vm.$data.selectedType === '5') {
        if (vm.$data.selectedType === '4')
            parent.addVm.$data.question_options.push("");
        else
            parent.addVm.$data.question_options.push("");
    } else if (vm.$data.selectedType === '2') {
        var str = "";
        str += data.floor_rate + "<floorrate>";
        str += data.ceil_rate + "<ceilrate>";
        str += vm.$data.rateType + "<ratetype>";
        //console.log(str);
        parent.addVm.$data.question_options.push(str);
    } else {
        var str = "";
        for (var i = 0; i < vm.$data.option_id.length; i++) {
            str += data['question_option' + vm.$data.option_id[i]] + "<option>";
        }
        if (vm.$data.selectedType === '3') {
            str += parent.addVm.$data.question_ids[vm.$data.relateQuestion] + "<relate>";
            for (var i = 0; i < vm.$data.relateOption.length; i++) {
                str += vm.$data.relateOption[i] + "<relateoption>";
            }
        }
        //console.log(str);
        parent.addVm.$data.question_options.push(str);
    }
    window.parent.showQuestion();
    parent.layer.close(parent.layer.getFrameIndex(window.name));
});

function addOption() {
    var id = $('div.option:last').attr('data-id');
    var v = parseInt(id) + 1;
    var str = "";
    str += "<div v-show='selectedType==\"0\"||selectedType==\"1\"||selectedType==\"3\"' class='layui-form-item option opt" + v + "' data-id='" + v + "'> ";
    str += "<div class='layui-inline'>";
    str += "<label class='layui-form-label'>选项" + v + "</label>";
    str += "<div class='layui-input-inline'>";
    str += "<input type='text' name='question_option" + v + "' lay-verify='required' autocomplete='off' class='layui-input'>";
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