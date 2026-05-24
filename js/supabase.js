import { createClient } from "https://esm.sh/@supabase/supabase-js@2.26.0?target=es2022";

const SUPABASE_URL = "https://ecdkdoorwmldvdhttdeb.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_Iv4nfaMvGO5vQPEPeZHTRg_K8Ji4ee2";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export async function uploadProductImage(file) {
    if (!file) {
        throw new Error("No image file selected.");
    }

    const safeFileName = file.name
        .trim()
        .replace(/\s+/g, "_")
        .replace(/[^a-zA-Z0-9._-]/g, "");
    const filePath = `products/${Date.now()}_${safeFileName}`;

    const { data, error } = await supabase.storage
        .from("products")
        .upload(filePath, file, {
            cacheControl: "3600",
            upsert: false,
            contentType: file.type
        });

    if (error) {
        console.error("Supabase upload error:", error);
        throw new Error(error.message || "Image upload failed.");
    }

    if (!data || !data.path) {
        throw new Error("Upload failed: no file path returned.");
    }

    const { data: publicData, error: publicError } = supabase.storage
        .from("products")
        .getPublicUrl(data.path);

    if (publicError) {
        console.error("Supabase public URL error:", publicError);
        throw new Error(publicError.message || "Unable to get public image URL.");
    }

    if (!publicData?.publicUrl) {
        throw new Error("Unable to get public image URL.");
    }

    return publicData.publicUrl;
}
