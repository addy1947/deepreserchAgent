import { jsPDF } from 'jspdf';

interface GeneratePdfParams {
    text: string;
    filename?: string;
}

export const generatePdf = async ({ text, filename = 'document.pdf' }: GeneratePdfParams): Promise<{ success: boolean; message: string }> => {
    // Ensure this runs only in the browser
    if (typeof window === 'undefined') {
        return { success: false, message: "PDF generation can only be performed in the browser." };
    }

    try {
        const doc = new jsPDF();

        doc.setFontSize(12);

        // Split text to fit page width
        const splitText = doc.splitTextToSize(text, 180); // 180mm width (A4 is 210mm, with 15mm margins left/right)

        const pageHeight = doc.internal.pageSize.height;
        const margin = 15;
        const lineHeight = 6;
        let cursorY = margin;

        for (let i = 0; i < splitText.length; i++) {
            // Check if we need a new page
            if (cursorY + lineHeight > pageHeight - margin) {
                doc.addPage();
                cursorY = margin;
            }

            doc.text(splitText[i], margin, cursorY);
            cursorY += lineHeight;
        }

        doc.save(filename);

        return { success: true, message: `PDF '${filename}' generated and downloaded successfully.` };
    } catch (error) {
        console.error("Error generating PDF:", error);
        return { success: false, message: `Failed to generate PDF: ${error instanceof Error ? error.message : String(error)}` };
    }
};
