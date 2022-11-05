export function errorMessageTooltip(props) {
        var errDivList = props.form.getFieldsError();
        for (var i = 0; i < Object.keys(errDivList).length; i++) {
            if (errDivList[Object.keys(errDivList)[i]] !== undefined) {
                var errLabel = window.$('label[for=' + Object.keys(errDivList)[i] + ']');
                var errLabelParentDivOffSetWidth = errLabel[errLabel.length - 1].parentElement.offsetWidth;
                var errorMsgDivWidth = errLabelParentDivOffSetWidth - errLabel[errLabel.length - 1].offsetWidth;
                var errDiv = errLabel[errLabel.length - 1].parentElement.nextElementSibling.children[0].getElementsByClassName("ant-form-explain")[0];
                errDiv.style.width = (errorMsgDivWidth.toString() - "15").toString() + "px";
                errDiv.addEventListener("mouseover", fnToAddErrTooltip);
                errDiv.addEventListener("mouseout", fnToHideErrTooltip);
            }
        }
}

function fnToAddErrTooltip (e) {
    if (e.target.offsetWidth !== e.target.scrollWidth && e.target.className === "ant-form-explain") {
        var getPositon = e.target.getBoundingClientRect();
        if (e.target.nextElementSibling == undefined) {
            var tooltipElem = document.createElement("div");
            tooltipElem.textContent = e.target.textContent;
            tooltipElem.className = 'errorMsgTooltip';
            tooltipElem.style.top = getPositon.top - tooltipElem.clientHeight + 'px';
            tooltipElem.style.left = getPositon.left + 'px';
            e.target.insertAdjacentElement('afterend', tooltipElem);
        } else {
            e.target.nextElementSibling.textContent = e.target.textContent;
            e.target.nextElementSibling.className = 'errorMsgTooltip';
            e.target.nextElementSibling.style.top = getPositon.top - e.target.nextElementSibling.clientHeight - 4 + 'px';
            e.target.nextElementSibling.style.left = getPositon.left + 'px';
        }
    }
}

function fnToHideErrTooltip (e) {
    if (e.target.offsetWidth !== e.target.scrollWidth && e.target.className === "ant-form-explain") {
        if (e.target.nextElementSibling) {
            e.target.nextElementSibling.classList.remove('errorMsgTooltip');
            e.target.nextElementSibling.textContent = '';
        }
    }
}