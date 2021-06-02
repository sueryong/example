class Panel {
    lastY = 0;
    onPanel = false;

  constructor(name, htmlPath) {
      this.panelName = name;
      this.path = htmlPath;
      this.lastY = 0;
      this.onPanel = 0;
      this.topElement = null;
      this.setting();
  }

  setting () {
      this.makePanel();
      this.setEvent();
      this.setTouchEvent();
      this.appendHTML();
  }

  setEvent () {
      this.topElement.childNodes[1].addEventListener('click', (e)=>{this.hidePanel(e, this)});
      this.topElement.childNodes[3].addEventListener('transitionend', this.transitionEnd);
      this.topElement.childNodes[3].addEventListener('transitionstart', this.TransitionStart);
  }

  makePanel () {
      document.querySelector('body').innerHTML +=`
                       <div data-status="0" class=${this.panelName}>
                          <div class="mask" style="position: absolute; display: none; width: 100vw; height: 100vh; background-color: grey; opacity: 0.4; top: 0"></div>
                          <div class="panel" style="position: fixed; width: 100vw; height: 50vh; background-color: cornflowerblue; transform: translate(0%, 0%); transition: all ease-in-out 0.3s 0s;">
                              <div class="drag-bar" style="width: 100%; height: 50px; background-color: black"></div>
                              <div class="html"></div>
                          </div>
                        </div>`;
      this.topElement = document.querySelector(`.${this.panelName}`);
  }

  hidePanel (e, panel) {
      e.preventDefault();
      panel.topElement.childNodes[3].style.transform = 'translate(0%, 0%)';
      panel.topElement.childNodes[1].style.display = 'none';
      panel.topElement.dataset.status = '0';
  }

  showPanel () {
      this.topElement.childNodes[3].style.transform = 'translate(0%, -100%)';
      this.topElement.childNodes[1].style.display = 'block';
      this.topElement.dataset.status = '1';
  }

  setTouchEvent () {
      this.topElement.childNodes[3].childNodes[1].addEventListener("touchstart", (e) =>{this.handleStart(e, this);}, false);
      this.topElement.childNodes[3].childNodes[1].addEventListener("touchend", (e) =>{this.handleEnd(e, this);}, false);
      this.topElement.childNodes[3].childNodes[1].addEventListener("touchmove", (e) =>{this.handleMove(e, this);}, false);
  }

  handleStart (e, panel) {
      e.preventDefault();
      document.querySelector('body').style.overflow = 'hidden';
      panel.topElement.childNodes[3].style.transition = '';
  }

  handleEnd (e, panel) {
      e.preventDefault();
      document.querySelector('body').style.overflow = 'auto';
      e.target.parentNode.style.transition = 'all ease-in-out 0.3s 0s';

      let panelTranslateY = Number($('.panel').css('transform').split(',')[5].slice(0, -1));

      if( - panelTranslateY > $('.panel').height() / 3){
          panel.showPanel();
      }else {
          panel.hidePanel(e, panel);
      }
  }

  handleMove (e, panel) {
      e.preventDefault();
      if(panel.onPanel === false){
          console.log(panel.onPanel);
          return;
      }
      let panelTranslateY = Number($('.panel').css('transform').split(',')[5].slice(0, -1));
      let deltaY = Number((panel.lastY - e.touches[0].clientY).toFixed(3));

      if($('.panel').height() < - panelTranslateY + deltaY && this.onPanel === true){
          panel.topElement.childNodes[3].style.transform = 'translate(0%, -100%)';
          panel.onPanel = false;
          panel.lastY = $('.panel').height();
          return;
      }
      if(0 > - panelTranslateY + deltaY && this.onPanel === true){
          panel.onPanel = false;
          panel.lastY = e.touches[0].clientY;
          return;
      }

      e.target.parentNode.style.transform = `translate(0%, ${panelTranslateY - deltaY}px)`;
      panel.lastY = e.touches[0].clientY;
  }
  appendHTML () {
      $('.html').load(this.path);
  }

  transitionEnd () {
      // console.log('transition end');
  }

  TransitionStart () {
      // console.log('transition start');
  }
}

let panel = new Panel('purchase', './product-purchase.html');
