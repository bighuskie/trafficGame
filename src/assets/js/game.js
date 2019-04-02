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
 * 游戏核心代码
 */

/**
 * 1.1、游戏角色构造函数
 */
(function(window) {
  function Character(imgSrc) {
    this.$elem = document.createElement("img");
    this.imgSrc = imgSrc;
  }
  //1.2、角色向左运动函数
  Character.prototype.goLeft = function(gameRules) {
    if (this.$elem.offsetLeft <= 80 || gameRules.isStart == false) {
      return;
    }
    //判断是否安全
    if (gameRules.isSafe) {
      this.$elem.src = "./assets/images/peiqi2.jpg";
      this.$elem.style.left = this.$elem.offsetLeft - 30 + "px";
      gameRules.isMove = true;
    } else {
      gameRules.insecurity();
    }
  };

  //1.3、角色向右函数
  Character.prototype.goRight = function(gameRules) {
    if (this.$elem.offsetLeft >= 800 || gameRules.isStart == false) {
      return;
    }
    //判断是否安全
    if (gameRules.isSafe) {
      this.$elem.src = "./assets/images/peiqi3.jpg";
      this.$elem.style.left = this.$elem.offsetLeft + 30 + "px";
      gameRules.isMove = true;
    } else {
      gameRules.insecurity();
    }
  };

  //1.4、初始化角色函数
  Character.prototype.init = function(scene) {
    this.$elem.src = this.imgSrc;
    this.$elem.className = "role";
    scene.appendChild(this.$elem);
  };
  //暴露构造函数给window
  window.Character = Character;
})(window);

/**
 * 2.1、定义角色指令集
 */
var instruction = {
  "37": "goLeft",
  "39": "goRight"
};

// 2.2生成角色指令

var makeInstruct = function(receiver, instruct) {
  return receiver[instruct];
};

/**
 * 3.1、红绿灯构造函数
 */
(function(window) {
  function TrafficLight() {
    //3.2、红绿灯倒计时
    this.runTimer = function(k) {
      var showTime = document.querySelector(".timer");
      showTime.innerHTML = k;
      var timer = null;
      k--;
      if (k > 0) {
        timer = setTimeout(() => {
          this.runTimer(k);
        }, 1000);
      } else {
        clearInterval(timer);
      }
    };
    //3.3、产生红绿灯状态函数
    this.apromise = function(time, count) {
      return new Promise(resolve => {
        this.runTimer(count);
        setTimeout(resolve, time);
      });
    };
    //3.4、红绿等显示切换
    this.showLight = function(color) {
      let colorEl = document.querySelector("." + color);
      let siblings = colorEl.parentNode.children;
      for (let i = 0; i < siblings.length; i++) {
        siblings[i].style.backgroundColor = "#fff";
      }
      colorEl.style.backgroundColor = color;
    };
  }

  //3.5初始化红绿灯
  TrafficLight.prototype.init = function(gameRules, role) {
    this.apromise(9000, 9)
      .then(() => {
        this.showLight("yellow");
        return this.apromise(9000, 9);
      })
      .then(() => {
        this.showLight("green");
        gameRules.isSafe = true;
        return this.apromise(9000, 9);
      })
      .then(() => {
        this.showLight("red");
        gameRules.isSafe = false;
        if (gameRules.isMove) {
          gameRules.validMove(role);
        }
        this.init(gameRules, role);
      });
  };
  //暴露构造函数给window
  window.TrafficLight = TrafficLight;
})(window);

/**
 * 4.1、定义游戏规则及边界处理
 */
var gameRules = {
  //判断是否开始游戏
  isStart: false,
  //判断是否安全标志
  isSafe: false,
  //判断玩家是否移动人物
  isMove: false,
  //玩家得分
  score: 0,
  //游戏剩余次数
  surplusNum: 3,
  //展示得分的DOM元素
  get scoreEl() {
    return document.querySelector(".sum");
  },
  set scoreEl(dom) {
    this.scoreEl = dom;
  },
  //展示剩余次数的DOM元素
  get surplusEl() {
    return document.querySelector(".surplus");
  },
  set surplusEl(dom) {
    this.surplusEl = dom;
  },
  //展示得分以及剩余次数
  showMsg: function() {
    this.scoreEl.innerHTML = "得分：" + this.score;
    this.surplusNum--;
    this.surplusEl.innerHTML = "剩余次数：" + this.surplusNum;
    if (this.surplusNum <= 0) {
      this.isMove = false;
      if (this.score < 3) {
        alert("很遗憾，你没有成功帮助小佩奇安全过马路，在努力一下吧！");
      } else {
        alert("你成功帮助小佩奇安全过马路，小佩奇想和你做朋友！");
      }
      window.location.reload();
    }
  },
  //减少分数操作
  subtract: function() {
    if (this.score <= 0) {
      this.score = 0;
    } else {
      this.score--;
    }
    this.showMsg();
  },
  //增加分数操作
  add: function() {
    this.score++;
    this.showMsg();
  },
  //每次红灯灯切换时判断角色是否安全通过
  validMove: function(role) {
    if (role.offsetLeft > 80 && role.offsetLeft < 800) {
      alert("未及时通过马路，失败！");
      this.subtract();
      role.style.left = "800px";
      this.isMove = false;
    } else if (role.offsetLeft <= 80 || role.offsetLeft >= 800) {
      alert("安全通过！");
      this.add();
      this.isMove = false;
    }
  },
  //没有在绿灯亮之前开始运动
  insecurity: function() {
    if (!this.isSafe) {
      alert("绿灯未亮，禁止通行");
      this.subtract();
      return;
    }
  }
};

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
