/**
 * 关闭蒙版说明
 */
(function() {
  var understand = document.querySelector(".understand");
  var close = document.querySelector(".close");
  var closeMask = function() {
    var mask = document.querySelector(".mask-wrapper");
    mask.style.display = "none";
  };
  understand.onclick = close.onclick = closeMask;
})();

/**
 * 游戏操作代码
 */


/**
 * 5.1、实例化、初始化游戏角色
 */
var imgSrc = "./assets/images/peiqi2.jpg";
var peggy = new Character(imgSrc);
var scene = document.querySelector(".scene-wrapper");
peggy.init(scene);

//5.2、按钮操作
var startBtn = document.querySelector(".start");
var turnLeft = document.querySelector(".turnLeft");
var turnRight = document.querySelector(".turnRight");

//5.3、开始游戏
startBtn.onclick = function() {
  this.disabled = true;
  this.innerHTML = "已开始";
  this.style.backgroundColor = "red";
  gameRules.isStart = true; //设置游戏开始标志为true
  var trafficLight = new TrafficLight(); //实例化交通灯
  trafficLight.init(gameRules, peggy.$elem); //初始化交通灯
};

//5.4、按钮操作控制
turnLeft.onclick = function() {
  peggy.goLeft(gameRules);
};

turnRight.onclick = function() {
  peggy.goRight(gameRules);
};

/**
 * 6.1、键盘操作控制
 */
document.onkeydown = function(e) {
  var keyCode = e.keyCode;
  var instruct = makeInstruct(peggy, instruction[keyCode]);
  if (instruct) {
    instruct.call(peggy, gameRules); //将生成的指令运行
  } else {
    return;
  }
};
