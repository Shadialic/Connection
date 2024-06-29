// Initialize Cloudinary
import { Cloudinary } from 'cloudinary-core';

const cloudinary = new Cloudinary({
  cloud_name: "dveis0axa",
  secure: true
});

export const uploadToCloudinary = async (file) => {
  console.log(file, 'file');
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', "Edu-tap"); // Corrected semicolon

  try {
    const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudinary.config().cloud_name}/image/upload`, {
      method: 'POST',
      body: formData
    });

    const data = await response.json();
    console.log(data,'imhhhhhhhhhhhhhhhhhhhhhh');
    if (!response.ok) {
      throw new Error(data.error.message);
    }

    return { url: data.secure_url, public_id: data.public_id };
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    throw error;
  }
};
