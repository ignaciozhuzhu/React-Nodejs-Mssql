var fun = require('../post_yy');

/*console.time('8 thread');
var numThreads = 8; //创建线程池，最大数为8
/*fun.getReservation(60, 80)
fun.getReservation(80, 100)
fun.getReservation(100, 120)
*/
/*var threadPool = require('tagg').createPool(numThreads).all.eval(fibo); //为线程池注册程序
var i = 8;
var cb = function(err, data) { //注册线程执行完毕的回调函数
	console.log(data);
	if (!--i) {
		threadPool.destroy();
		console.timeEnd('8 thread');
	}
}
threadPool.any.eval('fun.getReservation(100, 140)', cb); //开始向线程池中执行fibo(40)这个任务*/
//加载tagg2的模块
var tagg = require('tagg2');

//子线程工作函数
var th_func = function() {
	var fibo = function fibo(n) {
		return n > 1 ? fibo(n - 1) + fibo(n - 2) : 1;
	}
	thread.end(fibo(40));
}

//创建子线程,并且注册回调
var thread = tagg.create(th_func, function(err, res) {
	if (err) throw new(err); //如果在线程中throw异常，err就会得到相应的错误
	console.log(res); //fibo(40)的结果
	thread.destroy(); //摧毁线程
});