/**
 * 1.1、定义游戏规则及边界处理对象gameRules(游戏监控中心,统一管理游戏状态)
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
  //角色运动后，判断是否安全操作
  isSecurity: function() {
    if (!this.isSafe) {
      alert("绿灯未亮，禁止通行");
      this.subtract();
      return false;
    } else {
      return true;
    }
  }
};
