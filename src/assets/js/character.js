/**
 * 2.1、游戏角色对象构造函数Character
 */
(function(window) {
  function Character(imgSrc) {
    this.$elem = document.createElement("img");
    this.imgSrc = imgSrc;
  }
  //2.2、角色向左运动函数
  Character.prototype.goLeft = function(gameRules) {
    if (this.$elem.offsetLeft <= 80 || gameRules.isStart == false) {
      return;
    }
    this.$elem.src = "./assets/images/peiqi2.jpg";
    this.$elem.style.left = this.$elem.offsetLeft - 30 + "px";
    //角色行动后，监控是否安全操作
    var securityFlag = gameRules.isSecurity();
    if (securityFlag) {
      gameRules.isMove = true;
    } else {
      this.$elem.style.left = "800px";
    }
  };

  //2.3、角色向右函数
  Character.prototype.goRight = function(gameRules) {
    if (this.$elem.offsetLeft >= 800 || gameRules.isStart == false) {
      return;
    }
    this.$elem.src = "./assets/images/peiqi3.jpg";
    this.$elem.style.left = this.$elem.offsetLeft + 30 + "px";
    //角色行动后，监控是否安全操作
    var securityFlag = gameRules.isSecurity();
    if (securityFlag) {
      gameRules.isMove = true;
    } else {
      this.$elem.style.left = "800px";
    }
  };

  //2.4、初始化角色函数
  Character.prototype.init = function(scene) {
    this.$elem.src = this.imgSrc;
    this.$elem.className = "role";
    scene.appendChild(this.$elem);
  };
  //暴露构造函数给window
  window.Character = Character;
})(window);

/**
 * 3.1、定义角色行动指令集instruction
 */
var instruction = {
  "37": "goLeft",
  "39": "goRight"
};

// 3.2、生成角色行动指令函数
var makeInstruct = function(receiver, instruct) {
  return receiver[instruct];
};
