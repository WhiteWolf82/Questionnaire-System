var vm = new Vue({
    // el：提供一个在页面上已存在的 DOM 元素作为 Vue 实例的挂载目标
    el: '#LAY_app',
    // Vue 实例的数据对象，用于给 View 提供数据
    data: {
        username: 'null',
        allNaires: [],
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
            this.$http.get('/api/getIndexInfo', {}, { emulateJSON: true })
                .then((response) => {
                    //console.log(response['body']);
                    if (response['body'].result) {
                        this.username = response['body'].username;
                        this.allNaires = response['body'].naireList;
                        console.log(this.allNaires);
                    }
                })
                .catch(function (response) {
                    console.log(response);
                })
        },
    }
});

vm.checkLogin();