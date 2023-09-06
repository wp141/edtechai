import React from 'react'
import { Button } from '@mantine/core'
import { jsPDF } from "jspdf";
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
        
        // render(
        //     (<Document>
        //         <Text>props.docContent</Text>
        //     </Document>),
        //     `${__dirname}/example.docx`
        // )
    }

    return (
        <div>
            <Button onClick={downloadPDF}>Download PDF</Button>
            <Button onClick={downloadWordDoc}>Download Word Document</Button>
        </div>
    )
}
