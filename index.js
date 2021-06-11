class Panel {
    constructor(panelName, htmlPath) {
        this.panelName = panelName;
        this.path = htmlPath;
        this.lastY = 0;
        this.onPanel = true;
        this.topElement = null;
        this.panelElement = null;
        this.setting();
    }

    setting = () => {
        this.makePanel();
        this.setEvent();
        this.setTouchEvent();
    }

    setEvent = () => {
        this.topElement.childNodes[1].addEventListener('click',(e)=>{this.hidePanel()});
        this.topElement.childNodes[3].addEventListener('transitionend', (e)=>{this.transitionEnd(e)});
        this.topElement.childNodes[3].addEventListener('transitionstart', (e)=>{this.transitionStart(e)});
    };

    setTouchEvent = () => {
        this.topElement.childNodes[3].childNodes[1].addEventListener("touchstart", (e) =>{this.handleStart(e);});
        this.topElement.childNodes[3].childNodes[1].addEventListener("touchend", (e) =>{this.handleEnd(e);});
        this.topElement.childNodes[3].childNodes[1].addEventListener("touchmove", (e) =>{this.handleMove(e);});
    }


    makePanel = () => {
        document.querySelector('body').innerHTML +=`
                       <div data-status="0" class=${this.panelName} style="position: absolute; bottom: 0">
                          <div class="${this.panelName}-mask" style="position: fixed; top: 0; display: none; width: 100vw; height: 100vh; background-color: grey; opacity: 0.4;"></div>
                          <div class="${this.panelName}-panel" style="position: fixed; width: 100vw; height: 61.646875vh; background-color: white; transform: translate(0%, 0%); transition: all ease-in-out 0.3s 0s;">
                              <div class="${this.panelName}-drag-bar" style="width: 100vw; height: 34px; background-color: grey"></div>
                              <div class="${this.panelName}-html"></div>
                          </div>
                        </div>`;
        this.topElement = document.querySelector(`.${this.panelName}`);
        this.panelElement = $(`.${this.panelName}-panel`);
    }

    hidePanel = () => {
        // document.querySelector(`.${this.panelName}`).childNodes[1].style.display = 'none';
        // document.querySelector(`.${this.panelName}`).childNodes[3].style.transform = 'translate(0%, 0%)';
        // document.querySelector(`.${this.panelName}`).dataset.status = '0';

        this.topElement.childNodes[1].style.display = 'none';
        this.topElement.childNodes[3].style.transform = 'translate(0%, 0%)';
        this.topElement.dataset.status = '0';
    }

    showPanel = () => {
        // document.querySelector(`.${this.panelName}`).childNodes[1].style.display = 'block';
        // document.querySelector(`.${this.panelName}`).childNodes[3].style.transform = 'translate(0%, -100%)';
        // document.querySelector(`.${this.panelName}`).dataset.status = '1';
        this.topElement.childNodes[1].style.display = 'block';
        this.topElement.childNodes[3].style.transform = 'translate(0%, -100%)';
        this.topElement.dataset.status = '1';
    };

    handleStart = (e) => {
        e.preventDefault();
        document.querySelector('body').style.overflow = 'hidden';
        this.topElement.childNodes[3].style.transition = '';
        this.lastY = e.touches[0].screenY;
    }

    handleMove = (e) => {
        e.preventDefault();

        let panelTranslateY = Number(this.panelElement.css('transform').split(',')[5].slice(0, -1));
        let deltaY = Number((this.lastY - e.touches[0].screenY).toFixed(3));

        if(this.onPanel === false){
            if(panelTranslateY >= 0 || panelTranslateY <= this.panelElement.height()){
                this.onPanel = true;
            }
            return;
        }

        if(this.panelElement.height() < - panelTranslateY + deltaY && this.onPanel === true){
            this.topElement.childNodes[3].style.transform = 'translate(0%, -100%)';
            this.onPanel = false;
            return;
        }

        if(0 > - panelTranslateY + deltaY && this.onPanel === true){
            this.topElement.childNodes[3].style.transform = 'translate(0%, 0%)';
            this.onPanel = false;
            return;
        }

        e.target.parentNode.style.transform = `translate(0%, ${panelTranslateY - deltaY}px)`;
        this.lastY = e.touches[0].screenY;
    }

    handleEnd = (e) => {
        e.preventDefault();
        this.onPanel = true;
        document.querySelector('body').style.overflow = 'auto';
        e.target.parentNode.style.transition = 'all ease-in-out 0.3s 0s';

        let panelTranslateY = Number(this.panelElement.css('transform').split(',')[5].slice(0, -1));

        if(- panelTranslateY > this.panelElement.height() * 7 / 10){
            this.showPanel();
        }else {
            this.hidePanel();
        }
    }

    appendHTML = () => {
        $(`.${this.panelName}-html`).load(this.path);
    }

    appendDragBarHTML = (element) => {
        $(`.${this.panelName}-drag-bar`).empty();
        $(`.${this.panelName}-drag-bar`).append(element);
    }

    transitionEnd(e) {
        switch (e.target.parentNode.dataset.status) {
            case '0': this.afterHide();
                break;
            case '1': this.afterShow();
                break;
            default:
                break;
        }
    }

    transitionStart(e) {
        switch (e.target.parentNode.dataset.status) {
            case '0': this.beforeHide();
                break;
            case '1': this.beforeShow();
                break;
            default:
                break;
        }
    }
    beforeShow = () => {}
    beforeHide = () => {}
    afterShow = () => {}
    afterHide = () => {}
}

let panel = new Panel('purchase', './product-purchase.html');
panel.appendHTML();

let panel1 = new Panel('purchase1', './product.html');
panel1.appendHTML();


document.querySelector('.button-1').addEventListener('click', ()=>{console.log(panel.topElement);panel.showPanel()}, false);
document.querySelector('.button-2').addEventListener('click', ()=>{panel1.showPanel()}, false);