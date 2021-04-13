layui.config({
	base: "js/"
}).use(['form', 'layer', 'jquery', 'laypage'], function () {
	var form = layui.form,
		layer = parent.layer === undefined ? layui.layer : parent.layer,
		laypage = layui.laypage,
		$ = layui.jquery;

	//加载页面数据
	// var newsData = '';
	// $.get("../../json/newsList.json", function(data) {
	// 	var newArray = [];
	// 	//单击首页“待审核文章”加载的信息
	// 	if ($(".top_tab li.layui-this cite", parent.document).text() == "待审核文章") {
	// 		if (window.sessionStorage.getItem("addNews")) {
	// 			var addNews = window.sessionStorage.getItem("addNews");
	// 			newsData = JSON.parse(addNews).concat(data);
	// 		} else {
	// 			newsData = data;
	// 		}
	// 		for (var i = 0; i < newsData.length; i++) {
	// 			if (newsData[i].newsStatus == "待审核") {
	// 				newArray.push(newsData[i]);
	// 			}
	// 		}
	// 		newsData = newArray;
	// 		newsList(newsData);
	// 	} else { //正常加载信息
	// 		newsData = data;
	// 		if (window.sessionStorage.getItem("addNews")) {
	// 			var addNews = window.sessionStorage.getItem("addNews");
	// 			newsData = JSON.parse(addNews).concat(newsData);
	// 		}
	// 		//执行加载数据的方法
	// 		newsList();
	// 	}
	// })

	//查询
	$(".search_btn").click(function () {
		var newArray = [];
		if ($(".search_input").val() != '') {
			var index = layer.msg('查询中，请稍候', {
				icon: 16,
				time: false,
				shade: 0.8
			});
			setTimeout(function () {
				$.ajax({
					url: "newsList.json",
					type: "get",
					dataType: "json",
					success: function (data) {
						if (window.sessionStorage.getItem("addNews")) {
							var addNews = window.sessionStorage.getItem("addNews");
							newsData = JSON.parse(addNews).concat(data);
						} else {
							newsData = data;
						}
						for (var i = 0; i < newsData.length; i++) {
							var newsStr = newsData[i];
							var selectStr = $(".search_input").val();

							function changeStr(data) {
								var dataStr = '';
								var showNum = data.split(eval("/" + selectStr + "/ig")).length - 1;
								if (showNum > 1) {
									for (var j = 0; j < showNum; j++) {
										dataStr += data.split(eval("/" + selectStr + "/ig"))[j] +
											"<i style='color:#03c339;font-weight:bold;'>" + selectStr + "</i>";
									}
									dataStr += data.split(eval("/" + selectStr + "/ig"))[showNum];
									return dataStr;
								} else {
									dataStr = data.split(eval("/" + selectStr + "/ig"))[0] +
										"<i style='color:#03c339;font-weight:bold;'>" + selectStr + "</i>" + data.split(eval("/" + selectStr +
											"/ig"))[1];
									return dataStr;
								}
							}
							//文章标题
							if (newsStr.newsName.indexOf(selectStr) > -1) {
								newsStr["newsName"] = changeStr(newsStr.newsName);
							}
							//发布人
							if (newsStr.newsAuthor.indexOf(selectStr) > -1) {
								newsStr["newsAuthor"] = changeStr(newsStr.newsAuthor);
							}
							//审核状态
							if (newsStr.newsStatus.indexOf(selectStr) > -1) {
								newsStr["newsStatus"] = changeStr(newsStr.newsStatus);
							}
							//浏览权限
							if (newsStr.newsLook.indexOf(selectStr) > -1) {
								newsStr["newsLook"] = changeStr(newsStr.newsLook);
							}
							//发布时间
							if (newsStr.newsTime.indexOf(selectStr) > -1) {
								newsStr["newsTime"] = changeStr(newsStr.newsTime);
							}
							if (newsStr.newsName.indexOf(selectStr) > -1 || newsStr.newsAuthor.indexOf(selectStr) > -1 || newsStr.newsStatus
								.indexOf(selectStr) > -1 || newsStr.newsLook.indexOf(selectStr) > -1 || newsStr.newsTime.indexOf(
									selectStr) > -1) {
								newArray.push(newsStr);
							}
						}
						newsData = newArray;
						newsList(newsData);
					}
				})

				layer.close(index);
			}, 2000);
		} else {
			layer.msg("请输入需要查询的内容");
		}
	})
	//批量删除
	$(".batchDel").click(function () {
		var $checkbox = $('.news_list tbody [type="checkbox"][name="checked"]');
		var $checked = $('.news_list tbody [type="checkbox"][name="checked"]:checked');
		if ($checkbox.is(":checked")) {
			layer.confirm('确定删除选中的信息？', {
				icon: 3,
				title: '提示信息'
			}, function (index) {
				var index = layer.msg('删除中，请稍候', {
					icon: 16,
					time: false,
					shade: 0.8
				});
				setTimeout(function () {
					//删除数据
					for (var j = 0; j < $checked.length; j++) {
						for (var i = 0; i < newsData.length; i++) {
							if (newsData[i].newsId == $checked.eq(j).parents("tr").find(".news_del").attr("data-id")) {
								newsData.splice(i, 1);
								newsList(newsData);
							}
						}
					}
					$('.news_list thead input[type="checkbox"]').prop("checked", false);
					form.render();
					layer.close(index);
					layer.msg("删除成功");
				}, 2000);
			})
		} else {
			layer.msg("请选择需要删除的文章");
		}
	})


	function newsList(that) {
		//渲染数据
		function renderDate(data, curr) {
			var dataHtml = '';
			if (!that) {
				currData = newsData.concat().splice(curr * nums - nums, nums);
			} else {
				currData = that.concat().splice(curr * nums - nums, nums);
			}
			if (currData.length != 0) {
				for (var i = 0; i < currData.length; i++) {
					dataHtml += '<tr>' +
						'<td><input type="checkbox" name="checked" lay-skin="primary" lay-filter="choose"></td>' +
						'<td align="left">' + currData[i].newsName + '</td>' +
						'<td>' + currData[i].newsAuthor + '</td>';
					if (currData[i].newsStatus == "待审核") {
						dataHtml += '<td style="color:#f00">' + currData[i].newsStatus + '</td>';
					} else {
						dataHtml += '<td>' + currData[i].newsStatus + '</td>';
					}
					dataHtml += '<td>' + currData[i].newsLook + '</td>' +
						'<td><input type="checkbox" name="show" lay-skin="switch" lay-text="是|否" lay-filter="isShow"' + currData[i].isShow +
						'></td>' +
						'<td>' + currData[i].newsTime + '</td>' +
						'<td>' +
						'<a class="layui-btn layui-btn-mini news_edit"><i class="iconfont icon-edit"></i> 编辑</a>' +
						'<a class="layui-btn layui-btn-normal layui-btn-mini news_collect"><i class="layui-icon">&#xe600;</i> 收藏</a>' +
						'<a class="layui-btn layui-btn-danger layui-btn-mini news_del" data-id="' + data[i].newsId +
						'"><i class="layui-icon">&#xe640;</i> 删除</a>' +
						'</td>' +
						'</tr>';
				}
			} else {
				dataHtml = '<tr><td colspan="8">暂无数据</td></tr>';
			}
			return dataHtml;
		}


	}
});
