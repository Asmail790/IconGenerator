import type { Meta, StoryObj } from "@storybook/react";
import ImageGeneratorForm from "@/app/generator/_components/image-generator-form";
import { generator } from "@/image-generator/fake.generator";
import { z } from "zod";

import "../app/globals.css"

const meta = {
    title:"image generate form",
    component:ImageGeneratorForm

} satisfies Meta<typeof ImageGeneratorForm>

export default meta
type Story = StoryObj<typeof ImageGeneratorForm>;


const formDataSchema = z.object({
    style: z.string(),
    color: z.string(),
    description: z.string(),
    numberOfImages: z.coerce.number(),
  });


const schema = z
.instanceof(FormData)
.transform((formData) => ({
  style: formData.get("style"),
  color: formData.get("color"),
  description: formData.get("description"),
  numberOfImages: formData.get("numberOfImages"),
}))
.pipe(formDataSchema);
  

export const story:Story ={
    args:{
        async imageSaver(invalidatedArgs) {
            return {successful:true}
        },
        async imageGenerator(_, invalidatedFormData) {
            const {color,description,numberOfImages,style} =schema.parse(invalidatedFormData)
            
            const urls = await generator({prompt:"",numberOfImages})
            return {ImageTokensLeft:5,isSuccess:true,imageProperties:{color,style,description},imageUrls:urls}
            
        },
        
    }

}