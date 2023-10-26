import React from 'react'
import { Button, Image } from '@mantine/core'
import { jsPDF } from "jspdf";
// import { saveAs } from 'file-saver';
import htmlDocx from 'html-docx-js/dist/html-docx';
// import mammoth from 'mammoth'
// import { render, Document, Text } from 'redocx'

export default function GenerateExport({props}) {

    async function downloadPDF() {
        const doc = new jsPDF({
			format: 'a4',
			unit: 'px',
		});

        doc.html(props.docContent, {
            async callback(doc) {
                await doc.save('pdf_name');
            },
            x: 10,
            y: 10,
            margin: [10, 10, 10, 10],
            width: 100,
        });
    }

    async function downloadWordDoc() {
        console.log(props.docContent);
        var header = "<html xmlns:o='urn:schemas-microsoft-com:office:office' "+
            "xmlns:w='urn:schemas-microsoft-com:office:word' "+
            "xmlns='http://www.w3.org/TR/REC-html40'>"+
            "<head><meta charset='utf-8'><title>Export HTML to Word Document with JavaScript</title></head><body>";
        var footer = "</body></html>";
        var sourceHTML = header+props.docContent+footer;
        
        var source = 'data:application/vnd.ms-word;charset=utf-8,' + encodeURIComponent(sourceHTML);
        var fileDownload = document.createElement("a");
        document.body.appendChild(fileDownload);
        fileDownload.href = source;
        fileDownload.download = 'document.doc';
        fileDownload.click();
        document.body.removeChild(fileDownload);
    }

    async function downloadWordDocx() {
        // mammoth.convertToHtml({ value: props.docContent })
        // .then((result) => {
        //     const { value } = result;
        //     const blob = new Blob([value], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
        //     const url = window.URL.createObjectURL(blob);

        //     const a = document.createElement('a');
        //     a.href = url;
        //     a.download = 'document.docx';
        //     a.click();
        //     })
        // .catch((error) => {
        // console.error('Error converting HTML to .docx:', error);
        // });
        const blob = htmlDocx.asBlob(props.docContent);
        const url = window.URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = 'document.docx';
        a.click();
    }

    return (
        <div style={{display: 'flex', alignItems: 'flex-start', justifyContent: 'center', flexDirection: 'column'}}>
            <div style={{marginBottom: '1rem'}}>
                {/* <img
                    src="/pdf.png"
                    resizable
                    style={{height: '50px', width: '50px'}}
                /> */}
                <Button onClick={downloadPDF}>Download PDF</Button>
            </div>
            <div>
                {/* <img
                    src="/word.png"
                    resizable
                    style={{height: '50px', width: '50px'}}
                /> */}
                <Button onClick={downloadWordDocx}>Download Word Document</Button>
            </div>
        </div>
    )
}
