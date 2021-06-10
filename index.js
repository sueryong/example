class Panel {
    constructor(name, htmlPath) {
        this.panelName = name;
        this.path = htmlPath;
        this.lastY = 0;
        this.onPanel = true;
        this.topElement = null;
        this.panelElement = null;
        this.setting();
    }

    setting () {
        this.makePanel();
        this.setEvent();
        this.setTouchEvent();
        this.appendHTML();
    }

    setEvent () {
        this.topElement.childNodes[1].addEventListener('click',(e)=>{this.hidePanel(e, this)});
        this.topElement.childNodes[3].addEventListener('transitionend', (e)=>{this.transitionEnd(e, this)});
        this.topElement.childNodes[3].addEventListener('transitionstart', (e)=>{this.transitionStart(e, this)});
    }

    makePanel () {
        document.querySelector('body').innerHTML +=`
                       <div data-status="0" class=${this.panelName}>
                          <div class="${this.panelName}-mask" style="position: absolute; display: none; width: 100vw; height: 100vh; background-color: grey; opacity: 0.4; top: 0"></div>
                          <div class="${this.panelName}-panel" style="position: fixed; width: 100vw; height: 61.646875vh; background-color: white; transform: translate(0%, 0%); transition: all ease-in-out 0.3s 0s;">
                              <div class="${this.panelName}-drag-bar" style="width: 100vw; height: 34px; background-color: grey"></div>
                              <div class="${this.panelName}-html"></div>
                          </div>
                        </div>`;
        this.topElement = document.querySelector(`.${this.panelName}`);
        this.panelElement = $(`.${this.panelName}-panel`);
    }

    hidePanel (e, panel) {
        if(e === undefined){
            this.topElement.childNodes[3].style.transform = 'translate(0%, 0%)';
            this.topElement.childNodes[1].style.display = 'none';
            this.topElement.dataset.status = '0';
        }else {
            e.preventDefault();
            panel.topElement.childNodes[3].style.transform = 'translate(0%, 0%)';
            panel.topElement.childNodes[1].style.display = 'none';
            panel.topElement.dataset.status = '0';
        }
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
        panel.lastY = e.touches[0].screenY;
    }

    handleMove (e, panel) {
        e.preventDefault();

        let panelTranslateY = Number(panel.panelElement.css('transform').split(',')[5].slice(0, -1));
        let deltaY = Number((panel.lastY - e.touches[0].screenY).toFixed(3));

        if(panel.onPanel === false){
            if(panelTranslateY >= 0 || panelTranslateY <= panel.panelElement.height()){
                panel.onPanel = true;
            }
            return;
        }

        if(panel.panelElement.height() < - panelTranslateY + deltaY && panel.onPanel === true){
            panel.topElement.childNodes[3].style.transform = 'translate(0%, -100%)';
            panel.onPanel = false;
            return;
        }

        if(0 > - panelTranslateY + deltaY && panel.onPanel === true){
            panel.topElement.childNodes[3].style.transform = 'translate(0%, 0%)';
            panel.onPanel = false;
            return;
        }

        e.target.parentNode.style.transform = `translate(0%, ${panelTranslateY - deltaY}px)`;
        panel.lastY = e.touches[0].screenY;
    }

    handleEnd (e, panel) {
        e.preventDefault();
        panel.onPanel = true;
        document.querySelector('body').style.overflow = 'auto';
        e.target.parentNode.style.transition = 'all ease-in-out 0.3s 0s';

        let panelTranslateY = Number(panel.panelElement.css('transform').split(',')[5].slice(0, -1));

        if(- panelTranslateY > panel.panelElement.height() * 7 / 10){
            panel.showPanel();
        }else {
            panel.hidePanel(e, panel);
        }
    }

    appendHTML () {
        $(`.${this.panelName}-html`).load(this.path);
    }

    appendDragBar (element) {
        $(`.${this.panelName}-drag-bar`).empty();
        $(`.${this.panelName}-drag-bar`).append(element);
    }

    transitionEnd (e, panel) {
        switch (e.target.parentNode.dataset.status) {
            case '0': panel.afterHide();
                break;
            case '1': panel.afterShow();
                break;
            default:
                break;
        }
    }

    transitionStart (e, panel) {
        switch (e.target.parentNode.dataset.status) {
            case '0': panel.beforeHide();
                break;
            case '1': panel.beforeShow();
                break;
            default:
                break;
        }
    }
    beforeShow () {}
    beforeHide () {}
    afterShow () {}
    afterHide () {}
}

let panel = new Panel('purchase', './product-purchase.html');
