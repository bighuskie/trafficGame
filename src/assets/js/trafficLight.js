/**
 * 3.1、红绿灯对象构造函数
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
