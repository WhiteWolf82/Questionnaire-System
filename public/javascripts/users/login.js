var vm = new Vue({
    // el：提供一个在页面上已存在的 DOM 元素作为 Vue 实例的挂载目标
    el: '#LAY-user-login',
    // Vue 实例的数据对象，用于给 View 提供数据
    data: {},
    methods: {
        login: function (data) {
            this.$http
                .get(
                    '/api/login',
                    {
                        params: {
                            username: data.username,
                            password: data.password
                        }
                    },
                    { emulateJSON: true }
                )
                .then(response => {
                    console.log(response)
                    if (response['body'].result) {
                        console.log(response['body'].token);
                        setCookie('token', response['body'].token, 1);
                        window.location = '../';
                    } else layer.open({ title: '登录结果', content: '用户名或密码错误！' })
                })
                .catch(function (response) {
                    console.log(response)
                })
        }
    }
})

var form = layui.form;

form.render();

// 提交
form.on('submit(LAY-user-login-submit)', function (obj) {
    // 请求登入接口
    var data = obj.field;
    vm.msg = "错误";
    console.log(data);
    if (data.username.length === 0 || data.password.length === 0) {
        return layer.msg("用户名或密码不能为空！");
    }
    vm.login(data);
})
