"use client";
import { uploadImage } from "@/lib/actions";
import { useFormState } from "react-dom";
import { SubmitButton } from "@/components/button";

const CreateForm = () => {
  const [state, formAction] = useFormState(uploadImage, null);
  return (
    <form action={formAction}>
      <div className="mb-4 pt-2">
        <input
          type="text"
          name="title"
          className="py-2 px-4 rounded-sm border border-gray-400 w-full"
          placeholder="Title"
        />
        <div aria-live="polite" aria-atomic="true">
          <p className="text-sm text-red-500 mt-2">{state?.error?.title}</p>
        </div>
      </div>
      <div className="mb-4 pt-2">
        <input
          type="file"
          name="image"
          className="file:py-2 file:px-4 file:rounded-sm file:mr-4 file:bg-gray-200 file:border-0 hover:file:bg-gray-300 file:cursor-pointer border border-gray-400 w-full"
        />
        <div aria-live="polite" aria-atomic="true">
          <p className="text-sm text-red-500 mt-2">{state?.error?.image}</p>
        </div>
      </div>
      <div className="mb-4 pt-4">
        <SubmitButton label="upload" />
      </div>
    </form>
  );
};

export default CreateForm;
