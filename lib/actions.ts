"use server";

import { EditSchema, UploadSchema } from "./formSchema";
import { del, put } from "@vercel/blob";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getImageById } from "@/lib/data";

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
  const { url } = await put(image.name, image, {
    access: "public",
    multipart: true,
  });

  try {
    await prisma.gallery.create({
      data: {
        title,
        image: url,
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
    await del(data.image);
    const { url } = await put(image.name, image, {
      access: "public",
      multipart: true,
    });
    imagePath = url;
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
  await del(data.image);
  try {
    await prisma.gallery.delete({
      where: { id },
    });
  } catch (error) {
    return { message: "Failed to delete data" };
  }
  revalidatePath("/");
  // redirect("/");
};
