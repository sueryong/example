class Panel {
    constructor(panelName, htmlPath, functions) {
        this.panelName = panelName;
        this.path = htmlPath;
        this.lastY = 0;
        this.onPanel = true;
        this.topElement = null;
        this.panelElement = null;
        this.beforeLoad = functions.beforeLoad;
        this.afterLoad = functions.afterLoad;
        this.beforeShow = functions.beforeShow;
        this.afterShow = functions.afterShow;
        this.beforeHide = functions.beforeHide;
        this.afterHide = functions.afterHide;
        this.setting();
    }

    setting = () => {
        this.makePanel();
        this.setEvent();
        this.setTouchEvent();
        this.appendHTML();
    };

    setEvent = () => {
        this.topElement.childNodes[1].addEventListener('click',(e)=>{this.hidePanel()}, false);
        this.topElement.childNodes[3].addEventListener('transitionend', (e)=>{this.transitionEnd(e)}, false);
        this.topElement.childNodes[3].addEventListener('transitionstart', (e)=>{this.transitionStart(e)}, false);
    };

    setTouchEvent = () => {
        this.topElement.childNodes[3].childNodes[1].addEventListener("touchstart", (e) =>{this.handleStart(e);}, false);
        this.topElement.childNodes[3].childNodes[1].addEventListener("touchend", (e) =>{this.handleEnd(e);}, false);
        this.topElement.childNodes[3].childNodes[1].addEventListener("touchmove", (e) =>{this.handleMove(e);}, false);
    };

    makePanel = () => {
        if(this.beforeLoad !== undefined){
            this.beforeLoad();
        }

        $('body').append(`
                       <div data-status="0" id=${this.panelName} style="position: fixed; bottom: 0; z-index: 10000">
                          <div class="${this.panelName}-mask" style="position: fixed; top: 0; display: none; width: 100vw; height: 100vh; background-color: black; opacity: 0.6;"></div>
                          <div class="${this.panelName}-panel" style="position: fixed; border-top-left-radius: 10px; border-top-right-radius: 10px ; width: 100vw; background-color: white; transform: translate(0%, 0%); transition: all ease-in-out 0.3s 0s;">
                              <div class="${this.panelName}-drag-bar" style="position: relative; width: 100vw; height: 34px;">
                                    <div style="pointer-events: none; position: absolute; top: 50%; left: 50%; transform: translate(-50%,-50%); height: 3px; width: 43px; border: 1px solid #CECECE; border-radius: 10px; background-color: #CECECE"></div>
                              </div>
                              <div class="${this.panelName}-html"></div>
                          </div>
                        </div>`);
        this.topElement = document.querySelector(`#${this.panelName}`);
        this.panelElement = $(`.${this.panelName}-panel`);
    };

    hidePanel = () => {
        this.topElement.childNodes[1].style.display = 'none';
        this.topElement.childNodes[3].style.transform = 'translate(0%, 0%)';
        this.topElement.dataset.status = '0';
    };

    showPanel = () => {
        this.topElement.childNodes[1].style.display = 'block';
        this.topElement.childNodes[3].style.transform = 'translate(0%, -100%)';
        this.topElement.dataset.status = '1';
    };

    handleStart = (e) => {
        e.preventDefault();
        if (e.target !== e.currentTarget) return;
        document.querySelector('body').style.overflow = 'hidden';
        this.topElement.childNodes[3].style.transition = '';
        this.lastY = e.touches[0].pageY;
    };

    handleMove = (e) => {
        e.preventDefault();
        if (e.target !== e.currentTarget) return;
        let panelTranslateY = Number(this.panelElement.css('transform').split(',')[5].slice(0, -1));
        let deltaY = Number((this.lastY - e.touches[0].pageY).toFixed(3));

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
        this.lastY = e.touches[0].pageY;
    };

    handleEnd = (e) => {
        e.preventDefault();
        if (e.target !== e.currentTarget) return;
        this.onPanel = true;
        document.querySelector('body').style.overflow = 'auto';
        e.target.parentNode.style.transition = 'all ease-in-out 0.3s 0s';

        let panelTranslateY = Number(this.panelElement.css('transform').split(',')[5].slice(0, -1));

        if(- panelTranslateY > this.panelElement.height() * 7 / 10){
            this.showPanel();
        }else {
            this.hidePanel();
        }
    };

    appendHTML = (element) => {
        if(element === undefined){
            $(`.${this.panelName}-html`).load(this.path, ()=> {
                if(this.afterLoad !== undefined){
                    this.afterLoad();
                }
            });
        }else {
            $(`.${this.panelName}-html`).empty();
            $(`.${this.panelName}-html`).append(element);
            if(this.afterLoad !== undefined){
                this.afterLoad();
            }
        }
    };

    appendDragBarHTML = (element) => {
        $(`.${this.panelName}-drag-bar`).empty();
        $(`.${this.panelName}-drag-bar`).append(element);
    };

    transitionEnd = () => {
        switch (this.topElement.dataset.status) {
            case '0':
                if(this.afterHide !== undefined){
                    this.afterHide();
                }
                break;
            case '1':
                if(this.afterShow !== undefined){
                    this.afterShow();
                }
                break;
            default:
                break;
        }
    };

    transitionStart = () => {
        switch (this.topElement.dataset.status) {
            case '0':
                if(this.beforeHide !== undefined){
                    this.beforeHide();
                }
                break;
            case '1':
                if(this.beforeShow !== undefined){
                    this.beforeShow();
                }
                break;
            default:
                break;
        }
    };
}