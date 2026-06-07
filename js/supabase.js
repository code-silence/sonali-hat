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

function parseSupabasePublicUrl(publicUrl) {
    if (!publicUrl) {
        throw new Error("No public URL provided for storage deletion.");
    }

    const url = new URL(publicUrl);
    const storagePrefix = "/storage/v1/object/public/";
    const pathIndex = url.pathname.indexOf(storagePrefix);

    if (pathIndex === -1) {
        throw new Error("Invalid Supabase public URL format.");
    }

    const afterPublic = url.pathname.slice(pathIndex + storagePrefix.length);
    const segments = afterPublic.split("/");

    if (segments.length < 2) {
        throw new Error("Unable to parse bucket and file path from public URL.");
    }

    const bucket = segments.shift();
    const filePath = decodeURIComponent(segments.join("/"));

    if (!bucket || !filePath) {
        throw new Error("Invalid parsed storage bucket or file path.");
    }

    return { bucket, filePath };
}

export async function deleteProductImage(publicUrl) {
    const { bucket, filePath } = parseSupabasePublicUrl(publicUrl);

    const { data, error } = await supabase.storage.from(bucket).remove([filePath]);

    if (error) {
        console.error("Supabase storage remove error:", error);
        throw new Error(error.message || "Failed to delete image from Supabase storage.");
    }

    return data;
}
