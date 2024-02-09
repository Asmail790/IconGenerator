import type { Meta, StoryObj } from "@storybook/react";
import { Collection } from "@/app/collection/_components/collection";
import fire_image from  "../../public/fire_thumbnail.png"

const meta = {
  title: "collection",
  component: Collection,
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/configure/story-layout
    layout: "fullscreen",
  },
} satisfies Meta<typeof Collection>;

export default meta;

type Story = StoryObj<typeof Collection>;

const oneImagedata = {url:fire_image.src,description:"A icon for repair shop",style:"style",color:"black"}
const fewImages = Array(5).fill(oneImagedata)
export const FewImages: Story = {
  args:{data:fewImages}
};

const manyImages = Array(25).fill(oneImagedata)
export const ManyImages: Story = {
    args:{data:manyImages}
  };


