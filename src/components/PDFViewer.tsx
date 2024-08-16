import React from "react";

type Props = { pdf_url: string };

const PDFViewer = ({ pdf_url }: Props) => {
    return (
        // <iframe
        //     src={`https://docs.google.com/gview?url=${pdf_url}&embedded=true`}
        //     className="w-full h-full"
        // ></iframe>

        <embed
            src={pdf_url}
            type="application/pdf"
            width="100%"
            height="100%"
            title="Embedded PDF Viewer"
        />
    );
};

export default PDFViewer;