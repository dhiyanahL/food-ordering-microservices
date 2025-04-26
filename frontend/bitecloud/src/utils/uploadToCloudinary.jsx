export const uploadToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "restaurant_uploads"); // your unsigned preset name
  
    const res = await fetch("https://api.cloudinary.com/v1_1/douchcxb1/image/upload", {
      method: "POST",
      body: formData,
    });
  
    const data = await res.json();
    return data.secure_url; // this is the final image URL
  };
  