
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "Edu-tap");
      const cloudinaryResponse = await fetch(
        "https://api.cloudinary.com/v1_1/dveis0axa/video/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!cloudinaryResponse.ok) {
        throw new Error(
          `Failed to upload video. Status: ${cloudinaryResponse.status}`
        );
      }
      const cloudinaryData = await cloudinaryResponse.json();
      if (cloudinaryData.error) {
        console.log(cloudinaryData.error);
        return;
      }
      const uploadedVideoUrl = cloudinaryData.secure_url;
      return uploadedVideoUrl;
    } catch (error) {
      console.log("Error during video upload:", error);
    }
  };