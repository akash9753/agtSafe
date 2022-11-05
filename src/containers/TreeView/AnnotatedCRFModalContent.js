//import React, { Component } from 'react';
//import { Document, Page, pdfjs } from 'react-pdf/dist/entry.webpack';
//pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

//const highlightPattern = (text, pattern) => {

//    //const regex = new RegExp(highlightWords.join('|'), 'gi')
//    const splitText = text.split(pattern);

//    if (splitText.length <= 1) {
//        return text;
//    }

//    const matches = text.match(pattern);
//    //const matches = pattern;

//    return splitText.reduce((arr, element, index) => (matches[index] ? [
//        ...arr,
//        element,
//        <mark>
//            {matches[index]}
//        </mark>,
//    ] : [...arr, element]), []);
//};

//export default class AnnotatedCRFModalContent extends Component {
//    constructor(props) {
//        super(props);
//        this.state = {
//            numPages: null,
//            pageNumber: 1,
//            searchText: '',
//        };
//    }
//    componentDidMount() {

//        document.getElementById('pdfContainer').addEventListener('wheel', this.onScrollPDF.bind(this));
//    }

//    //componentWillUnmount() {
//    //    document.getElementById('pdfContainer').removeEventListener('wheel', this.onScrollPDF.bind(this));
//    //}

//    onDocumentLoadSuccess = ({ numPages }) => {
//        this.setState({ numPages });
//    }
//    changePage = (event) => {
//        this.setState({
//            pageNumber: parseInt(event.target.childNodes[0].dataset.pageNumber)
//        });
//    }
//   // makeTextRenderer = searchText => textItem => highlightPattern(textItem.str, searchText);
//    makeTextRenderer(searchText) {
//        return function (textItem) {
//            return highlightPattern(textItem.str, searchText);
//        }
//    }
//    onChange = event => this.setState({ searchText: event.target.value });

//    onScrollPDF = (event) => {
//        var containerHeight = document.getElementById("pdfContainer").getBoundingClientRect().height;
//        var containerMargin = containerHeight / 2;
//        var greaterPage = 0;
//        for (var i = 1; i <= this.state.numPages; i++) {
//            var topPos = document.getElementById("page_" + i).getBoundingClientRect().top;
//            var bottomPos = topPos + document.getElementById("page_" + i).getBoundingClientRect().height;
//            if ((topPos >= 0 && topPos <= containerMargin) || (bottomPos > 0 && bottomPos >= containerMargin && bottomPos <= containerHeight)) {
//                if (i > greaterPage) {
//                    greaterPage = i;
//                }
//            }
//        }
//        if (greaterPage > 0 && this.state.pageNumber != greaterPage) {
//            this.setState({ pageNumber: greaterPage })
//        }
//    }
//    getCurrPagNum = (event) => {
//        const thisObj = this;
//        var page = parseInt(event.target.value);
//        if (page >= 1 && page <= thisObj.state.numPages) {
//            var scrollDiv = document.getElementById('pdfContainer');
//            var topPos = document.getElementById('page_' + page).getBoundingClientRect().top;
//            scrollDiv.scrollTop = topPos;
//            thisObj.setState({
//                pageNumber: page
//            });
//        } else {
//            thisObj.setState({
//                pageNumber: ""
//            });
//        }
//    };
//    render() {
//        const { pageNumber, numPages, searchText } = this.state;
//        var fileName = this.props.fileName;

//        return (
//            <div>
//                <nav style={{ marginBottom: '15px' }}>
//                    <input style={{ width: '60px' }} type="text" id="currPgNum" value={pageNumber} onChange={this.getCurrPagNum} />
//                    <span> / {numPages}</span>
//                    <div style={{ float: 'right' }}>
//                        <label htmlFor="search">Search:</label>
//                        <input type="search" id="search" value={searchText} onChange={this.onChange} />
//                    </div>
//                </nav>
//                <div id="pdfContainer" style={{ height: 'calc(100vh - 120px)', overflow: 'scroll' }}
//                >
//                    <Document file={window.location.origin + '/Annotation/' + fileName} onLoadSuccess={this.onDocumentLoadSuccess} >
//                        {Array.from(new Array(numPages), (el, index) => (
//                            <Page key={`page_${index + 1}`} pageNumber={index + 1} customTextRenderer={this.makeTextRenderer(searchText)} renderInteractiveForms={true} >
//                                <p>Page {index + 1} of {numPages}</p>
//                            </Page>

//                        ))}
//                    </Document>
//                </div>
//            </div>
//        );
//    }
//}