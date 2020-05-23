var vm = new Vue({
    // el：提供一个在页面上已存在的 DOM 元素作为 Vue 实例的挂载目标
    el: '#LAY-user-login',
    // Vue 实例的数据对象，用于给 View 提供数据
    data: {
  
    },
    methods: {
      register: function (data) {
        this.$http.get('/api/register', { params: { username: data.username, password: data.password, email: data.email } }, { emulateJSON: true })
          .then((response) => {
            console.log(response);
            if (response['body'].result)
              layer.open({
                title: '注册结果', content: '注册成功！', btn: ['确定'],
                yes: function () {
                  window.location = "login";
                }
              });
            else
              layer.open({ title: '注册结果', content: '注册失败，用户名或邮箱已存在！' });
          })
          .catch(function (response) {
            console.log(response);
          })
  
      },
    }
  });
  
  var form = layui.form;
  
  form.render();
  
  //提交
  form.on('submit(LAY-user-reg-submit)', function (obj) {
    var data = obj.field;
    vm.msg = "错误";
    //console.log(data);
    if (data.username.length < 6) {
      return layer.msg("用户名长度必须在6位以上！")
    }
    if (data.password.length < 6) {
      return layer.msg("密码长度必须在6位以上！")
    }
    if (data.password !== data.repass) {
      return layer.msg("两次密码输入不一致！");
    }
    vm.register(data);
  });