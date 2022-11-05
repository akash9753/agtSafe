import XLSX from 'xlsx';

export function DownloadMappingOperationByTargetDomainasExcel(data, selectedDomain) {  
    const wb = new Workbook();
    var mainTable = document.createElement('table');
    var tbdy = document.createElement('tbody');

    var row1 = document.createElement('tr');
    var col1 = document.createElement('td');
    col1.innerHTML = 'Test001 SDTM Mapping';
    col1.style.backgroundColor = "blue";
    row1.appendChild(col1);
    tbdy.appendChild(row1);

    var row2 = document.createElement('tr');
    var col2 = document.createElement('td');
    col2.style.backgroundColor = "blue";
    col2.innerHTML = 'DM Domain';
    row2.appendChild(col2);
    tbdy.appendChild(row2);

    var row3 = document.createElement('tr');
    var col3 = document.createElement('td');
    col3.innerHTML = 'Version Number: V1.0 (Draft)';
    col3.style.backgroundColor = "blue";
    row3.appendChild(col3);
    tbdy.appendChild(row3);

    var row4 = document.createElement('tr');
    var col4 = document.createElement('td');
    col4.innerHTML = 'Version Date : 22DEC16';
    col4.style.backgroundColor = "blue";
    row4.appendChild(col4);
    tbdy.appendChild(row4);

 

    const headings = ["VARIABLE", "LABEL", "CORE", "TYPE", "LENGTH", "CODELIST", "SOURCE DATA", "S.LABEL", "TRANSFORMATION"];
    var headerRow = document.createElement('tr');
    for (var i = 0; i < headings.length; i++) {
        var tempHead = document.createElement('th');
        tempHead.appendChild(document.createTextNode(headings[i]));
        headerRow.appendChild(tempHead);
    }
    tbdy.appendChild(headerRow);


    mainTable.appendChild(tbdy);

    //const ws = XLSX.utils.json_to_sheet(data);
    var ws = XLSX.utils.table_to_sheet(mainTable);
    //ws.A1.s = {
    //    fill: {
    //        patternType: "solid", bgColor: { rgb: "FF000000" }
    //    },
    //    font: {
    //        sz: "19"
    //    }
    //};
    wb.SheetNames.push(selectedDomain);
    wb.Sheets[selectedDomain] = ws;
    const wbout = XLSX.write(wb, { bookType: 'xlsx', bookSST: false, type: 'binary' });
    let url = window.URL.createObjectURL(new Blob([s2ab(wbout)], { type: 'application/octet-stream' }));
    download(url, 'MappingOperationFor' + selectedDomain + '.xlsx');   

}
export function DownloadasXml(data, fileName) {

    let url = window.URL.createObjectURL(new Blob([s2ab(data)], { type: 'application/xml;charset=utf-8' }));
    download(url, 'MappingXml_' + fileName + '.xml');

}


export function DownloadasXlsx(data, fileName) {

    let url = window.URL.createObjectURL(new Blob([s2ab(data)], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet6'
    }
    ));
    download(url, 'MappingXml_' + fileName + '.xlsx');

}

export function DownloadasText(data, fileName) {

    let url = window.URL.createObjectURL(new Blob([s2ab(data)], { type: 'text/plain' }));
    download(url, 'MappingProgram_' + fileName + '.txt');

}


export function DownloadasSas(data, fileName) {

    let url = window.URL.createObjectURL(new Blob([s2ab(data)], { type: 'application/x-sas' }));
    download(url, 'MappingProgram_' + fileName + '.sas');

}

export function DownloadMappingOperationByStudyIDasExcel(data) {
       const wb = new Workbook();
    let datas = [], dataList = [], ws;
        data.map(item => {
            let flag = true;
            datas.push(item);
            //to get all Datas of same Domain
            dataList.map(items => {
                if (items.Target.split(".")[0] == item.Target.split(".")[0]) {
                    datas.push(items);
                }
            });
            //
            ws = XLSX.utils.json_to_sheet(datas);
            if (wb.SheetNames.length > 0) {
                wb.SheetNames.map(option => {
                    if (option == item.Target.split(".")[0]) {
                        flag = false;
                    }
                });
                if (flag) {
                    wb.SheetNames.push(item.Target.split(".")[0]);
                }
            } else {
                wb.SheetNames.push(item.Target.split(".")[0]);
            }
            wb.Sheets[item.Target.split(".")[0]] = ws;
            dataList.push(item);
            datas = [];
        });
        const wbout = XLSX.write(wb, { bookType: 'xlsx', bookSST: true, type: 'binary' });
        let url = window.URL.createObjectURL(new Blob([s2ab(wbout)], { type: 'application/octet-stream' }));
        download(url, 'MappingOperation.xlsx');    
}
function Workbook() {
    if (!(this instanceof Workbook))
        return new Workbook();
    this.SheetNames = [];
    this.Sheets = {};
}

const download = (url, name) => {
    let a = document.createElement('a');
    a.href = url;
    a.download = name;
    a.click();
    window.URL.revokeObjectURL(url);
}

function s2ab(s) {
    const buf = new ArrayBuffer(s.length)

    const view = new Uint8Array(buf)

    for (let i = 0; i !== s.length; ++i)
        view[i] = s.charCodeAt(i) & 0xFF

    return buf
}

