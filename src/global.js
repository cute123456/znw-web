import axios from 'axios'
import { Toast } from 'mint-ui';
import router from './router'
import WechatPlugin from 'vux/src/plugins/wechat/index.js' // 微信分享插件


axios.interceptors.request.use(config => { // 请求拦截
	// 接口请求可在此处统一处理
	config.headers = {
		"ng-params-one": localStorage.uid,
		"ng-params-two": localStorage.token
	
	  }
	return config
}, error => { // 接口请求出错可在此处统一处理
	Toast({
		message: '请求超时',
		position: 'middle',
		duration: 3000
	})
	return Promise.reject(error)
})

axios.interceptors.response.use(res => { // 返回状态判断(添加响应拦截器)，axios时基于promise的异步请求
	//对响应数据做些事
	if (!res.data.success) { //   if (res.data && !res.data.success) {

		return new Promise((resolve, reject) => {
			resolve(res);
		}) //Promise.reject(res.data.message);

	} else {
		console.log('axios响应拦截')
		// router.push("/login")
	}
	return res
}, error => { // 接口相应出错可在这里同意处理，例如登录token过期等
	console.log('axios响应错误')
	if (process.env.NODE_ENV !== 'development') { // 非开发环境
		localStorage.removeItem('uid')
		localStorage.removeItem('token')
		axios.get('/wechatauth/auth/url', {
			params: {
				url: 'http://znw.anasit.com'
			}
		}).then(res => {
			window.location.href = res.data.datas
		})
	}
})


export default {
	install(Vue, options) {
		// 滚动加载数据
		Vue.prototype.datas = {
			lists: [], // 接口获取的数据数组
			page: 1, // 页数
			pageSize: 0, // 总共头多少
			limit: 10,
		}


		/**
		 * 封装post请求
		 * @param url
		 * @param data
		 * @returns {Promise}
		*/

		Vue.prototype.post = function (url, data = {}) {
			return new Promise((resolve, reject) => {
				axios.post(url, data)
					.then(response => {
						resolve(response);

					}, err => {
						reject(err)

					})
			})
		}

		/**
		 * 封装get方法
		 * @param url
		 * @param data
		 * @returns {Promise}
		*/

		Vue.prototype.get = function (url, params = {}) {
			return new Promise((resolve, reject) => {
				axios.get(url, {
					params: params
				}).then(response => {
					resolve(response.data.datas);
				}).catch(err => {
					reject(err)
				})
			})
		}

		/**
		 * 封装put方法
		 * @param url
		 * @param data
		 * @returns {Promise}
		*/

		Vue.prototype.put = function (url, data = {}) {
			return new Promise((resolve, reject) => {
				axios.put(url, data)
					.then(response => {
						resolve(response);

					}, err => {
						reject(err)

					})
			})
		}

		/**
		 * 封装微信分享
		*/

		Vue.prototype.SDKRegister = (that, callback) => {
			setTimeout(() => {
				Vue.use(WechatPlugin) //  微信
				let openid=localStorage.getItem('openid')
				let url =  window.location.href
				that.axios.get('/wechat/token', {
					params: {
						url: url
					}
				}).then(res => {// 获得签名配置
					var Data = res.data.datas;
					// config信息验证后会执行ready方法，所有接口调用都必须在config接口获得结果之后，config是一个客户端的异步操作，
					that.$wechat.config({
						debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
						appId: 'wx246a6ae36dab8bd5',   // 必填，公众号的唯一标识
						timestamp: Data.timestamp, // 必填，生成签名的时间戳
						nonceStr: Data.digit,   // 必填，生成签名的随机串
						signature: Data.signature, // 必填，签名，见附录1
						jsApiList: ['onMenuShareAppMessage', 'onMenuShareTimeline'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
					})
				})

				that.$wechat.ready(() => {
					// 所以如果需要在页面加载时就调用相关接口，则须把相关接口放在ready函数中调用来确保正确执行。对于用户触发时才调用的接口，
					// 则可以直接调用，不需要放在ready函数中。
					that.link = that.shareUrl
					// console.log(that.link)
					var wxtitle = '您的好友邀您加入亿货惠！' // 标题
					var wximg = 'http://yhhapi.anasit.com/upload/e0b69b5cfc2dc5c90cc5a2068c98bb68.jpg'
					var wxlink = that.link
					var wxdesc = '帮买家得折扣赢福利，帮商家销产品引客流' // 描述(分享给微信/QQ好友/微博时显示)
					that.$wechat.onMenuShareAppMessage({ // 分享给朋友
						title: wxtitle, // 分享标题
						desc: wxdesc,   // 分享描述
						link: wxlink,
						imgUrl: wximg, // 分享图标
						// 用户确认分享后执行的回调函数
						success: function() {
							Toast({
								message: '恭喜分享成功',
								position: 'middle',
								duration: 2000
							})
						},
						// 用户取消分享后执行的回调函数
						cancel: function() {
							Toast({
								message: '分享到朋友取消',
								position: 'middle',
								duration: 2000
							})
						}
					});
					//分享到朋友圈
					that.$wechat.onMenuShareTimeline({
						title: wxtitle, // 分享标题
						desc: wxdesc,   // 分享描述
						link: wxlink,
						// link: that.link,   // 分享链接
						imgUrl: wximg, // 分享图标
						// 用户确认分享后执行的回调函数
						success: function() {
							Toast({
								message: '分享到朋友圈成功',
								position: 'middle',
								duration: 2000
							})
						},
						// 用户取消分享后执行的回调函数
						cancel: function() {
							Toast({
								message: '分享到朋友圈取消',
								position: 'middle',
								duration: 2000
							})
						}
					});
				})
			},1000);
			
		};

		//     Vue.http.interceptors.push(function ( request, next ) {      //附赠一个可以控制页面所有路由开始之前结束之后的方法  
		//     // 请求发送前的处理逻辑  
		// //                  console.log(request)  
		// //                  console.log(next)  
		//             next(function (response) {     
		//                 // 请求发送后的处理逻辑  
		//                 // 更具请求的状态， response参数会返回给 successCallback或errorCallback  
		// //                  console.log(response.data.result)  
		//                     if(response.data.result == undefined){  
		//                         this.$router.push('/')  
		//                     }  
		// //              return response  
		//             });  

		// 	});

	}
}  
