"use client";
import { useState } from "react";
import { useDropzone } from "react-dropzone";
import { Inbox, Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";
import { storage } from "../firebase";
import { ref, uploadBytesResumable, getDownloadURL, UploadTaskSnapshot } from "firebase/storage";
import { useMutation } from "@tanstack/react-query";
import axios from 'axios'
import { v4 as uuidv4 } from 'uuid';

const FileUpload = () => {
    const [uploading, setUploading] = useState(false);
    const [storeUrl, setStoreUrl] = useState("");

    const { mutate, isPending } = useMutation({
        mutationFn: async ({
            storeUrl
        }: {
            storeUrl: string;
        }) => {
            const response = await axios.post("/api/create-chat", {
                storeUrl
            });

            console.log(response.data)

            return response.data;
        },
    });

    const { getRootProps, getInputProps } = useDropzone({
        accept: { "application/pdf": [".pdf"] },
        maxFiles: 1,
        onDrop: async (acceptedFiles) => {
            const file = acceptedFiles[0];
            const file_key = uuidv4().toString();
            const storageRef = ref(storage, `pdf/${file_key}_${file.name}`);

            if (file.size > 10 * 1024 * 1024) {
                toast.error("File too large");
                return;
            }

            try {
                setUploading(true);
                const uploadTask = uploadBytesResumable(storageRef, file);

                uploadTask.on(
                    "state_changed",
                    (snapshot: UploadTaskSnapshot) => {
                        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                        // You can use this progress value to update a progress bar if needed
                    },
                    (error) => {
                        console.error("Upload failed:", error);
                        toast.error("Upload failed. Please try again.");
                        setUploading(false);
                    },
                );

                await uploadTask;

                const url = await getDownloadURL(ref(storage, `pdf/${file_key}_${file.name}`));
                console.log(url);
                setStoreUrl(url);
                console.log(storeUrl);

                toast.success("File uploaded successfully!");

                if (!file.name || !file_key) {
                    toast("Something went wrong in fileupload");
                    return;
                }

                // Now that we have the URL, we can call mutate
                mutate(
                    { storeUrl: url },  // Use the URL directly instead of the state
                    {
                        onSuccess: ({ data }) => {
                            console.log(data)
                            toast.success("Chat created!");
                        },
                        onError: (err) => {
                            toast.error("Error creating chat");
                            console.error(err);
                        },
                    }
                );

            } catch (error) {
                console.error("Error during file upload:", error);
                toast.error("An error occurred. Please try again.");
            } finally {
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
                {uploading || isPending ? (
                    <>
                        <Loader2 className="h-10 w-10 text-blue-500 animate-spin" />
                        <p className="mt-2 text-sm text-slate-400">
                            Spilling Tea to GPT...
                        </p>
                    </>
                ) : (
                    <>
                        <Inbox className="w-10 h-10 text-blue-500" />
                        <p className="mt-2 text-sm text-slate-400">Drop PDF Here</p>
                    </>
                )}
            </div>
        </div>
    );
};

export default FileUpload;