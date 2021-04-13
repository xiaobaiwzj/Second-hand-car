layui.use(['table', 'jquery'], function() {
    let table = layui.table
    let $ = layui.jquery
  
    let tableIns = table.render({
      elem: '#info'
      , url: 'info.json'
      , cols: [
        [{
          type: 'checkbox',
          fixed: 'left'
        }, {
          field: 'id',
          title: '编号',
          sort: 'true'
        }, {
          field: 'name',
          title: '用户名',
          edit: 'text',
          width: 120
        }, {
          field: 'age',
          title: '年龄',
          sort: true
        }, {
          field: 'email',
          title: '邮箱',
          edit: 'text'
        }, {
          field: 'birthday',
          title: '生日',
          sort: true
        }, {
          field: 'details',
          title: '简介',
        }, {
          fixed: 'right',
          title: '操作',
          toolbar: '#actionBar',
          width: 150
        }]
      ]
      , page: {
        layout: ['prev', 'page', 'next', 'count']
      }
      , title: '学生信息表'
      , height: 425
      , id: 'info'
      , loading: true
    })//table设置基本参数
  
    //监听行工具事件
    table.on('tool(test)', function(obj) {
      let data = obj.data
      //获得当前行的DOM
      let tr = obj.tr
  
      if (obj.event === 'del') {
        layer.confirm('确定删除吗?', function(index) {
          obj.del()
          layer.close(index)
        })
      } else if (obj.event === 'edit') {
        layer.prompt({
          formType: 2
          , value: data.email
        }, function(value, index) {
          obj.update({
            email: value
          })
          layer.close(index)
        })
      }
    })  //监听行工具事件结束

  
    //    批量删除，
    $('#delSelect').on('click', function() {
      //获得表格CheckBox已经选中的行的信息
      let checkStatus = table.checkStatus('info'),
        //返回行的value
        data = checkStatus.data
  
      if (data.length > 0) {
        layer.confirm('确定删除选中的用户？', {icon: 3, title: '提示信息'}, function(index) {
          //layui中找到CheckBox所在的行，并遍历找到行的顺序
          $('div.layui-table-body table tbody input[name="layTableCheckbox"]:checked').each(function() { // 遍历选中的checkbox
            n = $(this).parents('tbody tr').index()  // 获取checkbox所在行的顺序
            //移除行
            $('div.layui-table-body table tbody ').find('tr:eq(' + n + ')').remove()
            //如果是全选移除，就将全选CheckBox还原为未选中状态
            $('div.layui-table-header table thead div.layui-unselect.layui-form-checkbox').removeClass('layui-form-checked')
          })
          layer.close(index)
        })
      } else {
        layer.msg('请选择需要删除的行')
      }
    })//批量删除操作结束
  //查询功能
    $('button#search').click(function() {
      layer.msg('该功能还在开发中...', {icon: 5})
    })
  })//layui.use函数
  
  