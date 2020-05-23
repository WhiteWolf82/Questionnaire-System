var vm = new Vue({
    // el：提供一个在页面上已存在的 DOM 元素作为 Vue 实例的挂载目标
    el: '#LAY-user-info',
    // Vue 实例的数据对象，用于给 View 提供数据
    data: {
        username: 'null',
        phone: 'null',
        email: 'null',
        sex: '0',
        info: 'null',
        isLogin: false,
    },
    methods: {
        checkLogin: function () {
            var token = getCookie('token');
            if (token != "") {
                this.isLogin = true;
                this.getInfo();
            } else {
                this.isLogin = false;
            }
        },
        getInfo: function () {
            this.$http.get('/api/getUserInfo', {}, { emulateJSON: true })
                .then((response) => {
                    if (response['body'].result) {
                        this.username = response['body'].username;
                        this.phone = response['body'].phone;
                        this.email = response['body'].email;
                        this.sex = response['body'].sex;
                        this.info = response['body'].info;
                    }
                })
                .catch(function (response) {
                    console.log(response);
                })
        },
    }
});

var form = layui.form;
form.render();

form.on('submit(setmyinfo)', function(obj) {
    var field = obj.field;
    var token = getCookie('token');
    if (token != "") {
        $.post('../../api/setUserInfo', {username: field.username, sex: field.sex, phone: field.phone, email: field.email, info: field.info}, function (data, status) {
          if (data.result) {
            layer.confirm('修改成功！', {
              title: '操作结果', btn: ['确定']
            }, function() {
              window.parent.location.reload();
            });
          } else {
            layer.open({
              title: '操作结果', content: '修改失败，邮箱已存在，请重试！'
            })
          }
        })
    } else {
        layer.open({
          title: '操作结果', content: '请先登录！'
        })
    }
})

vm.checkLogin();