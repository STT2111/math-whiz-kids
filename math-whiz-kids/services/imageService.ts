import html2canvas from 'html2canvas';

export const generateQuizImage = async (element: HTMLElement, fileName: string) => {
    if (!element) {
        console.error("Element for image generation not found.");
        return;
    }

    try {
        const canvas = await html2canvas(element, {
            scale: 2, // for higher resolution
            useCORS: true,
            backgroundColor: null, // Use element's background color
            logging: false,
        });
        const image = canvas.toDataURL('image/png', 1.0);
        const link = document.createElement('a');
        link.href = image;
        link.download = `${fileName}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    } catch (error) {
        console.error("Error generating image:", error);
        alert('Could not generate the image. Please try again.');
    }
};
