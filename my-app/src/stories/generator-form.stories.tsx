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


  

export const Story:Story ={
    args:{
        async imageSaver(invalidatedArgs) {
            return {successful:true}
        },
        async imageGenerator(args) {
          const {numberOfImages} = args
            
            const urls = await generator({prompt:"",numberOfImages})
            return {ImageTokensLeft:5,isSuccess:true,imageUrls:urls}
            
        },
        
    }

}