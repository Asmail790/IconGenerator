import type { Meta, StoryObj } from "@storybook/react";
import ColorSelector from "../app/generator/_components/color-selector";
import { useState } from "react";

const meta = {
  title: "color picker",
  component: ColorSelector,
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/configure/story-layout
    layout: "fullscreen",
  },
} satisfies Meta<typeof ColorSelector>;

export default meta;

type Story = StoryObj<typeof ColorSelector>;

export const blackAsDefault: Story = {
  args:{
    color:"black",
    setColor:(e) => {}
  }
};

export const redAsDefault: Story = {
  args:{
    color:"red",
    setColor:(e) => {}
  }
};


