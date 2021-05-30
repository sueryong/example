class Panel {
  constructor(name) {
      this.panelName = name;
      this.lastX = 0;
      this.lastY = 0;
      this.panelElement = null;
      this.panelquery = null;
      this.setting();
  }

  setting () {
      this.makePanel();
      this.setEvent();
      this.setTouchEvent();
  }
  setEvent () {
      this.panelElement.childNodes[1].addEventListener('click', this.hidePanel);
  }
  makePanel () {
      document.querySelector('body').innerHTML +=`
                       <div data-status="0" class=${this.panelName}>
                          <div class="mask" style="position: absolute; display: none; width: 100vw;height: 100vh; background-color: purple; opacity: 0.4; top: 0"></div>
                          <div class="panel" style="position: fixed; width: 100vw; height: 50vh; background-color: cornflowerblue; transform: translate(0%, 0%); transition: all ease-in-out 0.3s 0s;">
                              <div class="drag-bar" style="width: 100%; height: 50px; background-color: black"></div>
                          </div>
                        </div>`;
      this.panelElement = document.querySelector(`.${this.panelName}`);
      this.panelquery = $('.panel');
  }
  hidePanel (e) {
      e.target.parentNode.childNodes[3].style.transform = 'translate(0%, 0%)';
      e.target.style.display = 'none';
      e.target.parentNode.dataset.status = '0';
  }

  showPanel () {
      this.panelElement.childNodes[3].style.transform = 'translate(0%, -100%)';
      this.panelElement.childNodes[1].style.display = 'block';
      this.panelElement.dataset.status = '1';
  }

  setTouchEvent () {
      this.panelElement.childNodes[3].childNodes[1].addEventListener("touchstart", this.handleStart, false);
      this.panelElement.childNodes[3].childNodes[1].addEventListener("touchend", this.handleEnd, false);
      this.panelElement.childNodes[3].childNodes[1].addEventListener("touchcancel", this.handleCancel, false);
      this.panelElement.childNodes[3].childNodes[1].addEventListener("touchmove", this.handleMove, false);
  }

  handleStart (e) {
      document.querySelector('body').style.overflow = 'hidden';
      this.lastY = e.touches[0].screenY;
      console.log('start');
  }
  handleEnd (e) {
      document.querySelector('body').style.overflow = 'auto';
      console.log('end');
  }
  handleCancel () {
      console.log('cancel');
  }
  handleMove (e) {
      let deltaY = Math.round(this.lastY - e.touches[0].screenY);
      console.log($('.panel').css('transform'));
      let panelTranslateY = parseInt($('.panel').css('transform').split(',')[5].slice(0, -1));


      e.target.parentNode.style.transform = `matrix(1, 0, 0, 1, 0, ${panelTranslateY - deltaY})`;
      // console.log(e.target.parentNode.style.transform );

      this.lastY = e.touches[0].screenY;
  }

}

let panel = new Panel('purchase');
