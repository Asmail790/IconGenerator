import StyleSelector from "@/app/generator/_components/style-selector";
import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";



const meta = {
  title: "style selector",
  component: StyleSelector,
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/configure/story-layout
    layout: "fullscreen",
  },
} satisfies Meta<typeof StyleSelector>;

export default meta;

type Story = StoryObj<typeof StyleSelector>;

export const MetallicChosen: Story = {
  args:{
    style:"metallic",
    setStyle:e => {}
  }
};

export const IllustratedChosen: Story = {
  args:{
    style:"illustrated",
    setStyle:e => {}
  }
};




