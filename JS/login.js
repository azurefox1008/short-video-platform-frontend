document.addEventListener('DOMContentLoaded', function () {
    // 获取用户名+密码框的输入内容
    const usernameInput = document.querySelector('.form_info + input');
    const passwordInput = document.querySelectorAll('.form_info + input')[1];
    const loginButton = document.getElementById('loginButton');

    // 获取“密码登录”和“邮箱登录”的字样
    const passwordLoginForm = document.getElementById('passwordLoginForm');
    const emailLoginForm = document.getElementById('emailLoginForm');

    // 获取密码登录界面和邮箱登录界面
    // 邮箱界面暂时禁用
    const passwordLoginTab = document.getElementById('passwordLoginTab');
    // const emailLoginTab = document.getElementById('emailLoginTab');

    // 监听用户名和密码的输入操作，调用toggleLoginButtonState()，判断当前是否满足登录条件
    usernameInput.addEventListener('input', toggleLoginButtonState);
    passwordInput.addEventListener('input', toggleLoginButtonState);

    // 监听鼠标移动到登录按钮上，调用handleMouseOver()，根据用户名+密码的输入情况改变按钮样式
    loginButton.addEventListener('mouseover', handleMouseOver);

    // 监听鼠标点击登录按钮，调用handleLogin()，向服务器发送请求进行登录操作
    loginButton.addEventListener('click', handleLogin);

    // 设置密码登录界面默认显示
    passwordLoginForm.style.display = 'block';
    //emailLoginForm.style.display = 'none';


    // 判断是否用户名和密码是否全部填写
    // 全部填写则满足登录条件，flag=true，否则不能登录，flag=false
    var flag = false;
    function toggleLoginButtonState() {
        if (usernameInput.value !== '' && passwordInput.value !== '') {
            flag = true;
            loginButton.style.backgroundColor = '#1FBABF'; // 符合登录条件则按钮颜色改变
        } else {
            flag = false;
            loginButton.style.backgroundColor = '#b6bcbc'; // 不符合登录条件，按钮为灰色
        }
    }

    //鼠标移动到登录按钮上的效果
    function handleMouseOver() {
        if (flag) {
            loginButton.style.cursor = 'pointer'; // 变为手指图标
        } else {
            loginButton.style.cursor = 'not-allowed'; // 变为禁止图标
        }
    }

    //弹出提示浮窗，在1.5s内消失
    function showAndHideNotification(notificationWindow) {
        notificationWindow.classList.add('show');
        setTimeout(function () {
            notificationWindow.classList.remove('show');
        }, 1500);
    }

    //登录成功后获取用户信息
    function getUserInfo(Token, user_Id) {
        console.log(Token);
        console.log(user_Id);

        // 用于发起HTTP请求的配置
        const config = {
            method: 'GET',
            url: `http://mysql.likefy.top:23333/douyin/user?token=${Token}&user_id=${user_Id}`
        };

        // 使用axios库发起HTTP GET请求
        axios(config)
            .then(function (response) {
                // 请求成功后，记录响应中的数据和成功信息到日志
                console.log(JSON.stringify(response.data));
                console.log('获取用户信息成功');

                // 【待办】将用户信息更新到网页上
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    //点击登录按钮时
    function handleLogin() {
        event.preventDefault(); // 阻止表单的自动提交
        if (flag) {
            const config = {
                method: 'POST',
                url: `http://mysql.likefy.top:23333/douyin/user/login/?username=${usernameInput.value}&password=${passwordInput.value}`
            };

            axios(config)
                .then(function (response) {
                    console.dir(response.data);

                    //提取服务器返回数据中的token和id用于获取该账号信息
                    const Token = response.data.token;
                    const user_Id = response.data.user_id_string;
                    getUserInfo(Token, user_Id);
                })
                .catch(function (error) {
                    console.log(error);
                });
        } else {
            // 不满足登录条件，用户强行点击登录按钮时，弹窗提示其输入用户名和密码
            const loginEmpty = document.getElementById('login-empty');
            showAndHideNotification(loginEmpty);
        }
    }

    //切换密码登录和邮箱登录
    passwordLoginTab.addEventListener('click', () => {
        passwordLoginForm.style.display = 'block';
        emailLoginForm.style.display = 'none';

        // 高亮
        passwordLoginTab.classList.add('active-tab');
        emailLoginTab.classList.remove('active-tab');
    });

    // emailLoginTab.addEventListener('click', () => {
    //     emailLoginForm.style.display = 'block';
    //     passwordLoginForm.style.display = 'none';

    //     emailLoginTab.classList.add('active-tab');
    //     passwordLoginTab.classList.remove('active-tab');
    // });


    // 获取注册按钮
    const registerButton = document.getElementById('registerButton');

    // 点击注册按钮时
    registerButton.addEventListener('click', () => {
        event.preventDefault(); // 阻止自动提交
        if (flag) {
            const formData = new FormData();
            formData.append('username', usernameInput.value);
            formData.append('password', passwordInput.value);

            const config = {
                method: 'post',
                url: 'http://mysql.likefy.top:23333/douyin/user/register/',
                data: formData
            };

            axios(config)
                .then(function (response) {
                    console.log(JSON.stringify(response.data));
                    console.log('注册成功');
                })
                .catch(function (error) {
                    console.log(error);
                });
        }
        else {
            const loginEmpty = document.getElementById('login-empty');
            showAndHideNotification(loginEmpty);
        }

    });

});