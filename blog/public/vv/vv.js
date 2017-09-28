(function(global,factory){
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
        typeof define === 'function' && define.amd ? define(factory) :
            (global.WM = factory());
})(this,function(){
    var W = {};
    W.getType = function(code){
        return Object.prototype.toString.call(code).replace(/]/,'').split(" ")[1];
    };
    W.getId = function(){
        return ('W'+Math.random()+new Date().getTime()).replace('.','');
    };
    W.checkUrl = function(url){
        var reg = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
        return reg.test(url);
    };
    // checkBox
    W.checkBox = function(data){
        this.id = $('#'+data.id);
        this.checkBox = W.getId();
        this.group = data.group||[];  // 数据
        this.disabled = data.disabled; // 被禁用
        this.multiple = data.multiple==null?false:data.multiple; // 是否多选
        this.notNull = data.notNull==null?false:data.notNull;  // 是否不能为空
        this.checked = data.checked; // 被选中;
        this.onChange = data.onChange;  // onChange
        this.init();
    };
    W.checkBox.prototype = {
        constructor:W.checkBox,
        init:function(){
            this.create();
        },
        create:function(){
            var html = '';
            html += '<div class="W_checkBox" id="'+this.checkBox+'">';
            var group = this.group;
            for(var i=0;i<group.length;i++){
                var dt = group[i];
                html += '<div class="W_check W_clear" value="'+dt+'">';
                html += '<span class="W_check_text">'+dt+'</span>';
                html += '<span class="W_IconFont W_check_icon"></span>';
                html += '</div>';
            }
            html += '</div>';
            $(this.id).html($(html));
            this.chose();
            this.isCheck();
            this.locked();
        },
        isCheck:function(){ //checked;
            var checked = this.checked;
            var group = this.group;
            var $isCheck = $('#'+this.checkBox).find('.W_check');
            var _this = this;
            if(checked instanceof Array){
                $($isCheck).removeClass('W_checked');
                for(var i=0;i<group.length;i++){
                    for(var j=0;j<checked.length;j++){
                        if(_this.multiple){
                            if(checked[j]==i||checked[j]==group[i])
                                $($isCheck).eq(i).addClass('W_checked');
                        }else{
                            if(checked[0]==i||checked[0]==group[i])
                                $($isCheck).eq(i).addClass('W_checked');
                        }
                    }
                }
            }
        },
        locked:function(){  // disabled;
            var disabled = this.disabled;
            var group = this.group;
            var $isCheck = $('#'+this.checkBox).find('.W_check');
            var _this = this;
            if(disabled instanceof Array){
                $($isCheck).removeClass('W_check_disabled');
                for(var i=0;i<group.length;i++){
                    for(var j=0;j<disabled.length;j++){
                        if(disabled[j]==i||disabled[j]==group[i])
                            $($isCheck).eq(i).addClass('W_check_disabled');
                    }
                }
            }
        },
        chose:function(){
            var _this = this;
            var id = $('#'+this.checkBox);
            var checkBox = $(id).find('.W_check');
            $(checkBox).on('click',function(){
                if($(this).hasClass('W_check_disabled'))
                    return;
                var len = $(id).find('.W_checked').length;
                if(_this.multiple){    // 多选
                    if(_this.notNull){  // 不为空
                        if($(this).hasClass('W_checked')){
                            if(len==1)
                                return;
                            $(this).removeClass('W_checked');
                        }else
                            $(this).addClass('W_checked');
                        _this.onChange&&typeof _this.onChange==='function'&&_this.onChange.call(_this);
                    }else{
                        $(this).hasClass('W_checked')?$(this).removeClass('W_checked'):$(this).addClass('W_checked');
                        _this.onChange&&typeof _this.onChange==='function'&&_this.onChange.call(_this);
                    }
                }else{
                    if(_this.notNull){
                        if($(this).hasClass('W_checked')){
                            if(len==1)
                                return;
                            $(this).removeClass('W_checked').siblings('.W_check').removeClass('W_checked');
                            _this.onChange&&typeof _this.onChange==='function'&&_this.onChange.call(_this);
                        }else{
                            $(this).addClass('W_checked').siblings('.W_check').removeClass('W_checked');
                            _this.onChange&&typeof _this.onChange==='function'&&_this.onChange.call(_this);
                        }
                    }else{
                        if($(this).hasClass('W_checked')){
                            $(this).removeClass('W_checked').siblings('.W_check').removeClass('W_checked');
                            _this.onChange&&typeof _this.onChange==='function'&&_this.onChange.call(_this);
                        }else{
                            $(this).addClass('W_checked').siblings('.W_check').removeClass('W_checked');
                            _this.onChange&&typeof _this.onChange==='function'&&_this.onChange.call(_this);
                        }
                    }
                }
            })
        },
        hasNot:function(){  // 是否为空
            var checked = $('#'+this.checkBox).find('.W_check');
            var bool=[];
            $(checked).each(function(index,value){
                if($(this).hasClass('W_checked'))
                    bool.push(index);
            });
            return bool.length==0?true:false;
        },
        getIndex:function(){ // 获取被选中的索引
            var checked = $('#'+this.checkBox).find('.W_check');
            var NewArr = [];
            $(checked).each(function(index,value){
                if($(this).hasClass('W_checked'))
                    NewArr.push(index);
            });
            return NewArr;
        },
        getBool:function(){ // 获取布尔值
            var checked = $('#'+this.checkBox).find('.W_check');
            var NewArr = [];
            $(checked).each(function(index,value){
                $(this).hasClass('W_checked')?NewArr.push(true):NewArr.push(false);
            });
            return NewArr;
        },
        getCheck:function(){  // 取值;
            var checked = $('#'+this.checkBox).find('.W_check');
            var val=[],idx=[];
            $(checked).each(function(index,value){
                if($(this).hasClass('W_checked')){
                    val.push($.trim($(this).attr('value')));
                    idx.push(index);
                }
            });
            if(val.length>0&&idx.length>0){
                return {
                    value:val,
                    index:idx
                }
            }else{
                return null;
            }
        }
    };
    // select
    W.select = function(data){
        this.id = $('#'+data.id);
        this.selectBox = W.getId();
        this.options = data.options;
        this.title = data.title||'请选择';
        this.group = false;
        this.disabled = data.disabled;
        this.onChange = data.onChange;
        this.checked = data.checked;
        this.selected = data.selected;
        this.isChange = false;
        this.init();
    };
    W.select.prototype = {
        constructor:W.select,
        init:function(){
            this.select();
            this.groupTitle();
        },
        reset:function(){
            this.setTitle();
            this.isChecked();
            this.isSelected();
            this.stop();
            this.chose();
            this.notSelect();
        },
        setTitle:function(){
            $('#'+this.selectBox).find('.W_select_title').find('span').html(this.title);
        },
        select:function(){
            var html='',disabled=this.disabled?'W_select_locked':'';
            html += '<div class="W_selectBox" id="'+this.selectBox+'">';
            html += '<div class="W_select '+disabled+'">';
            html += '<div class="W_select_title">';
            html += '<span>'+this.title+'</span>';
            html += '</div>';
            html += '<div class="W_select_air">';
            html += '<span></span>';
            html += '</div></div>';
            html += '<div class="W_option">';
            html += this.option(this.options);
            html += '</div>';
            $(this.id).html($(html));
            this.notSelect();
            this.change();
            this.reset();
        },
        notSelect:function(){
            var select = $('#'+this.selectBox);
            $(select).find('.W_option_one').length==0?$(select).find('.W_select').addClass('W_select_not'):$(select).find('.W_select').removeClass('W_select_not');
        },
        option:function(options){
            var html='',_this = this;
            $.each(options,function(index,value){
                if(value instanceof Object){
                    _this.group = true;
                    html += '<div class="W_option_group">';
                    html += '<div class="W_group_title">'+value.name+'</div>';
                    if(value.option instanceof Array&&value.option.length>0){
                        html += '<div class="W_group_list">';
                        $.each(value.option,function(idx,val){
                            html += '<div class="W_option_one" gindex="'+index+'" gvalue="'+value.name+'" index="'+idx+'" value="'+val+'">';
                            html += '<span>'+val+'</span>';
                            html += '</div>';
                        });
                        html += '</div>';
                    }
                    html += '</div>';
                }else{
                    _this.group = false;
                    html += '<div class="W_option_one" index="'+index+'" value="'+value+'">';
                    html += '<span>'+value+'</span>';
                    html += '</div>';
                }
            });
            return html;
        },
        change:function(){
            var _this = this;
            var select = $('#'+this.selectBox);
            $(select).find('.W_select').on('click',function(event){
                if($(this).hasClass('W_select_locked')||$(this).hasClass('W_select_not'))
                    return;
                event.stopPropagation();
                if(_this.isChange){
                    _this.close();
                }else{
                    _this.open();
                }
            });
        },
        chose:function(){
            var _this = this;
            var select = $('#'+this.selectBox);
            $(select).find('.W_option_one').on('click',function(event){
                if($(this).hasClass('W_option_checked')||$(this).hasClass('W_option_disabled'))
                    return event.stopPropagation();
                var value = $.trim($(this).attr('value'));
                $(select).find('.W_select_title').find('span').html(value);
                if(_this.group){
                    $('.W_option_one').removeClass('W_option_checked');
                    $(this).addClass('W_option_checked');
                }else{
                    $(this).addClass('W_option_checked').siblings('.W_option_one').removeClass('W_option_checked');
                }
                _this.close();
                _this.onChange&&typeof _this.onChange==='function'&&_this.onChange.call(_this);
            });
        },
        isChecked:function(){
            var checked = this.checked;
            var select = $('#'+this.selectBox);
            var option = $(select).find('.W_option_one');
            $(option).removeClass('W_option_checked');
            this.setChecked(checked[0]);
        },
        isSelected:function(){
            var selected = this.selected;
            var option = $('#'+this.selectBox).find('.W_option_one');
            if(selected instanceof Array){
                $(option).removeClass('W_option_disabled');
                for(var i=0;i<$(option).length;i++){
                    for(var j=0;j<selected.length;j++){
                        if(i==selected[j]||$.trim($(option).eq(i).attr('value'))==selected[j])
                            $(option).eq(i).addClass('W_option_disabled');
                    }
                }
            }
        },
        append:function(newArray){
            if(newArray instanceof Array&&this.options instanceof Array){
                if(!this.group){
                    newArray = this.options.concat(newArray);
                    var html = this.option(newArray);
                    $('#'+this.selectBox).find('.W_option').html($(html));
                    this.reset();
                }
            }
        },
        remove:function(newArray){
            if(newArray instanceof Array){
                if(!this.group){
                    var options = $('#'+this.selectBox).find('.W_option_one');
                    for(var i=0;i<$(options).length;i++){
                        for(var j=0;j<newArray.length;j++){
                            if($.trim($(options).eq(i).attr('value'))==newArray[j]||i==newArray[j]){
                                $(options).eq(i).remove();
                            }
                        }
                    }
                    this.setIndex();
                    this.reset();
                }
            }
        },
        resetAll:function(newArray){
            if(newArray instanceof Array){
                var html = newArray.length>0?this.option(newArray):'';
                $('#'+this.selectBox).find('.W_option').html($(html));
                this.reset();
            }
        },
        groupTitle:function(){
            $('#'+this.selectBox).find('.W_group_title').click(function(event){
                return event.stopPropagation();
            })
        },
        setIndex:function(){
            if(!this.group){
                $('#'+this.selectBox).find('.W_option_one').each(function(index,value){
                    $(this).attr('index',index);
                })
            }
        },
        setChecked:function(checked){
            var select = $('#'+this.selectBox);
            var option = $(select).find('.W_option_one');
            var title = $(select).find('.W_select_title').find('span');
            for(var i=0;i<$(option).length;i++){
                if($.trim($(option).eq(i).attr('value'))==checked||i==checked){
                    var text = $.trim($(option).eq(i).attr('value'));
                    $(option).eq(i).addClass('W_option_checked');
                    $(title).html(text);
                }
            }
        },
        close:function(){
            var select = $('#'+this.selectBox);
            var _this = this;
            $(select).find('.W_option').hide();
            $(select).removeClass('W_select_open').addClass('W_select_close');
            _this.isChange = false;
        },
        open:function(){
            var select = $('#'+this.selectBox);
            $(select).find('.W_option').show();
            $(select).removeClass('W_select_close').addClass('W_select_open');
            this.isChange = true;
        },
        stop:function(){
            var _this = this;
            $(document).on('click',function(){
                _this.close();
            })
        },
        getCheck:function(){
            var select = $('#'+this.selectBox);
            if(this.group){
                var val = $.trim($(select).find('.W_option_checked').attr('value')),
                    idx = $.trim($(select).find('.W_option_checked').attr('index')),
                    gVal = $.trim($(select).find('.W_option_checked').attr('gvalue')),
                    gIdx = $.trim($(select).find('.W_option_checked').attr('gindex'));
                return val==''&&idx==''?null:{checkValue:val,checkIndex:idx,groupValue:gVal,groupIndex:gIdx};
            }else{
                var value = $.trim($(select).find('.W_option_checked').attr('value')),
                    index = $.trim($(select).find('.W_option_checked').attr('index'));
                return value==''&&index==''?null:{checkValue:value,checkIndex:index};
            }
        }
    };
    return W;
});