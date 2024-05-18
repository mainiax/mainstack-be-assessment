import { UploadApiOptions } from "cloudinary";
import cloudinary from "../config/cloudinary.config";
import { cloudinaryFileUploader } from "./cloudinary-uploader";

jest.mock("../config/cloudinary.config", () => ({
  uploader: {
    upload: jest.fn(),
  },
}));

describe("cloudinaryFileUploader", () => {
  const mockUpload = cloudinary.uploader.upload as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should upload a file successfully", async () => {
    const mockFile = "path/to/file.jpg";
    const mockOptions: UploadApiOptions = { folder: "test_folder" };
    const mockResponse = { url: "http://example.com/image.jpg" };

    mockUpload.mockResolvedValue(mockResponse);

    const result = await cloudinaryFileUploader(mockFile, mockOptions);

    expect(mockUpload).toHaveBeenCalledWith(mockFile, mockOptions);
    expect(result).toEqual(mockResponse);
  });

  it("should handle errors during file upload", async () => {
    const mockFile = "path/to/file.jpg";
    const mockOptions: UploadApiOptions = { folder: "test_folder" };
    const mockError = new Error("Upload failed");

    mockUpload.mockRejectedValue(mockError);

    await expect(cloudinaryFileUploader(mockFile, mockOptions)).rejects.toThrow(
      "Upload failed"
    );

    expect(mockUpload).toHaveBeenCalledWith(mockFile, mockOptions);
  });
});
