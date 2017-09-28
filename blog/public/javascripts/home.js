(function(window,$){
    window.home = {
        boxId:'',
        editor:function(el,height){
            var layedit = layui.layedit;
            layedit.build(el,{
                height:height||200,
                tool:[
                    'strong','italic','underline',
                    'del','|','left','center',
                    'right','face'
                ]
            });
            return layedit;
        },
        setButton:function(el,bool){
            bool?$(el).addClass('btn-disabled'):$(el).removeClass('btn-disabled');
        },
        disabled:function(el){
            return $(el).hasClass('btn-disabled');
        },
        page:function(el,all,callBack,limit){
            var laypage = layui.laypage;
            laypage.render({
                elem:el,
                limit:limit||15,
                count:all,
                jump:function(data,first){
                    typeof callBack==='function'&&callBack.call(this,data,first);
                }
            });
        },
        showInfo:function(msg,icon){
            !icon?layer.msg(msg,{time:1500}):layer.msg(msg,{icon:icon,time:1500});
        },
        getId:function(){
            return ('Blog_'+Math.random()+new Date().getTime()).replace('.','');
        },
        //注册
        register:function(){
            $('#register').on('click',function(){
                var sexId = 'sex_'+home.getId();
                home.boxId = 'box_'+home.getId();
                var sexSel = null;
                var layer = layui.layer;
                var html = home.reg_html(sexId,home.boxId,true);
                layer.open({
                    //btnAlign:'c',
                    title:'用户注册',
                    btn:['取消','确认注册'],
                    skin:'blog-layer',
                    area:['700px','520px'],
                    content:html,
                    scrollbar:false,
                    btn1:function(){
                        var src = $('.layui-layer-content').find('.img').attr('src');
                        var userId = $('.layui-layer-content').find('.upload-box').attr('userid');
                        if(typeof src!='undefined')
                            home.ajax.reg_del_images(src,userId);
                        layer.closeAll();
                    },
                    btn2:function(index,elem){
                        var btn = elem.find('.layui-layer-btn1');
                        if(home.disabled(btn))
                            return false;
                        var imgId = elem.find('.img').attr('imgid');
                        var imgSrc = elem.find('.img').attr('src');
                        var nickname = $.trim(elem.find('#nickname').val());
                        var psw = $.trim(elem.find('#password').val());
                        var rePsw = $.trim(elem.find('#re-password').val());
                        var sex = sexSel.getBool(); // 获取性别;
                        if(typeof imgSrc=='undefined'){
                            layer.tips('请上传图像',elem.find('.upload-box'),{tips:[2,'#ffa200']});
                            return false;
                        }
                        if(nickname.length==0){
                            layer.tips('请输入昵称',elem.find('#nickname'),{tips:[3,'#ffa200']});
                            return false;
                        }
                        if(nickname.length>10){
                            layer.tips('昵称在10个字符以内',elem.find('#nickname'),{tips:[3,'#ffa200']});
                            return false;
                        }
                        if(psw.length==0){
                            layer.tips('请输入密码',elem.find('#password'),{tips:[3,'#ffa200']});
                            return false;
                        }
                        if(sexSel.getCheck()==null){
                            layer.tips('请选择性别',elem.find('.register-sex'),{tips:[1,'#ffa200']});
                            return false;
                        }
                        if(psw.length==0){
                            layer.tips('请输入密码',elem.find('#password'),{tips:[3,'#ffa200']});
                            return false;
                        }
                        if(psw.length<6||psw.length>20){
                            layer.tips('密码长度在6-20位之间',elem.find('#password'),{tips:[3,'#ffa200']});
                            return false;
                        }
                        if(rePsw!=psw){
                            layer.tips('两次密码输入不一致，请重新输入',elem.find('#re-password'),{tips:[3,'#ffa200']});
                            return false;
                        }
                        home.setButton(btn,true);
                        var data = {
                            imgId:imgId,
                            imgSrc:imgSrc,
                            nickname:nickname,
                            password:psw,
                            sex:sex[0]?true:false
                        };
                        home.ajax.reg_save(data,function(data){
                            home._login();
                            layer.close(index);
                        },function(errorMsg){
                            layer.tips(errorMsg||'注册失败，请重试',elem.find('#nickname'),{tips:[3,'#ffa200']});
                            home.setButton(btn,false);
                            return false;
                        });
                        return false;
                    },
                    cancel:function(){
                        var src = $('.layui-layer-content').find('.img').attr('src');
                        var userId = $('.layui-layer-content').find('.upload-box').attr('userid');
                        if(typeof src!='undefined')
                            home.ajax.reg_del_images(src,userId);
                    },
                });
                layer.ready(function(){
                    sexSel = new WM.checkBox({
                        id:sexId,
                        group:['汉子','妹子'],
                        notNull:true,
                        multiple:false
                    });
                })
            });
        },
        // 登陆;
        _login:function(){
            var layer = layui.layer;
            var html = '';
            html += '<div class="register">';
            html += '<span>请输入昵称：</span>';
            html += '<input type="text" id="username" placeholder="请输入昵称" autocomplete="off" class="layui-input">';
            html += '</div>';
            html += '<div class="register">';
            html += '<span>请输入密码：</span>';
            html += '<input type="password" id="password" placeholder="请输入密码" autocomplete="off" class="layui-input">';
            html += '</div>';
            layer.open({
                //btnAlign:'c',
                title:'用户登陆',
                btn:['取消','确认登陆'],
                skin:'blog-layer',
                area:['700px','auto'],
                content:html,
                scrollbar:false,
                btn1:function(){
                    layer.closeAll();
                },
                btn2:function(index,elem){
                    var btn = elem.find('.layui-layer-btn1');
                    if(home.disabled(btn))
                        return false;
                    var nickname = $.trim(elem.find('#username').val());
                    var password = $.trim(elem.find('#password').val());
                    if(nickname.length==0){
                        layer.tips('请输入昵称',elem.find('#username'),{tips:[3,'#ffa200']});
                        return false;
                    }
                    if(password.length==0){
                        layer.tips('请输入密码',elem.find('#password'),{tips:[3,'#ffa200']});
                        return false;
                    }
                    home.setButton(btn,true);
                    home.ajax.user_login(nickname,password,function(data){
                        window.location.reload();
                    },function(errorMsg){
                        layer.tips(errorMsg||'登陆失败，请重新登陆',elem.find('#username'),{tips:[3,'#ffa200']});
                        home.setButton(btn,false);
                    });
                    return false;
                }
            });
        },
        login:function(){
            $('#login').on('click',function(){
                home._login();
            })
        },
        logout:function(){
            $('#quit').on('click',function(){
                home.ajax.user_logout(function(){
                    window.location.reload();
                });
            })
        },
        create_file:function(){
            var html = '<form id= "uploadForm" enctype="multipart/form-data">';
            html += '<div class="file-box">';
            html += '<i class="layui-icon">&#xe67c;</i>';
            html += '<input name="head" onchange="home.upload(this);" type="file" class="file">';
            html += '</div>';
            html += '</form>';
            return html;
        },
        upload:function(e){
            var file = e.files[0];
            if(!/^image\//.test(file.type)){
                layer.tips('请正确选择图片格式',e,{tips:[2,'#ffa200']});
                $(e).val('');
                return false;
            }
            if(file.size>1024*1024){
                layer.tips('图片上传大小不能超过1M',e,{tips:[2,'#ffa200']});
                $(e).val('');
                return false;
            }
            var box = $('#'+home.boxId);
            var wait = home.create_wait();
            $(box).append($(wait));
            $(box).find('#uploadForm').ajaxSubmit({
                async:true,
                type:"POST",
                dataType:"json",
                url:'/upload/images',
                success:function(data){
                    var html = '';
                    if(data.code){
                        html = home.create_image(data.imgSrc,data.imgId);
                        $(box).html($(html));
                    }else{
                        html = home.create_file();
                        $(box).html($(html));
                        layer.tips(data.msg,$(box).find('.file'),{tips:[2,'#ffa200']});
                    }
                },
                error:function (xhr,error,msg) {
                    var html = home.create_file();
                    $(box).html($(html));
                    layer.tips('头像上传失败，请重新上传',$(box).find('.file'),{tips:[2,'#ffa200']});
                }
            });
        },
        edit:function(){
            $('#edit').on('click',function(){
                var sexId = 'sex_'+home.getId();
                home.boxId = 'box_'+home.getId();
                var sexSel = null;
                var layer = layui.layer;
                var html = home.reg_html(sexId,home.boxId,false);
                layer.open({
                    //btnAlign:'c',
                    title:'用户注册',
                    btn:['取消','修改资料'],
                    skin:'blog-layer',
                    area:['700px','520px'],
                    content:html,
                    scrollbar:false,
                    btn1:function(){
                        layer.closeAll();
                    },
                    btn2:function(index,elem){
                        var btn = elem.find('.layui-layer-btn1');
                        if(home.disabled(btn))
                            return false;
                        var imgId = elem.find('.img').attr('imgid');
                        var imgSrc = elem.find('.img').attr('src');
                        var nickname = $.trim(elem.find('#nickname').val());
                        var psw = $.trim(elem.find('#password').val());
                        var rePsw = $.trim(elem.find('#re-password').val());
                        var sex = sexSel.getBool(); // 获取性别;
                        if(typeof imgSrc=='undefined'){
                            layer.tips('请上传图像',elem.find('.upload-box'),{tips:[2,'#ffa200']});
                            return false;
                        }
                        if(nickname.length==0){
                            layer.tips('请输入昵称',elem.find('#nickname'),{tips:[3,'#ffa200']});
                            return false;
                        }
                        if(nickname.length>10){
                            layer.tips('昵称在10个字符以内',elem.find('#nickname'),{tips:[3,'#ffa200']});
                            return false;
                        }
                        if(psw.length==0){
                            layer.tips('请输入密码',elem.find('#password'),{tips:[3,'#ffa200']});
                            return false;
                        }
                        if(sexSel.getCheck()==null){
                            layer.tips('请选择性别',elem.find('.register-sex'),{tips:[1,'#ffa200']});
                            return false;
                        }
                        if(psw.length==0){
                            layer.tips('请输入密码',elem.find('#password'),{tips:[3,'#ffa200']});
                            return false;
                        }
                        if(psw.length<6||psw.length>20){
                            layer.tips('密码长度在6-20位之间',elem.find('#password'),{tips:[3,'#ffa200']});
                            return false;
                        }
                        if(rePsw!=psw){
                            layer.tips('两次密码输入不一致，请重新输入',elem.find('#re-password'),{tips:[3,'#ffa200']});
                            return false;
                        }
                        home.setButton(btn,true);
                        var data = {
                            imgId:imgId,
                            imgSrc:imgSrc,
                            nickname:nickname,
                            password:psw,
                            sex:sex[0]?true:false
                        };
                        home.ajax.reg_save(data,function(data){
                            home._login();
                            layer.close(index);
                        },function(errorMsg){
                            layer.tips(errorMsg||'注册失败，请重试',elem.find('#nickname'),{tips:[3,'#ffa200']});
                            home.setButton(btn,false);
                            return false;
                        });
                        return false;
                    }
                });
                layer.ready(function(){
                    var checked = users.sex=='true'?[0]:[1];
                    sexSel = new WM.checkBox({
                        id:sexId,
                        group:['汉子','妹子'],
                        notNull:true,
                        multiple:false,
                        checked:checked
                    });
                })
            })
        },
        // 文章分页；
        home_skill_page:function(data){
            var html = '';
            for(var i=0;i<data.length;i++){
                var e = data[i];
                html += '<div class="one-content">';
                html += '<div class="one-title ellipsis">'+e.title+'</div>';
                html += '<div class="one-time">';
                html += '<span class="user">'+e.user+'</span>';
                html += '<span class="time">'+e.time+'</span>';
                html += '</div>';
                html += '<a href="/?u_id='+e._id+'" target="_blank" title="'+e.title+'"></a>';
                html += '</div>';
            }
            return html;
        },
        create_wait:function(){
            var html = '<div class="wait">';
            html += '<i class="layui-icon layui-anim layui-anim-rotate layui-anim-loop">&#xe63d;</i>';
            html += '</div>';
            return html;
        },
        create_image:function(imgSrc,imgId){
            var html = '<div class="img-box">';
            html += '<img class="img" imgid="'+imgId+'" src="'+imgSrc+'" alt="">';
            html += '<i class="layui-icon" title="删除" onclick="home.img_del(this);">&#xe640;</i>';
            html += '</div>';
            return html;
        },
        img_del:function(e){
            var src = $(e).parents('.img-box').find('.img').attr('src');
            var userId = $('.layui-layer-content').find('.upload-box').attr('userid');
            if(typeof src!='undefined')
                home.ajax.reg_del_images(src,userId);
            var html = home.create_file();
            $('#'+home.boxId).html($(html));
        },
        reg_html:function(sexId,boxId,bool){
            var html = '';
            html += '<div class="register">';
            html += '<span>请上传头像&nbsp;(建议400*400)</span>';
            var userId = bool?'':users.userId;
            html += '<div class="upload-box" id="'+boxId+'" userid="'+userId+'">';
            html += bool?home.create_file():home.create_image(users.headSrc,users.headId);
            html += '</div>';
            html += '</div>';
            html += '<div class="register">';
            html += '<span>请输入昵称：</span>';
            var name = bool?'':users.nickName;
            html += '<input type="text" id="nickname" value="'+name+'" placeholder="请输入昵称（10个字符以内）" autocomplete="off" class="layui-input">';
            html += '</div>';
            html += '<div class="register">';
            html += '<span>请选择性别：</span>';
            html += '<div class="register-sex" id="'+sexId+'"></div>';
            html += '</div>';
            html += '<div class="register">';
            html += '<span>请输入密码：</span>';
            html += '<input type="password" id="password" placeholder="请输入密码（6-20位）" autocomplete="off" class="layui-input">';
            html += '</div>';
            html += '<div class="register">';
            html += '<span>请确认密码：</span>';
            html += '<input type="password" id="re-password" placeholder="请确认密码" autocomplete="off" class="layui-input">';
            html += '</div>';
            return html;
        },
        // 后台
        no_data:function(text){
            text = text || '没有数据';
            var html = '<div class="no_data">';
            html += '<i class="layui-icon">&#xe628;</i>';
            html += '<span>'+text+'</span>';
            html += '</div>';
            return html;
        },
        user_page:function(data){
            var html = '';
            html += '<tr>';
            html += '<th width="18%">用户ID</th>';
            html += '<th width="18%">用户头像</th>';
            html += '<th width="18%">用户昵称</th>';
            html += '<th width="18%">用户性别</th>';
            html += '<th width="18%">注册时间</th>';
            html += '<th width="*">操作</th>';
            html += '</tr>';
            for(var i=0;i<data.length;i++){
                var e = data[i];
                html += '<tr>';
                html += '<td>'+e._id+'</td>';
                html += '<td>';
                html += '<img class="user-head" src="'+e.imgsrc+'">';
                html += '</td>';
                html += '<td>'+e.nickname+'</td>';
                html += '<td>'+e.sex+'</td>';
                html += '<td>'+e.time+'</td>';
                html += '<td>';
                html += '<i title="删除" onclick="home.del_users(this);" class="admin-del admin-icon layui-icon">&#xe640;</i>';
                html += '</td>';
                html += '</tr>';
            }
            return html;
        },
        comment_page:function(data){
            var html = '';
            html +=  '<tr>';
            html += '<th width="14%">昵称</th>';
            html += '<th width="12%">头像</th>';
            html += '<th width="14%">性别</th>';
            html += '<th width="14%">文章ID</th>';
            html += '<th width="20%">评论内容</th>';
            html += '<th width="14%">评论时间</th>';
            html += '<th width="*">操作</th>';
            html += '</tr>';
            for(var i=0;i<data.length;i++){
                var e = data[i];
                html += '<tr>';
                html += '<td>'+e.nickname+'</td>';
                html += '<td>';
                html += '<img class="user-head" src="'+e.imgsrc+'">';
                html += '</td>';
                html += '<td>'+e.sex+'</td>';
                html += '<td>'+e._id+'</td>';
                html += '<td>'+e.text+'</td>';
                html += '<td>'+e.time+'</td>';
                html += '<td>';
                html += '<i title="删除" onclick="home.del_comments(this);" class="admin-del admin-icon layui-icon">&#xe640;</i>';
                html += '</td>';
                html += '</tr>';
            }
            return html;
        },
        del_comments:function(e){
            var layer = layui.layer;
            layer.confirm('确定删除该用户评论',{
                title:'删除评论',
                skin:'layui-layout',
                btn: ['取消','确定'] //按钮
            }, function(){
                layer.closeAll();
            }, function(index,elem){
                var commId = $(e).parents('tr').find('td').eq(3).html();
                var btn = elem.find('.layui-layer-btn1');
                var count = parseInt($('.all-user').attr('all'));
                if(home.disabled(btn))
                    return false;
                home.setButton(btn,true);
                home.ajax.admin_del_comments(commId,function(){
                    layer.msg('删除成功');
                    $(e).parents('tr').remove();
                    $('.all-user').html('总用户数：'+(count-1)).attr('all',count-1);
                    if($('.layui-table').find('tr').length==1)
                        window.location.reload();
                    home.setButton(btn,false);
                },function(errorMsg){
                    layer.msg(errorMsg||'删除失败，请重试');
                });
                return false;
            });
        },
        _skill_page:function(data){
            var html = '';
            html += '<tr>';
            html += '<th width="15%">文章ID</th>';
            html += '<th width="20%">标题</th>';
            html += '<th width="15%">作者</th>';
            html += '<th width="15%">时间</th>';
            html += '<th width="15%">分类</th>';
            html += '<th width="*">操作</th>';
            html += '</tr>';
            for(var i=0;i<data.length;i++){
                var e = data[i];
                html += '<tr>';
                html += '<td>'+e._id+'</td>';
                html += '<td>'+e.title+'</td>';
                html += '<td>'+e.user+'</td>';
                html += '<td>'+e.time+'</td>';
                html += '<td>'+e.type+'</td>';
                html += '<td>';
                html += '<i title="编辑" onclick="home.edit_skills(this);" class="admin-edit admin-icon layui-icon">&#xe642;</i>';
                html += '<i title="删除" onclick="home.del_skills(this);" class="admin-del admin-icon layui-icon">&#xe640;</i>';
                html += '</td>';
                html += '</tr>';
            }
            return html;
        },
        create_comment:function(data){
            if(data==null||data.length==0)
                return;
            var html = '';
            for(var i=0;i<data.length;i++){
                var e = data[i];
                html += '<div class="blog-one-user">';
                html += '<div class="one-user-l">';
                html += '<img imgid="'+e.headId+'" src="'+e.imgsrc+'" alt="">';
                html += '</div>';
                html += '<div class="one-user-r">';
                html += '<div class="one-user-title">';
                html += '<span class="user-name">'+e.nickname+'</span>';
                if(e.sex)
                    html += '<span class="layui-icon">&#xe662;</span>';
                else
                    html += '<span class="layui-icon">&#xe661;</span>';
                html += '<div class="user-time">'+e.time+'</div>';
                html += '</div>';
                html += '<div class="one-user-con">'+e.text+'</div>';
                html += '</div>';
                html += '</div>';
            }
            return html;
        },
        del_users:function(e){
            var layer = layui.layer;
            layer.confirm('确定删除该用户',{
                title:'删除用户',
                skin:'layui-layout',
                btn: ['取消','确定'] //按钮
            }, function(){
                layer.closeAll();
            }, function(index,elem){
                var userId = $(e).parents('tr').find('td').eq(0).html();
                var btn = elem.find('.layui-layer-btn1');
                var count = parseInt($('.all-user').attr('all'));
                if(home.disabled(btn))
                    return false;
                home.setButton(btn,true);
                home.ajax.admin_del_user(userId,function(){
                    layer.msg('删除成功');
                    $(e).parents('tr').remove();
                    $('.all-user').html('总用户数：'+(count-1)).attr('all',count-1);
                    if($('.layui-table').find('tr').length==1)
                        window.location.reload();
                    home.setButton(btn,false);
                },function(errorMsg){
                    layer.msg(errorMsg||'删除失败，请重试');
                });
                return false;
            });
        },
        get_index_comm:function(el,skillId){
            home.ajax.index_comment('1',skillId,function(data){
                var html = home.create_comment(data.comm);
                $('.blog-user-list').html($(html));
                home.page('page',data.count,function(data,first){
                    if(first)
                        return;
                    home.ajax.index_comment(data.curr,skillId,function(data){
                        var html = home.create_comment(data.comm);
                        $('.blog-user-list').html($(html));
                    },function(errorMsg){
                        home.showInfo(errorMsg||'获取评论失败，请重试');
                    });
                });
                home.hide_comment();
            },function(errorMsg){
                home.showInfo(errorMsg||'获取评论失败，请重试');
            });
        },
        hide_comment:function(){
            if($('.blog-one-user').length==0){
                $('.blog-user-list').hide();
                $('.page').hide();
            }
        },
        edit_skills:function(e){
            var skillId = $(e).parents('tr').find('td').eq(0).html();
        },
        del_skills:function(e){
            var skillId = $(e).parents('tr').find('td').eq(0).html();
            var layer = layui.layer;
            layer.confirm('确定删除该文章',{
                title:'删除文章',
                skin:'layui-layout',
                btn: ['取消','确定'] //按钮
            }, function(){
                layer.closeAll();
            }, function(index,elem){
                var userId = $(e).parents('tr').find('td').eq(0).html();
                var btn = elem.find('.layui-layer-btn1');
                var count = parseInt($('.all-user').attr('all'));
                if(home.disabled(btn))
                    return false;
                home.setButton(btn,true);
                home.ajax.del_skills(userId,function(){
                    layer.msg('删除成功');
                    $(e).parents('tr').remove();
                    $('.all-user').html('总文章数：'+(count-1)).attr('all',count-1);
                    if($('.layui-table').find('tr').length==1)
                        window.location.reload();
                    home.setButton(btn,false);
                },function(errorMsg){
                    layer.msg(errorMsg||'删除失败，请重试');
                });
                return false;
            });
        },
        // 所有的ajax;
        ajax:{
            // 前台ajax;
            reg_del_images:function(src,userId){
                $.post('/del/images',{src:src,userId:userId});
            },
            reg_save:function(data,fn1,fn2){  // 注册;
                $.post('/register',{data:JSON.stringify(data)},function(data){
                    if(data.code){
                        fn1(data.msg);
                    }else{
                        fn2(data.msg);
                    }
                });
            },
            user_login:function(nickname,password,fn1,fn2){
                $.post('/login',{nickname:nickname,password:password},function(data){
                    if(data.code){
                        fn1();
                    }else{
                        fn2(data.msg);
                    }
                },'json');
            },
            user_logout:function(fn1){
                $.post('/logout',function(data){
                    fn1();
                });
            },
            home_skill_page:function(page,fn1,fn2){
                $.post('/skill/get_page',{page:page},function(data){
                    if(data.code){
                        fn1(data.skill);
                    }else{
                        fn2(data.msg);
                    }
                });
            },
            home_skill_heart:function(page,fn1,fn2){
                $.post('/mood/get_page',{page:page},function(data){
                    if(data.code){
                        fn1(data.skill);
                    }else{
                        fn2(data.msg);
                    }
                });
            },
            index_save:function(data,fn1,fn2){ // 首页保存评论;
                $.post('/save/comments',{data:JSON.stringify(data)},function(data){
                    console.log(data);
                    if(data.code){
                        fn1(data.comm);
                    }else{
                        fn2(data.msg);
                    }
                },'json');
            },
            index_comment:function(page,skillId,fn1,fn2){
                $.post('/get/comment',{page:page,skillId:skillId},function(data){
                    if(data.code){
                        fn1(data.data);
                    }else{
                        fn2(data.msg);
                    }
                },'json');
            },
            // 后台ajax
            admin_get_user_list:function(page,fn1,fn2){
                $.post('/admin-users/get_user',{page:page},function(data){
                    if(data.code){
                        fn1(data.user);
                    }else{
                        fn2(data.msg);
                    }
                },'json');
            },
            admin_del_user:function(userId,fn1,fn2){
                $.post('/admin-users/del_user',{userId:userId},function(data){
                    if(data.code){
                        fn1();
                    }else{
                        fn1(data.msg);
                    }
                },'json');
            },
            admin_edit:function(data,fn1,fn2){
                $.post('/admin-edit/save',{data:JSON.stringify(data)},function(data){
                    if(data.code){
                        fn1();
                    }else{
                        fn2(data.msg);
                    }
                },'json');
            },
            skill_page:function(page,fn1,fn2){
                $.post('/admin-skills/skills_page',{page:page},function(data){
                    if(data.code){
                        fn1(data.skill);
                    }else{
                        fn2(data.msg);
                    }
                },'json');
            },
            del_skills:function(skillId,fn1,fn2){
                $.post('/admin-skills/skills_del',{skillId:skillId},function(data){
                    if(data.code){
                        fn1();
                    }else{
                        fn2(data.msg);
                    }
                },'json');
            },
            admin_get_comments:function(page,fn1,fn2){
                $.post('/admin-comments/get_comments',{page:page},function(data){
                    if(data.code){
                        fn1(data.comm);
                    }else{
                        fn2(data.msg);
                    }
                },'json');
            },
            admin_del_comments:function(commId,fn1,fn2){
                $.post('/admin-comments/del_comments',{commId:commId},function(data){
                    if(data.code){
                        fn1();
                    }else{
                        fn2(data.msg);
                    }
                },'json');
            }
        }
    }
})(window,jQuery);
