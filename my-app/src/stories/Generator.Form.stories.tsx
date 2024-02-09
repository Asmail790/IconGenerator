import type { Meta, StoryObj } from "@storybook/react";
import GeneratorForm from "@/app/generator/_components/form";
import { generator } from "@/image-generator/fake.generator";
import { z } from "zod";

import "../app/globals.css"

const meta = {
    title:"image generate form",
    component:GeneratorForm

} satisfies Meta<typeof GeneratorForm>

export default meta
type Story = StoryObj<typeof GeneratorForm>;


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
            console.log(color,description,numberOfImages,style)
            
            const urls = await generator({prompt:"",numberOfImages})
            return {isSuccess:true,imageProperties:{color,style,description},imageUrls:urls}
            
        },
        
    }

}