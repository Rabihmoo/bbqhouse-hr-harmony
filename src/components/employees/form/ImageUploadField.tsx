
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ImageUploadFieldProps {
  picture: string;
  onImageChange: (imageUrl: string) => void;
}

const ImageUploadField = ({ picture, onImageChange }: ImageUploadFieldProps) => {
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      // In a real app, you would upload this file to your server
      // For now, we'll just create a URL for preview
      const imageUrl = URL.createObjectURL(e.target.files[0]);
      
      onImageChange(imageUrl);
      
      toast({
        title: "Picture uploaded",
        description: "Employee picture has been uploaded successfully.",
      });
    }
  };

  return (
    <div className="grid gap-4">
      <Label>Employee Picture</Label>
      <div className="flex items-center gap-4">
        {picture && (
          <div className="h-20 w-20 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
            <img 
              src={picture} 
              alt="Employee" 
              className="h-full w-full object-cover"
            />
          </div>
        )}
        <label htmlFor="picture-upload" className="cursor-pointer">
          <div className="flex items-center gap-2 px-4 py-2 rounded-md bg-secondary text-secondary-foreground hover:bg-secondary/80">
            <Upload className="h-4 w-4" />
            <span>Upload Picture</span>
          </div>
          <input 
            id="picture-upload" 
            type="file" 
            accept="image/*" 
            className="hidden" 
            onChange={handleFileChange}
          />
        </label>
      </div>
    </div>
  );
};

export default ImageUploadField;
