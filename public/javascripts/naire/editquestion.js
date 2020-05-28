var vm = new Vue({
    // el：提供一个在页面上已存在的 DOM 元素作为 Vue 实例的挂载目标
    el: '#LAY-edit-question',
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
        textType: '0',   //0表示单行，1表示多行
        question_option: ''
    },
    methods: {

    }
});
  
var form = layui.form;
form.render();
form.on('switch(is-require)', function(data) {
    vm.$data.isRequired = data.elem.checked;
});
form.on('submit(editquestion)', function(obj) {
    var data = obj.field;
    var index = parent.vm.$data.question_ids.indexOf(vm.$data.question_id);
    //只有问题标题和是否必填可以修改
    parent.vm.$data.question_titles[index] = data.question_title;
    parent.vm.$data.question_required[index] = (vm.$data.isRequired == true) ? '1' : '0';
    parent.vm.$data.change_question_ids.push(vm.$data.question_id);
    window.parent.showQuestion();
    parent.layer.close(parent.layer.getFrameIndex(window.name));
});

function child(data) {
    vm.$data.question_id = data[0];
    vm.$data.selectedType = data[1];
    $('#selectedType').val(data[1]);
    vm.$data.question_title = data[2];
    $('#question_title').val(data[2]);
    vm.$data.isRequired = (data[4] === '1')? true : false;
    if (data[4] === '1')
        $('#isRequired').prop('checked', true);
    var optionStr = data[3];
    vm.$data.question_option = data[3];
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
        console.log(options);
        for (var i = 0; i < options.length - 1; i++) {
            var id = '#question_option' + parseInt(i + 1);
            $(id).val(options[i]);
        }
    }
    form.render();
}

function addCheckbox(val) {
    var options = parent.vm.$data.question_options[parseInt(val)].split("<option>");
    var str = "";
    for (var i = 0; i < options.length - 1; i++) {
        str += "<input type='checkbox' lay-filter='check' id='checkbox" + i + "' name='" + i + "' title='" + options[i] + "' lay-skin='primary' disabled><br>";
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
    str += "<input type='text' id='question_option" + v +"' name='question_option" + v + "' lay-verify='required' autocomplete='off' class='layui-input' disabled>";
    str += "</div>";
    str += "</div>";
    str += "</div>";
    vm.$data.optionNum = parseInt(vm.$data.optionNum) + 1;
    //console.log(vm.$data.option_id);
    vm.$data.option_id.push(v);
    $(".opt" + id).after(str);
}