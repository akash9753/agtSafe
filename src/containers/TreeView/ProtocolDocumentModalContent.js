//import React, { Component } from 'react';
////import { Document, Page, pdfjs } from 'react-pdf/dist/entry.webpack';

//const highlightPattern = (text, pattern) => {
//    const splitText = text.split(pattern);

//    if (splitText.length <= 1) {
//        return text;
//    }

//    const matches = text.match(pattern);

//    return splitText.reduce((arr, element, index) => (matches[index] ? [
//        ...arr,
//        element,
//        <mark>
//            {matches[index]}
//        </mark>,
//    ] : [...arr, element]), []);
//};

//export default class ProtocolDocumentModalContent extends Component {
//    constructor(props) {
//        super(props);
//        this.state = {
//            numPages: null,
//            pageNumber: 1,
//            searchText: ''
//        };
//    }
//    onDocumentLoadSuccess = ({ numPages }) => {
//        this.setState({ numPages });
//    }    
//    changePage = (offset) => {
//        const thisObj = this;
//        thisObj.setState({
//            pageNumber: thisObj.state.pageNumber + offset
//        });
//    }
//    previousPage = () => this.changePage(-1);
//    nextPage = () => this.changePage(1);
//    makeTextRenderer = searchText => textItem => highlightPattern(textItem.str, searchText);

//    onChange = event => this.setState({ searchText: event.target.value });
//    getCurrPagNum = (e) => {
//        const thisObj = this;
//        var page = parseInt(e.target.value);
//        if (page >= 1 && page <= thisObj.state.numPages) {
//            thisObj.setState({
//                pageNumber: page
//            });
//        } else {
//            thisObj.setState({
//                pageNumber: ""
//            });
//        }
//    }

//    render() {
//        const { pageNumber, numPages, searchText } = this.state;
//        var fileName = this.props.fileName;
        
//        return (
//            <div>
//                <nav style={{ marginBottom: '15px' }}>
//                    <button style={{ marginRight: '10px' }} disabled={pageNumber <= 1} onClick={this.previousPage} >
//                        <i className="fas fa-step-backward" ></i>
//                    </button>
//                    <button style={{ marginRight: '10px' }} disabled={pageNumber >= numPages} onClick={this.nextPage} >
//                        <i className="fas fa-step-forward" ></i>
//                    </button>
//                    <input style={{ width: '60px' }} type="text" id="currPgNum" value={pageNumber} onChange={this.getCurrPagNum} />
//                    <span> / {numPages}</span>
//                    <div style={{float: 'right'}}>
//                        <label htmlFor="search">Search:</label>
//                        <input type="search" id="search" value={searchText} onChange={this.onChange} />
//                    </div>
//                </nav>    
//                    <Document
//                        file={window.location.origin + '/Annotation/' + fileName} onLoadSuccess={this.onDocumentLoadSuccess} renderInteractiveForms={true}>
//                    <div style={{ height: 'calc(100vh - 205px)', overflow: 'auto' }}>    
//                        <Page pageNumber={pageNumber} customTextRenderer={this.makeTextRenderer(searchText)} />
//                    </div>
//                   </Document>                    
                
//                <p>
//                    Page {pageNumber || (numPages ? 1 : '--')} of {numPages || '--'}
//                </p>
//            </div>
//        );

//    }
//}