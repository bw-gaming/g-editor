function measureAndNotifyParent() {
    let height = 0;

    document.body.style.margin = '0';
    document.body.style.padding = '0';

    window.parent.postMessage({
        type: 'started'
    }, '*');

    function notifySize() {
        let newHeight = document.body.offsetHeight;

        if (height !== newHeight) {
            height = newHeight;

            if (window.parent) {
                window.parent.postMessage({
                    type: 'resize',
                    height: height
                }, '*');
            }
        }

        window.parent.postMessage({
            type: 'resize',
            height: height
        }, '*');
    }

    notifySize();

    return setInterval(function () {
        notifySize();
    }, 50);
}

export function SquidexPlugin() {
    let initHandler;
    let initCalled = false;
    let contentHandler;
    let content;
    let context;
    let timer;

    function raiseContentChanged() {
        if (contentHandler && content) {
            contentHandler(content);
        }
    }

    function raiseInit() {
        if (initHandler && !initCalled && context) {
            initHandler(context);
            initCalled = true;
        }
    }

    function eventListener(event) {
        if (event.source !== window) {
            let type = event.data.type;

            if (type === 'contentChanged') {
                content = event.data.content;

                raiseContentChanged();
            } else if (type === 'init') {
                context = event.data.context;

                raiseInit();
            }
        }
    }

    window.addEventListener('message', eventListener, false);

    timer = measureAndNotifyParent();

    let editor = {
        /**
         * Get the current value.
         */
        getContext: function () {
            return context;
        },

        /*
         * Notifies the parent to navigate to the path.
         */
        navigate: function (url) {
            if (window.parent) {
                window.parent.postMessage({
                    type: 'navigate',
                    url: url
                }, '*');
            }
        },

        /**
         * Register the init handler.
         */
        onInit: function (callback) {
            initHandler = callback;

            raiseInit();
        },

        /**
         * Register the content changed handler.
         */
        onContentChanged: function (callback) {
            contentHandler = callback;

            raiseContentChanged();
        },

        /**
         * Clean the editor SDK.
         */
        clean: function () {
            if (timer) {
                window.removeEventListener('message', eventListener);

                timer();
            }
        }
    };

    return editor;

}

export default function SquidexFormField() {
    let initHandler;
    let initCalled = false;
    let disabledHandler;
    let disabled = false;
    let valueHandler;
    let value;
    let formValueHandler;
    let formValue;
    let context;
    let timer;

    function raiseDisabled() {
        if (disabledHandler) {
            disabledHandler(disabled);
        }
    }

    function raiseValueChanged() {
        if (valueHandler) {
            valueHandler(value);
        }
    }

    function raiseFormValueChanged() {
        if (formValueHandler && formValue) {
            formValueHandler(formValue);
        }
    }

    function raiseInit() {
        if (initHandler && !initCalled && context) {
            initHandler(context);
            initCalled = true;
        }
    }

    function eventListener(event) {
        if (event.source !== window) {
            let type = event.data.type;

            if (type === 'disabled') {
                if (disabled !== event.data.isDisabled) {
                    disabled = event.data.isDisabled;

                    raiseDisabled();
                }
            } else if (type === 'valueChanged') {
                value = event.data.value;

                raiseValueChanged();
            } else if (type === 'formValueChanged') {
                formValue = event.data.formValue;

                raiseFormValueChanged();
            } else if (type === 'init') {
                context = event.data.context;

                raiseInit();
            }
        }
    }

    window.addEventListener('message', eventListener, false);

    timer = measureAndNotifyParent();

    let editor = {
        /**
         * Get the current value.
         */
        getValue: function () {
            return value;
        },

        /**
         * Get the current value.
         */
        getContext: function () {
            return context;
        },

        /**
         * Get the current form value.
         */
        getFormValue: function () {
            return formValue;
        },

        /**
         * Notifies the control container that the editor has been touched.
         */
        touched: function () {
            if (window.parent) {
                window.parent.postMessage({
                    type: 'touched'
                }, '*');
            }
        },

        /*
         * Notifies the parent to navigate to the path.
         */
        navigate: function (url) {
            if (window.parent) {
                window.parent.postMessage({
                    type: 'navigate',
                    url: url
                }, '*');
            }
        },

        /**
         * Notifies the control container that the value has been changed.
         */
        valueChanged: function (newValue) {
            value = newValue;

            if (window.parent) {
                window.parent.postMessage({
                    type: 'valueChanged',
                    value: newValue
                }, '*');
            }
        },

        /**
         * Register the init handler.
         */
        onInit: function (callback) {
            initHandler = callback;

            raiseInit();
        },

        /**
         * Register the disabled handler.
         */
        onDisabled: function (callback) {
            disabledHandler = callback;

            raiseDisabled();
        },

        /**
         * Register the value changed handler.
         */
        onValueChanged: function (callback) {
            valueHandler = callback;

            raiseValueChanged();
        },

        /**
         * Register the form value changed handler.
         */
        onFormValueChanged: function (callback) {
            formValueHandler = callback;

            raiseFormValueChanged();
        },

        /**
         * Clean the editor SDK.
         */
        clean: function () {
            if (timer) {
                window.removeEventListener('message', eventListener);

                timer = measureAndNotifyParent();
            }
        }
    };

    return editor;
}

