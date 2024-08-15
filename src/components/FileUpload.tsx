"use client";
import { useState } from "react";
import { useDropzone } from "react-dropzone";
import { Inbox, Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";
import { storage } from "../firebase";
import { ref, uploadBytesResumable, getDownloadURL, UploadTaskSnapshot } from "firebase/storage";

const FileUpload = () => {
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [downloadURL, setDownloadURL] = useState<string | null>(null); // Store the download URL

    const { getRootProps, getInputProps } = useDropzone({
        accept: { "application/pdf": [".pdf"] },
        maxFiles: 1,
        onDrop: async (acceptedFiles) => {
            const file = acceptedFiles[0];
            if (file.size > 10 * 1024 * 1024) {
                toast.error("File too large");
                return;
            }

            try {
                setUploading(true);

                const storageRef = ref(storage, `pdf/${file.name}`);
                const uploadTask = uploadBytesResumable(storageRef, file);

                uploadTask.on(
                    "state_changed",
                    (snapshot: UploadTaskSnapshot) => {
                        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                        setUploadProgress(progress); // Update progress in state
                    },
                    (error) => {
                        console.error("Upload failed:", error);
                        toast.error("Upload failed. Please try again.");
                        setUploading(false);
                    },
                    async () => {
                        // Use your method with XMLHttpRequest
                        getDownloadURL(ref(storage, `pdf/${file.name}`))
                            .then((url) => {
                                // Use XMLHttpRequest to fetch the file if you want to handle it this way
                                const xhr = new XMLHttpRequest();
                                xhr.responseType = "blob";
                                xhr.onload = () => {
                                    const blob = xhr.response;
                                    console.log("File fetched via XMLHttpRequest:", blob); // Log or use the blob as needed
                                };
                                xhr.open("GET", url);
                                xhr.send();

                                // Set the download URL in state
                                setDownloadURL(url);
                                console.log(url)

                                toast.success("File uploaded successfully!");
                            })
                            .catch((error) => {
                                console.error("Error fetching download URL:", error);
                                toast.error("Failed to retrieve the file URL.");
                            })
                            .finally(() => {
                                setUploading(false);
                                setUploadProgress(0); // Reset progress after completion
                            });
                    }
                );
            } catch (error) {
                console.error("Error during file upload:", error);
                toast.error("An error occurred. Please try again.");
                setUploading(false);
            }
        },
    });

    return (
        <div className="p-2 bg-white rounded-xl">
            <div
                {...getRootProps({
                    className:
                        "border-dashed border-2 rounded-xl cursor-pointer bg-gray-50 py-8 flex justify-center items-center flex-col",
                })}
            >
                <input {...getInputProps()} />
                {uploading ? (
                    <>
                        <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
                        <p className="mt-2 text-sm text-slate-400">{`Uploading... ${uploadProgress.toFixed(0)}%`}</p>
                    </>
                ) : (
                    <>
                        <Inbox className="w-10 h-10 text-blue-500" />
                        <p className="mt-2 text-sm text-slate-400">Drop PDF Here</p>
                    </>
                )}
            </div>
            {/* Display the download URL after upload */}
            {downloadURL && (
                <div className="mt-4 p-2 bg-green-100 rounded text-green-800">
                    <p>
                        File uploaded successfully! Access it{" "}
                        <a href={downloadURL} target="_blank" rel="noopener noreferrer" className="underline">
                            here
                        </a>.
                    </p>
                </div>
            )}
        </div>
    );
};

export default FileUpload;
