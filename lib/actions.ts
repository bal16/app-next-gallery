"use server";

import { EditSchema, UploadSchema } from "./formSchema";
import { createClient } from "@supabase/supabase-js";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getImageById } from "@/lib/data";
import { v4 as uuid } from "uuid";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);
export const uploadImage = async (prevstate: unknown, formData: FormData) => {
  // console.log(formData);
  const validatedField = UploadSchema.safeParse(
    Object.fromEntries(formData.entries())
  );
  if (!validatedField.success) {
    return {
      error: validatedField.error.flatten().fieldErrors,
    };
  }
  const { title, image } = validatedField.data;
  const { data, error } = await supabase.storage
    .from("gallery")
    .upload(uuid(), image);

  if (error) {
    console.log("🚀 ~ uploadImage ~ error:", error.message);
    return {
      message: error.message,
    };
  }
  try {
    await prisma.gallery.create({
      data: {
        title,
        image: data.path,
      },
    });
  } catch (error) {
    return {
      message: "failed to create data",
    };
  }
  revalidatePath("/");
  redirect("/");
};

export const updateImage = async (
  id: string,
  prevstate: unknown,
  formData: FormData
) => {
  // console.log(formData);
  const validatedField = EditSchema.safeParse(
    Object.fromEntries(formData.entries())
  );
  if (!validatedField.success) {
    return {
      error: validatedField.error.flatten().fieldErrors,
    };
  }
  const data = await getImageById(id);
  if (!data) {
    return {
      message: "Data not found",
    };
  }
  const { title, image } = validatedField.data;
  let imagePath;
  if (!image || image.size <= 0) {
    imagePath = data.image;
  } else {
    await supabase.storage.from("gallery").remove([data.image]);
    const { data: supaImage, error } = await supabase.storage
      .from("gallery")
      .upload(image.name, image);

    if (error) {
      return {
        message: error.message,
      };
    }

    imagePath = supaImage!.path;
  }

  try {
    await prisma.gallery.update({
      data: {
        title,
        image: imagePath,
      },
      where: { id },
    });
  } catch (error) {
    return {
      message: "failed to update data",
    };
  }
  revalidatePath("/");
  redirect("/");
};

export const deleteImage = async (id: string) => {
  const data = await getImageById(id);
  if (!data) {
    return {
      message: "Data not found",
    };
  }

  await supabase.storage.from("gallery").remove([data.image]);
  try {
    await prisma.gallery.delete({
      where: { id },
    });
  } catch (error) {
    return { message: "Failed to delete data" };
  }
  revalidatePath("/");
};
