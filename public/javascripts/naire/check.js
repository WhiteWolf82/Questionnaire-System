var vm = new Vue({
    el: '#LAY-result',
    data: {
        naire_id: '',
        naire_title: '',
        naire_url: '',
        start_time: '',
        end_time: '',
        naire_info: '',
        question_ids: [],
        question_types: [],
        question_titles: [],
        question_options: [],
        answer_options: []
    },
    methods: {

    }
})

function showResult() {
    $('#naire_id').html("<b>问卷ID：</b>" + vm.$data.naire_id);
    $('#naire_title').html("<b>问卷标题：</b>" + vm.$data.naire_title);
    $('#naire_info').html("<b>问卷说明：</b>" + vm.$data.naire_info);
    $('#naire_url').html("<b>问卷链接：</b>" + vm.$data.naire_url);
    $('#start_time').html("<b>开始时间：</b>" + vm.$data.start_time);
    $('#end_time').html("<b>结束时间：</b>" + vm.$data.end_time);
    var html = "";
    var toRenderIDs = [];
    var chartIDs = [];
    var chartValues = [];
    var chartNames = [];
    //console.log(vm.$data.answer_options);
    for (var i = 0; i < vm.$data.answer_options.length; i++) {
        var answerNum;
        if (vm.$data.question_types[i] === 3 || vm.$data.question_types[i] === 4)
            answerNum = 0;
        else
            answerNum = vm.$data.answer_options[i].length;
        var tmpStr = "";
        tmpStr += "<p><b>第" + parseInt(i + 1) + "题：</b>" + vm.$data.question_titles[i];
        if (vm.$data.question_types[i] === 0)
            tmpStr += " [单选题]";
        else if (vm.$data.question_types[i] === 1)
            tmpStr += " [多选题]";
        else if (vm.$data.question_types[i] === 2)
            tmpStr += " [评分题]";
        else if (vm.$data.question_types[i] === 3)
            tmpStr += " [文本填写题]";
        else if (vm.$data.question_types[i] === 4)
            tmpStr += " [数字填写题]";
        tmpStr += "</p>";
        if (vm.$data.question_types[i] === 0 || vm.$data.question_types[i] === 1) {
            tmpStr += "<table class='layui-table'>";
            tmpStr += "<colgroup><col width='50%'><col width='20%'><col width='30%'></colgroup>";
            tmpStr += "<thead><tr><th>选项</th><th>小计</th><th>比例</th></tr></thead>";
            tmpStr += "<tbody>";
            var totalOptions = vm.$data.question_options[i].split('<option>');
            //console.log(totalOptions);
            chartIDs.push(i);
            chartValues.push(new Array());
            chartNames.push(new Array());
            for (var j = 0; j < totalOptions.length - 1; j++) {
                tmpStr += "<tr>";
                tmpStr += "<td>" + totalOptions[j] + "</td>";
                var cnt = 0;
                for (var k = 0; k < vm.$data.answer_options[i].length; k++) {
                    var answerOptions = vm.$data.answer_options[i][k].split('<option>');
                    if (answerOptions.indexOf(j + '') !== -1)
                        cnt++;
                }
                var percent = (Math.round(cnt / answerNum * 10000) / 100.00) + "%";
                percent = (percent === "NaN%") ? "0%" : percent;
                chartValues[chartValues.length - 1].push(cnt);
                chartNames[chartNames.length - 1].push(totalOptions[j]);
                //console.log(percent);
                tmpStr += "<td>" + cnt + "</td>";
                tmpStr += "<td><div class='layui-progress' lay-showPercent='true'><div class='layui-progress-bar' " +
                        "lay-percent='" + percent + "'></div></div></td>";
                tmpStr += "</tr>";
            }
            tmpStr += "</tbody></table>";
            tmpStr += "<div id='result" + i + "' align='center' style='width:100%;height:300px;'></div>";
            tmpStr += "<p><b>本题有效填写人次：</b>" + answerNum + "</p><br>";
        } else if (vm.$data.question_types[i] === 2) {
            tmpStr += "<table class='layui-table'>";
            tmpStr += "<colgroup><col width='50%'><col width='20%'><col width='30%'></colgroup>";
            tmpStr += "<thead><tr><th>选项</th><th>小计</th><th>比例</th></tr></thead>";
            tmpStr += "<tbody>";
            var floorStart = vm.$data.question_options[i].indexOf('<floorrate>');
            var ceilStart = vm.$data.question_options[i].indexOf('<ceilrate>');
            var floorRate = vm.$data.question_options[i].substr(0, floorStart) * 1;
            var ceilRate = vm.$data.question_options[i].substr(floorStart + 11, ceilStart - floorStart - 11) * 1;
            var totalScore = 0;
            chartIDs.push(i);
            chartValues.push(new Array());
            chartNames.push(new Array());
            for (var j = floorRate; j <= ceilRate; j++) {
                tmpStr += "<tr>";
                tmpStr += "<td>" + j + "</td>";
                var cnt = 0;
                for (var k = 0; k < vm.$data.answer_options[i].length; k++) {
                    if (vm.$data.answer_options[i][k] === j + '') {
                        cnt++;
                        totalScore += j;
                    }
                }
                var percent = (Math.round(cnt / answerNum * 10000) / 100.00) + "%";
                percent = (percent === "NaN%") ? "0%" : percent;
                chartValues[chartValues.length - 1].push(cnt);
                chartNames[chartNames.length - 1].push(j);
                tmpStr += "<td>" + cnt + "</td>";
                tmpStr += "<td><div class='layui-progress' lay-showPercent='true'><div class='layui-progress-bar' " +
                        "lay-percent='" + percent + "'></div></div></td>";
                tmpStr += "</tr>";
            }
            tmpStr += "</tbody></table>";
            tmpStr += "<div id='result" + i + "' align='center' style='width:100%;height:300px;'></div>";
            var avgScore = totalScore / answerNum * 1.0;
            avgScore = avgScore.toFixed(2);
            totalScore = totalScore.toFixed(2);
            tmpStr += "<p><b>本题有效填写人次：</b>" + answerNum + "</p>";
            tmpStr += "<p><b>本题总分值：</b>" + totalScore + "&nbsp; &nbsp; <b>平均分值：</b>" + avgScore + "</p><br>";
        } else if (vm.$data.question_types[i] === 3 || vm.$data.question_types[i] === 4) {
            toRenderIDs.push(vm.$data.question_ids[i]);
            tmpStr += "<table lay-filter='" + vm.$data.question_ids[i] + "'>";
            tmpStr += "<colgroup><col width='10%'><col width='90%'></colgroup>";
            tmpStr += "<thead><tr><th lay-data=\"{field:'index'}\">序号</th><th lay-data=\"{field:'text', sort:true}\">答案文本</th></tr></thead>";
            tmpStr += "<tbody>";
            var totalNum = 0;
            for (var j = 0; j < vm.$data.answer_options[i].length; j++) {
                if (vm.$data.answer_options[i][j].length !== 0) {
                    answerNum++;
                    tmpStr += "<tr>";
                    tmpStr += "<td>" + parseInt(answerNum) + "</td>";
                    tmpStr += "<td>" + vm.$data.answer_options[i][j] + "</td>";
                    tmpStr += "</tr>"
                    if (vm.$data.question_types[i] === 4)
                        totalNum += Number(vm.$data.answer_options[i][j]);
                    }
            }
            tmpStr += "</tbody></table>";
            var avgNum = totalNum / answerNum * 1.0;
            avgNum = avgNum.toFixed(2);
            totalNum = totalNum.toFixed(2);
            if (vm.$data.question_types[i] === 4) {
                tmpStr += "<p><b>本题有效填写人次：</b>" + answerNum + "</p>";
                tmpStr += "<p><b>本题总分值：</b>" + totalNum + "&nbsp; &nbsp; <b>平均分值：</b>" + avgNum + "</p><br>";
            } else {
                tmpStr += "<p><b>本题有效填写人次：</b>" + answerNum + "</p><br>";
            }
        }
        html += tmpStr;
    }
    $('#toAdd').html(html);
    layui.use('element', function(){
        var element = layui.element;
        element.render();
    });
    var script = $('#addScript').html();
    for (var i = 0; i < toRenderIDs.length; i++) {
        script += "<script>layui.table.init('" + toRenderIDs[i] + "', { \
            limit: 5, \
            limits: [5, 10], \
            page: true \
        });</script>";
    }
    for (var i = 0; i < chartIDs.length; i++) {
        script += "<script>echarts.init(document.getElementById('result" + chartIDs[i] + "')).setOption({";
        script += "series: [{ type: 'pie', center: ['80%', '52%'], data: [";
        for (var j = 0; j < chartNames[i].length - 1; j++) {
            script += "{name: '" + chartNames[i][j] + "', value: '" + chartValues[i][j] + "'},";
        }
        script += "{name: '" + chartNames[i][chartNames[i].length - 1] + "', value: '" + chartValues[i][chartValues[i].length - 1] + "'}]},";
        script += "{type: 'bar', data: [";
        for (var j = 0; j < chartNames[i].length - 1; j++) {
            script += "'" + chartValues[i][j] + "', ";
        }
        script += "'" + chartValues[i][chartValues[i].length - 1] + "']}], "
        script += "tooltip: {trigger: 'item'}, ";
        script += "xAxis: {data: [";
        for (var j = 0; j < chartNames[i].length - 1; j++) {
            script += "'" + chartNames[i][j] + "', ";
        }
        script += "'" + chartNames[i][chartNames[i].length - 1] + "']}, yAxis: {}, grid: {left: '10%', right: '50%'}});</script>";
    }
    $('#addScript').html(script);
}
