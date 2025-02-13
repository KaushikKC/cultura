import { PinataSDK } from "pinata-web3";

const pinata = new PinataSDK({
  pinataJwt: process.env.REACT_APP_PINATA_JWT,
});

// Function to fetch image data from URL and convert to File object
export async function fetchImageData(url) {
  // List of CORS proxies to try
  const proxyUrls = [
    `https://corsproxy.io/?${encodeURIComponent(url)}`,
    `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(url)}`,
    `https://cors-anywhere.herokuapp.com/${url}`,
  ];

  let lastError;

  // Try each proxy until one works
  for (const proxyUrl of proxyUrls) {
    try {
      console.log("Trying proxy:", proxyUrl);

      const response = await fetch(proxyUrl, {
        headers: {
          Accept: "image/png",
          "X-Requested-With": "XMLHttpRequest",
        },
      });

      if (!response.ok) {
        console.log(`Proxy ${proxyUrl} returned status:`, response.status);
        continue;
      }

      // Get the array buffer directly instead of using blob
      const buffer = await response.arrayBuffer();
      console.log("Successfully received buffer of size:", buffer.byteLength);

      // Convert array buffer to blob
      const blob = new Blob([buffer], { type: "image/png" });
      console.log("Created blob of size:", blob.size);

      if (blob.size === 0) {
        throw new Error("Retrieved blob is empty");
      }

      // Create file object
      const file = new File([blob], "meme.png", {
        type: "image/png",
        lastModified: Date.now(),
      });

      return {
        name: file.name,
        size: file.size,
        type: file.type,
        lastModified: file.lastModified,
        arrayBuffer: () => Promise.resolve(buffer),
      };
    } catch (error) {
      console.log(`Error with proxy ${proxyUrl}:`, error);
      lastError = error;
      continue;
    }
  }

  // If none of the proxies worked, try the fallback canvas approach
  try {
    console.log("All proxies failed, trying canvas approach...");
    return await fetchImageDataWithCanvas(url);
  } catch (error) {
    console.error("Canvas approach also failed:", error);
    throw lastError || error;
  }
}

// Canvas-based fallback approach
async function fetchImageDataWithCanvas(url) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";

    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;

      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0);

      canvas.toBlob((blob) => {
        if (!blob) {
          reject(new Error("Failed to create blob from canvas"));
          return;
        }

        const file = new File([blob], "meme.png", {
          type: "image/png",
          lastModified: Date.now(),
        });

        resolve({
          name: file.name,
          size: file.size,
          type: file.type,
          lastModified: file.lastModified,
          arrayBuffer: () => blob.arrayBuffer(),
        });
      }, "image/png");
    };

    img.onerror = () => {
      reject(new Error("Failed to load image"));
    };

    // Try loading through a different proxy for the Image approach
    img.src = `https://corsproxy.io/?${encodeURIComponent(url)}`;
  });
}

// Function to upload image to IPFS
export async function uploadImageToIPFS(imageFile) {
  try {
    const { IpfsHash } = await pinata.upload.file(imageFile);
    return `https://ipfs.io/ipfs/${IpfsHash}`;
  } catch (error) {
    console.error("Error uploading image to IPFS:", error);
    throw error;
  }
}

export async function uploadJSONToIPFS(jsonMetadata: any): Promise<string> {
  const { IpfsHash } = await pinata.upload.json(jsonMetadata);
  return IpfsHash;
}
