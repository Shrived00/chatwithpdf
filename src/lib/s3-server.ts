import fs from 'fs';
import path from 'path';
import os from 'os'; // Import the os module
import axios from 'axios';

export async function downloadFromS3(url: string): Promise<string | null> {
    try {
        // Log the download URL for debugging
        console.log("Download URL:", url);

        // Fetch the file from the URL using axios
        const response = await axios.get(url, { responseType: 'arraybuffer' });
        const buffer = Buffer.from(response.data);

        // Determine the file path based on the operating system
        let fileNameToSave: string;

        if (os.platform() === "win32") {
            fileNameToSave = path.join(
                `C:\\Users\\${os.userInfo().username}\\AppData\\Local\\Temp`,
                `pdf-${Date.now()}.pdf`
            );
        } else {
            fileNameToSave = path.join('/tmp', `pdf-${Date.now()}.pdf`);
        }

        // Save the file locally
        fs.writeFileSync(fileNameToSave, buffer);

        // Log the file path where it was saved
        console.log("File saved to:", fileNameToSave);
        return fileNameToSave;
    } catch (error) {
        // Log any errors encountered during the process
        console.error("Error downloading file:", error);
        return null;
    }
}
